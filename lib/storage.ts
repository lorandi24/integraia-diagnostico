import type { DiagnosticState } from "./types";

const KEY = "integraia:diagnostico:v1";

export const EMPTY_STATE: DiagnosticState = { profile: null, answers: {} };

export function loadState(): DiagnosticState {
  if (typeof window === "undefined") return EMPTY_STATE;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw) as DiagnosticState;
    return { ...EMPTY_STATE, ...parsed, answers: parsed.answers ?? {} };
  } catch {
    return EMPTY_STATE;
  }
}

export function saveState(state: DiagnosticState): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* almacenamiento no disponible (modo privado): la app sigue funcionando en memoria */
  }
}

export function clearState(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
}
