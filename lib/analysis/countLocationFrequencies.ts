import {
    LOCATION_CATEGORIES,
    type LocationCategoryDefinition,
} from "./locationCategories";
import { normalizeText } from "./normalizeText";

export type EventWithLocation = {
    id: number | string;
    lugar: string | null;
};

export type LocationCategoryId =
    LocationCategoryDefinition["id"];

export type LocationFrequency = {
    id: LocationCategoryId;
    label: string;
    count: number;
    percentage: number;
};

export type LocationFrequencySummary = {
    totalEvents: number;
    analyzedEvents: number;
    items: LocationFrequency[];
};

const NORMALIZED_CATEGORIES =
    LOCATION_CATEGORIES.filter(
        (category) => category.id !== "otros",
    ).map((category) => ({
        ...category,
        keywords: category.keywords.map(
            normalizeText,
        ),
    }));

function containsPhrase(
    text: string,
    phrase: string,
) {
    return ` ${text} `.includes(` ${phrase} `);
}

function classifySingleLocation(
    location: string,
): LocationCategoryId {
    const normalizedLocation =
        normalizeText(location);

    const matches = NORMALIZED_CATEGORIES.filter(
        (category) =>
            category.keywords.some((keyword) =>
                containsPhrase(
                    normalizedLocation,
                    keyword,
                ),
            ),
    );

    return matches.length === 1
        ? matches[0].id
        : "otros";
}

export function classifyLocation(
    location: string,
): LocationCategoryId {
    const segments = location
        .split(/[.,;/]+/)
        .map((segment) => segment.trim())
        .filter(Boolean);

    if (segments.length > 1) {
        const segmentCategories = new Set(
            segments.map(classifySingleLocation),
        );

        if (
            segmentCategories.size > 1 ||
            segmentCategories.has("otros")
        ) {
            return "otros";
        }
    }

    return classifySingleLocation(location);
}

export function countLocationFrequencies(
    events: EventWithLocation[],
): LocationFrequencySummary {
    const uniqueEvents = new Map(
        events.map((event) => [event.id, event]),
    );

    const counts = new Map<
        LocationCategoryId,
        number
    >();

    let analyzedEvents = 0;

    uniqueEvents.forEach((event) => {
        if (!event.lugar?.trim()) {
            return;
        }

        analyzedEvents += 1;

        const categoryId = classifyLocation(
            event.lugar,
        );

        counts.set(
            categoryId,
            (counts.get(categoryId) ?? 0) + 1,
        );
    });

    const items = LOCATION_CATEGORIES.map(
        (category) => {
            const count =
                counts.get(category.id) ?? 0;

            return {
                id: category.id,
                label: category.label,
                count,
                percentage:
                    analyzedEvents > 0
                        ? Number(
                              (
                                  (count /
                                      analyzedEvents) *
                                  100
                              ).toFixed(1),
                          )
                        : 0,
            };
        },
    )
        .filter((item) => item.count > 0)
        .sort(
            (first, second) =>
                second.count - first.count,
        );

    return {
        totalEvents: uniqueEvents.size,
        analyzedEvents,
        items,
    };
}