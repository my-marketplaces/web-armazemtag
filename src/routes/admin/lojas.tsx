import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/screens/admin/PlaceholderPage";

export const Route = createFileRoute("/admin/lojas")({
  component: () => (
    <PlaceholderPage
      title="Lojas e serviços"
      description="Gerencie as lojas e prestadores de serviços cadastrados na plataforma."
    />
  ),
});
