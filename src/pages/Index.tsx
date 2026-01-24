import { Layout } from "@/components/layout/Layout";
import { NewsGrid } from "@/components/news/NewsGrid";
import { NewsCardProps } from "@/components/news/NewsCard";

// Placeholder news data
const newsData: NewsCardProps[] = [
  {
    id: "1",
    title: "BYD lanza el nuevo Seal U DM-i en Argentina: precios y versiones disponibles",
    excerpt: "La marca china presenta su SUV híbrido enchufable con una autonomía combinada de hasta 1.200 km y tecnología de última generación.",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop",
    category: "Lanzamiento",
    source: "Autoblog",
    date: "22 Ene 2026",
    featured: true,
  },
  {
    id: "2",
    title: "Chery Tiggo 8 Pro Max: llega la versión tope de gama al mercado argentino",
    excerpt: "Con motor turbo de 197 CV y caja automática de 7 velocidades, el nuevo Tiggo 8 Pro Max promete redefinir el segmento.",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
    category: "Novedad",
    source: "Motor1",
    date: "21 Ene 2026",
  },
  {
    id: "3",
    title: "GWM confirma la llegada del ORA 03 eléctrico para el segundo semestre",
    excerpt: "El compacto eléctrico de Great Wall Motors llegará con 400 km de autonomía y un precio competitivo.",
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=600&fit=crop",
    category: "Eléctricos",
    source: "Parabrisas",
    date: "20 Ene 2026",
  },
  {
    id: "4",
    title: "Geely anuncia nueva planta de ensamblaje en Córdoba",
    excerpt: "La inversión de 300 millones de dólares generará más de 2.000 puestos de trabajo directos.",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop",
    category: "Industria",
    source: "La Nación",
    date: "19 Ene 2026",
  },
  {
    id: "5",
    title: "JAC presenta el nuevo pickup T8 con motor diésel de 150 CV",
    excerpt: "La pickup china busca competir directamente con las marcas establecidas del segmento.",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop",
    category: "Pickups",
    source: "16 Válvulas",
    date: "18 Ene 2026",
  },
  {
    id: "6",
    title: "Nuevas regulaciones de importación favorecen a vehículos eléctricos chinos",
    excerpt: "El gobierno anunció beneficios arancelarios para vehículos de bajas emisiones importados.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    category: "Política",
    source: "Infobae",
    date: "17 Ene 2026",
  },
  {
    id: "7",
    title: "Comparativa: los 5 SUV chinos más vendidos del mes",
    excerpt: "Analizamos las características, precios y equipamiento de los modelos más populares.",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop",
    category: "Comparativas",
    source: "Autocity",
    date: "16 Ene 2026",
  },
];

const Index = () => {
  return (
    <Layout>
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground">
                Últimas Noticias
              </h2>
              <p className="text-muted-foreground mt-1">
                Las novedades más recientes del mercado automotriz chino
              </p>
            </div>
          </div>
          
          <NewsGrid news={newsData} />
        </div>
      </section>
    </Layout>
  );
};

export default Index;
