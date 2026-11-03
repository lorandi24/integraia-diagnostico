export type SectionId = "estrategia" | "procesos" | "datos" | "equipo" | "presupuesto";

/** Objetivo principal declarado por el dueño; se usa para priorizar el roadmap. */
export type Goal = "ventas" | "costos" | "tiempo" | "atencion" | "orden";

export type Phase = 1 | 2 | 3;

export interface Option {
  label: string;
  /** 0 (nada maduro) – 4 (muy maduro) */
  score: 0 | 1 | 2 | 3 | 4;
}

export interface Action {
  title: string;
  detail: string;
  /** Indicador para saber si la acción funcionó */
  kpi: string;
  tools?: string[];
  /** 1 = días 1-30, 2 = días 31-60, 3 = días 61-90 */
  phase: Phase;
  /** 1 bajo – 3 alto */
  impact: 1 | 2 | 3;
  /** 1 bajo – 3 alto */
  effort: 1 | 2 | 3;
  goals: Goal[];
}

export interface Question {
  id: string;
  section: SectionId;
  text: string;
  help?: string;
  options: Option[];
  /** Frase usada como fortaleza cuando la respuesta es alta (>=3) */
  strength: string;
  /** Frase usada como brecha cuando la respuesta es baja (<=2) */
  gap: string;
  action: Action;
}

export interface Section {
  id: SectionId;
  title: string;
  short: string;
  description: string;
  weight: number;
}

export interface Profile {
  company: string;
  name: string;
  industry: string;
  size: string;
  goal: Goal;
}

export type Answers = Record<string, number>;

/** Prospecto capturado antes de mostrar el reporte (solo se guarda localmente). */
export interface Lead {
  name: string;
  /** 10 dígitos, normalizado */
  whatsapp: string;
  industry: string;
  createdAt: string;
}

export interface DiagnosticState {
  profile: Profile | null;
  answers: Answers;
  lead?: Lead;
  completedAt?: string;
}

export type LevelId = "inicial" | "desarrollo" | "intermedio" | "avanzado";

export interface Level {
  id: LevelId;
  name: string;
  range: [number, number];
  headline: string;
  summary: string;
}

export interface SectionResult {
  section: Section;
  score: number;
}

export interface Insight {
  questionId: string;
  section: Section;
  text: string;
  score: number;
}

export interface RoadmapItem extends Action {
  questionId: string;
  section: Section;
  priority: number;
}

export interface Report {
  profile: Profile;
  score: number;
  level: Level;
  sections: SectionResult[];
  strengths: Insight[];
  gaps: Insight[];
  roadmap: Record<Phase, RoadmapItem[]>;
  generatedAt: string;
}
