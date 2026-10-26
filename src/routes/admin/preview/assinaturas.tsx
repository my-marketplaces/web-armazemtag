import { createFileRoute } from "@tanstack/react-router";
import AssinaturasPage from "@/screens/admin/preview/AssinaturasPage";
import { PreviewProvider } from "@/context/PreviewContext";

export const Route = createFileRoute("/admin/preview/assinaturas")({
  component: () => (
    <PreviewProvider>
      <AssinaturasPage />
    </PreviewProvider>
  ),
});
