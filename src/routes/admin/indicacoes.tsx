import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/screens/admin/PlaceholderPage";

export const Route = createFileRoute("/admin/indicacoes")({
  component: () => (
    <PlaceholderPage
      title="Indicações"
      description="Acompanhe indicações e programas de referência."
    />
  ),
});
