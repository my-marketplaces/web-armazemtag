import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import adminDashboardCss from "@/styles/admin-dashboard.css?url";

const LOGO_SRC = "/assets/logos/armazem-tag-classificados.png";

export const Route = createFileRoute("/admin/__layout")({
  head: () => ({
    links: [{ rel: "stylesheet", href: adminDashboardCss }],
  }),
  component: AdminLayoutRoute,
});

function AdminLayoutRoute() {
  const { pathname } = useLocation();

  if (pathname === "/admin/login" || pathname === "/admin/preview") {
    return <Outlet />;
  }

  return (
    <AdminShell logoSrc={LOGO_SRC} preview={import.meta.env.DEV}>
      <Outlet />
    </AdminShell>
  );
}
