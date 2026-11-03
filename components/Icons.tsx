type P = { className?: string };
const base = (className = "h-5 w-5") => ({
  className,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
});

export const ArrowRight = ({ className }: P) => (
  <svg {...base(className)}><path d="M5 12h14M13 5l7 7-7 7" /></svg>
);
export const ArrowLeft = ({ className }: P) => (
  <svg {...base(className)}><path d="M19 12H5M11 19l-7-7 7-7" /></svg>
);
export const Check = ({ className }: P) => (
  <svg {...base(className)}><path d="M20 6 9 17l-5-5" /></svg>
);
export const Target = ({ className }: P) => (
  <svg {...base(className)}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></svg>
);
export const Download = ({ className }: P) => (
  <svg {...base(className)}><path d="M12 3v12M7 10l5 5 5-5M5 21h14" /></svg>
);
export const Copy = ({ className }: P) => (
  <svg {...base(className)}><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>
);
export const Refresh = ({ className }: P) => (
  <svg {...base(className)}><path d="M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5" /></svg>
);
export const Spark = ({ className }: P) => (
  <svg {...base(className)}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" /></svg>
);
export const Clock = ({ className }: P) => (
  <svg {...base(className)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
export const Shield = ({ className }: P) => (
  <svg {...base(className)}><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" /></svg>
);
export const Chart = ({ className }: P) => (
  <svg {...base(className)}><path d="M3 3v18h18M7 15l4-4 3 3 5-6" /></svg>
);
export const Map = ({ className }: P) => (
  <svg {...base(className)}><path d="m9 4-6 2v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14" /></svg>
);
export const Whatsapp = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className ?? "h-5 w-5"} fill="currentColor" aria-hidden="true">
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.2c0-.1-.2-.2-.5-.3Z" />
  </svg>
);
