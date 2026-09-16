export interface FichaTecnicaRow {
  label: string;
  value: string;
}

const IMAGENES: Record<string, string> = {
  "arcfox-t1": "/ARCFOX/models/alpha-t1.png",
  "arcfox-kaola-s": "/ARCFOX/models/kaola-s.png",
  "arcfox-t5": "/ARCFOX/models/alpha-t5.png",
  "arcfox-s5": "/ARCFOX/models/alpha-s5.png",
  "byd-dolphin-mini":
    "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=500&fit=crop",
  "byd-song-pro":
    "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=500&fit=crop",
  "byd-atto-2-dm-i":
    "https://images.unsplash.com/photo-1619767886555-ef3f88941f8b?w=800&h=500&fit=crop",
  "byd-seal-u-dm-i":
    "https://images.unsplash.com/photo-1614200179396-2bdb4ebf37b3?w=800&h=500&fit=crop",
  "chery-tiggo-8-pro":
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=500&fit=crop",
  "chery-tiggo-7-pro-hybrid":
    "https://images.unsplash.com/photo-1519641471654-76cebc7f6450?w=800&h=500&fit=crop",
  "chery-tiggo-4-hybrid":
    "https://images.unsplash.com/photo-1609521263047-f8f205293bb0?w=800&h=500&fit=crop",
  "gwm-haval-h6":
    "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=500&fit=crop",
  "gwm-ora-03":
    "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=500&fit=crop",
  "gwm-tank-300":
    "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=500&fit=crop",
  "geely-ex5":
    "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=500&fit=crop",
  "jac-t8":
    "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=500&fit=crop",
  "jac-js2":
    "https://images.unsplash.com/photo-1609521263047-f8f205293bb0?w=800&h=500&fit=crop",
};

/** Orden fijo de ficha técnica (catálogo). */
function ft(
  modelo: string,
  precio: string,
  vigencia: string,
  motor: string,
  transmision: string,
  potencia: string,
  consumo: string,
  seguridad: string,
  autonomia: string,
): FichaTecnicaRow[] {
  return [
    { label: "Modelo", value: modelo },
    { label: "Precio", value: precio },
    { label: "Vigencia", value: vigencia },
    { label: "Tipo de motor", value: motor },
    { label: "Transmisión", value: transmision },
    { label: "Potencia", value: potencia },
    { label: "Consumo", value: consumo },
    { label: "Seguridad", value: seguridad },
    { label: "Autonomía", value: autonomia },
  ];
}

