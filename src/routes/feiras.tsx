import { createFileRoute } from "@tanstack/react-router";
import { MarketplaceSection } from "@/screens/MarketplaceSection";

export const Route = createFileRoute("/feiras")({
  head: () => ({
    meta: [{ title: "Feiras | Armazém Tag Marketplace" }],
  }),
  component: () => (
    <MarketplaceSection
      title="Feiras"
      description="Descubra feiras livres, feiras orgânicas e produtores da sua região."
    />
  ),
});
