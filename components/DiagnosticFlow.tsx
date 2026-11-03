"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "./Logo";
import { ProgressBar } from "./ProgressBar";
import { ArrowLeft, ArrowRight, Check } from "./Icons";
import { GOALS, INDUSTRIES, QUESTIONS, SECTIONS, SECTION_MAP, SIZES, TOTAL_QUESTIONS } from "@/lib/questions";
import { loadState, saveState } from "@/lib/storage";
import type { Answers, Goal, Profile } from "@/lib/types";

const EMPTY_PROFILE: Profile = { company: "", name: "", industry: "", size: "", goal: "tiempo" };
const AUTO_ADVANCE_MS = 260;

export function DiagnosticFlow() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE);
  const [answers, setAnswers] = useState<Answers>({});
  /** -1 = perfil; 0..N-1 = preguntas */
  const [step, setStep] = useState(-1);
  const [hasReport, setHasReport] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restaurar progreso guardado
  useEffect(() => {
    const saved = loadState();
    if (saved.profile) setProfile(saved.profile);
    setAnswers(saved.answers);
    setHasReport(Boolean(saved.completedAt));
    if (saved.profile && !saved.completedAt) {
      const firstPending = QUESTIONS.findIndex((q) => saved.answers[q.id] === undefined);
      setStep(firstPending === -1 ? TOTAL_QUESTIONS - 1 : firstPending);
    }
    setReady(true);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const finish = useCallback(
    (finalAnswers: Answers) => {
      saveState({ profile, answers: finalAnswers, completedAt: new Date().toISOString() });
      router.push("/reporte");
    },
    [profile, router],
  );

  const select = useCallback(
    (questionId: string, score: number) => {
      const next = { ...answers, [questionId]: score };
      setAnswers(next);
      saveState({ profile, answers: next });
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        if (step >= TOTAL_QUESTIONS - 1) finish(next);
        else setStep((s) => s + 1);
      }, AUTO_ADVANCE_MS);
    },
    [answers, profile, step, finish],
  );

  // Atajos de teclado: 1-5 para elegir, ← para regresar
  useEffect(() => {
    if (step < 0) return;
    const q = QUESTIONS[step];
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
      const n = Number(e.key);
      if (n >= 1 && n <= q.options.length) select(q.id, q.options[n - 1].score);
      if (e.key === "ArrowLeft") setStep((s) => Math.max(-1, s - 1));
      if (e.key === "ArrowRight" && answers[q.id] !== undefined && step < TOTAL_QUESTIONS - 1) setStep((s) => s + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, select, answers]);

  const startQuestions = (e: React.FormEvent) => {
    e.preventDefault();
    saveState({ profile, answers });
    const firstPending = QUESTIONS.findIndex((q) => answers[q.id] === undefined);
    setStep(firstPending === -1 ? 0 : firstPending);
  };

  const answeredCount = QUESTIONS.filter((q) => answers[q.id] !== undefined).length;

  return (
    <main className="bg-circuit flex min-h-dvh flex-col">
      <header className="container-app flex items-center justify-between py-5">
        <Logo />
        {step >= 0 && (
          <span className="text-sm text-slate-400">
            {answeredCount}/{TOTAL_QUESTIONS} respondidas
          </span>
        )}
      </header>

      <div className="container-app flex flex-1 flex-col pb-10">
        {!ready ? (
          <div className="card mx-auto mt-10 h-96 w-full max-w-2xl animate-pulse" />
        ) : step < 0 ? (
          <ProfileStep
            profile={profile}
            onChange={setProfile}
            onSubmit={startQuestions}
            hasReport={hasReport}
            hasProgress={answeredCount > 0}
          />
        ) : (
          <QuestionStep
            step={step}
            answers={answers}
            onSelect={select}
            onBack={() => setStep((s) => Math.max(-1, s - 1))}
            onNext={() => (step >= TOTAL_QUESTIONS - 1 ? finish(answers) : setStep((s) => s + 1))}
          />
        )}
      </div>
    </main>
  );
}

/* ─────────────────────────── Paso de perfil ─────────────────────────── */

