import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { ClerkProvider, RedirectToSignIn, useAuth } from "@clerk/tanstack-react-start";
import { Loader2 } from "lucide-react";
import { Toaster } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import adminDashboardCss from "@/styles/admin-dashboard.css?url";
import { CLERK_PUBLISHABLE_KEY, isClerkConfigured } from "@/lib/clerk";

const LOGO_SRC = "/assets/logos/armazem-tag-classificados.png";

export const Route = createFileRoute("/admin")({
  head: () => ({
    links: [{ rel: "stylesheet", href: adminDashboardCss }],
  }),
  component: AdminLayoutRoute,
});

function AuthGate({ pathname, logoSrc }: { pathname: string; logoSrc: string }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <AdminShell logoSrc={logoSrc} preview>
        <div className="at-empty">
          <Loader2 size={24} className="at-spin" aria-hidden="true" />
          Carregando…
        </div>
      </AdminShell>
    );
  }

  if (!isSignedIn) {
    if (pathname === "/admin/login") {
      return <Outlet />;
    }
    return <RedirectToSignIn />;
  }

  return (
    <AdminShell logoSrc={logoSrc}>
      <Outlet />
    </AdminShell>
  );
}

function AdminLayoutRoute() {
  const { location } = useRouterState();
  const pathname = location?.pathname ?? "";

  if (pathname.startsWith("/admin/preview")) {
    return <Outlet />;
  }

  if (!isClerkConfigured) {
    return (
      <AdminShell logoSrc={LOGO_SRC} preview>
        <Outlet />
      </AdminShell>
    );
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY!}>
      <Toaster position="top-right" richColors />
      <AuthGate pathname={pathname} logoSrc={LOGO_SRC} />
    </ClerkProvider>
  );
}
