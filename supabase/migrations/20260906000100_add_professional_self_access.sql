begin;

-- =========================================================
-- Lectura de relaciones vinculadas para profesionales
-- =========================================================

alter table public.profesionales_salud
    enable row level security;

drop policy if exists
    profesionales_salud_profesional_select_self
on public.profesionales_salud;

create policy
    profesionales_salud_profesional_select_self
on public.profesionales_salud
for select
to authenticated
using (
    (select auth.uid()) = profesional_user_id
);

commit;