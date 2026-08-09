import { redirect } from "next/navigation";
import MonthYearFilter from "./components/MonthYearFilter";
import AppHeader from "@/app/components/AppHeader";
import { createClient } from "@/lib/supabase/server";
import EventRecordCard from "./components/EventRecordCard";

type EventosPageProps = {
    searchParams: Promise<{
        month?: string;
        year?: string;
    }>;
};
export const dynamic = "force-dynamic";

export default async function EventosPage({
    searchParams,
}: EventosPageProps) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const params = await searchParams;
    const ahora = new Date();

    const partesFecha = Object.fromEntries(
        new Intl.DateTimeFormat("en-US", {
            timeZone: "America/Santiago",
            year: "numeric",
            month: "2-digit",
        })
            .formatToParts(ahora)
            .map(({ type, value }) => [
                type,
                value,
            ]),
    );

    const anioActual = Number(partesFecha.year);
    const mesActual = Number(partesFecha.month);

    const { data: primerEvento } = await supabase
        .from("eventos")
        .select("fecha")
        .eq("user_id", user.id)
        .order("fecha", {
            ascending: true,
        })
        .limit(1)
        .maybeSingle();

    const primerAnioRegistrado =
        primerEvento?.fecha
            ? Number(primerEvento.fecha.slice(0, 4))
            : anioActual;

    const mesSolicitado = Number(params.month);
    const anioSolicitado = Number(params.year);

    const mesSeleccionado =
        Number.isInteger(mesSolicitado) &&
            mesSolicitado >= 1 &&
            mesSolicitado <= 12
            ? mesSolicitado
            : mesActual;

    const anioSeleccionado =
        Number.isInteger(anioSolicitado) &&
            anioSolicitado >= primerAnioRegistrado &&
            anioSolicitado <= anioActual
            ? anioSolicitado
            : anioActual;

    const inicioMes = `${anioSeleccionado}-${String(
        mesSeleccionado,
    ).padStart(2, "0")}-01`;

    const inicioMesSiguiente =
        mesSeleccionado === 12
            ? `${anioSeleccionado + 1}-01-01`
            : `${anioSeleccionado}-${String(
                mesSeleccionado + 1,
            ).padStart(2, "0")}-01`;

    const nombrePeriodo =
        new Intl.DateTimeFormat("es-CL", {
            timeZone: "UTC",
            month: "long",
            year: "numeric",
        }).format(
            new Date(`${inicioMes}T00:00:00Z`),
        );

    const aniosDisponibles = Array.from(
        {
            length:
                anioActual -
                primerAnioRegistrado +
                1,
        },
        (_, index) => anioActual - index,
    );

    const {
        data: eventos,
        error: eventosError,
        count: totalEventos,
    } = await supabase
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
                lvl_ansiedad
            `,
            {
                count: "exact",
            },
        )
        .eq("user_id", user.id)
        .gte("fecha", inicioMes)
        .lt("fecha", inicioMesSiguiente)
        .order("fecha", {
            ascending: false,
        })
        .order("hora", {
            ascending: false,
        });

    return (
        <div className="min-h-screen bg-kam-gray">
            <AppHeader
                activePage="eventos"
                email={
                    user.email ??
                    "Usuario sin correo"
                }
            />

            <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
                <section className="rounded-xl bg-kam-white p-8 shadow-[0_16px_45px_rgba(15,36,96,0.12)] sm:p-10">
                    <p className="text-sm font-bold uppercase tracking-wider text-kam-blue">
                        Historial personal
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-kam-navy">
                        Registros de eventos
                    </h1>

                    <p className="mt-4 max-w-3xl leading-7 text-kam-navy/70">
                        Consulta las situaciones que has registrado,
                        junto con su fecha, lugar, descripción,
                        duración y tratamiento utilizado.
                    </p>
                </section>
                <section className="mt-8 rounded-xl bg-kam-white p-6 shadow-[0_16px_45px_rgba(15,36,96,0.12)] sm:p-8">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-wider text-kam-magenta">
                                Eventos del periodo
                            </p>

                            <h2 className="mt-1 text-2xl font-bold text-kam-navy">
                                Registros de {nombrePeriodo}
                            </h2>
                        </div>

                        {!eventosError && (
                            <p className="text-sm text-kam-navy/60">
                                {totalEventos ?? 0}{" "}
                                {totalEventos === 1
                                    ? "evento"
                                    : "eventos"}
                            </p>
                        )}
                    </div>

                    <MonthYearFilter
                        selectedMonth={mesSeleccionado}
                        selectedYear={anioSeleccionado}
                        years={aniosDisponibles}
                    />

                    {eventosError ? (
                        <p className="mt-6 rounded-lg bg-kam-gray px-5 py-8 text-center font-semibold text-kam-wine">
                            No fue posible cargar los registros.
                        </p>
                    ) : eventos?.length === 0 ? (
                        <div className="mt-6 rounded-lg bg-kam-gray px-5 py-10 text-center">
                            <p className="font-bold text-kam-navy">
                                No existen eventos en este periodo.
                            </p>

                            <p className="mt-2 text-sm text-kam-navy/70">
                                Selecciona otro mes o año para consultar
                                registros anteriores.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-6 grid gap-5 lg:grid-cols-2">
                            {eventos?.map((evento) => (
                                <EventRecordCard
                                    key={evento.id}
                                    event={evento}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}