import { normalizeText } from "./normalizeText";
import { SYMPTOM_DICTIONARY } from "./symptomDictionary";

export type ExtractedSymptom = {
    id: string;
    label: string;
};

const NEGATION_MARKERS = new Set([
    "no",
    "sin",
    "nunca",
    "jamas",
    "tampoco",
    "ni",
]);

const NEGATION_WINDOW_SIZE = 4;

const NORMALIZED_DICTIONARY = SYMPTOM_DICTIONARY.map(
    (definition) => ({
        id: definition.id,
        label: definition.label,
        variants: definition.variants
            .map((variant) => normalizeText(variant).split(" "))
            .sort((first, second) => second.length - first.length),
    }),
);

function isNegated(
    textTokens: string[],
    phraseStart: number,
) {
    const contextStart = Math.max(
        0,
        phraseStart - NEGATION_WINDOW_SIZE,
    );

    const previousTokens = textTokens.slice(
        contextStart,
        phraseStart,
    );

    return previousTokens.some((token) =>
        NEGATION_MARKERS.has(token),
    );
}

function containsAffirmedPhrase(
    textTokens: string[],
    phraseTokens: string[],
) {
    if (
        phraseTokens.length === 0 ||
        phraseTokens.length > textTokens.length
    ) {
        return false;
    }

    const finalStart =
        textTokens.length - phraseTokens.length;

    for (
        let start = 0;
        start <= finalStart;
        start += 1
    ) {
        const matches = phraseTokens.every(
            (token, position) =>
                textTokens[start + position] === token,
        );

        if (!matches) {
            continue;
        }

        if (!isNegated(textTokens, start)) {
            return true;
        }
    }

    return false;
}

export function extractSymptoms(
    text: string,
): ExtractedSymptom[] {
    const normalizedText = normalizeText(text);

    if (!normalizedText) {
        return [];
    }

    const textTokens = normalizedText.split(" ");

    return NORMALIZED_DICTIONARY
        .filter((definition) =>
            definition.variants.some((variantTokens) =>
                containsAffirmedPhrase(
                    textTokens,
                    variantTokens,
                ),
            ),
        )
        .map((definition) => ({
            id: definition.id,
            label: definition.label,
        }));
}