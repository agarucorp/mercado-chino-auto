import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AUTOPLAY_MS = 5000;
const TRANSITION_S = 1.4;

const HERO_SLIDES = [
  {
    src: "/thumb-1920-1272450.jpg",
    alt: "Autos chinos en Argentina — mercado local",
  },
  {
    src: "/thumb-1920-1237964.jpg",
    alt: "Vehículos chinos — referencia del mercado automotriz",
  },
];

const premiumEase = [0.22, 1, 0.36, 1] as const;

export function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    HERO_SLIDES.slice(1).forEach((slide) => {
      const img = new Image();
      img.src = slide.src;
    });
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[32rem] md:min-h-[36rem] lg:min-h-[40rem] overflow-hidden border-b border-border">
      <div className="absolute inset-0">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = current === index;

          return (
            <motion.img
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
              animate={{
                opacity: isActive ? 1 : 0,
                scale: isActive ? [1, 1.06] : 1,
              }}
              transition={{
                opacity: { duration: TRANSITION_S, ease: premiumEase },
                scale: {
                  duration: AUTOPLAY_MS / 1000,
                  ease: "linear",
                  times: [0, 1],
                },
              }}
              className="absolute inset-0 h-full w-full object-cover will-change-transform"
              style={{ zIndex: isActive ? 1 : 0 }}
              aria-hidden={!isActive}
            />
          );
        })}
      </div>

      <div className="absolute inset-0 z-10">
        <div className="container relative mx-auto h-full min-h-[32rem] md:min-h-[36rem] lg:min-h-[40rem]">
          <motion.h1
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="type-hero-headline text-white max-w-2xl mx-auto text-center absolute top-10 md:top-12 lg:top-14 inset-x-0"
          >
            El mayor portal de autos chinos en Argentina
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="absolute bottom-10 md:bottom-12 lg:bottom-14 inset-x-0 flex flex-col items-center gap-4 text-center px-4"
          >
            <p className="type-hero-tagline text-white max-w-2xl">
              Comprá, vendé e informate sobre el mercado automotriz chino en nuestro país
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3">
              <Button asChild variant="onDarkSolid">
                <Link to="/marcas">Explorar marcas</Link>
              </Button>
              <Button asChild variant="onDark">
                <a href="#contacto">Contacto</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
