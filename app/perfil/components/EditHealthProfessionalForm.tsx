import { updateHealthProfessional } from "../actions";

type Professional = {
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
};

type EditHealthProfessionalFormProps = {
    professional: Professional;
};

const PROFESSION_OPTIONS = [
    "Médico/a general",
    "Psiquiatra",
    "Psicólogo/a",
    "Neurólogo/a",
    "Terapeuta ocupacional",
    "Otro profesional",
];

const FUNCTION_OPTIONS = [
    {
        value: "psicoterapia",
        label: "Psicoterapia o apoyo psicológico",
    },
    {
        value: "control_medicamentos",
        label: "Control de medicamentos",
    },
    {
        value: "atencion_general",
        label: "Atención general",
    },
    {
        value: "otro",
        label: "Otra función",
    },
];

const inputClassName =
    "mt-2 h-11 w-full rounded-lg border border-kam-navy/20 bg-kam-white px-3 text-sm text-kam-navy outline-none transition focus:border-kam-blue focus:ring-4 focus:ring-kam-blue/15";

const labelClassName =
    "block text-xs font-bold uppercase tracking-wide text-kam-wine";

export default function EditHealthProfessionalForm({
    professional,
}: EditHealthProfessionalFormProps) {
    return (
        <details className="group mt-4 rounded-lg border border-kam-blue/30 bg-kam-white">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-sm font-bold text-kam-blue outline-none focus-visible:ring-4 focus-visible:ring-kam-blue/20">
                <span>Editar datos</span>

                <span className="text-xs text-kam-navy/60 group-open:hidden">
                    Mostrar formulario
                </span>

                <span className="hidden text-xs text-kam-navy/60 group-open:inline">
                    Ocultar formulario
                </span>
            </summary>

            <form
                action={updateHealthProfessional}
                className="border-t border-kam-navy/10 p-4"
            >
                <input
                    name="professional_id"
                    type="hidden"
                    value={professional.id}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                    <label className={labelClassName}>
                        Nombres
                        <input
                            autoComplete="given-name"
                            className={inputClassName}
                            defaultValue={professional.nombres}
                            maxLength={100}
                            name="nombres_profesional"
                            required
                            type="text"
                        />
                    </label>

                    <label className={labelClassName}>
                        Apellidos
                        <input
                            autoComplete="family-name"
                            className={inputClassName}
                            defaultValue={professional.apellidos}
                            maxLength={120}
                            name="apellidos_profesional"
                            required
                            type="text"
                        />
                    </label>

                    <label className={labelClassName}>
                        Profesión
                        <select
                            className={inputClassName}
                            defaultValue={professional.profesion}
                            name="profesion"
                            required
                        >
                            {PROFESSION_OPTIONS.map((profession) => (
                                <option
                                    key={profession}
                                    value={profession}
                                >
                                    {profession}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className={labelClassName}>
                        Función en el seguimiento
                        <select
                            className={inputClassName}
                            defaultValue={
                                professional.funcion_seguimiento
                            }
                            name="funcion_seguimiento"
                            required
                        >
                            {FUNCTION_OPTIONS.map((option) => (
                                <option
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className={labelClassName}>
                        Especialidad
                        <input
                            className={inputClassName}
                            defaultValue={
                                professional.especialidad ?? ""
                            }
                            maxLength={120}
                            name="especialidad"
                            type="text"
                        />
                    </label>

                    <label className={labelClassName}>
                        Centro de salud
                        <input
                            className={inputClassName}
                            defaultValue={
                                professional.centro_salud ?? ""
                            }
                            maxLength={150}
                            name="centro_salud"
                            type="text"
                        />
                    </label>

                    <label className={labelClassName}>
                        Correo electrónico
                        <input
                            autoComplete="email"
                            className={inputClassName}
                            defaultValue={professional.email ?? ""}
                            maxLength={254}
                            name="email_profesional"
                            type="email"
                        />
                    </label>

                    <label className={labelClassName}>
                        Teléfono
                        <input
                            autoComplete="tel"
                            className={inputClassName}
                            defaultValue={
                                professional.telefono ?? ""
                            }
                            maxLength={30}
                            name="telefono"
                            type="tel"
                        />
                    </label>

                    <label className={labelClassName}>
                        Inicio de la atención
                        <input
                            className={inputClassName}
                            defaultValue={
                                professional.fecha_inicio_atencion ??
                                ""
                            }
                            name="fecha_inicio_atencion"
                            type="date"
                        />
                    </label>
                </div>

                <div className="mt-5 flex justify-end">
                    <button
                        className="rounded-lg bg-kam-blue px-5 py-3 text-sm font-bold text-kam-white transition hover:bg-kam-navy focus:outline-none focus:ring-4 focus:ring-kam-blue/20"
                        type="submit"
                    >
                        Guardar cambios
                    </button>
                </div>
            </form>
        </details>
    );
}