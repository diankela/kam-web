import { redirect } from "next/navigation";
import AppHeader from "@/app/components/AppHeader";
import { createClient } from "@/lib/supabase/server";
import AnxietyLineChart from "./components/AnxietyLineChart";
import DoseLineChart from "./components/DoseLineChart";
import EmotionFrequencyPanel from "./components/EmotionFrequencyPanel";
import SymptomFrequencyPanel from "./components/SymptomFrequencyPanel";
import { countEmotionFrequencies } from "@/lib/analysis/countEmotionFrequencies";
import { countSymptomFrequencies } from "@/lib/analysis/countSymptomFrequencies";

export const dynamic = "force-dynamic";

export default async function AnalisisPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const {
        data: historialAnsiedad,
        error: historialAnsiedadError,
    } = await supabase
        .from("eventos")
        .select("fecha, hora, lvl_ansiedad")
        .eq("user_id", user.id)
        .not("lvl_ansiedad", "is", null)
        .order("fecha", { ascending: false })
        .order("hora", { ascending: false })
        .limit(30);

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
        data: historialDosis,
        error: historialDosisError,
    } = await supabase
        .from("eventos")
        .select("fecha, dosis_medicamento")
        .eq("user_id", user.id)
        .not("dosis_medicamento", "is", null)
        .order("fecha", { ascending: false })
        .order("hora", { ascending: false })
        .limit(30);

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
                {historialAnsiedadError ? (
                    <section className="mt-8 rounded-xl bg-kam-white p-8 text-center text-kam-wine shadow-[0_16px_45px_rgba(15,36,96,0.12)]">
                        No fue posible cargar el historial de
                        ansiedad.
                    </section>
                ) : (
                    <AnxietyLineChart
                        data={datosGraficoAnsiedad}
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
                            El gráfico muestra los últimos
                            registros que contienen una dosis de
                            medicamento.
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