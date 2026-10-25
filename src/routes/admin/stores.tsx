import { createFileRoute } from "@tanstack/react-router";
import { AdminStores } from "@/screens/admin/AdminStores";

export const Route = createFileRoute("/admin/stores")({
  component: AdminStores,
});
