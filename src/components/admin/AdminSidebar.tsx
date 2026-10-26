import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Store,
  Shield,
  Headphones,
  CreditCard,
  Megaphone,
  Gift,
  DollarSign,
  FileBarChart,
  UserCog,
  Settings,
  ScrollText,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  "layout-dashboard": LayoutDashboard,
  users: Users,
  store: Store,
  shield: Shield,
  headphones: Headphones,
  "credit-card": CreditCard,
  megaphone: Megaphone,
  gift: Gift,
  "dollar-sign": DollarSign,
  "file-bar-chart": FileBarChart,
  "user-cog": UserCog,
  settings: Settings,
  "scroll-text": ScrollText,
};

interface NavItem {
  to: string;
  label: string;
  icon: string;
  end?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: "Geral",
    items: [{ to: "/admin", label: "Visão geral", icon: "layout-dashboard", end: true }],
  },
  {
    title: "Operação",
    items: [
      { to: "/admin/cadastros", label: "Cadastros", icon: "users" },
      { to: "/admin/lojas", label: "Lojas e serviços", icon: "store" },
      { to: "/admin/seguranca", label: "Segurança", icon: "shield" },
      { to: "/admin/suporte", label: "Suporte", icon: "headphones" },
    ],
  },
  {
    title: "Comercial",
    items: [
      { to: "/admin/planos", label: "Planos e assinaturas", icon: "credit-card" },
      { to: "/admin/anuncios", label: "Anúncios e destaques", icon: "megaphone" },
      { to: "/admin/indicacoes", label: "Indicações", icon: "gift" },
    ],
  },
  {
    title: "Gestão",
    items: [
      { to: "/admin/financeiro", label: "Financeiro", icon: "dollar-sign" },
      { to: "/admin/relatorios", label: "Relatórios", icon: "file-bar-chart" },
    ],
  },
  {
    title: "Administração",
    items: [
      { to: "/admin/equipe", label: "Equipe e permissões", icon: "user-cog" },
      { to: "/admin/configuracoes", label: "Configurações", icon: "settings" },
      { to: "/admin/auditoria", label: "Auditoria", icon: "scroll-text" },
    ],
  },
];

interface AdminSidebarProps {
  logoSrc: string;
}

export function AdminSidebar({ logoSrc }: AdminSidebarProps) {
  const { pathname } = useLocation();

  return (
    <aside className="at-dashboard-sidebar">
      <div className="at-dashboard-brand">
        <img src={logoSrc} alt="Armazém Tag Classificados" />
        <span>Administração Central</span>
      </div>

      <nav aria-label="Menu administrativo">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <div className="at-dashboard-nav-group">{group.title}</div>
            {group.items.map((item) => {
              const Icon = ICON_MAP[item.icon] || LayoutDashboard;
              const isActive = item.end ? pathname === item.to : pathname.startsWith(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  data-active={isActive}
                  className="at-dashboard-nav-link"
                >
                  <Icon size={17} strokeWidth={1.7} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="at-dashboard-sidebar-footer">
        <strong>AE Consultoria</strong>
        <span>Gestão da plataforma</span>
      </div>
    </aside>
  );
}

export { NAV_GROUPS };
