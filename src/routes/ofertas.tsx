import { createFileRoute } from "@tanstack/react-router";
import { MarketplaceSection } from "@/screens/MarketplaceSection";

export const Route = createFileRoute("/ofertas")({
  head: () => ({
    meta: [{ title: "Ofertas | Armazém Tag Marketplace" }],
  }),
  component: () => (
    <MarketplaceSection
      title="Ofertas"
      description="Produtos frescos, comida local e artesanato com ofertas especiais da sua região."
    />
  ),
});
