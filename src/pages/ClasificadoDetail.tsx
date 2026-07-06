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
import {
  formatKm,
  formatPrice,
  getListingById,
  getRelatedListings,
} from "@/data/listings";
import { ArrowLeft, MapPin } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";

const ClasificadoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const listing = id ? getListingById(id) : undefined;

  if (!listing) {
    return <Navigate to="/clasificados" replace />;
  }

  const related = getRelatedListings(listing);

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
                <ListingSpecTable title="Prestaciones y mecánica" rows={listing.performance} />
                <ListingSpecTable title="Seguridad" rows={listing.security} />
              </div>

              <div className="py-2 md:py-4">
                <ListingDescription description={listing.description} />
              </div>

              <div className="py-2 md:py-4">
                <ListingEquipment items={listing.equipment} />
              </div>

              <ListingSellerCard seller={listing.seller} />

              <ModeloCatalogTeaser listing={listing} />
            </DetailPageGrid>

          {related.length > 0 && (
            <section className="mt-12 md:mt-16">
              <h2 className="type-h2 text-foreground mb-6">
                Publicaciones que pueden interesarte
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {related.map((item) => (
                  <Link
                    key={item.id}
                    to={`/clasificados/${item.id}`}
                    className="group overflow-hidden transition-colors"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="type-h3 text-sm group-hover:text-primary transition-colors line-clamp-2">
                        {item.year} {item.title}
                      </h3>
                      <p className="type-numeric font-semibold text-primary mt-2">
                        {formatPrice(item.price)}
                      </p>
                      <p className="type-meta text-muted-foreground mt-2 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {item.location}
                      </p>
                      <p className="type-meta text-muted-foreground">{formatKm(item.km)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ClasificadoDetail;
