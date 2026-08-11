import { createHealthProfessional } from "../actions";

type HealthProfessionalFormProps = {
    saved: boolean;
    errorMessage: string | null;
};

const inputClassName =
    "mt-2 h-12 w-full rounded-lg border border-kam-navy/20 bg-kam-gray px-4 text-kam-navy outline-none transition focus:border-kam-blue focus:bg-kam-white focus:ring-4 focus:ring-kam-blue/15";

const labelClassName =
    "block text-sm font-semibold text-kam-navy";

export default function HealthProfessionalForm({
    saved,
    errorMessage,
}: HealthProfessionalFormProps) {
    return (
        <section
            className="mt-8 rounded-xl bg-kam-white p-8 shadow-[0_16px_45px_rgba(15,36,96,0.12)]"
            id="profesionales"
        >
            <details
                className="group"
                open={saved || Boolean(errorMessage)}
            >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 outline-none focus-visible:ring-4 focus-visible:ring-kam-blue/20">
                    <span className="block">
                        <span className="block text-sm font-bold uppercase tracking-wider text-kam-magenta">
                            Equipo de atención
                        </span>

                        <span className="mt-2 block text-2xl font-bold text-kam-navy">
                            Agregar profesional
                        </span>

                        <span className="mt-3 block leading-7 text-kam-navy/70">
                            Registra otro profesional responsable de tu
                            seguimiento.
                        </span>
                    </span>

                    <span className="shrink-0 rounded-lg border border-kam-magenta px-4 py-2 text-sm font-bold text-kam-wine transition group-open:bg-kam-magenta group-open:text-kam-white">
                        <span className="group-open:hidden">
                            Mostrar formulario
                        </span>

                        <span className="hidden group-open:inline">
                            Ocultar formulario
                        </span>
                    </span>
                </summary>

                <div className="mt-7 border-t border-kam-gray pt-7">

                    {saved && (
                        <p
                            aria-live="polite"
                            className="mt-6 border-l-4 border-kam-blue bg-kam-gray px-4 py-3 text-sm font-semibold text-kam-navy"
                            role="status"
                        >
                            El profesional fue agregado correctamente.
                        </p>
                    )}

                    {errorMessage && (
                        <p
                            aria-live="assertive"
                            className="mt-6 border-l-4 border-kam-magenta bg-kam-gray px-4 py-3 text-sm font-semibold text-kam-wine"
                            role="alert"
                        >
                            {errorMessage}
                        </p>
                    )}

                    <form
                        action={createHealthProfessional}
                        className="mt-7 space-y-5"
                    >
                        <label className={labelClassName}>
                            Nombres
                            <input
                                autoComplete="given-name"
                                className={inputClassName}
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
                                defaultValue=""
                                name="profesion"
                                required
                            >
                                <option disabled value="">
                                    Selecciona una profesión
                                </option>

                                <option value="Médico/a general">
                                    Médico/a general
                                </option>

                                <option value="Psiquiatra">
                                    Psiquiatra
                                </option>

                                <option value="Psicólogo/a">
                                    Psicólogo/a
                                </option>

                                <option value="Neurólogo/a">
                                    Neurólogo/a
                                </option>

                                <option value="Terapeuta ocupacional">
                                    Terapeuta ocupacional
                                </option>

                                <option value="Otro profesional">
                                    Otro profesional
                                </option>
                            </select>
                        </label>

                        <label className={labelClassName}>
                            Función en el seguimiento
                            <select
                                className={inputClassName}
                                defaultValue=""
                                name="funcion_seguimiento"
                                required
                            >
                                <option disabled value="">
                                    Selecciona una función
                                </option>

                                <option value="psicoterapia">
                                    Psicoterapia o apoyo psicológico
                                </option>

                                <option value="control_medicamentos">
                                    Control de medicamentos
                                </option>

                                <option value="atencion_general">
                                    Atención general
                                </option>

                                <option value="otro">
                                    Otra función
                                </option>
                            </select>
                        </label>

                        <label className={labelClassName}>
                            Especialidad
                            <input
                                className={inputClassName}
                                maxLength={120}
                                name="especialidad"
                                placeholder="Ejemplo: Salud mental"
                                type="text"
                            />
                        </label>

                        <label className={labelClassName}>
                            Centro de salud
                            <input
                                autoComplete="organization"
                                className={inputClassName}
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
                                maxLength={30}
                                name="telefono"
                                placeholder="+56 9 1234 5678"
                                type="tel"
                            />
                        </label>

                        <label className={labelClassName}>
                            Inicio de la atención
                            <input
                                className={inputClassName}
                                name="fecha_inicio_atencion"
                                type="date"
                            />
                        </label>

                        <p className="text-xs leading-5 text-kam-navy/60">
                            Los datos son ingresados por el paciente y no
                            representan una acreditación profesional
                            realizada por KAM.
                        </p>

                        <button
                            className="h-12 w-full rounded-lg bg-kam-magenta px-6 font-bold text-kam-white transition hover:bg-kam-wine focus:outline-none focus:ring-4 focus:ring-kam-blue/25"
                            type="submit"
                        >
                            Agregar profesional
                        </button>
                    </form>
                </div>
            </details>
        </section>
    );
}