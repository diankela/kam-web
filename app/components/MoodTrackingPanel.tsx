import MoodLineChart from "@/app/analisis/components/MoodLineChart";
import {
    calculateDailyMoodTracking,
    calculateMoodTrackingSummary,
    type MoodTrackingRecord,
} from "@/lib/analysis/moodTracking";

type MoodTrackingPanelProps = {
    records: MoodTrackingRecord[];
    periodLabel: string;
    hasError?: boolean;
};

const NOTE_DATE_FORMATTER =
    new Intl.DateTimeFormat("es-CL", {
        timeZone: "America/Santiago",
        dateStyle: "medium",
        timeStyle: "short",
    });

function formatScaleValue(
    value: number | null,
) {
    return value === null
        ? "Sin datos"
        : `${value.toFixed(1)} / 10`;
}

function formatSleepHours(
    value: number | null,
) {
    return value === null
        ? "Sin datos"
        : `${value.toFixed(1)} h`;
}

function formatRecordDate(value: string) {
    const timestamp = new Date(value);

    if (Number.isNaN(timestamp.getTime())) {
        return "Fecha no disponible";
    }

    return NOTE_DATE_FORMATTER.format(timestamp);
}

export default function MoodTrackingPanel({
    records,
    periodLabel,
    hasError = false,
}: MoodTrackingPanelProps) {
    if (hasError) {
        return (
            <section
                className="mt-8 rounded-xl bg-kam-white p-8 text-center font-semibold text-kam-wine shadow-[0_16px_45px_rgba(15,36,96,0.10)]"
                role="alert"
            >
                No fue posible cargar el seguimiento del
                estado de ánimo.
            </section>
        );
    }

    const summary =
        calculateMoodTrackingSummary(records);

    const chartData =
        calculateDailyMoodTracking(records);

    const recordsWithNotes = records
        .filter(
            (record) =>
                typeof record.nota === "string" &&
                record.nota.trim().length > 0,
        )
        .sort(
            (firstRecord, secondRecord) =>
                new Date(
                    secondRecord.registrado_en,
                ).getTime() -
                new Date(
                    firstRecord.registrado_en,
                ).getTime(),
        );

    const summaryItems = [
        {
            label: "Estado de ánimo",
            value: formatScaleValue(
                summary.averageMood,
            ),
        },
        {
            label: "Interés",
            value: formatScaleValue(
                summary.averageInterest,
            ),
        },
        {
            label: "Energía",
            value: formatScaleValue(
                summary.averageEnergy,
            ),
        },
        {
            label: "Funcionamiento",
            value: formatScaleValue(
                summary.averageFunctioning,
            ),
        },
        {
            label: "Conexión social",
            value: formatScaleValue(
                summary.averageSocialConnection,
            ),
        },
        {
            label: "Calidad del sueño",
            value: formatScaleValue(
                summary.averageSleepQuality,
            ),
        },
        {
            label: "Horas de sueño",
            value: formatSleepHours(
                summary.averageSleepHours,
            ),
        },
    ];

    return (
        <>
            <section className="mt-8 rounded-xl bg-kam-white p-6 shadow-[0_16px_45px_rgba(15,36,96,0.12)] sm:p-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-wider text-kam-magenta">
                            Seguimiento emocional
                        </p>

                        <h2 className="mt-2 text-2xl font-bold text-kam-navy">
                            Resumen del estado de ánimo
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-kam-navy/70">
                            Promedios de los registros realizados
                            durante {periodLabel}.
                        </p>
                    </div>

                    <div className="rounded-lg bg-kam-gray px-4 py-3">
                        <p className="text-xs font-bold uppercase tracking-wide text-kam-wine">
                            Registros
                        </p>

                        <p className="mt-1 text-2xl font-bold text-kam-navy">
                            {summary.totalRecords}
                        </p>
                    </div>
                </div>

                {summary.totalRecords === 0 ? (
                    <div className="mt-6 rounded-lg bg-kam-gray px-5 py-8 text-center text-kam-navy/70">
                        No existen registros emocionales durante
                        este período.
                    </div>
                ) : (
                    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {summaryItems.map((item) => (
                            <article
                                key={item.label}
                                className="border-l-4 border-kam-magenta bg-kam-gray px-5 py-4"
                            >
                                <p className="text-xs font-bold uppercase tracking-wide text-kam-wine">
                                    {item.label}
                                </p>

                                <p className="mt-2 text-xl font-bold text-kam-navy">
                                    {item.value}
                                </p>
                            </article>
                        ))}
                    </div>
                )}

                <p className="mt-6 text-xs leading-5 text-kam-navy/60">
                    Estos valores corresponden a información
                    declarada por el paciente y no constituyen
                    una evaluación o diagnóstico clínico.
                </p>
            </section>

            <MoodLineChart
                data={chartData}
                description={`Promedio diario del estado de ánimo registrado durante ${periodLabel}.`}
            />

            <section className="mt-8 rounded-xl bg-kam-white p-6 shadow-[0_16px_45px_rgba(15,36,96,0.10)] sm:p-8">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-wider text-kam-blue">
                            Contexto personal
                        </p>

                        <h2 className="mt-2 text-2xl font-bold text-kam-navy">
                            Notas del período
                        </h2>

                        <p className="mt-2 text-sm text-kam-navy/70">
                            Comentarios asociados al seguimiento
                            emocional durante {periodLabel}.
                        </p>
                    </div>

                    <p className="text-sm font-semibold text-kam-navy/60">
                        {recordsWithNotes.length}{" "}
                        {recordsWithNotes.length === 1
                            ? "nota"
                            : "notas"}
                    </p>
                </div>

                {recordsWithNotes.length === 0 ? (
                    <div className="mt-6 rounded-lg bg-kam-gray px-5 py-8 text-center text-kam-navy/70">
                        No existen notas registradas durante este
                        período.
                    </div>
                ) : (
                    <div className="mt-6 space-y-4">
                        {recordsWithNotes.map((record) => (
                            <article
                                key={record.id}
                                className="rounded-lg border border-kam-navy/10 bg-kam-gray px-5 py-4"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <p className="text-sm font-bold text-kam-navy">
                                        {formatRecordDate(
                                            record.registrado_en,
                                        )}
                                    </p>

                                    <p className="text-sm font-semibold text-kam-magenta">
                                        Ánimo{" "}
                                        {record.estado_animo.toFixed(
                                            1,
                                        )}{" "}
                                        / 10
                                    </p>
                                </div>

                                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-kam-navy/75">
                                    {record.nota?.trim()}
                                </p>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}