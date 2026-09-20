import { MARCAS } from "@/data/marcas";
import type { Marca, Modelo } from "@/types/marcas";
import type { LucideIcon } from "lucide-react";
import {
  BatteryCharging,
  Car,
  CarFront,
  CarTaxiFront,
  Mountain,
  Package,
  PlugZap,
  Truck,
} from "lucide-react";

export type CategoriaSlug =
  | "electrico"
  | "hibrido"
  | "suv"
  | "hatchback"
  | "sedan"
  | "pickup"
  | "utilitario"
  | "offroad";

export interface CategoriaInfo {
  slug: CategoriaSlug;
  label: string;
  descripcion: string;
  icon: LucideIcon;
  orden: number;
}

export const CATEGORIAS: CategoriaInfo[] = [
  {
    slug: "electrico",
    label: "Eléctricos",
    descripcion: "100% eléctricos",
    icon: PlugZap,
    orden: 1,
  },
  {
    slug: "hibrido",
    label: "Híbridos",
    descripcion: "HEV, PHEV y enchufables",
    icon: BatteryCharging,
    orden: 2,
  },
  {
    slug: "suv",
    label: "SUV",
    descripcion: "Crossovers y SUVs",
    icon: CarFront,
    orden: 3,
  },
  {
    slug: "hatchback",
    label: "Hatchback",
    descripcion: "Compactos urbanos",
    icon: Car,
    orden: 4,
  },
  {
    slug: "sedan",
    label: "Sedán",
    descripcion: "Berlinas y sedanes",
    icon: CarTaxiFront,
    orden: 5,
  },
  {
    slug: "pickup",
    label: "Pick-ups",
    descripcion: "Camionetas de trabajo",
    icon: Truck,
    orden: 6,
  },
  {
    slug: "utilitario",
    label: "Utilitarios",
    descripcion: "Furgones, vans y comerciales",
    icon: Package,
    orden: 7,
  },
  {
    slug: "offroad",
    label: "Off-road",
    descripcion: "4x4 y aventura",
    icon: Mountain,
    orden: 8,
  },
];

