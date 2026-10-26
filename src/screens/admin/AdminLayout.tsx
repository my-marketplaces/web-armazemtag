import { Link, useLocation } from "@tanstack/react-router";
import { LogoArmazemTag } from "@/components/LogoArmazemTag";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const navItems = [
  { to: "/admin", label: "Visão geral", icon: "grid", end: true },
  { to: "/admin/cadastros", label: "Cadastros", icon: "users" },
  { to: "/admin/seguranca", label: "Segurança", icon: "shield" },
  { to: "/admin/planos", label: "Planos e assinaturas", icon: "credit-card" },
  { to: "/admin/anuncios", label: "Anúncios e destaques", icon: "megaphone" },
  { to: "/admin/indicacoes", label: "Indicações", icon: "gift" },
  { to: "/admin/suporte", label: "Suporte", icon: "life-buoy" },
  { to: "/admin/financeiro", label: "Financeiro", icon: "wallet" },
  { to: "/admin/configuracoes", label: "Configurações", icon: "settings" },
];

const iconPaths: Record<string, string> = {
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  users:
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  "credit-card": "M1 4h22v16H1zM1 10h22M5 15h4",
  megaphone:
    "M3 11v2a2 2 0 0 0 2 2h2l9 6V3L7 9H5a2 2 0 0 0-2 2zM16 8a4 4 0 0 1 0 6M19 5a8 8 0 0 1 0 14",
  gift: "M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z",
  "life-buoy":
    "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24",
  wallet:
    "M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM16 12a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM3 7h16",
  settings:
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68 1.65 1.65 0 0 0 9 3.17V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
};

export function AdminLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm fixed inset-y-0 left-0 z-30">
        <div className="p-6 border-b border-slate-100">
          <Link to="/admin" className="flex items-center gap-2">
            <LogoArmazemTag variant="horizontal" className="h-8" />
          </Link>
          <p className="text-xs text-slate-500 mt-2">Painel Administrativo</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.end ? pathname === item.to : pathname.startsWith(item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-red-50 text-red-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                )}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={iconPaths[item.icon] || iconPaths.grid} />
                </svg>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-700 text-xs font-bold">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">Administrador</p>
              <Link
                to="/admin/login"
                className="text-xs text-slate-500 hover:text-red-600 transition-colors"
              >
                Sair
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-64 flex flex-col">
        <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-slate-900">Painel Administrativo</h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">admin@armazemtag.com.br</span>
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-700 text-xs font-bold">
                AD
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
