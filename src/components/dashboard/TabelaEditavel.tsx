import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, Download, Pencil, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { campoLabel, paraCSV, type Registro } from "@/lib/dashboard";

const colunas: (keyof Registro)[] = [
  "idade",
  "telaAntesDormir",
  "sessoesDoom",
  "horasSono",
  "latenciaSono",
  "qualidadeSono",
  "ansiedade",
  "fadiga",
  "dividaSono",
];

type Props = {
  dados: Registro[];
  onEditar: (id: string, patch: Partial<Registro>) => void;
  onExcluir: (id: string) => void;
};

export function TabelaEditavel({ dados, onEditar, onExcluir }: Props) {
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(0);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [rascunho, setRascunho] = useState<Record<string, string>>({});
  const porPagina = 12;

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return dados;
    return dados.filter(
      (d) =>
        d.id.toLowerCase().includes(q) ||
        d.pais.toLowerCase().includes(q) ||
        (d.dispositivo ?? "").toLowerCase().includes(q) ||
        (d.rotina ?? "").toLowerCase().includes(q),
    );
  }, [dados, busca]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / porPagina));
  const paginaAtual = Math.min(pagina, totalPaginas - 1);
  const visiveis = filtrados.slice(paginaAtual * porPagina, paginaAtual * porPagina + porPagina);

  function iniciarEdicao(r: Registro) {
    setEditandoId(r.id);
    setRascunho(
      Object.fromEntries(colunas.map((c) => [c as string, r[c] === null ? "" : String(r[c])])),
    );
  }

  function salvar(r: Registro) {
    const patch: Partial<Registro> = {};
    for (const c of colunas) {
      const bruto = rascunho[c as string];
      const num = bruto === "" ? null : Number(bruto);
      if (bruto !== "" && Number.isNaN(num)) {
        toast.error(`Valor inválido em ${campoLabel[c as string]}`);
        return;
      }
      (patch as Record<string, unknown>)[c as string] = num;
    }
    onEditar(r.id, patch);
    setEditandoId(null);
    toast.success(`Registro ${r.id} atualizado`);
  }

  function exportar() {
    const blob = new Blob([paraCSV(filtrados)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sono_doomscrolling_filtrado.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exportado");
  }

  return (
    <Card className="card-noite gap-0 p-5">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">Base de dados editável</h3>
          <p className="text-xs text-muted-foreground">
            Edite qualquer valor numérico e os KPIs e gráficos recalculam na hora.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search
              className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setPagina(0);
              }}
              placeholder="Buscar ID, país, dispositivo…"
              className="w-56 bg-secondary/60 pl-8"
            />
          </div>
          <Button variant="outline" size="sm" onClick={exportar}>
            <Download className="size-4" /> Exportar CSV
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">ID</TableHead>
              <TableHead className="text-xs">País</TableHead>
              <TableHead className="text-xs">Doom</TableHead>
              {colunas.map((c) => (
                <TableHead key={c as string} className="text-xs whitespace-nowrap">
                  {campoLabel[c as string]}
                </TableHead>
              ))}
              <TableHead className="text-right text-xs">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visiveis.map((r) => {
              const editando = editandoId === r.id;
              return (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.id}</TableCell>
                  <TableCell className="text-xs whitespace-nowrap">{r.pais}</TableCell>
                  <TableCell>
                    <Badge
                      variant={r.doomscroller === "Sim" ? "default" : "secondary"}
                      className="text-[10px]"
                    >
                      {r.doomscroller}
                    </Badge>
                  </TableCell>
                  {colunas.map((c) => (
                    <TableCell key={c as string} className="text-xs">
                      {editando ? (
                        <Input
                          value={rascunho[c as string] ?? ""}
                          onChange={(e) =>
                            setRascunho((p) => ({ ...p, [c as string]: e.target.value }))
                          }
                          className="h-8 w-20 bg-secondary/60 text-xs"
                          inputMode="decimal"
                        />
                      ) : (
                        (r[c] ?? "—")
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="text-right whitespace-nowrap">
                    {editando ? (
                      <>
                        <Button size="icon" variant="ghost" onClick={() => salvar(r)}>
                          <Check className="size-4 text-success" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => setEditandoId(null)}>
                          <X className="size-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="icon" variant="ghost" onClick={() => iniciarEdicao(r)}>
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            onExcluir(r.id);
                            toast.success(`Registro ${r.id} removido`);
                          }}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {filtrados.length} registros · página {paginaAtual + 1} de {totalPaginas}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={paginaAtual === 0}
            onClick={() => setPagina(paginaAtual - 1)}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={paginaAtual >= totalPaginas - 1}
            onClick={() => setPagina(paginaAtual + 1)}
          >
            Próxima
          </Button>
        </div>
      </div>
    </Card>
  );
}
