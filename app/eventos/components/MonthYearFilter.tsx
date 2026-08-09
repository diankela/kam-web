import Link from "next/link";

type MonthYearFilterProps = {
    selectedMonth: number;
    selectedYear: number;
    years: number[];
};

const MONTHS = [
    { value: 1, label: "Enero" },
    { value: 2, label: "Febrero" },
    { value: 3, label: "Marzo" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Mayo" },
    { value: 6, label: "Junio" },
    { value: 7, label: "Julio" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Septiembre" },
    { value: 10, label: "Octubre" },
    { value: 11, label: "Noviembre" },
    { value: 12, label: "Diciembre" },
];

export default function MonthYearFilter({
    selectedMonth,
    selectedYear,
    years,
}: MonthYearFilterProps) {
    return (
        <form
            className="mt-6 flex flex-col gap-4 rounded-lg bg-kam-gray p-5 sm:flex-row sm:items-end"
            method="get"
        >
            <label className="flex flex-1 flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-wide text-kam-wine">
                    Mes
                </span>

                <select
                    className="rounded border border-kam-navy/20 bg-kam-white px-4 py-3 text-kam-navy outline-none transition focus:border-kam-blue focus:ring-2 focus:ring-kam-blue/20"
                    defaultValue={String(
                        selectedMonth,
                    )}
                    name="month"
                >
                    {MONTHS.map((month) => (
                        <option
                            key={month.value}
                            value={month.value}
                        >
                            {month.label}
                        </option>
                    ))}
                </select>
            </label>

            <label className="flex flex-1 flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-wide text-kam-wine">
                    Año
                </span>

                <select
                    className="rounded border border-kam-navy/20 bg-kam-white px-4 py-3 text-kam-navy outline-none transition focus:border-kam-blue focus:ring-2 focus:ring-kam-blue/20"
                    defaultValue={String(
                        selectedYear,
                    )}
                    name="year"
                >
                    {years.map((year) => (
                        <option
                            key={year}
                            value={year}
                        >
                            {year}
                        </option>
                    ))}
                </select>
            </label>

            <button
                className="rounded border border-kam-blue bg-kam-blue px-5 py-3 font-semibold text-kam-white transition hover:border-kam-magenta hover:bg-kam-navy focus:outline-none focus:ring-4 focus:ring-kam-blue/20"
                type="submit"
            >
                Ver registros
            </button>

            <Link
                className="rounded border border-kam-navy/20 bg-kam-white px-5 py-3 text-center font-semibold text-kam-navy transition hover:border-kam-magenta hover:text-kam-magenta"
                href="/eventos"
            >
                Mes actual
            </Link>
        </form>
    );
}