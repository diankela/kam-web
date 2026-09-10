import Link from "next/link";

import type {
    ClinicalPeriodMode,
} from "@/lib/analysis/clinicalPeriod";
import type {
    ClinicalAnalysisView,
} from "@/lib/analysis/clinicalView";

type ClinicalAnalysisMenuProps = {
    activeView: ClinicalAnalysisView;
    activeMode: ClinicalPeriodMode;
    basePath: "/analisis" | "/profesional";
    patientId?: string;
    selectedMonth: number;
    selectedYear: number;
};

const menuOptions: {
    value: ClinicalAnalysisView;
    title: string;
    description: string;
}[] = [
    {
        value: "ansiedad",
        title: "Ansiedad",
        description:
            "Eventos, intensidad, medicamentos, síntomas y emociones asociadas.",
    },
    {
        value: "animo",
        title: "Estado de ánimo",
        description:
            "Ánimo, interés, energía, funcionamiento, conexión social y sueño.",
    },
];

export default function ClinicalAnalysisMenu({
    activeView,
    activeMode,
    basePath,
    patientId,
    selectedMonth,
    selectedYear,
}: ClinicalAnalysisMenuProps) {
    function buildHref(
        view: ClinicalAnalysisView,
    ) {
        const searchParams =
            new URLSearchParams();

        if (patientId) {
            searchParams.set(
                "paciente",
                patientId,
            );
        }

        searchParams.set("vista", view);

        if (
            activeMode === "3" ||
            activeMode === "6"
        ) {
            searchParams.set(
                "periodo",
                activeMode,
            );
        }

        if (activeMode === "month") {
            searchParams.set(
                "month",
                String(selectedMonth),
            );

            searchParams.set(
                "year",
                String(selectedYear),
            );
        }

        return `${basePath}?${searchParams.toString()}`;
    }

    return (
        <section className="mt-8 rounded-xl bg-kam-white p-6 shadow-[0_16px_45px_rgba(15,36,96,0.10)] sm:p-8">
            <p className="text-sm font-bold uppercase tracking-wider text-kam-blue">
                Área de análisis
            </p>

            <h2 className="mt-2 text-2xl font-bold text-kam-navy">
                Selecciona el seguimiento
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-kam-navy/70">
                Los registros de ansiedad y del estado de ánimo
                se presentan por separado para facilitar su
                lectura.
            </p>

            <nav
                aria-label="Tipo de análisis clínico"
                className="mt-6 grid gap-4 md:grid-cols-2"
            >
                {menuOptions.map((option) => {
                    const isActive =
                        option.value === activeView;

                    return (
                        <Link
                            key={option.value}
                            aria-current={
                                isActive
                                    ? "page"
                                    : undefined
                            }
                            className={`rounded-xl border p-5 transition ${
                                isActive
                                    ? "border-kam-blue bg-kam-blue text-kam-white shadow-[0_8px_25px_rgba(0,122,255,0.18)]"
                                    : "border-kam-navy/15 bg-kam-gray text-kam-navy hover:border-kam-blue"
                            }`}
                            href={buildHref(
                                option.value,
                            )}
                        >
                            <span className="block text-lg font-bold">
                                {option.title}
                            </span>

                            <span
                                className={`mt-2 block text-sm leading-6 ${
                                    isActive
                                        ? "text-kam-white/80"
                                        : "text-kam-navy/65"
                                }`}
                            >
                                {option.description}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </section>
    );
}