const FICHAS: Record<string, FichaTecnicaRow[]> = {
  "arcfox-t1": ft("T1", "USD 29.500", "2026-vigente", "Eléctrico", "Automática", "95 CV", "14-15 kWh/100 km", "6 airbags, ESP, ADAS, AEB, ISOFIX", "310 km"),
  "arcfox-kaola-s": ft("Kaola S", "USD 27.200", "2026-vigente", "Eléctrico", "Automática", "160 CV", "14-16 kWh/100 km", "6 airbags, ESP, ADAS, ISOFIX", "500 km"),
  "arcfox-t5": ft("T5", "USD 39.600", "2026-vigente", "Eléctrico", "Automática", "272 CV", "15-16 kWh/100 km", "6 airbags, ADAS nivel 2, AEB, ISOFIX", "520 km"),
  "arcfox-s5": ft("S5", "USD 39.800", "2026-vigente", "Eléctrico", "Automática", "530 CV", "13-15 kWh/100 km", "6 airbags, ADAS nivel 2+, AEB, ISOFIX", "560 km"),

  "baic-x25-ex260": ft("X25 / EX260", "Usado desde USD 9.500", "2018-2021", "Naftero 1.5L (X25) / Eléctrico (EX260)", "Manual o automática", "114 CV / 72 CV", "7,8 L/100 km / 15 kWh/100 km", "2 a 4 airbags, ABS con EBD, ISOFIX", "570 km / 250 km"),
  "baic-d20": ft("D20", "Usado desde USD 8.000", "2019-2021", "Naftero 1.3", "Manual", "110 CV", "6 L/100 km", "2 airbags frontales, ABS, EBD, asistente de frenado, ISOFIX", "750 km"),
  "baic-x35": ft("X35", "desde USD 25.500", "2023-vigente", "Naftero 1.5L Turbo", "Automática", "148 CV", "8,8 L/100 km", "2 airbags frontales, ABS, ESP, control de crucero, ISOFIX", "540 km"),
  "baic-ex35": ft("EX35", "Sin precio de referencia", "2023-vigente", "Eléctrico", "Automática", "109 CV", "15 kWh/100 km", "4 airbags, ABS con EBD, ESP, ISOFIX", "301 km"),
  "baic-x55-ii": ft("X55 II", "desde USD 39.700", "2023-vigente", "Naftero 1.5L Turbo", "Automática", "177 CV", "9,2 L/100 km", "6 airbags, ISOFIX, ESP, TCS, asistentes de arranque y descenso", "580 km"),
  "baic-ex55-plus": ft("EX55 Plus", "Sin precio de referencia", "2024-vigente", "Eléctrico", "Automática", "163 CV", "15 kWh/100 km", "6 airbags, ESP, ABS con EBD, ISOFIX", "400 km"),
  "baic-exx": ft("EXX", "Sin precio de referencia", "2025-vigente", "Eléctrico", "Automática", "163 CV", "14 kWh/100 km", "6 airbags, ESP, ADAS, ISOFIX", "400 km"),
  "baic-bj30": ft("BJ30", "desde USD 35.800", "2025-vigente", "Sistema HEV (naftero 1.5 acoplado a motores eléctricos)", "Automática", "403 CV", "6,5 L/100 km", "6 airbags, ESP, ABS+EBD y paquete ADAS (AEB, mantenimiento de carril)", "1.000 km"),
  "baic-bj40": ft("BJ40", "desde USD 61.300", "2024-vigente", "Naftero 2.0 Turbo", "Automática", "241 CV", "11 L/100 km", "Chasis reforzado contra volcaduras, 6 airbags, control de descenso, ADAS", "650 km"),
  "baic-bj60": ft("BJ60", "USD 78.600", "2025-vigente", "Naftero 2.0 Turbo mild hybrid 48V", "Automática 8AT", "263 CV", "10,5 L/100 km", "6 airbags, ADAS (LKA, FCW, APA), bloqueos de diferencial, ISOFIX", "800 km"),
  "baic-u5": ft("U5", "Sin precio de referencia", "2024-vigente", "Naftero 1.5", "Automática CVT", "111 CV", "6,8 L/100 km", "2 airbags, ABS, EBD, ESP, ISOFIX", "700 km"),
  "baic-u5-plus": ft("U5 Plus", "USD 25.600", "2025-vigente", "Naftero 1.5", "Automática CVT", "111 CV", "6,8 L/100 km", "Airbags frontales y laterales, ABS+EBD+EBA, ESC, TCS, cámara 360°, BSD, ISOFIX", "700 km"),
  "baic-eu-5": ft("EU 5", "USD 28.900", "2024-vigente", "Eléctrico", "Automática", "163 CV", "13,7 kWh/100 km", "6 airbags, ABS, ESP, TCS, ADAS, ISOFIX", "416 km"),
  "baic-eu5-plus": ft("EU5 Plus", "USD 48.700", "2025-vigente", "Eléctrico", "Automática", "165 CV", "13,7 kWh/100 km", "6 airbags, ADAS, ABS, ESP, ISOFIX", "501 km"),

  "byd-dolphin-mini": ft("Dolphin Mini", "desde USD 22.990", "2025-vigente", "Eléctrico", "Automática", "88 CV", "13 kWh/100 km", "6 airbags, ABS, ESP, AEB, ISOFIX", "280-380 km"),
  "byd-yuan-pro": ft("Yuan Pro", "desde USD 29.990", "2025-vigente", "Eléctrico", "Automática", "177 CV", "14 kWh/100 km", "6 airbags, ABS, ESC, TCS, BSD, cámara 360°, ISOFIX", "380 km"),
  "byd-song-pro": ft("Song Pro", "desde USD 34.990", "2025-vigente", "Híbrido enchufable DM-i 1.5", "Automática E-CVT", "197 CV", "4,0 L/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "1.030 km combinados"),
  "byd-atto-2-dm-i": ft("Atto 2 DM-i", "USD 31.990", "2026-vigente", "Híbrido enchufable DM-i 1.5", "Automática", "197 CV", "4,3 L/100 km", "6 airbags, ABS, ESP, crucero adaptativo, ISOFIX", "1.100 km combinados"),
  "byd-shark-dmo": ft("Shark DMO", "USD 59.990", "2026-vigente", "Híbrido enchufable DMO 1.5 Turbo + eléctricos", "Automática", "430 CV", "consumo mixto PHEV (hasta 40% menos vs diésel)", "6 airbags, ABS, ESP, ADAS off-road, ISOFIX", "840 km combinados"),
  "byd-seal-u-dm-i": ft("Seal U DM-i", "USD 47.990", "2026-vigente", "Híbrido enchufable DM-i 1.5 Turbo", "Automática", "238 CV", "5,1 L/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "1.105 km combinados"),

  "changan-cs15": ft("CS15", "Usado desde USD 8.000", "2018-2022", "Naftero 1.5", "Manual o automática", "107 CV", "6,5 L/100 km", "2 airbags, ABS, EBD, ISOFIX", "650 km"),
  "changan-cs75": ft("CS75", "Usado desde USD 12.000", "2018-2022", "Naftero 1.8", "Manual o automática", "143 CV", "8,2 L/100 km", "2 airbags, ABS, EBD, ISOFIX", "700 km"),
  "changan-cs55": ft("CS55", "Sin precio de referencia", "2019-vigente", "Naftero 1.5 Turbo", "Automática DCT", "156 CV", "7,8 L/100 km", "6 airbags, ABS, ESP, ISOFIX", "700 km"),
  "changan-cs55-plus-phev": ft("CS55 Plus PHEV", "USD 32.000", "2025-vigente", "Híbrido enchufable 1.5 iDD", "Automática DHT", "212 CV", "1,3 L/100 km (ciclo mixto PHEV)", "6 airbags, ADAS nivel 2, ABS, ESP, ISOFIX", "1.085 km combinados"),

  "chery-qq": ft("QQ", "Usado desde USD 4.000", "2008-2015", "Naftero 1.1", "Manual", "68 CV", "6,0 L/100 km", "Airbag conductor (según versión), frenos a disco delanteros", "550 km"),
  "chery-new-qq": ft("New QQ", "Usado desde USD 5.000", "2012-2016", "Naftero 1.0", "Manual", "68 CV", "5,8 L/100 km", "Airbag conductor, ABS (según versión)", "550 km"),
  "chery-fulwin": ft("Fulwin", "Usado desde USD 6.000", "2011-2016", "Naftero 1.5", "Manual", "109 CV", "6,8 L/100 km", "2 airbags, ABS, EBD (según versión)", "700 km"),
  "chery-face": ft("Face", "Usado desde USD 5.500", "2009-2015", "Naftero 1.3", "Manual", "83 CV", "6,5 L/100 km", "2 airbags, ABS, EBD, ISOFIX", "660 km"),
  "chery-tiggo": ft("Tiggo", "Usado desde USD 7.000", "2008-2016", "Naftero 2.0", "Manual", "127 CV", "9,0 L/100 km", "2 airbags, ABS, barras laterales (según versión)", "630 km"),
  "chery-skin": ft("Skin", "Usado desde USD 5.000", "2011-2015", "Naftero 1.3", "Manual", "83 CV", "6,5 L/100 km", "2 airbags, ABS (según versión)", "650 km"),
  "chery-tiggo-5": ft("Tiggo 5", "Usado desde USD 10.000", "2014-2019", "Naftero 2.0", "Manual o CVT", "138 CV", "8,5 L/100 km", "2 airbags, ABS, EBD, ISOFIX", "650 km"),
  "chery-arrizo-5": ft("Arrizo 5", "Usado desde USD 9.000", "2017-2022", "Naftero 1.5", "Manual o CVT", "116 CV", "6,5 L/100 km", "2 airbags, ABS, ESP (según versión), ISOFIX", "750 km"),
  "chery-tiggo-2-pro-max": ft("Tiggo 2 Pro Max", "desde USD 23.000", "2025-vigente", "Naftero 1.5", "Manual o CVT", "116 CV", "6,5 L/100 km", "2 airbags, ABS, EBD, ESP (CVT), ISOFIX", "780 km"),
  "chery-tiggo-4-hybrid": ft("Tiggo 4 Hybrid", "USD 33.500", "2025-vigente", "Híbrido 1.5 + eléctrico (CSH)", "Automática DHT", "120 CV", "5,2 L/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "900 km"),
  "chery-tiggo-7-pro-hybrid": ft("Tiggo 7 Pro Hybrid", "USD 32.900", "2025-vigente", "Naftero 1.5 Turbo MHEV 48V", "Automática CVT", "147 CV", "6,5 L/100 km", "6 airbags, ABS, ESP, cámara 360°, ISOFIX", "850 km"),
  "chery-tiggo-8-pro": ft("Tiggo 8 Pro", "USD 46.600", "2025-vigente", "Naftero 1.6 Turbo GDI", "Automática DCT 7 vel.", "186 CV", "8,5 L/100 km", "6 airbags, ABS, ESP, ADAS, cámara 360°, ISOFIX", "700 km"),
  "chery-arrizo-8": ft("Arrizo 8", "USD 34.600", "2025-vigente", "Híbrido enchufable 1.5", "Automática DHT", "204 CV", "4,5 L/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "1.000 km combinados"),

  "dfsk-glory-580": ft("Glory 580", "USD 31.000", "2018-vigente", "Naftero 1.5 Turbo", "Manual o CVT", "150 CV", "8,5 L/100 km", "2 a 6 airbags, ABS, ESP (según versión), ISOFIX", "680 km"),
  "dfsk-glory-500": ft("Glory 500", "Sin precio de referencia", "2020-vigente", "Naftero 1.5 Turbo", "Manual o CVT", "148 CV", "7,8 L/100 km", "2 airbags, ABS, ESP (según versión), ISOFIX", "700 km"),
  "dfsk-glory-e5": ft("Glory E5", "Sin precio de referencia", "2024-vigente", "Híbrido enchufable 1.5", "Automática DHT", "204 CV", "1,6 L/100 km (ciclo PHEV)", "6 airbags, ABS, ESP, ISOFIX", "1.000 km combinados"),
  "dfsk-e5-phev": ft("E5 PHEV", "USD 34.500", "2025-vigente", "Híbrido enchufable 1.5", "Automática DHT", "204 CV", "1,6 L/100 km (ciclo PHEV)", "6 airbags, ABS, ESP, ADAS, ISOFIX", "1.000 km combinados"),
  "dfsk-e5-plus": ft("E5 Plus", "USD 33.800", "2025-vigente", "Naftero 1.5 Turbo", "Automática", "150 CV", "7,5 L/100 km", "6 airbags, ABS, ESP, ISOFIX", "720 km"),

  "dongfeng-box": ft("Box", "USD 29.700", "2026-vigente", "Eléctrico", "Automática", "95 CV", "14 kWh/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "310 km"),
  "dongfeng-mage": ft("Mage", "USD 34.400", "2026-vigente", "Híbrido 1.5 + eléctrico", "Automática DHT", "190 CV", "5,2 L/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "1.000 km"),
  "dongfeng-huge": ft("Huge", "USD 36.700", "2026-vigente", "Híbrido 1.5 + eléctrico", "Automática DHT", "190 CV", "5,5 L/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "1.000 km"),

  "faw-x40": ft("X40", "Usado desde USD 9.000", "2018-2022", "Naftero 1.6", "Manual o automática", "114 CV", "7,2 L/100 km", "2 airbags, ABS, EBD, ISOFIX", "680 km"),
  "faw-t33": ft("T33", "Sin precio de referencia", "2021-vigente", "Naftero 1.6", "Manual o automática", "114 CV", "7,0 L/100 km", "2 airbags, ABS, ESP (según versión), ISOFIX", "700 km"),

  "forthing-t5": ft("T5", "USD 21.950", "2025-vigente", "Naftero 1.5 Turbo", "Manual", "150 CV", "7,8 L/100 km", "6 airbags, ABS, ESP, ISOFIX", "700 km"),
  "forthing-t5-hev": ft("T5 HEV", "USD 36.190", "2025-vigente", "Híbrido 1.5 Turbo + eléctrico", "Automática DHT", "252 CV", "5,5 L/100 km", "6 airbags, ABS, EBD, ESP, EBA, TCS, HHC, ISOFIX", "950 km"),
  "forthing-t5-evo": ft("T5 EVO", "USD 36.840", "2025-vigente", "Naftero 1.5 Turbo", "Automática DCT", "197 CV", "7,5 L/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "720 km"),
  "forthing-u-tour": ft("U-Tour", "USD 40.221", "2025-vigente", "Naftero 1.5 Turbo", "Automática", "197 CV", "8,5 L/100 km", "10 airbags, ABS, ESP, EBA, TCS, BSD, cámara 360°, ISOFIX", "700 km"),
  "forthing-u-tour-hybrid": ft("U-Tour Hybrid", "USD 43.957", "2025-vigente", "Híbrido 1.5 Turbo + eléctrico", "Automática DHT", "252 CV", "6,0 L/100 km", "10 airbags, ABS, ESP, ADAS, ISOFIX", "1.000 km"),
  "forthing-friday-reev": ft("Friday REEV", "desde USD 32.300", "2025-vigente", "Eléctrico con generador 1.5 (REEV)", "Automática", "163 CV", "15 kWh/100 km + extensión nafta", "6 airbags, ABS, ESP, BSD, ADAS, ISOFIX", "900 km combinados"),

  "foton-tunland-luxury": ft("Tunland Luxury", "Usado desde USD 14.000", "2017-2022", "Diésel 2.8 Turbo", "Manual", "163 CV", "10,5 L/100 km", "2 airbags, ABS, EBD", "800 km"),
  "foton-tunland-v7": ft("Tunland V7", "USD 54.500", "2025-vigente", "Diésel 2.0 Turbo MHEV", "Automática", "163 CV", "9,5 L/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "850 km"),
  "foton-tunland-v9": ft("Tunland V9", "USD 57.000", "2025-vigente", "Diésel 2.0 Turbo MHEV", "Automática", "163 CV", "9,8 L/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "850 km"),
  "foton-tunland-g7": ft("Tunland G7", "Sin precio de referencia", "2023-vigente", "Diésel 2.0 Turbo", "Manual o automática", "163 CV", "10 L/100 km", "2 a 6 airbags, ABS, ESP (según versión)", "800 km"),

  "gac-gs3-emzoom": ft("GS3 Emzoom", "desde USD 31.900", "2026-vigente", "Naftero 1.5 Turbo", "Automática", "177 CV", "7,2 L/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "750 km"),
  "gac-gs4-emkoo-hev": ft("GS4 Emkoo HEV", "USD 33.800", "2026-vigente", "Híbrido 1.5 + eléctrico", "Automática DHT", "190 CV", "5,3 L/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "1.000 km"),
  "gac-emkoo-hybrid": ft("Emkoo Hybrid", "USD 33.800", "2026-vigente", "Híbrido 1.5 + eléctrico", "Automática DHT", "190 CV", "5,3 L/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "1.000 km"),
  "gac-gs8": ft("GS8", "USD 60.000", "2026-vigente", "Naftero 2.0 Turbo", "Automática 8AT", "252 CV", "10 L/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "700 km"),
  "gac-aion-es": ft("Aion ES", "USD 33.800", "2026-vigente", "Eléctrico", "Automática", "163 CV", "13,5 kWh/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "500 km"),
  "gac-aion-empow": ft("Aion Empow", "Sin precio de referencia", "2026-vigente", "Eléctrico", "Automática", "204 CV", "14 kWh/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "500 km"),
  "gac-s7-phev": ft("S7 PHEV", "USD 74.990", "2026-vigente", "Híbrido enchufable 1.5 Turbo + eléctricos", "Automática DHT", "326 CV", "1,8 L/100 km (ciclo PHEV)", "6 airbags, ABS, ESP, ADAS nivel 2, ISOFIX", "1.000 km combinados"),

  "geely-lc": ft("LC", "Usado desde USD 4.500", "2010-2015", "Naftero 1.3", "Manual", "86 CV", "6,2 L/100 km", "Airbag conductor, ABS (según versión)", "600 km"),
  "geely-515": ft("515", "Usado desde USD 5.500", "2014-2018", "Naftero 1.5", "Manual", "103 CV", "6,5 L/100 km", "2 airbags, ABS, EBD, ISOFIX", "680 km"),
  "geely-emgrand": ft("Emgrand", "Usado desde USD 6.500", "2012-2018", "Naftero 1.5", "Manual o automática", "109 CV", "6,8 L/100 km", "2 airbags, ABS, EBD, ISOFIX", "720 km"),
  "geely-emgrand-x7": ft("Emgrand X7", "Usado desde USD 8.500", "2014-2019", "Naftero 2.0", "Manual o automática", "139 CV", "9,0 L/100 km", "2 airbags, ABS, EBD, ISOFIX", "650 km"),
  "geely-emgrand-gs": ft("Emgrand GS", "Usado desde USD 9.000", "2017-2021", "Naftero 1.8", "Manual o automática", "133 CV", "7,5 L/100 km", "2 airbags, ABS, ESP (según versión), ISOFIX", "700 km"),
  "geely-ex5": ft("EX5", "USD 34.800", "2025-vigente", "Eléctrico", "Automática", "218 CV", "15 kWh/100 km", "6 airbags, ABS, ESP, 13 sistemas ADAS, ISOFIX", "430 km"),
  "geely-icon": ft("Icon", "USD 30.800", "2026-vigente", "Naftero 1.5 Turbo", "Automática DCT", "177 CV", "7,2 L/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "700 km"),

  "gwm-haval-h1": ft("HAVAL H1", "Usado desde USD 8.000", "2018-2021", "Naftero 1.5", "Manual o automática", "105 CV", "7,0 L/100 km", "2 airbags, ABS, cámara de retroceso (según versión), ISOFIX", "640 km"),
  "gwm-haval-h2": ft("HAVAL H2", "Usado desde USD 11.000", "2018-2022", "Naftero 1.5 Turbo", "Manual o automática", "141 CV", "8,0 L/100 km", "6 airbags, ABS, ESP, ISOFIX", "680 km"),
  "gwm-haval-h6": ft("HAVAL H6", "desde USD 36.500", "2018-vigente", "Naftero 2.0 Turbo", "Automática DCT 7 vel.", "204 CV", "8,8 L/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "690 km"),
  "gwm-haval-h6-gt": ft("HAVAL H6 GT", "USD 44.400", "2023-vigente", "Naftero 2.0 Turbo", "Automática DCT 7 vel.", "204 CV", "9,2 L/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "660 km"),
  "gwm-haval-h6-hev": ft("HAVAL H6 HEV", "desde USD 33.500", "2024-vigente", "Híbrido 1.5 Turbo + eléctrico", "Automática DHT", "243 CV", "5,5 L/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "1.100 km"),
  "gwm-haval-h6-pro-hev": ft("HAVAL H6 PRO HEV", "USD 35.500", "2025-vigente", "Híbrido 1.5 Turbo + eléctrico", "Automática DHT", "243 CV", "5,5 L/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "1.100 km"),
  "gwm-haval-jolion": ft("HAVAL Jolion", "desde USD 30.000", "2022-vigente", "Naftero 1.5 Turbo", "Automática DCT 7 vel.", "141 CV", "7,5 L/100 km", "6 airbags, ABS, ESP, ISOFIX", "730 km"),
  "gwm-haval-jolion-pro-hev": ft("HAVAL Jolion PRO HEV", "desde USD 28.990", "2025-vigente", "Híbrido 1.5 + eléctrico", "Automática DHT", "190 CV", "5,1 L/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "1.000 km"),
  "gwm-poer": ft("Poer", "USD 41.990", "2021-vigente", "Diésel 2.0 Turbo", "Automática 8AT", "163 CV", "9,5 L/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "800 km"),
  "gwm-poer-elite": ft("Poer Elite", "desde USD 28.730", "2024-vigente", "Diésel 2.0 Turbo", "Manual o automática", "163 CV", "9,5 L/100 km", "2 a 6 airbags, ABS, ESP, ISOFIX", "800 km"),
  "gwm-tank-300": ft("TANK 300", "USD 51.900", "2024-vigente", "Naftero 2.0 Turbo", "Automática 8AT", "217 CV", "11 L/100 km", "6 airbags, ESP, ADAS, bloqueos de diferencial, HHC/HDC, ISOFIX", "630 km"),
  "gwm-ora-03": ft("ORA 03", "USD 31.000", "2024-vigente", "Eléctrico", "Automática", "169 CV", "16,7 kWh/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "370 km"),

  "jac-js2": ft("JS2", "desde USD 20.900", "2019-vigente", "Naftero 1.5", "Manual", "113 CV", "6,8 L/100 km", "2 airbags, ABS, EBD, ISOFIX", "720 km"),
  "jac-js4": ft("JS4", "desde USD 27.500", "2022-vigente", "Naftero 1.5 Turbo", "Manual o CVT", "147 CV", "7,2 L/100 km", "6 airbags, ABS, ESP, cámara 360° (Flagship), ISOFIX", "690 km"),
  "jac-js6": ft("JS6", "USD 33.900", "2025-vigente", "Híbrido enchufable 1.5 + eléctrico", "Automática", "204 CV", "1,8 L/100 km (ciclo PHEV)", "6 airbags, ABS, ESP, ADAS, ISOFIX", "1.150 km combinados"),
  "jac-js7": ft("JS7", "Usado desde USD 16.000", "2021-2024", "Naftero 1.5 Turbo", "Manual o CVT", "150 CV", "7,8 L/100 km", "6 airbags, ABS, ESP, ISOFIX", "680 km"),
  "jac-js8": ft("JS8", "USD 36.900", "2023-vigente", "Naftero 1.5 Turbo", "Automática DCT", "182 CV", "8,2 L/100 km", "6 airbags, ABS, ESP, ISOFIX", "700 km"),
  "jac-t6": ft("T6", "Usado desde USD 14.000", "2018-2023", "Diésel 2.0 Turbo", "Manual", "136 CV", "9,5 L/100 km", "2 airbags, ABS, EBD", "800 km"),
  "jac-t8": ft("T8", "USD 34.900", "2023-vigente", "Diésel 2.0 Turbo", "Manual", "150 CV", "9,0 L/100 km", "2 airbags, ABS, ESP, ISOFIX", "850 km"),
  "jac-t9": ft("T9", "USD 38.500", "2026-vigente", "Diésel 2.0 Turbo", "Automática 8AT", "170 CV", "8,8 L/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "850 km"),
  "jac-ev30x": ft("EV30X", "USD 30.500", "2025-vigente", "Eléctrico", "Automática", "135 CV", "14 kWh/100 km", "6 airbags, ABS, ESP, ISOFIX", "356 km"),

  "jetour-x70": ft("X70", "USD 31.500", "2020-vigente", "Naftero 1.5 Turbo", "Automática", "156 CV", "7,8 L/100 km", "6 airbags, ABS, ESP, ISOFIX", "700 km"),
  "jetour-x70-plus": ft("X70 Plus", "USD 40.500", "2022-vigente", "Naftero 1.6 Turbo", "Automática DCT", "197 CV", "8,5 L/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "680 km"),
  "jetour-x50": ft("X50", "USD 26.600", "2024-vigente", "Naftero 1.5 Turbo", "Automática DCT 6 vel.", "156 CV", "7,2 L/100 km", "6 airbags, ABS, EBD, HHC, BSD, cámara 360°, ISOFIX", "620 km"),
  "jetour-dashing": ft("Dashing", "USD 38.500", "2023-vigente", "Naftero 1.6 Turbo", "Automática DCT", "197 CV", "7,8 L/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "700 km"),
  "jetour-t1": ft("T1", "USD 51.900", "2025-vigente", "Naftero 2.0 Turbo", "Automática 8AT", "254 CV", "10 L/100 km", "6 airbags, ABS, ESP, ADAS off-road, ISOFIX", "700 km"),
  "jetour-t2": ft("T2", "USD 54.900", "2025-vigente", "Naftero 2.0 Turbo", "Automática 8AT", "254 CV", "10,5 L/100 km", "6 airbags, ABS, ESP, ADAS off-road, ISOFIX", "680 km"),

  "jmc-grand-avenue": ft("Grand Avenue", "Sin precio de referencia", "2022-vigente", "Diésel 2.0 Turbo", "Manual o automática", "163 CV", "9,5 L/100 km", "2 airbags, ABS, ESP (según versión)", "800 km"),
  "jmc-grand-avenue-dadao-pro": ft("Grand Avenue Dadao Pro", "Sin precio de referencia", "2024-vigente", "Diésel 2.0 Turbo", "Automática", "163 CV", "9,5 L/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "800 km"),

  "jmev-easy-3": ft("Easy 3", "USD 18.900", "2025-vigente", "Eléctrico", "Automática", "68 CV", "12 kWh/100 km", "2 airbags, ABS, EBD, ESC, cámara 360°, ISOFIX", "330 km"),

  "kaiyi-x3": ft("X3", "USD 22.000", "2026-vigente", "Naftero 1.5", "Manual o CVT", "116 CV", "6,8 L/100 km", "2 airbags, ABS, ESP, ISOFIX", "720 km"),
  "kaiyi-x3-pro": ft("X3 PRO", "USD 26.000", "2026-vigente", "Naftero 1.5 Turbo", "Automática", "156 CV", "7,2 L/100 km", "6 airbags, ABS, ESP, ISOFIX", "700 km"),
  "kaiyi-x7": ft("X7", "desde USD 35.000", "2026-vigente", "Híbrido 1.5 / Naftero 2.0 Turbo", "Automática", "170-238 CV", "6,5-9,0 L/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "800 km"),

  "leapmotors-c10": ft("C10", "USD 35.500", "2026-vigente", "Eléctrico con generador 1.5 (REEV)", "Automática", "215 CV", "15 kWh/100 km + extensión nafta", "6 airbags, ABS, ESP, ADAS, ISOFIX", "1.150 km combinados"),
  "leapmotors-b10": ft("B10", "USD 31.990", "2026-vigente", "Eléctrico con generador 1.5 (REEV)", "Automática", "215 CV", "14 kWh/100 km + extensión nafta", "6 airbags, ABS, ESP, ADAS, ISOFIX", "900 km combinados"),

  "lifan-x50": ft("X50", "Usado desde USD 6.500", "2015-2019", "Naftero 1.5", "Manual", "103 CV", "6,8 L/100 km", "2 airbags, ABS, EBD, ISOFIX", "680 km"),
  "lifan-x60": ft("X60", "Usado desde USD 7.500", "2013-2019", "Naftero 1.8", "Manual o automática", "128 CV", "8,5 L/100 km", "2 airbags, ABS, EBD, ISOFIX", "650 km"),
  "lifan-x70": ft("X70", "Usado desde USD 9.000", "2018-2021", "Naftero 2.0", "Manual o automática", "140 CV", "8,8 L/100 km", "2 airbags, ABS, ESP (según versión), ISOFIX", "680 km"),
  "lifan-myway": ft("MyWay", "Usado desde USD 8.000", "2017-2020", "Naftero 1.8", "Manual o automática", "128 CV", "8,5 L/100 km", "2 airbags, ABS, ISOFIX", "650 km"),
  "lifan-m7": ft("M7", "Usado desde USD 7.000", "2016-2019", "Naftero 2.0", "Manual", "141 CV", "9,0 L/100 km", "2 airbags, ABS", "650 km"),

  "lynk-and-co-01": ft("01", "USD 37.900", "2026-vigente", "Híbrido 1.5 Turbo + eléctrico", "Automática DHT", "190 CV", "5,8 L/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "950 km"),
  "lynk-and-co-06": ft("06", "USD 32.800", "2026-vigente", "Naftero 1.5 Turbo", "Automática DCT", "177 CV", "7,0 L/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "720 km"),
  "lynk-and-co-08": ft("08", "USD 63.200", "2026-vigente", "Híbrido enchufable EM-P 1.5 Turbo + eléctricos", "Automática DHT", "436 CV", "1,5 L/100 km (ciclo PHEV)", "6 airbags, ABS, ESP, ADAS nivel 2, ISOFIX", "1.200 km combinados"),

  "maxus-t60": ft("T60", "desde USD 28.900", "2025-vigente", "Diésel 2.0 Turbo", "Manual o automática", "163 CV", "9,5 L/100 km", "2 airbags, ABS, ESP, EBA, HHC/HDC, ISOFIX", "800 km"),
  "maxus-t90": ft("T90", "USD 43.000", "2025-vigente", "Diésel 2.0 Turbo", "Automática", "163 CV", "9,5 L/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "800 km"),
  "maxus-t90-ev": ft("T90 EV", "USD 72.000", "2026-vigente", "Eléctrico", "Automática", "240 CV", "25 kWh/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "400 km"),
  "maxus-d90": ft("D90", "USD 66.000", "2025-vigente", "Naftero 2.0 Turbo", "Automática", "224 CV", "10 L/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "700 km"),
  "maxus-eterron": ft("eterron", "USD 80.600", "2026-vigente", "Eléctrico 102,2 kWh", "Automática", "430 CV", "24 kWh/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "430 km"),

  "mg-mg3-hev": ft("MG3 HEV", "desde USD 23.500", "2026-vigente", "Híbrido 1.5 + eléctrico", "Automática DHT", "194 CV", "4,4 L/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "900 km"),
  "mg-mg-zs-hev": ft("MG ZS HEV", "desde USD 27.500", "2026-vigente", "Híbrido 1.5 + eléctrico", "Automática DHT", "194 CV", "4,7 L/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "900 km"),
  "mg-cyberster": ft("Cyberster", "USD 130.000", "2026-vigente", "Eléctrico", "Automática", "375 CV", "18 kWh/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "440 km"),

  "rely-r8": ft("R8", "desde USD 32.000", "2026-vigente", "Diésel 2.0 Turbo", "Manual o automática", "163 CV", "9,5 L/100 km", "2 a 6 airbags, ABS, ESP, ISOFIX", "800 km"),

  "shineray-swm-x7": ft("SWM X7", "Sin precio de referencia", "2018-vigente", "Naftero 2.0", "Manual o automática", "141 CV", "8,8 L/100 km", "2 airbags, ABS, ESP (según versión), ISOFIX", "680 km"),
  "shineray-swm-g01": ft("SWM G01", "Sin precio de referencia", "2019-vigente", "Naftero 1.5 Turbo", "Manual o automática", "156 CV", "7,8 L/100 km", "6 airbags, ABS, ESP, ISOFIX", "700 km"),

  "skywell-et5": ft("ET5", "USD 48.000", "2024-vigente", "Eléctrico", "Automática", "204 CV", "16 kWh/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "520 km"),
  "skywell-be11": ft("BE11", "USD 58.000", "2025-vigente", "Eléctrico", "Automática", "204 CV", "17 kWh/100 km", "6 airbags, ABS, ESP, ADAS, ISOFIX", "500 km"),

  "xev-yoyo-pro": ft("YOYO PRO", "Sin precio de referencia", "2025-vigente", "Eléctrico", "Automática", "15 CV", "10 kWh/100 km", "ABS, frenos a disco, estructura de acero de alta resistencia", "150 km"),
};

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=500&fit=crop",
];

const FICHA_DEFAULT: FichaTecnicaRow[] = ft(
  "—",
  "Sin precio de referencia",
  "—",
  "Por confirmar",
  "Por confirmar",
  "Por confirmar",
  "Por confirmar",
  "Por confirmar",
  "Por confirmar",
);

function hashIndex(id: string, max: number): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * (i + 1)) % max;
  return h;
}

export function getModeloImage(modeloId: string): string {
  if (IMAGENES[modeloId]) return IMAGENES[modeloId];
  return FALLBACK_IMAGES[hashIndex(modeloId, FALLBACK_IMAGES.length)];
}

export function getFichaTecnica(modeloId: string): FichaTecnicaRow[] {
  return FICHAS[modeloId] ?? FICHA_DEFAULT;
}
