export type EstadoModelo = "Vigente" | "Discontinuado";

export interface Modelo {
  id: string;
  nombre: string;
  estado: EstadoModelo;
  marcaId: string;
}

export interface Marca {
  id: string;
  nombre: string;
  slug: string;
  anioLanzamiento: number;
  representante: string;
  modelos: Modelo[];
}

export interface Representante {
  id: string;
  nombre: string;
  marcaIds: string[];
}

export type FiltroEstadoMarca = "todas" | "con-vigentes" | "solo-historicas";

export type FiltroAnioMarca = "todas" | "nuevas" | "2016-2020" | "antes-2016";
