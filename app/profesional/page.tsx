import Image from "next/image";
import { redirect } from "next/navigation";

import { logout } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ProfessionalPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const {
        data: professionalLinks,
        error: professionalError,
    } = await supabase
        .from("profesionales_salud")
        .select(
            `
                id,
                nombres,
                apellidos,
                tratamiento_profesional,
                profesion
            `,
        )
        .eq("profesional_user_id", user.id);

    if (
        professionalError ||
        !professionalLinks ||
        professionalLinks.length === 0
    ) {
        redirect("/login?error=sin_acceso");
    }

    const professional = professionalLinks[0];

    const professionalName = [
        professional.tratamiento_profesional,
        professional.nombres,
        professional.apellidos,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className="min-h-screen bg-kam-gray">
            <header className="bg-kam-navy text-kam-white">
                <div className="mx-auto flex min-h-18 w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-3 sm:px-8">
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
                                Portal profesional
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="rounded-lg border border-kam-white/15 bg-kam-white/10 px-4 py-2">
                            <p className="text-xs font-bold uppercase tracking-wide text-kam-white/60">
                                Sesión profesional
                            </p>

                            <p className="max-w-56 truncate text-sm font-semibold">
                                {user.email ??
                                    professionalName}
                            </p>
                        </div>

                        <form action={logout}>
                            <button
                                className="rounded bg-kam-magenta px-4 py-3 text-sm font-semibold text-kam-white transition hover:bg-kam-wine focus:outline-none focus:ring-4 focus:ring-kam-blue/30"
                                type="submit"
                            >
                                Cerrar sesión
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
                <section className="rounded-xl bg-kam-white p-8 shadow-[0_16px_45px_rgba(15,36,96,0.12)] sm:p-10">
                    <p className="text-sm font-bold uppercase tracking-wider text-kam-blue">
                        Acceso autorizado
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-kam-navy">
                        Portal del profesional
                    </h1>

                    <p className="mt-4 max-w-2xl leading-7 text-kam-navy/70">
                        Tu cuenta fue reconocida como parte de un
                        equipo de atención registrado en KAM.
                    </p>

                    <div className="mt-8 grid gap-5 md:grid-cols-2">
                        <div className="border-l-4 border-kam-magenta bg-kam-gray px-5 py-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-kam-wine">
                                Identidad profesional
                            </p>

                            <p className="mt-2 text-lg font-bold text-kam-navy">
                                {professionalName}
                            </p>

                            <p className="mt-1 text-sm text-kam-navy/70">
                                {professional.profesion}
                            </p>
                        </div>

                        <div className="border-l-4 border-kam-blue bg-kam-gray px-5 py-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-kam-wine">
                                Vínculos autorizados
                            </p>

                            <p className="mt-2 text-3xl font-bold text-kam-navy">
                                {professionalLinks.length}
                            </p>

                            <p className="mt-1 text-sm text-kam-navy/70">
                                {professionalLinks.length === 1
                                    ? "Paciente vinculado"
                                    : "Pacientes vinculados"}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mt-8 rounded-xl border border-kam-blue/20 bg-kam-white p-8 shadow-[0_16px_45px_rgba(15,36,96,0.08)]">
                    <h2 className="text-xl font-bold text-kam-navy">
                        Visualización clínica en preparación
                    </h2>

                    <p className="mt-3 max-w-3xl leading-7 text-kam-navy/70">
                        En la siguiente etapa se incorporarán los
                        pacientes autorizados y sus registros de
                        seguimiento en modalidad de solo lectura.
                    </p>
                </section>
            </main>
        </div>
    );
}