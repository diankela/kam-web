"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function PasswordSetupForm() {
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] =
        useState("");

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<
        "success" | "error" | ""
    >("");

    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        setMessage("");
        setMessageType("");

        if (password.length < 8) {
            setMessageType("error");
            setMessage(
                "La contraseña debe contener al menos 8 caracteres.",
            );
            return;
        }

        if (password !== passwordConfirmation) {
            setMessageType("error");
            setMessage("Las contraseñas no coinciden.");
            return;
        }

        setIsLoading(true);

        try {
            const supabase = createClient();

            const { error } =
                await supabase.auth.updateUser({
                    password,
                });

            if (error) {
                setMessageType("error");
                setMessage(
                    "No fue posible guardar la contraseña. Solicita una nueva invitación.",
                );
                return;
            }

            const { error: signOutError } =
                await supabase.auth.signOut({
                    scope: "local",
                });

            if (signOutError) {
                setMessageType("success");
                setMessage(
                    "La contraseña fue guardada. Ya puedes iniciar sesión.",
                );
                return;
            }

            router.replace("/login?cuenta=activada");
            router.refresh();
        } catch {
            setMessageType("error");
            setMessage(
                "No fue posible conectar con Supabase.",
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form
            className="mt-8 space-y-5"
            onSubmit={handleSubmit}
        >
            <div>
                <label
                    className="mb-2 block text-sm font-semibold text-kam-navy"
                    htmlFor="password"
                >
                    Nueva contraseña
                </label>

                <input
                    autoComplete="new-password"
                    className="h-12 w-full rounded-lg border border-kam-navy/20 bg-kam-gray px-4 text-kam-navy outline-none transition placeholder:text-kam-navy/45 focus:border-kam-blue focus:bg-kam-white focus:ring-4 focus:ring-kam-blue/15"
                    id="password"
                    minLength={8}
                    name="password"
                    onChange={(event) =>
                        setPassword(event.target.value)
                    }
                    placeholder="Mínimo 8 caracteres"
                    required
                    type="password"
                    value={password}
                />
            </div>

            <div>
                <label
                    className="mb-2 block text-sm font-semibold text-kam-navy"
                    htmlFor="password_confirmation"
                >
                    Confirmar contraseña
                </label>

                <input
                    autoComplete="new-password"
                    className="h-12 w-full rounded-lg border border-kam-navy/20 bg-kam-gray px-4 text-kam-navy outline-none transition placeholder:text-kam-navy/45 focus:border-kam-blue focus:bg-kam-white focus:ring-4 focus:ring-kam-blue/15"
                    id="password_confirmation"
                    minLength={8}
                    name="password_confirmation"
                    onChange={(event) =>
                        setPasswordConfirmation(
                            event.target.value,
                        )
                    }
                    placeholder="Repite la contraseña"
                    required
                    type="password"
                    value={passwordConfirmation}
                />
            </div>

            {message && (
                <p
                    aria-live="polite"
                    className={`border-l-4 bg-kam-gray px-4 py-3 text-sm leading-5 ${
                        messageType === "success"
                            ? "border-kam-blue text-kam-navy"
                            : "border-kam-magenta text-kam-wine"
                    }`}
                    role={
                        messageType === "error"
                            ? "alert"
                            : "status"
                    }
                >
                    {message}
                </p>
            )}

            <button
                className="h-12 w-full rounded-lg bg-kam-magenta font-bold text-kam-white transition hover:bg-kam-wine focus:outline-none focus:ring-4 focus:ring-kam-blue/25 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isLoading}
                type="submit"
            >
                {isLoading
                    ? "Guardando..."
                    : "Guardar contraseña"}
            </button>
        </form>
    );
}