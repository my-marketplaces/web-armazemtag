import * as React from "react";
import { ChevronRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import peixeIcon from "@/assets/icons/categorias/peixe-frito-icon.png";
import frutasIcon from "@/assets/icons/categorias/frutas-icon.png";
import paoIcon from "@/assets/icons/categorias/pao-icon.png";
import acaiIcon from "@/assets/icons/categorias/acai-icon.png";
import ervasIcon from "@/assets/icons/categorias/ervas.png";
import farinhasIcon from "@/assets/icons/categorias/farinhas.png";
import frangoIcon from "@/assets/icons/categorias/frango-icon.png";
import gasIcon from "@/assets/icons/categorias/gas-icon.png";
import aguaIcon from "@/assets/icons/categorias/agua-mineral-icon.png";

type FeaturedPlace = {
  name: string;
  location: string;
  image: string;
};

const PLACES: FeaturedPlace[] = [
  { name: "Ver-o-Peso", location: "Belém - PA", image: peixeIcon },
  { name: "Feira da Pedreira", location: "Belém - PA", image: frutasIcon },
  { name: "Mercado local", location: "Ananindeua - PA", image: paoIcon },
  { name: "Loja em destaque", location: "Belém - PA", image: acaiIcon },
  { name: "Artesanato regional", location: "Belém - PA", image: ervasIcon },
  { name: "Produtos frescos", location: "Belém - PA", image: farinhasIcon },
  { name: "Moda e acessórios", location: "Belém - PA", image: aguaIcon },
  { name: "Casa e construção", location: "Ananindeua - PA", image: gasIcon },
  { name: "Comida local", location: "Belém - PA", image: frangoIcon },
];

export function FeaturedPlaces({ className }: { className?: string }) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [canAdvance, setCanAdvance] = React.useState(false);

  const updateAdvance = React.useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanAdvance(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  React.useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateAdvance();
    el.addEventListener("scroll", updateAdvance, { passive: true });
    window.addEventListener("resize", updateAdvance);
    return () => {
      el.removeEventListener("scroll", updateAdvance);
      window.removeEventListener("resize", updateAdvance);
    };
  }, [updateAdvance]);

  const advance = () => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * 0.85, behavior: "smooth" });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el) return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      el.scrollBy({
        left: event.key === "ArrowRight" ? el.clientWidth * 0.85 : -el.clientWidth * 0.85,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className={cn("relative", className)} aria-labelledby="featured-places-title">
      <div className="mb-2.5 flex items-center justify-between gap-4">
        <h2
          id="featured-places-title"
          className="font-display text-[23px] font-bold leading-tight max-sm:text-xl"
        >
          Locais em destaque na sua região
        </h2>
        <a
          href="#featured-places-title"
          className="shrink-0 text-sm text-primary underline underline-offset-2 hover:text-primary/80 max-sm:text-xs"
        >
          Ver todos →
        </a>
      </div>

      <div className="relative">
        <div
          ref={trackRef}
          role="region"
          aria-label="Locais em destaque na sua região"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="flex gap-4 overflow-x-auto px-1 pb-3 [scrollbar-width:none] [scroll-snap-type:x_proximity] [&::-webkit-scrollbar]:hidden"
        >
          {PLACES.map((place) => (
            <article
              key={place.name}
              className="h-[114px] w-[154px] shrink-0 overflow-hidden rounded-[14px] bg-white shadow-[0_4px_12px_rgba(45,31,35,0.06)] [scroll-snap-align:start]"
            >
              <div className="flex h-[74px] w-full items-center justify-center bg-secondary">
                <img
                  src={place.image}
                  alt={place.name}
                  loading="lazy"
                  className="h-full w-full object-contain p-2.5"
                />
              </div>
              <div className="flex items-start gap-[7px] px-2 py-[7px]">
                <MapPin className="mt-0.5 size-[18px] shrink-0 text-[#bd0730]" aria-hidden="true" />
                <div className="min-w-0">
                  <span className="block truncate text-[11px] font-bold leading-[1.15]">
                    {place.name}
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] leading-[1.15] text-[#858080]">
                    {place.location}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {canAdvance && (
          <button
            type="button"
            onClick={advance}
            aria-label="Avançar locais em destaque"
            className="absolute top-[37px] right-0 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-border bg-white text-foreground shadow-[0_3px_12px_rgba(0,0,0,0.12)] transition hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        )}
      </div>
    </section>
  );
}
