"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLogo, Logo } from "./Logo";
import { ScoreGauge } from "./ScoreGauge";
import { ArrowRight, Check, Copy, Download, Refresh, Spark, Target, Whatsapp } from "./Icons";
import { buildReport, NEXT_STEP, PHASE_META } from "@/lib/report";
import { reportToText } from "@/lib/exportText";
import { clearState, loadState } from "@/lib/storage";
import { whatsappHref } from "@/lib/config";
import { buildWhatsappMessage } from "@/lib/lead";
import { LEVELS } from "@/lib/levels";
import { TOTAL_QUESTIONS } from "@/lib/questions";
import type { DiagnosticState, Phase, Report } from "@/lib/types";

const EFFORT = ["", "Bajo", "Medio", "Alto"] as const;
const IMPACT = ["", "Medio", "Alto", "Muy alto"] as const;

export function ReportView() {
  const router = useRouter();
  const [state, setState] = useState<DiagnosticState | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const s = loadState();
    // El reporte requiere cuestionario completo y datos de contacto
    const complete = s.profile && s.lead && Object.keys(s.answers).length >= TOTAL_QUESTIONS;
    if (!complete) {
      router.replace("/diagnostico");
      return;
    }
    setState(s);
  }, [router]);

  const report: Report | null = useMemo(
    () => (state?.profile ? buildReport(state.profile, state.answers, state.completedAt) : null),
    [state],
  );

  if (!report || !state?.lead) {
    return (
      <main className="bg-circuit flex min-h-dvh items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <span className="h-3 w-3 animate-ping rounded-full bg-electric" /> Generando su reporte…
        </div>
      </main>
    );
  }

  const company = report.profile.company || "su negocio";
  const date = new Date(report.generatedAt).toLocaleDateString("es-MX", { dateStyle: "long" });

  const handlePrint = () => {
    const prev = document.title;
    const slug = (report.profile.company || "pyme").replace(/[^\p{L}\p{N}]+/gu, "-").toLowerCase();
    document.title = `Diagnostico-IA-${slug}`;
    window.print();
    document.title = prev;
  };

  const handleCopy = async () => {
    const text = reportToText(report, state.lead);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleRestart = () => {
    if (!confirm("¿Desea borrar sus respuestas y empezar un nuevo diagnóstico?")) return;
    clearState();
    router.push("/diagnostico");
  };

  const cta = whatsappHref(buildWhatsappMessage(report, state.lead));

  return (
    <main className="bg-circuit min-h-dvh">
      <header className="no-print container-app flex items-center justify-between py-5">
        <Logo />
        <button onClick={handleRestart} className="btn-ghost py-2 text-sm">
          <Refresh className="h-4 w-4" /> <span className="hidden sm:inline">Nuevo diagnóstico</span>
        </button>
      </header>

      <div className="container-app space-y-6 pb-16 print:space-y-5 print:px-0">
        {/* Encabezado solo para impresión */}
        <div className="print-light hidden items-center justify-between border-b border-slate-200 pb-4 print:flex">
          <div className="flex items-center gap-3">
            <BrandLogo className="h-11" />
            <p className="text-xs text-slate-500">Diagnóstico de Madurez en IA</p>
          </div>
          <p className="text-xs text-slate-500">{date}</p>
        </div>

        {/* Resumen / Score */}
        <section className="card print-light print-avoid grid animate-fade-up gap-8 p-6 sm:p-10 lg:grid-cols-[auto_1fr] lg:items-center">
          <div className="mx-auto">
            <ScoreGauge score={report.score} />
          </div>
          <div>
            <p className="eyebrow">Reporte de madurez en IA · {date}</p>
            <h1 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
              {report.profile.name ? `${report.profile.name.split(" ")[0]}, ` : ""}
              {company} está en nivel <span className="text-gradient">{report.level.name}</span>
            </h1>
            <p className="mt-2 font-medium text-electric print:text-[#0891b2]">{report.level.headline}</p>
            <p className="print-muted mt-4 text-slate-300">{report.level.summary}</p>
            <p className="print-muted mt-4 text-xs text-slate-500">
              {report.profile.industry} · {report.profile.size}
            </p>

            {/* Escala de niveles */}
            <div className="mt-6 grid grid-cols-4 gap-1.5">
              {LEVELS.map((l) => {
                const active = l.id === report.level.id;
                return (
                  <div key={l.id}>
                    <div className={`h-2 rounded-full ${active ? "bg-brand-gradient" : "bg-white/10 print:bg-slate-200"}`} />
                    <p className={`mt-1.5 text-[11px] ${active ? "font-semibold text-white" : "print-muted text-slate-500"}`}>
                      {l.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Acciones */}
        <div className="no-print flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a href={cta} target="_blank" rel="noopener noreferrer" className="btn-primary">
            <Whatsapp /> Enviar mis resultados a IntegraIA
          </a>
          <button onClick={handlePrint} className="btn-ghost">
            <Download /> Descargar PDF
          </button>
          <button onClick={handleCopy} className="btn-ghost" aria-live="polite">
            {copied ? <Check className="text-teal-400" /> : <Copy />} {copied ? "¡Reporte copiado!" : "Copiar reporte"}
          </button>
        </div>

        {/* Resultados por área */}
        <section className="card print-light print-avoid p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold text-white">Resultados por área</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {report.sections.map(({ section, score }) => (
              <div key={section.id}>
                <div className="mb-2 flex items-baseline justify-between gap-4">
                  <span className="font-medium text-slate-200">{section.title}</span>
                  <span className="font-display font-semibold text-white">{score}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-white/10 print:bg-slate-200">
                  <div
                    className={`h-full rounded-full ${score >= 51 ? "bg-brand-gradient" : score >= 26 ? "bg-teal" : "bg-amber-400"}`}
                    style={{ width: `${Math.max(score, 3)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Fortalezas y oportunidades */}
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="card print-light print-avoid p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal/15 text-teal-400">
                <Check />
              </span>
              <h2 className="font-display text-xl font-semibold text-white">Principales fortalezas</h2>
            </div>
            <ul className="mt-5 space-y-4">
              {report.strengths.map((s) => (
                <li key={s.questionId} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                  <div>
                    <p className="text-slate-200">{s.text}</p>
                    <p className="print-muted mt-0.5 text-xs text-slate-500">{s.section.title}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="card print-light print-avoid p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-electric/15 text-electric">
                <Target />
              </span>
              <h2 className="font-display text-xl font-semibold text-white">Principales oportunidades</h2>
            </div>
            {report.gaps.length ? (
              <ol className="mt-5 space-y-4">
                {report.gaps.map((g, i) => (
                  <li key={g.questionId} className="flex gap-3">
                    <span className="font-display text-sm font-bold text-electric print:text-[#0891b2]">{i + 1}</span>
                    <div>
                      <p className="text-slate-200">{g.text}</p>
                      <p className="print-muted mt-0.5 text-xs text-slate-500">{g.section.title}</p>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-5 text-slate-300">
                No detectamos brechas críticas. Su oportunidad está en escalar con agentes de IA y análisis predictivo.
              </p>
            )}
          </section>
        </div>

        {/* Roadmap */}
        <section className="card print-light print-break p-6 sm:p-8">
          <p className="eyebrow">Plan de acción</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-white">Roadmap de 90 días</h2>
          <p className="print-muted mt-2 text-slate-400">
            Acciones priorizadas según sus brechas, su impacto y su objetivo principal. Empiece por la primera de cada
            fase.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {([1, 2, 3] as Phase[]).map((p) => (
              <div key={p} className="relative">
                <div className="print-avoid mb-4 border-l-2 border-electric pl-4 print:break-after-avoid">
                  <p className="font-mono text-xs font-semibold uppercase tracking-wider text-electric print:text-[#0891b2]">
                    {PHASE_META[p].label}
                  </p>
                  <h3 className="font-display text-lg font-semibold text-white">{PHASE_META[p].title}</h3>
                  <p className="print-muted text-sm text-slate-400">{PHASE_META[p].focus}</p>
                </div>
                <ol className="space-y-3">
                  {report.roadmap[p].map((a, i) => (
                    <li
                      key={a.questionId}
                      className="print-light print-avoid rounded-xl border border-white/10 bg-white/[0.03] p-4"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-electric/15 font-mono text-xs font-semibold text-electric print:text-[#0891b2]">
                          {i + 1}
                        </span>
                        <h4 className="font-semibold leading-snug text-white">{a.title}</h4>
                      </div>
                      <p className="print-muted mt-2 text-sm text-slate-300">{a.detail}</p>
                      <p className="mt-3 text-xs text-slate-400">
                        <span className="font-semibold text-teal-400 print:text-[#0d9488]">Indicador:</span> {a.kpi}
                      </p>
                      {a.tools?.length ? (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {a.tools.map((t) => (
                            <span
                              key={t}
                              className="rounded-md border border-white/10 px-2 py-0.5 text-[11px] text-slate-300 print:border-slate-300"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      <div className="mt-3 flex gap-4 text-[11px] text-slate-500">
                        <span>Impacto: {IMPACT[a.impact]}</span>
                        <span>Esfuerzo: {EFFORT[a.effort]}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        {/* Siguiente paso */}
        <section className="card print-light print-avoid relative overflow-hidden border-electric/40 p-6 sm:p-10">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-electric/10 blur-3xl print:hidden" />
          <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="eyebrow flex items-center gap-2">
                <Spark className="h-4 w-4" /> Siguiente paso recomendado
              </p>
              <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
                Agende su diagnóstico gratuito con IntegraIA
              </h2>
              <p className="print-muted mt-3 max-w-2xl text-slate-300">{NEXT_STEP[report.level.id]}</p>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300">
                {["Sesión de 45 minutos", "Revisión de su roadmap", "Sin compromiso"].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-teal-400" /> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="no-print flex flex-col items-stretch gap-2 md:items-end">
              <a href={cta} target="_blank" rel="noopener noreferrer" className="btn-primary text-base">
                <Whatsapp /> Agendar diagnóstico gratuito
              </a>
              <p className="text-center text-xs text-slate-500 md:text-right">
                Se abrirá WhatsApp con su score y resultados listos para enviar.
              </p>
            </div>
          </div>
        </section>

        <div className="no-print flex flex-col items-center justify-between gap-4 pt-2 text-sm text-slate-500 sm:flex-row">
          <Link href="/diagnostico" className="hover:text-electric">
            ← Revisar mis respuestas
          </Link>
          <button onClick={handlePrint} className="flex items-center gap-2 hover:text-electric">
            Descargar PDF <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <p className="hidden pt-4 text-center text-[10px] text-slate-500 print:block">
          IntegraIA by EMET · Formación y consultoría en Inteligencia Artificial para pymes
        </p>
      </div>
    </main>
  );
}
