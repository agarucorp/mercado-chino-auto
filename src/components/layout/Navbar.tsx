import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { SiteLogo } from "@/components/layout/SiteLogo";

const navItems = [
  { label: "Vender", href: "/vender" },
  { label: "Agencias", href: "/agencias" },
  { label: "Noticias", href: "/noticias" },
  { label: "Clasificados", href: "/clasificados" },
];

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => location.pathname.startsWith(href);

  return (
    <>
      <nav className="sticky top-0 z-50 navbar-glass">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            <SiteLogo linkToHome className="h-[2.4rem] md:h-12" />

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`nav-link px-4 py-2 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? "text-primary bg-primary/20"
                      : "text-accent-foreground hover:text-primary hover:bg-primary/10"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="p-2.5 rounded-lg text-accent-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="Iniciar sesión"
              >
                <User className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-accent-foreground hover:bg-primary/10 transition-colors"
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
              className="md:hidden border-t border-accent-foreground/10 navbar-glass"
            >
              <div className="container mx-auto px-4 py-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`nav-link block px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? "text-primary bg-primary/20"
                        : "text-accent-foreground hover:text-primary hover:bg-primary/10"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
};
