import { slugify } from "@/lib/marcas";

/** Sitios oficiales de la marca en Argentina (cuando existen) */
export const MARCA_SITIOS_OFICIALES: Partial<Record<string, string>> = {
  arcfox: "https://www.arcfox.com.ar",
  baic: "https://baic.com.ar",
  byd: "https://www.byd.com/ar",
  changan: "https://www.changan.com.ar",
  chery: "https://www.chery.com.ar",
  dfsk: "https://www.dfsk.com.ar",
  faw: "https://famly.com.ar",
  foton: "https://foton.com.ar",
  gac: "https://gacmotor.com.ar",
  geely: "https://www.geely.com.ar",
  gwm: "https://gwm.com.ar",
  jac: "https://jacargentina.com.ar",
  jetour: "https://famly.com.ar",
  jmc: "https://jmcargentina.com.ar",
  kyc: "https://kyc.com.ar",
  lifan: "https://famly.com.ar",
  mg: "https://www.mgmotor.com.ar",
  shineray: "https://www.shineray.com.ar",
};

/** Sitios oficiales del representante / agencia importadora */
export const REPRESENTANTE_SITIOS_OFICIALES: Partial<Record<string, string>> = {
  "annapurna": "https://www.annapurna.com.ar",
  "autos-sustentables-del-sur": "https://www.autossustentablesdelsur.com.ar",
  "avantek": "https://www.avantek.com.ar",
  "baw-motors-argentina": "https://www.bawmotors.com.ar",
  "black-sapphire": "https://www.blacksapphire.com.ar",
  "byd-auto-argentina-s-a-u": "https://www.byd.com/ar",
  "famly": "https://famly.com.ar",
  "grupo-antelo": "https://www.grupoantelo.com.ar",
  "grupo-belcastro": "https://www.belcastro.com.ar",
  "grupo-corven": "https://www.grupocorven.com.ar",
  "grupo-chery": "https://www.grupocorven.com.ar",
  "grupo-empresario-prieto": "https://www.grupoempresarioprieto.com.ar",
  "grupo-eximar": "https://www.grupoeximar.com.ar",
  "grupo-la-emilia": "https://www.grupolaemilia.com.ar",
  "grupo-prieto": "https://www.grupoprieto.com.ar",
  "omoda-and-jaecoo-argentina": "https://www.omodajaecoo.com.ar",
  "oriente-motors": "https://www.orientemotors.com.ar",
  "ralitor": "https://www.ralitor.com.ar",
  "socma": "https://www.socma.com.ar",
  "stellantis": "https://www.stellantis.com.ar",
};

export function getMarcaSitioOficial(marcaId: string): string | undefined {
  return MARCA_SITIOS_OFICIALES[marcaId];
}

export function getRepresentanteSitioOficial(representante: string): string | undefined {
  return REPRESENTANTE_SITIOS_OFICIALES[slugify(representante)];
}
