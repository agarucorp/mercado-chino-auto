import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { Loader2 } from "lucide-react";
import { Suspense, lazy } from "react";
import { AuthProvider } from "@/hooks/useAuth";

const Index = lazy(() => import("./pages/Index"));
const Marcas = lazy(() => import("./pages/Marcas"));
const MarcaDetail = lazy(() => import("./pages/MarcaDetail"));
const ModeloDetail = lazy(() => import("./pages/ModeloDetail"));
const Noticias = lazy(() => import("./pages/Noticias"));
const Vender = lazy(() => import("./pages/Vender"));
const Contacto = lazy(() => import("./pages/Contacto"));
const Clasificados = lazy(() => import("./pages/Clasificados"));
const ClasificadoDetail = lazy(() => import("./pages/ClasificadoDetail"));
const CategoriaDetail = lazy(() => import("./pages/CategoriaDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));
const NoticiaDetail = lazy(() => import("./pages/NoticiaDetail"));
const AdminHome = lazy(() => import("./pages/AdminHome"));
const AdminNoticias = lazy(() => import("./pages/AdminNoticias"));
const AdminModelos = lazy(() => import("./pages/AdminModelos"));
const AdminModeloHistorial = lazy(() => import("./pages/AdminModeloHistorial"));
const AdminPublicaciones = lazy(() => import("./pages/AdminPublicaciones"));
const AdminSolicitudDetail = lazy(() => import("./pages/AdminSolicitudDetail"));

const queryClient = new QueryClient();

function RouteFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/noticias" element={<Noticias />} />
                <Route path="/noticias/:id" element={<NoticiaDetail />} />
                <Route path="/admin" element={<AdminHome />} />
                <Route path="/admin/noticias" element={<AdminNoticias />} />
                <Route path="/admin/modelos" element={<AdminModelos />} />
                <Route path="/admin/modelos/:marcaId/:modeloId" element={<AdminModeloHistorial />} />
                <Route path="/admin/solicitudes" element={<AdminPublicaciones />} />
                <Route path="/admin/solicitudes/:id" element={<AdminSolicitudDetail />} />
                <Route path="/admin/publicaciones" element={<Navigate to="/admin/solicitudes" replace />} />
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
                <Route path="/login" element={<Navigate to="/admin" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
