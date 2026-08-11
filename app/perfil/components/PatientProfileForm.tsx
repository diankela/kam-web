import { savePatientProfile } from "../actions";

type PatientProfile = {
    nombres: string | null;
    apellido_paterno: string | null;
    apellido_materno: string | null;
    fecha_nacimiento: string | null;
    diagnostico_principal: string | null;
    fecha_diagnostico: string | null;
};

type PatientProfileFormProps = {
    profile: PatientProfile | null;
    saved: boolean;
    errorMessage: string | null;
};

const inputClassName =
    "mt-2 h-12 w-full rounded-lg border border-kam-navy/20 bg-kam-gray px-4 text-kam-navy outline-none transition focus:border-kam-blue focus:bg-kam-white focus:ring-4 focus:ring-kam-blue/15";

const labelClassName =
    "text-sm font-semibold text-kam-navy";

export default function PatientProfileForm({
    profile,
    saved,
    errorMessage,
}: PatientProfileFormProps) {
    return (
        <section className="rounded-xl bg-kam-white p-8 shadow-[0_16px_45px_rgba(15,36,96,0.12)]">
            <p className="text-sm font-bold uppercase tracking-wider text-kam-magenta">
                Información personal
            </p>

            <h2 className="mt-2 text-2xl font-bold text-kam-navy">
                Datos del paciente
            </h2>

            <p className="mt-3 leading-7 text-kam-navy/70">
                Estos datos se utilizarán para personalizar tu
                experiencia dentro de KAM.
            </p>

            {saved && (
                <p
                    aria-live="polite"
                    className="mt-6 border-l-4 border-kam-blue bg-kam-gray px-4 py-3 text-sm font-semibold text-kam-navy"
                    role="status"
                >
                    Tus datos fueron guardados correctamente.
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
                action={savePatientProfile}
                className="mt-7 space-y-6"
            >
                <div className="grid gap-5 sm:grid-cols-2">
                    <label className={labelClassName}>
                        Nombres
                        <input
                            autoComplete="given-name"
                            className={inputClassName}
                            defaultValue={profile?.nombres ?? ""}
                            maxLength={100}
                            name="nombres"
                            required
                            type="text"
                        />
                    </label>

                    <label className={labelClassName}>
                        Apellido paterno
                        <input
                            autoComplete="family-name"
                            className={inputClassName}
                            defaultValue={
                                profile?.apellido_paterno ?? ""
                            }
                            maxLength={80}
                            name="apellido_paterno"
                            type="text"
                        />
                    </label>

                    <label className={labelClassName}>
                        Apellido materno
                        <input
                            className={inputClassName}
                            defaultValue={
                                profile?.apellido_materno ?? ""
                            }
                            maxLength={80}
                            name="apellido_materno"
                            type="text"
                        />
                    </label>

                    <label className={labelClassName}>
                        Fecha de nacimiento
                        <input
                            className={inputClassName}
                            defaultValue={
                                profile?.fecha_nacimiento ?? ""
                            }
                            name="fecha_nacimiento"
                            type="date"
                        />
                    </label>
                </div>

                <div className="border-t border-kam-gray pt-6">
                    <p className="text-sm font-bold uppercase tracking-wider text-kam-blue">
                        Información de seguimiento
                    </p>

                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                        <label className={labelClassName}>
                            Diagnóstico principal informado
                            <input
                                className={inputClassName}
                                defaultValue={
                                    profile?.diagnostico_principal ??
                                    ""
                                }
                                maxLength={250}
                                name="diagnostico_principal"
                                placeholder="Ejemplo: Trastorno de ansiedad generalizada"
                                type="text"
                            />
                        </label>

                        <label className={labelClassName}>
                            Fecha del diagnóstico
                            <input
                                className={inputClassName}
                                defaultValue={
                                    profile?.fecha_diagnostico ?? ""
                                }
                                name="fecha_diagnostico"
                                type="date"
                            />
                        </label>
                    </div>

                    <p className="mt-3 text-xs leading-5 text-kam-navy/60">
                        Esta información es declarada por el usuario y
                        no representa una validación clínica realizada
                        por KAM.
                    </p>
                </div>

                <button
                    className="h-12 rounded-lg bg-kam-magenta px-6 font-bold text-kam-white transition hover:bg-kam-wine focus:outline-none focus:ring-4 focus:ring-kam-blue/25"
                    type="submit"
                >
                    Guardar datos personales
                </button>
            </form>
        </section>
    );
}