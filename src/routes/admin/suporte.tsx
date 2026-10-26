import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/screens/admin/PlaceholderPage";

export const Route = createFileRoute("/admin/suporte")({
  component: () => (
    <PlaceholderPage title="Suporte" description="Gerencie tickets e atendimento aos usuários." />
  ),
});
