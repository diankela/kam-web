
import Image from "next/image";
import Link from "next/link";

import { logout } from "@/app/actions/auth";

type AppHeaderProps = {
    email: string;
    activePage: "dashboard" | "analisis" | "eventos";
};

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

export default function AppHeader({
    email,
    activePage,
}: AppHeaderProps) {
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
                        <div className="hidden items-center gap-3 rounded-lg border border-kam-white/15 bg-kam-white/10 px-4 py-2 sm:flex">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-kam-blue font-bold">
                                @
                            </div>

                            <div>
                                <p className="text-xs font-bold uppercase tracking-wide text-kam-white/60">
                                    Sesión activa
                                </p>

                                <p className="max-w-52 truncate text-sm font-semibold">
                                    {email}
                                </p>
                            </div>
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
                                className={`rounded border px-4 py-2 text-sm font-semibold transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kam-magenta ${isActive
                                    ? "border-kam-navy bg-kam-navy text-kam-white hover:border-kam-navy"
                                    : "border-transparent text-kam-navy hover:border-kam-blue hover:bg-kam-blue hover:text-kam-white"
                                    }`}
                                href={item.href}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </>
    );
}