import { createFileRoute } from "@tanstack/react-router";
import { MarketplaceSection } from "@/screens/MarketplaceSection";

export const Route = createFileRoute("/campanhas")({
  head: () => ({
    meta: [{ title: "Campanhas | Armazém Tag Marketplace" }],
  }),
  component: () => (
    <MarketplaceSection
      title="Campanhas"
      description="Acompanhe campanhas e promoções de feirantes, mercados e lojas da região."
    />
  ),
});
