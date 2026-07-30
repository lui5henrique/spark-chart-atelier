import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Activity,
  BatteryLow,
  BedDouble,
  Brain,
  Hourglass,
  MoonStar,
  Smartphone,
  TrendingDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FiltroBar } from "@/components/dashboard/FiltroBar";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { TabelaEditavel } from "@/components/dashboard/TabelaEditavel";
import {
  GraficoCategorias,
  GraficoDispersao,
  GraficoDispositivos,
  GraficoPaises,
  GraficoQualidadePorRotina,
  GraficoSessoes,
} from "@/components/dashboard/Graficos";
import {
  aplicarFiltros,
  correlacao,
  dadosIniciais,
  filtrosIniciais,
  media,
  percentualSim,
  type Filtros,
  type Registro,
} from "@/lib/dashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sono & Doomscrolling · Dashboard Analítico" },
      {
        name: "description",
        content:
          "Dashboard interativo com 1.000 respondentes sobre o impacto do doomscrolling noturno na qualidade do sono, ansiedade e fadiga diurna.",
      },
      { property: "og:title", content: "Sono & Doomscrolling · Dashboard Analítico" },
      {
        property: "og:description",
        content:
          "Explore KPIs, correlações e filtros interativos sobre hábitos digitais noturnos e qualidade do sono.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const fmt = (v: number, d = 1) => v.toLocaleString("pt-BR", { maximumFractionDigits: d });

function Dashboard() {
  const [dados, setDados] = useState<Registro[]>(dadosIniciais);
  const [filtros, setFiltros] = useState<Filtros>(filtrosIniciais);
  const [metricaDispersao, setMetricaDispersao] = useState<keyof Registro>("latenciaSono");

  const filtrados = useMemo(() => aplicarFiltros(dados, filtros), [dados, filtros]);

  const kpis = useMemo(() => {
    const doom = filtrados.filter((d) => d.doomscroller === "Sim");
    const naoDoom = filtrados.filter((d) => d.doomscroller === "Não");
    return {
      total: filtrados.length,
      qualidade: media(filtrados, "qualidadeSono"),
      taxaDoom: percentualSim(filtrados, "doomscroller"),
      sono: media(filtrados, "horasSono"),
      latencia: media(filtrados, "latenciaSono"),
      divida: media(filtrados, "dividaSono"),
      ansiedade: media(filtrados, "ansiedade"),
      fadiga: media(filtrados, "fadiga"),
      tela: media(filtrados, "telaAntesDormir"),
      corrTelaLatencia: correlacao(filtrados, "telaAntesDormir", "latenciaSono"),
      gapAnsiedade: media(doom, "ansiedade") - media(naoDoom, "ansiedade"),
      gapSono: media(doom, "horasSono") - media(naoDoom, "horasSono"),
    };
  }, [filtrados]);

  const editar = (id: string, patch: Partial<Registro>) =>
    setDados((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  const excluir = (id: string) => setDados((prev) => prev.filter((d) => d.id !== id));

  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-8 md:px-8 md:py-12">
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10">
            <MoonStar className="size-6 text-primary" aria-hidden />
          </span>
          <div>
            <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
              O custo invisível da conexão constante
            </p>
            <h1 className="text-2xl leading-tight font-semibold md:text-4xl">
              Sono &amp; <span className="texto-brilho">Doomscrolling</span>
            </h1>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-sm text-muted-foreground">
          Análise de {dados.length.toLocaleString("pt-BR")} respondentes globais sobre o impacto do
          uso de telas antes de dormir na arquitetura do sono, na ansiedade e na fadiga diurna.
          Filtre, edite e exporte os dados livremente — todos os indicadores recalculam em tempo
          real.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="secondary">{kpis.total} registros no recorte atual</Badge>
          <Badge variant="secondary">10 países</Badge>
          <Badge variant="secondary">30 variáveis</Badge>
        </div>
      </header>

      <FiltroBar
        dados={dados}
        filtros={filtros}
        onChange={setFiltros}
        onReset={() => setFiltros(filtrosIniciais)}
      />

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          titulo="Índice de qualidade do sono"
          valor={fmt(kpis.qualidade, 2)}
          sufixo="/ 5"
          descricao="Métrica central de sucesso do estudo"
          Icone={BedDouble}
        />
        <KpiCard
          titulo="Taxa de doomscrolling noturno"
          valor={fmt(kpis.taxaDoom)}
          sufixo="%"
          descricao={`Diferença de ansiedade vs. não praticantes: ${kpis.gapAnsiedade >= 0 ? "+" : ""}${fmt(kpis.gapAnsiedade, 2)}`}
          Icone={Smartphone}
          tom="accent"
        />
        <KpiCard
          titulo="Correlação tela × latência"
          valor={fmt(kpis.corrTelaLatencia, 2)}
          descricao="Pearson entre tela antes de dormir e tempo para adormecer"
          Icone={Hourglass}
          tom="accent"
        />
        <KpiCard
          titulo="Dívida de sono semanal"
          valor={fmt(kpis.divida, 1)}
          sufixo="h"
          descricao="Déficit acumulado — risco de fadiga crônica"
          Icone={TrendingDown}
          tom="destructive"
        />
        <KpiCard
          titulo="Horas de sono por noite"
          valor={fmt(kpis.sono, 2)}
          sufixo="h"
          descricao={`Doomscrollers dormem ${fmt(Math.abs(kpis.gapSono), 2)}h ${kpis.gapSono < 0 ? "menos" : "mais"}`}
          Icone={MoonStar}
        />
        <KpiCard
          titulo="Latência do sono"
          valor={fmt(kpis.latencia)}
          sufixo="min"
          descricao="Tempo médio de 'luta' para iniciar o sono"
          Icone={Activity}
        />
        <KpiCard
          titulo="Ansiedade média"
          valor={fmt(kpis.ansiedade, 2)}
          sufixo="/ 10"
          descricao="Impacto na saúde mental do recorte"
          Icone={Brain}
          tom="accent"
        />
        <KpiCard
          titulo="Fadiga diurna média"
          valor={fmt(kpis.fadiga, 2)}
          sufixo="/ 10"
          descricao={`Tela antes de dormir: ${fmt(kpis.tela)} min em média`}
          Icone={BatteryLow}
          tom="destructive"
        />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <GraficoQualidadePorRotina dados={filtrados} />
        <GraficoDispersao
          dados={filtrados}
          metrica={metricaDispersao}
          onMetrica={setMetricaDispersao}
        />
        <GraficoSessoes dados={filtrados} />
        <GraficoCategorias dados={filtrados} />
        <GraficoPaises dados={filtrados} />
        <GraficoDispositivos dados={filtrados} />
      </section>

      <section className="mt-6">
        <TabelaEditavel dados={filtrados} onEditar={editar} onExcluir={excluir} />
      </section>

      <footer className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
        <p>
          Fonte: <span className="text-foreground">sleep_doomscrolling_habits.csv</span> (1.000
          respondentes). Valores numéricos normalizados a partir da base bruta para escalas
          humanas (minutos, horas e índices). Ranking de métricas conforme a análise:
          qualidade do sono, fadiga diurna, tela antes de dormir, sessões de doomscrolling,
          latência, dívida de sono e despertares.
        </p>
      </footer>
    </main>
  );
}
