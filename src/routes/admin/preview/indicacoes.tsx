import { createFileRoute } from "@tanstack/react-router";
import IndicacoesPage from "@/screens/admin/preview/IndicacoesPage";
import { PreviewProvider } from "@/context/PreviewContext";

export const Route = createFileRoute("/admin/preview/indicacoes")({
  component: () => (
    <PreviewProvider>
      <IndicacoesPage />
    </PreviewProvider>
  ),
});
