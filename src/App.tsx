import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import Index from "./pages/Index";
import Marcas from "./pages/Marcas";
import MarcaDetail from "./pages/MarcaDetail";
import ModeloDetail from "./pages/ModeloDetail";
import Noticias from "./pages/Noticias";
import Vender from "./pages/Vender";
import Contacto from "./pages/Contacto";
import Clasificados from "./pages/Clasificados";
import ClasificadoDetail from "./pages/ClasificadoDetail";
import CategoriaDetail from "./pages/CategoriaDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/marcas" element={<Marcas />} />
          <Route path="/marcas/:marcaSlug/:modeloSlug" element={<ModeloDetail />} />
          <Route path="/marcas/:slug" element={<MarcaDetail />} />
          <Route path="/agencias" element={<Navigate to="/marcas" replace />} />
          <Route path="/vender" element={<Vender />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/categorias/:slug" element={<CategoriaDetail />} />
          <Route path="/clasificados" element={<Clasificados />} />
          <Route path="/clasificados/:id" element={<ClasificadoDetail />} />
          <Route path="/resenas" element={<Navigate to="/clasificados" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
