import { createFileRoute } from "@tanstack/react-router";
import CadastrosPage from "@/screens/admin/CadastrosPage";
import { PreviewProvider } from "@/context/PreviewContext";

export const Route = createFileRoute("/admin/preview/cadastros")({
  component: () => (
    <PreviewProvider>
      <CadastrosPage />
    </PreviewProvider>
  ),
});
