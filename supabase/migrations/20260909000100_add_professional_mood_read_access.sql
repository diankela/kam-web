begin;

-- =========================================================
-- Lectura del estado de ánimo para profesionales vinculados
-- =========================================================

alter table public.registros_estado_animo
    enable row level security;

grant select
on public.registros_estado_animo
to authenticated;

drop policy if exists
    registros_estado_animo_profesional_select_linked
on public.registros_estado_animo;

create policy
    registros_estado_animo_profesional_select_linked
on public.registros_estado_animo
for select
to authenticated
using (
    exists (
        select 1
        from public.profesionales_salud as professional_link
        where
            professional_link.profesional_user_id =
                (select auth.uid())
            and professional_link.paciente_id =
                registros_estado_animo.user_id
    )
);

commit;