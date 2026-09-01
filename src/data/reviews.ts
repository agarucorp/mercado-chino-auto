export interface ReviewReply {
  id: string;
  firstName: string;
  lastName: string;
  author: string;
  content: string;
  date: string;
  sortDate: string;
}

export interface Review {
  id: string;
  marcaId: string;
  modeloId?: string;
  brand: string;
  model: string;
  year: number;
  author: string;
  firstName?: string;
  lastName?: string;
  date: string;
  sortDate: string;
  rating: number;
  content: string;
  likes: number;
  replies: ReviewReply[];
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
    firstName: "Carlos",
    lastName: "Martínez",
    date: "15 Ene 2026",
    sortDate: "2026-01-15",
    rating: 5,
    content:
      "Increíble vehículo. La tecnología de las baterías blade es impresionante. Llevo 6 meses de uso y el consumo es mucho menor de lo esperado.",
    likes: 24,
    replies: [],
  },
  {
    id: "2",
    marcaId: "chery",
    modeloId: "chery-tiggo-8-pro",
    brand: "Chery",
    model: "Tiggo 8",
    year: 2023,
    author: "María L.",
    firstName: "María",
    lastName: "López",
    date: "12 Ene 2026",
    sortDate: "2026-01-12",
    rating: 4,
    content:
      "Muy buena relación precio-calidad. El espacio interior es generoso para toda la familia. El motor turbo tiene buena respuesta.",
    likes: 18,
    replies: [],
  },
  {
    id: "3",
    marcaId: "gwm",
    modeloId: "gwm-haval-h6",
    brand: "GWM",
    model: "HAVAL H6",
    year: 2024,
    author: "Roberto S.",
    firstName: "Roberto",
    lastName: "Sánchez",
    date: "10 Ene 2026",
    sortDate: "2026-01-10",
    rating: 4,
    content:
      "Sorprendido por la calidad de terminación. El diseño interior es muy moderno y los materiales son de buena calidad.",
    likes: 15,
    replies: [],
  },
  {
    id: "4",
    marcaId: "jac",
    modeloId: "jac-t8",
    brand: "JAC",
    model: "T8",
    year: 2023,
    author: "Fernando G.",
    firstName: "Fernando",
    lastName: "García",
    date: "8 Ene 2026",
    sortDate: "2026-01-08",
    rating: 4,
    content:
      "Excelente pickup para trabajo y uso familiar. El motor diésel es económico y tiene buena fuerza.",
    likes: 12,
    replies: [],
  },
  {
    id: "5",
    marcaId: "byd",
    modeloId: "byd-song-pro",
    brand: "BYD",
    model: "Song Pro",
    year: 2024,
    author: "Lucía P.",
    firstName: "Lucía",
    lastName: "Pérez",
    date: "5 Ene 2026",
    sortDate: "2026-01-05",
    rating: 5,
    content:
      "El híbrido enchufable superó mis expectativas en ciudad. Carga en casa sin problemas y el equipamiento es completísimo.",
    likes: 19,
    replies: [],
  },
  {
    id: "6",
    marcaId: "chery",
    modeloId: "chery-tiggo-8-pro",
    brand: "Chery",
    model: "Tiggo 8",
    year: 2024,
    author: "Diego R.",
    firstName: "Diego",
    lastName: "Ruiz",
    date: "3 Ene 2026",
    sortDate: "2026-01-03",
    rating: 4,
    content:
      "Las siete plazas son reales, no apretadas. Buen comportamiento en ruta y service accesible.",
    likes: 11,
    replies: [],
  },
];

export function getReviewsByModelo(marcaId: string, modeloId: string) {
  return REVIEWS_DATA.filter(
    (r) => r.marcaId === marcaId && r.modeloId === modeloId,
  );
}

export interface ModeloReviewStats {
  marcaId: string;
  modeloId: string;
  brand: string;
  model: string;
  count: number;
  avgRating: number;
  totalLikes: number;
}
