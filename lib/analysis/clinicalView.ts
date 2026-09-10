export type ClinicalAnalysisView =
    | "ansiedad"
    | "animo";

export function resolveClinicalAnalysisView(
    value: string | string[] | undefined,
): ClinicalAnalysisView {
    return value === "animo"
        ? "animo"
        : "ansiedad";
}