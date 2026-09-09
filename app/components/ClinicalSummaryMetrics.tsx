type ClinicalSummaryMetricsProps = {
    averageAnxiety: number | null;
    averageAnxietyError: boolean;
    formattedTotalDose: string | null;
    periodEvents: number;
    periodEventsError: boolean;
    periodLabel: string;
    totalDoseError: boolean;
    totalEvents: number | null;
    totalEventsError: boolean;
};

export default function ClinicalSummaryMetrics({
    averageAnxiety,
    averageAnxietyError,
    formattedTotalDose,
    periodEvents,
    periodEventsError,
    periodLabel,
    totalDoseError,
    totalEvents,
    totalEventsError,
}: ClinicalSummaryMetricsProps) {
    return (
        <section
            aria-label="Resumen clínico del período"
            className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4"
        >
            <div className="border-l-4 border-kam-magenta bg-kam-white px-5 py-4 shadow-[0_10px_30px_rgba(15,36,96,0.08)]">
                <p className="text-xs font-bold uppercase tracking-wider text-kam-wine">
                    Dosis del período
                </p>

                {totalDoseError ? (
                    <p className="mt-2 font-semibold text-kam-navy">
                        No disponible
                    </p>
                ) : formattedTotalDose === null ? (
                    <p className="mt-2 font-semibold text-kam-navy">
                        Sin datos
                    </p>
                ) : (
                    <p className="mt-2 text-4xl font-bold text-kam-navy">
                        {formattedTotalDose}

                        <span className="ml-1 text-lg font-semibold text-kam-navy/70">
                            mg
                        </span>
                    </p>
                )}

                <p className="mt-2 text-sm text-kam-wine">
                    Acumulado de {periodLabel}
                </p>
            </div>

            <div className="border-l-4 border-kam-blue bg-kam-navy px-5 py-4 text-kam-white shadow-[0_10px_30px_rgba(15,36,96,0.12)]">
                <p className="text-xs font-bold uppercase tracking-wider text-kam-white/70">
                    Eventos registrados
                </p>

                {totalEventsError ? (
                    <p className="mt-2 font-semibold">
                        No disponible
                    </p>
                ) : (
                    <p className="mt-2 text-4xl font-bold">
                        {totalEvents ?? 0}
                    </p>
                )}

                <p className="mt-2 text-sm text-kam-white/70">
                    Historial completo del paciente.
                </p>
            </div>

            <div className="border-l-4 border-kam-magenta bg-kam-blue px-5 py-4 text-kam-white shadow-[0_10px_30px_rgba(0,122,255,0.12)]">
                <p className="text-xs font-bold uppercase tracking-wider text-kam-white/70">
                    Eventos del período
                </p>

                {periodEventsError ? (
                    <p className="mt-2 font-semibold">
                        No disponible
                    </p>
                ) : (
                    <p className="mt-2 text-4xl font-bold">
                        {periodEvents}
                    </p>
                )}

                <p className="mt-2 text-sm text-kam-white/70">
                    {periodLabel}
                </p>
            </div>

            <div className="border-l-4 border-kam-magenta bg-kam-wine px-5 py-4 text-kam-white shadow-[0_10px_30px_rgba(159,24,83,0.14)]">
                <p className="text-xs font-bold uppercase tracking-wider text-kam-white/70">
                    Ansiedad promedio
                </p>

                {averageAnxietyError ? (
                    <p className="mt-2 font-semibold">
                        No disponible
                    </p>
                ) : averageAnxiety === null ? (
                    <p className="mt-2 font-semibold">
                        Sin datos
                    </p>
                ) : (
                    <p className="mt-2 text-4xl font-bold">
                        {averageAnxiety.toFixed(1)}

                        <span className="ml-1 text-lg font-semibold text-kam-white/80">
                            /10
                        </span>
                    </p>
                )}

                <p className="mt-2 text-sm text-kam-white/70">
                    Promedio de {periodLabel}
                </p>
            </div>
        </section>
    );
}