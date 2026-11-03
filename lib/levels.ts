import type { Level } from "./types";

export const LEVELS: Level[] = [
  {
    id: "inicial",
    name: "Inicial",
    range: [0, 25],
    headline: "Su negocio está listo para dar el primer paso",
    summary:
      "La operación depende principalmente de personas y procesos manuales. La buena noticia: es la etapa donde la IA genera los ahorros más rápidos y visibles, con inversiones mínimas y herramientas que su equipo puede usar desde la próxima semana.",
  },
  {
    id: "desarrollo",
    name: "En desarrollo",
    range: [26, 50],
    headline: "Tiene bases digitales; ahora toca ordenarlas y conectarlas",
    summary:
      "Ya usa algunas herramientas digitales, pero de forma aislada y sin una estrategia común. El siguiente salto consiste en estandarizar procesos, centralizar la información y capacitar al equipo para que la IA trabaje sobre bases sólidas.",
  },
  {
    id: "intermedio",
    name: "Intermedio",
    range: [51, 75],
    headline: "Su negocio está listo para automatizar con IA",
    summary:
      "Cuenta con procesos y herramientas razonablemente maduros. Ahora puede integrar sistemas, automatizar flujos completos y usar la IA para decidir con datos, pasando de “usar herramientas” a “generar ventaja competitiva”.",
  },
  {
    id: "avanzado",
    name: "Avanzado",
    range: [76, 100],
    headline: "Su negocio es referente digital en su sector",
    summary:
      "Tiene una operación digital integrada y una cultura abierta a la innovación. Su oportunidad está en escalar: agentes de IA, análisis predictivo y nuevos modelos de negocio que lo distancien de la competencia.",
  },
];

export function getLevel(score: number): Level {
  return LEVELS.find((l) => score >= l.range[0] && score <= l.range[1]) ?? LEVELS[0];
}
