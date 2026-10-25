import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/screens/admin/PlaceholderPage";

export const Route = createFileRoute("/admin/anuncios")({
  component: () => (
    <PlaceholderPage
      title="Anúncios e destaques"
      description="Gerencie anúncios publicitários e destaques da plataforma."
    />
  ),
});
