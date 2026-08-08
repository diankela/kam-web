import { normalizeText } from "./normalizeText";

export type EventWithEmotions = {
    id: number | string;
    est_emo_pre: string | null;
};

export type EmotionFrequency = {
    id: string;
    label: string;
    count: number;
    percentage: number;
};

export type EmotionFrequencySummary = {
    totalEvents: number;
    analyzedEvents: number;
    items: EmotionFrequency[];
};

const EMOTION_LABELS: Record<string, string> = {
    ansiedad: "Ansiedad",
    miedo: "Miedo",
    frustracion: "Frustración",
    culpa: "Culpa",
    desesperanza: "Desesperanza",
    soledad: "Soledad",
    tristeza: "Tristeza",
    vacio: "Vacío",
    verguenza: "Vergüenza",
    enojo: "Enojo",
};

function formatEmotionLabel(emotion: string) {
    return (
        EMOTION_LABELS[emotion] ??
        emotion.charAt(0).toUpperCase() +
            emotion.slice(1)
    );
}

export function countEmotionFrequencies(
    events: EventWithEmotions[],
): EmotionFrequencySummary {
    const uniqueEvents = new Map(
        events.map((event) => [event.id, event]),
    );

    const counts = new Map<string, number>();
    let analyzedEvents = 0;

    uniqueEvents.forEach((event) => {
        if (!event.est_emo_pre?.trim()) {
            return;
        }

        const emotions = new Set(
            event.est_emo_pre
                .split(",")
                .map((emotion) =>
                    normalizeText(emotion),
                )
                .filter(Boolean),
        );

        if (emotions.size === 0) {
            return;
        }

        analyzedEvents += 1;

        emotions.forEach((emotion) => {
            counts.set(
                emotion,
                (counts.get(emotion) ?? 0) + 1,
            );
        });
    });

    const items = Array.from(counts.entries())
        .map(([id, count]) => ({
            id,
            label: formatEmotionLabel(id),
            count,
            percentage:
                analyzedEvents > 0
                    ? Number(
                          (
                              (count / analyzedEvents) *
                              100
                          ).toFixed(1),
                      )
                    : 0,
        }))
        .sort(
            (first, second) =>
                second.count - first.count ||
                first.label.localeCompare(
                    second.label,
                    "es-CL",
                ),
        );

    return {
        totalEvents: uniqueEvents.size,
        analyzedEvents,
        items,
    };
}