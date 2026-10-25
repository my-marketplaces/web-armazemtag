import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/screens/admin/PlaceholderPage";

export const Route = createFileRoute("/admin/relatorios")({
  component: () => (
    <PlaceholderPage
      title="Relatórios"
      description="Visualize relatórios operacionais e comerciais da plataforma."
    />
  ),
});
