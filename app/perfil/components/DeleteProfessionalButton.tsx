"use client";

import { useState } from "react";

import { deleteHealthProfessional } from "../actions";

type DeleteProfessionalButtonProps = {
    professionalId: string;
    professionalName: string;
};

export default function DeleteProfessionalButton({
    professionalId,
    professionalName,
}: DeleteProfessionalButtonProps) {
    const [isConfirming, setIsConfirming] =
        useState(false);

    if (!isConfirming) {
        return (
            <button
                className="rounded-lg border border-kam-wine px-3 py-2 text-xs font-bold text-kam-wine transition hover:bg-kam-wine hover:text-kam-white focus:outline-none focus:ring-4 focus:ring-kam-magenta/20"
                onClick={() => setIsConfirming(true)}
                type="button"
            >
                Eliminar
            </button>
        );
    }

    return (
        <div
            aria-label={`Confirmar eliminación de ${professionalName}`}
            className="rounded-lg border border-kam-magenta bg-kam-white p-4"
            role="group"
        >
            <p className="text-sm font-semibold leading-5 text-kam-navy">
                ¿Eliminar a {professionalName}?
            </p>

            <p className="mt-1 text-xs leading-5 text-kam-navy/60">
                Esta acción no se puede deshacer.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
                <button
                    className="rounded-lg border border-kam-navy/20 px-3 py-2 text-xs font-bold text-kam-navy transition hover:bg-kam-gray"
                    onClick={() =>
                        setIsConfirming(false)
                    }
                    type="button"
                >
                    Cancelar
                </button>

                <form action={deleteHealthProfessional}>
                    <input
                        name="professional_id"
                        type="hidden"
                        value={professionalId}
                    />

                    <button
                        className="rounded-lg bg-kam-wine px-3 py-2 text-xs font-bold text-kam-white transition hover:bg-kam-magenta focus:outline-none focus:ring-4 focus:ring-kam-magenta/20"
                        type="submit"
                    >
                        Confirmar eliminación
                    </button>
                </form>
            </div>
        </div>
    );
}