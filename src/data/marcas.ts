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

/** Marcas con presencia en Argentina — actualizado Julio 2026 */
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
    ["X35", "Vigente"],
    ["EX35", "Vigente"],
    ["X55 II", "Vigente"],
    ["EX55 Plus", "Vigente"],
    ["EXX", "Vigente"],
    ["BJ30", "Vigente"],
    ["BJ40", "Vigente"],
    ["BJ60", "Vigente"],
    ["U5", "Vigente"],
    ["U5 Plus EV", "Vigente"],
  ]),
  marca("BAW", 2026, "BAW MOTORS ARGENTINA", [
    ["Pony", "Vigente"],
    ["Rino", "Vigente"],
  ]),
  marca("BYD", 2025, "BYD Auto Argentina S.A.U.", [
    ["Dolphin Mini", "Vigente"],
    ["Dolphin", "Vigente"],
    ["Yuan Pro", "Vigente"],
    ["Atto 2 DM-i", "Vigente"],
    ["Song Pro DM-i", "Vigente"],
    ["Seal U DM-i", "Vigente"],
    ["Seal 05 DM-i", "Vigente"],
    ["Shark", "Vigente"],
  ]),
  marca("CHANGAN", 2018, "GRUPO ANTELO", [
    ["CS15", "Discontinuado"],
    ["CS75", "Discontinuado"],
    ["CS55", "Vigente"],
    ["CS55 PHEV", "Vigente"],
  ]),
  marca("CHERY", 2008, "Grupo Corven", [
    ["QQ", "Discontinuado"],
    ["New QQ", "Discontinuado"],
    ["Fulwin", "Discontinuado"],
    ["Face", "Discontinuado"],
    ["Tiggo", "Discontinuado"],
    ["Skin", "Discontinuado"],
    ["Tiggo 3", "Discontinuado"],
    ["Tiggo 3X", "Discontinuado"],
    ["Tiggo 5", "Discontinuado"],
    ["Arrizo 5", "Discontinuado"],
    ["Arrizo 6", "Discontinuado"],
    ["Tiggo 2 Pro Max", "Vigente"],
    ["Tiggo 4 Hybrid", "Vigente"],
    ["Tiggo 7 Pro Hybrid", "Vigente"],
    ["Tiggo 8 Pro", "Vigente"],
    ["Arrizo 8", "Vigente"],
  ]),
  marca("DEEPAL", 2026, "GRUPO ANTELO", [["S05", "Vigente"]]),
  marca("DFSK", 2017, "Grupo Corven", [
    ["Glory 580", "Vigente"],
    ["Glory 500", "Vigente"],
    ["Glory E5", "Vigente"],
  ]),
  marca("DONGFENG", 2026, "FAMLY", [
    ["Box (Nammi)", "Vigente"],
    ["Mage", "Vigente"],
    ["Huge", "Vigente"],
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
    ["Gratour T3", "Vigente"],
    ["View CS2", "Vigente"],
    ["Aumark TM1", "Vigente"],
    ["Toano", "Vigente"],
    ["TM1", "Vigente"],
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
    ["Emgrand", "Discontinuado"],
    ["Emgrand X7", "Discontinuado"],
    ["Emgrand GS", "Discontinuado"],
    ["Coolray", "Discontinuado"],
    ["Geometry EX5", "Vigente"],
  ]),
  marca("GWM", 2018, "GRUPO ANTELO", [
    ["HAVAL H1", "Discontinuado"],
    ["HAVAL H2", "Discontinuado"],
    ["Wingle", "Discontinuado"],
    ["HAVAL H6", "Vigente"],
    ["HAVAL H6 HEV", "Vigente"],
    ["HAVAL H6 PRO HEV", "Vigente"],
    ["HAVAL H6 GT", "Vigente"],
    ["HAVAL Jolion Pro HEV", "Vigente"],
    ["Poer", "Vigente"],
    ["Poer Elite", "Vigente"],
    ["TANK 300", "Vigente"],
    ["ORA 03", "Vigente"],
  ]),
  marca("HAFEI", 2012, "IMPORTADORES VARIOS", [
    ["Minivan", "Discontinuado"],
    ["Pick-up", "Discontinuado"],
  ]),
  marca("HAIMA", 2014, "IMPORTADORES VARIOS", [
    ["Familia 2", "Discontinuado"],
    ["S5", "Discontinuado"],
    ["S7", "Discontinuado"],
  ]),
  marca("JAC", 2018, "SOCMA", [
    ["JS2 (S2)", "Vigente"],
    ["JS3 (S3)", "Vigente"],
    ["JS4 (S4)", "Vigente"],
    ["JS5 (S5)", "Vigente"],
    ["JS6", "Vigente"],
    ["JS7", "Discontinuado"],
    ["JS8", "Vigente"],
    ["T6", "Discontinuado"],
    ["T8", "Vigente"],
    ["T9", "Vigente"],
    ["Sunray", "Vigente"],
    ["iEV7S", "Vigente"],
    ["EV30X", "Vigente"],
  ]),
  marca("JAECOO", 2026, "OMODA & JAECOO ARGENTINA", [
    ["J5", "Vigente"],
    ["J7", "Vigente"],
    ["J8", "Vigente"],
  ]),
  marca("JETOUR", 2020, "FAMLY", [
    ["X70", "Vigente"],
    ["X70 Plus", "Vigente"],
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
  marca("KARRY", 2026, "GRUPO CHERY", [
    ["Camión", "Vigente"],
    ["Furgón", "Vigente"],
    ["Van", "Vigente"],
  ]),
  marca("KAIYI", 2026, "GRUPO EMPRESARIO PRIETO", [
    ["X3", "Vigente"],
    ["X7", "Vigente"],
  ]),
  marca("KYC", 2018, "FAMLY", [
    ["Mamut Cabina Simple", "Vigente"],
    ["Mamut Cabina Doble", "Vigente"],
    ["Mamut Box", "Vigente"],
    ["Mamut Box Refrigerado", "Vigente"],
    ["Furgón V7", "Vigente"],
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
    ["Foison", "Discontinuado"],
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
  marca("OMODA", 2026, "OMODA & JAECOO ARGENTINA", [
    ["Omoda 4", "Vigente"],
    ["Omoda 5", "Vigente"],
    ["Omoda 7", "Vigente"],
  ]),
  marca("RELY", 2026, "GRUPO LA EMILIA", [["R8", "Vigente"]]),
  marca("SHINERAY", 2018, "RALITOR", [
    ["SWM X7", "Vigente"],
    ["SWM G01F", "Vigente"],
    ["SWM G03F", "Vigente"],
    ["SWM G05", "Vigente"],
  ]),
  marca("SKYWELL", 2024, "GRUPO BELCASTRO", [["ET5", "Vigente"]]),
  marca("VICTORY AUTO", 2024, "RALITOR", [
    ["Domy K1", "Vigente"],
    ["Domy K2", "Vigente"],
    ["Domy V1", "Vigente"],
  ]),
  marca("XEV", 2025, "BLACK SAPPHIRE", [["YOYO PRO", "Vigente"]]),
  marca("ZOTYE", 2018, "ANNAPURNA", [
    ["Z100", "Discontinuado"],
    ["Z300", "Discontinuado"],
    ["T600", "Discontinuado"],
    ["E200", "Discontinuado"],
  ]),
];
