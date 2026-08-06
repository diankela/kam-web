// "use client";

// import { type FormEvent, useState } from "react";
// import { createClient } from "@/lib/supabase/client";

// const supabase = createClient();



// export default function LoginPage() {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [message, setMessage] = useState("");

//     function handleSubmit(event: FormEvent<HTMLFormElement>) {
//         event.preventDefault();

//         setMessage(
//             "Formulario capturado correctamente. En el siguiente paso lo enviaremos a Supabase.",
//         );
//     }




//     return (
//         <main className="flex min-h-screen items-center justify-center bg-[#f3f8f7] px-4">
//             <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl sm:p-10">
//                 <div className="mb-8 text-center">
//                     <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#17665f] text-xl font-bold text-white">
//                         K
//                     </div>

//                     <p className="mt-4 text-sm font-semibold text-[#2d7a6c]">
//                         Kent Anxiety Manager
//                     </p>

//                     <h1 className="mt-2 text-3xl font-semibold text-slate-900">
//                         Iniciar sesión
//                     </h1>

//                     <p className="mt-3 text-sm text-slate-500">
//                         Ingresa con las credenciales asignadas por el administrador.
//                     </p>
//                 </div>

//                 <form className="space-y-5" onSubmit={handleSubmit}>
//                     <div>
//                         <label
//                             className="mb-2 block text-sm font-medium text-slate-700"
//                             htmlFor="email"
//                         >
//                             Correo electrónico
//                         </label>

//                         <input
//                             autoComplete="email"
//                             className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-900 outline-none transition focus:border-[#3b8f7f] focus:bg-white focus:ring-4 focus:ring-[#3b8f7f]/10"
//                             id="email"
//                             name="email"
//                             onChange={(event) => setEmail(event.target.value)}
//                             placeholder="nombre@correo.cl"
//                             required
//                             value={email}
//                             type="email"

//                         />
//                     </div>

//                     <div>
//                         <label
//                             className="mb-2 block text-sm font-medium text-slate-700"
//                             htmlFor="password"
//                         >
//                             Contraseña
//                         </label>

//                         <input
//                             autoComplete="current-password"
//                             className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-900 outline-none transition focus:border-[#3b8f7f] focus:bg-white focus:ring-4 focus:ring-[#3b8f7f]/10"
//                             id="password"
//                             name="password"
//                             onChange={(event) => setPassword(event.target.value)}
//                             placeholder="Ingresa tu contraseña"
//                             required
//                             type="password"
//                             value={password}
//                         />
//                     </div>
//                     {message && (
//                         <p
//                             aria-live="polite"
//                             className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
//                         >
//                             {message}
//                         </p>
//                     )}
//                     <button
//                         className="h-12 w-full rounded-xl bg-[#17665f] font-semibold text-white transition hover:bg-[#12554f]"
//                         type="submit"
//                     >
//                         Ingresar
//                     </button>
//                 </form>

//                 <p className="mt-6 text-center text-xs text-slate-500">
//                     Acceso exclusivo para usuarios autorizados.
//                 </p>
//             </section>
//         </main>
//     );
// }

"use client";

import { type FormEvent, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage(
      "Formulario capturado correctamente. En el siguiente paso enviaremos los datos a Supabase.",
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-kam-gray">
      {/* Encabezado principal */}
      <header className="bg-kam-navy text-kam-white">
        <div className="mx-auto flex h-18 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded bg-kam-blue text-xl font-bold">
              K
            </div>

            <div>
              <p className="text-xl font-bold tracking-tight">KAM</p>

              <p className="hidden text-xs text-kam-white/70 sm:block">
                Kent Anxiety Manager
              </p>
            </div>
          </div>

          <div className="rounded bg-kam-magenta px-4 py-2 text-sm font-semibold">
            Acceso interno
          </div>
        </div>
      </header>

      {/* Franja informativa */}
      <div className="bg-kam-blue text-kam-white">
        <div className="mx-auto w-full max-w-6xl px-5 py-3 text-sm sm:px-8">
          KAM: plataforma de seguimiento y registro personal
        </div>
      </div>

      {/* Contenido principal */}
      <main className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
        <section className="grid w-full max-w-5xl overflow-hidden rounded-xl bg-kam-white shadow-[0_20px_60px_rgba(15,36,96,0.16)] lg:grid-cols-[0.9fr_1.1fr]">
          {/* Presentación de KAM */}
          <aside className="bg-kam-navy p-8 text-kam-white sm:p-10">
            <div className="inline-block rounded bg-kam-magenta px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              Bienestar y seguimiento
            </div>

            <h1 className="mt-7 text-3xl font-bold leading-tight sm:text-4xl">
              Comprende la evolución de tus registros.
            </h1>

            <p className="mt-5 leading-7 text-kam-white/75">
              KAM centraliza tu información para ayudarte a identificar cambios,
              situaciones frecuentes y posibles desencadenantes.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-sm bg-kam-blue" />

                <p className="text-sm text-kam-white/90">
                  Registro personal de eventos
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-sm bg-kam-blue" />

                <p className="text-sm text-kam-white/90">
                  Seguimiento de síntomas y medicamentos
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-sm bg-kam-blue" />

                <p className="text-sm text-kam-white/90">
                  Información para análisis y métricas
                </p>
              </div>
            </div>
          </aside>

          {/* Formulario */}
          <div className="p-8 sm:p-10 lg:p-12">
            <p className="text-sm font-bold uppercase tracking-wider text-kam-blue">
              Portal KAM
            </p>

            <h2 className="mt-2 text-3xl font-bold text-kam-navy">
              Iniciar sesión
            </h2>

            <p className="mt-3 text-sm leading-6 text-kam-navy/70">
              Ingresa con las credenciales asignadas por el administrador.
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label
                  className="mb-2 block text-sm font-semibold text-kam-navy"
                  htmlFor="email"
                >
                  Correo electrónico
                </label>

                <input
                  autoComplete="email"
                  className="h-12 w-full rounded-lg border border-kam-navy/20 bg-kam-gray px-4 text-kam-navy outline-none transition placeholder:text-kam-navy/45 focus:border-kam-blue focus:bg-kam-white focus:ring-4 focus:ring-kam-blue/15"
                  id="email"
                  name="email"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="nombre@correo.cl"
                  required
                  type="email"
                  value={email}
                />
              </div>

              <div>
                <label
                  className="mb-2 block text-sm font-semibold text-kam-navy"
                  htmlFor="password"
                >
                  Contraseña
                </label>

                <input
                  autoComplete="current-password"
                  className="h-12 w-full rounded-lg border border-kam-navy/20 bg-kam-gray px-4 text-kam-navy outline-none transition placeholder:text-kam-navy/45 focus:border-kam-blue focus:bg-kam-white focus:ring-4 focus:ring-kam-blue/15"
                  id="password"
                  minLength={6}
                  name="password"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Ingresa tu contraseña"
                  required
                  type="password"
                  value={password}
                />
              </div>

              {message && (
                <p
                  aria-live="polite"
                  className="border-l-4 border-kam-blue bg-kam-gray px-4 py-3 text-sm leading-5 text-kam-navy"
                >
                  {message}
                </p>
              )}

              <button
                className="h-12 w-full rounded-lg bg-kam-magenta font-bold text-kam-white transition hover:bg-kam-wine focus:outline-none focus:ring-4 focus:ring-kam-blue/25"
                type="submit"
              >
                Ingresar
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-kam-navy/60">
              Acceso exclusivo para usuarios autorizados.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}