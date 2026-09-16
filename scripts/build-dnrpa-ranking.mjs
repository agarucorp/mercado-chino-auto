import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TMP = path.join(ROOT, ".tmp-dnrpa");
const OUT = path.join(ROOT, "src/data/dnrpa-patentamientos.ts");

const POWER = new Set(["HEV", "PHEV", "MHEV", "EV", "DMI", "DMO", "REEV", "EREV"]);

const MARCA_EXACTA = new Map([
  ["BYD", "byd"],
  ["BAIC", "baic"],
  ["BEIJING", "baic"],
  ["CHERY", "chery"],
  ["HAVAL", "gwm"],
  ["GREAT WALL", "gwm"],
  ["GWM", "gwm"],
  ["ORA", "gwm"],
  ["TANK", "gwm"],
  ["MG", "mg"],
  ["MG MOTOR", "mg"],
  ["FOTON", "foton"],
  ["CHANGAN", "changan"],
  ["JETOUR", "jetour"],
  ["DFSK", "dfsk"],
  ["JAC", "jac"],
  ["SHINERAY", "shineray"],
  ["SWM", "shineray"],
  ["GAC", "gac"],
  ["AION", "gac"],
  ["JMEV", "jmev"],
  ["JMC", "jmc"],
  ["FORTHING", "forthing"],
  ["ARCFOX", "arcfox"],
  ["GEELY", "geely"],
  ["GEOMETRY", "geely"],
  ["DONGFENG", "dongfeng"],
  ["DONG FENG", "dongfeng"],
  ["KAIYI", "kaiyi"],
  ["KAI YI", "kaiyi"],
  ["LEAPMOTOR", "leapmotors"],
  ["LEAPMOTORS", "leapmotors"],
  ["LEAP MOTOR", "leapmotors"],
  ["LEPAMOTORS", "leapmotors"],
  ["MAXUS", "maxus"],
  ["LYNK&CO", "lynk-and-co"],
  ["LYNK & CO", "lynk-and-co"],
  ["LYNK AND CO", "lynk-and-co"],
  ["XEV", "xev"],
  ["RELY", "rely"],
  ["SKYWELL", "skywell"],
  ["FAW", "faw"],
  ["LIFAN", "lifan"],
]);

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function loadCatalog() {
  const src = fs.readFileSync(path.join(ROOT, "src/data/marcas.ts"), "utf8");
  const re = /marca\("([^"]+)"[\s\S]*?\[([\s\S]*?)\]\),?/g;
  const catalog = [];
  let m;
  while ((m = re.exec(src))) {
    const brandName = m[1];
    const brandId = slugify(brandName);
    const mods = [...m[2].matchAll(/\["([^"]+)"/g)].map((a) => a[1]);
    for (const nombre of mods) {
      catalog.push({
        marcaId: brandId,
        marcaNombre: brandName,
        modeloId: `${brandId}-${slugify(nombre)}`,
        modeloNombre: nombre,
      });
    }
  }
  if (catalog.length < 50) {
    throw new Error(`Catálogo incompleto (${catalog.length} modelos). Revisar el parser.`);
  }
  return catalog;
}

function parseLine(line) {
  const cols = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') inQ = !inQ;
    else if (c === "," && !inQ) {
      cols.push(cur);
      cur = "";
    } else cur += c;
  }
  cols.push(cur);
  return cols;
}

function resolveMarca(raw) {
  const u = raw.trim().toUpperCase();
  if (!u) return null;
  if (u === "DFAC DONGFENG" || u.startsWith("DFAC")) return null;
  if (MARCA_EXACTA.has(u)) return MARCA_EXACTA.get(u);
  if (u.startsWith("GREAT WALL")) return "gwm";
  if (u.startsWith("LYNK")) return "lynk-and-co";
  return null;
}

function normalizeModelo(raw, marcaId) {
  let s = raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/HYBRID\+?/g, "HEV")
    .replace(/JAILON/g, "JOLION")
    .replace(/DM-?I/g, "DMI")
    .replace(/EVEASY/g, "EASY")
    .replace(/BJ30E/g, "BJ30")
    .replace(/\bEU5\b/g, "EU 5")
    .replace(/T5HEV/g, "T5 HEV")
    .replace(/T5-MT/g, "T5 MT")
    .replace(/T5-EVO/g, "T5 EVO")
    .replace(/KYX/g, "X")
    .replace(/\bI-DM\b/g, "")
    .replace(/DOLPHINMINI/g, "DOLPHIN MINI")
    .replace(/YUANPLUS/g, "YUAN PLUS")
    .replace(/SEALU/g, "SEAL U")
    .replace(/\d+[.,]\d+/g, " ");
  if (marcaId === "jac") s = s.replace(/\bS2\b/g, "JS2");
  s = s
    .replace(/[^A-Z0-9]+/g, " ")
    .replace(/([A-Z]+)(\d+)/g, "$1 $2")
    .replace(/(\d+)([A-Z]+)/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();
  return s;
}

function tokenize(s) {
  return s.split(/\s+/).filter(Boolean);
}

function stripBrandTokens(tokens, marcaNombre) {
  const brand = normalizeModelo(marcaNombre, "");
  const drop = new Set([
    "HAVAL",
    "ORA",
    "TANK",
    "GWM",
    "MG",
    "SWM",
    "AION",
    ...tokenize(brand),
  ]);
  return tokens.filter((t) => !drop.has(t));
}

function splitCorePower(tokens) {
  const core = [];
  const power = [];
  for (const t of tokens) {
    if (POWER.has(t)) power.push(t);
    else core.push(t);
  }
  return { core, power };
}

function tokenInRaw(token, rawCoreSet, rawNorm) {
  if (rawCoreSet.has(token)) return true;
  return token.length >= 3 && rawNorm.includes(token);
}

