"use client";

import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import type {
    DailyMoodTrackingPoint,
} from "@/lib/analysis/moodTracking";

type MoodLineChartProps = {
    data: DailyMoodTrackingPoint[];
    description?: string;
};

function formatChartDate(value: string) {
    const [, month, day] = value.split("-");

    if (!month || !day) {
        return value;
    }

    return `${day}/${month}`;
}

export default function MoodLineChart({
    data,
    description,
}: MoodLineChartProps) {
    return (
        <section className="mt-8 rounded-xl bg-kam-white p-6 shadow-[0_16px_45px_rgba(15,36,96,0.12)] sm:p-8">
            <div>
                <p className="text-sm font-bold uppercase tracking-wider text-kam-magenta">
                    Seguimiento emocional
                </p>

                <h2 className="mt-2 text-2xl font-bold text-kam-navy">
                    Evolución del estado de ánimo
                </h2>

                <p className="mt-2 text-sm leading-6 text-kam-navy/70">
                    {description ??
                        `El gráfico muestra el promedio diario del
                         estado de ánimo durante el período
                         seleccionado.`}
                </p>
            </div>

            {data.length === 0 ? (
                <div className="mt-6 flex min-h-72 items-center justify-center rounded-lg bg-kam-gray px-5 text-center text-kam-navy/70">
                    No existen registros del estado de ánimo
                    para mostrar.
                </div>
            ) : (
                <div className="mt-6 h-80 w-full">
                    <ResponsiveContainer
                        height="100%"
                        width="100%"
                    >
                        <LineChart
                            accessibilityLayer
                            data={data}
                            margin={{
                                top: 10,
                                right: 16,
                                bottom: 10,
                                left: 0,
                            }}
                        >
                            <CartesianGrid
                                stroke="#ebeef2"
                                strokeDasharray="4 4"
                                vertical={false}
                            />

                            <XAxis
                                axisLine={{
                                    stroke: "#ebeef2",
                                }}
                                dataKey="date"
                                minTickGap={24}
                                tick={{
                                    fill: "#0f2460",
                                    fontSize: 12,
                                }}
                                tickFormatter={formatChartDate}
                                tickLine={false}
                            />

                            <YAxis
                                axisLine={false}
                                domain={[1, 10]}
                                ticks={[
                                    1, 2, 3, 4, 5,
                                    6, 7, 8, 9, 10,
                                ]}
                                tick={{
                                    fill: "#0f2460",
                                    fontSize: 12,
                                }}
                                tickLine={false}
                                width={32}
                            />

                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    border: "1px solid #ebeef2",
                                    borderRadius: "8px",
                                    color: "#0f2460",
                                }}
                                cursor={{
                                    stroke: "#C60B7E",
                                    strokeDasharray: "4 4",
                                }}
                                formatter={(value) => [
                                    `${value} / 10`,
                                    "Ánimo promedio",
                                ]}
                                labelFormatter={(label) =>
                                    `Fecha: ${formatChartDate(
                                        String(label),
                                    )}`
                                }
                            />

                            <Line
                                activeDot={{
                                    fill: "#007aff",
                                    r: 6,
                                    stroke: "#fff",
                                    strokeWidth: 2,
                                }}
                                dataKey="value"
                                dot={{
                                    fill: "#C60B7E",
                                    r: 4,
                                    stroke: "#fff",
                                    strokeWidth: 2,
                                }}
                                isAnimationActive={false}
                                stroke="#C60B7E"
                                strokeWidth={3}
                                type="monotone"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </section>
    );
}