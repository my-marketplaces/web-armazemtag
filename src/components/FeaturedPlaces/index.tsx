import * as React from "react";
import { MapPin } from "lucide-react";
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

const PLACE_ROWS: FeaturedPlace[][] = [
  [
    { name: "Ver-o-Peso", location: "Belém - PA", image: peixeIcon },
    { name: "Feira da Pedreira", location: "Belém - PA", image: frutasIcon },
    { name: "Mercado local", location: "Ananindeua - PA", image: paoIcon },
    { name: "Loja em destaque", location: "Belém - PA", image: acaiIcon },
    { name: "Artesanato regional", location: "Belém - PA", image: ervasIcon },
    { name: "Produtos frescos", location: "Belém - PA", image: farinhasIcon },
    { name: "Moda e acessórios", location: "Belém - PA", image: aguaIcon },
    { name: "Casa e construção", location: "Ananindeua - PA", image: gasIcon },
    { name: "Comida local", location: "Belém - PA", image: frangoIcon },
  ],
  [
    { name: "Feira do Guamá", location: "Belém - PA", image: peixeIcon },
    { name: "Mercado do Jurunas", location: "Belém - PA", image: frutasIcon },
    { name: "Padaria do bairro", location: "Ananindeua - PA", image: paoIcon },
    { name: "Açaí da região", location: "Belém - PA", image: acaiIcon },
    { name: "Ervas medicinais", location: "Belém - PA", image: ervasIcon },
    { name: "Farinhas do Pará", location: "Belém - PA", image: farinhasIcon },
    { name: "Frango caipira", location: "Ananindeua - PA", image: frangoIcon },
    { name: "Depósito de gás", location: "Belém - PA", image: gasIcon },
    { name: "Água mineral", location: "Belém - PA", image: aguaIcon },
  ],
];

function FeaturedRow({
  places,
  ariaLabel,
  direction,
}: {
  places: FeaturedPlace[];
  ariaLabel: string;
  direction: "left" | "right";
}) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const autoPausedRef = React.useRef(false);
  const dragRef = React.useRef({ startX: 0, startScroll: 0, dragging: false });
  const isReverse = direction === "left";

  React.useEffect(() => {
    const el = trackRef.current;
    if (!el || !isReverse) return;
    el.scrollLeft = el.scrollWidth - el.clientWidth;
  }, [isReverse]);

  const advance = React.useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 4) return;

    if (isReverse) {
      if (el.scrollLeft <= 4) {
        el.scrollTo({ left: maxScroll, behavior: "smooth" });
        return;
      }
      el.scrollBy({
        left: -Math.min(el.clientWidth * 0.85, el.scrollLeft),
        behavior: "smooth",
      });
      return;
    }

    if (el.scrollLeft >= maxScroll - 4) {
      el.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    el.scrollBy({
      left: Math.min(el.clientWidth * 0.85, maxScroll - el.scrollLeft),
      behavior: "smooth",
    });
  }, [isReverse]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const intervalId = window.setInterval(() => {
      if (!autoPausedRef.current) advance();
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, [advance]);

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

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    const el = trackRef.current;
    if (!el) return;
    dragRef.current = {
      startX: event.clientX,
      startScroll: el.scrollLeft,
      dragging: true,
    };
    autoPausedRef.current = true;
    el.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const el = trackRef.current;
    if (!drag.dragging || !el) return;
    el.scrollLeft = drag.startScroll - (event.clientX - drag.startX);
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (el?.hasPointerCapture(event.pointerId)) {
      el.releasePointerCapture(event.pointerId);
    }
    dragRef.current.dragging = false;
    autoPausedRef.current = false;
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onMouseEnter={() => {
          autoPausedRef.current = true;
        }}
        onMouseLeave={() => {
          autoPausedRef.current = false;
        }}
        onFocus={() => {
          autoPausedRef.current = true;
        }}
        onBlur={() => {
          autoPausedRef.current = false;
        }}
        onTouchStart={() => {
          autoPausedRef.current = true;
        }}
        onTouchEnd={() => {
          autoPausedRef.current = false;
        }}
        className="flex cursor-grab gap-4 overflow-x-auto px-1 pb-3 select-none [scrollbar-width:none] [scroll-snap-type:x_proximity] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
      >
        {places.map((place) => (
          <article
            key={place.name}
            className="flex h-[175px] w-[150px] shrink-0 flex-col overflow-hidden rounded-[14px] bg-white shadow-[0_4px_12px_rgba(45,31,35,0.06)] [scroll-snap-align:start] max-sm:h-[165px] max-sm:w-[140px]"
          >
            <div className="flex h-[128px] w-full shrink-0 items-center justify-center bg-secondary max-sm:h-[118px]">
              <img
                src={place.image}
                alt={place.name}
                loading="lazy"
                className="h-full w-full object-contain p-2.5"
              />
            </div>
            <div className="flex flex-1 items-start gap-[7px] px-2 py-[7px]">
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
    </div>
  );
}

export function FeaturedPlaces({ className }: { className?: string }) {
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

      <div className="flex flex-col gap-2">
        {PLACE_ROWS.map((places, index) => (
          <FeaturedRow
            key={index}
            places={places}
            direction={index === 0 ? "right" : "left"}
            ariaLabel={`Locais em destaque na sua região - linha ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
