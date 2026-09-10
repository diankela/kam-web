export type MoodTrackingRecord = {
    id: number;
    estado_animo: number;
    interes: number | null;
    energia: number | null;
    funcionamiento: number | null;
    conexion_social: number | null;
    calidad_sueno: number | null;
    horas_sueno: number | null;
    nota: string | null;
    registrado_en: string;
};

export type MoodTrackingSummary = {
    totalRecords: number;
    averageMood: number | null;
    averageInterest: number | null;
    averageEnergy: number | null;
    averageFunctioning: number | null;
    averageSocialConnection: number | null;
    averageSleepQuality: number | null;
    averageSleepHours: number | null;
};

export type DailyMoodTrackingPoint = {
    date: string;
    value: number;
    recordCount: number;
};

export const EMPTY_MOOD_TRACKING_SUMMARY:
    MoodTrackingSummary = {
        totalRecords: 0,
        averageMood: null,
        averageInterest: null,
        averageEnergy: null,
        averageFunctioning: null,
        averageSocialConnection: null,
        averageSleepQuality: null,
        averageSleepHours: null,
    };

function isValidScaleValue(
    value: number | null,
): value is number {
    return (
        typeof value === "number" &&
        Number.isFinite(value) &&
        value >= 1 &&
        value <= 10
    );
}

function isValidSleepHours(
    value: number | null,
): value is number {
    return (
        typeof value === "number" &&
        Number.isFinite(value) &&
        value >= 0 &&
        value <= 24
    );
}

function calculateAverage(
    values: number[],
): number | null {
    if (values.length === 0) {
        return null;
    }

    const total = values.reduce(
        (sum, value) => sum + value,
        0,
    );

    return (
        Math.round(
            (total / values.length) * 10,
        ) / 10
    );
}

export function calculateMoodTrackingSummary(
    
    records: MoodTrackingRecord[],
): MoodTrackingSummary {
    const validMoodRecords = records.filter(
        (record) =>
            isValidScaleValue(
                record.estado_animo,
            ),
    );

    if (validMoodRecords.length === 0) {
        return EMPTY_MOOD_TRACKING_SUMMARY;
    }

    return {
        totalRecords: validMoodRecords.length,

        averageMood: calculateAverage(
            validMoodRecords.map(
                (record) => record.estado_animo,
            ),
        ),

        averageInterest: calculateAverage(
            validMoodRecords
                .map((record) => record.interes)
                .filter(isValidScaleValue),
        ),

        averageEnergy: calculateAverage(
            validMoodRecords
                .map((record) => record.energia)
                .filter(isValidScaleValue),
        ),

        averageFunctioning: calculateAverage(
            validMoodRecords
                .map(
                    (record) =>
                        record.funcionamiento,
                )
                .filter(isValidScaleValue),
        ),

        averageSocialConnection: calculateAverage(
            validMoodRecords
                .map(
                    (record) =>
                        record.conexion_social,
                )
                .filter(isValidScaleValue),
        ),

        averageSleepQuality: calculateAverage(
            validMoodRecords
                .map(
                    (record) =>
                        record.calidad_sueno,
                )
                .filter(isValidScaleValue),
        ),

        averageSleepHours: calculateAverage(
            validMoodRecords
                .map(
                    (record) =>
                        record.horas_sueno,
                )
                .filter(isValidSleepHours),
        ),
    };
}
const SANTIAGO_DATE_FORMATTER =
    new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Santiago",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

function getSantiagoDate(
    timestampValue: string,
): string | null {
    const timestamp = new Date(timestampValue);

    if (Number.isNaN(timestamp.getTime())) {
        return null;
    }

    const dateParts = Object.fromEntries(
        SANTIAGO_DATE_FORMATTER
            .formatToParts(timestamp)
            .map(({ type, value }) => [
                type,
                value,
            ]),
    );

    const year = dateParts.year;
    const month = dateParts.month;
    const day = dateParts.day;

    if (!year || !month || !day) {
        return null;
    }

    return `${year}-${month}-${day}`;
}

export function calculateDailyMoodTracking(
    records: MoodTrackingRecord[],
): DailyMoodTrackingPoint[] {
    const dailyValues = new Map<
        string,
        number[]
    >();

    for (const record of records) {
        if (
            !isValidScaleValue(
                record.estado_animo,
            )
        ) {
            continue;
        }

        const localDate = getSantiagoDate(
            record.registrado_en,
        );

        if (!localDate) {
            continue;
        }

        const currentValues =
            dailyValues.get(localDate) ?? [];

        currentValues.push(
            record.estado_animo,
        );

        dailyValues.set(
            localDate,
            currentValues,
        );
    }

    return [...dailyValues.entries()]
        .sort(([firstDate], [secondDate]) =>
            firstDate.localeCompare(secondDate),
        )
        .map(([date, values]) => ({
            date,
            value:
                calculateAverage(values) ?? 0,
            recordCount: values.length,
        }));
}
export function filterMoodTrackingByDateRange(
    records: MoodTrackingRecord[],
    startDate: string,
    endDate: string,
): MoodTrackingRecord[] {
    return records.filter((record) => {
        const localDate = getSantiagoDate(
            record.registrado_en,
        );

        return (
            localDate !== null &&
            localDate >= startDate &&
            localDate < endDate
        );
    });
}