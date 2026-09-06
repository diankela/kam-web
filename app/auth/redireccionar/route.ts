import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.redirect(
            new URL("/login", request.url),
        );
    }

    const [
        {
            data: patient,
            error: patientError,
        },
        {
            data: professionalLinks,
            error: professionalError,
        },
    ] = await Promise.all([
        supabase
            .from("pacientes")
            .select("user_id")
            .eq("user_id", user.id)
            .maybeSingle(),
        supabase
            .from("profesionales_salud")
            .select("id")
            .eq("profesional_user_id", user.id)
            .limit(1),
    ]);

    if (!patientError && patient) {
        return NextResponse.redirect(
            new URL("/dashboard", request.url),
        );
    }

    if (
        !professionalError &&
        professionalLinks &&
        professionalLinks.length > 0
    ) {
        return NextResponse.redirect(
            new URL("/profesional", request.url),
        );
    }

    await supabase.auth.signOut({
        scope: "local",
    });

    const errorCode =
        patientError || professionalError
            ? "verificacion"
            : "sin_acceso";

    return NextResponse.redirect(
        new URL(
            `/login?error=${errorCode}`,
            request.url,
        ),
    );
}