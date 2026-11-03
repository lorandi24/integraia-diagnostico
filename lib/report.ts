import { getLevel } from "./levels";
import { QUESTIONS, SECTIONS, SECTION_MAP } from "./questions";
import type {
  Action,
  Answers,
  Insight,
  LevelId,
  Phase,
  Profile,
  Question,
  Report,
  RoadmapItem,
  SectionId,
  SectionResult,
} from "./types";

const MAX_PER_PHASE = 3;
const MAX_STRENGTHS = 4;
const MAX_GAPS = 5;

/** Puntaje 0–100 de una sección: promedio de respuestas normalizado. */
function sectionScore(sectionId: SectionId, answers: Answers): number {
  const qs = QUESTIONS.filter((q) => q.section === sectionId);
  const total = qs.reduce((acc, q) => acc + (answers[q.id] ?? 0), 0);
  return Math.round((total / (qs.length * 4)) * 100);
}

/**
 * Prioridad de una brecha: cuánto falta (4 - respuesta) × impacto,
 * con bonificación si ataca el objetivo declarado por el dueño y
 * ligera preferencia por acciones de menor esfuerzo (quick wins).
 */
function priorityOf(q: Question, score: number, profile: Profile): number {
  const goalBoost = q.action.goals[0] === profile.goal ? 1.6 : q.action.goals.includes(profile.goal) ? 1.3 : 1;
  return (4 - score) * q.action.impact * goalBoost + (3 - q.action.effort) * 0.5;
}

/** Acciones complementarias cuando el negocio ya es maduro y quedan pocas brechas. */
const ADVANCED_ACTIONS: Record<Phase, Action & { section: SectionId }> = {
  1: {
    section: "estrategia",
    title: "Mapear oportunidades de IA de alto impacto por área",
    detail:
      "Revise cada área con su equipo y priorice 5 procesos donde un agente de IA o una automatización avanzada podrían generar ahorro o ventas medibles.",
    kpi: "Matriz impacto/esfuerzo con 5 iniciativas priorizadas",
    phase: 1,
    impact: 3,
    effort: 1,
    goals: ["ventas", "costos", "tiempo", "atencion", "orden"],
  },
  2: {
    section: "procesos",
    title: "Implementar un agente de IA para ventas o atención",
    detail:
      "Conecte un asistente de IA entrenado con la información de su negocio (catálogo, precios, preguntas frecuentes) a WhatsApp o su sitio web, con escalamiento a una persona.",
    kpi: "% de conversaciones resueltas sin intervención humana",
    tools: ["WhatsApp Business API", "Agentes de IA", "CRM"],
    phase: 2,
    impact: 3,
    effort: 3,
    goals: ["atencion", "ventas", "tiempo"],
  },
  3: {
    section: "datos",
    title: "Usar IA para pronósticos y decisiones con datos",
    detail:
      "Aplique análisis con IA sobre ventas, inventario y clientes para anticipar demanda, detectar clientes en riesgo y ajustar precios o compras.",
    kpi: "Precisión del pronóstico y decisiones tomadas con el tablero",
    tools: ["Power BI / Looker Studio", "Asistentes de IA para análisis de datos"],
    phase: 3,
    impact: 3,
    effort: 3,
    goals: ["ventas", "costos", "orden"],
  },
};

const CLOSING_ACTION: Action & { section: SectionId } = {
  section: "estrategia",
  title: "Medir resultados y planear el siguiente ciclo de 90 días",
  detail:
    "Compare los indicadores contra el punto de partida, documente aprendizajes y repita este diagnóstico para definir las prioridades del siguiente trimestre.",
  kpi: "Nuevo score de madurez vs. el actual",
  phase: 3,
  impact: 2,
  effort: 1,
  goals: ["orden"],
};

function toItem(a: Action & { section: SectionId }, id: string, priority = 0): RoadmapItem {
  const { section, ...action } = a;
  return { ...action, questionId: id, section: SECTION_MAP[section], priority };
}

