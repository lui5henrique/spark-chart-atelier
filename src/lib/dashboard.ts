import raw from "@/data/dataset.json";

export type Registro = {
  id: string;
  idade: number;
  telaAntesDormir: number;
  telaDiariaHoras: number;
  sessoesDoom: number;
  duracaoDoom: number;
  horasSono: number;
  latenciaSono: number;
  despertares: number;
  cafeina: number | null;
  ansiedade: number;
  estresse: number;
  qualidadeSono: number | null;
  fadiga: number;
  appsNoticias: number;
  checagens: number;
  exercicio: number | null;
  diasDetox: number;
  dividaSono: number;
  genero: string;
  ocupacao: string | null;
  pais: string;
  dispositivo: string | null;
  rotina: string | null;
  modoNoturno: string;
  celularNoQuarto: string;
  noticiasNegativas: string;
  appSono: string;
  doomscroller: string;
  categoriaQualidade: string;
};

export const dadosIniciais = raw as Registro[];

export type Filtros = {
  pais: string;
  genero: string;
  dispositivo: string;
  doomscroller: string;
  rotina: string;
  idade: [number, number];
};

export const filtrosIniciais: Filtros = {
  pais: "Todos",
  genero: "Todos",
  dispositivo: "Todos",
  doomscroller: "Todos",
  rotina: "Todas",
  idade: [17, 54],
};

export function opcoes(dados: Registro[], campo: keyof Registro): string[] {
  const set = new Set<string>();
  dados.forEach((d) => {
    const v = d[campo];
    if (typeof v === "string" && v) set.add(v);
  });
  return [...set].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export function aplicarFiltros(dados: Registro[], f: Filtros): Registro[] {
  return dados.filter(
    (d) =>
      (f.pais === "Todos" || d.pais === f.pais) &&
      (f.genero === "Todos" || d.genero === f.genero) &&
      (f.dispositivo === "Todos" || d.dispositivo === f.dispositivo) &&
      (f.doomscroller === "Todos" || d.doomscroller === f.doomscroller) &&
      (f.rotina === "Todas" || d.rotina === f.rotina) &&
      d.idade >= f.idade[0] &&
      d.idade <= f.idade[1],
  );
}

const nums = (dados: Registro[], campo: keyof Registro) =>
  dados.map((d) => d[campo]).filter((v): v is number => typeof v === "number");

export function media(dados: Registro[], campo: keyof Registro): number {
  const v = nums(dados, campo);
  if (!v.length) return 0;
  return v.reduce((a, b) => a + b, 0) / v.length;
}

export function percentualSim(dados: Registro[], campo: keyof Registro): number {
  if (!dados.length) return 0;
  const sim = dados.filter((d) => d[campo] === "Sim").length;
  return (sim / dados.length) * 100;
}

/** Correlação de Pearson entre dois campos numéricos. */
export function correlacao(dados: Registro[], a: keyof Registro, b: keyof Registro): number {
  const pares = dados
    .map((d) => [d[a], d[b]])
    .filter((p): p is [number, number] => typeof p[0] === "number" && typeof p[1] === "number");
  const n = pares.length;
  if (n < 3) return 0;
  const mx = pares.reduce((s, p) => s + p[0], 0) / n;
  const my = pares.reduce((s, p) => s + p[1], 0) / n;
  let num = 0;
  let dx = 0;
  let dy = 0;
  for (const [x, y] of pares) {
    num += (x - mx) * (y - my);
    dx += (x - mx) ** 2;
    dy += (y - my) ** 2;
  }
  const den = Math.sqrt(dx * dy);
  return den === 0 ? 0 : num / den;
}

export function agruparMedia(
  dados: Registro[],
  chave: keyof Registro,
  metricas: (keyof Registro)[],
): Array<Record<string, number | string>> {
  const mapa = new Map<string, Registro[]>();
  dados.forEach((d) => {
    const k = (d[chave] as string) ?? "Não informado";
    mapa.set(k, [...(mapa.get(k) ?? []), d]);
  });
  return [...mapa.entries()].map(([nome, grupo]) => {
    const linha: Record<string, number | string> = { nome, total: grupo.length };
    metricas.forEach((m) => {
      linha[m as string] = Number(media(grupo, m).toFixed(2));
    });
    return linha;
  });
}

export function contar(dados: Registro[], chave: keyof Registro) {
  const mapa = new Map<string, number>();
  dados.forEach((d) => {
    const k = (d[chave] as string) ?? "Não informado";
    mapa.set(k, (mapa.get(k) ?? 0) + 1);
  });
  return [...mapa.entries()].map(([nome, valor]) => ({ nome, valor }));
}

export function paraCSV(dados: Registro[]): string {
  if (!dados.length) return "";
  const cols = Object.keys(dados[0]) as (keyof Registro)[];
  const linhas = dados.map((d) => cols.map((c) => d[c] ?? "").join(";"));
  return [cols.join(";"), ...linhas].join("\n");
}

export const campoLabel: Record<string, string> = {
  idade: "Idade",
  telaAntesDormir: "Tela antes de dormir (min)",
  telaDiariaHoras: "Tela diária (h)",
  sessoesDoom: "Sessões de doomscrolling/noite",
  duracaoDoom: "Duração média da sessão (min)",
  horasSono: "Horas de sono",
  latenciaSono: "Latência do sono (min)",
  despertares: "Despertares noturnos",
  cafeina: "Cafeína (mg/dia)",
  ansiedade: "Ansiedade (0-10)",
  estresse: "Estresse (0-10)",
  qualidadeSono: "Qualidade do sono (0-5)",
  fadiga: "Fadiga diurna (0-10)",
  appsNoticias: "Apps de notícias",
  checagens: "Checagens do celular/noite",
  exercicio: "Exercício (min/dia)",
  diasDetox: "Dias desde o detox digital",
  dividaSono: "Dívida de sono semanal (h)",
};
