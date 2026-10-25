import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { PROVIDER_CATEGORIES, listProviders } from "@/lib/providers-api";
import { visitorError } from "@/lib/visitor-error";
import type { ProviderCategory } from "@/types/database";
import { useQuery } from "@tanstack/react-query";
import { Globe, Loader2, Phone } from "lucide-react";
import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";

const TABS = [
  { id: "estetico", label: "Cuidado estético" },
  { id: "repuestos", label: "Repuestos" },
  ...PROVIDER_CATEGORIES.filter((item) => item.id !== "estetico"),
] as const;

type TabId = (typeof TABS)[number]["id"];

const PARTNERS = [
  {
    id: "chinamotion",
    name: "ChinaMotion",
    image: "/repuestos/chinamotion.jpg",
    imageAlt: "ChinaMotion, repuestos y soluciones para vehículos chinos",
    whatsapp: "https://wa.me/5491157331111",
    website: "https://www.chinamotion.com.ar",
  },
  {
    id: "byd",
    name: "Repuestos BYD Warnes",
    image: "/repuestos/byd.jpg",
    imageAlt: "Repuestos para BYD Warnes 1184",
    whatsapp: "https://wa.me/5491127021111",
    website: "https://www.repuestosparabyd.com",
  },
] as const;

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
      <path d="M20.5 3.5A11 11 0 0 0 2.1 17.2L1 23l6-1.6A11 11 0 0 0 20.5 3.5Zm-8.5 17a9.1 9.1 0 0 1-4.6-1.3l-.3-.2-3.5.9.9-3.4-.2-.3A9.1 9.1 0 1 1 12 20.5Zm5-6.8c-.3-.1-1.6-.8-1.8-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.5.2-.3a.5.5 0 0 0 0-.5c0-.1-.6-1.4-.8-1.9s-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 12 12 0 0 0 4.5 4 15 15 0 0 0 1.5.6 3.6 3.6 0 0 0 1.7.1 2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.6-.3Z" />
    </svg>
  );
}

function isTab(value: string | null): value is TabId {
  return TABS.some((item) => item.id === value);
}

const Repuestos = () => {
  const [params, setParams] = useSearchParams();
  const raw = params.get("categoria");
  const categoria: TabId = isTab(raw) ? raw : "repuestos";

  const { data = [], isLoading, isError, error } = useQuery({
    queryKey: ["service-providers", "public"],
    queryFn: () => listProviders(true),
    enabled: categoria !== "repuestos",
  });

  const visibles = useMemo(
    () => data.filter((item) => item.category === (categoria as ProviderCategory)),
    [data, categoria],
  );

  return (
    <Layout>
      <section className="container mx-auto py-10 md:py-14">
        <h1 className="type-h1 text-foreground">Repuestos y talleres de autos chinos</h1>
        <p className="type-body text-muted-foreground mt-2 max-w-2xl">
          Cuidado estético, mecánica y lubricentros. Elegí una categoría para ver los proveedores.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {TABS.map((item) => (
            <Button
              key={item.id}
              type="button"
              variant={categoria === item.id ? "default" : "outline"}
              className={
                categoria === item.id
                  ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:text-primary-foreground"
                  : undefined
              }
              onClick={() => setParams({ categoria: item.id })}
            >
              {item.label}
            </Button>
          ))}
        </div>

        {categoria === "repuestos" ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {PARTNERS.map((partner) => (
              <article
                key={partner.id}
                className="flex flex-col rounded-2xl border border-border bg-background p-6 md:p-8"
              >
                <img
                  src={partner.image}
                  alt={partner.imageAlt}
                  className="w-full rounded-xl object-contain"
                />
                <div className="mt-6 flex flex-col gap-3">
                  <a
                    href={partner.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="btn inline-flex h-12 w-full items-center justify-center gap-2 border-transparent bg-[#25D366] text-white hover:bg-[#1ebe5d]"
                  >
                    <WhatsAppIcon />
                    WhatsApp
                  </a>
                  <Button asChild variant="outline" className="h-12 w-full">
                    <a href={partner.website} target="_blank" rel="noreferrer">
                      <Globe className="h-4 w-4" aria-hidden />
                      Sitio web
                    </a>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {isLoading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
            {isError && (
              <p className="type-body-sm text-muted-foreground">
                {visitorError(error, "repuestos")}
              </p>
            )}
            {!isLoading && !isError && visibles.length === 0 && (
              <p className="type-body text-muted-foreground">Todavía no hay proveedores en esta categoría.</p>
            )}
            {visibles.map((item) => (
              <article
                key={item.id}
                className="flex flex-col rounded-2xl border border-border bg-background p-6 text-center md:p-8"
              >
                <h2 className="type-h3 text-foreground">{item.name}</h2>
                {item.city && <p className="type-meta text-muted-foreground mt-1">{item.city}</p>}
                {item.description && (
                  <p className="type-body-sm text-muted-foreground mt-3 whitespace-pre-line">{item.description}</p>
                )}
                {item.phone && (
                  <a
                    href={`tel:${item.phone}`}
                    className="btn mt-6 inline-flex h-12 w-full items-center justify-center gap-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Phone className="h-4 w-4" aria-hidden />
                    Ver teléfono
                  </a>
                )}
              </article>
            ))}
          </div>
        )}

        <p className="type-body-sm text-muted-foreground mt-10">
          ¿Tenés un taller o casa de repuestos?{" "}
          <Link to="/contacto" className="text-primary underline underline-offset-4">
            Escribinos para publicar
          </Link>
          .
        </p>
      </section>
    </Layout>
  );
};

export default Repuestos;
