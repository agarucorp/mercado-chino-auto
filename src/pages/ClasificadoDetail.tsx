import {
  DetailMobileAside,
  DetailPageGrid,
  DetailStickyAside,
} from "@/components/detail/DetailStickyAside";
import { ListingGallery } from "@/components/listings/ListingGallery";
import {
  ListingDescription,
  ListingEquipment,
  ListingSellerCard,
  ListingSpecTable,
} from "@/components/listings/ListingDetailSections";
import { ListingSidebar } from "@/components/listings/ListingSidebar";
import { ModeloCatalogTeaser } from "@/components/listings/ModeloCatalogTeaser";
import { Layout } from "@/components/layout/Layout";
import { formatKm, formatListingPrice, getRelatedListings } from "@/data/listings";
import { useApprovedListings, useListing } from "@/hooks/useListings";
import { ArrowLeft } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";

const ClasificadoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: listing, isLoading } = useListing(id);
  const { data: allListings = [] } = useApprovedListings();
  const related = listing ? getRelatedListings(listing, 3, allListings) : [];

  if (isLoading) {
    return (
      <Layout>
        <p className="type-body text-muted-foreground text-center py-24">Cargando aviso…</p>
      </Layout>
    );
  }

  if (!listing) {
    return <Navigate to="/clasificados" replace />;
  }

  return (
    <Layout>
      <section className="py-6 md:py-10 min-h-screen">
        <div className="container mx-auto max-w-7xl">
          <Link
            to="/clasificados"
            className="inline-flex items-center gap-1.5 type-meta text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a clasificados
          </Link>

          <DetailPageGrid
              sidebar={
                <DetailStickyAside>
                  <ListingSidebar listing={listing} />
                </DetailStickyAside>
              }
            >
              <ListingGallery images={listing.images} title={listing.title} />

              <DetailMobileAside>
                <ListingSidebar listing={listing} />
              </DetailMobileAside>

              <div className="space-y-8 py-2 md:py-4">
                <ListingSpecTable title="General" rows={listing.general} />
                {listing.performance.length > 0 && (
                  <ListingSpecTable title="Prestaciones y mecánica" rows={listing.performance} />
                )}
                {listing.security.length > 0 && (
                  <ListingSpecTable title="Seguridad" rows={listing.security} />
                )}
              </div>

              <div className="py-2 md:py-4">
                <ListingDescription description={listing.description} />
              </div>

              {listing.equipment.length > 0 && (
                <div className="py-2 md:py-4">
                  <ListingEquipment items={listing.equipment} />
                </div>
              )}

              <ListingSellerCard seller={listing.seller} />

              <ModeloCatalogTeaser listing={listing} />

              {related.length > 0 && (
                <section className="py-2 md:py-4">
                  <h2 className="type-h2 text-foreground mb-6">También te puede interesar</h2>
                  <div className="grid sm:grid-cols-3 gap-5">
                    {related.map((item) => (
                      <Link
                        key={item.id}
                        to={`/clasificados/${item.id}`}
                        className="group overflow-hidden transition-colors"
                      >
                        <div className="aspect-[16/10] overflow-hidden bg-muted rounded-lg">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h3 className="type-h3 text-sm mt-3 group-hover:text-primary transition-colors">
                          {item.year} {item.title}
                        </h3>
                        <p className="type-numeric font-semibold text-primary mt-1">
                          {formatListingPrice(item)}
                        </p>
                        <p className="type-meta text-muted-foreground mt-1">
                          {formatKm(item.km)} · {item.location}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </DetailPageGrid>
        </div>
      </section>
    </Layout>
  );
};

export default ClasificadoDetail;
