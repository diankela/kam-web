export type EventRecord = {
    id: number | string;
    fecha: string | null;
    hora: string | null;
    dosis_medicamento: number | string | null;
    nombre_psicotropico: string | null;
    lugar: string | null;
    descripcion: string | null;
    duracion_aprox: number | string | null;
    lvl_ansiedad: number | null;
};

type EventRecordCardProps = {
    event: EventRecord;
};

function formatFecha(fecha: string | null) {
    if (!fecha) {
        return "Fecha no registrada";
    }

    const fechaEvento = new Date(
        `${fecha}T00:00:00Z`,
    );

    if (Number.isNaN(fechaEvento.getTime())) {
        return fecha;
    }

    return new Intl.DateTimeFormat("es-CL", {
        timeZone: "UTC",
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(fechaEvento);
}

function formatDosis(
    dosis: number | string | null,
) {
    const valor = Number(dosis);

    if (
        dosis === null ||
        !Number.isFinite(valor)
    ) {
        return "Sin dosis";
    }

    return `${new Intl.NumberFormat("es-CL", {
        maximumFractionDigits: 2,
    }).format(valor)} mg`;
}

export default function EventRecordCard({
    event,
}: EventRecordCardProps) {
    const hora = event.hora
        ? event.hora.slice(0, 5)
        : "Sin hora";

    const duracion =
        event.duracion_aprox !== null
            ? String(event.duracion_aprox)
            : "Sin dato";

    return (
        <article className="rounded-xl border border-kam-gray bg-kam-white p-5 shadow-[0_8px_25px_rgba(15,36,96,0.08)] transition-colors hover:border-kam-magenta sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="font-bold text-kam-navy">
                        {formatFecha(event.fecha)}
                    </p>

                    <p className="mt-1 text-sm text-kam-navy/60">
                        {hora}
                    </p>
                </div>

                <div className="self-start rounded-lg bg-kam-blue/10 px-4 py-2 text-sm font-bold text-kam-blue">
                    {formatDosis(
                        event.dosis_medicamento,
                    )}
                </div>
            </div>

            <div className="mt-5 grid gap-4 border-y border-kam-gray py-4 sm:grid-cols-3">
                <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-kam-wine">
                        Lugar
                    </p>

                    <p className="mt-1 font-semibold text-kam-navy">
                        {event.lugar?.trim() ||
                            "Sin registrar"}
                    </p>
                </div>

                <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-kam-wine">
                        Duración
                    </p>

                    <p className="mt-1 font-semibold text-kam-navy">
                        {duracion}
                    </p>
                </div>

                <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-kam-wine">
                        Nivel de ansiedad
                    </p>

                    <p className="mt-1 font-semibold text-kam-navy">
                        {event.lvl_ansiedad !== null
                            ? `${event.lvl_ansiedad} / 10`
                            : "Sin dato"}
                    </p>
                </div>
            </div>

            <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-wide text-kam-blue">
                    Descripción
                </p>

                <p className="mt-2 leading-6 text-kam-navy/75">
                    {event.descripcion?.trim() ||
                        "Sin descripción registrada."}
                </p>
            </div>

            {event.nombre_psicotropico && (
                <p className="mt-4 text-sm text-kam-navy/60">
                    Medicamento:{" "}
                    <span className="font-semibold text-kam-navy">
                        {event.nombre_psicotropico}
                    </span>
                </p>
            )}
        </article>
    );
}