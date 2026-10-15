import { createFileRoute } from "@tanstack/react-router";
import { MarketplaceSection } from "@/screens/MarketplaceSection";

export const Route = createFileRoute("/mercados")({
  head: () => ({
    meta: [{ title: "Mercados | Armazém Tag Marketplace" }],
  }),
  component: () => (
    <MarketplaceSection
      title="Mercados"
      description="Encontre mercados, hortifrútis, açougues e peixarias perto de você."
    />
  ),
});
