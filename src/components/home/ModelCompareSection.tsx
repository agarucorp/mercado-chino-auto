import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  compareModelos,
  formatPrecioRef,
  getAllModeloOptions,
  type CompareResult,
  type ModeloOption,
} from "@/lib/comparador";
import { cn } from "@/lib/utils";
import { ArrowLeftRight, Trophy } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getModeloPath } from "@/lib/marcas";

function VerdictBadge({ winner, side }: { winner: "a" | "b" | "tie"; side: "a" | "b" }) {
  if (winner === "tie") {
    return (
      <span className="type-meta text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
        Empate
      </span>
    );
  }
  if (winner !== side) return null;
  return (
    <span className="inline-flex items-center gap-1 type-meta text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
      <Trophy className="w-3 h-3" />
      Gana
    </span>
  );
}

function CompareTable({
  result,
  optionA,
  optionB,
}: {
  result: CompareResult;
  optionA: ModeloOption;
  optionB: ModeloOption;
}) {
  return (
    <div className="mt-8 space-y-8 animate-in fade-in duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left p-4 type-label text-muted-foreground w-1/4">Característica</th>
              <th className="text-left p-4 type-h3 text-sm font-medium">{optionA.label}</th>
              <th className="text-left p-4 type-h3 text-sm font-medium">{optionB.label}</th>
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row) => (
              <tr key={row.label} className="border-b border-border last:border-0">
                <td className="p-4 text-muted-foreground">{row.label}</td>
                <td className="p-4 font-medium">{row.valueA}</td>
                <td className="p-4 font-medium">{row.valueB}</td>
              </tr>
            ))}
            <tr className="border-b border-border bg-muted/20">
              <td className="p-4 text-muted-foreground">Precio referencia</td>
              <td className="p-4 font-medium type-numeric">
                {formatPrecioRef(result.scoresA.precio)}
              </td>
              <td className="p-4 font-medium type-numeric">
                {formatPrecioRef(result.scoresB.precio)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="type-h3 text-foreground mb-4">Veredicto por categoría</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {result.verdicts.map((v) => (
            <div
              key={v.key}
              className="rounded-lg bg-muted/20 p-4 flex flex-col gap-2"
            >
              <span className="type-label text-muted-foreground">{v.label}</span>
              <div className="flex flex-wrap gap-2">
                <VerdictBadge winner={v.winner} side="a" />
                {v.winner === "tie" && (
                  <span className="type-meta text-xs text-muted-foreground">Ambos empatan</span>
                )}
                {v.winner === "b" && (
                  <span className="type-meta text-xs text-muted-foreground">
                    {optionB.label}
                  </span>
                )}
                {v.winner === "a" && (
                  <span className="type-meta text-xs text-muted-foreground">
                    {optionA.label}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className={cn(
          "rounded-lg p-5 text-center",
          result.overallWinner === "tie"
            ? "bg-muted/30"
            : "bg-primary/5",
        )}
      >
        <p className="type-h3 text-foreground">
          {result.overallWinner === "tie" ? (
            "Comparativa equilibrada — ambos modelos tienen fortalezas similares"
          ) : result.overallWinner === "a" ? (
            <>
              <Trophy className="w-5 h-5 inline text-primary mr-1.5 -mt-0.5" />
              {optionA.label} destaca en más categorías
            </>
          ) : (
            <>
              <Trophy className="w-5 h-5 inline text-primary mr-1.5 -mt-0.5" />
              {optionB.label} destaca en más categorías
            </>
          )}
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          <Button asChild size="sm">
            <Link to={getModeloPath(optionA.marca, optionA.modelo)}>Ver {optionA.modelo.nombre}</Link>
          </Button>
          <Button asChild size="sm">
            <Link to={getModeloPath(optionB.marca, optionB.modelo)}>Ver {optionB.modelo.nombre}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ModelCompareSection() {
  const options = useMemo(() => getAllModeloOptions(), []);
  const [idA, setIdA] = useState(options[0]?.id ?? "");
  const [idB, setIdB] = useState(options[1]?.id ?? "");
  const [result, setResult] = useState<CompareResult | null>(null);

  const optionA = options.find((o) => o.id === idA);
  const optionB = options.find((o) => o.id === idB);

  const handleCompare = () => {
    if (!optionA || !optionB || optionA.id === optionB.id) return;
    setResult(compareModelos(optionA, optionB));
  };

  const canCompare = optionA && optionB && optionA.id !== optionB.id;

  return (
    <section className="py-10 md:py-14 border-t-2 border-border bg-muted/30">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 text-accent mb-4">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
          <h2 className="type-h2 text-foreground">Compará modelos</h2>
          <p className="type-body text-muted-foreground mt-2 max-w-lg mx-auto">
            Elegí dos vehículos del catálogo y compará ficha técnica, precio de referencia y
            valoraciones de usuarios.
          </p>
        </div>

        <div className="p-5 md:p-6">
          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-end">
            <div className="space-y-2">
              <label className="type-meta text-muted-foreground">Modelo 1</label>
              <Select value={idA} onValueChange={(v) => { setIdA(v); setResult(null); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar modelo" />
                </SelectTrigger>
                <SelectContent side="bottom" sideOffset={6} collisionPadding={16} className="max-h-72">
                  {options.map((o) => (
                    <SelectItem key={o.id} value={o.id} disabled={o.id === idB}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="hidden md:flex items-center justify-center pb-2 text-muted-foreground">
              <ArrowLeftRight className="w-5 h-5" />
            </div>

            <div className="space-y-2">
              <label className="type-meta text-muted-foreground">Modelo 2</label>
              <Select value={idB} onValueChange={(v) => { setIdB(v); setResult(null); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar modelo" />
                </SelectTrigger>
                <SelectContent side="bottom" sideOffset={6} collisionPadding={16} className="max-h-72">
                  {options.map((o) => (
                    <SelectItem key={o.id} value={o.id} disabled={o.id === idA}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center gap-3">
            <Button
              onClick={handleCompare}
              disabled={!canCompare}
              className="w-full sm:w-auto min-w-[140px]"
            >
              Comparar
            </Button>
            {optionA && optionB && optionA.id === optionB.id && (
              <p className="type-meta text-destructive text-center">
                Seleccioná dos modelos distintos
              </p>
            )}
          </div>

          {result && optionA && optionB && (
            <CompareTable result={result} optionA={optionA} optionB={optionB} />
          )}
        </div>
      </div>
    </section>
  );
}
