import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/screens/admin/PlaceholderPage";

export const Route = createFileRoute("/admin/financeiro")({
  component: () => (
    <PlaceholderPage
      title="Financeiro"
      description="Acompanhe relatórios financeiros e recebíveis."
    />
  ),
});
