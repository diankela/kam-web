export type SymptomDefinition = {
    id: string;
    label: string;
    variants: readonly string[];
};

export const SYMPTOM_DICTIONARY = [
    {
        id: "dolor_estomago",
        label: "Dolor de estómago",
        variants: [
            "dolor de estómago",
            "dolor estomacal",
            "dolor abdominal",
            "dolor de barriga",
            "dolor barriga",
            "dolor de panza",
            "dolor panza",
            "dolía el estómago",
            "duele el estómago",
            "dolió el estómago",
            "dolía la barriga",
            "duele la barriga",
            "dolió la barriga",
            "dolía la panza",
            "duele la panza",
            "dolió la panza",
        ],
    },
    {
        id: "dolor_cabeza",
        label: "Dolor de cabeza",
        variants: [
            "dolor de cabeza",
            "dolor cabeza",
            "cefalea",
            "jaqueca",
            "dolía la cabeza",
            "duele la cabeza",
            "dolió la cabeza",
        ],
    },
    {
        id: "migrana",
        label: "Migraña",
        variants: [
            "migraña",
            "migrañas",
        ],
    },
    {
        id: "dolor_cuerpo",
        label: "Dolor corporal",
        variants: [
            "dolor de cuerpo",
            "dolor corporal",
            "dolores corporales",
            "dolor muscular",
            "dolores musculares",
            "cuerpo adolorido",
            "dolía el cuerpo",
            "duele el cuerpo",
        ],
    },
    {
        id: "dolor_pecho",
        label: "Dolor de pecho",
        variants: [
            "dolor de pecho",
            "dolor pecho",
            "dolor torácico",
            "dolía el pecho",
            "duele el pecho",
            "dolió el pecho",
        ],
    },
    {
        id: "nauseas",
        label: "Náuseas",
        variants: [
            "náusea",
            "náuseas",
            "ganas de vomitar",
            "sensación de vomitar",
            "estómago revuelto",
        ],
    },
    {
        id: "vomitos",
        label: "Vómitos",
        variants: [
            "vómito",
            "vómitos",
            "vomité",
            "estuve vomitando",
        ],
    },
    {
        id: "mareos",
        label: "Mareos",
        variants: [
            "mareo",
            "mareos",
            "sensación de mareo",
            "mareado",
            "mareada",
        ],
    },
    {
        id: "vertigo",
        label: "Vértigo",
        variants: [
            "vértigo",
            "sensación de vértigo",
        ],
    },
    {
        id: "falta_aire",
        label: "Falta de aire",
        variants: [
            "falta de aire",
            "dificultad para respirar",
            "problemas para respirar",
            "respiración dificultosa",
            "cuesta respirar",
            "costaba respirar",
        ],
    },
    {
        id: "sensacion_ahogo",
        label: "Sensación de ahogo",
        variants: [
            "sensación de ahogo",
            "sensación de asfixia",
            "me ahogo",
            "me ahogaba",
            "asfixia",
        ],
    },
    {
        id: "temblores",
        label: "Temblores",
        variants: [
            "temblor",
            "temblores",
            "temblor corporal",
            "temblores corporales",
            "temblor en el cuerpo",
            "temblor en las manos",
            "temblaban las manos",
        ],
    },
    {
        id: "espasmos",
        label: "Espasmos",
        variants: [
            "espasmo",
            "espasmos",
            "contracciones musculares",
        ],
    },
    {
        id: "sudoracion",
        label: "Sudoración",
        variants: [
            "sudoración",
            "sudor excesivo",
            "sudoración excesiva",
            "estaba sudando",
            "sudaba mucho",
        ],
    },
    {
        id: "palpitaciones",
        label: "Palpitaciones",
        variants: [
            "palpitación",
            "palpitaciones",
            "latidos acelerados",
            "corazón acelerado",
            "corazón agitado",
        ],
    },
    {
        id: "tension_muscular",
        label: "Tensión muscular",
        variants: [
            "tensión muscular",
            "rigidez muscular",
            "músculos tensos",
            "musculatura tensa",
        ],
    },
    {
        id: "fatiga",
        label: "Fatiga",
        variants: [
            "fatiga",
            "cansancio extremo",
            "agotamiento",
            "muy cansado",
            "muy cansada",
        ],
    },
    {
        id: "insomnio",
        label: "Insomnio",
        variants: [
            "insomnio",
            "dificultad para dormir",
            "problemas para dormir",
            "no pude dormir",
            "no puedo dormir",
            "desvelo",
        ],
    },
    {
        id: "vision_borrosa",
        label: "Visión borrosa",
        variants: [
            "visión borrosa",
            "vista borrosa",
            "veía borroso",
            "veo borroso",
        ],
    },
    {
        id: "zumbido_oidos",
        label: "Zumbido en los oídos",
        variants: [
            "zumbido en los oídos",
            "zumbido de oídos",
            "zumbido en el oído",
            "tinnitus",
        ],
    },
    {
        id: "sequedad_boca",
        label: "Sequedad de boca",
        variants: [
            "sequedad de boca",
            "boca seca",
            "sentía la boca seca",
        ],
    },
    {
        id: "escalofrios",
        label: "Escalofríos",
        variants: [
            "escalofrío",
            "escalofríos",
            "sentía escalofríos",
        ],
    },
    {
        id: "sofocos",
        label: "Sofocos",
        variants: [
            "sofoco",
            "sofocos",
            "calor súbito",
            "bochorno",
            "bochornos",
        ],
    },
] as const satisfies readonly SymptomDefinition[];