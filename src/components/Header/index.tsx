import * as React from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { ChevronDown, Heart, Menu, ShoppingBag, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import logo from "@/assets/logos/horizontal/at-logo-horizontal-vermelho.png";
import { navItems, type MegaNavItem } from "./megaMenu";
import { MegaMenuFooter } from "./MegaMenuFooter";

const CLOSE_DELAY_MS = 300;

export function Header() {
  const { pathname } = useLocation();
  const [openMega, setOpenMega] = React.useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = React.useState<string | null>(null);
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const closeTimeoutRef = React.useRef<number | null>(null);

  const cancelClose = React.useCallback(() => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const scheduleClose = React.useCallback(() => {
    cancelClose();
    closeTimeoutRef.current = window.setTimeout(() => {
      setOpenMega(null);
    }, CLOSE_DELAY_MS);
  }, [cancelClose]);

  const openMenu = React.useCallback(
    (label: string) => {
      cancelClose();
      setOpenMega(label);
    },
    [cancelClose],
  );

  const closeMenu = React.useCallback(() => {
    cancelClose();
    setOpenMega(null);
  }, [cancelClose]);

  React.useEffect(() => cancelClose, [cancelClose]);

  React.useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  React.useEffect(() => {
    if (!openMega) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    const onMouseDown = (event: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) closeMenu();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onMouseDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, [openMega, closeMenu]);

  const activeMega = navItems.find(
    (item): item is MegaNavItem => "links" in item && item.to === pathname,
  );
  const highlightLabel = openMega ?? activeMega?.label ?? null;

  const currentMega = navItems.find(
    (item): item is MegaNavItem => "links" in item && item.label === openMega,
  );

  return (
    <header className="fixed inset-x-0 top-5 z-50 mx-auto w-[min(calc(100%-64px),1496px)] max-sm:top-3 max-sm:w-[calc(100%-24px)]">
      <div
        ref={wrapRef}
        className="relative"
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
      >
        <nav className="flex min-h-20 items-center justify-between gap-6 rounded-full border border-primary/5 bg-white/95 px-9 shadow-[0_12px_32px_rgba(43,25,28,0.11)] backdrop-blur-xl max-xl:gap-4 max-xl:px-6 max-sm:min-h-16 max-sm:gap-3 max-sm:px-4">
          <Link to="/" onClick={closeMenu} className="flex shrink-0 items-center">
            <img
              src={logo}
              alt="Armazém Tag"
              className="h-14 w-auto max-h-14 object-contain max-sm:h-10"
            />
          </Link>

          <div className="hidden items-center gap-0.5 text-sm font-semibold lg:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.to;
              const Icon = item.icon;
              const isMega = "links" in item;

              if (!isMega) {
                return (
                  <div key={item.label} onMouseEnter={cancelClose} className="inline-flex">
                    <Link
                      to={item.to}
                      aria-current={isActive ? "page" : undefined}
                      onClick={(event) => {
                        if (isActive) event.preventDefault();
                        closeMenu();
                      }}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-md px-3.5 py-2 transition",
                        openMega === null && isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:text-primary",
                      )}
                    >
                      <Icon className="size-[18px] shrink-0" strokeWidth={1.7} aria-hidden="true" />
                      {item.label}
                    </Link>
                  </div>
                );
              }

              const isOpen = openMega === item.label;
              const showWine = highlightLabel === item.label;

              return (
                <div
                  key={item.label}
                  data-mega-trigger={item.label}
                  onMouseEnter={() => openMenu(item.label)}
                  className={cn(
                    "inline-flex items-center gap-0.5 rounded-md transition duration-100",
                    showWine && "bg-primary",
                  )}
                >
                  <Link
                    to={item.to}
                    aria-current={isActive ? "page" : undefined}
                    onClick={closeMenu}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-md py-2 pr-1.5 pl-3.5 transition-colors duration-50",
                      showWine ? "text-primary-foreground" : "text-foreground hover:text-primary",
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-[18px] shrink-0",
                        showWine ? "text-primary-foreground" : "text-[#374151]",
                      )}
                      strokeWidth={1.7}
                      aria-hidden="true"
                    />
                    {item.label}
                  </Link>
                  <button
                    type="button"
                    aria-label={isOpen ? `Fechar menu ${item.label}` : `Abrir menu ${item.label}`}
                    aria-expanded={isOpen}
                    aria-controls={`mega-panel-${item.label}`}
                    onClick={() => {
                      if (isOpen) closeMenu();
                      else openMenu(item.label);
                    }}
                    className={cn(
                      "-ml-1 rounded-md p-1 transition-colors duration-50",
                      showWine
                        ? "text-primary-foreground"
                        : "text-[currentColor] hover:text-primary",
                    )}
                  >
                    <ChevronDown
                      className={cn(
                        "size-4 transition-transform duration-100",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-1">
            <Popover>
              <PopoverTrigger
                aria-label="Favoritos"
                className="hidden size-10 items-center justify-center rounded-full text-[#374151] transition hover:bg-secondary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:inline-flex"
              >
                <Heart className="size-6" strokeWidth={1.7} aria-hidden="true" />
              </PopoverTrigger>
              <PopoverContent align="end" className="w-64">
                <p className="text-sm font-semibold">Favoritos</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Você ainda não salvou nenhum item.
                </p>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger
                aria-label="Sacola"
                className="hidden size-10 items-center justify-center rounded-full text-[#374151] transition hover:bg-secondary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:inline-flex"
              >
                <ShoppingBag className="size-6" strokeWidth={1.7} aria-hidden="true" />
              </PopoverTrigger>
              <PopoverContent align="end" className="w-64">
                <p className="text-sm font-semibold">Sacola</p>
                <p className="mt-1 text-sm text-muted-foreground">Sua sacola está vazia.</p>
              </PopoverContent>
            </Popover>

            <span aria-hidden="true" className="mx-1 hidden h-6 w-px bg-border sm:block" />

            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              <UserRound /> Entrar
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menu">
                  <Menu />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                {navItems.map((item) => {
                  if (!("links" in item)) {
                    const isActive = pathname === item.to;
                    const Icon = item.icon;
                    return (
                      <DropdownMenuItem
                        key={item.label}
                        asChild
                        className={cn(
                          "rounded-md",
                          isActive &&
                            "cursor-default bg-primary text-primary-foreground hover:bg-primary focus:bg-primary focus:text-primary-foreground",
                        )}
                      >
                        <Link
                          to={item.to}
                          aria-current={isActive ? "page" : undefined}
                          onClick={(event) => {
                            if (isActive) event.preventDefault();
                            setMobileOpen(null);
                          }}
                        >
                          <Icon className="size-4" aria-hidden="true" />
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  }

                  const isOpen = mobileOpen === item.label;
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="my-1">
                      <div className="flex items-center justify-between">
                        <Link
                          to={item.to}
                          aria-current={pathname === item.to ? "page" : undefined}
                          onClick={() => setMobileOpen(null)}
                          className="flex flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold transition-colors duration-100 hover:bg-[#ffeeed]"
                        >
                          <Icon className="size-4" aria-hidden="true" />
                          {item.label}
                        </Link>
                        <button
                          type="button"
                          aria-label={
                            isOpen ? `Fechar menu ${item.label}` : `Abrir menu ${item.label}`
                          }
                          aria-expanded={isOpen}
                          aria-controls={`mobile-panel-${item.label}`}
                          onClick={() => setMobileOpen(isOpen ? null : item.label)}
                          className="rounded-md p-1.5 transition-colors duration-100 hover:bg-[#ffeeed]"
                        >
                          <ChevronDown
                            className={cn("size-4 transition-transform", isOpen && "rotate-180")}
                          />
                        </button>
                      </div>
                      {isOpen && (
                        <div
                          id={`mobile-panel-${item.label}`}
                          className="mt-1 ml-3 space-y-0.5 border-l border-border pl-2"
                        >
                          {item.links.map((link) => (
                            <DropdownMenuItem
                              key={link.label}
                              asChild
                              className="rounded-md focus:bg-[#ffeeed]! focus:text-foreground! data-[highlighted]:bg-[#ffeeed]! data-[highlighted]:text-foreground!"
                            >
                              <Link to={link.to} onClick={() => setMobileOpen(null)}>
                                {link.label}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>

        {currentMega && (
          <div
            id={`mega-panel-${currentMega.label}`}
            onMouseEnter={cancelClose}
            onFocus={cancelClose}
            className="hidden pt-2 lg:block"
          >
            <div className="overflow-hidden rounded-section border border-border bg-card shadow-nav">
              <div className="p-4">
                <p className="px-1 pb-2 text-[11px] font-bold uppercase tracking-widest text-primary">
                  {currentMega.label}
                </p>
                <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
                  {currentMega.links.map((link) => (
                    <Link
                      key={link.label}
                      to={link.to}
                      onClick={closeMenu}
                      className="rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-100 hover:bg-[#ffeeed]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
              <MegaMenuFooter />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
