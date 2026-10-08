import { SiteLogo } from "@/components/layout/SiteLogo";
import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";

const footerLinks = {
  secciones: [
    { label: "Vender", href: "/vender" },
    { label: "Noticias", href: "/noticias" },
    { label: "Clasificados", href: "/clasificados" },
    { label: "Repuestos y talleres", href: "/repuestos" },
  ],
  marcas: [
    { label: "Chery", href: "/marcas/chery" },
    { label: "BYD", href: "/marcas/byd" },
    { label: "GWM", href: "/marcas/gwm" },
    { label: "Geely", href: "/marcas/geely" },
    { label: "JAC", href: "/marcas/jac" },
  ],
  legal: [
    { label: "Términos y Condiciones", href: "/terminos" },
    { label: "Política de Privacidad", href: "/privacidad" },
    { label: "Contacto", href: "#contacto", isAnchor: true },
  ],
};

const socialLinks = [
  {
    icon: Instagram,
    href: "https://www.instagram.com/autosdechinaenargentina/",
    label: "Instagram",
  },
];

export const Footer = () => {
  return (
    <footer className="bg-accent text-accent-foreground">
      <div className="container mx-auto py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="lg:col-span-1">
            <SiteLogo linkToHome className="mb-4" />
            <p className="type-body text-accent-foreground/70 mb-6 max-w-prose">
              Tu portal de noticias, reseñas y clasificados de vehículos chinos en Argentina.
            </p>
            <div className="flex gap-3 mb-8">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-accent-foreground/10 hover:bg-accent-foreground/20 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  {"isAnchor" in link && link.isAnchor ? (
                    <a
                      href={link.href}
                      className="type-body-sm text-accent-foreground/70 hover:text-accent-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="type-body-sm text-accent-foreground/70 hover:text-accent-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="type-h2 text-accent-foreground mb-4">Secciones</h2>
            <ul className="space-y-2">
              {footerLinks.secciones.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="type-body-sm text-accent-foreground/70 hover:text-accent-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="type-h2 text-accent-foreground mb-4">Marcas populares</h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
              {footerLinks.marcas.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="type-body-sm text-accent-foreground/70 hover:text-accent-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-accent-foreground/20 mt-12 pt-8">
          <a
            href="https://www.agarucorp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="type-meta text-accent-foreground/50 hover:text-accent-foreground transition-colors inline-flex items-center justify-center gap-1.5 mx-auto w-full"
          >
            Powered by <span className="text-accent-foreground">AgaruCorp</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
