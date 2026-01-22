import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, Mail } from "lucide-react";

const footerLinks = {
  secciones: [
    { label: "Noticias", href: "/" },
    { label: "Marcas", href: "/marcas" },
    { label: "Reseñas", href: "/resenas" },
    { label: "Clasificados", href: "/clasificados" },
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
    { label: "Contacto", href: "/contacto" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "Youtube" },
];

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-lg">AC</span>
              </div>
              <div>
                <span className="font-display font-bold text-xl text-background">AutoChina</span>
                <span className="font-display font-bold text-xl text-primary"> Argentina</span>
              </div>
            </Link>
            <p className="text-background/70 text-sm mb-6">
              Tu portal de noticias, reseñas y clasificados de vehículos chinos en Argentina.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Secciones */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Secciones</h4>
            <ul className="space-y-2">
              {footerLinks.secciones.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-background/70 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Marcas */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Marcas Populares</h4>
            <ul className="space-y-2">
              {footerLinks.marcas.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-background/70 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Legal */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Suscribite</h4>
            <p className="text-background/70 text-sm mb-4">
              Recibí las últimas noticias en tu correo.
            </p>
            <div className="flex gap-2 mb-6">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 px-4 py-2 rounded-lg bg-background/10 border border-background/20 text-background placeholder:text-background/50 text-sm focus:outline-none focus:border-primary"
              />
              <button className="px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg transition-colors">
                <Mail className="w-5 h-5" />
              </button>
            </div>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-background/70 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 mt-12 pt-8 text-center">
          <p className="text-background/50 text-sm">
            © {new Date().getFullYear()} AutoChina Argentina. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
