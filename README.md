# Diagnóstico de Madurez en IA – IntegraIA by EMET

Aplicación web para que dueños de pymes mexicanas evalúen en ~7 minutos qué tan preparada está su empresa para aprovechar la Inteligencia Artificial, y reciban un reporte accionable con roadmap de 90 días.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS 3.4** con la paleta IntegraIA (azul marino profundo, cian eléctrico, teal, blanco)
- Cero dependencias de runtime adicionales: PDF vía `window.print()` con hoja de estilos de impresión, gráficos en SVG nativo, fuentes autoalojadas con `next/font`
- Todas las rutas se prerenderizan como estáticas; el estado vive en `localStorage` (sin backend ni autenticación)

## Instalación y ejecución

Requisitos: Node.js 18.18+ (recomendado 20 o 22).

```bash
npm install
```

```bash
npm run dev
```

Abra http://localhost:3000.

Build de producción:

```bash
npm run build && npm start
```

Verificación de tipos:

```bash
npm run typecheck
```

## Logo oficial

Suba el archivo a **`public/logo-integraia.png`** y se mostrará automáticamente en el encabezado de todas las páginas y en el PDF del reporte. Mientras no exista, se muestra el logo temporal en SVG.

Recomendaciones para el PNG:
- **Fondo transparente real** (canal alfa). La app usa fondo azul marino; un PNG con fondo blanco o con el patrón de cuadros "incrustado" se verá como un recuadro.
- Recorte ajustado al logo (sin márgenes vacíos) y ~600 px de ancho. Se muestra a 48 px de alto en móvil y 64 px en escritorio, conservando proporciones.

## WhatsApp y captura de prospectos

- Antes del reporte se pide **Nombre, WhatsApp (10 dígitos, acepta +52/521) y Giro**. Se guardan solo en `localStorage` (clave `integraia:diagnostico:v1`); no se envían a ningún servidor.
- El botón **"Agendar diagnóstico gratuito"** abre `wa.me/5219992978891` con el mensaje prellenado:
  > Hola, acabo de hacer el Diagnóstico de Madurez en IA de IntegraIA. Mi score fue [SCORE] ([NIVEL]). Me gustaría agendar una sesión.
  
  seguido de nombre, negocio, giro y WhatsApp del prospecto.
- Para cambiar el número sin tocar código, defina `NEXT_PUBLIC_WHATSAPP_NUMBER` en `.env.local` (ver `.env.example`).

## Despliegue

Listo para **Vercel** (importar el repo, sin configuración extra) o cualquier hosting con Node. Si desea otro número de WhatsApp, agregue `NEXT_PUBLIC_WHATSAPP_NUMBER` en el panel del proveedor.

## Estructura

```
app/
  page.tsx               Landing (Server Component, estática)
  diagnostico/page.tsx   Cuestionario
  reporte/page.tsx       Reporte personalizado
  globals.css            Estilos base + estilos de impresión/PDF
components/
  DiagnosticFlow.tsx     Perfil + preguntas (auto-avance, teclas 1–5, progreso guardado) + datos de contacto
  ReportView.tsx         Reporte, descarga PDF, copiar, CTA de WhatsApp
  Logo.tsx               Logo oficial con respaldo automático al SVG temporal
  ScoreGauge.tsx, ProgressBar.tsx, Icons.tsx
public/
  logo-integraia.png     Logo oficial (subirlo aquí)
lib/
  lead.ts                Validación de WhatsApp y mensaje prellenado
  questions.ts           Secciones, 21 preguntas, fortaleza/brecha y acción asociada a cada una
  levels.ts              Niveles de madurez y textos
  report.ts              Motor de scoring, priorización y roadmap
  exportText.ts          Versión en texto plano del reporte
  storage.ts             Persistencia en localStorage
  config.ts              Marca, ruta del logo y número de WhatsApp
  types.ts               Tipos compartidos
```

## Metodología de scoring

- Cada respuesta vale 0–4. El score de cada sección es su promedio normalizado a 0–100.
- **Score global** = promedio ponderado: Estrategia 20%, Procesos 25%, Datos 20%, Equipo 20%, Presupuesto 15%.
- **Niveles:** Inicial (0–25), En desarrollo (26–50), Intermedio (51–75), Avanzado (76–100).
- **Fortalezas:** respuestas con puntaje ≥ 3 (con respaldo a nivel sección si hay pocas).
- **Brechas y roadmap:** respuestas ≤ 2, priorizadas por `(4 − puntaje) × impacto × bono por objetivo del dueño + preferencia por bajo esfuerzo`. Cada acción pertenece a una fase (días 1–30, 31–60, 61–90), con máximo 3 por fase. Si hay pocas brechas, se completan con acciones avanzadas (agentes de IA, analítica predictiva) y el roadmap siempre cierra con una acción de medición.

Para ajustar preguntas, pesos o acciones basta con editar `lib/questions.ts`; el resto de la app se adapta automáticamente.
