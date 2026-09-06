"use client";

import { useSearchParams } from "next/navigation";

export default function LoginQueryFeedback() {
    const searchParams = useSearchParams();

    const accountActivated =
        searchParams.get("cuenta") === "activada";

    const invitationError =
        searchParams.get("error") === "invitacion";

    if (!accountActivated && !invitationError) {
        return null;
    }

    const message = accountActivated
        ? "Tu cuenta profesional fue activada correctamente. Ya puedes iniciar sesión."
        : "El enlace de invitación no es válido o ha expirado. Solicita una nueva invitación.";

    return (
        <p
            aria-live="polite"
            className={`border-l-4 bg-kam-gray px-4 py-3 text-sm leading-5 ${
                invitationError
                    ? "border-kam-magenta text-kam-wine"
                    : "border-kam-blue text-kam-navy"
            }`}
            role={invitationError ? "alert" : "status"}
        >
            {message}
        </p>
    );
}