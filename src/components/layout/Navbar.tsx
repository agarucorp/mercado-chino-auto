import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NavbarSearch } from "@/components/layout/NavbarSearch";
import { SiteLogo } from "@/components/layout/SiteLogo";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Modelos", href: "/marcas" },
  { label: "Noticias", href: "/noticias" },
  { label: "Clasificados", href: "/clasificados" },
  { label: "Vender", href: "/vender" },
];

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => location.pathname.startsWith(href);

  const linkClass = (href: string) =>
    cn(
      "nav-link px-3 py-2 transition-colors",
      isActive(href) ? "nav-link-active" : "nav-link-idle",
    );

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 navbar-glass">
      <div className="container mx-auto">
        <div className="flex items-center gap-3 md:gap-4 h-16 md:h-20">
          <SiteLogo linkToHome className="h-[2.4rem] md:h-12 shrink-0" />

          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navItems.map((item) => (
              <Link key={item.label} to={item.href} className={linkClass(item.href)}>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <NavbarSearch onNavigate={closeMobileMenu} />

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white/80 hover:text-white transition-colors"
              aria-label="Menú"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 navbar-glass"
          >
            <div className="container mx-auto py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={closeMobileMenu}
                  className={cn(linkClass(item.href), "block px-4 py-3")}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
