import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCcw } from "lucide-react";
import type { Filtros, Registro } from "@/lib/dashboard";
import { opcoes } from "@/lib/dashboard";

type Props = {
  dados: Registro[];
  filtros: Filtros;
  onChange: (f: Filtros) => void;
  onReset: () => void;
};

function Campo({
  label,
  valor,
  padrao,
  itens,
  onChange,
}: {
  label: string;
  valor: string;
  padrao: string;
  itens: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Select value={valor} onValueChange={onChange}>
        <SelectTrigger className="w-full bg-secondary/60">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={padrao}>{padrao}</SelectItem>
          {itens.map((i) => (
            <SelectItem key={i} value={i}>
              {i}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function FiltroBar({ dados, filtros, onChange, onReset }: Props) {
  return (
    <Card className="card-noite p-5">
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Campo
          label="País / Região"
          valor={filtros.pais}
          padrao="Todos"
          itens={opcoes(dados, "pais")}
          onChange={(pais) => onChange({ ...filtros, pais })}
        />
        <Campo
          label="Gênero"
          valor={filtros.genero}
          padrao="Todos"
          itens={opcoes(dados, "genero")}
          onChange={(genero) => onChange({ ...filtros, genero })}
        />
        <Campo
          label="Dispositivo noturno"
          valor={filtros.dispositivo}
          padrao="Todos"
          itens={opcoes(dados, "dispositivo")}
          onChange={(dispositivo) => onChange({ ...filtros, dispositivo })}
        />
        <Campo
          label="Rotina antes de dormir"
          valor={filtros.rotina}
          padrao="Todas"
          itens={opcoes(dados, "rotina")}
          onChange={(rotina) => onChange({ ...filtros, rotina })}
        />
        <Campo
          label="Pratica doomscrolling"
          valor={filtros.doomscroller}
          padrao="Todos"
          itens={opcoes(dados, "doomscroller")}
          onChange={(doomscroller) => onChange({ ...filtros, doomscroller })}
        />
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Faixa de idade: {filtros.idade[0]} – {filtros.idade[1]} anos
          </Label>
          <Slider
            value={filtros.idade}
            min={17}
            max={54}
            step={1}
            onValueChange={(v) => onChange({ ...filtros, idade: [v[0], v[1]] })}
            className="pt-2"
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="outline" size="sm" onClick={onReset}>
          <RotateCcw className="size-4" /> Limpar filtros
        </Button>
      </div>
    </Card>
  );
}
