"use client";

import { useSearchParams } from "next/navigation";

export default function LoginQueryFeedback() {
    const searchParams = useSearchParams();

    const accountActivated =
        searchParams.get("cuenta") === "activada";

    const errorCode = searchParams.get("error");

    const feedback = accountActivated
        ? {
              message:
                  "Tu cuenta profesional fue activada correctamente. Ya puedes iniciar sesión.",
              type: "success" as const,
          }
        : errorCode === "invitacion"
          ? {
                message:
                    "El enlace de invitación no es válido o ha expirado. Solicita una nueva invitación.",
                type: "error" as const,
            }
          : errorCode === "sin_acceso"
            ? {
                  message:
                      "Esta cuenta no tiene un perfil autorizado en KAM.",
                  type: "error" as const,
              }
            : errorCode === "verificacion"
              ? {
                    message:
                        "No fue posible verificar el tipo de cuenta. Intenta nuevamente.",
                    type: "error" as const,
                }
              : null;

    if (!feedback) {
        return null;
    }

    return (
        <p
            aria-live="polite"
            className={`border-l-4 bg-kam-gray px-4 py-3 text-sm leading-5 ${
                feedback.type === "error"
                    ? "border-kam-magenta text-kam-wine"
                    : "border-kam-blue text-kam-navy"
            }`}
            role={
                feedback.type === "error"
                    ? "alert"
                    : "status"
            }
        >
            {feedback.message}
        </p>
    );
}