import * as React from "react";
import {
  BadgeDollarSign,
  ChevronDown,
  MapPin,
  Package,
  Store,
  type LucideIcon,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Option = { value: string; label: string };

type FilterField = {
  id: "location" | "category" | "price" | "type";
  label: string;
  icon: LucideIcon;
  options: Option[];
  defaultValue: string;
};

const FIELDS: FilterField[] = [
  {
    id: "location",
    label: "Localização",
    icon: MapPin,
    defaultValue: "perto",
    options: [
      { value: "perto", label: "Perto de você" },
      { value: "belem", label: "Belém - PA" },
      { value: "ananindeua", label: "Ananindeua - PA" },
      { value: "marituba", label: "Marituba - PA" },
    ],
  },
  {
    id: "category",
    label: "Categoria",
    icon: Store,
    defaultValue: "todos",
    options: [
      { value: "todos", label: "Feiras, mercados, lojas" },
      { value: "feiras", label: "Feiras" },
      { value: "mercados", label: "Mercados" },
      { value: "lojas", label: "Lojas" },
    ],
  },
  {
    id: "price",
    label: "Preço",
    icon: BadgeDollarSign,
    defaultValue: "ate-500",
    options: [
      { value: "ate-500", label: "Até R$ 500" },
      { value: "ate-100", label: "Até R$ 100" },
      { value: "ate-50", label: "Até R$ 50" },
      { value: "qualquer", label: "Qualquer preço" },
    ],
  },
  {
    id: "type",
    label: "Tipo",
    icon: Package,
    defaultValue: "ambos",
    options: [
      { value: "ambos", label: "Produtos e serviços" },
      { value: "produtos", label: "Produtos" },
      { value: "servicos", label: "Serviços" },
    ],
  },
];

type FilterValues = Record<FilterField["id"], string>;

const INITIAL_VALUES = FIELDS.reduce<FilterValues>((accumulator, field) => {
  accumulator[field.id] = field.defaultValue;
  return accumulator;
}, {} as FilterValues);

export type MarketplaceFiltersResult = FilterValues;

export function MarketplaceFilters({
  onSubmit,
  className,
}: {
  onSubmit?: (values: MarketplaceFiltersResult) => void;
  className?: string;
}) {
  const [values, setValues] = React.useState<FilterValues>(INITIAL_VALUES);
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    onSubmit?.(values);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("rounded-3xl bg-white p-4 shadow-[0_6px_20px_rgba(45,31,35,0.08)]", className)}
      aria-label="Filtros de busca"
    >
      <div className="grid grid-cols-4 gap-2 max-xl:grid-cols-2">
        {FIELDS.map((field) => {
          const selected =
            field.options.find((option) => option.value === values[field.id]) ?? field.options[0]!;
          const Icon = field.icon;

          return (
            <Popover key={field.id}>
              <PopoverTrigger
                className="flex min-h-[58px] min-w-0 items-center gap-2.5 rounded-xl border border-[#e6e8eb] p-2.5 text-left transition-colors hover:border-primary/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-label={`${field.label}: ${selected.label}`}
              >
                <Icon className="size-5 shrink-0 text-[#bd0730]" aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="block text-xs leading-[1.2] text-foreground">{field.label}</span>
                  <span className="mt-1 block truncate text-xs text-[#747b89]">
                    {selected.label}
                  </span>
                </span>
                <ChevronDown className="size-4 shrink-0 text-[#9aa2ad]" aria-hidden="true" />
              </PopoverTrigger>
              <PopoverContent align="start" className="w-[240px] p-1.5">
                <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  {field.label}
                </p>
                <div role="listbox" aria-label={field.label} className="flex flex-col">
                  {field.options.map((option) => {
                    const isSelected = option.value === values[field.id];
                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() =>
                          setValues((current) => ({ ...current, [field.id]: option.value }))
                        }
                        className={cn(
                          "rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-secondary",
                          isSelected && "font-semibold text-primary",
                        )}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          );
        })}
      </div>

      <button
        type="submit"
        className="mt-2.5 min-h-9 w-full rounded-full bg-primary text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary max-sm:min-h-11"
      >
        Buscar
      </button>

      <p
        role="status"
        aria-live="polite"
        className="mt-2 text-center text-xs text-muted-foreground"
      >
        {submitted ? "Filtros aplicados com dados locais de demonstração." : ""}
      </p>
    </form>
  );
}
