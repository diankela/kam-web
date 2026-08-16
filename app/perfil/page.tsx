import { redirect } from "next/navigation";

import AppHeader from "@/app/components/AppHeader";
import { createClient } from "@/lib/supabase/server";
import HealthProfessionalForm from "./components/HealthProfessionalForm";
import PatientProfileForm from "./components/PatientProfileForm";
import HealthProfessionalList from "./components/HealthProfessionalList";

export const dynamic = "force-dynamic";

type PerfilPageProps = {
    searchParams: Promise<{
        guardado?: string;
        error?: string;
        profesional_guardado?: string;
        profesional_error?: string;
        profesional_eliminado?: string;
        profesional_lista_error?: string;
        profesional_actualizado?: string;
        principal_guardado?: string;
    }>;
};
const ERROR_MESSAGES: Record<string, string> = {
    nombre: "Debes ingresar al menos tus nombres.",
    longitud:
        "Uno de los campos supera la longitud permitida.",
    fecha: "Una de las fechas ingresadas no es válida.",
    guardar:
        "No fue posible guardar tus datos. Intenta nuevamente.",
};

const PROFESSIONAL_ERROR_MESSAGES: Record<
    string,
    string
> = {
    requeridos:
        "Debes ingresar los nombres, apellidos y profesión.",
    funcion:
        "Debes seleccionar una función válida para el profesional.",
    longitud:
        "Uno de los datos del profesional supera la longitud permitida.",
    email:
        "El correo electrónico del profesional no es válido.",
    fecha:
        "La fecha de inicio de atención no es válida.",
    perfil:
        "Primero debes guardar tus datos personales.",
    guardar:
        "No fue posible agregar el profesional. Intenta nuevamente.",
};

const PROFESSIONAL_LIST_ERROR_MESSAGES: Record<
    string,
    string
> = {
    id: "El identificador del profesional no es válido.",
    eliminar:
        "No fue posible eliminar el profesional.",
    principal:
        "No fue posible cambiar el profesional principal.",
    editar_id:
        "El identificador del profesional no es válido.",
    editar_requeridos:
        "Debes completar los nombres, apellidos y profesión.",
    editar_longitud:
        "Uno de los campos supera la longitud permitida.",
    editar_email:
        "El correo electrónico ingresado no es válido.",
    editar_fecha:
        "La fecha de inicio de atención no es válida.",
    editar_funcion:
        "La función de seguimiento seleccionada no es válida.",
    editar_guardar:
        "No fue posible actualizar los datos del profesional.",
};

export default async function PerfilPage({
    searchParams,
}: PerfilPageProps) {
    const params = await searchParams;
    const professionalListErrorMessage =
        params.profesional_lista_error
            ? PROFESSIONAL_LIST_ERROR_MESSAGES[
            params.profesional_lista_error
            ] ??
            "No fue posible procesar los datos del profesional."
            : null;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const {
        data: profile,
        error: profileError,
    } = await supabase
        .from("pacientes")
        .select(
            `
                nombres,
                apellido_paterno,
                apellido_materno,
                fecha_nacimiento,
                diagnostico_principal,
                fecha_diagnostico
            `,
        )
        .eq("user_id", user.id)
        .maybeSingle();

    const {
        data: professionals,
        error: professionalsError,
    } = await supabase
        .from("profesionales_salud")
        .select(
            `
                id,
                nombres,
                apellidos,
                profesion,
                funcion_seguimiento,
                especialidad,
                centro_salud,
                email,
                telefono,
                fecha_inicio_atencion,
                es_principal
            `,
        )
        .eq("paciente_id", user.id)
        .order("es_principal", { ascending: false })
        .order("apellidos", { ascending: true })
        .order("nombres", { ascending: true });

    const errorMessage = params.error
        ? ERROR_MESSAGES[params.error] ??
        "No fue posible procesar la solicitud."
        : null;

    const professionalErrorMessage =
        params.profesional_error
            ? PROFESSIONAL_ERROR_MESSAGES[
            params.profesional_error
            ] ??
            "No fue posible procesar los datos del profesional."
            : null;


    return (
        <div className="min-h-screen bg-kam-gray">
            <AppHeader
                activePage="perfil"
                email={user.email ?? "Usuario"}
            />

            <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
                {params.profesional_eliminado === "1" && (
                    <div
                        className="mb-6 border-l-4 border-kam-blue bg-kam-white px-5 py-4 text-sm font-semibold text-kam-navy shadow-[0_10px_30px_rgba(15,36,96,0.08)]"
                        role="status"
                    >
                        El profesional fue eliminado correctamente.
                    </div>
                )}

                {params.profesional_actualizado === "1" && (
                    <div
                        className="mb-6 border-l-4 border-kam-blue bg-kam-white px-5 py-4 text-sm font-semibold text-kam-navy shadow-[0_10px_30px_rgba(15,36,96,0.08)]"
                        role="status"
                    >
                        Los datos del profesional fueron actualizados correctamente.
                    </div>
                )}

                {params.principal_guardado === "1" && (
                    <div
                        className="mb-6 border-l-4 border-kam-blue bg-kam-white px-5 py-4 text-sm font-semibold text-kam-navy shadow-[0_10px_30px_rgba(15,36,96,0.08)]"
                        role="status"
                    >
                        El profesional principal fue actualizado correctamente.
                    </div>
                )}

                {professionalListErrorMessage && (
                    <div
                        className="mb-6 border-l-4 border-kam-magenta bg-kam-white px-5 py-4 text-sm font-semibold text-kam-wine shadow-[0_10px_30px_rgba(15,36,96,0.08)]"
                        role="alert"
                    >
                        {professionalListErrorMessage}
                    </div>
                )}
                {professionalsError ? (
                    <section className="mt-8 rounded-xl bg-kam-white p-8 text-kam-wine shadow-[0_16px_45px_rgba(15,36,96,0.12)]">
                        No fue posible cargar los profesionales de salud.
                    </section>
                ) : (
                    <HealthProfessionalList
                        professionals={professionals ?? []}
                    />
                )}
                <HealthProfessionalForm
                    errorMessage={professionalErrorMessage}
                    saved={params.profesional_guardado === "1"}
                />

                <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
                    {profileError ? (
                        <section className="rounded-xl bg-kam-white p-8 text-kam-wine shadow-[0_16px_45px_rgba(15,36,96,0.12)]">
                            No fue posible cargar tus datos personales.
                        </section>
                    ) : (
                        <PatientProfileForm
                            errorMessage={errorMessage}
                            profile={profile}
                            saved={params.guardado === "1"}
                        />
                    )}

                    <section className="rounded-xl bg-kam-white p-8 shadow-[0_16px_45px_rgba(15,36,96,0.12)]">
                        <p className="text-sm font-bold uppercase tracking-wider text-kam-magenta">
                            Equipo de atención
                        </p>

                        <h2 className="mt-2 text-2xl font-bold text-kam-navy">
                            Profesionales de salud
                        </h2>

                        <p className="mt-3 leading-7 text-kam-navy/70">
                            Aquí podrás registrar y administrar los
                            profesionales responsables de tu seguimiento.
                        </p>
                    </section>
                </div>

            </main>
        </div>
    );
}