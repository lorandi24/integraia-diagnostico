"use client";

import { useEffect, useState } from "react";
import { Download } from "./Icons";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Botón "Instalar app".
 * - Android / Chrome / Edge: usa el diálogo nativo de instalación.
 * - iPhone (Safari): muestra cómo agregarla a la pantalla de inicio.
 * - Si ya está instalada (modo standalone), no se muestra.
 */
export function InstallApp({ className = "" }: { className?: string }) {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [installed, setInstalled] = useState(true); // oculto hasta saberlo en el cliente

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    setInstalled(standalone);
    setIsIos(/iphone|ipad|ipod/i.test(navigator.userAgent));

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed || (!prompt && !isIos)) return null;

  const install = async () => {
    if (prompt) {
      await prompt.prompt();
      await prompt.userChoice;
      setPrompt(null);
    } else {
      setShowHelp((v) => !v);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button type="button" onClick={install} className="btn-ghost py-2 text-sm">
        <Download className="h-4 w-4" /> Instalar app
      </button>
      {showHelp && (
        <div className="card absolute right-0 top-full z-20 mt-2 w-64 p-4 text-sm text-slate-300 shadow-glow">
          <p className="font-semibold text-white">Agregar a su iPhone</p>
          <ol className="mt-2 list-decimal space-y-1 pl-4">
            <li>
              Toque el botón <strong className="text-white">Compartir</strong> de Safari (cuadro con flecha).
            </li>
            <li>
              Elija <strong className="text-white">Agregar a inicio</strong>.
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}
