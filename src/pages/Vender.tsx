import { Layout } from "@/components/layout/Layout";
import { PublishWizard } from "@/components/seller/PublishWizard";
import { Link } from "react-router-dom";

const Vender = () => {
  return (
    <Layout>
      <section className="py-10 md:py-14 border-b border-border">
        <div className="container mx-auto max-w-5xl">
          <p className="type-meta text-muted-foreground">Clasificados</p>
          <h1 className="type-h1 text-foreground mt-2">Publicá tu vehículo</h1>
          <p className="type-body text-muted-foreground mt-3 max-w-2xl">
            Completá el recorrido en una sola página. Podés subir y bajar entre etapas, y cada
            paso se guarda en borrador. Al final enviás la solicitud: el aviso queda{" "}
            <span className="text-foreground">pendiente de revisión</span>.
          </p>
          <p className="type-meta text-muted-foreground mt-4">
            ¿Solo querés mirar avisos?{" "}
            <Link
              to="/clasificados"
              className="underline underline-offset-4 text-foreground hover:text-primary"
            >
              Ir a clasificados
            </Link>
          </p>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="container mx-auto max-w-5xl">
          <PublishWizard />
        </div>
      </section>
    </Layout>
  );
};

export default Vender;
