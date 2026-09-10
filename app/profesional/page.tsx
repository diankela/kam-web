import Image from "next/image";
import { redirect } from "next/navigation";
import Link from "next/link";
import WellbeingLineChart from "@/app/analisis/components/WellbeingLineChart";
import ClinicalPeriodFilter from "@/app/components/ClinicalPeriodFilter";
import { resolveClinicalPeriod } from "@/lib/analysis/clinicalPeriod";
import EventRecordCard from "@/app/eventos/components/EventRecordCard";
import { logout } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/server";
import AnxietyLineChart from "@/app/analisis/components/AnxietyLineChart";
import DoseLineChart from "@/app/analisis/components/DoseLineChart";
import EmotionFrequencyPanel from "@/app/analisis/components/EmotionFrequencyPanel";
import SymptomFrequencyPanel from "@/app/analisis/components/SymptomFrequencyPanel";
import { countEmotionFrequencies } from "@/lib/analysis/countEmotionFrequencies";
import { countSymptomFrequencies } from "@/lib/analysis/countSymptomFrequencies";
import ClinicalSummaryMetrics from "@/app/components/ClinicalSummaryMetrics";
import MoodTrackingPanel from "@/app/components/MoodTrackingPanel";
import {
    filterMoodTrackingByDateRange,
    type MoodTrackingRecord,
} from "@/lib/analysis/moodTracking";
import ClinicalAnalysisMenu from "@/app/components/ClinicalAnalysisMenu";
import {
    resolveClinicalAnalysisView,
} from "@/lib/analysis/clinicalView";

type ProfessionalPageProps = {
    searchParams: Promise<{
        paciente?: string | string[];
        month?: string | string[];
        year?: string | string[];
        periodo?: string | string[];
        vista?: string | string[];
    }>;
};

export const dynamic = "force-dynamic";