export function buildReport(profile: Profile, answers: Answers, completedAt?: string): Report {
  const sections: SectionResult[] = SECTIONS.map((section) => ({
    section,
    score: sectionScore(section.id, answers),
  }));

  const score = Math.round(sections.reduce((acc, s) => acc + s.score * s.section.weight, 0));
  const level = getLevel(score);

  const scored = QUESTIONS.map((q) => ({ q, score: answers[q.id] ?? 0 }));

  // Fortalezas: respuestas altas, ponderando el peso de la sección.
  let strengths: Insight[] = scored
    .filter((x) => x.score >= 3)
    .sort((a, b) => b.score - a.score || SECTION_MAP[b.q.section].weight - SECTION_MAP[a.q.section].weight)
    .slice(0, MAX_STRENGTHS)
    .map(({ q, score }) => ({ questionId: q.id, section: SECTION_MAP[q.section], text: q.strength, score }));

  if (strengths.length < 2) {
    const best = [...sections].sort((a, b) => b.score - a.score)[0];
    strengths = [
      ...strengths,
      {
        questionId: `section-${best.section.id}`,
        section: best.section,
        text: `Su área con mayor avance es “${best.section.title}” (${best.score}/100): es el mejor punto de apoyo para arrancar.`,
        score: 0,
      },
      {
        questionId: "mindset",
        section: SECTION_MAP.estrategia,
        text: "Ya dio el paso más difícil: medir dónde está. Los negocios que diagnostican antes de invertir obtienen retornos más rápidos.",
        score: 0,
      },
    ].slice(0, MAX_STRENGTHS);
  }

  // Brechas priorizadas por impacto, distancia y objetivo del dueño.
  const ranked = scored
    .filter((x) => x.score <= 2)
    .map((x) => ({ ...x, priority: priorityOf(x.q, x.score, profile) }))
    .sort((a, b) => b.priority - a.priority);

  const gaps: Insight[] = ranked.slice(0, MAX_GAPS).map(({ q, score }) => ({
    questionId: q.id,
    section: SECTION_MAP[q.section],
    text: q.gap,
    score,
  }));

  // Roadmap de 90 días: hasta 3 acciones por fase, las de mayor prioridad.
  const roadmap: Record<Phase, RoadmapItem[]> = { 1: [], 2: [], 3: [] };
  for (const { q, priority } of ranked) {
    const bucket = roadmap[q.action.phase];
    if (bucket.length < MAX_PER_PHASE) {
      bucket.push({ ...q.action, questionId: q.id, section: SECTION_MAP[q.section], priority });
    }
  }
  ([1, 2, 3] as Phase[]).forEach((phase) => {
    if (roadmap[phase].length < 2) roadmap[phase].push(toItem(ADVANCED_ACTIONS[phase], `adv-${phase}`));
  });
  if (roadmap[3].length >= MAX_PER_PHASE) roadmap[3] = roadmap[3].slice(0, MAX_PER_PHASE - 1);
  roadmap[3].push(toItem(CLOSING_ACTION, "closing"));

  return {
    profile,
    score,
    level,
    sections,
    strengths,
    gaps,
    roadmap,
    generatedAt: completedAt ?? new Date().toISOString(),
  };
}

export const PHASE_META: Record<Phase, { label: string; title: string; focus: string }> = {
  1: { label: "Días 1–30", title: "Fundamentos y quick wins", focus: "Ordenar, capacitar y ganar tiempo de inmediato." },
  2: { label: "Días 31–60", title: "Implementación", focus: "Digitalizar procesos clave y centralizar la información." },
  3: { label: "Días 61–90", title: "Automatización y medición", focus: "Conectar, automatizar y medir el retorno." },
};

export const NEXT_STEP: Record<LevelId, string> = {
  inicial:
    "En una sesión de diagnóstico gratuita con IntegraIA identificaremos las 2 o 3 tareas donde la IA le ahorrará más horas desde el primer mes, sin necesidad de inversión fuerte ni conocimientos técnicos.",
  desarrollo:
    "En una sesión de diagnóstico gratuita con IntegraIA revisaremos sus herramientas actuales y le ayudaremos a convertir este roadmap en un plan de implementación con responsables y fechas.",
  intermedio:
    "En una sesión de diagnóstico gratuita con IntegraIA mapearemos los flujos que puede automatizar de punta a punta y estimaremos el retorno de cada uno.",
  avanzado:
    "En una sesión de diagnóstico gratuita con IntegraIA exploraremos agentes de IA y análisis predictivo a la medida de su operación para escalar su ventaja competitiva.",
};
