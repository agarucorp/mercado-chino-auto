/** URLs de logos (Wikimedia Commons). Si falla la carga, se usa placeholder con iniciales. */
export const MARCA_LOGO_URLS: Partial<Record<string, string>> = {
  arcfox: "/logos/arcfox-logo-1250x220-show.png",
  baic: "/logos/baic-logo.svg",
  byd: "/logos/BYD_Auto_2022_logo.svg",
  changan: "/logos/Changan-Logo-2016.png",
  chery: "/logos/Chery_logo.svg",
  dfsk: "/logos/Dongfeng_Sokon_DFSK_Logo.svg",
  faw: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/FAW_logo.svg/320px-FAW_logo.svg.png",
  foton:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Foton_Motor_logo.svg/320px-Foton_Motor_logo.svg.png",
  gac: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/GAC_Group_logo.svg/320px-GAC_Group_logo.svg.png",
  geely:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Geely_logo.svg/320px-Geely_logo.svg.png",
  gwm: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Great_Wall_Motor_logo.svg/320px-Great_Wall_Motor_logo.svg.png",
  jac: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/JAC_Motors_logo.svg/320px-JAC_Motors_logo.svg.png",
  jetour:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Jetour_logo.svg/320px-Jetour_logo.svg.png",
  jmc: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/JMC_logo.svg/320px-JMC_logo.svg.png",
  kaiyi:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Kaiyi_logo.svg/320px-Kaiyi_logo.svg.png",
  lifan:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Lifan_logo.svg/320px-Lifan_logo.svg.png",
  "lynk-and-co":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Lynk_%26_Co_logo.svg/320px-Lynk_%26_Co_logo.svg.png",
  maxus:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Maxus_logo.svg/320px-Maxus_logo.svg.png",
  mg: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/MG_Motor_logo.svg/320px-MG_Motor_logo.svg.png",
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
