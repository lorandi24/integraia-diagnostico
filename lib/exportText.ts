import { PHASE_META } from "./report";
import type { Phase, Report } from "./types";

/** Versión en texto plano del reporte, lista para pegar en correo, WhatsApp o Notion. */
export function reportToText(r: Report): string {
  const date = new Date(r.generatedAt).toLocaleDateString("es-MX", { dateStyle: "long" });
  const lines: string[] = [
    "DIAGNÓSTICO DE MADUREZ EN IA – IntegraIA by EMET",
    `${r.profile.company || "Mi negocio"} · ${r.profile.industry} · ${r.profile.size}`,
    `Fecha: ${date}`,
    "",
    `SCORE: ${r.score}/100 — Nivel ${r.level.name}`,
    r.level.headline,
    r.level.summary,
    "",
    "RESULTADOS POR ÁREA",
    ...r.sections.map((s) => `• ${s.section.title}: ${s.score}/100`),
    "",
    "PRINCIPALES FORTALEZAS",
    ...r.strengths.map((s) => `✓ ${s.text}`),
    "",
    "PRINCIPALES OPORTUNIDADES",
    ...r.gaps.map((g) => `→ ${g.text}`),
    "",
    "ROADMAP DE 90 DÍAS",
  ];

  ([1, 2, 3] as Phase[]).forEach((p) => {
    lines.push("", `${PHASE_META[p].label} · ${PHASE_META[p].title}`);
    r.roadmap[p].forEach((a, i) => {
      lines.push(`${i + 1}. ${a.title}`, `   ${a.detail}`, `   Indicador: ${a.kpi}`);
      if (a.tools?.length) lines.push(`   Herramientas: ${a.tools.join(", ")}`);
    });
  });

  lines.push(
    "",
    "SIGUIENTE PASO",
    "Agende su diagnóstico gratuito con IntegraIA by EMET para convertir este roadmap en un plan de implementación a la medida.",
  );
  return lines.join("\n");
}
