"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;



export async function savePatientProfile(formData: FormData) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const nombres = String(
        formData.get("nombres") ?? "",
    ).trim();

    const apellidoPaterno = String(
        formData.get("apellido_paterno") ?? "",
    ).trim();

    const apellidoMaterno = String(
        formData.get("apellido_materno") ?? "",
    ).trim();

    const fechaNacimiento = String(
        formData.get("fecha_nacimiento") ?? "",
    ).trim();

    const diagnosticoPrincipal = String(
        formData.get("diagnostico_principal") ?? "",
    ).trim();

    const fechaDiagnostico = String(
        formData.get("fecha_diagnostico") ?? "",
    ).trim();

    if (!nombres) {
        redirect("/perfil?error=nombre");
    }

    if (
        nombres.length > 100 ||
        apellidoPaterno.length > 80 ||
        apellidoMaterno.length > 80 ||
        diagnosticoPrincipal.length > 250
    ) {
        redirect("/perfil?error=longitud");
    }

    if (
        (fechaNacimiento &&
            !DATE_PATTERN.test(fechaNacimiento)) ||
        (fechaDiagnostico &&
            !DATE_PATTERN.test(fechaDiagnostico))
    ) {
        redirect("/perfil?error=fecha");
    }

    const { error } = await supabase
        .from("pacientes")
        .upsert(
            {
                user_id: user.id,
                nombres,
                apellido_paterno:
                    apellidoPaterno || null,
                apellido_materno:
                    apellidoMaterno || null,
                fecha_nacimiento:
                    fechaNacimiento || null,
                diagnostico_principal:
                    diagnosticoPrincipal || null,
                fecha_diagnostico:
                    fechaDiagnostico || null,
                updated_at: new Date().toISOString(),
            },
            {
                onConflict: "user_id",
            },
        );

    if (error) {
        redirect("/perfil?error=guardar");
    }

    revalidatePath("/perfil");
    revalidatePath("/dashboard");

    redirect("/perfil?guardado=1");
}

export async function createHealthProfessional(
    formData: FormData,
) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const nombres = String(
        formData.get("nombres_profesional") ?? "",
    ).trim();

    const apellidos = String(
        formData.get("apellidos_profesional") ?? "",
    ).trim();

    const profesion = String(
        formData.get("profesion") ?? "",
    ).trim();

    const funcionSeguimiento = String(
        formData.get("funcion_seguimiento") ?? "otro",
    ).trim();

    const especialidad = String(
        formData.get("especialidad") ?? "",
    ).trim();

    const centroSalud = String(
        formData.get("centro_salud") ?? "",
    ).trim();

    const email = String(
        formData.get("email_profesional") ?? "",
    ).trim();

    const telefono = String(
        formData.get("telefono") ?? "",
    ).trim();

    const fechaInicioAtencion = String(
        formData.get("fecha_inicio_atencion") ?? "",
    ).trim();

    if (!nombres || !apellidos || !profesion) {
        redirect(
            "/perfil?profesional_error=requeridos#profesionales",
        );
    }

    if (
        nombres.length > 100 ||
        apellidos.length > 120 ||
        profesion.length > 100 ||
        especialidad.length > 120 ||
        centroSalud.length > 150 ||
        email.length > 254 ||
        telefono.length > 30
    ) {
        redirect(
            "/perfil?profesional_error=longitud#profesionales",
        );
    }

    if (email && !EMAIL_PATTERN.test(email)) {
        redirect(
            "/perfil?profesional_error=email#profesionales",
        );
    }

    if (
        fechaInicioAtencion &&
        !DATE_PATTERN.test(fechaInicioAtencion)
    ) {
        redirect(
            "/perfil?profesional_error=fecha#profesionales",
        );
    }
    if (
        !PROFESSIONAL_FUNCTIONS.has(
            funcionSeguimiento,
        )
    ) {
        redirect(
            "/perfil?profesional_error=funcion#profesionales",
        );
    }

    const { data: patient, error: patientError } =
        await supabase
            .from("pacientes")
            .select("user_id")
            .eq("user_id", user.id)
            .maybeSingle();

    if (patientError || !patient) {
        redirect(
            "/perfil?profesional_error=perfil#profesionales",
        );
    }

    const { error } = await supabase
        .from("profesionales_salud")
        .insert({
            paciente_id: user.id,
            nombres,
            apellidos,
            profesion,
            funcion_seguimiento: funcionSeguimiento,
            especialidad: especialidad || null,
            centro_salud: centroSalud || null,
            email: email || null,
            telefono: telefono || null,
            fecha_inicio_atencion:
                fechaInicioAtencion || null,
            updated_at: new Date().toISOString(),
        });

    if (error) {
        redirect(
            "/perfil?profesional_error=guardar#profesionales",
        );
    }

    revalidatePath("/perfil");

    redirect(
        "/perfil?profesional_guardado=1#profesionales",
    );
}

export async function setPrimaryHealthProfessional(
    formData: FormData,
) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const professionalId = String(
        formData.get("professional_id") ?? "",
    ).trim();

    if (!UUID_PATTERN.test(professionalId)) {
        redirect(
            "/perfil?profesional_lista_error=id#profesionales-registrados",
        );
    }

    const { error } = await supabase.rpc(
        "marcar_profesional_principal",
        {
            p_profesional_id: professionalId,
        },
    );

    if (error) {
        redirect(
            "/perfil?profesional_lista_error=principal#profesionales-registrados",
        );
    }

    revalidatePath("/perfil");
    revalidatePath("/dashboard");

    redirect(
        "/perfil?principal_guardado=1#profesionales-registrados",
    );
}

const PROFESSIONAL_FUNCTIONS = new Set([
    "psicoterapia",
    "control_medicamentos",
    "atencion_general",
    "otro",
]);

export async function updateHealthProfessionalFunction(
    formData: FormData,
) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const professionalId = String(
        formData.get("professional_id") ?? "",
    ).trim();

    const funcionSeguimiento = String(
        formData.get("funcion_seguimiento") ?? "",
    ).trim();

    if (
        !UUID_PATTERN.test(professionalId) ||
        !PROFESSIONAL_FUNCTIONS.has(
            funcionSeguimiento,
        )
    ) {
        redirect(
            "/perfil?profesional_lista_error=funcion#profesionales-registrados",
        );
    }

    const {
        data: updatedProfessional,
        error,
    } = await supabase
        .from("profesionales_salud")
        .update({
            funcion_seguimiento: funcionSeguimiento,
            updated_at: new Date().toISOString(),
        })
        .eq("id", professionalId)
        .eq("paciente_id", user.id)
        .select("id")
        .maybeSingle();

    if (error || !updatedProfessional) {
        redirect(
            "/perfil?profesional_lista_error=actualizar#profesionales-registrados",
        );
    }

    revalidatePath("/perfil");
    revalidatePath("/dashboard");

    redirect(
        "/perfil?funcion_guardada=1#profesionales-registrados",
    );
}