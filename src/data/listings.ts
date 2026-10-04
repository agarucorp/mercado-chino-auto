export interface ListingSpec {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface ListingSeller {
  name: string;
  type: "concesionario" | "particular";
  address: string;
  city: string;
  province: string;
  listingsCount: number;
}

export interface Listing {
  id: string;
  title: string;
  version: string;
  price: number;
  year: number;
  km: number;
  fuel: string;
  transmission: string;
  location: string;
  province: string;
  image: string;
  images: string[];
  featured?: boolean;
  marcaId: string;
  modeloId?: string;
  description: string;
  general: ListingSpec[];
  performance: ListingSpec[];
  security: ListingSpec[];
  equipment: string[];
  seller: ListingSeller;
  currency?: "ARS" | "USD";
  /** Precio no publicado: en la ficha se muestra "A consultar". */
  priceOnRequest?: boolean;
  plan?: "basico" | "destacado" | "premium";
  status?: "pendiente" | "aprobada" | "rechazada" | "archivada";
  sellerEmail?: string;
  sellerPhone?: string;
  adminNotes?: string | null;
  submittedAt?: string;
  isWeeklyPick?: boolean;
  homePickOrder?: number | null;
}

const IMG = {
  byd1: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&h=800&fit=crop",
  byd2: "https://images.unsplash.com/photo-1619767886555-ef3f88941f8b?w=800&h=600&fit=crop",
  byd3: "https://images.unsplash.com/photo-1614200179396-2bdb4ebf37b3?w=800&h=600&fit=crop",
  chery1: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&h=800&fit=crop",
  chery2: "https://images.unsplash.com/photo-1519641471654-76cebc7f6450?w=800&h=600&fit=crop",
  gwm1: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&h=800&fit=crop",
  jac1: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&h=800&fit=crop",
  geely1: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&h=800&fit=crop",
  dolphin1: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200&h=800&fit=crop",
  interior: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&h=600&fit=crop",
};

export const LISTINGS_DATA: Listing[] = [
  {
    id: "1",
    title: "BYD Song Pro",
    version: "DM-i 1.5 GS 5P",
    price: 85000000,
    year: 2024,
    km: 5000,
    fuel: "Híbrido",
    transmission: "Automático",
    location: "CABA",
    province: "Ciudad Autónoma de Buenos Aires",
    image: IMG.byd1,
    images: [IMG.byd1, IMG.byd2, IMG.byd3, IMG.interior],
    featured: true,
    marcaId: "byd",
    modeloId: "byd-song-pro",
    description:
      "BYD Song Pro DM-i en excelente estado, único dueño. SUV híbrido enchufable con bajo consumo y gran equipamiento de serie. Service oficial al día. Entrega inmediata.",
    general: [
      { label: "Tipo de vehículo", value: "SUV" },
      { label: "Año", value: "2024" },
      { label: "Versión", value: "DM-i 1.5 GS 5P" },
      { label: "Marca", value: "BYD" },
      { label: "Modelo", value: "Song Pro" },
      { label: "Kilometraje", value: "5.000 km" },
      { label: "Puertas", value: "5" },
      { label: "Color", value: "Blanco perla" },
      { label: "Único dueño", value: "Sí", highlight: true },
    ],
    performance: [
      { label: "Motor", value: "1.5 Híbrido enchufable DM-i" },
      { label: "Combustible", value: "Híbrido enchufable" },
      { label: "Transmisión", value: "Automática E-CVT" },
      { label: "Tracción", value: "Delantera" },
      { label: "Potencia", value: "215 CV combinados" },
      { label: "Autonomía eléctrica", value: "~100 km" },
    ],
    security: [
      { label: "Airbags", value: "6" },
      { label: "ABS", value: "Sí" },
      { label: "Control de estabilidad", value: "Sí" },
      { label: "Cámara de retroceso", value: "Sí" },
      { label: "Sensores de estacionamiento", value: "Delanteros y traseros" },
    ],
    equipment: [
      "Aire acondicionado",
      "Bluetooth",
      "Pantalla táctil",
      "Cruise control",
      "Llantas de aleación",
      "Techo panorámico",
      "Asientos de cuero",
      "Cargador a bordo",
    ],
    seller: {
      name: "BYD Center Palermo",
      type: "concesionario",
      address: "Av. Santa Fe 3200",
      city: "Palermo",
      province: "CABA",
      listingsCount: 24,
    },
  },
  {
    id: "2",
    title: "Chery Tiggo 8 Pro Max",
    version: "1.6T Luxury 7P",
    price: 55000000,
    year: 2024,
    km: 12000,
    fuel: "Nafta",
    transmission: "Automático",
    location: "Córdoba",
    province: "Córdoba",
    image: IMG.chery1,
    images: [IMG.chery1, IMG.chery2, IMG.interior, IMG.byd2],
    featured: true,
    marcaId: "chery",
    modeloId: "chery-tiggo-8-pro",
    description:
      "Tiggo 8 Pro Max 7 plazas, ideal para familia. Motor turbo 1.6 con caja automática DCT. Revisado en concesionario oficial Chery. Permuta y financiación disponible.",
    general: [
      { label: "Tipo de vehículo", value: "SUV" },
      { label: "Año", value: "2024" },
      { label: "Versión", value: "1.6T Luxury 7P" },
      { label: "Marca", value: "Chery" },
      { label: "Modelo", value: "Tiggo 8 Pro Max" },
      { label: "Kilometraje", value: "12.000 km" },
      { label: "Puertas", value: "5" },
      { label: "Color", value: "Gris grafito" },
      { label: "Único dueño", value: "Sí", highlight: true },
    ],
    performance: [
      { label: "Motor", value: "1.6 turbo naftero" },
      { label: "Combustible", value: "Nafta" },
      { label: "Transmisión", value: "Automática DCT 7 vel." },
      { label: "Tracción", value: "Delantera" },
      { label: "Potencia", value: "186 CV" },
    ],
    security: [
      { label: "Airbags", value: "6" },
      { label: "ABS", value: "Sí" },
      { label: "Control de estabilidad", value: "Sí" },
      { label: "Cámara 360°", value: "Sí" },
      { label: "Frenos de disco", value: "Las cuatro ruedas" },
    ],
    equipment: [
      "Aire acondicionado dual",
      "Bluetooth",
      "Apple CarPlay",
      "Android Auto",
      "Techo panorámico",
      "Asientos de cuero",
      "Llantas de aleación",
      "Control crucero",
    ],
    seller: {
      name: "Chery Córdoba Motors",
      type: "concesionario",
      address: "Av. Colón 4500",
      city: "Córdoba",
      province: "Córdoba",
      listingsCount: 18,
    },
  },
  {
    id: "3",
    title: "GWM Haval H6",
    version: "1.5T Supreme 4x2",
    price: 42000000,
    year: 2023,
    km: 25000,
    fuel: "Nafta",
    transmission: "Automático",
    location: "Mendoza",
    province: "Mendoza",
    image: IMG.gwm1,
    images: [IMG.gwm1, IMG.chery2, IMG.interior, IMG.byd1],
    featured: false,
    marcaId: "gwm",
    modeloId: "gwm-haval-h6",
    description:
      "Haval H6 Supreme con equipamiento completo. SUV mediano muy cómodo para ruta y ciudad. Segundo dueño, historial de service documentado.",
    general: [
      { label: "Tipo de vehículo", value: "SUV" },
      { label: "Año", value: "2023" },
      { label: "Versión", value: "1.5T Supreme 4x2" },
      { label: "Marca", value: "GWM" },
      { label: "Modelo", value: "Haval H6" },
      { label: "Kilometraje", value: "25.000 km" },
      { label: "Puertas", value: "5" },
      { label: "Color", value: "Negro" },
      { label: "Único dueño", value: "No" },
    ],
    performance: [
      { label: "Motor", value: "1.5 turbo naftero" },
      { label: "Combustible", value: "Nafta" },
      { label: "Transmisión", value: "Automática DCT" },
      { label: "Tracción", value: "Delantera" },
      { label: "Potencia", value: "150 CV" },
    ],
    security: [
      { label: "Airbags", value: "6" },
      { label: "ABS", value: "Sí" },
      { label: "Control de estabilidad", value: "Sí" },
      { label: "Cámara de retroceso", value: "Sí" },
    ],
    equipment: [
      "Aire acondicionado",
      "Bluetooth",
      "Pantalla táctil",
      "Llantas de aleación",
      "Control crucero",
      "Sensores de estacionamiento",
    ],
    seller: {
      name: "GWM Mendoza",
      type: "concesionario",
      address: "Ruta 40 y Acceso Sur",
      city: "Guaymallén",
      province: "Mendoza",
      listingsCount: 11,
    },
  },
  {
    id: "4",
    title: "JAC T8",
    version: "2.0 CTI 4x4",
    price: 38000000,
    year: 2023,
    km: 30000,
    fuel: "Diesel",
    transmission: "Manual",
    location: "Santa Fe",
    province: "Santa Fe",
    image: IMG.jac1,
    images: [IMG.jac1, IMG.byd3, IMG.interior, IMG.chery1],
    featured: false,
    marcaId: "jac",
    modeloId: "jac-t8",
    description:
      "Pick-up JAC T8 4x4 diesel, ideal trabajo y aventura. Caja manual 6 velocidades, doble cabina. Barra antivuelco y cubre caja incluidos.",
    general: [
      { label: "Tipo de vehículo", value: "Pick-up" },
      { label: "Año", value: "2023" },
      { label: "Versión", value: "2.0 CTI 4x4" },
      { label: "Marca", value: "JAC" },
      { label: "Modelo", value: "T8" },
      { label: "Kilometraje", value: "30.000 km" },
      { label: "Puertas", value: "4" },
      { label: "Color", value: "Blanco" },
      { label: "Único dueño", value: "Sí", highlight: true },
    ],
    performance: [
      { label: "Motor", value: "2.0 turbo diesel" },
      { label: "Combustible", value: "Diesel" },
      { label: "Transmisión", value: "Manual 6 vel." },
      { label: "Tracción", value: "4x4" },
      { label: "Potencia", value: "150 CV" },
    ],
    security: [
      { label: "Airbags", value: "2" },
      { label: "ABS", value: "Sí" },
      { label: "Control de estabilidad", value: "Sí" },
    ],
    equipment: [
      "Aire acondicionado",
      "Bluetooth",
      "Cámara de retroceso",
      "Llantas de aleación",
      "Barra antivuelco",
    ],
    seller: {
      name: "Carlos M.",
      type: "particular",
      address: "Zona norte",
      city: "Santa Fe",
      province: "Santa Fe",
      listingsCount: 1,
    },
  },
  {
    id: "5",
    title: "Geely EX5",
    version: "Flagship EV",
    price: 35000000,
    year: 2024,
    km: 8000,
    fuel: "Eléctrico",
    transmission: "Automático",
    location: "CABA",
    province: "Ciudad Autónoma de Buenos Aires",
    image: IMG.geely1,
    images: [IMG.geely1, IMG.dolphin1, IMG.interior, IMG.byd2],
    featured: false,
    marcaId: "geely",
    modeloId: "geely-ex5",
    description:
      "Geely EX5 eléctrico, autonomía real superior a 400 km. Carga rápida compatible. Garantía de batería vigente. Excelente estado general.",
    general: [
      { label: "Tipo de vehículo", value: "SUV" },
      { label: "Año", value: "2024" },
      { label: "Versión", value: "Flagship EV" },
      { label: "Marca", value: "Geely" },
      { label: "Modelo", value: "EX5" },
      { label: "Kilometraje", value: "8.000 km" },
      { label: "Puertas", value: "5" },
      { label: "Color", value: "Azul metalizado" },
      { label: "Único dueño", value: "Sí", highlight: true },
    ],
    performance: [
      { label: "Motor", value: "Eléctrico" },
      { label: "Combustible", value: "Eléctrico" },
      { label: "Transmisión", value: "Automática" },
      { label: "Tracción", value: "Delantera" },
      { label: "Potencia", value: "218 CV" },
      { label: "Autonomía", value: "~430 km WLTP" },
    ],
    security: [
      { label: "Airbags", value: "6" },
      { label: "ABS", value: "Sí" },
      { label: "Control de estabilidad", value: "Sí" },
      { label: "Asistente de frenado", value: "Sí" },
    ],
    equipment: [
      "Aire acondicionado",
      "Bluetooth",
      "Pantalla táctil",
      "Cargador a bordo",
      "Llantas de aleación",
      "Control crucero adaptativo",
      "Asientos calefaccionados",
    ],
    seller: {
      name: "Geely EV Store",
      type: "concesionario",
      address: "Av. del Libertador 5800",
      city: "Núñez",
      province: "CABA",
      listingsCount: 9,
    },
  },
  {
    id: "6",
    title: "BYD Dolphin Mini",
    version: "GS 5P",
    price: 28000000,
    year: 2024,
    km: 3000,
    fuel: "Eléctrico",
    transmission: "Automático",
    location: "Buenos Aires",
    province: "Buenos Aires",
    image: IMG.dolphin1,
    images: [IMG.dolphin1, IMG.geely1, IMG.interior, IMG.byd1],
    featured: false,
    marcaId: "byd",
    modeloId: "byd-dolphin-mini",
    description:
      "Citycar eléctrico perfecto para la ciudad. Bajo costo de mantenimiento y estacionamiento fácil. Como nuevo, con solo 3.000 km.",
    general: [
      { label: "Tipo de vehículo", value: "Hatchback" },
      { label: "Año", value: "2024" },
      { label: "Versión", value: "GS 5P" },
      { label: "Marca", value: "BYD" },
      { label: "Modelo", value: "Dolphin Mini" },
      { label: "Kilometraje", value: "3.000 km" },
      { label: "Puertas", value: "5" },
      { label: "Color", value: "Verde menta" },
      { label: "Único dueño", value: "Sí", highlight: true },
    ],
    performance: [
      { label: "Motor", value: "Eléctrico" },
      { label: "Combustible", value: "Eléctrico" },
      { label: "Transmisión", value: "Automática" },
      { label: "Tracción", value: "Delantera" },
      { label: "Potencia", value: "75 CV" },
      { label: "Autonomía", value: "~300 km" },
    ],
    security: [
      { label: "Airbags", value: "4" },
      { label: "ABS", value: "Sí" },
      { label: "Control de estabilidad", value: "Sí" },
    ],
    equipment: [
      "Aire acondicionado",
      "Bluetooth",
      "Pantalla táctil",
      "Cargador a bordo",
      "Llantas de aleación",
    ],
    seller: {
      name: "María L.",
      type: "particular",
      address: "Zona oeste",
      city: "Morón",
      province: "Buenos Aires",
      listingsCount: 1,
    },
  },
];

export function getListingById(id: string): Listing | undefined {
  return LISTINGS_DATA.find((l) => l.id === id);
}

export function getRelatedListings(
  listing: Listing,
  limit = 4,
  pool: Listing[] = LISTINGS_DATA,
): Listing[] {
  const others = pool.filter((l) => l.id !== listing.id);
  const sameBrand = others.filter((l) => l.marcaId === listing.marcaId);
  const different = others.filter((l) => l.marcaId !== listing.marcaId);
  return [...sameBrand, ...different].slice(0, limit);
}

export function getLatestListings(limit = 3): Listing[] {
  return [...LISTINGS_DATA].slice(0, limit);
}

export function getVehicleOfTheWeek(): Listing {
  return LISTINGS_DATA.find((l) => l.featured) ?? LISTINGS_DATA[0];
}

export function getListingsByModelo(marcaId: string, modeloId: string) {
  return LISTINGS_DATA.filter(
    (l) => l.marcaId === marcaId && l.modeloId === modeloId,
  );
}

export const PRICE_ON_REQUEST_LABEL = "A consultar";

export const formatPrice = (price: number, currency: "ARS" | "USD" = "ARS") =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);

export function formatListingPrice(
  listing: Pick<Listing, "price" | "currency" | "priceOnRequest">,
): string {
  if (listing.priceOnRequest) return PRICE_ON_REQUEST_LABEL;
  return formatPrice(listing.price, listing.currency ?? "ARS");
}

export const formatKm = (km: number) =>
  new Intl.NumberFormat("es-AR").format(km) + " km";
