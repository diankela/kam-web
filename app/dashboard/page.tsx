import { redirect } from "next/navigation";
import { logout } from "./actions";
import { createClient } from "@/lib/supabase/server";
import AnxietyLineChart from "./components/AnxietyLineChart";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const ahora = new Date();

    const partesFecha = Object.fromEntries(
        new Intl.DateTimeFormat("en-US", {
            timeZone: "America/Santiago",
            year: "numeric",
            month: "2-digit",
        })
            .formatToParts(ahora)
            .map(({ type, value }) => [type, value]),
    );

    const anioActual = Number(partesFecha.year);
    const mesActual = Number(partesFecha.month);

    const inicioMes = `${anioActual}-${String(mesActual).padStart(2, "0")}-01`;

    const inicioMesSiguiente =
        mesActual === 12
            ? `${anioActual + 1}-01-01`
            : `${anioActual}-${String(mesActual + 1).padStart(2, "0")}-01`;

    const nombreMes = new Intl.DateTimeFormat("es-CL", {
        timeZone: "America/Santiago",
        month: "long",
        year: "numeric",
    }).format(ahora);

    const { count: totalEventos, error: eventosError } = await supabase
        .from("eventos")
        .select("*", {
            count: "exact",
            head: true,
        })
        .eq("user_id", user.id);

    const { count: eventosEsteMes, error: eventosMesError } = await supabase
        .from("eventos")
        .select("*", {
            count: "exact",
            head: true,
        })
        .eq("user_id", user.id)
        .gte("fecha", inicioMes)
        .lt("fecha", inicioMesSiguiente);


    const { data: nivelesAnsiedad, error: ansiedadError } = await supabase
        .from("eventos")
        .select("lvl_ansiedad")
        .eq("user_id", user.id)
        .gte("fecha", inicioMes)
        .lt("fecha", inicioMesSiguiente)
        .not("lvl_ansiedad", "is", null);

    const promedioAnsiedad =
        !ansiedadError &&
            nivelesAnsiedad &&
            nivelesAnsiedad.length > 0
            ? nivelesAnsiedad.reduce(
                (suma, evento) =>
                    suma + (evento.lvl_ansiedad ?? 0),
                0,
            ) / nivelesAnsiedad.length
            : null;

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

    const formateadorFechaGrafico = new Intl.DateTimeFormat("es-CL", {
        timeZone: "UTC",
        day: "2-digit",
        month: "short",
        year: "2-digit",
    });

    const datosGraficoAnsiedad = [...(historialAnsiedad ?? [])]
        .reverse()
        .map((evento) => {
            const fechaFormateada = formateadorFechaGrafico.format(
                new Date(`${evento.fecha}T00:00:00Z`),
            );

            const horaFormateada = evento.hora
                ? evento.hora.slice(0, 5)
                : "";

            return {
                fecha: `${fechaFormateada}${horaFormateada ? ` ${horaFormateada}` : ""
                    }`,
                nivel: evento.lvl_ansiedad ?? 0,
            };
        });

    const { data: dosisDelMes, error: dosisError } = await supabase
        .from("eventos")
        .select("dosis_medicamento")
        .eq("user_id", user.id)
        .gte("fecha", inicioMes)
        .lt("fecha", inicioMesSiguiente)
        .not("dosis_medicamento", "is", null);

    const dosisTotalMes =
        !dosisError &&
            dosisDelMes &&
            dosisDelMes.length > 0
            ? dosisDelMes.reduce(
                (suma, evento) =>
                    suma + (evento.dosis_medicamento ?? 0),
                0,
            )
            : null;

    const dosisTotalFormateada =
        dosisTotalMes !== null
            ? new Intl.NumberFormat("es-CL", {
                maximumFractionDigits: 2,
            }).format(dosisTotalMes)
            : null;

    return (
        <div className="min-h-screen bg-kam-gray">
            <header className="bg-kam-navy text-kam-white">
                <div className="mx-auto flex min-h-18 w-full max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded bg-kam-blue text-xl font-bold">
                            K
                        </div>

                        <div>
                            <p className="text-xl font-bold">
                                KAM
                            </p>

                            <p className="text-xs text-kam-white/70">
                                Kent Anxiety Manager
                            </p>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                        <div className="hidden min-w-0 items-center gap-2 rounded-lg border border-kam-white/15 bg-kam-white/10 px-3 py-2 sm:flex">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-kam-blue text-sm font-bold">
                                @
                            </div>

                            <div className="min-w-0">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-kam-white/60">
                                    Sesión activa
                                </p>

                                <p className="max-w-40 truncate text-sm font-semibold text-kam-white lg:max-w-56">
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        <form action={logout}>
                            <button
                                className="rounded bg-kam-magenta px-4 py-2 text-sm font-semibold text-kam-white transition hover:bg-kam-wine focus:outline-none focus:ring-4 focus:ring-kam-blue/30"
                                type="submit"
                            >
                                Cerrar sesión
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            <div className="bg-kam-blue text-kam-white">
                <div className="mx-auto w-full max-w-6xl px-5 py-3 text-sm sm:px-8">
                    Panel principal
                </div>
            </div>

            <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
                <section className="rounded-xl bg-kam-white p-8 shadow-[0_16px_45px_rgba(15,36,96,0.12)] sm:p-10">
                    <p className="text-sm font-bold uppercase tracking-wider text-kam-blue">
                        Acceso autorizado
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-kam-navy">
                        Bienvenido a KAM
                    </h1>

                    <p className="mt-4 max-w-2xl leading-7 text-kam-navy/70">
                        Este panel muestra únicamente la información asociada a tu
                        cuenta. Supabase protege los registros mediante las políticas
                        de seguridad por filas.
                    </p>

                    <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                        <div className="border-l-4 border-kam-magenta bg-kam-gray px-5 py-4">

                            <p className="text-xs font-bold uppercase tracking-wider text-kam-wine">
                                Dosis del mes
                            </p>

                            {dosisError ? (
                                <p className="mt-2 font-semibold text-kam-navy">
                                    No disponible
                                </p>
                            ) : dosisTotalFormateada === null ? (
                                <p className="mt-2 font-semibold text-kam-navy">
                                    Sin datos
                                </p>
                            ) : (
                                <p className="mt-2 text-4xl font-bold text-kam-navy">
                                    {dosisTotalFormateada}

                                    <span className="ml-1 text-lg font-semibold text-kam-navy/70">
                                        mg
                                    </span>
                                </p>
                            )}

                            <p className="mt-2 text-sm text-kam-wine">
                                Acumulado de {nombreMes}
                            </p>

                        </div>

                        <div className="border-l-4 border-kam-blue bg-kam-navy px-5 py-4 text-kam-white">
                            <p className="text-xs font-bold uppercase tracking-wider text-kam-white/70">
                                Eventos registrados
                            </p>

                            {eventosError ? (
                                <p className="mt-2 font-semibold text-kam-white">
                                    No disponible
                                </p>
                            ) : (
                                <p className="mt-2 text-4xl font-bold">
                                    {totalEventos ?? 0}
                                </p>
                            )}

                            <p className="mt-2 text-sm text-kam-white/70">
                                Solo se incluyen tus propios registros.
                            </p>
                        </div>
                        <div className="border-l-4 border-kam-magenta bg-kam-blue px-5 py-4 text-kam-white">
                            <p className="text-xs font-bold uppercase tracking-wider text-kam-white/70">
                                Eventos este mes
                            </p>

                            {eventosMesError ? (
                                <p className="mt-2 font-semibold">
                                    No disponible
                                </p>
                            ) : (
                                <p className="mt-2 text-4xl font-bold">
                                    {eventosEsteMes ?? 0}
                                </p>
                            )}

                            <p className="mt-2 text-sm text-kam-white/70">
                                {nombreMes}
                            </p>
                        </div>
                        <div className="border-l-4 border-kam-magenta bg-kam-wine px-5 py-4 text-kam-white">
                            <p className="text-xs font-bold uppercase tracking-wider text-kam-white/70">
                                Ansiedad promedio
                            </p>

                            {ansiedadError ? (
                                <p className="mt-2 font-semibold">
                                    No disponible
                                </p>
                            ) : promedioAnsiedad === null ? (
                                <p className="mt-2 font-semibold">
                                    Sin datos
                                </p>
                            ) : (
                                <p className="mt-2 text-4xl font-bold">
                                    {promedioAnsiedad.toFixed(1)}

                                    <span className="ml-1 text-lg font-semibold text-kam-white/70">
                                        / 10
                                    </span>
                                </p>
                            )}

                            <p className="mt-2 text-sm text-kam-white/70">
                                Promedio de {nombreMes}
                            </p>
                        </div>

                    </div>
                </section>
                {historialAnsiedadError ? (
                    <section className="mt-8 rounded-xl bg-kam-white p-8 text-center text-kam-wine shadow-[0_16px_45px_rgba(15,36,96,0.12)]">
                        No fue posible cargar el historial de ansiedad.
                    </section>
                ) : (
                    <AnxietyLineChart data={datosGraficoAnsiedad} />
                )}
            </main>
        </div>
    );
}