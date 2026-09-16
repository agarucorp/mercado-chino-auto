/** Logos locales en /public/logos. Si no hay archivo, se usa placeholder con iniciales. */
export const MARCA_LOGO_URLS: Partial<Record<string, string>> = {
  arcfox: "/logos/arcfox-logo-1250x220-show.png",
  baic: "/logos/baic-logo.svg",
  baw: "/logos/BAW.png",
  byd: "/logos/BYD_Auto_2022_logo.svg",
  changan: "/logos/Changan-Logo-2016.png",
  chery: "/logos/Chery_logo.svg",
  deepal: "/logos/DEEPAL.png",
  dfsk: "/logos/Dongfeng_Sokon_DFSK_Logo.svg",
  dongfeng: "/logos/DONGFENG.png",
  faw: "/logos/faw.png",
  forthing: "/logos/FORTHING.png",
  foton: "/logos/FOTON.png",
  gac: "/logos/GAC.png",
  geely: "/logos/GEELY.png",
  gwm: "/logos/gwm.svg",
  hafei: "/logos/HAFEI.png",
  haima: "/logos/HAIMA.png",
  jac: "/logos/JAC.png",
  jaecoo: "/logos/JAECOO.png",
  jetour: "/logos/JETOUR.png",
  jmc: "/logos/JMC.png",
  jmev: "/logos/JMEV.avif",
  kaiyi: "/logos/KAIYI.png",
  karry: "/logos/karry.png",
  kyc: "/logos/KYC.png",
  leapmotors: "/logos/leapmotors.png",
  lifan: "/logos/lifan.webp",
  "lynk-and-co": "/logos/lynk-and-co.png",
  maxus: "/logos/MAXUS.png",
  mg: "/logos/MG.png",
  rely: "/logos/rely.png",
  shineray: "/logos/SHINERAY.png",
  skywell: "/logos/SKYWELL.png",
  xev: "/logos/xev.png",
};

export function getMarcaLogoUrl(marcaId: string): string | undefined {
  return MARCA_LOGO_URLS[marcaId];
}

export function getMarcaIniciales(nombre: string): string {
  return nombre
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}
