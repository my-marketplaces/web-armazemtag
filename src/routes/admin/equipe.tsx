import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/screens/admin/PlaceholderPage";

export const Route = createFileRoute("/admin/equipe")({
  component: () => (
    <PlaceholderPage
      title="Equipe e permissões"
      description="Gerencie membros da equipe e seus níveis de acesso ao painel."
    />
  ),
});
