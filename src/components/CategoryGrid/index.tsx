import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionTitle } from "@/components/SectionTitle";
import acaiIcon from "@/assets/icons/categorias/acai-icon.png";
import paoIcon from "@/assets/icons/categorias/pao-icon.png";
import frutasIcon from "@/assets/icons/categorias/frutas-icon.png";
import ervasIcon from "@/assets/icons/categorias/ervas.png";
import farinhasIcon from "@/assets/icons/categorias/farinhas.png";
import peixeFritoIcon from "@/assets/icons/categorias/peixe-frito-icon.png";
import frangoIcon from "@/assets/icons/categorias/frango-icon.png";
import gasIcon from "@/assets/icons/categorias/gas-icon.png";
import aguaIcon from "@/assets/icons/categorias/agua-mineral-icon.png";

const categories = [
  { name: "Açaí", image: acaiIcon },
  { name: "Padaria", image: paoIcon },
  { name: "Frutas", image: frutasIcon },
  { name: "Ervas", image: ervasIcon },
  { name: "Farinhas", image: farinhasIcon },
  { name: "Peixe", image: peixeFritoIcon },
  { name: "Frango", image: frangoIcon },
  { name: "Gás", image: gasIcon },
  { name: "Água", image: aguaIcon },
] as const;

export function CategoryGrid({ compact = false }: { compact?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ startX: 0, startScroll: 0, dragging: false, moved: false });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = () => {
    const el = containerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  const scrollByAmount = (direction: 1 | -1) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "smooth" });
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = containerRef.current;
    if (!el) return;
    dragRef.current = {
      startX: e.clientX,
      startScroll: el.scrollLeft,
      dragging: true,
      moved: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const el = containerRef.current;
    if (!drag.dragging || !el) return;
    const delta = e.clientX - drag.startX;
    if (Math.abs(delta) > 6) drag.moved = true;
    el.scrollLeft = drag.startScroll - delta;
  };

  const handlePointerUp = () => {
    dragRef.current.dragging = false;
  };

  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragRef.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
    dragRef.current.moved = false;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      el.scrollBy({
        left: e.key === "ArrowRight" ? el.clientWidth * 0.85 : -el.clientWidth * 0.85,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      className={`section-shell relative pt-7 pb-8 sm:pt-11 sm:pb-12${compact ? " category-grid--compact" : ""}`}
    >
      <SectionTitle>Categorias com pronta entrega</SectionTitle>
      <div className="relative">
        <button
          type="button"
          aria-label="Rolar categorias para a esquerda"
          onClick={() => scrollByAmount(-1)}
          disabled={!canScrollLeft}
          className="absolute top-1/2 -left-3 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card p-1.5 text-foreground shadow-soft transition hover:bg-muted disabled:pointer-events-none disabled:opacity-30 lg:flex"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          aria-label="Rolar categorias para a direita"
          onClick={() => scrollByAmount(1)}
          disabled={!canScrollRight}
          className="absolute top-1/2 -right-3 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card p-1.5 text-foreground shadow-soft transition hover:bg-muted disabled:pointer-events-none disabled:opacity-30 lg:flex"
        >
          <ChevronRight className="size-5" />
        </button>
        <div
          ref={containerRef}
          role="region"
          aria-label="Categorias com pronta entrega"
          tabIndex={0}
          onClickCapture={handleClickCapture}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={handleKeyDown}
          className="categories-scroll"
        >
          {categories.map((category) => (
            <article key={category.name} className="category-card">
              <div className="category-card__image">
                <img src={category.image} alt={category.name} loading="lazy" />
              </div>
              <span className="category-card__name">{category.name}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
