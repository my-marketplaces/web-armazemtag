import { createFileRoute } from "@tanstack/react-router";
import PlanosPage from "@/screens/admin/preview/PlanosPage";
import { PreviewProvider } from "@/context/PreviewContext";

export const Route = createFileRoute("/admin/preview/planos")({
  component: () => (
    <PreviewProvider>
      <PlanosPage />
    </PreviewProvider>
  ),
});
