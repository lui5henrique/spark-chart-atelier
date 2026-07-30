import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { agruparMedia, campoLabel, contar, type Registro } from "@/lib/dashboard";

const eixo = { stroke: "var(--muted-foreground)", fontSize: 11 };
const tooltipStyle = {
  contentStyle: {
    background: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    fontSize: "12px",
    color: "var(--popover-foreground)",
  },
  labelStyle: { color: "var(--foreground)" },
};

function Painel({
  titulo,
  subtitulo,
  children,
  acao,
}: {
  titulo: string;
  subtitulo: string;
  children: React.ReactNode;
  acao?: React.ReactNode;
}) {
  return (
    <Card className="card-noite gap-0 p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">{titulo}</h3>
          <p className="text-xs text-muted-foreground">{subtitulo}</p>
        </div>
        {acao}
      </div>
      <div className="h-[280px] w-full">{children}</div>
    </Card>
  );
}

export function GraficoQualidadePorRotina({ dados }: { dados: Registro[] }) {
  const linhas = agruparMedia(dados, "rotina", ["qualidadeSono", "horasSono"]).sort(
    (a, b) => (b.qualidadeSono as number) - (a.qualidadeSono as number),
  );
  return (
    <Painel
      titulo="Qualidade do sono por rotina noturna"
      subtitulo="Média do índice de qualidade (0-5) e horas de sono"
    >
      <ResponsiveContainer>
        <BarChart data={linhas} margin={{ left: -18, right: 8 }}>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis dataKey="nome" tick={eixo} interval={0} angle={-12} height={48} dy={12} />
          <YAxis tick={eixo} />
          <Tooltip {...tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar
            name="Qualidade do sono"
            dataKey="qualidadeSono"
            fill="var(--chart-1)"
            radius={[6, 6, 0, 0]}
          />
          <Bar
            name="Horas de sono"
            dataKey="horasSono"
            fill="var(--chart-2)"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Painel>
  );
}

export function GraficoDispersao({
  dados,
  metrica,
  onMetrica,
}: {
  dados: Registro[];
  metrica: keyof Registro;
  onMetrica: (m: keyof Registro) => void;
}) {
  const pontos = dados
    .filter((d) => typeof d[metrica] === "number")
    .map((d) => ({ x: d.telaAntesDormir, y: d[metrica] as number, doom: d.doomscroller }));
  const escolhas: (keyof Registro)[] = [
    "latenciaSono",
    "horasSono",
    "ansiedade",
    "fadiga",
    "dividaSono",
  ];
  return (
    <Painel
      titulo="Tela antes de dormir vs. métrica"
      subtitulo="Cada ponto é um respondente — ciano = doomscroller"
      acao={
        <Select value={metrica as string} onValueChange={(v) => onMetrica(v as keyof Registro)}>
          <SelectTrigger className="w-[190px] bg-secondary/60" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {escolhas.map((e) => (
              <SelectItem key={e as string} value={e as string}>
                {campoLabel[e as string]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    >
      <ResponsiveContainer>
        <ScatterChart margin={{ left: -18, right: 8, top: 8 }}>
          <CartesianGrid stroke="var(--border)" />
          <XAxis
            type="number"
            dataKey="x"
            name="Tela antes de dormir (min)"
            tick={eixo}
            unit=" min"
          />
          <YAxis type="number" dataKey="y" name={campoLabel[metrica as string]} tick={eixo} />
          <Tooltip {...tooltipStyle} />
          <Scatter data={pontos} fillOpacity={0.65}>
            {pontos.map((p, i) => (
              <Cell key={i} fill={p.doom === "Sim" ? "var(--chart-1)" : "var(--chart-2)"} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </Painel>
  );
}

export function GraficoCategorias({ dados }: { dados: Registro[] }) {
  const fatias = contar(dados, "categoriaQualidade");
  const cores: Record<string, string> = {
    Boa: "var(--chart-4)",
    Regular: "var(--chart-2)",
    Ruim: "var(--chart-5)",
  };
  return (
    <Painel
      titulo="Distribuição da qualidade do sono"
      subtitulo="Participação de cada categoria na amostra filtrada"
    >
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={fatias}
            dataKey="valor"
            nameKey="nome"
            innerRadius={62}
            outerRadius={100}
            paddingAngle={3}
            stroke="var(--background)"
          >
            {fatias.map((f) => (
              <Cell key={f.nome} fill={cores[f.nome] ?? "var(--chart-3)"} />
            ))}
          </Pie>
          <Tooltip {...tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </Painel>
  );
}

export function GraficoSessoes({ dados }: { dados: Registro[] }) {
  const linhas = agruparMedia(dados, "sessoesDoom", ["ansiedade", "estresse", "fadiga"])
    .map((l) => ({ ...l, nome: Number(l.nome) }))
    .sort((a, b) => (a.nome as number) - (b.nome as number))
    .filter((l) => (l.total as number) >= 5);
  return (
    <Painel
      titulo="Saúde mental por sessões de doomscrolling"
      subtitulo="Médias de ansiedade, estresse e fadiga por número de sessões/noite"
    >
      <ResponsiveContainer>
        <LineChart data={linhas} margin={{ left: -18, right: 8 }}>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis dataKey="nome" tick={eixo} />
          <YAxis tick={eixo} domain={[0, 10]} />
          <Tooltip {...tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line
            name="Ansiedade"
            dataKey="ansiedade"
            stroke="var(--chart-1)"
            strokeWidth={2.5}
            dot={{ r: 3 }}
          />
          <Line
            name="Estresse"
            dataKey="estresse"
            stroke="var(--chart-2)"
            strokeWidth={2.5}
            dot={{ r: 3 }}
          />
          <Line
            name="Fadiga diurna"
            dataKey="fadiga"
            stroke="var(--chart-3)"
            strokeWidth={2.5}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Painel>
  );
}

export function GraficoPaises({ dados }: { dados: Registro[] }) {
  const linhas = agruparMedia(dados, "pais", ["dividaSono", "telaAntesDormir"]).sort(
    (a, b) => (b.dividaSono as number) - (a.dividaSono as number),
  );
  return (
    <Painel
      titulo="Dívida de sono semanal por país"
      subtitulo="Horas acumuladas de déficit e tela antes de dormir (min)"
    >
      <ResponsiveContainer>
        <BarChart data={linhas} layout="vertical" margin={{ left: 32, right: 12 }}>
          <CartesianGrid stroke="var(--border)" horizontal={false} />
          <XAxis type="number" tick={eixo} />
          <YAxis type="category" dataKey="nome" tick={eixo} width={92} />
          <Tooltip {...tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar
            name="Dívida de sono (h)"
            dataKey="dividaSono"
            fill="var(--chart-5)"
            radius={[0, 6, 6, 0]}
          />
          <Bar
            name="Tela antes de dormir (min)"
            dataKey="telaAntesDormir"
            fill="var(--chart-1)"
            radius={[0, 6, 6, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Painel>
  );
}

export function GraficoDispositivos({ dados }: { dados: Registro[] }) {
  const linhas = agruparMedia(dados, "dispositivo", ["latenciaSono", "despertares"]).sort(
    (a, b) => (b.latenciaSono as number) - (a.latenciaSono as number),
  );
  return (
    <Painel
      titulo="Impacto do dispositivo noturno"
      subtitulo="Latência do sono (min) e despertares médios"
    >
      <ResponsiveContainer>
        <BarChart data={linhas} margin={{ left: -18, right: 8 }}>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis dataKey="nome" tick={eixo} />
          <YAxis tick={eixo} />
          <Tooltip {...tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar
            name="Latência do sono (min)"
            dataKey="latenciaSono"
            fill="var(--chart-3)"
            radius={[6, 6, 0, 0]}
          />
          <Bar
            name="Despertares"
            dataKey="despertares"
            fill="var(--chart-4)"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Painel>
  );
}
