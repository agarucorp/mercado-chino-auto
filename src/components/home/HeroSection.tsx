import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const AUTOPLAY_MS = 5000;
const TRANSITION_S = 1.4;

const HERO_SLIDES = [
  {
    src: "/hero1.jpg",
    alt: "Auto chino en Buenos Aires, frente al Obelisco",
  },
  {
    src: "/hero2.jpg",
    alt: "Sedán chino en ruta de montaña",
  },
  {
    src: "/hero3.jpg",
    alt: "Utilitario chino frente a las Cataratas del Iguazú",
  },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<number | null>(null);

  // Decodificamos las 3 fotos antes de arrancar el carrusel: si el cambio de
  // slide le pide al navegador pintar un bitmap todavía no decodificado, el
  // frame se traba justo en ese instante y se ve como un glitch al pasar de
  // imagen. Con esto la decodificación ya terminó mucho antes de que haga falta.
  useEffect(() => {
    let cancelled = false;

    Promise.all(
      HERO_SLIDES.map((slide) => {
        const img = new Image();
        img.src = slide.src;
        return img.decode ? img.decode().catch(() => {}) : Promise.resolve();
      }),
    ).then(() => {
      if (cancelled) return;
      timerRef.current = window.setInterval(() => {
        setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
      }, AUTOPLAY_MS);
    });

    return () => {
      cancelled = true;
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
    };
  }, []);

  return (
    <section className="relative overflow-hidden h-[calc(100svh-4rem)] md:h-[calc(100svh-5rem)] min-h-[22rem] max-h-[40rem] md:max-h-[44rem]">
      <div className="absolute inset-0 bg-black">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = current === index;

          return (
            <img
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              loading="eager"
              decoding="async"
              fetchPriority={index === 0 ? "high" : "auto"}
              className="absolute inset-0 h-full w-full object-cover transition-opacity ease-out"
              style={{
                opacity: isActive ? 1 : 0,
                zIndex: isActive ? 1 : 0,
                transitionDuration: `${TRANSITION_S}s`,
                willChange: "opacity",
              }}
              aria-hidden={!isActive}
            />
          );
        })}
      </div>

      {/* Scrim fijo: garantiza contraste del texto sobre cualquiera de las fotos,
          que son todas de cielo/paisaje claro. Sin esto el contraste depende de
          qué tan clara sea la zona de la foto detrás del texto en cada slide. */}
      <div
        className="absolute inset-0 z-[5] bg-gradient-to-b from-black/65 via-black/10 to-black/70"
        aria-hidden
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-between gap-6 px-4 py-8 md:py-10 lg:py-12">
        <motion.h1
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="type-hero-headline text-white max-w-3xl text-center"
        >
          El mayor portal de autos chinos en Argentina
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <p className="type-hero-tagline text-white max-w-2xl">
            Comprá, vendé e informate sobre el mercado automotriz chino en nuestro país
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3">
            <Button asChild variant="onDarkSolid">
              <Link to="/marcas">Explorar marcas</Link>
            </Button>
            <Button asChild variant="onDark">
              <Link to="/vender">Publicá tu vehículo</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
