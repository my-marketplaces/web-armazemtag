import { createFileRoute } from "@tanstack/react-router";
import { AdminUsers } from "@/screens/admin/AdminUsers";

export const Route = createFileRoute("/admin/cadastros")({
  component: AdminUsers,
});
