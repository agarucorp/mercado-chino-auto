import type { NewsArticle } from "@/components/news/NewsCard";
import { MARCAS } from "@/data/marcas";

export const NEWS_DATA: NewsArticle[] = [
  {
    id: "1",
    title: "BYD lanza el nuevo Seal U DM-i en Argentina: precios y versiones disponibles",
    excerpt:
      "La marca china presenta su SUV híbrido enchufable con una autonomía combinada de hasta 1.200 km y tecnología de última generación.",
    image:
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop",
    category: "Lanzamiento",
    source: "Autoblog",
    date: "22 Ene 2026",
    year: 2026,
    sortDate: "2026-01-22",
    featured: true,
    marcaId: "byd",
    modeloId: "byd-seal-u-dm-i",
  },
  {
    id: "2",
    title: "Chery Tiggo 8 Pro Max: llega la versión tope de gama al mercado argentino",
    excerpt:
      "Con motor turbo de 197 CV y caja automática de 7 velocidades, el nuevo Tiggo 8 Pro Max promete redefinir el segmento.",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
    category: "Novedad",
    source: "Motor1",
    date: "21 Ene 2026",
    year: 2026,
    sortDate: "2026-01-21",
    marcaId: "chery",
    modeloId: "chery-tiggo-8-pro",
  },
  {
    id: "3",
    title: "GWM confirma la llegada del ORA 03 eléctrico para el segundo semestre",
    excerpt:
      "El compacto eléctrico de Great Wall Motors llegará con 400 km de autonomía y un precio competitivo.",
    image:
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=600&fit=crop",
    category: "Eléctricos",
    source: "Parabrisas",
    date: "20 Ene 2026",
    year: 2026,
    sortDate: "2026-01-20",
    marcaId: "gwm",
    modeloId: "gwm-ora-03",
  },
  {
    id: "4",
    title: "Geely anuncia nueva planta de ensamblaje en Córdoba",
    excerpt:
      "La inversión de 300 millones de dólares generará más de 2.000 puestos de trabajo directos.",
    image:
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop",
    category: "Industria",
    source: "La Nación",
    date: "19 Ene 2026",
    year: 2026,
    sortDate: "2026-01-19",
    marcaId: "geely",
  },
  {
    id: "5",
    title: "JAC presenta el nuevo pickup T8 con motor diésel de 150 CV",
    excerpt:
      "La pickup china busca competir directamente con las marcas establecidas del segmento.",
    image:
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop",
    category: "Pickups",
    source: "16 Válvulas",
    date: "18 Ene 2026",
    year: 2026,
    sortDate: "2026-01-18",
    marcaId: "jac",
    modeloId: "jac-t8",
  },
  {
    id: "6",
    title: "Nuevas regulaciones de importación favorecen a vehículos eléctricos chinos",
    excerpt:
      "El gobierno anunció beneficios arancelarios para vehículos de bajas emisiones importados.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    category: "Política",
    source: "Infobae",
    date: "17 Ene 2026",
    year: 2026,
    sortDate: "2026-01-17",
  },
  {
    id: "7",
    title: "Comparativa: los 5 SUV chinos más vendidos del mes",
    excerpt:
      "Analizamos las características, precios y equipamiento de los modelos más populares.",
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop",
    category: "Comparativas",
    source: "Autocity",
    date: "16 Ene 2026",
    year: 2026,
    sortDate: "2026-01-16",
  },
  {
    id: "8",
    title: "BYD supera las 10.000 unidades vendidas en Argentina durante 2025",
    excerpt:
      "La marca eléctrica china consolida su liderazgo en el segmento de bajas emisiones con fuerte demanda en CABA y GBA.",
    image:
      "https://images.unsplash.com/photo-1619767886555-ef3f88941f8b?w=800&h=600&fit=crop",
    category: "Mercado",
    source: "Autoblog",
    date: "12 Dic 2025",
    year: 2025,
    sortDate: "2025-12-12",
    marcaId: "byd",
  },
  {
    id: "9",
    title: "Chery amplía su red de concesionarios en el interior del país",
    excerpt:
      "Cinco nuevos puntos de venta en Rosario, Mendoza y Tucumán refuerzan la presencia de la marca en 2025.",
    image:
      "https://images.unsplash.com/photo-1519641471654-76cebc7f6450?w=800&h=600&fit=crop",
    category: "Industria",
    source: "Motor1",
    date: "28 Nov 2025",
    year: 2025,
    sortDate: "2025-11-28",
    marcaId: "chery",
  },
  {
    id: "10",
    title: "El mercado de pick-ups chinas creció un 35% interanual en Argentina",
    excerpt:
      "JAC y GWM lideran las ventas del segmento utilitario con modelos diésel y configuraciones 4x4.",
    image:
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop",
    category: "Mercado",
    source: "La Nación",
    date: "15 Oct 2025",
    year: 2025,
    sortDate: "2025-10-15",
  },
];

export function getNewsYears(): number[] {
  return [...new Set(NEWS_DATA.map((n) => n.year))].sort((a, b) => b - a);
}

export interface NewsMarcaOption {
  id: string;
  nombre: string;
}

export function getNewsMarcas(): NewsMarcaOption[] {
  const marcaIds = [...new Set(NEWS_DATA.map((n) => n.marcaId).filter(Boolean))] as string[];

  return marcaIds
    .map((id) => {
      const marca = MARCAS.find((m) => m.id === id);
      return { id, nombre: marca?.nombre ?? id };
    })
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
}

export function getFilteredNews(
  year: number | null,
  marcaId: string | null = null,
): NewsArticle[] {
  let list = NEWS_DATA;
  if (year !== null) list = list.filter((n) => n.year === year);
  if (marcaId !== null) list = list.filter((n) => n.marcaId === marcaId);
  return [...list].sort((a, b) => b.sortDate.localeCompare(a.sortDate));
}

export function getNewsByModelo(marcaId: string, modeloId: string) {
  return NEWS_DATA.filter((n) => n.marcaId === marcaId && n.modeloId === modeloId);
}

export function getNewsByMarca(marcaId: string) {
  return NEWS_DATA.filter((n) => n.marcaId === marcaId);
}
