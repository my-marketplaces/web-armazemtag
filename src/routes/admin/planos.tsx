import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/screens/admin/PlaceholderPage";

export const Route = createFileRoute("/admin/planos")({
  component: () => (
    <PlaceholderPage
      title="Planos e assinaturas"
      description="Gerencie os planos disponíveis e assinaturas ativas."
    />
  ),
});
