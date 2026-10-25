import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/screens/admin/PlaceholderPage";

export const Route = createFileRoute("/admin/auditoria")({
  component: () => (
    <PlaceholderPage
      title="Auditoria"
      description="Visualize o registro de ações administrativas e alterações no sistema."
    />
  ),
});
