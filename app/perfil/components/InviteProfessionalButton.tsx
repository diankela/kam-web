"use client";

import { useState } from "react";

import { inviteHealthProfessional } from "../actions";

type InviteProfessionalButtonProps = {
    professionalId: string;
    professionalName: string;
    professionalEmail: string;
};

export default function InviteProfessionalButton({
    professionalId,
    professionalName,
    professionalEmail,
}: InviteProfessionalButtonProps) {
    const [isSubmitting, setIsSubmitting] =
        useState(false);

    function handleSubmit(
        event: React.FormEvent<HTMLFormElement>,
    ) {
        const confirmed = window.confirm(
            `Se enviará una invitación a ${professionalName} mediante ${professionalEmail}. ¿Deseas continuar?`,
        );

        if (!confirmed) {
            event.preventDefault();
            return;
        }

        setIsSubmitting(true);
    }

    return (
        <form
            action={inviteHealthProfessional}
            onSubmit={handleSubmit}
        >
            <input
                name="professional_id"
                type="hidden"
                value={professionalId}
            />

            <button
                className="rounded-lg bg-kam-blue px-3 py-2 text-xs font-bold text-kam-white transition hover:bg-kam-navy focus:outline-none focus:ring-4 focus:ring-kam-blue/20 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
                type="submit"
            >
                {isSubmitting
                    ? "Enviando..."
                    : "Enviar invitación"}
            </button>
        </form>
    );
}