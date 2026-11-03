import Link from "next/link";
import { Logo } from "@/components/Logo";
import { InstallApp } from "@/components/InstallApp";
import { ArrowRight, Chart, Check, Clock, Map, Shield, Target } from "@/components/Icons";
import { SECTIONS, TOTAL_QUESTIONS } from "@/lib/questions";
import { LEVELS } from "@/lib/levels";

const DELIVERABLES = [
  { icon: Target, title: "Score de madurez 0–100", text: "Sepa exactamente en qué nivel está su negocio frente a la IA." },
  { icon: Chart, title: "Fortalezas y oportunidades", text: "Qué ya hace bien y dónde está perdiendo tiempo y dinero." },
  { icon: Map, title: "Roadmap de 90 días", text: "Acciones concretas, priorizadas y con herramientas sugeridas." },
];

const STEPS = [
  { n: "01", title: "Cuéntenos de su negocio", text: "Giro, tamaño y su principal objetivo." },
  { n: "02", title: `Responda ${TOTAL_QUESTIONS} preguntas`, text: "Opción múltiple, sin tecnicismos. Unos 7 minutos." },
  { n: "03", title: "Reciba su reporte", text: "Descárguelo en PDF o cópielo para compartirlo con su equipo." },
];

export default function Home() {
  return (
    <main className="bg-circuit min-h-dvh">
      <header className="container-app flex items-center justify-between py-5">
        <Logo />
        <div className="flex items-center gap-2">
          <InstallApp />
          <Link href="/diagnostico" className="btn-ghost hidden py-2 text-sm sm:inline-flex">
            Comenzar <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="container-app grid items-center gap-12 pb-16 pt-10 lg:grid-cols-[1.15fr_.85fr] lg:pt-16">
        <div className="animate-fade-up">
          <p className="eyebrow">Diagnóstico gratuito para pymes mexicanas</p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
            ¿Qué tan lista está su empresa para la <span className="text-gradient">Inteligencia Artificial</span>?
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-300">
            Evalúe su estrategia, procesos, datos, equipo y presupuesto. En minutos obtendrá un score de madurez y un
            plan de acción de 90 días diseñado para la realidad de su negocio: WhatsApp, facturación, inventarios y
            atención al cliente.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/diagnostico" className="btn-primary text-base">
              Comenzar diagnóstico <ArrowRight />
            </Link>
            <span className="flex items-center gap-2 text-sm text-slate-400">
              <Clock className="h-4 w-4 text-electric" /> 7 minutos · Sin registro · 100% confidencial
            </span>
          </div>
        </div>

        {/* Tarjeta de vista previa */}
        <div className="card relative animate-fade-up p-6 shadow-glow [animation-delay:120ms] sm:p-8">
          <p className="eyebrow">Vista previa del reporte</p>
          <div className="mt-5 flex items-end gap-3">
            <span className="font-display text-6xl font-bold text-white">62</span>
            <span className="mb-2 text-slate-400">/100</span>
            <span className="mb-2 ml-auto rounded-full border border-teal/40 bg-teal/10 px-3 py-1 text-xs font-semibold text-teal-400">
              Intermedio
            </span>
          </div>
          <div className="mt-6 space-y-3">
            {SECTIONS.map((s, i) => {
              const v = [70, 55, 48, 72, 60][i];
              return (
                <div key={s.id}>
                  <div className="mb-1 flex justify-between text-xs text-slate-400">
                    <span>{s.short}</span>
                    <span>{v}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${v}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 rounded-xl border border-electric/20 bg-electric/5 p-4 text-sm text-slate-300">
            <span className="font-semibold text-electric">Días 1–30:</span> Profesionalizar WhatsApp Business con
            respuestas y etiquetas.
          </div>
        </div>
      </section>

      {/* Qué recibe */}
      <section className="container-app pb-16">
        <div className="grid gap-4 md:grid-cols-3">
          {DELIVERABLES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-electric/10 text-electric">
                <Icon />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Qué evaluamos */}
      <section className="container-app pb-16">
        <p className="eyebrow">Qué evaluamos</p>
        <h2 className="mt-3 font-display text-3xl font-bold text-white">5 dimensiones de madurez</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {SECTIONS.map((s, i) => (
            <div key={s.id} className="card p-5">
              <span className="font-display text-sm font-semibold text-electric">0{i + 1}</span>
              <h3 className="mt-2 font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cómo funciona + niveles */}
      <section className="container-app grid gap-6 pb-16 lg:grid-cols-2">
        <div className="card p-6 sm:p-8">
          <p className="eyebrow">Cómo funciona</p>
          <ol className="mt-6 space-y-6">
            {STEPS.map((s) => (
              <li key={s.n} className="flex gap-4">
                <span className="font-display text-2xl font-bold text-gradient">{s.n}</span>
                <div>
                  <h3 className="font-semibold text-white">{s.title}</h3>
                  <p className="text-sm text-slate-400">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="card p-6 sm:p-8">
          <p className="eyebrow">Niveles de madurez</p>
          <ul className="mt-6 space-y-4">
            {LEVELS.map((l) => (
              <li key={l.id} className="flex items-start gap-4">
                <span className="mt-0.5 w-16 shrink-0 rounded-md bg-white/5 py-1 text-center font-mono text-xs text-electric">
                  {l.range[0]}–{l.range[1]}
                </span>
                <div>
                  <h3 className="font-semibold text-white">{l.name}</h3>
                  <p className="text-sm text-slate-400">{l.headline}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA final */}
      <section className="container-app pb-20">
        <div className="card flex flex-col items-start gap-6 border-electric/30 p-8 sm:p-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              Deje de adivinar. Empiece con un plan.
            </h2>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300">
              {["Sin costo", "Sin registro", "Reporte descargable"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-teal-400" /> {t}
                </li>
              ))}
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-teal-400" /> Sus respuestas se quedan en su navegador
              </li>
            </ul>
          </div>
          <Link href="/diagnostico" className="btn-primary shrink-0 text-base">
            Comenzar diagnóstico <ArrowRight />
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8">
        <div className="container-app flex flex-col items-center justify-between gap-3 text-sm text-slate-500 sm:flex-row">
          <span>© {new Date().getFullYear()} IntegraIA by EMET · Formación y consultoría en IA</span>
          <span>Hecho en México 🇲🇽</span>
        </div>
      </footer>
    </main>
  );
}
