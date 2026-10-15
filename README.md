# Armazém Tag Site

Site institucional do **Armazém Tag** — delivery local que conecta comércios, consumidores e entregadores.

## Tech Stack

- **Framework:** TanStack Start (SSR) + TanStack Router
- **UI:** React 19 + shadcn/ui (New York style)
- **Styling:** Tailwind CSS v4
- **Build:** Vite 8 + Nitro
- **Ícones:** Lucide React

## Estrutura

```
src/
  screens/          # Telas/páginas do site
    Home/
      index.tsx
      styles.ts
      components/   # Componentes específicos da tela
        SectionTitle/
        ProductCrop/
  components/       # Componentes reutilizáveis
    Header/
    Footer/
    ui/             # shadcn/ui components
  assets/           # Imagens, fontes e estáticos
  hooks/            # Hooks customizados
  lib/              # Utilitários e helpers
  services/         # Camada de serviços
  utils/            # Funções utilitárias
  types/            # Definições de tipo
```

## Desenvolvimento

### Pré-requisitos

- Node.js 18+ ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Instalação

```sh
git clone <url-do-repositorio>
cd app-armazemtag
npm install
```

### Dev server

```sh
npm run dev
```

### Build

```sh
npm run build
```

### Preview

```sh
npm run preview
```

### Lint

```sh
npm run lint
```

### Format

```sh
npm run format
```
