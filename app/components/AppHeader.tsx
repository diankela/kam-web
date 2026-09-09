import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";

import { logout } from "@/app/actions/auth";

type AppHeaderProps = {
    email: string;
    activePage:
    | "dashboard"
    | "eventos"
    | "analisis"
    | "perfil";
};

type NavigationIconName =
    | "dashboard"
    | "eventos"
    | "analisis";

function NavigationIcon({
    name,
}: {
    name: NavigationIconName;
}) {
    if (name === "dashboard") {
        return (
            <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
            >
                <rect height="7" rx="1" width="7" x="3" y="3" />
                <rect height="7" rx="1" width="7" x="14" y="3" />
                <rect height="7" rx="1" width="7" x="3" y="14" />
                <rect height="7" rx="1" width="7" x="14" y="14" />
            </svg>
        );
    }

    if (name === "eventos") {
        return (
            <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
            >
                <path d="M8 4h8" />
                <path d="M9 2h6a1 1 0 0 1 1 1v3H8V3a1 1 0 0 1 1-1Z" />
                <path d="M6 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1" />
                <path d="M8 11h8" />
                <path d="M8 15h8" />
                <path d="M8 19h5" />
            </svg>
        );
    }

    return (
        <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
        >
            <path d="M4 19V5" />
            <path d="M4 19h16" />
            <path d="m7 15 4-4 3 2 5-6" />
        </svg>
    );
}

const NAVIGATION_ITEMS = [
    {
        id: "dashboard",
        label: "Resumen",
        href: "/dashboard",
    },
    {
        id: "eventos",
        label: "Registros",
        href: "/eventos",
    },
    {
        id: "analisis",
        label: "Análisis",
        href: "/analisis",
    },
] as const;

export default async function AppHeader({
    email,
    activePage,
}: AppHeaderProps) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    let displayName = email;

    if (user) {
        const { data: patient } = await supabase
            .from("pacientes")
            .select("nombres, apellido_paterno")
            .eq("user_id", user.id)
            .maybeSingle();

        const primerNombre =
            patient?.nombres?.trim().split(/\s+/)[0] ?? "";

        const apellidoPaterno =
            patient?.apellido_paterno?.trim() ?? "";

        const nombreCompleto = [
            primerNombre,
            apellidoPaterno,
        ]
            .filter(Boolean)
            .join(" ");

        displayName = nombreCompleto || email;
    }

    return (
        <>
            <header className="bg-kam-navy text-kam-white">
                <div className="mx-auto flex min-h-18 w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8">
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

                    <div className="flex items-center gap-3">
                        <Link
                            aria-current={
                                activePage === "perfil"
                                    ? "page"
                                    : undefined
                            }
                            className={`flex items-center gap-3 rounded-lg border px-4 py-2 transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-kam-blue/30 ${activePage === "perfil"
                                ? "border-kam-blue bg-kam-white/15"
                                : "border-kam-white/15 bg-kam-white/10 hover:border-kam-blue hover:bg-kam-white/15"
                                }`}
                            href="/perfil"
                        >
                            <div
                                aria-hidden="true"
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-kam-blue font-bold text-kam-white"
                            >
                                {displayName
                                    .trim()
                                    .charAt(0)
                                    .toUpperCase() || "P"}
                            </div>

                            <div>
                                <p className="text-xs font-bold uppercase tracking-wide text-kam-white/60">
                                    Mi cuenta
                                </p>

                                <p className="text-sm font-semibold text-kam-white">
                                    Perfil
                                </p>
                            </div>
                        </Link>
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

            <div className="bg-kam-white text-kam-navy">
                <nav
                    aria-label="Navegación principal"
                    className="mx-auto flex min-h-12 w-full max-w-6xl items-center gap-2 px-5 py-1 sm:px-8"
                >
                    {NAVIGATION_ITEMS.map((item) => {
                        const isActive =
                            item.id === activePage;

                        return (
                            <Link
                                key={item.id}
                                aria-current={
                                    isActive
                                        ? "page"
                                        : undefined
                                }
                                className={`flex min-w-20 flex-col items-center justify-center gap-1 rounded border px-10 py-2 text-sm font-semibold transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kam-magenta sm:min-w-24 ${isActive
                                        ? "border-kam-navy bg-kam-navy text-kam-white hover:border-kam-navy"
                                        : "border-transparent text-kam-navy hover:border-kam-blue hover:bg-kam-blue hover:text-kam-white"
                                    }`}
                                href={item.href}
                            >
                                <span>{item.label}</span>

                                <NavigationIcon name={item.id} />
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </>
    );
}