export type ClinicalPeriodMode =
    | "current"
    | "3"
    | "6"
    | "month";

type ClinicalPeriodParams = {
    month?: string | string[];
    period?: string | string[];
    year?: string | string[];
    currentDate?: Date;
};

type MonthCoordinates = {
    month: number;
    year: number;
};

function getFirstValue(
    value: string | string[] | undefined,
) {
    return Array.isArray(value)
        ? value[0]
        : value;
}

function shiftMonth(
    year: number,
    month: number,
    offset: number,
): MonthCoordinates {
    const shiftedDate = new Date(
        Date.UTC(
            year,
            month - 1 + offset,
            1,
        ),
    );

    return {
        year: shiftedDate.getUTCFullYear(),
        month: shiftedDate.getUTCMonth() + 1,
    };
}

function formatMonthStart({
    year,
    month,
}: MonthCoordinates) {
    return `${year}-${String(month).padStart(
        2,
        "0",
    )}-01`;
}

function formatPeriodLabel(
    start: MonthCoordinates,
    end: MonthCoordinates,
) {
    const formatter = new Intl.DateTimeFormat(
        "es-CL",
        {
            timeZone: "UTC",
            month: "long",
            year: "numeric",
        },
    );

    const startLabel = formatter.format(
        new Date(
            Date.UTC(
                start.year,
                start.month - 1,
                1,
            ),
        ),
    );

    const lastIncludedMonth = shiftMonth(
        end.year,
        end.month,
        -1,
    );

    const endLabel = formatter.format(
        new Date(
            Date.UTC(
                lastIncludedMonth.year,
                lastIncludedMonth.month - 1,
                1,
            ),
        ),
    );

    return startLabel === endLabel
        ? startLabel
        : `${startLabel} a ${endLabel}`;
}

export function resolveClinicalPeriod({
    month,
    period,
    year,
    currentDate = new Date(),
}: ClinicalPeriodParams) {
    const chileDateParts = Object.fromEntries(
        new Intl.DateTimeFormat("en-US", {
            timeZone: "America/Santiago",
            year: "numeric",
            month: "2-digit",
        })
            .formatToParts(currentDate)
            .map(({ type, value }) => [
                type,
                value,
            ]),
    );

    const currentYear = Number(
        chileDateParts.year,
    );

    const currentMonth = Number(
        chileDateParts.month,
    );

    const requestedMonth = Number(
        getFirstValue(month),
    );

    const requestedYear = Number(
        getFirstValue(year),
    );

    const requestedPeriod =
        getFirstValue(period);

    const validRequestedMonth =
        Number.isInteger(requestedMonth) &&
        requestedMonth >= 1 &&
        requestedMonth <= 12;

    const validRequestedYear =
        Number.isInteger(requestedYear) &&
        requestedYear >= 2000 &&
        requestedYear <= currentYear;

    const requestedDateIsNotFuture =
        requestedYear < currentYear ||
        (requestedYear === currentYear &&
            requestedMonth <= currentMonth);

    const hasCustomMonth =
        validRequestedMonth &&
        validRequestedYear &&
        requestedDateIsNotFuture;

    let activeMode: ClinicalPeriodMode =
        "current";

    let start: MonthCoordinates = {
        year: currentYear,
        month: currentMonth,
    };

    let end = shiftMonth(
        currentYear,
        currentMonth,
        1,
    );

    if (hasCustomMonth) {
        activeMode = "month";

        start = {
            year: requestedYear,
            month: requestedMonth,
        };

        end = shiftMonth(
            requestedYear,
            requestedMonth,
            1,
        );
    } else if (requestedPeriod === "3") {
        activeMode = "3";

        start = shiftMonth(
            currentYear,
            currentMonth,
            -2,
        );
    } else if (requestedPeriod === "6") {
        activeMode = "6";

        start = shiftMonth(
            currentYear,
            currentMonth,
            -5,
        );
    }

    return {
        activeMode,
        currentMonth,
        currentYear,
        selectedMonth:
            activeMode === "month"
                ? requestedMonth
                : currentMonth,
        selectedYear:
            activeMode === "month"
                ? requestedYear
                : currentYear,
        startDate: formatMonthStart(start),
        endDate: formatMonthStart(end),
        periodLabel: formatPeriodLabel(
            start,
            end,
        ),
    };
}