import { createFileRoute } from "@tanstack/react-router";
import { SignIn } from "@clerk/tanstack-react-start";
import adminLoginCss from "@/styles/admin-login.css?url";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    links: [{ rel: "stylesheet", href: adminLoginCss }],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  return (
    <div className="at-login">
      <SignIn
        routing="path"
        path="/admin/login"
        signUpUrl="/admin/login"
        forceRedirectUrl="/admin"
        appearance={{
          elements: {
            rootBox: "at-login__panel",
            card: "at-login__form",
          },
        }}
      />
    </div>
  );
}
