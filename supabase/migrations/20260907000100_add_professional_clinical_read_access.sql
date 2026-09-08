begin;

-- =========================================================
-- Acceso clínico de solo lectura para profesionales vinculados
-- =========================================================

alter table public.pacientes
    enable row level security;

alter table public.eventos
    enable row level security;

alter table public.registros_bienestar
    enable row level security;

grant select on public.pacientes to authenticated;
grant select on public.eventos to authenticated;
grant select on public.registros_bienestar to authenticated;

-- ---------------------------------------------------------
-- Datos personales del paciente
-- ---------------------------------------------------------

drop policy if exists
    pacientes_profesional_select_linked
on public.pacientes;

create policy
    pacientes_profesional_select_linked
on public.pacientes
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
                pacientes.user_id
    )
);

-- ---------------------------------------------------------
-- Eventos clínicos
-- ---------------------------------------------------------

drop policy if exists
    eventos_profesional_select_linked
on public.eventos;

create policy
    eventos_profesional_select_linked
on public.eventos
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
                eventos.user_id
    )
);

-- ---------------------------------------------------------
-- Registros diarios de bienestar
-- ---------------------------------------------------------

drop policy if exists
    registros_bienestar_profesional_select_linked
on public.registros_bienestar;

create policy
    registros_bienestar_profesional_select_linked
on public.registros_bienestar
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
                registros_bienestar.user_id
    )
);

commit;