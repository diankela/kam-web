begin;

-- =========================================================
-- Perfil del paciente
-- =========================================================

create table if not exists public.pacientes (
    user_id uuid primary key
        references auth.users(id)
        on delete cascade,

    created_at timestamp with time zone
        not null default now()
);

alter table public.pacientes
    add column if not exists nombres text,
    add column if not exists apellido_paterno text,
    add column if not exists apellido_materno text,
    add column if not exists fecha_nacimiento date,
    add column if not exists diagnostico_principal text,
    add column if not exists fecha_diagnostico date,
    add column if not exists updated_at
        timestamp with time zone
        not null default now();

alter table public.pacientes
    enable row level security;

revoke all
on table public.pacientes
from anon;

grant select, insert, update
on table public.pacientes
to authenticated;

drop policy if exists
    "Usuario puede crear su perfil"
on public.pacientes;

create policy "Usuario puede crear su perfil"
on public.pacientes
for insert
to authenticated
with check (
    (select auth.uid()) = user_id
);

drop policy if exists
    "Usuario puede ver su perfil"
on public.pacientes;

create policy "Usuario puede ver su perfil"
on public.pacientes
for select
to authenticated
using (
    (select auth.uid()) = user_id
);

drop policy if exists
    "Usuario puede actualizar su perfil"
on public.pacientes;

create policy "Usuario puede actualizar su perfil"
on public.pacientes
for update
to authenticated
using (
    (select auth.uid()) = user_id
)
with check (
    (select auth.uid()) = user_id
);

-- =========================================================
-- Profesionales de salud
-- =========================================================

create table if not exists public.profesionales_salud (
    id uuid primary key default gen_random_uuid(),

    paciente_id uuid not null
        references public.pacientes(user_id)
        on delete cascade,

    nombres text not null,
    apellidos text not null,
    profesion text not null,
    especialidad text,
    centro_salud text,
    email text,
    telefono text,
    fecha_inicio_atencion date,

    es_principal boolean not null default false,

    funcion_seguimiento text
        not null default 'otro',

    created_at timestamp with time zone
        not null default now(),

    updated_at timestamp with time zone
        not null default now(),

    constraint profesional_nombres_no_vacios
        check (btrim(nombres) <> ''),

    constraint profesional_apellidos_no_vacios
        check (btrim(apellidos) <> ''),

    constraint profesional_profesion_no_vacia
        check (btrim(profesion) <> '')
);

alter table public.profesionales_salud
    add column if not exists funcion_seguimiento text
    not null default 'otro';

alter table public.profesionales_salud
    drop constraint if exists
    profesionales_funcion_seguimiento_valida;

alter table public.profesionales_salud
    add constraint profesionales_funcion_seguimiento_valida
    check (
        funcion_seguimiento in (
            'psicoterapia',
            'control_medicamentos',
            'atencion_general',
            'otro'
        )
    );

create index if not exists
    profesionales_salud_paciente_id_idx
on public.profesionales_salud(paciente_id);

create unique index if not exists
    profesionales_salud_un_principal_idx
on public.profesionales_salud(paciente_id)
where es_principal = true;

alter table public.profesionales_salud
    enable row level security;

revoke all
on table public.profesionales_salud
from anon;

grant select, insert, update, delete
on table public.profesionales_salud
to authenticated;

drop policy if exists
    "Paciente puede crear sus profesionales"
on public.profesionales_salud;

create policy "Paciente puede crear sus profesionales"
on public.profesionales_salud
for insert
to authenticated
with check (
    (select auth.uid()) = paciente_id
);

drop policy if exists
    "Paciente puede ver sus profesionales"
on public.profesionales_salud;

create policy "Paciente puede ver sus profesionales"
on public.profesionales_salud
for select
to authenticated
using (
    (select auth.uid()) = paciente_id
);

drop policy if exists
    "Paciente puede actualizar sus profesionales"
on public.profesionales_salud;

create policy "Paciente puede actualizar sus profesionales"
on public.profesionales_salud
for update
to authenticated
using (
    (select auth.uid()) = paciente_id
)
with check (
    (select auth.uid()) = paciente_id
);

drop policy if exists
    "Paciente puede eliminar sus profesionales"
on public.profesionales_salud;

create policy "Paciente puede eliminar sus profesionales"
on public.profesionales_salud
for delete
to authenticated
using (
    (select auth.uid()) = paciente_id
);

-- =========================================================
-- Selección transaccional del profesional principal
-- =========================================================

create or replace function
    public.marcar_profesional_principal(
        p_profesional_id uuid
    )
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
    v_user_id uuid := auth.uid();
begin
    if v_user_id is null then
        raise exception 'Usuario no autenticado'
            using errcode = '42501';
    end if;

    if not exists (
        select 1
        from public.profesionales_salud
        where id = p_profesional_id
          and paciente_id = v_user_id
    ) then
        raise exception
            'El profesional no pertenece al usuario'
            using errcode = '42501';
    end if;

    update public.profesionales_salud
    set
        es_principal = false,
        updated_at = pg_catalog.now()
    where paciente_id = v_user_id
      and es_principal = true;

    update public.profesionales_salud
    set
        es_principal = true,
        updated_at = pg_catalog.now()
    where id = p_profesional_id
      and paciente_id = v_user_id;
end;
$$;

revoke all
on function public.marcar_profesional_principal(uuid)
from public;

revoke all
on function public.marcar_profesional_principal(uuid)
from anon;

grant execute
on function public.marcar_profesional_principal(uuid)
to authenticated;

commit;