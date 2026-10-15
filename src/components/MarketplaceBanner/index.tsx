import * as React from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Slide = {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  cta: string;
  background: string;
};

const SLIDES: Slide[] = [
  {
    eyebrow: "Valorize a nossa região",
    title: (
      <>
        Feiras, mercados
        <br className="hidden sm:block" /> e lojas mais
        <br className="hidden sm:block" /> perto de você.
      </>
    ),
    description: "Produtos locais, ofertas especiais de vendedores da sua região.",
    cta: "Explorar agora",
    background: "linear-gradient(135deg, #fdf3ef 0%, #f7e4dd 45%, #f0d3c8 100%)",
  },
  {
    eyebrow: "Ofertas da semana",
    title: (
      <>
        Descontos que
        <br className="hidden sm:block" /> aproximam você
        <br className="hidden sm:block" /> do comércio local.
      </>
    ),
    description: "Campanhas e promoções de feirantes, mercados e lojas da sua cidade.",
    cta: "Ver ofertas",
    background: "linear-gradient(135deg, #fef6ec 0%, #f8e6d2 45%, #efd2b6 100%)",
  },
  {
    eyebrow: "Classificados locais",
    title: (
      <>
        Anuncie, encontre
        <br className="hidden sm:block" /> e negocie com
        <br className="hidden sm:block" /> quem está perto.
      </>
    ),
    description: "Produtos, serviços e oportunidades divulgados por vendedores da região.",
    cta: "Explorar classificados",
    background: "linear-gradient(135deg, #f4f6f2 0%, #e6ece3 45%, #d3ddce 100%)",
  },
];

export function MarketplaceBanner({ className }: { className?: string }) {
  const [index, setIndex] = React.useState(0);
  const count = SLIDES.length;
  const active = SLIDES[index] ?? SLIDES[0]!;

  const goTo = React.useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );

  return (
    <section
      className={cn(
        "relative isolate min-h-[282px] overflow-hidden rounded-[20px] bg-[#f6eeeb]",
        className,
      )}
      aria-roledescription="carrossel"
      aria-label="Destaques do marketplace"
    >
      <div
        className="absolute inset-0 -z-10 transition-[background] duration-500"
        style={{ background: active.background }}
        aria-hidden="true"
      />

      <div className="ml-[17%] w-[55%] px-3 pt-6 pb-11 max-xl:ml-[12%] max-xl:w-[70%] max-sm:ml-[10%] max-sm:w-[76%] max-sm:pt-7">
        <p className="mb-1.5 text-xs font-extrabold tracking-[0.12em] text-[#ba002c] uppercase">
          {active.eyebrow}
        </p>
        <h2 className="font-display text-[clamp(26px,2.15vw,36px)] leading-[0.98] font-extrabold tracking-[-0.025em] text-[#101010] max-sm:text-[30px]">
          {active.title}
        </h2>
        <p className="mt-2.5 mb-3.5 max-w-[240px] text-sm leading-[1.2] text-[#5b4b49]">
          {active.description}
        </p>
        <button
          type="button"
          className="inline-flex min-h-9 items-center justify-center gap-2 rounded-full bg-primary px-6 py-2 text-[13px] font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {active.cta}
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>

      <button
        type="button"
        onClick={() => goTo(index - 1)}
        aria-label="Slide anterior"
        className="absolute top-1/2 left-2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white text-foreground shadow-[0_3px_12px_rgba(0,0,0,0.12)] transition hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <ChevronLeft className="size-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => goTo(index + 1)}
        aria-label="Próximo slide"
        className="absolute top-1/2 right-2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white text-foreground shadow-[0_3px_12px_rgba(0,0,0,0.12)] transition hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <ChevronRight className="size-5" aria-hidden="true" />
      </button>

      <div className="absolute bottom-2.5 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
        {SLIDES.map((slide, dotIndex) => (
          <button
            key={slide.eyebrow}
            type="button"
            onClick={() => goTo(dotIndex)}
            aria-label={`Ir para o slide ${dotIndex + 1}`}
            aria-current={dotIndex === index}
            className={cn(
              "size-2.5 rounded-full transition-colors",
              dotIndex === index ? "bg-primary" : "bg-[#c7c2c1] hover:bg-[#a89f9e]",
            )}
          />
        ))}
      </div>
    </section>
  );
}
