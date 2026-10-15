import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CategoryGrid } from "@/components/CategoryGrid";
import { SolutionsGrid } from "@/components/SolutionsGrid";
import { FaqBlock } from "@/components/FaqBlock";
import { CourierCta } from "@/components/CourierCta";
import { MarketplaceSearch } from "@/components/MarketplaceSearch";
import { MarketplaceMap } from "@/components/MarketplaceMap";
import { MarketplaceBanner } from "@/components/MarketplaceBanner";
import { MarketplaceFilters } from "@/components/MarketplaceFilters";
import { FeaturedPlaces } from "@/components/FeaturedPlaces";

export function Home() {
  return (
    <main className="marketplace-home min-h-screen font-body text-foreground">
      <Header />

      <section
        aria-labelledby="marketplace-title"
        className="mx-auto w-[min(calc(100%-64px),1608px)] pt-[118px] pb-6 max-sm:w-[calc(100%-24px)] max-sm:pt-[94px]"
      >
        <div className="mx-auto max-w-[996px]">
          <MarketplaceSearch />
        </div>

        <div className="mx-auto mt-3.5 mb-4.5 text-center">
          <h1
            id="marketplace-title"
            className="font-display text-[clamp(34px,3.25vw,54px)] leading-[1.12] font-extrabold tracking-[-0.035em] text-[#080808] max-sm:text-[34px] max-sm:leading-[1.04]"
          >
            Compre, venda e descubra produtos perto de você.
          </h1>

          <p className="mx-auto mt-2 max-w-[1100px] text-[clamp(17px,1.35vw,22px)] leading-[1.25] text-[#897b79] max-sm:mt-3 max-sm:text-base max-sm:leading-[1.4]">
            Conectamos você a feiras, mercados, lojas e vendedores da região para encontrar ofertas,
            <br className="hidden lg:block" /> divulgar produtos e fazer bons negócios com mais
            proximidade e confiança.
          </p>
        </div>

        <div className="grid grid-cols-[minmax(0,0.97fr)_minmax(0,1.03fr)] items-stretch gap-[18px] max-lg:grid-cols-1">
          <MarketplaceMap className="min-h-[438px] max-lg:min-h-[340px] max-sm:min-h-[300px]" />

          <div className="grid min-w-0 grid-rows-[minmax(282px,1fr)_auto] gap-[18px] max-lg:grid-rows-[minmax(282px,auto)_auto]">
            <MarketplaceBanner />
            <MarketplaceFilters />
          </div>
        </div>

        <FeaturedPlaces className="mt-3.5" />
      </section>

      {/* Demais blocos existentes, fora do escopo desta etapa. */}
      <CategoryGrid compact />
      <div className="pt-2 sm:pt-4">
        <SolutionsGrid />
      </div>

      <section className="section-shell grid gap-4 pb-10 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
        <FaqBlock />
        <CourierCta />
      </section>

      <Footer />
    </main>
  );
}
