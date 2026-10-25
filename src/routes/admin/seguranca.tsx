import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/screens/admin/PlaceholderPage";

export const Route = createFileRoute("/admin/seguranca")({
  component: () => (
    <PlaceholderPage
      title="Segurança"
      description="Gerencie permissões, auditoria e acesso ao painel."
    />
  ),
});
