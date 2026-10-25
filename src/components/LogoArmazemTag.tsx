import { cn } from "@/lib/utils";

interface LogoArmazemTagProps {
  variant?: "horizontal" | "vertical";
  className?: string;
}

export function LogoArmazemTag({ variant = "horizontal", className }: LogoArmazemTagProps) {
  if (variant === "horizontal") {
    return (
      <img
        src="/assets/logos/horizontal/at-logo-horizontal-vermelho.png"
        alt="Armazém Tag"
        className={cn("object-contain", className)}
        loading="eager"
      />
    );
  }

  return (
    <img
      src="/assets/logos/vertical/at-logo-vertical-vermelho.png"
      alt="Armazém Tag"
      className={cn("object-contain", className)}
      loading="eager"
    />
  );
}