function ProfileStep({
  profile,
  onChange,
  onSubmit,
  hasReport,
  hasProgress,
}: {
  profile: Profile;
  onChange: (p: Profile) => void;
  onSubmit: (e: React.FormEvent) => void;
  hasReport: boolean;
  hasProgress: boolean;
}) {
  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => onChange({ ...profile, [k]: v });
  const valid = profile.industry && profile.size && profile.goal;

  return (
    <form onSubmit={onSubmit} className="card mx-auto mt-4 w-full max-w-2xl animate-fade-up p-6 sm:mt-8 sm:p-10">
      <p className="eyebrow">Paso 1 · Su negocio</p>
      <h1 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">Personalicemos su diagnóstico</h1>
      <p className="mt-2 text-slate-400">Con estos datos adaptamos las recomendaciones a su giro y a su objetivo.</p>

      {hasReport && (
        <div className="mt-6 flex flex-col gap-3 rounded-xl border border-teal/30 bg-teal/10 p-4 text-sm text-slate-200 sm:flex-row sm:items-center sm:justify-between">
          <span>Ya tiene un reporte generado en este dispositivo.</span>
          <Link href="/reporte" className="font-semibold text-electric hover:underline">
            Ver mi reporte →
          </Link>
        </div>
      )}

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-300">Nombre del negocio (opcional)</span>
          <input
            className="field"
            value={profile.company}
            onChange={(e) => set("company", e.target.value)}
            placeholder="Ej. Ferretería López"
            maxLength={80}
            autoComplete="organization"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-300">Su nombre (opcional)</span>
          <input
            className="field"
            value={profile.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Ej. María"
            maxLength={60}
            autoComplete="given-name"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-300">Giro del negocio *</span>
          <select className="field" value={profile.industry} onChange={(e) => set("industry", e.target.value)} required>
            <option value="" disabled>
              Seleccione…
            </option>
            {INDUSTRIES.map((i) => (
              <option key={i}>{i}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-300">Tamaño del equipo *</span>
          <select className="field" value={profile.size} onChange={(e) => set("size", e.target.value)} required>
            <option value="" disabled>
              Seleccione…
            </option>
            {SIZES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="mt-6">
        <legend className="mb-3 text-sm font-medium text-slate-300">¿Cuál es su principal objetivo este año? *</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {GOALS.map((g) => {
            const active = profile.goal === g.id;
            return (
              <label
                key={g.id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                  active ? "border-electric bg-electric/10 text-white" : "border-white/10 text-slate-300 hover:border-white/30"
                }`}
              >
                <input
                  type="radio"
                  name="goal"
                  className="sr-only"
                  checked={active}
                  onChange={() => set("goal", g.id as Goal)}
                />
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                    active ? "border-electric bg-electric" : "border-slate-500"
                  }`}
                >
                  {active && <span className="h-1.5 w-1.5 rounded-full bg-abyss" />}
                </span>
                {g.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      <button type="submit" className="btn-primary mt-8 w-full sm:w-auto" disabled={!valid}>
        {hasProgress && !hasReport ? "Continuar diagnóstico" : "Empezar preguntas"} <ArrowRight />
      </button>
    </form>
  );
}

/* ─────────────────────────── Paso de pregunta ─────────────────────────── */

function QuestionStep({
  step,
  answers,
  onSelect,
  onBack,
  onNext,
}: {
  step: number;
  answers: Answers;
  onSelect: (id: string, score: number) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const q = QUESTIONS[step];
  const section = SECTION_MAP[q.section];
  const sectionIndex = SECTIONS.findIndex((s) => s.id === q.section);
  const inSection = QUESTIONS.filter((x) => x.section === q.section);
  const posInSection = inSection.findIndex((x) => x.id === q.id) + 1;
  const selected = answers[q.id];
  const isLast = step === TOTAL_QUESTIONS - 1;

  return (
    <div className="mx-auto mt-2 w-full max-w-2xl sm:mt-6">
      <ProgressBar value={(step + (selected !== undefined ? 1 : 0)) / TOTAL_QUESTIONS} />

      {/* Indicador de secciones */}
      <div className="mt-4 flex gap-1.5" aria-hidden="true">
        {SECTIONS.map((s, i) => (
          <span
            key={s.id}
            className={`h-1 flex-1 rounded-full ${i < sectionIndex ? "bg-teal" : i === sectionIndex ? "bg-electric" : "bg-white/10"}`}
          />
        ))}
      </div>

      <div key={q.id} className="card mt-6 animate-fade-up p-6 sm:p-8">
        <p className="eyebrow">
          Sección {sectionIndex + 1} de {SECTIONS.length} · {section.title}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Pregunta {posInSection} de {inSection.length} · {step + 1} de {TOTAL_QUESTIONS}
        </p>
        <h2 className="mt-4 font-display text-xl font-semibold leading-snug text-white sm:text-2xl">{q.text}</h2>
        {q.help && <p className="mt-2 text-sm text-slate-400">{q.help}</p>}

        <div className="mt-6 space-y-2.5" role="radiogroup" aria-label={q.text}>
          {q.options.map((o, i) => {
            const active = selected === o.score;
            return (
              <button
                key={o.label}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onSelect(q.id, o.score)}
                className={`group flex w-full items-center gap-4 rounded-xl border px-4 py-3.5 text-left transition ${
                  active
                    ? "border-electric bg-electric/10 text-white shadow-glow"
                    : "border-white/10 bg-white/[0.02] text-slate-200 hover:border-electric/50 hover:bg-white/[0.04]"
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border font-mono text-xs ${
                    active ? "border-electric bg-electric text-abyss" : "border-white/15 text-slate-400 group-hover:border-electric/50"
                  }`}
                >
                  {active ? <Check className="h-4 w-4" /> : i + 1}
                </span>
                <span className="text-[15px]">{o.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button type="button" onClick={onBack} className="btn-ghost py-2.5 text-sm">
          <ArrowLeft className="h-4 w-4" /> Atrás
        </button>
        <span className="hidden text-xs text-slate-500 sm:block">Tip: use las teclas 1–5</span>
        <button type="button" onClick={onNext} disabled={selected === undefined} className="btn-primary py-2.5 text-sm">
          {isLast ? "Ver mi reporte" : "Siguiente"} <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
