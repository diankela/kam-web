import "server-only";

import {
    createClient as createSupabaseClient,
} from "@supabase/supabase-js";

export function createAdminClient() {
    const supabaseUrl =
        process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

    const supabaseSecretKey =
        process.env.SUPABASE_SECRET_KEY?.trim();

    if (
        !supabaseUrl ||
        !supabaseSecretKey ||
        /\s/.test(supabaseSecretKey)
    ) {
        throw new Error(
            "Falta configurar correctamente el cliente administrativo de Supabase.",
        );
    }

    return createSupabaseClient(
        supabaseUrl,
        supabaseSecretKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
                detectSessionInUrl: false,
            },
        },
    );
}