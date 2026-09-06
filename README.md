<h1 align="center">Sono & Doomscrolling — Dashboard Analítico</h1>

<p align="center">Dashboard interativo sobre o impacto do doomscrolling noturno na qualidade do sono, ansiedade e fadiga diurna</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-blue?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/TanStack%20Start-black" alt="TanStack Start">
  <img src="https://img.shields.io/badge/TailwindCSS-4-38BDF8?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4">
  <img src="https://img.shields.io/badge/shadcn%2Fui-black" alt="shadcn/ui">
  <img src="https://img.shields.io/badge/Recharts-informational" alt="Recharts">
</p>

## Sobre o projeto

Dashboard analítico com 1.000 respondentes, explorando a relação entre hábitos digitais noturnos (doomscrolling, tempo de tela antes de dormir, checagens de celular) e qualidade do sono, ansiedade e fadiga. Permite filtrar os dados, visualizar KPIs e gráficos de correlação, e editar/excluir registros diretamente na tabela.

Projeto criado com [Lovable](https://lovable.dev).

## Funcionalidades

- KPIs consolidados: qualidade do sono, taxa de doomscroller, horas de sono, latência do sono, dívida de sono, ansiedade, fadiga e correlação tela × latência do sono.
- Filtros interativos por país, gênero, dispositivo, doomscroller, rotina e faixa etária.
- Gráficos (Recharts): qualidade do sono por rotina, dispersão configurável entre métricas, categorias, sessões de doomscrolling, distribuição por país e por dispositivo.
- Tabela de registros editável, com edição e exclusão de linhas em tempo real.

## Tecnologias

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) (componentes Radix UI)
- [Recharts](https://recharts.org/) — gráficos
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) — formulários e validação
- [Vite](https://vitejs.dev/) — build
- [Bun](https://bun.sh/) — gerenciador de pacotes

## Pré-requisitos

- [Bun](https://bun.sh/) instalado

## Instalação

```bash
git clone https://github.com/lui5henrique/spark-chart-atelier.git
cd spark-chart-atelier

bun install
```

## Uso

```bash
# Ambiente de desenvolvimento
bun run dev

# Build de produção
bun run build

# Build em modo desenvolvimento
bun run build:dev

# Pré-visualizar o build
bun run preview

# Lint
bun run lint

# Formatar código
bun run format
```

## Estrutura do projeto

```
src/
├── routes/
│   ├── __root.tsx              layout raiz da aplicação
│   └── index.tsx                página do dashboard
├── components/
│   ├── dashboard/
│   │   ├── FiltroBar.tsx        barra de filtros (país, gênero, dispositivo, idade...)
│   │   ├── KpiCard.tsx           card de indicador (KPI)
│   │   ├── Graficos.tsx          gráficos Recharts (categorias, dispersão, países, dispositivos...)
│   │   └── TabelaEditavel.tsx    tabela de registros com edição/exclusão
│   └── ui/                      componentes shadcn/ui
├── lib/
│   └── dashboard.ts             tipos, filtros e funções de agregação (média, correlação, %)
└── data/
    └── dataset.json              base de dados (1.000 registros)
```
<img width="1280" height="1800" alt="app_sono1" src="https://github.com/user-attachments/assets/261f2308-08b3-486e-a01a-17b336914110" />

<img width="1280" height="1800" alt="app_sono2" src="https://github.com/user-attachments/assets/179ac3e5-19f9-4577-9ccc-7d3da9c4a48b" />

## Autor

**Luis Henrique** — [@lui5henrique](https://github.com/lui5henrique)
