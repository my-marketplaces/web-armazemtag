import { createFileRoute } from "@tanstack/react-router";
import { CadastrosScreen } from "@/screens/admin/CadastrosScreen";

export const Route = createFileRoute("/admin/cadastros")({
  component: CadastrosScreen,
});
