import type { Lead, Report } from "./types";

/**
 * Normaliza un número mexicano a 10 dígitos.
 * Acepta formatos como "999 297 8891", "+52 999 297 8891" o "521 999 297 8891".
 * Devuelve null si no es válido.
 */
export function normalizeMxPhone(input: string): string | null {
  let d = input.replace(/\D/g, "");
  if (d.length === 13 && d.startsWith("521")) d = d.slice(3);
  else if (d.length === 12 && d.startsWith("52")) d = d.slice(2);
  return /^\d{10}$/.test(d) ? d : null;
}

/** 9992978891 → 999 297 8891 */
export function formatMxPhone(d: string): string {
  return d.replace(/^(\d{3})(\d{3})(\d{4})$/, "$1 $2 $3");
}

/** Mensaje prellenado para WhatsApp con score, nivel y datos del prospecto. */
export function buildWhatsappMessage(report: Report, lead: Lead): string {
  const lines = [
    `Hola, acabo de hacer el Diagnóstico de Madurez en IA de IntegraIA. Mi score fue ${report.score} (${report.level.name}). Me gustaría agendar una sesión.`,
    "",
    `Nombre: ${lead.name}`,
    report.profile.company ? `Negocio: ${report.profile.company}` : "",
    `Giro: ${lead.industry}`,
    `WhatsApp: ${formatMxPhone(lead.whatsapp)}`,
  ];
  return lines.filter((l, i) => l !== "" || i === 1).join("\n");
}
