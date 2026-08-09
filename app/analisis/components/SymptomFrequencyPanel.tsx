import type {
    SymptomFrequencySummary,
} from "@/lib/analysis/countSymptomFrequencies";

type SymptomFrequencyPanelProps = {
    summary: SymptomFrequencySummary;
};

const WORD_COLORS = [
    "#007aff",
    "#0f2460",
];

export default function SymptomFrequencyPanel({
    summary,
}: SymptomFrequencyPanelProps) {
    const visibleWords = summary.items.slice(0, 20);
    const exactFrequencies = summary.items.slice(0, 10);

    const maximumCount = Math.max(
        ...summary.items.map((item) => item.count),
        1,
    );

    return (
        <section className="mt-8 rounded-xl bg-kam-white p-6 shadow-[0_16px_45px_rgba(15,36,96,0.12)] sm:p-8">
            <p className="text-sm font-bold uppercase tracking-wider text-kam-blue">
                Análisis de descripciones
            </p>

            <h2 className="mt-2 text-2xl font-bold text-kam-navy">
                Malestares físicos registrados con mayor frecuencia
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-kam-navy/70">
                Esta visualización resume los términos detectados en las
                descripciones del usuario. Su finalidad es facilitar la
                identificación de patrones y no representa un diagnóstico.
            </p>

            {summary.items.length === 0 ? (
                <div className="mt-6 flex min-h-52 items-center justify-center rounded-lg bg-kam-gray px-5 text-center text-kam-navy/70">
                    No se encontraron malestares reconocibles en las
                    descripciones analizadas.
                </div>
            ) : (
                <div className="mt-8 grid gap-8 lg:grid-cols-2">
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-kam-wine">
                            Vista rápida
                        </h3>

                        <div
                            className="mt-4 flex min-h-72 flex-wrap content-center items-center justify-center gap-x-5 gap-y-4 rounded-lg bg-kam-gray p-6"
                            role="list"
                        >
                            {visibleWords.map((item, index) => {
                                const ratio =
                                    item.count / maximumCount;

                                const fontSize =
                                    16 + ratio * 28;

                                const eventLabel =
                                    item.count === 1
                                        ? "evento"
                                        : "eventos";

                                return (
                                    <span
                                        key={item.id}
                                        className="leading-none"
                                        role="listitem"
                                        style={{
                                            color: WORD_COLORS[
                                                index %
                                                    WORD_COLORS.length
                                            ],
                                            fontSize: `${fontSize}px`,
                                            fontWeight:
                                                item.count ===
                                                maximumCount
                                                    ? 800
                                                    : 600,
                                        }}
                                        title={`${item.label}: ${item.count} ${eventLabel} (${item.percentage}%)`}
                                    >
                                        {item.label}
                                    </span>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-kam-wine">
                            Frecuencias exactas
                        </h3>

                        <div className="mt-4 space-y-4">
                            {exactFrequencies.map((item) => {
                                const barWidth = Math.max(
                                    6,
                                    (item.count /
                                        maximumCount) *
                                        100,
                                );

                                return (
                                    <div key={item.id}>
                                        <div className="flex items-center justify-between gap-4 text-sm">
                                            <span className="font-semibold text-kam-navy">
                                                {item.label}
                                            </span>

                                            <span className="shrink-0 text-kam-navy/70">
                                                {item.count} ·{" "}
                                                {item.percentage}%
                                            </span>
                                        </div>

                                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-kam-gray">
                                            <div
                                                className="h-full rounded-full bg-kam-magenta"
                                                style={{
                                                    width: `${barWidth}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            <p className="mt-6 border-t border-kam-gray pt-4 text-xs text-kam-navy/60">
                Se analizaron {summary.analyzedEvents} de{" "}
                {summary.totalEvents} eventos disponibles.
            </p>
        </section>
    );
}