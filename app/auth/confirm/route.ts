import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
    const tokenHash =
        request.nextUrl.searchParams.get("token_hash");

    const type =
        request.nextUrl.searchParams.get("type");

    const requestedNext =
        request.nextUrl.searchParams.get("next");

    const redirectPath =
        requestedNext?.startsWith("/") &&
        !requestedNext.startsWith("//")
            ? requestedNext
            : "/establecer-contrasena";

    if (tokenHash && type === "invite") {
        const supabase = await createClient();

        const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type,
        });

        if (!error) {
            return NextResponse.redirect(
                new URL(redirectPath, request.url),
            );
        }
    }

    return NextResponse.redirect(
        new URL("/login?error=invitacion", request.url),
    );
}