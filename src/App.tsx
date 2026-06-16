import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Marcas from "./pages/Marcas";
import MarcaDetail from "./pages/MarcaDetail";
import ModeloDetail from "./pages/ModeloDetail";
import Noticias from "./pages/Noticias";
import Agencias from "./pages/Agencias";
import Vender from "./pages/Vender";
import Contacto from "./pages/Contacto";
import Clasificados from "./pages/Clasificados";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/marcas" element={<Marcas />} />
          <Route path="/marcas/:marcaSlug/:modeloSlug" element={<ModeloDetail />} />
          <Route path="/marcas/:slug" element={<MarcaDetail />} />
          <Route path="/agencias" element={<Agencias />} />
          <Route path="/vender" element={<Vender />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/clasificados" element={<Clasificados />} />
          <Route path="/resenas" element={<Navigate to="/clasificados" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