function norm(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function isHybrid(n: string): boolean {
  return /dm-i|hev|hybrid|phev|mhev/.test(n);
}

function isUtilitario(n: string): boolean {
  return (
    /furgon|mamut|sunray|view cs|gratour|aumark|toano|tm1|foison|box refrigerado|rino$|camion|utilitario|minivan|u-tour|myway|^m7$|ev30x|be11/.test(
      n,
    ) ||
    n.includes("mamut") ||
    n === "van" ||
    n.includes("domy v1")
  );
}

function isPickup(n: string): boolean {
  return (
    /poer|tunland|shark|grand avenue|wingle|pick-up|pickup|domy k/.test(n) ||
    n === "r8" ||
    /^t[689]0?$/.test(n.replace(/\s/g, ""))
  );
}

function isOffroad(n: string): boolean {
  return /tank 300|bj40|bj60|dadao pro/.test(n);
}

function isElectric(n: string): boolean {
  if (isHybrid(n)) return false;
  if (/glory e5/.test(n)) return false;

  return (
    /easy 3|yuan pro|dolphin|ora 03|geometry ex5|ex35|u5 plus ev|iev7s|ev30x|et5|yoyo|cyberster|nammi|e200|ex260|leapmotor|cyberster/.test(
      n,
    ) ||
    (n.includes("box") && n.includes("nammi")) ||
    (n === "pony" && !n.includes("plus")) ||
    n.endsWith(" ev")
  );
}

function isHatchback(n: string): boolean {
  return (
    /dolphin mini|mini|qq|z100|^03$|yoyo pro|e200|d20|face|skin|lc$|515|ora 03/.test(n) ||
    (n.includes("box") && n.includes("nammi"))
  );
}

function isSedan(n: string): boolean {
  return (
    /arrizo|empow|aion es|z300|fulwin|familia|seal 05/.test(n) ||
    (n.includes("seal") && !n.includes("seal u"))
  );
}

function isSuv(n: string): boolean {
  if (isUtilitario(n) || isPickup(n)) return false;

  return (
    /tiggo|haval|jolion|cs\d|atto|song|yuan|seal u|js\d|\(s[2-8]\)|x35|x55|x25|x40|x50|x60|x70|x3$|x7$|bj30|dashing|deepal|forthing|gsm|gs8|glory 5|glory 580|lynk|jaecoo|omoda|kaiyi|d90|swm|geely|huge|mage|arcfox|kaola|jetour|u-tour|myway|m7|h6|h1|h2|zs|t600|t33|t5$|t1$|t2$|s5$|s7$|tiggo|maxus|leapmotor/.test(
      n,
    ) ||
    (/^t[125]$/.test(n) && !n.includes("tm1"))
  );
}

/** Clasifica un modelo en una o más categorías según el catálogo actual. */
export function getCategoriasDeModelo(nombre: string): CategoriaSlug[] {
  const n = norm(nombre);
  const cats = new Set<CategoriaSlug>();

  if (isElectric(n)) cats.add("electrico");
  if (isHybrid(n)) cats.add("hibrido");
  if (isUtilitario(n)) cats.add("utilitario");
  if (isPickup(n)) cats.add("pickup");
  if (isOffroad(n)) cats.add("offroad");
  if (isHatchback(n)) cats.add("hatchback");
  if (isSedan(n)) cats.add("sedan");
  if (isSuv(n)) cats.add("suv");

  if (cats.size === 0) cats.add("suv");

  return Array.from(cats);
}

export function modeloEnCategoria(modelo: Modelo, categoria: CategoriaSlug): boolean {
  return getCategoriasDeModelo(modelo.nombre).includes(categoria);
}

export function getCategoriasConConteo(): Array<CategoriaInfo & { count: number }> {
  const counts = new Map<CategoriaSlug, number>();

  for (const cat of CATEGORIAS) {
    counts.set(cat.slug, 0);
  }

  for (const marca of MARCAS) {
    for (const modelo of marca.modelos) {
      for (const cat of getCategoriasDeModelo(modelo.nombre)) {
        counts.set(cat, (counts.get(cat) ?? 0) + 1);
      }
    }
  }

  return CATEGORIAS.map((cat) => ({
    ...cat,
    count: counts.get(cat.slug) ?? 0,
  }))
    .filter((cat) => cat.count > 0)
    .sort((a, b) => a.orden - b.orden);
}

export function filterMarcasPorCategoria(
  marcas: Marca[],
  categoria: CategoriaSlug | null,
): Marca[] {
  if (!categoria) return marcas;

  return marcas
    .map((marca) => ({
      ...marca,
      modelos: marca.modelos.filter((m) => modeloEnCategoria(m, categoria)),
    }))
    .filter((marca) => marca.modelos.length > 0);
}

const CATEGORIA_SLUG_ALIASES: Record<string, CategoriaSlug> = {
  comercial: "utilitario",
};

export function resolveCategoriaSlug(slug: string): string {
  return CATEGORIA_SLUG_ALIASES[slug] ?? slug;
}

export function getCategoriaBySlug(slug: string): CategoriaInfo | undefined {
  return CATEGORIAS.find((c) => c.slug === resolveCategoriaSlug(slug));
}

export interface ModeloConMarca {
  marca: Marca;
  modelo: Modelo;
}

export function getModelosPorCategoria(categoria: CategoriaSlug): ModeloConMarca[] {
  const result: ModeloConMarca[] = [];

  for (const marca of MARCAS) {
    for (const modelo of marca.modelos) {
      if (modeloEnCategoria(modelo, categoria)) {
        result.push({ marca, modelo });
      }
    }
  }

  return result.sort((a, b) => {
    const byNombre = a.modelo.nombre.localeCompare(b.modelo.nombre, "es");
    return byNombre !== 0 ? byNombre : a.marca.nombre.localeCompare(b.marca.nombre, "es");
  });
}

export function getCategoriaActivaBySlug(
  slug: string,
): (CategoriaInfo & { count: number }) | undefined {
  const resolved = resolveCategoriaSlug(slug);
  return getCategoriasConConteo().find((c) => c.slug === resolved);
}
