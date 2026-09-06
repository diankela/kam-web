import Image from "next/image";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import PasswordSetupForm from "./PasswordSetupForm";

export const dynamic = "force-dynamic";

export default async function PasswordSetupPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login?error=invitacion");
    }

    return (
        <div className="flex min-h-screen flex-col bg-kam-gray">
            <header className="bg-kam-navy text-kam-white">
                <div className="mx-auto flex min-h-18 w-full max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
                    <div className="flex items-center gap-3">
                        <Image
                            alt="Símbolo de KAM"
                            className="h-12 w-12 shrink-0 object-contain"
                            height={96}
                            priority
                            src="/images/kam-logo-header.png"
                            width={96}
                        />

                        <div>
                            <p className="text-xl font-bold">
                                KAM
                            </p>

                            <p className="text-xs text-kam-white/70">
                                Kent Anxiety Manager
                            </p>
                        </div>
                    </div>

                    <div className="rounded bg-kam-magenta px-4 py-2 text-sm font-semibold">
                        Acceso profesional
                    </div>
                </div>
            </header>

            <div className="bg-kam-blue text-kam-white">
                <div className="mx-auto w-full max-w-6xl px-5 py-3 text-sm sm:px-8">
                    Activación segura de cuenta
                </div>
            </div>

            <main className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
                <section className="w-full max-w-xl rounded-xl bg-kam-white p-8 shadow-[0_20px_60px_rgba(15,36,96,0.16)] sm:p-10">
                    <p className="text-sm font-bold uppercase tracking-wider text-kam-blue">
                        Invitación aceptada
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-kam-navy">
                        Establece tu contraseña
                    </h1>

                    <p className="mt-4 text-sm leading-6 text-kam-navy/70">
                        Crea una contraseña para proteger tu
                        cuenta profesional y acceder posteriormente
                        a KAM.
                    </p>

                    <div className="mt-5 border-l-4 border-kam-blue bg-kam-gray px-4 py-3">
                        <p className="text-xs font-bold uppercase tracking-wide text-kam-wine">
                            Cuenta profesional
                        </p>

                        <p className="mt-1 break-all text-sm font-semibold text-kam-navy">
                            {user.email ??
                                "Correo confirmado"}
                        </p>
                    </div>

                    <PasswordSetupForm />

                    <p className="mt-6 text-center text-xs leading-5 text-kam-navy/60">
                        Después de guardar la contraseña podrás
                        iniciar sesión con tu correo profesional.
                    </p>
                </section>
            </main>
        </div>
    );
}