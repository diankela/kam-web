import { redirect } from "next/navigation";
import AppHeader from "@/app/components/AppHeader";
import { createClient } from "@/lib/supabase/server";
import AnxietyLineChart from "./components/AnxietyLineChart";
import DoseLineChart from "./components/DoseLineChart";
import WellbeingLineChart from "./components/WellbeingLineChart";
import EmotionFrequencyPanel from "./components/EmotionFrequencyPanel";
import SymptomFrequencyPanel from "./components/SymptomFrequencyPanel";
import { countEmotionFrequencies } from "@/lib/analysis/countEmotionFrequencies";
import { countSymptomFrequencies } from "@/lib/analysis/countSymptomFrequencies";
import ClinicalPeriodFilter from "@/app/components/ClinicalPeriodFilter";
import { resolveClinicalPeriod } from "@/lib/analysis/clinicalPeriod";

type AnalisisPageProps = {
    searchParams: Promise<{
        periodo?: string | string[];
        month?: string | string[];
        year?: string | string[];
    }>;
};

export const dynamic = "force-dynamic";

export default async function AnalisisPage({
    searchParams,
}: AnalisisPageProps) {
    const params = await searchParams;

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
    const [
        { data: firstEvent },
        { data: firstWellbeingRecord },
    ] = await Promise.all([
        supabase
            .from("eventos")
            .select("fecha")
            .eq("user_id", user.id)
            .order("fecha", {
                ascending: true,
            })
            .limit(1)
            .maybeSingle(),

        supabase
            .from("registros_bienestar")
            .select("registrado_en")
            .eq("user_id", user.id)
            .order("registrado_en", {
                ascending: true,
            })
            .limit(1)
            .maybeSingle(),
    ]);

    const firstEventYear = firstEvent?.fecha
        ? Number(firstEvent.fecha.slice(0, 4))
        : null;

    const firstWellbeingYear =
        firstWellbeingRecord?.registrado_en
            ? Number(
                new Intl.DateTimeFormat(
                    "en-US",
                    {
                        timeZone:
                            "America/Santiago",
                        year: "numeric",
                    },
                ).format(
                    new Date(
                        firstWellbeingRecord.registrado_en,
                    ),
                ),
            )
            : null;

    const registeredYears = [
        firstEventYear,
        firstWellbeingYear,
    ].filter(
        (year): year is number =>
            year !== null &&
            Number.isInteger(year),
    );

    const firstRegisteredYear =
        registeredYears.length > 0
            ? Math.min(...registeredYears)
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
    const {
        data: historialAnsiedad,
        error: historialAnsiedadError,
    } = await supabase
        .from("eventos")
        .select("fecha, hora, lvl_ansiedad")
        .eq("user_id", user.id)
        .gte("fecha", startDate)
        .lt("fecha", endDate)
        .not("lvl_ansiedad", "is", null)
        .order("fecha", { ascending: false })
        .order("hora", { ascending: false });

    const formateadorFechaGrafico =
        new Intl.DateTimeFormat("es-CL", {
            timeZone: "UTC",
            day: "2-digit",
            month: "short",
            year: "2-digit",
        });

    const datosGraficoAnsiedad = [
        ...(historialAnsiedad ?? []),
    ]
        .reverse()
        .map((evento) => {
            const fechaFormateada =
                formateadorFechaGrafico.format(
                    new Date(
                        `${evento.fecha}T00:00:00Z`,
                    ),
                );

            const horaFormateada = evento.hora
                ? evento.hora.slice(0, 5)
                : "";

            return {
                fecha: [
                    fechaFormateada,
                    horaFormateada,
                ]
                    .filter(Boolean)
                    .join(" "),
                nivel: evento.lvl_ansiedad ?? 0,
            };
        });

    const {
        data: historialBienestar,
        error: historialBienestarError,
    } = await supabase
        .from("registros_bienestar")
        .select("puntuacion, registrado_en")
        .eq("user_id", user.id)
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
        });

    const formateadorFechaLocalBienestar =
        new Intl.DateTimeFormat("en-CA", {
            timeZone: "America/Santiago",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });

    const bienestarPorFecha = new Map<
        string,
        {
            suma: number;
            cantidad: number;
        }
    >();

    for (const registro of historialBienestar ?? []) {
        const puntuacion = Number(registro.puntuacion);

        if (
            !Number.isFinite(puntuacion) ||
            puntuacion < 1 ||
            puntuacion > 10
        ) {
            continue;
        }

        const fechaLocal =
            formateadorFechaLocalBienestar.format(
                new Date(registro.registrado_en),
            );
        if (
            fechaLocal < startDate ||
            fechaLocal >= endDate
        ) {
            continue;
        }

        const acumulado =
            bienestarPorFecha.get(fechaLocal) ?? {
                suma: 0,
                cantidad: 0,
            };

        acumulado.suma += puntuacion;
        acumulado.cantidad += 1;

        bienestarPorFecha.set(
            fechaLocal,
            acumulado,
        );
    }

    const datosGraficoBienestar = [
        ...bienestarPorFecha.entries(),
    ]
        .filter(
            ([fecha]) =>
                fecha >= startDate &&
                fecha < endDate,
        )
        .sort(([fechaA], [fechaB]) =>
            fechaA.localeCompare(fechaB),
        )
        .map(([fecha, resumen]) => ({
            fecha: formateadorFechaGrafico.format(
                new Date(`${fecha}T00:00:00Z`),
            ),
            bienestar:
                Math.round(
                    (resumen.suma /
                        resumen.cantidad) *
                    10,
                ) / 10,
        }));

    const {
        data: historialDosis,
        error: historialDosisError,
    } = await supabase
        .from("eventos")
        .select("fecha, dosis_medicamento")
        .eq("user_id", user.id)
        .gte("fecha", startDate)
        .lt("fecha", endDate)
        .not("dosis_medicamento", "is", null)
        .order("fecha", { ascending: false })
        .order("hora", { ascending: false });

    const datosGraficoDosis = [
        ...(historialDosis ?? []),
    ]
        .reverse()
        .map((evento) => ({
            fecha: evento.fecha,
            dosis: Number(
                evento.dosis_medicamento ?? 0,
            ),
        }));

    const {
        data: eventosParaAnalisis,
        error: analisisRegistrosError,
    } = await supabase
        .from("eventos")
        .select("id, descripcion, est_emo_pre")
        .eq("user_id", user.id)
        .gte("fecha", startDate)
        .lt("fecha", endDate)
        .order("fecha", { ascending: false })
        .order("hora", { ascending: false });

    const resumenSintomas =
        countSymptomFrequencies(
            eventosParaAnalisis ?? [],
        );

    const resumenEmociones =
        countEmotionFrequencies(
            eventosParaAnalisis ?? [],
        );

    return (
        <div className="min-h-screen bg-kam-gray">
            <AppHeader
                activePage="analisis"
                email={
                    user.email ??
                    "Usuario autenticado"
                }
            />

            <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
                <section className="rounded-xl bg-kam-white p-8 shadow-[0_16px_45px_rgba(15,36,96,0.12)] sm:p-10">
                    <p className="text-sm font-bold uppercase tracking-wider text-kam-blue">
                        Resultados detallados
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-kam-navy">
                        Análisis de seguimiento
                    </h1>

                    <p className="mt-4 max-w-2xl leading-7 text-kam-navy/70">
                        En esta página reuniremos los gráficos
                        y análisis detallados de tus registros.
                    </p>

                </section>
                <ClinicalPeriodFilter
                    activeMode={activeMode}
                    basePath="/analisis"
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    years={availableYears}
                />
                {historialAnsiedadError ? (
                    <section className="mt-8 rounded-xl bg-kam-white p-8 text-center text-kam-wine shadow-[0_16px_45px_rgba(15,36,96,0.12)]">
                        No fue posible cargar el historial de
                        ansiedad.
                    </section>
                ) : (
                    <AnxietyLineChart
                        data={datosGraficoAnsiedad}
                        description={`Evolución de los niveles de ansiedad registrados durante ${periodLabel}.`}
                    />
                )}
                {historialBienestarError ? (
                    <section className="mt-8 rounded-xl bg-kam-white p-8 text-center text-kam-wine shadow-[0_16px_45px_rgba(15,36,96,0.12)]">
                        No fue posible cargar el historial de
                        bienestar.
                    </section>
                ) : (
                    <WellbeingLineChart
                        data={datosGraficoBienestar}
                        description={`Promedio diario de las puntuaciones de bienestar registradas durante ${periodLabel}.`}
                    />
                )}
                {historialDosisError ? (
                    <section className="mt-8 rounded-xl bg-kam-white p-8 text-center text-kam-wine shadow-[0_16px_45px_rgba(15,36,96,0.12)]">
                        No fue posible cargar el historial de
                        dosis.
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
                            Dosis registradas durante{" "}
                            {periodLabel}.
                        </p>

                        <div className="mt-6">
                            <DoseLineChart
                                data={datosGraficoDosis}
                            />
                        </div>
                    </section>
                )}
                {analisisRegistrosError ? (
                    <section className="mt-8 rounded-xl bg-kam-white p-8 text-center text-kam-wine shadow-[0_16px_45px_rgba(15,36,96,0.12)]">
                        No fue posible analizar la información de
                        los eventos.
                    </section>
                ) : (
                    <>
                        <SymptomFrequencyPanel
                            summary={resumenSintomas}
                        />

                        <EmotionFrequencyPanel
                            summary={resumenEmociones}
                        />
                    </>
                )}
            </main>
        </div>
    );
}