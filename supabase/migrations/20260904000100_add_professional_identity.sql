begin;

-- =========================================================
-- Identidad y tratamiento del profesional
-- =========================================================

alter table public.profesionales_salud
    add column if not exists
        tratamiento_profesional text,
    add column if not exists
        profesional_user_id uuid;

alter table public.profesionales_salud
    drop constraint if exists
        profesionales_tratamiento_valido;

alter table public.profesionales_salud
    add constraint profesionales_tratamiento_valido
    check (
        tratamiento_profesional is null
        or tratamiento_profesional in (
            'Dr.',
            'Dra.',
            'Psic.',
            'Enf.',
            'T.O.'
        )
    );

alter table public.profesionales_salud
    drop constraint if exists
        profesionales_salud_profesional_user_id_fkey;

alter table public.profesionales_salud
    add constraint
        profesionales_salud_profesional_user_id_fkey
    foreign key (profesional_user_id)
    references auth.users(id)
    on delete set null;

create index if not exists
    profesionales_salud_profesional_user_id_idx
on public.profesionales_salud(profesional_user_id);

comment on column
    public.profesionales_salud.tratamiento_profesional
is
    'Prefijo profesional permitido para mostrar junto al nombre.';

comment on column
    public.profesionales_salud.profesional_user_id
is
    'Cuenta autenticada del profesional vinculada con esta relación.';

commit;