import Link from "next/link";

export default function NotFound() {
  return (
    <main className="bg-circuit flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="font-display text-3xl font-bold text-white">Página no encontrada</h1>
      <Link href="/" className="btn-primary">Volver al inicio</Link>
    </main>
  );
}
