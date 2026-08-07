import { extractSymptoms } from "./extractSymptoms";

export type EventWithDescription = {
    id: number | string;
    descripcion: string | null;
};

export type SymptomFrequency = {
    id: string;
    label: string;
    count: number;
    percentage: number;
};

export type SymptomFrequencySummary = {
    totalEvents: number;
    analyzedEvents: number;
    items: SymptomFrequency[];
};

export function countSymptomFrequencies(
    events: EventWithDescription[],
): SymptomFrequencySummary {
    const uniqueEvents = new Map(
        events.map((event) => [event.id, event]),
    );

    const counts = new Map<
        string,
        {
            label: string;
            count: number;
        }
    >();

    let analyzedEvents = 0;

    uniqueEvents.forEach((event) => {
        if (!event.descripcion?.trim()) {
            return;
        }

        analyzedEvents += 1;

        const symptoms = extractSymptoms(
            event.descripcion,
        );

        symptoms.forEach((symptom) => {
            const current = counts.get(symptom.id);

            counts.set(symptom.id, {
                label: symptom.label,
                count: (current?.count ?? 0) + 1,
            });
        });
    });

    const items = Array.from(counts.entries())
        .map(([id, value]) => ({
            id,
            label: value.label,
            count: value.count,
            percentage:
                analyzedEvents > 0
                    ? Number(
                          (
                              (value.count / analyzedEvents) *
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