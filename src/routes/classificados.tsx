import { createFileRoute } from "@tanstack/react-router";
import { MarketplaceSection } from "@/screens/MarketplaceSection";

export const Route = createFileRoute("/classificados")({
  head: () => ({
    meta: [{ title: "Classificados | Armazém Tag Marketplace" }],
  }),
  component: () => (
    <MarketplaceSection
      title="Classificados"
      description="Anuncie, encontre e negocie produtos e serviços com quem está perto."
    />
  ),
});
