import {
    setPrimaryHealthProfessional,
} from "../actions";
import DeleteProfessionalButton from "./DeleteProfessionalButton";
import EditHealthProfessionalForm from "./EditHealthProfessionalForm";

type HealthProfessional = {
    id: string;
    nombres: string;
    apellidos: string;
    profesion: string;
    funcion_seguimiento: string;
    especialidad: string | null;
    centro_salud: string | null;
    email: string | null;
    telefono: string | null;
    fecha_inicio_atencion: string | null;
    es_principal: boolean;
};

type HealthProfessionalListProps = {
    professionals: HealthProfessional[];
};

const FUNCTION_LABELS: Record<string, string> = {
    psicoterapia: "Psicoterapia",
    control_medicamentos: "Control",
    atencion_general: "Atención general",
    otro: "Otro",
};

function formatDate(date: string) {
    return new Intl.DateTimeFormat("es-CL", {
        dateStyle: "long",
        timeZone: "UTC",
    }).format(new Date(`${date}T00:00:00Z`));
}

export default function HealthProfessionalList({
    professionals,
}: HealthProfessionalListProps) {
    return (
        <section
            className="mt-8 rounded-xl bg-kam-white p-8 shadow-[0_16px_45px_rgba(15,36,96,0.12)]"
            id="profesionales-registrados"
        >
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-kam-blue">
                        Equipo de atención
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-kam-navy">
                        Profesionales registrados
                    </h2>

                    <p className="mt-3 text-kam-navy/70">
                        Profesionales asociados a tu seguimiento
                        personal.
                    </p>
                </div>

                <p className="rounded-full bg-kam-gray px-4 py-2 text-sm font-bold text-kam-navy">
                    {professionals.length}{" "}
                    {professionals.length === 1
                        ? "profesional"
                        : "profesionales"}
                </p>
            </div>

            {professionals.length === 0 ? (
                <div className="mt-7 border-l-4 border-kam-blue bg-kam-gray px-5 py-4">
                    <p className="font-semibold text-kam-navy">
                        Todavía no existen profesionales
                        registrados.
                    </p>
                </div>
            ) : (
                <div className="mt-7 grid gap-5 md:grid-cols-2">
                    {professionals.map((professional) => (
                        <article
                            className="rounded-xl border border-kam-navy/10 bg-kam-gray p-6"
                            key={professional.id}
                        >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <h3 className="text-xl font-bold text-kam-navy">
                                        {professional.nombres}{" "}
                                        {professional.apellidos}
                                    </h3>

                                    <p className="mt-1 font-semibold text-kam-blue">
                                        {professional.profesion}
                                    </p>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    {professional.es_principal && (
                                        <span className="rounded-full bg-kam-magenta px-3 py-1 text-xs font-bold uppercase tracking-wide text-kam-white">
                                            Principal
                                        </span>
                                    )}

                                    {!professional.es_principal &&
                                        professional.funcion_seguimiento !==
                                        "otro" && (
                                            <span className="rounded-full bg-kam-blue px-3 py-1 text-xs font-bold uppercase tracking-wide text-kam-white">
                                                {FUNCTION_LABELS[
                                                    professional.funcion_seguimiento
                                                ] ?? "Otra función"}
                                            </span>
                                        )}


                                </div>
                            </div>

                            <dl className="mt-5 space-y-4 border-t border-kam-navy/10 pt-5">
                                {professional.especialidad && (
                                    <div>
                                        <dt className="text-xs font-bold uppercase tracking-wide text-kam-wine">
                                            Especialidad
                                        </dt>

                                        <dd className="mt-1 text-kam-navy">
                                            {
                                                professional.especialidad
                                            }
                                        </dd>
                                    </div>
                                )}

                                {professional.centro_salud && (
                                    <div>
                                        <dt className="text-xs font-bold uppercase tracking-wide text-kam-wine">
                                            Centro de salud
                                        </dt>

                                        <dd className="mt-1 text-kam-navy">
                                            {
                                                professional.centro_salud
                                            }
                                        </dd>
                                    </div>
                                )}

                                {professional.email && (
                                    <div>
                                        <dt className="text-xs font-bold uppercase tracking-wide text-kam-wine">
                                            Correo
                                        </dt>

                                        <dd className="mt-1 break-all text-kam-navy">
                                            {professional.email}
                                        </dd>
                                    </div>
                                )}

                                {professional.telefono && (
                                    <div>
                                        <dt className="text-xs font-bold uppercase tracking-wide text-kam-wine">
                                            Teléfono
                                        </dt>

                                        <dd className="mt-1 text-kam-navy">
                                            {professional.telefono}
                                        </dd>
                                    </div>
                                )}

                                {professional.fecha_inicio_atencion && (
                                    <div>
                                        <dt className="text-xs font-bold uppercase tracking-wide text-kam-wine">
                                            Inicio de la atención
                                        </dt>

                                        <dd className="mt-1 text-kam-navy">
                                            {formatDate(
                                                professional.fecha_inicio_atencion,
                                            )}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                            <EditHealthProfessionalForm
                                professional={professional}
                            />
                            <div className="mt-4 flex flex-wrap items-center justify-end gap-3 border-t border-kam-navy/10 pt-4">
                                {!professional.es_principal && (
                                    <form action={setPrimaryHealthProfessional}>
                                        <input
                                            name="professional_id"
                                            type="hidden"
                                            value={professional.id}
                                        />

                                        <button
                                            className="rounded-lg border border-kam-magenta px-3 py-2 text-xs font-bold text-kam-wine transition hover:bg-kam-magenta hover:text-kam-white focus:outline-none focus:ring-4 focus:ring-kam-blue/20"
                                            type="submit"
                                        >
                                            Marcar como principal
                                        </button>
                                    </form>
                                )}
                                <DeleteProfessionalButton
                                    professionalId={professional.id}
                                    professionalName={`${professional.nombres} ${professional.apellidos}`}
                                />

                            </div>

                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}