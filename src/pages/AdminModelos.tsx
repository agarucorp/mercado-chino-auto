import { AdminShell } from "@/components/admin/AdminShell";
import { Input } from "@/components/ui/input";
import { MARCAS } from "@/data/marcas";
import { useNews } from "@/hooks/useNews";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

function AdminModelosInner() {
  const { data: news = [] } = useNews();
  const [q, setQ] = useState("");

  const counts = useMemo(() => {
    const map = new Map<string, { total: number; radar: number }>();

    const bump = (modeloId: string, published: boolean) => {
      const cur = map.get(modeloId) ?? { total: 0, radar: 0 };
      cur.total += 1;
      if (published) cur.radar += 1;
      map.set(modeloId, cur);
    };

    for (const n of news) {
      const published = n.published !== false;
      if (n.modeloId) {
        bump(n.modeloId, published);
        continue;
      }
      // «Todos los modelos» de una marca: cuenta en cada ficha de esa marca.
      if (!n.marcaId) continue;
      const marca = MARCAS.find((m) => m.id === n.marcaId);
      if (!marca) continue;
      for (const modelo of marca.modelos) {
        bump(modelo.id, published);
      }
    }
    return map;
  }, [news]);

  const query = q.trim().toLowerCase();
  const marcas = MARCAS.filter((marca) => {
    if (!query) return true;
    if (marca.nombre.toLowerCase().includes(query)) return true;
    return marca.modelos.some((m) => m.nombre.toLowerCase().includes(query));
  });

  return (
    <>
      <h1 className="type-h1 text-foreground">Historial por modelo</h1>
      <p className="type-body text-muted-foreground mt-3 max-w-2xl">
        Acá ves todas las notas de cada ficha, incluidas las que ya no están en el radar.
        Si se acumulan, borralas desde el historial: eso sí las saca de la ficha pública.
      </p>

      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar marca o modelo"
        className="mt-8 max-w-md"
        aria-label="Buscar marca o modelo"
      />

      <div className="mt-8 space-y-10">
        {marcas.map((marca) => {
          const modelos = query
            ? marca.modelos.filter(
                (m) =>
                  marca.nombre.toLowerCase().includes(query) ||
                  m.nombre.toLowerCase().includes(query),
              )
            : marca.modelos;

          if (modelos.length === 0) return null;

          return (
            <section key={marca.id}>
              <h2 className="type-h2 text-foreground mb-3">{marca.nombre}</h2>
              <ul className="divide-y divide-border rounded-xl border border-border">
                {modelos.map((modelo) => {
                  const stats = counts.get(modelo.id) ?? { total: 0, radar: 0 };
                  return (
                    <li key={modelo.id}>
                      <Link
                        to={`/admin/modelos/${marca.id}/${modelo.id}`}
                        className="flex items-baseline justify-between gap-4 px-4 py-3 hover:bg-muted/40"
                      >
                        <span className="type-body-sm text-foreground">{modelo.nombre}</span>
                        <span className="type-meta text-muted-foreground shrink-0">
                          {stats.total === 0
                            ? "Sin notas"
                            : `${stats.radar} en radar · ${stats.total} en historial`}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}

const AdminModelos = () => (
  <AdminShell>
    <AdminModelosInner />
  </AdminShell>
);

export default AdminModelos;
