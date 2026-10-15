import { BadgePercent, Megaphone, Store, Tag, Tent, type LucideIcon } from "lucide-react";

export type NavLink = { label: string; to: string };

export type SimpleNavItem = { label: string; to: string; icon: LucideIcon };
export type MegaNavItem = { label: string; to: string; icon: LucideIcon; links: NavLink[] };
export type NavItem = SimpleNavItem | MegaNavItem;

export const navItems: NavItem[] = [
  {
    label: "Feiras",
    to: "/feiras",
    icon: Tent,
    links: [
      { label: "Todas as feiras", to: "/feiras" },
      { label: "Feira da Pedreira", to: "/feiras" },
      { label: "Ver-o-Peso", to: "/feiras" },
      { label: "Feiras orgânicas", to: "/feiras" },
      { label: "Como vender na feira", to: "/como-funciona" },
      { label: "Preciso de ajuda", to: "/suporte" },
    ],
  },
  {
    label: "Mercados",
    to: "/mercados",
    icon: Store,
    links: [
      { label: "Todos os mercados", to: "/mercados" },
      { label: "Mercados do bairro", to: "/mercados" },
      { label: "Hortifrúti", to: "/mercados" },
      { label: "Açougue e peixaria", to: "/mercados" },
      { label: "Cadastrar meu mercado", to: "/estabelecimentos" },
      { label: "Preciso de ajuda", to: "/suporte" },
    ],
  },
  {
    label: "Classificados",
    to: "/classificados",
    icon: Tag,
    links: [
      { label: "Explorar classificados", to: "/classificados" },
      { label: "Moda e acessórios", to: "/classificados" },
      { label: "Casa e construção", to: "/classificados" },
      { label: "Serviços locais", to: "/classificados" },
      { label: "Anunciar um produto", to: "/classificados" },
      { label: "Preciso de ajuda", to: "/suporte" },
    ],
  },
  {
    label: "Campanhas",
    to: "/campanhas",
    icon: Megaphone,
    links: [
      { label: "Campanhas ativas", to: "/campanhas" },
      { label: "Ofertas da semana", to: "/ofertas" },
      { label: "Promoções de feirantes", to: "/campanhas" },
      { label: "Divulgar uma campanha", to: "/campanhas" },
      { label: "Como funciona", to: "/como-funciona" },
      { label: "Preciso de ajuda", to: "/suporte" },
    ],
  },
  {
    label: "Ofertas",
    to: "/ofertas",
    icon: BadgePercent,
    links: [
      { label: "Todas as ofertas", to: "/ofertas" },
      { label: "Produtos frescos", to: "/ofertas" },
      { label: "Comida local", to: "/ofertas" },
      { label: "Artesanato regional", to: "/ofertas" },
      { label: "Quero divulgar ofertas", to: "/estabelecimentos" },
      { label: "Preciso de ajuda", to: "/suporte" },
    ],
  },
];
