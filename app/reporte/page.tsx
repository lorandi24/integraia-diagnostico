import type { Metadata } from "next";
import { ReportView } from "@/components/ReportView";

export const metadata: Metadata = {
  title: "Su reporte | Diagnóstico de Madurez en IA – IntegraIA by EMET",
  robots: { index: false },
};

export default function ReportePage() {
  return <ReportView />;
}
