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

type DoseChartPoint = {
    fecha: string;
    dosis: number;
};

type DoseLineChartProps = {
    data: DoseChartPoint[];
};

function formatFecha(fecha: string) {
    return new Intl.DateTimeFormat("es-CL", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
    }).format(new Date(`${fecha}T12:00:00`));
}

function formatDosis(valor: number) {
    return new Intl.NumberFormat("es-CL", {
        maximumFractionDigits: 2,
    }).format(valor);
}

export default function DoseLineChart({
    data,
}: DoseLineChartProps) {
    if (data.length === 0) {
        return (
            <div className="flex h-80 items-center justify-center rounded-lg bg-kam-gray px-5 text-center text-kam-navy/70">
                Todavía no existen dosis registradas para mostrar.
            </div>
        );
    }

    return (
        <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 15,
                        right: 20,
                        bottom: 5,
                        left: 0,
                    }}
                >
                    <CartesianGrid
                        stroke="#ebeef2"
                        strokeDasharray="4 4"
                    />

                    <XAxis
                        dataKey="fecha"
                        axisLine={false}
                        minTickGap={24}
                        stroke="#0f2460"
                        tickFormatter={formatFecha}
                        tickLine={false}
                    />

                    <YAxis
                        axisLine={false}
                        stroke="#0f2460"
                        tickFormatter={(valor: number) =>
                            formatDosis(valor)
                        }
                        tickLine={false}
                        width={45}
                    />

                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #ebeef2",
                            borderRadius: "8px",
                            color: "#0f2460",
                        }}
                        formatter={(valor) => [
                            `${formatDosis(Number(valor))} mg`,
                            "Dosis",
                        ]}
                        labelFormatter={(fecha) =>
                            `Fecha: ${formatFecha(String(fecha))}`
                        }
                    />

                    <Line
                        activeDot={{
                            fill: "#9F1853",
                            r: 6,
                            stroke: "#fff",
                            strokeWidth: 2,
                        }}
                        dataKey="dosis"
                        dot={{
                            fill: "#007aff",
                            r: 4,
                            stroke: "#fff",
                            strokeWidth: 2,
                        }}
                        name="Dosis"
                        stroke="#C60B7E"
                        strokeWidth={3}
                        type="linear"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}