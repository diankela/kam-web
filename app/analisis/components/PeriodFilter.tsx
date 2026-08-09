import Link from "next/link";

import type { AnalysisPeriod } from "@/lib/analysis/analysisPeriod";

type PeriodFilterProps = {
    activePeriod: AnalysisPeriod;
};

const PERIOD_OPTIONS = [
    {
        id: "30",
        label: "Últimos 30 días",
        href: "/analisis?periodo=30",
    },
    {
        id: "90",
        label: "Últimos 90 días",
        href: "/analisis?periodo=90",
    },
    {
        id: "todo",
        label: "Todo el historial",
        href: "/analisis",
    },
] as const;

export default function PeriodFilter({
    activePeriod,
}: PeriodFilterProps) {
    return (
        <div className="mt-8 border-t border-kam-gray pt-6">
            <p className="text-sm font-bold uppercase tracking-wide text-kam-wine">
                Período de análisis
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
                {PERIOD_OPTIONS.map((option) => {
                    const isActive =
                        option.id === activePeriod;

                    return (
                        <Link
                            key={option.id}
                            aria-current={
                                isActive
                                    ? "page"
                                    : undefined
                            }
                            className={`rounded border px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                                isActive
                                    ? "border-kam-navy bg-kam-navy text-kam-white"
                                    : "border-kam-gray bg-kam-gray text-kam-navy hover:border-kam-blue hover:bg-kam-blue hover:text-kam-white"
                            }`}
                            href={option.href}
                        >
                            {option.label}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}