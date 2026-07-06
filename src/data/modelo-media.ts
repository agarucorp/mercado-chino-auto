export interface FichaTecnicaRow {
  label: string;
  value: string;
}

const IMAGENES: Record<string, string> = {
  "byd-dolphin-mini":
    "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=500&fit=crop",
  "byd-song-pro-dm-i":
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
  "geely-geometry-ex5":
    "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=500&fit=crop",
  "jac-t8":
    "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=500&fit=crop",
  "jac-js2-s2":
    "https://images.unsplash.com/photo-1609521263047-f8f205293bb0?w=800&h=500&fit=crop",
};

const FICHAS: Record<string, FichaTecnicaRow[]> = {
  "byd-song-pro-dm-i": [
    { label: "Segmento", value: "SUV C" },
    { label: "Motor", value: "Híbrido enchufable DM-i 1.5" },
    { label: "Potencia", value: "215 CV combinados" },
    { label: "Transmisión", value: "Automática E-CVT" },
    { label: "Tracción", value: "Delantera" },
    { label: "Combustible", value: "Híbrido enchufable" },
    { label: "Autonomía eléctrica", value: "~100 km" },
  ],
  "byd-dolphin-mini": [
    { label: "Segmento", value: "Hatchback urbano" },
    { label: "Motor", value: "Eléctrico" },
    { label: "Potencia", value: "75 CV" },
    { label: "Transmisión", value: "Automática" },
    { label: "Tracción", value: "Delantera" },
    { label: "Combustible", value: "Eléctrico" },
    { label: "Autonomía", value: "~300 km" },
  ],
  "byd-atto-2-dm-i": [
    { label: "Segmento", value: "SUV B" },
    { label: "Motor", value: "Híbrido enchufable DM-i" },
    { label: "Potencia", value: "212 CV" },
    { label: "Transmisión", value: "Automática" },
    { label: "Tracción", value: "Delantera" },
    { label: "Combustible", value: "Híbrido enchufable" },
  ],
  "byd-seal-u-dm-i": [
    { label: "Segmento", value: "SUV C" },
    { label: "Motor", value: "Híbrido enchufable DM-i 1.5 turbo" },
    { label: "Potencia", value: "334 CV combinados" },
    { label: "Transmisión", value: "Automática" },
    { label: "Tracción", value: "Delantera" },
    { label: "Combustible", value: "Híbrido enchufable" },
    { label: "Autonomía eléctrica", value: "~105 km" },
  ],
  "chery-tiggo-8-pro": [
    { label: "Segmento", value: "SUV D (7 plazas)" },
    { label: "Motor", value: "1.6 turbo naftero" },
    { label: "Potencia", value: "186 CV" },
    { label: "Transmisión", value: "Automática DCT 7 vel." },
    { label: "Tracción", value: "Delantera" },
    { label: "Combustible", value: "Nafta" },
  ],
  "chery-tiggo-7-pro-hybrid": [
    { label: "Segmento", value: "SUV C" },
    { label: "Motor", value: "1.5 turbo MHEV 48V" },
    { label: "Potencia", value: "147 CV" },
    { label: "Transmisión", value: "CVT" },
    { label: "Tracción", value: "Delantera" },
    { label: "Combustible", value: "Híbrido suave" },
  ],
  "chery-tiggo-4-hybrid": [
    { label: "Segmento", value: "SUV B" },
    { label: "Motor", value: "HEV 1.5 + eléctrico" },
    { label: "Potencia", value: "194 CV combinados" },
    { label: "Transmisión", value: "DHT" },
    { label: "Tracción", value: "Delantera" },
    { label: "Combustible", value: "Híbrido" },
  ],
  "gwm-haval-h6": [
    { label: "Segmento", value: "SUV D" },
    { label: "Motor", value: "2.0 turbo naftero" },
    { label: "Potencia", value: "204 CV" },
    { label: "Transmisión", value: "Automática 7 vel." },
    { label: "Tracción", value: "Delantera / 4x4" },
    { label: "Combustible", value: "Nafta" },
  ],
  "gwm-ora-03": [
    { label: "Segmento", value: "Hatchback C" },
    { label: "Motor", value: "Eléctrico" },
    { label: "Potencia", value: "171 CV" },
    { label: "Transmisión", value: "Automática" },
    { label: "Tracción", value: "Delantera" },
    { label: "Combustible", value: "Eléctrico" },
    { label: "Autonomía", value: "~400 km" },
  ],
  "geely-geometry-ex5": [
    { label: "Segmento", value: "SUV C" },
    { label: "Motor", value: "Eléctrico" },
    { label: "Potencia", value: "218 CV" },
    { label: "Transmisión", value: "Automática" },
    { label: "Tracción", value: "Delantera" },
    { label: "Combustible", value: "Eléctrico" },
  ],
  "jac-t8": [
    { label: "Segmento", value: "Pick-up mediana" },
    { label: "Motor", value: "2.0 turbo diésel" },
    { label: "Potencia", value: "150 CV" },
    { label: "Transmisión", value: "Manual 6 vel." },
    { label: "Tracción", value: "4x2 / 4x4" },
    { label: "Combustible", value: "Diésel" },
  ],
};

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=500&fit=crop",
];

const FICHA_DEFAULT: FichaTecnicaRow[] = [
  { label: "Segmento", value: "Por confirmar" },
  { label: "Motor", value: "Por confirmar" },
  { label: "Potencia", value: "Por confirmar" },
  { label: "Transmisión", value: "Por confirmar" },
  { label: "Tracción", value: "Por confirmar" },
  { label: "Combustible", value: "Por confirmar" },
];

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
