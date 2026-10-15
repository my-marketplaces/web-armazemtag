import { Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function MarketplaceSection({ title, description }: { title: string; description: string }) {
  return (
    <main className="min-h-screen bg-background font-body text-foreground">
      <Header />
      <section className="section-shell pt-36 pb-20">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{description}</p>
        <p className="mt-6 text-sm text-muted-foreground">
          Esta seção do marketplace será construída nas próximas etapas.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex min-h-10 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          Voltar para a página inicial
        </Link>
      </section>
      <Footer />
    </main>
  );
}
