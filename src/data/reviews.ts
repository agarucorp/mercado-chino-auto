export interface Review {
  id: string;
  marcaId: string;
  modeloId?: string;
  brand: string;
  model: string;
  year: number;
  author: string;
  date: string;
  rating: number;
  content: string;
  likes: number;
}

export const REVIEWS_DATA: Review[] = [
  {
    id: "1",
    marcaId: "byd",
    modeloId: "byd-song-pro",
    brand: "BYD",
    model: "Song Pro",
    year: 2024,
    author: "Carlos M.",
    date: "15 Ene 2026",
    rating: 5,
    content:
      "Increíble vehículo. La tecnología de las baterías blade es impresionante. Llevo 6 meses de uso y el consumo es mucho menor de lo esperado.",
    likes: 24,
  },
  {
    id: "2",
    marcaId: "chery",
    modeloId: "chery-tiggo-8",
    brand: "Chery",
    model: "Tiggo 8",
    year: 2023,
    author: "María L.",
    date: "12 Ene 2026",
    rating: 4,
    content:
      "Muy buena relación precio-calidad. El espacio interior es generoso para toda la familia. El motor turbo tiene buena respuesta.",
    likes: 18,
  },
  {
    id: "3",
    marcaId: "gwm",
    modeloId: "gwm-haval-h6",
    brand: "GWM",
    model: "HAVAL H6",
    year: 2024,
    author: "Roberto S.",
    date: "10 Ene 2026",
    rating: 4,
    content:
      "Sorprendido por la calidad de terminación. El diseño interior es muy moderno y los materiales son de buena calidad.",
    likes: 15,
  },
  {
    id: "4",
    marcaId: "jac",
    modeloId: "jac-t8",
    brand: "JAC",
    model: "T8",
    year: 2023,
    author: "Fernando G.",
    date: "8 Ene 2026",
    rating: 4,
    content:
      "Excelente pickup para trabajo y uso familiar. El motor diésel es económico y tiene buena fuerza.",
    likes: 12,
  },
];

export function getReviewsByModelo(marcaId: string, modeloId: string) {
  return REVIEWS_DATA.filter(
    (r) => r.marcaId === marcaId && r.modeloId === modeloId,
  );
}
