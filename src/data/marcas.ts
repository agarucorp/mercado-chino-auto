import { createModelo } from "@/lib/marcas";
import type { Marca } from "@/types/marcas";

function marca(
  nombre: string,
  anioLanzamiento: number,
  representante: string,
  modelos: [string, "Vigente" | "Discontinuado"][],
): Marca {
  const id = nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return {
    id,
    nombre,
    slug: id,
    anioLanzamiento,
    representante,
    modelos: modelos.map(([nombreModelo, estado]) =>
      createModelo(id, nombreModelo, estado),
    ),
  };
}

/** Marcas con presencia oficial en Argentina — Mayo 2026 */
export const MARCAS: Marca[] = [
  marca("ARCFOX", 2026, "GRUPO BELCASTRO", [
    ["T1", "Vigente"],
    ["KAOLA", "Vigente"],
    ["T5", "Vigente"],
    ["S5", "Vigente"],
  ]),
  marca("BAIC", 2018, "GRUPO BELCASTRO", [
    ["X25 / EX260", "Discontinuado"],
    ["D20", "Discontinuado"],
    ["EX35", "Vigente"],
    ["EX55 Plus", "Vigente"],
    ["EXX", "Vigente"],
    ["BJ30", "Vigente"],
    ["BJ40", "Vigente"],
    ["BJ60", "Vigente"],
    ["U5", "Vigente"],
  ]),
  marca("BYD", 2025, "BYD Auto Argentina S.A.U.", [
    ["Dolphin Mini", "Vigente"],
    ["Yuan Pro", "Vigente"],
    ["Song Pro", "Vigente"],
  ]),
  marca("CHANGAN", 2018, "GRUPO ANTELO", [
    ["CS15", "Discontinuado"],
    ["CS75", "Discontinuado"],
    ["CS55", "Vigente"],
  ]),
  marca("CHERY", 2008, "Grupo Corven", [
    ["QQ", "Discontinuado"],
    ["New QQ", "Discontinuado"],
    ["Fulwin", "Discontinuado"],
    ["Face", "Discontinuado"],
    ["Tiggo", "Discontinuado"],
    ["Skin", "Discontinuado"],
    ["Tiggo 5", "Discontinuado"],
    ["Arrizo 5", "Discontinuado"],
    ["Tiggo 2", "Vigente"],
    ["Tiggo 4", "Vigente"],
    ["Tiggo 7", "Vigente"],
    ["Tiggo 8", "Vigente"],
    ["Arrizo 8", "Vigente"],
  ]),
  marca("DFSK", 2017, "Grupo Corven", [
    ["Glory 580", "Vigente"],
    ["Glory 500", "Vigente"],
    ["Glory E5", "Vigente"],
  ]),
  marca("FAW", 2021, "FAMLY", [
    ["X40", "Discontinuado"],
    ["T33", "Vigente"],
  ]),
  marca("FORTHING", 2025, "ORIENTE MOTORS", [
    ["T5 EVO", "Vigente"],
    ["T5", "Vigente"],
    ["U-TOUR", "Vigente"],
  ]),
  marca("FOTON", 2017, "Grupo Corven", [
    ["Tunland Luxury", "Discontinuado"],
    ["Tunland V7", "Vigente"],
    ["Tunland V9", "Vigente"],
    ["Tunland G7", "Vigente"],
  ]),
  marca("GAC", 2026, "AVANTEK", [
    ["GSM3 EMZOON", "Vigente"],
    ["GSM4 EMKOO", "Vigente"],
    ["GS8", "Vigente"],
    ["Aion ES", "Vigente"],
    ["Aion Empow", "Vigente"],
  ]),
  marca("GEELY", 2016, "AUTOS SUSTENTABLES DEL SUR", [
    ["LC", "Discontinuado"],
    ["515", "Discontinuado"],
    ["Embrgrand", "Discontinuado"],
    ["Embragrand X7", "Discontinuado"],
    ["Embragrand GS", "Discontinuado"],
    ["EX5", "Vigente"],
  ]),
  marca("GWM", 2018, "GRUPO ANTELO", [
    ["HAVAL H1", "Discontinuado"],
    ["HAVAL H2", "Discontinuado"],
    ["HAVAL H6", "Vigente"],
    ["HAVAL H6 GT", "Vigente"],
    ["HAVAL JAILON", "Vigente"],
    ["Poer", "Vigente"],
    ["TANK 300", "Vigente"],
    ["ORA 03", "Vigente"],
  ]),
  marca("JAC", 2018, "SOCMA", [
    ["JS2", "Vigente"],
    ["JS4", "Vigente"],
    ["JS6", "Vigente"],
    ["JS8", "Vigente"],
    ["JS7", "Discontinuado"],
    ["T6", "Discontinuado"],
    ["T8", "Vigente"],
    ["T9", "Vigente"],
    ["EV30X", "Vigente"],
  ]),
  marca("JETOUR", 2020, "FAMLY", [
    ["X70", "Vigente"],
    ["X50", "Vigente"],
    ["Dashing", "Vigente"],
    ["T1", "Vigente"],
    ["T2", "Vigente"],
  ]),
  marca("JMC", 2011, "Ralitor", [
    ["Grand Avenue", "Vigente"],
    ["Grand Avenue Dadao Pro", "Vigente"],
  ]),
  marca("JMEV", 2025, "GRUPO ANTELO", [["EASY 3", "Vigente"]]),
  marca("KAIYI", 2026, "GRUPO EMPRESARIO PRIETO", [
    ["X3", "Vigente"],
    ["X7", "Vigente"],
  ]),
  marca("LEPAMOTORS", 2026, "STELLANTIS", [
    ["C10", "Vigente"],
    ["B10", "Vigente"],
  ]),
  marca("LIFAN", 2016, "FAMLY", [
    ["X50", "Discontinuado"],
    ["X60", "Discontinuado"],
    ["X70", "Discontinuado"],
    ["MyWay", "Discontinuado"],
    ["M7", "Discontinuado"],
  ]),
  marca("LYNK & CO", 2026, "GRUPO BELCASTRO", [
    ["01", "Vigente"],
    ["06", "Vigente"],
    ["08", "Vigente"],
  ]),
  marca("MAXUS", 2025, "GRUPO PRIETO", [
    ["T60", "Vigente"],
    ["T90", "Vigente"],
    ["D90", "Vigente"],
  ]),
  marca("MG", 2026, "GRUPO EXIMAR", [
    ["03", "Vigente"],
    ["ZS", "Vigente"],
    ["CYBERSTER", "Vigente"],
  ]),
  marca("SHINERAY", 2018, "RALITOR", [
    ["SWM X7", "Vigente"],
    ["SWM G01", "Vigente"],
  ]),
  marca("SKYWELL", 2024, "GRUPO BELCASTRO", [["ET5", "Vigente"]]),
  marca("XEV", 2025, "BLACK SAPPHIRE", [["YOYO PRO", "Vigente"]]),
];
