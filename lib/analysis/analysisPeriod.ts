export const ANALYSIS_PERIODS = [
    "30",
    "90",
    "todo",
] as const;

export type AnalysisPeriod =
    (typeof ANALYSIS_PERIODS)[number];

const PERIOD_DAYS: Record<
    Exclude<AnalysisPeriod, "todo">,
    number
> = {
    "30": 30,
    "90": 90,
};

export function parseAnalysisPeriod(
    value: string | string[] | undefined,
): AnalysisPeriod {
    const selectedValue = Array.isArray(value)
        ? value[0]
        : value;

    return ANALYSIS_PERIODS.includes(
        selectedValue as AnalysisPeriod,
    )
        ? (selectedValue as AnalysisPeriod)
        : "todo";
}

export function getAnalysisStartDate(
    period: AnalysisPeriod,
    currentDate = new Date(),
) {
    if (period === "todo") {
        return null;
    }

    const dateParts = Object.fromEntries(
        new Intl.DateTimeFormat("en-US", {
            timeZone: "America/Santiago",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        })
            .formatToParts(currentDate)
            .map(({ type, value }) => [
                type,
                value,
            ]),
    );

    const chileDate = new Date(
        Date.UTC(
            Number(dateParts.year),
            Number(dateParts.month) - 1,
            Number(dateParts.day),
        ),
    );

    chileDate.setUTCDate(
        chileDate.getUTCDate() -
            (PERIOD_DAYS[period] - 1),
    );

    return chileDate.toISOString().slice(0, 10);
}