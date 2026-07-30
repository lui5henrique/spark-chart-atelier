import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

type Props = {
  titulo: string;
  valor: string;
  sufixo?: string;
  descricao: string;
  Icone: LucideIcon;
  tom?: "primary" | "accent" | "success" | "destructive";
};

const tons = {
  primary: "text-primary",
  accent: "text-accent",
  success: "text-success",
  destructive: "text-destructive",
} as const;

export function KpiCard({ titulo, valor, sufixo, descricao, Icone, tom = "primary" }: Props) {
  return (
    <Card className="card-noite gap-0 p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {titulo}
        </p>
        <Icone className={`size-5 shrink-0 ${tons[tom]}`} aria-hidden />
      </div>
      <p className="mt-3 font-display text-3xl leading-none font-semibold">
        {valor}
        {sufixo ? <span className="ml-1 text-base text-muted-foreground">{sufixo}</span> : null}
      </p>
      <p className="mt-2 text-xs text-muted-foreground">{descricao}</p>
    </Card>
  );
}
