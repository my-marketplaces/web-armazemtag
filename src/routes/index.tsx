import { createFileRoute } from "@tanstack/react-router";
import { Home } from "@/screens/Home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Armazém Tag Marketplace | Compre, venda e descubra perto de você" },
      {
        name: "description",
        content:
          "Feiras, mercados, lojas e vendedores da sua região reunidos em um só marketplace.",
      },
      { property: "og:title", content: "Armazém Tag Marketplace" },
      {
        property: "og:description",
        content: "Conectamos você a feiras, mercados, lojas e vendedores da região.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});
