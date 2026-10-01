/** Venta del dólar oficial. Se usa solo si la cotización en vivo no responde. */
export const FALLBACK_USD_ARS = 1540;

export async function fetchUsdArsVenta(): Promise<number> {
  const res = await fetch("https://dolarapi.com/v1/dolares/oficial");
  if (!res.ok) throw new Error("No se pudo leer el tipo de cambio.");
  const data = (await res.json()) as { venta?: number };
  const venta = Number(data.venta);
  if (!Number.isFinite(venta) || venta <= 0) {
    throw new Error("Tipo de cambio inválido.");
  }
  return venta;
}
