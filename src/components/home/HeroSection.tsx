import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AUTOPLAY_MS = 5000;

const HERO_SLIDES = [
  {
    id: "byd",
    image:
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1920&h=1080&fit=crop&q=85",
    alt: "BYD — referencia del mercado eléctrico chino en Argentina",
  },
  {
    id: "chery",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1920&h=1080&fit=crop&q=85",
    alt: "Chery Tiggo — SUV chino con fuerte presencia local",
  },
  {
    id: "gwm",
    image:
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1920&h=1080&fit=crop&q=85",
    alt: "GWM Haval — pick-ups y SUVs en crecimiento",
  },
  {
    id: "jac",
    image:
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&h=1080&fit=crop&q=85",
    alt: "JAC pickup — utilitarios chinos en Argentina",
  },
  {
    id: "ev",
    image:
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1920&h=1080&fit=crop&q=85",
    alt: "Vehículo eléctrico chino — nueva generación",
  },
];

export function HeroSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const onSelect = useCallback((carouselApi: CarouselApi) => {
    if (!carouselApi) return;
    setCurrent(carouselApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  useEffect(() => {
    if (!api || isPaused) return;

    const timer = window.setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [api, isPaused]);

  return (
    <section
      className="relative min-h-[32rem] md:min-h-[36rem] lg:min-h-[40rem] overflow-hidden border-b border-border"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        className="absolute inset-0 h-full w-full [&>div]:h-full [&>div>div]:h-full"
      >
        <CarouselContent className="h-full ml-0">
          {HERO_SLIDES.map((slide) => (
            <CarouselItem key={slide.id} className="pl-0 basis-full h-full">
              <img
                src={slide.image}
                alt={slide.alt}
                className="h-full w-full object-cover"
                loading={slide.id === "byd" ? "eager" : "lazy"}
                fetchPriority={slide.id === "byd" ? "high" : "auto"}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div
        className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25 pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none"
        aria-hidden
      />

      <div className="container relative z-10 mx-auto h-full min-h-[inherit] flex items-center py-16 md:py-20 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl space-y-5"
        >
          <h1 className="type-hero text-white max-w-xl drop-shadow-sm">
            Comprá, vendé e informate sobre autos chinos en Argentina
          </h1>
          <p className="type-lead text-white/85 max-w-lg">
            Marcas, fichas técnicas, reseñas, clasificados y comparativas del mercado local.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-2">
            <Button asChild size="lg" className="font-sans bg-white text-foreground hover:bg-white/90">
              <Link to="/marcas">Explorar marcas</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="font-sans border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm"
            >
              <Link to="/contacto">Contacto</Link>
            </Button>
          </div>
        </motion.div>
      </div>

      <div
        className="absolute bottom-6 left-0 right-0 z-10 flex justify-center gap-2"
        role="tablist"
        aria-label="Slides del hero"
      >
        {HERO_SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            role="tab"
            aria-selected={current === index}
            aria-label={`Ir a slide ${index + 1}`}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              current === index
                ? "w-8 bg-primary"
                : "w-2 bg-white/40 hover:bg-white/60",
            )}
          />
        ))}
      </div>
    </section>
  );
}
