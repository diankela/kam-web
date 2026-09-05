import "server-only";

import {
    createClient as createSupabaseClient,
} from "@supabase/supabase-js";

export function createAdminClient() {
    const supabaseUrl =
        process.env.NEXT_PUBLIC_SUPABASE_URL;

    const supabaseSecretKey =
        process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !supabaseSecretKey) {
        throw new Error(
            "Falta configurar el cliente administrativo de Supabase.",
        );
    }

    return createSupabaseClient(
        supabaseUrl,
        supabaseSecretKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        },
    );
}