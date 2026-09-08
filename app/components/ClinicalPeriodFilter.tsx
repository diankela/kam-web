import Link from "next/link";

import MonthYearFilter from "@/app/eventos/components/MonthYearFilter";
import { ClinicalPeriodMode } from "@/lib/analysis/clinicalPeriod";

type ClinicalPeriodFilterProps = {
    activeMode: ClinicalPeriodMode;
    basePath: "/analisis" | "/profesional";
    patientId?: string;
    selectedMonth: number;
    selectedYear: number;
    years: number[];
};

const linkClassName =
    "rounded border px-4 py-2 text-sm font-semibold transition-colors duration-200";

export default function ClinicalPeriodFilter({
    activeMode,
    basePath,
    patientId,
    selectedMonth,
    selectedYear,
    years,
}: ClinicalPeriodFilterProps) {
    function buildHref(period?: "3" | "6") {
        const searchParams =
            new URLSearchParams();

        if (patientId) {
            searchParams.set(
                "paciente",
                patientId,
            );
        }

        if (period) {
            searchParams.set(
                "periodo",
                period,
            );
        }

        const query = searchParams.toString();

        return query
            ? `${basePath}?${query}`
            : basePath;
    }

    const currentMonthHref = buildHref();

    const quickOptions = [
        {
            id: "current",
            label: "Mes actual",
            href: currentMonthHref,
        },
        {
            id: "3",
            label: "Últimos 3 meses",
            href: buildHref("3"),
        },
        {
            id: "6",
            label: "Últimos 6 meses",
            href: buildHref("6"),
        },
    ] as const;

    return (
        <section className="mt-8 rounded-xl bg-kam-white p-6 shadow-[0_16px_45px_rgba(15,36,96,0.10)] sm:p-8">
            <p className="text-sm font-bold uppercase tracking-wider text-kam-blue">
                Período de consulta
            </p>

            <h2 className="mt-2 text-2xl font-bold text-kam-navy">
                Selecciona el período clínico
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-kam-navy/70">
                El período seleccionado se aplicará al
                bienestar, la ansiedad, las dosis y los
                eventos.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
                {quickOptions.map((option) => {
                    const isActive =
                        option.id === activeMode;

                    return (
                        <Link
                            key={option.id}
                            aria-current={
                                isActive
                                    ? "page"
                                    : undefined
                            }
                            className={`${linkClassName} ${
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

            <div className="mt-6 border-t border-kam-navy/10 pt-6">
                <p className="text-sm font-bold uppercase tracking-wide text-kam-wine">
                    Consultar un mes específico
                </p>

                <MonthYearFilter
                    patientId={patientId}
                    resetHref={currentMonthHref}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    showReset={false}
                    years={years}
                />
            </div>
        </section>
    );
}