import { MarcaCard } from "@/components/brands/MarcaCard";
import { Layout } from "@/components/layout/Layout";
import { MARCAS } from "@/data/marcas";
import { getCategoriaActivaBySlug } from "@/lib/categorias";
import { Navigate, useSearchParams } from "react-router-dom";

const MARCAS_ORDENADAS = [...MARCAS].sort((a, b) =>
  a.nombre.localeCompare(b.nombre, "es"),
);

const Marcas = () => {
  const [searchParams] = useSearchParams();
  const categoriaParam = searchParams.get("categoria");
  if (categoriaParam && getCategoriaActivaBySlug(categoriaParam)) {
    return <Navigate to={`/categorias/${categoriaParam}`} replace />;
  }

  return (
    <Layout>
      <section className="py-10 md:py-14 min-h-screen">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-10">
            <h1 className="type-h1 text-foreground">Marcas</h1>
            <p className="type-meta text-muted-foreground mt-2">
              {MARCAS_ORDENADAS.length} marcas chinas en el catálogo argentino
            </p>
          </div>

          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
            {MARCAS_ORDENADAS.map((marca) => (
              <li key={marca.id}>
                <MarcaCard marca={marca} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Layout>
  );
};

export default Marcas;
