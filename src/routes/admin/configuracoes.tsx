import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/screens/admin/PlaceholderPage";

export const Route = createFileRoute("/admin/configuracoes")({
  component: () => (
    <PlaceholderPage
      title="Configurações"
      description="Ajustes gerais do sistema e da plataforma."
    />
  ),
});