function matchModelo(marcaId, dnrpaModelo, catalog) {
  const rawNorm = normalizeModelo(dnrpaModelo, marcaId);
  const rawTok = tokenize(rawNorm);
  const { core: rawCore, power: rawPower } = splitCorePower(rawTok);
  const rawCoreSet = new Set(rawCore);
  const rawPowerSet = new Set(rawPower);
  const rawDigits = rawCore.filter((t) => /\d/.test(t));

  let best = null;
  let bestScore = -1;

  for (const item of catalog) {
    if (item.marcaId !== marcaId) continue;
    const catTok = stripBrandTokens(
      tokenize(normalizeModelo(item.modeloNombre, marcaId)),
      item.marcaNombre,
    );
    const { core, power } = splitCorePower(catTok);
    if (!core.length) continue;

    const shared = core.filter((t) => tokenInRaw(t, rawCoreSet, rawNorm));
    if (!shared.length) continue;

    const catDigits = core.filter((t) => /\d/.test(t));
    if (catDigits.length && rawDigits.length) {
      const digitHit = catDigits.some(
        (t) => rawDigits.includes(t) || rawNorm.includes(t),
      );
      if (!digitHit) continue;
    }

    const catalogSubset = core.every((t) => tokenInRaw(t, rawCoreSet, rawNorm));
    const dnrpaSubset =
      rawCore.length > 0 && rawCore.every((t) => core.includes(t));
    if (!catalogSubset && !dnrpaSubset && shared.length < 2) continue;

    let powerAgree = 0;
    if (power.length) {
      if (power.every((t) => rawPowerSet.has(t))) powerAgree = 2;
      else if (rawPower.length === 0) powerAgree = 1;
    } else if (rawPower.length === 0) {
      powerAgree = 2;
    }

    const score =
      shared.length * 20 +
      (catalogSubset ? 18 : 0) +
      (dnrpaSubset ? 6 : 0) +
      powerAgree * 8 +
      catDigits.filter((d) => rawDigits.includes(d)).length * 14 +
      Math.min(item.modeloNombre.length, 24);

    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }
  return best;
}

async function scanFile(filePath, catalog, byKey, totals, unmatched) {
  const year = Number(path.basename(filePath).match(/autos-(\d{4})/)?.[1]);
  if (!year) throw new Error(`No se pudo leer el año de ${filePath}`);
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity,
  });
  let header = null;
  let iMarca = 11;
  let iModelo = 13;
  for await (const line of rl) {
    if (!header) {
      header = parseLine(line.replace(/^\uFEFF/, ""));
      iMarca = header.indexOf("automotor_marca_descripcion");
      iModelo = header.indexOf("automotor_modelo_descripcion");
      if (iMarca < 0 || iModelo < 0) {
        throw new Error(`Columnas DNRPA no encontradas en ${filePath}`);
      }
      continue;
    }
    if (!line.trim()) continue;
    const cols = parseLine(line);
    totals.inscripciones += 1;
    totals.porAnio[year] = (totals.porAnio[year] || 0) + 1;
    const marcaRaw = cols[iMarca] || "";
    const modeloRaw = cols[iModelo] || "";
    const marcaId = resolveMarca(marcaRaw);
    if (!marcaId) continue;
    totals.chinos += 1;
    totals.chinosPorAnio[year] = (totals.chinosPorAnio[year] || 0) + 1;
    const hit = matchModelo(marcaId, modeloRaw, catalog);
    if (!hit) {
      const key = `${marcaId}|${modeloRaw.trim().toUpperCase()}`;
      unmatched.set(key, (unmatched.get(key) || 0) + 1);
      continue;
    }
    const key = `${year}|${hit.modeloId}`;
    const prev = byKey.get(key);
    if (prev) prev.cantidad += 1;
    else
      byKey.set(key, {
        year,
        marcaId: hit.marcaId,
        modeloId: hit.modeloId,
        marcaNombre: hit.marcaNombre,
        modeloNombre: hit.modeloNombre,
        cantidad: 1,
      });
  }
}

async function main() {
  const catalog = loadCatalog();
  process.stderr.write(`catálogo: ${catalog.length} modelos\n`);
  const byKey = new Map();
  const unmatched = new Map();
  const totals = { inscripciones: 0, chinos: 0, porAnio: {}, chinosPorAnio: {} };
  const years = ["2024", "2025", "2026"];
  for (const y of years) {
    const dir = path.join(TMP, y);
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".csv"))
      .sort();
    for (const f of files) {
      process.stderr.write(`scan ${f}\n`);
      await scanFile(path.join(dir, f), catalog, byKey, totals, unmatched);
    }
  }
  const rows = [...byKey.values()].sort(
    (a, b) => b.year - a.year || b.cantidad - a.cantidad,
  );
  const matched = rows.reduce((n, r) => n + r.cantidad, 0);
  const unmatchedTop = [...unmatched.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25);

  const body = `/**
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
export const DNRPA_TOTAL_INSCRIPCIONES: Record<number, number> = ${JSON.stringify(totals.porAnio)};
export const DNRPA_TOTAL_CHINOS: Record<number, number> = ${JSON.stringify(totals.chinosPorAnio)};

export const DNRPA_PATENTAMIENTOS: DnrpaPatentamiento[] = ${JSON.stringify(rows, null, 2)};
`;
  fs.writeFileSync(OUT, body);
  process.stderr.write(
    `wrote ${rows.length} rows, matched=${matched}, chinos=${totals.chinos}, total=${totals.inscripciones}\n`,
  );
  process.stderr.write("top unmatched:\n");
  for (const [k, n] of unmatchedTop) process.stderr.write(`  ${n}\t${k}\n`);
}

main();
