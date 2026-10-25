import { createFileRoute, redirect } from "@tanstack/react-router";
import AdminDashboard from "@/screens/admin/AdminDashboard";

const LOGO_SRC = "/assets/logos/armazem-tag-classificados.png";

export const Route = createFileRoute("/admin/preview")({
  beforeLoad: () => {
    if (!import.meta.env.DEV) {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: () => <AdminDashboard logoSrc={LOGO_SRC} />,
});
