/**
 * Snapshot DNRPA — inscripciones iniciales (0 km).
 * Generado por scripts/build-dnrpa-ranking.mjs — no editar a mano.
 * Fuente: datos.jus.gob.ar / dataset inscripciones-iniciales-de-autos
 */
export interface DnrpaPatentamiento {
  year: number;
  marcaId: string;
  modeloId: string;
  marcaNombre: string;
  modeloNombre: string;
  cantidad: number;
}

export const DNRPA_ACTUALIZADO_AL = "2026-07";
export const DNRPA_FUENTE_URL =
  "https://datos.jus.gob.ar/dataset/inscripciones-iniciales-de-autos";
export const DNRPA_YEARS = [2024, 2025, 2026] as const;
export const DNRPA_TOTAL_INSCRIPCIONES: Record<number, number> = {"2024":416557,"2025":615157,"2026":343116};
export const DNRPA_TOTAL_CHINOS: Record<number, number> = {"2024":3454,"2025":13212,"2026":30591};

export const DNRPA_PATENTAMIENTOS: DnrpaPatentamiento[] = [
  {
    "year": 2026,
    "marcaId": "baic",
    "modeloId": "baic-bj30",
    "marcaNombre": "BAIC",
    "modeloNombre": "BJ30",
    "cantidad": 4196
  },
  {
    "year": 2026,
    "marcaId": "byd",
    "modeloId": "byd-song-pro",
    "marcaNombre": "BYD",
    "modeloNombre": "Song Pro",
    "cantidad": 2755
  },
  {
    "year": 2026,
    "marcaId": "byd",
    "modeloId": "byd-atto-2-dm-i",
    "marcaNombre": "BYD",
    "modeloNombre": "Atto 2 DM-i",
    "cantidad": 2666
  },
  {
    "year": 2026,
    "marcaId": "byd",
    "modeloId": "byd-dolphin-mini",
    "marcaNombre": "BYD",
    "modeloNombre": "Dolphin Mini",
    "cantidad": 2514
  },
  {
    "year": 2026,
    "marcaId": "chery",
    "modeloId": "chery-tiggo-7-pro-hybrid",
    "marcaNombre": "CHERY",
    "modeloNombre": "Tiggo 7 Pro Hybrid",
    "cantidad": 2052
  },
  {
    "year": 2026,
    "marcaId": "mg",
    "modeloId": "mg-mg-zs-hev",
    "marcaNombre": "MG",
    "modeloNombre": "MG ZS HEV",
    "cantidad": 1191
  },
  {
    "year": 2026,
    "marcaId": "changan",
    "modeloId": "changan-cs55-plus-phev",
    "marcaNombre": "CHANGAN",
    "modeloNombre": "CS55 Plus PHEV",
    "cantidad": 1182
  },
  {
    "year": 2026,
    "marcaId": "gwm",
    "modeloId": "gwm-haval-h6-hev",
    "marcaNombre": "GWM",
    "modeloNombre": "HAVAL H6 HEV",
    "cantidad": 1158
  },
  {
    "year": 2026,
    "marcaId": "chery",
    "modeloId": "chery-tiggo-4-hybrid",
    "marcaNombre": "CHERY",
    "modeloNombre": "Tiggo 4 Hybrid",
    "cantidad": 1047
  },
  {
    "year": 2026,
    "marcaId": "mg",
    "modeloId": "mg-mg3-hev",
    "marcaNombre": "MG",
    "modeloNombre": "MG3 HEV",
    "cantidad": 980
  },
  {
    "year": 2026,
    "marcaId": "baic",
    "modeloId": "baic-x55-ii",
    "marcaNombre": "BAIC",
    "modeloNombre": "X55 II",
    "cantidad": 841
  },
  {
    "year": 2026,
    "marcaId": "gwm",
    "modeloId": "gwm-haval-jolion",
    "marcaNombre": "GWM",
    "modeloNombre": "HAVAL Jolion",
    "cantidad": 836
  },
  {
    "year": 2026,
    "marcaId": "byd",
    "modeloId": "byd-yuan-pro",
    "marcaNombre": "BYD",
    "modeloNombre": "Yuan Pro",
    "cantidad": 824
  },
  {
    "year": 2026,
    "marcaId": "gwm",
    "modeloId": "gwm-haval-jolion-pro-hev",
    "marcaNombre": "GWM",
    "modeloNombre": "HAVAL Jolion PRO HEV",
    "cantidad": 590
  },
  {
    "year": 2026,
    "marcaId": "jetour",
    "modeloId": "jetour-t1",
    "marcaNombre": "JETOUR",
    "modeloNombre": "T1",
    "cantidad": 396
  },
  {
    "year": 2026,
    "marcaId": "byd",
    "modeloId": "byd-shark-dmo",
    "marcaNombre": "BYD",
    "modeloNombre": "Shark DMO",
    "cantidad": 389
  },
  {
    "year": 2026,
    "marcaId": "jetour",
    "modeloId": "jetour-x50",
    "marcaNombre": "JETOUR",
    "modeloNombre": "X50",
    "cantidad": 346
  },
  {
    "year": 2026,
    "marcaId": "gwm",
    "modeloId": "gwm-haval-h6-pro-hev",
    "marcaNombre": "GWM",
    "modeloNombre": "HAVAL H6 PRO HEV",
    "cantidad": 318
  },
  {
    "year": 2026,
    "marcaId": "baic",
    "modeloId": "baic-u5-plus",
    "marcaNombre": "BAIC",
    "modeloNombre": "U5 Plus",
    "cantidad": 243
  },
  {
    "year": 2026,
    "marcaId": "baic",
    "modeloId": "baic-eu-5",
    "marcaNombre": "BAIC",
    "modeloNombre": "EU 5",
    "cantidad": 217
  },
  {
    "year": 2026,
    "marcaId": "chery",
    "modeloId": "chery-arrizo-8",
    "marcaNombre": "CHERY",
    "modeloNombre": "Arrizo 8",
    "cantidad": 216
  },
  {
    "year": 2026,
    "marcaId": "jetour",
    "modeloId": "jetour-dashing",
    "marcaNombre": "JETOUR",
    "modeloNombre": "Dashing",
    "cantidad": 212
  },
  {
    "year": 2026,
    "marcaId": "baic",
    "modeloId": "baic-x35",
    "marcaNombre": "BAIC",
    "modeloNombre": "X35",
    "cantidad": 202
  },
  {
    "year": 2026,
    "marcaId": "jac",
    "modeloId": "jac-js6",
    "marcaNombre": "JAC",
    "modeloNombre": "JS6",
    "cantidad": 197
  },
  {
    "year": 2026,
    "marcaId": "baic",
    "modeloId": "baic-bj40",
    "marcaNombre": "BAIC",
    "modeloNombre": "BJ40",
    "cantidad": 195
  },
  {
    "year": 2026,
    "marcaId": "foton",
    "modeloId": "foton-tunland-g7",
    "marcaNombre": "FOTON",
    "modeloNombre": "Tunland G7",
    "cantidad": 185
  },
  {
    "year": 2026,
    "marcaId": "jac",
    "modeloId": "jac-js2",
    "marcaNombre": "JAC",
    "modeloNombre": "JS2",
    "cantidad": 182
  },
  {
    "year": 2026,
    "marcaId": "chery",
    "modeloId": "chery-tiggo-2-pro-max",
    "marcaNombre": "CHERY",
    "modeloNombre": "Tiggo 2 Pro Max",
    "cantidad": 181
  },
  {
    "year": 2026,
    "marcaId": "jmev",
    "modeloId": "jmev-easy-3",
    "marcaNombre": "JMEV",
    "modeloNombre": "Easy 3",
    "cantidad": 171
  },
  {
    "year": 2026,
    "marcaId": "gac",
    "modeloId": "gac-emkoo-hybrid",
    "marcaNombre": "GAC",
    "modeloNombre": "Emkoo Hybrid",
    "cantidad": 162
  },
  {
    "year": 2026,
    "marcaId": "foton",
    "modeloId": "foton-tunland-v9",
    "marcaNombre": "FOTON",
    "modeloNombre": "Tunland V9",
    "cantidad": 137
  },
  {
    "year": 2026,
    "marcaId": "byd",
    "modeloId": "byd-seal-u-dm-i",
    "marcaNombre": "BYD",
    "modeloNombre": "Seal U DM-i",
    "cantidad": 126
  },
  {
    "year": 2026,
    "marcaId": "jac",
    "modeloId": "jac-js4",
    "marcaNombre": "JAC",
    "modeloNombre": "JS4",
    "cantidad": 121
  },
  {
    "year": 2026,
    "marcaId": "jmc",
    "modeloId": "jmc-grand-avenue",
    "marcaNombre": "JMC",
    "modeloNombre": "Grand Avenue",
    "cantidad": 117
  },
  {
    "year": 2026,
    "marcaId": "gwm",
    "modeloId": "gwm-haval-h6-gt",
    "marcaNombre": "GWM",
    "modeloNombre": "HAVAL H6 GT",
    "cantidad": 92
  },
  {
    "year": 2026,
    "marcaId": "chery",
    "modeloId": "chery-tiggo-8-pro",
    "marcaNombre": "CHERY",
    "modeloNombre": "Tiggo 8 Pro",
    "cantidad": 80
  },
  {
    "year": 2026,
    "marcaId": "geely",
    "modeloId": "geely-ex5",
    "marcaNombre": "GEELY",
    "modeloNombre": "EX5",
    "cantidad": 75
  },
  {
    "year": 2026,
    "marcaId": "jac",
    "modeloId": "jac-js8",
    "marcaNombre": "JAC",
    "modeloNombre": "JS8",
    "cantidad": 65
  },
  {
    "year": 2026,
    "marcaId": "arcfox",
    "modeloId": "arcfox-t1",
    "marcaNombre": "ARCFOX",
    "modeloNombre": "T1",
    "cantidad": 55
  },
  {
    "year": 2026,
    "marcaId": "jetour",
    "modeloId": "jetour-x70-plus",
    "marcaNombre": "JETOUR",
    "modeloNombre": "X70 Plus",
    "cantidad": 53
  },
  {
    "year": 2026,
    "marcaId": "gwm",
    "modeloId": "gwm-haval-h6",
    "marcaNombre": "GWM",
    "modeloNombre": "HAVAL H6",
    "cantidad": 51
  },
  {
    "year": 2026,
    "marcaId": "dfsk",
    "modeloId": "dfsk-e5-phev",
    "marcaNombre": "DFSK",
    "modeloNombre": "E5 PHEV",
    "cantidad": 48
  },
  {
    "year": 2026,
    "marcaId": "forthing",
    "modeloId": "forthing-t5-hev",
    "marcaNombre": "FORTHING",
    "modeloNombre": "T5 HEV",
    "cantidad": 47
  },
  {
    "year": 2026,
    "marcaId": "dfsk",
    "modeloId": "dfsk-e5-plus",
    "marcaNombre": "DFSK",
    "modeloNombre": "E5 Plus",
    "cantidad": 46
  },
  {
    "year": 2026,
    "marcaId": "gwm",
    "modeloId": "gwm-tank-300",
    "marcaNombre": "GWM",
    "modeloNombre": "TANK 300",
    "cantidad": 45
  },
  {
    "year": 2026,
    "marcaId": "gwm",
    "modeloId": "gwm-ora-03",
    "marcaNombre": "GWM",
    "modeloNombre": "ORA 03",
    "cantidad": 43
  },
  {
    "year": 2026,
    "marcaId": "jac",
    "modeloId": "jac-t8",
    "marcaNombre": "JAC",
    "modeloNombre": "T8",
    "cantidad": 42
  },
  {
    "year": 2026,
    "marcaId": "arcfox",
    "modeloId": "arcfox-t5",
    "marcaNombre": "ARCFOX",
    "modeloNombre": "T5",
    "cantidad": 42
  },
  {
    "year": 2026,
    "marcaId": "jetour",
    "modeloId": "jetour-x70",
    "marcaNombre": "JETOUR",
    "modeloNombre": "X70",
    "cantidad": 41
  },
  {
    "year": 2026,
    "marcaId": "dfsk",
    "modeloId": "dfsk-glory-580",
    "marcaNombre": "DFSK",
    "modeloNombre": "Glory 580",
    "cantidad": 40
  },
  {
    "year": 2026,
    "marcaId": "baic",
    "modeloId": "baic-bj60",
    "marcaNombre": "BAIC",
    "modeloNombre": "BJ60",
    "cantidad": 38
  },
  {
    "year": 2026,
    "marcaId": "maxus",
    "modeloId": "maxus-t60",
    "marcaNombre": "MAXUS",
    "modeloNombre": "T60",
    "cantidad": 35
  },
  {
    "year": 2026,
    "marcaId": "jetour",
    "modeloId": "jetour-t2",
    "marcaNombre": "JETOUR",
    "modeloNombre": "T2",
    "cantidad": 33
  },
  {
    "year": 2026,
    "marcaId": "kaiyi",
    "modeloId": "kaiyi-x7",
    "marcaNombre": "KAIYI",
    "modeloNombre": "X7",
    "cantidad": 32
  },
  {
    "year": 2026,
    "marcaId": "dongfeng",
    "modeloId": "dongfeng-mage",
    "marcaNombre": "DONGFENG",
    "modeloNombre": "Mage",
    "cantidad": 31
  },
  {
    "year": 2026,
    "marcaId": "lepamotors",
    "modeloId": "lepamotors-b10",
    "marcaNombre": "LEPAMOTORS",
    "modeloNombre": "B10",
    "cantidad": 29
  },
  {
    "year": 2026,
    "marcaId": "dfsk",
    "modeloId": "dfsk-glory-500",
    "marcaNombre": "DFSK",
    "modeloNombre": "Glory 500",
    "cantidad": 28
  },
  {
    "year": 2026,
    "marcaId": "forthing",
    "modeloId": "forthing-t5",
    "marcaNombre": "FORTHING",
    "modeloNombre": "T5",
    "cantidad": 25
  },
  {
    "year": 2026,
    "marcaId": "forthing",
    "modeloId": "forthing-t5-evo",
    "marcaNombre": "FORTHING",
    "modeloNombre": "T5 EVO",
    "cantidad": 23
  },
  {
    "year": 2026,
    "marcaId": "gac",
    "modeloId": "gac-aion-empow",
    "marcaNombre": "GAC",
    "modeloNombre": "Aion Empow",
    "cantidad": 21
  },
  {
    "year": 2026,
    "marcaId": "lepamotors",
    "modeloId": "lepamotors-c10",
    "marcaNombre": "LEPAMOTORS",
    "modeloNombre": "C10",
    "cantidad": 19
  },
  {
    "year": 2026,
    "marcaId": "forthing",
    "modeloId": "forthing-friday-reev",
    "marcaNombre": "FORTHING",
    "modeloNombre": "Friday REEV",
    "cantidad": 18
  },
  {
    "year": 2026,
    "marcaId": "dongfeng",
    "modeloId": "dongfeng-huge",
    "marcaNombre": "DONGFENG",
    "modeloNombre": "Huge",
    "cantidad": 18
  },
  {
    "year": 2026,
    "marcaId": "arcfox",
    "modeloId": "arcfox-s5",
    "marcaNombre": "ARCFOX",
    "modeloNombre": "S5",
    "cantidad": 17
  },
  {
    "year": 2026,
    "marcaId": "lynk-and-co",
    "modeloId": "lynk-and-co-01",
    "marcaNombre": "LYNK & CO",
    "modeloNombre": "01",
    "cantidad": 17
  },
  {
    "year": 2026,
    "marcaId": "kaiyi",
    "modeloId": "kaiyi-x3",
    "marcaNombre": "KAIYI",
    "modeloNombre": "X3",
    "cantidad": 16
  },
  {
    "year": 2026,
    "marcaId": "gac",
    "modeloId": "gac-gs8",
    "marcaNombre": "GAC",
    "modeloNombre": "GS8",
    "cantidad": 16
  },
  {
    "year": 2026,
    "marcaId": "xev",
    "modeloId": "xev-yoyo-pro",
    "marcaNombre": "XEV",
    "modeloNombre": "YOYO PRO",
    "cantidad": 16
  },
  {
    "year": 2026,
    "marcaId": "jac",
    "modeloId": "jac-ev30x",
    "marcaNombre": "JAC",
    "modeloNombre": "EV30X",
    "cantidad": 15
  },
  {
    "year": 2026,
    "marcaId": "forthing",
    "modeloId": "forthing-u-tour",
    "marcaNombre": "FORTHING",
    "modeloNombre": "U-Tour",
    "cantidad": 12
  },
  {
    "year": 2026,
    "marcaId": "gac",
    "modeloId": "gac-gs3-emzoom",
    "marcaNombre": "GAC",
    "modeloNombre": "GS3 Emzoom",
    "cantidad": 11
  },
  {
    "year": 2026,
    "marcaId": "jac",
    "modeloId": "jac-t6",
    "marcaNombre": "JAC",
    "modeloNombre": "T6",
    "cantidad": 11
  },
  {
    "year": 2026,
    "marcaId": "arcfox",
    "modeloId": "arcfox-kaola-s",
    "marcaNombre": "ARCFOX",
    "modeloNombre": "Kaola S",
    "cantidad": 9
  },
  {
    "year": 2026,
    "marcaId": "dongfeng",
    "modeloId": "dongfeng-box",
    "marcaNombre": "DONGFENG",
    "modeloNombre": "Box",
    "cantidad": 9
  },
  {
    "year": 2026,
    "marcaId": "gwm",
    "modeloId": "gwm-poer-elite",
    "marcaNombre": "GWM",
    "modeloNombre": "Poer Elite",
    "cantidad": 7
  },
  {
    "year": 2026,
    "marcaId": "kaiyi",
    "modeloId": "kaiyi-x3-pro",
    "marcaNombre": "KAIYI",
    "modeloNombre": "X3 PRO",
    "cantidad": 7
  },
  {
    "year": 2026,
    "marcaId": "rely",
    "modeloId": "rely-r8",
    "marcaNombre": "RELY",
    "modeloNombre": "R8",
    "cantidad": 7
  },
  {
    "year": 2026,
    "marcaId": "forthing",
    "modeloId": "forthing-u-tour-hybrid",
    "marcaNombre": "FORTHING",
    "modeloNombre": "U-Tour Hybrid",
    "cantidad": 5
  },
  {
    "year": 2026,
    "marcaId": "maxus",
    "modeloId": "maxus-d90",
    "marcaNombre": "MAXUS",
    "modeloNombre": "D90",
    "cantidad": 4
  },
  {
    "year": 2026,
    "marcaId": "gwm",
    "modeloId": "gwm-poer",
    "marcaNombre": "GWM",
    "modeloNombre": "Poer",
    "cantidad": 4
  },
  {
    "year": 2026,
    "marcaId": "gwm",
    "modeloId": "gwm-haval-h2",
    "marcaNombre": "GWM",
    "modeloNombre": "HAVAL H2",
    "cantidad": 3
  },
  {
    "year": 2026,
    "marcaId": "chery",
    "modeloId": "chery-tiggo-5",
    "marcaNombre": "CHERY",
    "modeloNombre": "Tiggo 5",
    "cantidad": 3
  },
  {
    "year": 2026,
    "marcaId": "lynk-and-co",
    "modeloId": "lynk-and-co-06",
    "marcaNombre": "LYNK & CO",
    "modeloNombre": "06",
    "cantidad": 3
  },
  {
    "year": 2026,
    "marcaId": "lynk-and-co",
    "modeloId": "lynk-and-co-08",
    "marcaNombre": "LYNK & CO",
    "modeloNombre": "08",
    "cantidad": 3
  },
  {
    "year": 2026,
    "marcaId": "chery",
    "modeloId": "chery-tiggo",
    "marcaNombre": "CHERY",
    "modeloNombre": "Tiggo",
    "cantidad": 2
  },
  {
    "year": 2026,
    "marcaId": "skywell",
    "modeloId": "skywell-et5",
    "marcaNombre": "SKYWELL",
    "modeloNombre": "ET5",
    "cantidad": 2
  },
  {
    "year": 2026,
    "marcaId": "maxus",
    "modeloId": "maxus-t90",
    "marcaNombre": "MAXUS",
    "modeloNombre": "T90",
    "cantidad": 1
  },
  {
    "year": 2026,
    "marcaId": "foton",
    "modeloId": "foton-tunland-luxury",
    "marcaNombre": "FOTON",
    "modeloNombre": "Tunland Luxury",
    "cantidad": 1
  },
  {
    "year": 2026,
    "marcaId": "geely",
    "modeloId": "geely-emgrand-gs",
    "marcaNombre": "GEELY",
    "modeloNombre": "Emgrand GS",
    "cantidad": 1
  },
  {
    "year": 2026,
    "marcaId": "gac",
    "modeloId": "gac-aion-es",
    "marcaNombre": "GAC",
    "modeloNombre": "Aion ES",
    "cantidad": 1
  },
  {
    "year": 2026,
    "marcaId": "foton",
    "modeloId": "foton-tunland-v7",
    "marcaNombre": "FOTON",
    "modeloNombre": "Tunland V7",
    "cantidad": 1
  },
  {
    "year": 2025,
    "marcaId": "baic",
    "modeloId": "baic-bj30",
    "marcaNombre": "BAIC",
    "modeloNombre": "BJ30",
    "cantidad": 2247
  },
  {
    "year": 2025,
    "marcaId": "baic",
    "modeloId": "baic-x55-ii",
    "marcaNombre": "BAIC",
    "modeloNombre": "X55 II",
    "cantidad": 1480
  },
  {
    "year": 2025,
    "marcaId": "gwm",
    "modeloId": "gwm-haval-h6-hev",
    "marcaNombre": "GWM",
    "modeloNombre": "HAVAL H6 HEV",
    "cantidad": 984
  },
  {
    "year": 2025,
    "marcaId": "gwm",
    "modeloId": "gwm-haval-jolion-pro-hev",
    "marcaNombre": "GWM",
    "modeloNombre": "HAVAL Jolion PRO HEV",
    "cantidad": 964
  },
  {
    "year": 2025,
    "marcaId": "chery",
    "modeloId": "chery-tiggo-4-hybrid",
    "marcaNombre": "CHERY",
    "modeloNombre": "Tiggo 4 Hybrid",
    "cantidad": 701
  },
  {
    "year": 2025,
    "marcaId": "baic",
    "modeloId": "baic-x35",
    "marcaNombre": "BAIC",
    "modeloNombre": "X35",
    "cantidad": 449
  },
  {
    "year": 2025,
    "marcaId": "gwm",
    "modeloId": "gwm-haval-jolion",
    "marcaNombre": "GWM",
    "modeloNombre": "HAVAL Jolion",
    "cantidad": 419
  },
  {
    "year": 2025,
    "marcaId": "jac",
    "modeloId": "jac-js2",
    "marcaNombre": "JAC",
    "modeloNombre": "JS2",
    "cantidad": 326
  },
  {
    "year": 2025,
    "marcaId": "byd",
    "modeloId": "byd-song-pro",
    "marcaNombre": "BYD",
    "modeloNombre": "Song Pro",
    "cantidad": 326
  },
  {
    "year": 2025,
    "marcaId": "jac",
    "modeloId": "jac-js4",
    "marcaNombre": "JAC",
    "modeloNombre": "JS4",
    "cantidad": 287
  },
  {
    "year": 2025,
    "marcaId": "jetour",
    "modeloId": "jetour-dashing",
    "marcaNombre": "JETOUR",
    "modeloNombre": "Dashing",
    "cantidad": 216
  },
  {
    "year": 2025,
    "marcaId": "chery",
    "modeloId": "chery-tiggo-7-pro-hybrid",
    "marcaNombre": "CHERY",
    "modeloNombre": "Tiggo 7 Pro Hybrid",
    "cantidad": 200
  },
  {
    "year": 2025,
    "marcaId": "baic",
    "modeloId": "baic-u5-plus",
    "marcaNombre": "BAIC",
    "modeloNombre": "U5 Plus",
    "cantidad": 195
  },
  {
    "year": 2025,
    "marcaId": "byd",
    "modeloId": "byd-dolphin-mini",
    "marcaNombre": "BYD",
    "modeloNombre": "Dolphin Mini",
    "cantidad": 175
  },
  {
    "year": 2025,
    "marcaId": "byd",
    "modeloId": "byd-yuan-pro",
    "marcaNombre": "BYD",
    "modeloNombre": "Yuan Pro",
    "cantidad": 169
  },
  {
    "year": 2025,
    "marcaId": "mg",
    "modeloId": "mg-mg-zs-hev",
    "marcaNombre": "MG",
    "modeloNombre": "MG ZS HEV",
    "cantidad": 143
  },
  {
    "year": 2025,
    "marcaId": "mg",
    "modeloId": "mg-mg3-hev",
    "marcaNombre": "MG",
    "modeloNombre": "MG3 HEV",
    "cantidad": 132
  },
  {
    "year": 2025,
    "marcaId": "jac",
    "modeloId": "jac-js8",
    "marcaNombre": "JAC",
    "modeloNombre": "JS8",
    "cantidad": 122
  },
  {
    "year": 2025,
    "marcaId": "gwm",
    "modeloId": "gwm-haval-h2",
    "marcaNombre": "GWM",
    "modeloNombre": "HAVAL H2",
    "cantidad": 118
  },
  {
    "year": 2025,
    "marcaId": "baic",
    "modeloId": "baic-bj40",
    "marcaNombre": "BAIC",
    "modeloNombre": "BJ40",
    "cantidad": 118
  },
  {
    "year": 2025,
    "marcaId": "gwm",
    "modeloId": "gwm-haval-h6-gt",
    "marcaNombre": "GWM",
    "modeloNombre": "HAVAL H6 GT",
    "cantidad": 94
  },
  {
    "year": 2025,
    "marcaId": "jetour",
    "modeloId": "jetour-x70",
    "marcaNombre": "JETOUR",
    "modeloNombre": "X70",
    "cantidad": 82
  },
  {
    "year": 2025,
    "marcaId": "dfsk",
    "modeloId": "dfsk-glory-580",
    "marcaNombre": "DFSK",
    "modeloNombre": "Glory 580",
    "cantidad": 80
  },
  {
    "year": 2025,
    "marcaId": "foton",
    "modeloId": "foton-tunland-g7",
    "marcaNombre": "FOTON",
    "modeloNombre": "Tunland G7",
    "cantidad": 78
  },
  {
    "year": 2025,
    "marcaId": "foton",
    "modeloId": "foton-tunland-v9",
    "marcaNombre": "FOTON",
    "modeloNombre": "Tunland V9",
    "cantidad": 64
  },
  {
    "year": 2025,
    "marcaId": "jetour",
    "modeloId": "jetour-x70-plus",
    "marcaNombre": "JETOUR",
    "modeloNombre": "X70 Plus",
    "cantidad": 63
  },
  {
    "year": 2025,
    "marcaId": "baic",
    "modeloId": "baic-bj60",
    "marcaNombre": "BAIC",
    "modeloNombre": "BJ60",
    "cantidad": 52
  },
  {
    "year": 2025,
    "marcaId": "gwm",
    "modeloId": "gwm-haval-h6",
    "marcaNombre": "GWM",
    "modeloNombre": "HAVAL H6",
    "cantidad": 51
  },
  {
    "year": 2025,
    "marcaId": "jmc",
    "modeloId": "jmc-grand-avenue",
    "marcaNombre": "JMC",
    "modeloNombre": "Grand Avenue",
    "cantidad": 49
  },
  {
    "year": 2025,
    "marcaId": "dfsk",
    "modeloId": "dfsk-glory-500",
    "marcaNombre": "DFSK",
    "modeloNombre": "Glory 500",
    "cantidad": 42
  },
  {
    "year": 2025,
    "marcaId": "baic",
    "modeloId": "baic-eu-5",
    "marcaNombre": "BAIC",
    "modeloNombre": "EU 5",
    "cantidad": 40
  },
  {
    "year": 2025,
    "marcaId": "gwm",
    "modeloId": "gwm-ora-03",
    "marcaNombre": "GWM",
    "modeloNombre": "ORA 03",
    "cantidad": 36
  },
  {
    "year": 2025,
    "marcaId": "jetour",
    "modeloId": "jetour-t1",
    "marcaNombre": "JETOUR",
    "modeloNombre": "T1",
    "cantidad": 36
  },
  {
    "year": 2025,
    "marcaId": "kaiyi",
    "modeloId": "kaiyi-x3",
    "marcaNombre": "KAIYI",
    "modeloNombre": "X3",
    "cantidad": 35
  },
  {
    "year": 2025,
    "marcaId": "gwm",
    "modeloId": "gwm-poer-elite",
    "marcaNombre": "GWM",
    "modeloNombre": "Poer Elite",
    "cantidad": 30
  },
  {
    "year": 2025,
    "marcaId": "gwm",
    "modeloId": "gwm-poer",
    "marcaNombre": "GWM",
    "modeloNombre": "Poer",
    "cantidad": 23
  },
  {
    "year": 2025,
    "marcaId": "chery",
    "modeloId": "chery-tiggo-8-pro",
    "marcaNombre": "CHERY",
    "modeloNombre": "Tiggo 8 Pro",
    "cantidad": 21
  },
  {
    "year": 2025,
    "marcaId": "jac",
    "modeloId": "jac-t6",
    "marcaNombre": "JAC",
    "modeloNombre": "T6",
    "cantidad": 21
  },
  {
    "year": 2025,
    "marcaId": "dfsk",
    "modeloId": "dfsk-e5-phev",
    "marcaNombre": "DFSK",
    "modeloNombre": "E5 PHEV",
    "cantidad": 21
  },
  {
    "year": 2025,
    "marcaId": "chery",
    "modeloId": "chery-tiggo-2-pro-max",
    "marcaNombre": "CHERY",
    "modeloNombre": "Tiggo 2 Pro Max",
    "cantidad": 19
  },
  {
    "year": 2025,
    "marcaId": "jetour",
    "modeloId": "jetour-x50",
    "marcaNombre": "JETOUR",
    "modeloNombre": "X50",
    "cantidad": 18
  },
  {
    "year": 2025,
    "marcaId": "gwm",
    "modeloId": "gwm-tank-300",
    "marcaNombre": "GWM",
    "modeloNombre": "TANK 300",
    "cantidad": 16
  },
  {
    "year": 2025,
    "marcaId": "changan",
    "modeloId": "changan-cs55-plus-phev",
    "marcaNombre": "CHANGAN",
    "modeloNombre": "CS55 Plus PHEV",
    "cantidad": 16
  },
  {
    "year": 2025,
    "marcaId": "jetour",
    "modeloId": "jetour-t2",
    "marcaNombre": "JETOUR",
    "modeloNombre": "T2",
    "cantidad": 13
  },
  {
    "year": 2025,
    "marcaId": "jac",
    "modeloId": "jac-js6",
    "marcaNombre": "JAC",
    "modeloNombre": "JS6",
    "cantidad": 10
  },
  {
    "year": 2025,
    "marcaId": "gac",
    "modeloId": "gac-emkoo-hybrid",
    "marcaNombre": "GAC",
    "modeloNombre": "Emkoo Hybrid",
    "cantidad": 5
  },
  {
    "year": 2025,
    "marcaId": "chery",
    "modeloId": "chery-tiggo-5",
    "marcaNombre": "CHERY",
    "modeloNombre": "Tiggo 5",
    "cantidad": 4
  },
  {
    "year": 2025,
    "marcaId": "xev",
    "modeloId": "xev-yoyo-pro",
    "marcaNombre": "XEV",
    "modeloNombre": "YOYO PRO",
    "cantidad": 4
  },
  {
    "year": 2025,
    "marcaId": "skywell",
    "modeloId": "skywell-be11",
    "marcaNombre": "SKYWELL",
    "modeloNombre": "BE11",
    "cantidad": 3
  },
  {
    "year": 2025,
    "marcaId": "chery",
    "modeloId": "chery-qq",
    "marcaNombre": "CHERY",
    "modeloNombre": "QQ",
    "cantidad": 3
  },
  {
    "year": 2025,
    "marcaId": "gac",
    "modeloId": "gac-gs8",
    "marcaNombre": "GAC",
    "modeloNombre": "GS8",
    "cantidad": 3
  },
  {
    "year": 2025,
    "marcaId": "faw",
    "modeloId": "faw-t33",
    "marcaNombre": "FAW",
    "modeloNombre": "T33",
    "cantidad": 2
  },
  {
    "year": 2025,
    "marcaId": "arcfox",
    "modeloId": "arcfox-t5",
    "marcaNombre": "ARCFOX",
    "modeloNombre": "T5",
    "cantidad": 2
  },
  {
    "year": 2025,
    "marcaId": "jac",
    "modeloId": "jac-t8",
    "marcaNombre": "JAC",
    "modeloNombre": "T8",
    "cantidad": 2
  },
  {
    "year": 2025,
    "marcaId": "kaiyi",
    "modeloId": "kaiyi-x7",
    "marcaNombre": "KAIYI",
    "modeloNombre": "X7",
    "cantidad": 1
  },
  {
    "year": 2025,
    "marcaId": "chery",
    "modeloId": "chery-fulwin",
    "marcaNombre": "CHERY",
    "modeloNombre": "Fulwin",
    "cantidad": 1
  },
  {
    "year": 2025,
    "marcaId": "jac",
    "modeloId": "jac-ev30x",
    "marcaNombre": "JAC",
    "modeloNombre": "EV30X",
    "cantidad": 1
  },
  {
    "year": 2025,
    "marcaId": "gac",
    "modeloId": "gac-gs3-emzoom",
    "marcaNombre": "GAC",
    "modeloNombre": "GS3 Emzoom",
    "cantidad": 1
  },
  {
    "year": 2025,
    "marcaId": "maxus",
    "modeloId": "maxus-t90",
    "marcaNombre": "MAXUS",
    "modeloNombre": "T90",
    "cantidad": 1
  },
  {
    "year": 2025,
    "marcaId": "jmev",
    "modeloId": "jmev-easy-3",
    "marcaNombre": "JMEV",
    "modeloNombre": "Easy 3",
    "cantidad": 1
  },
  {
    "year": 2024,
    "marcaId": "baic",
    "modeloId": "baic-x55-ii",
    "marcaNombre": "BAIC",
    "modeloNombre": "X55 II",
    "cantidad": 468
  },
  {
    "year": 2024,
    "marcaId": "chery",
    "modeloId": "chery-tiggo-4-hybrid",
    "marcaNombre": "CHERY",
    "modeloNombre": "Tiggo 4 Hybrid",
    "cantidad": 376
  },
  {
    "year": 2024,
    "marcaId": "baic",
    "modeloId": "baic-x35",
    "marcaNombre": "BAIC",
    "modeloNombre": "X35",
    "cantidad": 257
  },
  {
    "year": 2024,
    "marcaId": "gwm",
    "modeloId": "gwm-haval-jolion",
    "marcaNombre": "GWM",
    "modeloNombre": "HAVAL Jolion",
    "cantidad": 165
  },
  {
    "year": 2024,
    "marcaId": "chery",
    "modeloId": "chery-tiggo-5",
    "marcaNombre": "CHERY",
    "modeloNombre": "Tiggo 5",
    "cantidad": 118
  },
  {
    "year": 2024,
    "marcaId": "gwm",
    "modeloId": "gwm-haval-h6",
    "marcaNombre": "GWM",
    "modeloNombre": "HAVAL H6",
    "cantidad": 62
  },
  {
    "year": 2024,
    "marcaId": "jac",
    "modeloId": "jac-js2",
    "marcaNombre": "JAC",
    "modeloNombre": "JS2",
    "cantidad": 60
  },
  {
    "year": 2024,
    "marcaId": "dfsk",
    "modeloId": "dfsk-glory-580",
    "marcaNombre": "DFSK",
    "modeloNombre": "Glory 580",
    "cantidad": 48
  },
  {
    "year": 2024,
    "marcaId": "gwm",
    "modeloId": "gwm-haval-h2",
    "marcaNombre": "GWM",
    "modeloNombre": "HAVAL H2",
    "cantidad": 46
  },
  {
    "year": 2024,
    "marcaId": "gwm",
    "modeloId": "gwm-poer",
    "marcaNombre": "GWM",
    "modeloNombre": "Poer",
    "cantidad": 43
  },
  {
    "year": 2024,
    "marcaId": "jetour",
    "modeloId": "jetour-x70",
    "marcaNombre": "JETOUR",
    "modeloNombre": "X70",
    "cantidad": 40
  },
  {
    "year": 2024,
    "marcaId": "baic",
    "modeloId": "baic-bj40",
    "marcaNombre": "BAIC",
    "modeloNombre": "BJ40",
    "cantidad": 34
  },
  {
    "year": 2024,
    "marcaId": "jac",
    "modeloId": "jac-t6",
    "marcaNombre": "JAC",
    "modeloNombre": "T6",
    "cantidad": 33
  },
  {
    "year": 2024,
    "marcaId": "chery",
    "modeloId": "chery-tiggo-8-pro",
    "marcaNombre": "CHERY",
    "modeloNombre": "Tiggo 8 Pro",
    "cantidad": 32
  },
  {
    "year": 2024,
    "marcaId": "chery",
    "modeloId": "chery-tiggo-2-pro-max",
    "marcaNombre": "CHERY",
    "modeloNombre": "Tiggo 2 Pro Max",
    "cantidad": 31
  },
  {
    "year": 2024,
    "marcaId": "faw",
    "modeloId": "faw-t33",
    "marcaNombre": "FAW",
    "modeloNombre": "T33",
    "cantidad": 22
  },
  {
    "year": 2024,
    "marcaId": "jetour",
    "modeloId": "jetour-dashing",
    "marcaNombre": "JETOUR",
    "modeloNombre": "Dashing",
    "cantidad": 19
  },
  {
    "year": 2024,
    "marcaId": "baic",
    "modeloId": "baic-eu-5",
    "marcaNombre": "BAIC",
    "modeloNombre": "EU 5",
    "cantidad": 15
  },
  {
    "year": 2024,
    "marcaId": "jetour",
    "modeloId": "jetour-x70-plus",
    "marcaNombre": "JETOUR",
    "modeloNombre": "X70 Plus",
    "cantidad": 11
  },
  {
    "year": 2024,
    "marcaId": "gwm",
    "modeloId": "gwm-haval-h6-gt",
    "marcaNombre": "GWM",
    "modeloNombre": "HAVAL H6 GT",
    "cantidad": 9
  },
  {
    "year": 2024,
    "marcaId": "gwm",
    "modeloId": "gwm-poer-elite",
    "marcaNombre": "GWM",
    "modeloNombre": "Poer Elite",
    "cantidad": 7
  },
  {
    "year": 2024,
    "marcaId": "skywell",
    "modeloId": "skywell-et5",
    "marcaNombre": "SKYWELL",
    "modeloNombre": "ET5",
    "cantidad": 5
  },
  {
    "year": 2024,
    "marcaId": "chery",
    "modeloId": "chery-tiggo",
    "marcaNombre": "CHERY",
    "modeloNombre": "Tiggo",
    "cantidad": 2
  },
  {
    "year": 2024,
    "marcaId": "faw",
    "modeloId": "faw-x40",
    "marcaNombre": "FAW",
    "modeloNombre": "X40",
    "cantidad": 2
  },
  {
    "year": 2024,
    "marcaId": "lifan",
    "modeloId": "lifan-myway",
    "marcaNombre": "LIFAN",
    "modeloNombre": "MyWay",
    "cantidad": 1
  },
  {
    "year": 2024,
    "marcaId": "chery",
    "modeloId": "chery-arrizo-5",
    "marcaNombre": "CHERY",
    "modeloNombre": "Arrizo 5",
    "cantidad": 1
  },
  {
    "year": 2024,
    "marcaId": "kaiyi",
    "modeloId": "kaiyi-x3",
    "marcaNombre": "KAIYI",
    "modeloNombre": "X3",
    "cantidad": 1
  },
  {
    "year": 2024,
    "marcaId": "shineray",
    "modeloId": "shineray-swm-x7",
    "marcaNombre": "SHINERAY",
    "modeloNombre": "SWM X7",
    "cantidad": 1
  },
  {
    "year": 2024,
    "marcaId": "shineray",
    "modeloId": "shineray-swm-g01",
    "marcaNombre": "SHINERAY",
    "modeloNombre": "SWM G01",
    "cantidad": 1
  },
  {
    "year": 2024,
    "marcaId": "jac",
    "modeloId": "jac-t9",
    "marcaNombre": "JAC",
    "modeloNombre": "T9",
    "cantidad": 1
  },
  {
    "year": 2024,
    "marcaId": "jac",
    "modeloId": "jac-t8",
    "marcaNombre": "JAC",
    "modeloNombre": "T8",
    "cantidad": 1
  },
  {
    "year": 2024,
    "marcaId": "baic",
    "modeloId": "baic-u5-plus",
    "marcaNombre": "BAIC",
    "modeloNombre": "U5 Plus",
    "cantidad": 1
  },
  {
    "year": 2024,
    "marcaId": "chery",
    "modeloId": "chery-qq",
    "marcaNombre": "CHERY",
    "modeloNombre": "QQ",
    "cantidad": 1
  },
  {
    "year": 2024,
    "marcaId": "baic",
    "modeloId": "baic-bj60",
    "marcaNombre": "BAIC",
    "modeloNombre": "BJ60",
    "cantidad": 1
  }
];
