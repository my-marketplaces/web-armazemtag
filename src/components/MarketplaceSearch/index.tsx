import * as React from "react";
import { ChevronDown, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const CATALOGS = [
  { value: "todos", label: "Catálogo" },
  { value: "produtos", label: "Produtos" },
  { value: "lojas", label: "Lojas" },
  { value: "servicos", label: "Serviços" },
] as const;

type CatalogValue = (typeof CATALOGS)[number]["value"];

export function MarketplaceSearch({
  onSearch,
  className,
}: {
  onSearch?: (query: string, catalog: CatalogValue) => void;
  className?: string;
}) {
  const [catalog, setCatalog] = React.useState<CatalogValue>("todos");
  const [query, setQuery] = React.useState("");

  const active = CATALOGS.find((item) => item.value === catalog) ?? CATALOGS[0];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch?.(query.trim(), catalog);
  };

  return (
    <form
      role="search"
      aria-label="Pesquisar no marketplace"
      onSubmit={handleSubmit}
      className={cn("rounded-3xl bg-white p-2 shadow-[0_6px_22px_rgba(45,31,35,0.08)]", className)}
    >
      <div className="flex min-h-[46px] items-center rounded-[18px] bg-[#eef3f4]">
        <DropdownMenu>
          <DropdownMenuTrigger
            className="inline-flex shrink-0 items-center justify-center gap-2.5 border-r border-[#d2dde1] px-4 py-1.5 text-[17px] font-semibold text-foreground outline-none transition-colors hover:text-primary focus-visible:text-primary max-sm:gap-1 max-sm:px-2.5 max-sm:text-[13px]"
            aria-label="Selecionar catálogo da busca"
          >
            {active.label}
            <ChevronDown className="size-4" aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            {CATALOGS.map((item) => (
              <DropdownMenuItem
                key={item.value}
                onSelect={() => setCatalog(item.value)}
                className={cn(
                  "cursor-pointer",
                  item.value === catalog && "font-semibold text-primary",
                )}
              >
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <label htmlFor="marketplace-search-input" className="sr-only">
          Pesquisar artigos, lojas e produtos
        </label>
        <div className="flex min-w-0 flex-1 items-center gap-3 px-4 text-[#849ba7] max-sm:gap-2 max-sm:px-2.5">
          <Search className="size-5 shrink-0" aria-hidden="true" />
          <input
            id="marketplace-search-input"
            type="search"
            name="q"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Pesquisar artigos, lojas e produtos"
            autoComplete="off"
            className="w-full min-w-0 bg-transparent py-2.5 text-[19px] text-foreground outline-none placeholder:text-[#8a9faa] max-sm:text-sm"
          />
        </div>
      </div>
    </form>
  );
}
