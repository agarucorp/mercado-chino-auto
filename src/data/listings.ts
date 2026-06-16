export interface Listing {
  id: string;
  title: string;
  price: number;
  year: number;
  km: number;
  fuel: string;
  transmission: string;
  location: string;
  image: string;
  featured?: boolean;
  marcaId: string;
  modeloId?: string;
}

export const LISTINGS_DATA: Listing[] = [
  {
    id: "1",
    title: "BYD Song Pro 2024",
    price: 85000000,
    year: 2024,
    km: 5000,
    fuel: "Híbrido",
    transmission: "Automático",
    location: "CABA",
    image:
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop",
    featured: true,
    marcaId: "byd",
    modeloId: "byd-song-pro",
  },
  {
    id: "2",
    title: "Chery Tiggo 8 Pro Max 2024",
    price: 55000000,
    year: 2024,
    km: 12000,
    fuel: "Nafta",
    transmission: "Automático",
    location: "Córdoba",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
    featured: true,
    marcaId: "chery",
    modeloId: "chery-tiggo-8",
  },
  {
    id: "3",
    title: "GWM Haval H6 2023",
    price: 42000000,
    year: 2023,
    km: 25000,
    fuel: "Nafta",
    transmission: "Automático",
    location: "Mendoza",
    image:
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop",
    featured: false,
    marcaId: "gwm",
    modeloId: "gwm-haval-h6",
  },
  {
    id: "4",
    title: "JAC T8 Diesel 2023",
    price: 38000000,
    year: 2023,
    km: 30000,
    fuel: "Diesel",
    transmission: "Manual",
    location: "Santa Fe",
    image:
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop",
    featured: false,
    marcaId: "jac",
    modeloId: "jac-t8",
  },
  {
    id: "5",
    title: "Geely EX5 2024",
    price: 35000000,
    year: 2024,
    km: 8000,
    fuel: "Eléctrico",
    transmission: "Automático",
    location: "CABA",
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop",
    featured: false,
    marcaId: "geely",
    modeloId: "geely-ex5",
  },
  {
    id: "6",
    title: "BYD Dolphin Mini 2024",
    price: 28000000,
    year: 2024,
    km: 3000,
    fuel: "Eléctrico",
    transmission: "Automático",
    location: "Buenos Aires",
    image:
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=600&fit=crop",
    featured: false,
    marcaId: "byd",
    modeloId: "byd-dolphin-mini",
  },
];

export function getListingsByModelo(marcaId: string, modeloId: string) {
  return LISTINGS_DATA.filter(
    (l) => l.marcaId === marcaId && l.modeloId === modeloId,
  );
}

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);

export const formatKm = (km: number) =>
  new Intl.NumberFormat("es-AR").format(km) + " km";