export default async function ProfessionalPage({
    searchParams,
}: ProfessionalPageProps) {
    const params = await searchParams;
    const activeView =
        resolveClinicalAnalysisView(
            params.vista,
        );
    const {
        activeMode,
        currentYear,
        selectedMonth,
        selectedYear,
        startDate,
        endDate,
        periodLabel,
    } = resolveClinicalPeriod({
        month: params.month,
        period: params.periodo,
        year: params.year,
    });
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const {
        data: professionalLinks,
        error: professionalError,
    } = await supabase
        .from("profesionales_salud")
        .select(
            `
                id,
                nombres,
                paciente_id,
                apellidos,
                tratamiento_profesional,
                profesion
            `,
        )
        .eq("profesional_user_id", user.id);

    if (
        professionalError ||
        !professionalLinks ||
        professionalLinks.length === 0
    ) {
        redirect("/login?error=sin_acceso");
    }

    const professional = professionalLinks[0];

    const professionalName = [
        professional.tratamiento_profesional,
        professional.nombres,
        professional.apellidos,
    ]
        .filter(Boolean)
        .join(" ");

    const patientIds = Array.from(
        new Set(
            professionalLinks
                .map((link) => link.paciente_id)
                .filter(
                    (patientId): patientId is string =>
                        typeof patientId === "string" &&
                        patientId.length > 0,
                ),
        ),
    );

    const authorizedPatientsResult =
        patientIds.length > 0
            ? await supabase
                .from("pacientes")
                .select(
                    `
                              user_id,
                              nombres,
                              apellido_paterno,
                              apellido_materno,
                              fecha_nacimiento,
                              diagnostico_principal,
                              fecha_diagnostico
                          `,
                )
                .in("user_id", patientIds)
                .order("apellido_paterno", {
                    ascending: true,
                })
            : {
                data: [],
                error: null,
            };

    const {
        data: authorizedPatients,
        error: patientsError,
    } = authorizedPatientsResult;
    const requestedPatientId =
        typeof params.paciente === "string"
            ? params.paciente
            : null;

    const selectedPatientId =
        requestedPatientId &&
            patientIds.includes(requestedPatientId)
            ? requestedPatientId
            : patientIds[0] ?? null;

    const selectedPatient =
        authorizedPatients?.find(
            (patient) =>
                patient.user_id === selectedPatientId,
        ) ?? null;

    const selectedPatientName = selectedPatient
        ? [
            selectedPatient.nombres,
            selectedPatient.apellido_paterno,
            selectedPatient.apellido_materno,
        ]
            .filter(Boolean)
            .join(" ")
        : null;
    const totalEventsResult =
        selectedPatientId &&
            activeView === "ansiedad"
            ? await supabase
                .from("eventos")
                .select("*", {
                    count: "exact",
                    head: true,
                })
                .eq("user_id", selectedPatientId)
            : {
                count: 0,
                error: null,
            };

    const {
        count: totalEvents,
        error: totalEventsError,
    } = totalEventsResult;
    const firstEventResult = selectedPatientId
        ? await supabase
            .from("eventos")
            .select("fecha")
            .eq("user_id", selectedPatientId)
            .order("fecha", {
                ascending: true,
            })
            .limit(1)
            .maybeSingle()
        : {
            data: null,
            error: null,
        };

    const parsedFirstYear =
        firstEventResult.data?.fecha
            ? Number(
                firstEventResult.data.fecha.slice(
                    0,
                    4,
                ),
            )
            : currentYear;

    const firstRegisteredYear =
        Number.isInteger(parsedFirstYear) &&
            parsedFirstYear <= currentYear
            ? parsedFirstYear
            : currentYear;

    const availableYears = Array.from(
        {
            length:
                currentYear -
                firstRegisteredYear +
                1,
        },
        (_, index) => currentYear - index,
    );

    function buildPatientHref(
        patientId: string,
    ) {
        const searchParams =
            new URLSearchParams();

        searchParams.set(
            "paciente",
            patientId,
        );

        searchParams.set(
            "vista",
            activeView,
        );

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

        return `/profesional?${searchParams.toString()}`;
    }
    const recentEventsResult =
        selectedPatientId &&
            activeView === "ansiedad"
            ? await supabase
                .from("eventos")
                .select(
                    `
                  id,
                  fecha,
                  hora,
                  dosis_medicamento,
                  nombre_psicotropico,
                  lugar,
                  descripcion,
                  duracion_aprox,
                  lvl_ansiedad,
                  causas,
                  imp_act_diarias,
                  est_emo_pre
              `,
                )
                .eq("user_id", selectedPatientId)
                .gte("fecha", startDate)
                .lt("fecha", endDate)
                .order("fecha", {
                    ascending: false,
                })
                .order("hora", {
                    ascending: false,
                })
            : {
                data: [],
                error: null,
            };

    const wellbeingResult = selectedPatientId
        ? await supabase
            .from("registros_bienestar")
            .select("puntuacion, registrado_en")
            .eq("user_id", selectedPatientId)
            .gte(
                "registrado_en",
                `${startDate}T00:00:00Z`,
            )
            .lt(
                "registrado_en",
                `${endDate}T05:00:00Z`,
            )
            .gte("puntuacion", 1)
            .lte("puntuacion", 10)
            .order("registrado_en", {
                ascending: true,
            })
        : {
            data: [],
            error: null,
        };

    const {
        data: wellbeingRecords,
        error: wellbeingError,
    } = wellbeingResult;

    const moodTrackingResult =
        selectedPatientId &&
            activeView === "animo"
            ? await supabase
                .from("registros_estado_animo")
                .select(
                    `
                id,
                estado_animo,
                interes,
                energia,
                funcionamiento,
                conexion_social,
                calidad_sueno,
                horas_sueno,
                nota,
                registrado_en
            `,
                )
                .eq("user_id", selectedPatientId)
                .gte(
                    "registrado_en",
                    `${startDate}T00:00:00Z`,
                )
                .lt(
                    "registrado_en",
                    `${endDate}T05:00:00Z`,
                )
                .order("registrado_en", {
                    ascending: true,
                })
            : {
                data: [],
                error: null,
            };

    const {
        data: moodTrackingRecords,
        error: moodTrackingError,
    } = moodTrackingResult;

    const moodRecordsInPeriod =
        filterMoodTrackingByDateRange(
            (moodTrackingRecords ??
                []) as MoodTrackingRecord[],
            startDate,
            endDate,
        );

    const localDateFormatter = new Intl.DateTimeFormat(
        "en-CA",
        {
            timeZone: "America/Santiago",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        },
    );

    const chartDateFormatter = new Intl.DateTimeFormat(
        "es-CL",
        {
            timeZone: "UTC",
            day: "2-digit",
            month: "short",
            year: "2-digit",
        },
    );

    const wellbeingByDate = new Map<
        string,
        {
            total: number;
            count: number;
        }
    >();

    for (const record of wellbeingRecords ?? []) {
        const score = Number(record.puntuacion);

        if (
            !Number.isFinite(score) ||
            score < 1 ||
            score > 10
        ) {
            continue;
        }

        const localDate = localDateFormatter.format(
            new Date(record.registrado_en),
        );
        if (
            localDate < startDate ||
            localDate >= endDate
        ) {
            continue;
        }

        const accumulated =
            wellbeingByDate.get(localDate) ?? {
                total: 0,
                count: 0,
            };

        accumulated.total += score;
        accumulated.count += 1;

        wellbeingByDate.set(localDate, accumulated);
    }

    const wellbeingChartData = [
        ...wellbeingByDate.entries(),
    ]

        .sort(([dateA], [dateB]) =>
            dateA.localeCompare(dateB),
        )
        .map(([date, summary]) => ({
            fecha: chartDateFormatter.format(
                new Date(`${date}T00:00:00Z`),
            ),
            bienestar:
                Math.round(
                    (summary.total / summary.count) * 10,
                ) / 10,
        }));
    const {
        data: recentEvents,
        error: recentEventsError,
    } = recentEventsResult;
    const anxietyResult =
        selectedPatientId &&
            activeView === "ansiedad"
            ? await supabase
                .from("eventos")
                .select("fecha, hora, lvl_ansiedad")
                .eq("user_id", selectedPatientId)
                .gte("fecha", startDate)
                .lt("fecha", endDate)
                .not("lvl_ansiedad", "is", null)
                .order("fecha", {
                    ascending: true,
                })
                .order("hora", {
                    ascending: true,
                })
            : {
                data: [],
                error: null,
            };

    const {
        data: anxietyRecords,
        error: anxietyError,
    } = anxietyResult;

    const anxietyChartData = (
        anxietyRecords ?? []
    ).map((event) => {
        const formattedDate =
            chartDateFormatter.format(
                new Date(
                    `${event.fecha}T00:00:00Z`,
                ),
            );

        const formattedTime = event.hora
            ? event.hora.slice(0, 5)
            : "";

        return {
            fecha: [
                formattedDate,
                formattedTime,
            ]
                .filter(Boolean)
                .join(" "),
            nivel: event.lvl_ansiedad ?? 0,
        };
    });
    const doseResult =
        selectedPatientId &&
            activeView === "ansiedad"
            ? await supabase
                .from("eventos")
                .select("fecha, dosis_medicamento")
                .eq("user_id", selectedPatientId)
                .gte("fecha", startDate)
                .lt("fecha", endDate)
                .not("dosis_medicamento", "is", null)
                .order("fecha", {
                    ascending: true,
                })
            : {
                data: [],
                error: null,
            };

    const {
        data: doseRecords,
        error: doseError,
    } = doseResult;

    const doseChartData = (
        doseRecords ?? []
    ).map((event) => ({
        fecha: event.fecha,
        dosis: Number(
            event.dosis_medicamento ?? 0,
        ),
    }));
    const symptomSummary = countSymptomFrequencies(
        recentEvents ?? [],
    );

    const emotionSummary = countEmotionFrequencies(
        recentEvents ?? [],
    );
    const totalDoseInPeriod =
        !doseError &&
            doseRecords &&
            doseRecords.length > 0
            ? doseRecords.reduce(
                (total, event) =>
                    total +
                    Number(
                        event.dosis_medicamento ?? 0,
                    ),
                0,
            )
            : null;

    const formattedTotalDose =
        totalDoseInPeriod !== null
            ? new Intl.NumberFormat("es-CL", {
                maximumFractionDigits: 2,
            }).format(totalDoseInPeriod)
            : null;

    const averageAnxiety =
        !anxietyError &&
            anxietyRecords &&
            anxietyRecords.length > 0
            ? anxietyRecords.reduce(
                (total, event) =>
                    total +
                    Number(event.lvl_ansiedad ?? 0),
                0,
            ) / anxietyRecords.length
            : null;
    return (
        <div className="min-h-screen bg-kam-gray">
            <header className="bg-kam-navy text-kam-white">
                <div className="mx-auto flex min-h-18 w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-3 sm:px-8">
                    <div className="flex items-center gap-3">
                        <Image
                            alt="Símbolo de KAM"
                            className="h-12 w-12 shrink-0 object-contain"
                            height={96}
                            priority
                            src="/images/kam-logo-header.png"
                            width={96}
                        />

                        <div>
                            <p className="text-xl font-bold">
                                KAM
                            </p>

                            <p className="text-xs text-kam-white/70">
                                Portal profesional
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="rounded-lg border border-kam-white/15 bg-kam-white/10 px-4 py-2">
                            <p className="text-xs font-bold uppercase tracking-wide text-kam-white/60">
                                Sesión profesional
                            </p>

                            <p className="max-w-56 truncate text-sm font-semibold">
                                {user.email ??
                                    professionalName}
                            </p>
                        </div>

                        <form action={logout}>
                            <button
                                className="rounded bg-kam-magenta px-4 py-3 text-sm font-semibold text-kam-white transition hover:bg-kam-wine focus:outline-none focus:ring-4 focus:ring-kam-blue/30"
                                type="submit"
                            >
                                Cerrar sesión
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
                <section className="rounded-xl bg-kam-white p-8 shadow-[0_16px_45px_rgba(15,36,96,0.12)] sm:p-10">
                    <p className="text-sm font-bold uppercase tracking-wider text-kam-blue">
                        Acceso autorizado
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-kam-navy">
                        Portal del profesional
                    </h1>

                    <p className="mt-4 max-w-2xl leading-7 text-kam-navy/70">
                        Tu cuenta fue reconocida como parte de un
                        equipo de atención registrado en KAM.
                    </p>

                    <div className="mt-8 grid gap-5 md:grid-cols-2">
                        <div className="border-l-4 border-kam-magenta bg-kam-gray px-5 py-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-kam-wine">
                                Identidad profesional
                            </p>

                            <p className="mt-2 text-lg font-bold text-kam-navy">
                                {professionalName}
                            </p>

                            <p className="mt-1 text-sm text-kam-navy/70">
                                {professional.profesion}
                            </p>
                        </div>

                        <div className="border-l-4 border-kam-blue bg-kam-gray px-5 py-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-kam-wine">
                                Vínculos autorizados
                            </p>

                            <p className="mt-2 text-3xl font-bold text-kam-navy">
                                {professionalLinks.length}
                            </p>

                            <p className="mt-1 text-sm text-kam-navy/70">
                                {professionalLinks.length === 1
                                    ? "Paciente vinculado"
                                    : "Pacientes vinculados"}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mt-8 rounded-xl border border-kam-blue/20 bg-kam-white p-8 shadow-[0_16px_45px_rgba(15,36,96,0.08)]">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-wider text-kam-blue">
                                Acceso de solo lectura
                            </p>

                            <h2 className="mt-2 text-2xl font-bold text-kam-navy">
                                Pacientes autorizados
                            </h2>

                            <p className="mt-3 max-w-3xl leading-7 text-kam-navy/70">
                                Solo se muestran pacientes que mantienen un
                                vínculo autorizado con tu cuenta profesional.
                            </p>
                        </div>

                        {!patientsError && (
                            <p className="text-sm font-semibold text-kam-navy/60">
                                {authorizedPatients?.length ?? 0}{" "}
                                {authorizedPatients?.length === 1
                                    ? "paciente"
                                    : "pacientes"}
                            </p>
                        )}
                    </div>

                    {patientsError ? (
                        <p
                            className="mt-6 border-l-4 border-kam-magenta bg-kam-gray px-5 py-4 font-semibold text-kam-wine"
                            role="alert"
                        >
                            No fue posible cargar los pacientes autorizados.
                        </p>
                    ) : authorizedPatients?.length === 0 ? (
                        <p className="mt-6 rounded-lg bg-kam-gray px-5 py-8 text-center text-kam-navy/70">
                            No existen pacientes vinculados disponibles.
                        </p>
                    ) : (
                        <div className="mt-6 grid gap-5 md:grid-cols-2">
                            {authorizedPatients?.map((patient) => {
                                const patientName = [
                                    patient.nombres,
                                    patient.apellido_paterno,
                                    patient.apellido_materno,
                                ]
                                    .filter(Boolean)
                                    .join(" ");

                                const isSelected =
                                    patient.user_id === selectedPatientId;

                                return (
                                    <Link
                                        key={patient.user_id}
                                        aria-current={
                                            isSelected ? "true" : undefined
                                        }
                                        className={`block rounded-xl border p-6 transition ${isSelected
                                            ? "border-kam-blue bg-kam-blue/5 shadow-[0_8px_25px_rgba(0,122,255,0.12)]"
                                            : "border-kam-navy/10 bg-kam-gray hover:border-kam-blue"
                                            }`}
                                        href={buildPatientHref(
                                            patient.user_id,
                                        )}
                                    >
                                        <article>
                                            <div className="flex flex-wrap items-start justify-between gap-3">
                                                <p className="text-xs font-bold uppercase tracking-wider text-kam-magenta">
                                                    Paciente vinculado
                                                </p>

                                                {isSelected && (
                                                    <span className="rounded-full bg-kam-blue px-3 py-1 text-xs font-bold text-kam-white">
                                                        Mostrando registros
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="mt-2 text-xl font-bold text-kam-navy">
                                                {patientName ||
                                                    "Nombre no informado"}
                                            </h3>

                                            <div className="mt-5 border-t border-kam-navy/10 pt-5">
                                                <p className="text-xs font-bold uppercase tracking-wide text-kam-wine">
                                                    Diagnóstico informado
                                                </p>

                                                <p className="mt-2 font-semibold text-kam-navy">
                                                    {patient.diagnostico_principal ||
                                                        "No informado"}
                                                </p>

                                                <p className="mt-2 text-xs leading-5 text-kam-navy/60">
                                                    Información declarada por el
                                                    paciente y no validada clínicamente
                                                    por KAM.
                                                </p>
                                            </div>

                                        </article>

                                    </Link>

                                );
                            })}

                        </div>
                    )}
                </section>
                {selectedPatientId && (
                    <ClinicalPeriodFilter
                        activeMode={activeMode}
                        analysisView={activeView}
                        basePath="/profesional"
                        patientId={selectedPatientId}
                        selectedMonth={selectedMonth}
                        selectedYear={selectedYear}
                        years={availableYears}
                    />
                )}
                {selectedPatientId && (
                    <ClinicalAnalysisMenu
                        activeMode={activeMode}
                        activeView={activeView}
                        basePath="/profesional"
                        patientId={selectedPatientId}
                        selectedMonth={selectedMonth}
                        selectedYear={selectedYear}
                    />
                )}
                {selectedPatientId &&
                    activeView === "ansiedad" && (
                        <ClinicalSummaryMetrics
                            averageAnxiety={averageAnxiety}
                            averageAnxietyError={Boolean(
                                anxietyError,
                            )}
                            formattedTotalDose={
                                formattedTotalDose
                            }
                            periodEvents={
                                recentEvents?.length ?? 0
                            }
                            periodEventsError={Boolean(
                                recentEventsError,
                            )}
                            periodLabel={periodLabel}
                            totalDoseError={Boolean(doseError)}
                            totalEvents={totalEvents}
                            totalEventsError={Boolean(
                                totalEventsError,
                            )}
                        />
                    )}
                {selectedPatientId &&
                    (wellbeingError ? (
                        <section className="mt-8 rounded-xl bg-kam-white p-8 text-center font-semibold text-kam-wine shadow-[0_16px_45px_rgba(15,36,96,0.10)]">
                            No fue posible cargar el historial de
                            bienestar del paciente.
                        </section>
                    ) : (
                        <WellbeingLineChart
                            data={wellbeingChartData}
                            description={`Indicador general de bienestar del paciente durante ${periodLabel}. Se presenta como referencia común para ambos tipos de seguimiento.`}
                        />
                    ))}
                {selectedPatientId &&
                    activeView === "animo" && (
                        <MoodTrackingPanel
                            records={moodRecordsInPeriod}
                            periodLabel={periodLabel}
                            hasError={Boolean(
                                moodTrackingError,
                            )}
                        />
                    )}
                {selectedPatientId &&
                    activeView === "ansiedad" &&
                    (anxietyError ? (
                        <section className="mt-8 rounded-xl bg-kam-white p-8 text-center font-semibold text-kam-wine shadow-[0_16px_45px_rgba(15,36,96,0.10)]">
                            No fue posible cargar el historial de
                            ansiedad del paciente.
                        </section>
                    ) : (
                        <AnxietyLineChart
                            data={anxietyChartData}
                            description={`Evolución de los niveles de ansiedad registrados por el paciente durante ${periodLabel}.`}
                        />
                    ))}
                {selectedPatientId &&
                    activeView === "ansiedad" &&
                    (doseError ? (
                        <section className="mt-8 rounded-xl bg-kam-white p-8 text-center font-semibold text-kam-wine shadow-[0_16px_45px_rgba(15,36,96,0.10)]">
                            No fue posible cargar el historial de
                            dosis del paciente.
                        </section>
                    ) : (
                        <section className="mt-8 rounded-xl bg-kam-white p-6 shadow-[0_16px_45px_rgba(15,36,96,0.12)] sm:p-8">
                            <p className="text-sm font-bold uppercase tracking-wider text-kam-magenta">
                                Seguimiento farmacológico
                            </p>

                            <h2 className="mt-2 text-2xl font-bold text-kam-navy">
                                Evolución de las dosis
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-kam-navy/70">
                                Dosis registradas por el paciente durante{" "}
                                {periodLabel}.
                            </p>

                            <div className="mt-6">
                                <DoseLineChart
                                    data={doseChartData}
                                />
                            </div>
                        </section>
                    ))}
                {selectedPatientId &&
                    activeView === "ansiedad" &&
                    !recentEventsError && (
                        <>
                            <SymptomFrequencyPanel
                                summary={symptomSummary}
                            />

                            <EmotionFrequencyPanel
                                summary={emotionSummary}
                            />
                        </>
                    )}
                {selectedPatientId &&
                    activeView === "ansiedad" && (
                        <section className="mt-8 rounded-xl bg-kam-white p-6 shadow-[0_16px_45px_rgba(15,36,96,0.10)] sm:p-8">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <p className="text-sm font-bold uppercase tracking-wider text-kam-magenta">
                                        Seguimiento clínico
                                    </p>

                                    <h2 className="mt-2 text-2xl font-bold text-kam-navy">
                                        Eventos del período
                                    </h2>

                                    <p className="mt-2 text-sm text-kam-navy/70">
                                        Registros de{" "}
                                        {selectedPatientName ||
                                            "este paciente"}{" "}
                                        correspondientes a {periodLabel}.
                                    </p>
                                </div>

                                {!recentEventsError && (
                                    <p className="text-sm font-semibold text-kam-navy/60">
                                        {recentEvents?.length ?? 0}{" "}
                                        {recentEvents?.length === 1
                                            ? "registro"
                                            : "registros"}
                                    </p>
                                )}
                            </div>

                            {recentEventsError ? (
                                <p
                                    className="mt-6 border-l-4 border-kam-magenta bg-kam-gray px-5 py-4 font-semibold text-kam-wine"
                                    role="alert"
                                >
                                    No fue posible cargar los eventos del
                                    paciente.
                                </p>
                            ) : recentEvents?.length === 0 ? (
                                <p className="mt-6 rounded-lg bg-kam-gray px-5 py-8 text-center text-kam-navy/70">
                                    Este paciente todavía no tiene eventos
                                    registrados.
                                </p>
                            ) : (
                                <div className="mt-6 grid gap-5 lg:grid-cols-2">
                                    {recentEvents?.map((event) => (
                                        <EventRecordCard
                                            key={event.id}
                                            event={event}
                                        />
                                    ))}
                                </div>
                            )}
                        </section>
                    )}
            </main>
        </div>
    );
}