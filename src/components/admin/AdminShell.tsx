import { useState, type ReactNode } from "react";
import { Menu } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import { MobileDrawer } from "./MobileDrawer";

interface AdminShellProps {
  children: ReactNode;
  logoSrc: string;
  preview?: boolean;
}

export function AdminShell({ children, logoSrc, preview = false }: AdminShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="at-dashboard">
      <AdminSidebar logoSrc={logoSrc} />

      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} logoSrc={logoSrc} />

      <div className="at-dashboard-workspace">
        <header className="at-dashboard-header">
          <div className="at-dashboard-header-title">
            <button
              className="at-dashboard-mobile-menu-btn"
              onClick={() => setDrawerOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu size={20} />
            </button>
            <div>
              <strong>Armazém Tag</strong>
              <span>Sistema de gestão administrativa</span>
            </div>
          </div>

          <div className="at-dashboard-header-actions">
            {preview && (
              <span className="at-dashboard-preview-badge">
                Prévia de desenvolvimento
              </span>
            )}
            <div className="at-dashboard-user">
              <span>Visitante · Prévia</span>
              <div className="at-dashboard-user-avatar">VP</div>
            </div>
          </div>
        </header>

        <main className="at-dashboard-main">{children}</main>
      </div>
    </div>
  );
}
