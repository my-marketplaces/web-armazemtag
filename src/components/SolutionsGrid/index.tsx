import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { SectionTitle } from "@/components/SectionTitle";
import appClienteMockup from "@/assets/images/empresas/app-cliente.png";
import appParceiroMockup from "@/assets/images/empresas/app-parceiro.png";
import appEntregadorMockup from "@/assets/images/empresas/app-entregador.png";

const solutions = [
  {
    title: "App do Cliente",
    text: "Compre em poucos cliques e receba rapidinho.",
    to: "/como-funciona",
    mockup: appClienteMockup,
    deviceAlt: "Aplicativo Armazém Tag em um smartphone",
  },
  {
    title: "App do Parceiro",
    text: "Gerencie seu negócio e receba pedidos.",
    to: "/estabelecimentos",
    mockup: appParceiroMockup,
    deviceAlt: "Aplicativo Armazém Tag do parceiro em um smartphone",
  },
  {
    title: "App Entregador",
    text: "Mais entregas feitas, trabalho com flexibilidade.",
    to: "/entregadores",
    mockup: appEntregadorMockup,
    deviceAlt: "Aplicativo Armazém Tag do entregador em um smartphone",
  },
] as const;

export function SolutionsGrid() {
  return (
    <section id="solucoes" className="section-shell pb-10 sm:pb-14">
      <SectionTitle className="solutions-section__title">Nossas soluções para todos</SectionTitle>
      <div className="grid gap-3 md:grid-cols-3 mt-1 sm:mt-2">
        {solutions.map(({ title, text, to, mockup, deviceAlt }, i) => {
          const isFeatured = Boolean(mockup);
          const cardClasses = `rounded-card ${
            i === 1 ? "bg-[#faf9f8]" : i % 2 === 0 ? "bg-tint" : "bg-soft"
          }${isFeatured ? " solution-card solution-card--client" : " min-h-48 p-5"}`;

          return (
            <article key={title} className={cardClasses}>
              <div className={isFeatured ? "solution-card__content" : undefined}>
                <span
                  className={`text-xs font-bold text-primary${isFeatured ? " solution-card__eyebrow" : ""}`}
                >
                  SOLUÇÃO 0{i + 1}
                </span>
                <h3
                  className={`font-display text-xl font-extrabold${isFeatured ? " solution-card__title" : " mt-5"}`}
                >
                  {title}
                </h3>
                <p
                  className={`text-sm text-muted-foreground${isFeatured ? " solution-card__description" : " mt-2"}`}
                >
                  {text}
                </p>
                <Link
                  to={to}
                  className={`${isFeatured ? "solution-card__link " : "mt-7 "}inline-flex items-center gap-2 text-xs font-bold text-primary`}
                >
                  Conhecer agora <ArrowRight className="size-3" />
                </Link>
              </div>
              {isFeatured && (
                <div className="solution-card__device-wrapper">
                  <img src={mockup} alt={deviceAlt} className="solution-card__device" />
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
