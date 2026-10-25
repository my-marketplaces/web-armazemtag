import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  beforeLoad: () => {
    if (import.meta.env.DEV) {
      throw redirect({ to: "/admin/preview" });
    }
    throw redirect({ to: "/admin/login" });
  },
});
