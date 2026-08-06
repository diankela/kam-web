import { redirect } from "next/navigation";
import { logout } from "./actions";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-kam-gray">
            <header className="bg-kam-navy text-kam-white">
                <div className="mx-auto flex min-h-18 w-full max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded bg-kam-blue text-xl font-bold">
                            K
                        </div>

                        <div>
                            <p className="text-xl font-bold">KAM</p>

                            <p className="text-xs text-kam-white/70">
                                Kent Anxiety Manager
                            </p>
                        </div>
                    </div>

                    <form action={logout}>
                        <button
                            className="rounded bg-kam-magenta px-4 py-2 text-sm font-semibold text-kam-white transition hover:bg-kam-wine focus:outline-none focus:ring-4 focus:ring-kam-blue/30"
                            type="submit"
                        >
                            Cerrar sesión
                        </button>
                    </form>
                </div>
            </header>

            <div className="bg-kam-blue text-kam-white">
                <div className="mx-auto w-full max-w-6xl px-5 py-3 text-sm sm:px-8">
                    Panel principal
                </div>
            </div>

            <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
                <section className="rounded-xl bg-kam-white p-8 shadow-[0_16px_45px_rgba(15,36,96,0.12)] sm:p-10">
                    <p className="text-sm font-bold uppercase tracking-wider text-kam-blue">
                        Acceso autorizado
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-kam-navy">
                        Bienvenido a KAM
                    </h1>

                    <p className="mt-4 max-w-2xl leading-7 text-kam-navy/70">
                        Tu identidad fue validada correctamente por Supabase. Desde este
                        panel podrás acceder posteriormente a los registros y métricas de
                        seguimiento.
                    </p>

                    <div className="mt-8 border-l-4 border-kam-magenta bg-kam-gray px-5 py-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-kam-wine">
                            Usuario conectado
                        </p>

                        <p className="mt-1 font-semibold text-kam-navy">
                            {user.email}
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}