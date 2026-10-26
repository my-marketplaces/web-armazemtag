import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import courierImg from "@/assets/banners/banner-home/entregador-bike.png";

export function CourierCta() {
  return (
    <div
      id="entregadores"
      className="grid overflow-hidden rounded-section bg-tint sm:grid-cols-[1fr_.85fr] lg:h-[371px] lg:min-h-[371px] lg:self-start"
    >
      <div className="flex flex-col justify-center p-7">
        <h2 className="font-display text-3xl font-extrabold">
          O negócio é seu.
          <br />A tecnologia é nossa.
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Você escolhe como vende. A Armazém Tag organiza seus anúncios, dá visibilidade e facilita
          a comunicação em um só lugar.
        </p>
        <Button asChild variant="hero" className="mt-6 w-fit">
          <Link to="/entregadores">
            Conhecer a plataforma <ArrowRight />
          </Link>
        </Button>
      </div>
      <img
        src={courierImg}
        alt="Entregador de bicicleta do Armazém Tag"
        width={1024}
        height={768}
        loading="lazy"
        className="h-full min-h-64 w-full object-cover"
      />
    </div>
  );
}
