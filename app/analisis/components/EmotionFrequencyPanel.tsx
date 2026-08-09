import type { EmotionFrequencySummary } from "@/lib/analysis/countEmotionFrequencies";

type EmotionFrequencyPanelProps = {
    summary: EmotionFrequencySummary;
};

const WORD_COLORS = [
    "#C60B7E",
    "#9F1853",
    "#0f2460",
];

export default function EmotionFrequencyPanel({
    summary,
}: EmotionFrequencyPanelProps) {
    const maxCount = Math.max(
        ...summary.items.map((item) => item.count),
        1,
    );

    return (
        <section className="mt-8 rounded-xl bg-kam-white p-8 shadow-[0_16px_45px_rgba(15,36,96,0.12)]">
            <p className="text-sm font-bold uppercase tracking-wider text-kam-blue">
                Análisis emocional
            </p>

            <h2 className="mt-2 text-2xl font-bold text-kam-navy">
                Estados emocionales registrados con mayor
                frecuencia
            </h2>

            <p className="mt-3 max-w-3xl leading-6 text-kam-navy/70">
                Esta visualización resume las emociones
                seleccionadas en los registros. Su finalidad
                es facilitar la identificación de patrones y
                no representa una evaluación clínica.
            </p>

            {summary.items.length === 0 ? (
                <div className="mt-8 rounded-lg bg-kam-gray px-6 py-10 text-center text-kam-navy/70">
                    Todavía no existen estados emocionales
                    registrados para analizar.
                </div>
            ) : (
                <div className="mt-8 grid gap-8 lg:grid-cols-2">
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wide text-kam-wine">
                            Vista rápida
                        </h3>

                        <div className="mt-4 flex min-h-72 flex-wrap items-center justify-center gap-x-5 gap-y-3 rounded-lg bg-kam-gray p-7 text-center">
                            {summary.items.map(
                                (item, index) => {
                                    const ratio =
                                        item.count /
                                        maxCount;

                                    return (
                                        <span
                                            key={item.id}
                                            className="leading-none"
                                            style={{
                                                color: WORD_COLORS[
                                                    index %
                                                        WORD_COLORS.length
                                                ],
                                                fontSize: `${
                                                    16 +
                                                    ratio * 28
                                                }px`,
                                                fontWeight:
                                                    ratio >= 0.6
                                                        ? 700
                                                        : 600,
                                            }}
                                            title={`${item.count} eventos · ${item.percentage}%`}
                                        >
                                            {item.label}
                                        </span>
                                    );
                                },
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wide text-kam-wine">
                            Frecuencias exactas
                        </h3>

                        <div className="mt-4 space-y-4">
                            {summary.items.map((item) => (
                                <div key={item.id}>
                                    <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                                        <span className="font-semibold text-kam-navy">
                                            {item.label}
                                        </span>

                                        <span className="shrink-0 text-kam-navy/70">
                                            {item.count} ·{" "}
                                            {item.percentage}%
                                        </span>
                                    </div>

                                    <div className="h-2 overflow-hidden rounded-full bg-kam-gray">
                                        <div
                                            aria-label={`${item.label}: ${item.count} eventos`}
                                            className="h-full rounded-full bg-kam-blue"
                                            style={{
                                                width: `${
                                                    (item.count /
                                                        maxCount) *
                                                    100
                                                }%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8 border-t border-kam-gray pt-4 text-xs leading-5 text-kam-navy/60">
                <p>
                    Se analizaron {summary.analyzedEvents} de{" "}
                    {summary.totalEvents} eventos disponibles.
                </p>

                <p>
                    Un mismo evento puede contener más de una
                    emoción.
                </p>
            </div>
        </section>
    );
}