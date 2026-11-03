import type { Metadata } from "next";
import { DiagnosticFlow } from "@/components/DiagnosticFlow";

export const metadata: Metadata = {
  title: "Cuestionario | Diagnóstico de Madurez en IA – IntegraIA by EMET",
};

export default function DiagnosticoPage() {
  return <DiagnosticFlow />;
}
