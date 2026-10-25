import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logos/vertical/at-logo-vertical-branco.png";

const footerSections = [
  {
    title: "Saiba mais",
    links: [
      { label: "Quem somos", to: "/" },
      { label: "Como funciona", to: "/como-funciona" },
      { label: "Blog", to: null },
    ],
  },
  {
    title: "Categorias",
    links: [
      { label: "Mercados", to: "/estabelecimentos" },
      { label: "Padarias", to: "/estabelecimentos" },
      { label: "Frutas e bebidas", to: "/estabelecimentos" },
    ],
  },
  {
    title: "Suporte",
    links: [
      { label: "Central de ajuda", to: "/suporte" },
      { label: "Fale conosco", to: "/suporte" },
      { label: "Privacidade", to: null },
    ],
  },
] as const;

const outlineProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

type OutlineIconProps = { className?: string };

function InstagramIcon({ className }: OutlineIconProps) {
  return (
    <svg viewBox="0 0 24 24" {...outlineProps} className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className }: OutlineIconProps) {
  return (
    <svg viewBox="0 0 24 24" {...outlineProps} className={className} aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function LinkedInIcon({ className }: OutlineIconProps) {
  return (
    <svg viewBox="0 0 24 24" {...outlineProps} className={className} aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function WhatsAppIcon({ className }: OutlineIconProps) {
  return (
    <svg viewBox="0 0 24 24" {...outlineProps} className={className} aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      <g transform="translate(5.75 5.75) scale(0.5)">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </g>
    </svg>
  );
}

const socials = [
  { label: "Instagram", Icon: InstagramIcon },
  { label: "Facebook", Icon: FacebookIcon },
  { label: "LinkedIn", Icon: LinkedInIcon },
  { label: "WhatsApp", Icon: WhatsAppIcon },
] as const;

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="section-shell grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <img src={logo} alt="Pertinho" className="h-[88px] w-auto" />
          <p className="mt-3 max-w-xs text-sm opacity-75">
            Conectando comércios, consumidores e entregadores. Mais local, mais rápido, mais nosso.
          </p>
          <div className="mt-4 flex items-center gap-2">
            {socials.map(({ label, Icon }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-primary-foreground/50 bg-transparent text-primary-foreground transition-colors duration-150 hover:bg-primary-foreground/10"
              >
                <Icon className="size-[17px]" />
              </a>
            ))}
          </div>
        </div>
        {footerSections.map(({ title, links }) => (
          <div key={title}>
            <h3 className="font-bold">{title}</h3>
            <ul className="mt-3 space-y-2 text-sm opacity-75">
              {links.map((link) => (
                <li key={link.label}>
                  {link.to ? <Link to={link.to}>{link.label}</Link> : <span>{link.label}</span>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-primary-foreground/20 py-4 text-center text-xs opacity-70">
        © 2026 Armazém Tag . CNPJ 69.736.940/0001-40. Uma empresa AE Advisory IS.
      </div>
    </footer>
  );
}
