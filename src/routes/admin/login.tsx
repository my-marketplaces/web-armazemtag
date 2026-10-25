import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminLoginView } from "@/components/admin/AdminLoginView";
import adminLoginCss from "@/styles/admin-login.css?url";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    links: [{ rel: "stylesheet", href: adminLoginCss }],
  }),
  component: AdminLoginPage,
});

const LOGO_SRC = "/assets/logos/armazem-tag-classificados.png";
const BACKGROUND_SRC = "/assets/backgrounds/login-bg.jpg";
const GOOGLE_ICON_SRC = "/assets/icons/google.svg";

function AdminLoginPage() {
  const showPreview = import.meta.env.DEV;

  return (
    <>
      <AdminLoginView
        logoSrc={LOGO_SRC}
        backgroundSrc={BACKGROUND_SRC}
        googleIconSrc={GOOGLE_ICON_SRC}
        onGoogleLogin={undefined}
        busy={false}
      />
      {showPreview && (
        <div className="at-login__preview-link">
          <Link to="/admin/preview">Visualizar dashboard</Link>
        </div>
      )}
    </>
  );
}
