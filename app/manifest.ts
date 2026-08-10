import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "KAM - Kent Anxiety Manager",
        short_name: "KAM",
        description:
            "Plataforma privada de seguimiento y registro personal.",
        start_url: "/dashboard",
        scope: "/",
        display: "standalone",
        background_color: "#ebeef2",
        theme_color: "#0f2460",
        lang: "es-CL",
        icons: [
            {
                src: "/icons/kam-icon-192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "/icons/kam-icon-512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any",
            },
        ],
    };
}