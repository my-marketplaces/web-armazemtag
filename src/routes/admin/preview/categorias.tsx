import { createFileRoute } from "@tanstack/react-router";
import CategoriasPage from "@/screens/admin/preview/CategoriasPage";
import { PreviewProvider } from "@/context/PreviewContext";

export const Route = createFileRoute("/admin/preview/categorias")({
  component: () => (
    <PreviewProvider>
      <CategoriasPage />
    </PreviewProvider>
  ),
});
