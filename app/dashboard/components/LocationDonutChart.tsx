"use client";

import { useState } from "react";
import {
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

import type {
    LocationCategoryId,
    LocationFrequencySummary,
} from "@/lib/analysis/countLocationFrequencies";

type LocationDonutChartProps = {
    summary: LocationFrequencySummary;
};

const CATEGORY_COLORS: Record<
    LocationCategoryId,
    string
> = {
    casa: "#007aff",
    trabajo: "#0f2460",
    transporte_publico: "#C60B7E",
    calle: "#9F1853",
    otros: "#ebeef2",
};

export default function LocationDonutChart({
    summary,
}: LocationDonutChartProps) {
    const [selectedId, setSelectedId] =
        useState<LocationCategoryId | null>(
            summary.items[0]?.id ?? null,
        );

    const selectedItem =
        summary.items.find(
            (item) => item.id === selectedId,
        ) ?? summary.items[0];

    const chartData = summary.items.map(
        (item) => ({
            ...item,
            fill: CATEGORY_COLORS[item.id],
            fillOpacity:
                item.id === selectedItem?.id
                    ? 1
                    : 0.55,
        }),
    );

    return (
        <section className="mt-8 rounded-xl bg-kam-white p-8 shadow-[0_16px_45px_rgba(15,36,96,0.12)]">
            <p className="text-sm font-bold uppercase tracking-wider text-kam-blue">
                Distribución por ubicación
            </p>

            <h2 className="mt-2 text-2xl font-bold text-kam-navy">
                Lugares más frecuentes
            </h2>

            <p className="mt-3 max-w-3xl leading-6 text-kam-navy/70">
                El gráfico resume los lugares registrados
                durante todo el historial del usuario.
                Selecciona un segmento para consultar su
                frecuencia.
            </p>

            {summary.items.length === 0 ? (
                <div className="mt-8 rounded-lg bg-kam-gray px-6 py-10 text-center text-kam-navy/70">
                    Todavía no existen lugares registrados
                    para mostrar.
                </div>
            ) : (
                <div className="mt-8 grid items-center gap-8 lg:grid-cols-2">
                    <div className="relative h-80">
                        <ResponsiveContainer
                            height="100%"
                            width="100%"
                        >
                            <PieChart>
                                <Pie
                                    cornerRadius={5}
                                    data={chartData}
                                    dataKey="count"
                                    innerRadius={75}
                                    nameKey="label"
                                    onClick={(_, index) => {
                                        const selected =
                                            summary.items[
                                                index
                                            ];

                                        if (selected) {
                                            setSelectedId(
                                                selected.id,
                                            );
                                        }
                                    }}
                                    outerRadius={120}
                                    paddingAngle={3}
                                    stroke="#fff"
                                    strokeWidth={3}
                                />

                                <Tooltip
                                    contentStyle={{
                                        backgroundColor:
                                            "#fff",
                                        border:
                                            "1px solid #ebeef2",
                                        borderRadius: "8px",
                                        color: "#0f2460",
                                    }}
                                    formatter={(value) => [
                                        `${Number(
                                            value,
                                        )} eventos`,
                                        "Frecuencia",
                                    ]}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        {selectedItem && (
                            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                                <span className="text-3xl font-bold text-kam-navy">
                                    {
                                        selectedItem.percentage
                                    }
                                    %
                                </span>

                                <span className="mt-1 max-w-28 text-sm font-semibold text-kam-navy/70">
                                    {selectedItem.label}
                                </span>
                            </div>
                        )}
                    </div>

                    <div>
                        {selectedItem && (
                            <div
                                className="border-l-4 bg-kam-gray px-5 py-4"
                                style={{
                                    borderColor:
                                        CATEGORY_COLORS[
                                            selectedItem.id
                                        ],
                                }}
                            >
                                <p className="text-xs font-bold uppercase tracking-wider text-kam-wine">
                                    Lugar seleccionado
                                </p>

                                <p className="mt-2 text-2xl font-bold text-kam-navy">
                                    {selectedItem.label}
                                </p>

                                <p className="mt-2 text-kam-navy/70">
                                    {selectedItem.count}{" "}
                                    {selectedItem.count === 1
                                        ? "evento"
                                        : "eventos"}
                                    {" · "}
                                    {
                                        selectedItem.percentage
                                    }
                                    %
                                </p>
                            </div>
                        )}

                        <div className="mt-5 space-y-2">
                            {summary.items.map((item) => {
                                const isSelected =
                                    item.id ===
                                    selectedItem?.id;

                                return (
                                    <button
                                        key={item.id}
                                        aria-pressed={
                                            isSelected
                                        }
                                        className={`flex w-full items-center justify-between gap-4 rounded border px-4 py-3 text-left transition-colors ${
                                            isSelected
                                                ? "border-kam-blue bg-kam-gray"
                                                : "border-kam-gray hover:border-kam-blue hover:bg-kam-gray"
                                        }`}
                                        onClick={() =>
                                            setSelectedId(
                                                item.id,
                                            )
                                        }
                                        type="button"
                                    >
                                        <span className="flex items-center gap-3 font-semibold text-kam-navy">
                                            <span
                                                className="h-4 w-4 rounded-sm"
                                                style={{
                                                    backgroundColor:
                                                        CATEGORY_COLORS[
                                                            item
                                                                .id
                                                        ],
                                                }}
                                            />

                                            {item.label}
                                        </span>

                                        <span className="text-sm text-kam-navy/70">
                                            {item.count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            <p className="mt-8 border-t border-kam-gray pt-4 text-xs text-kam-navy/60">
                Se encontraron ubicaciones en{" "}
                {summary.analyzedEvents} de{" "}
                {summary.totalEvents} eventos registrados.
            </p>
        </section>
    );
}