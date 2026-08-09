export type LocationCategoryDefinition = {
    id:
        | "casa"
        | "trabajo"
        | "transporte_publico"
        | "calle"
        | "otros";
    label: string;
    keywords: readonly string[];
};

export const LOCATION_CATEGORIES = [
    {
        id: "casa",
        label: "Casa",
        keywords: [
            "casa",
            "hogar",
            "domicilio",
            "departamento",
            "habitacion",
            "pieza",
        ],
    },
    {
        id: "trabajo",
        label: "Trabajo",
        keywords: [
            "trabajo",
            "oficina",
            "laboral",
        ],
    },
    {
        id: "transporte_publico",
        label: "Transporte público",
        keywords: [
            "transporte",
            "transporte publico",
            "metro",
            "micro",
            "bus",
            "colectivo",
            "tren",
        ],
    },
    {
        id: "calle",
        label: "Calle",
        keywords: [
            "calle",
            "via publica",
        ],
    },
    {
        id: "otros",
        label: "Otros",
        keywords: [],
    },
] as const satisfies readonly LocationCategoryDefinition[];