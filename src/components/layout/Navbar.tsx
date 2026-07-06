import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { NavbarSearch } from "@/components/layout/NavbarSearch";
import { SiteLogo } from "@/components/layout/SiteLogo";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Noticias", href: "/noticias" },
  { label: "Clasificados", href: "/clasificados" },
];

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => location.pathname.startsWith(href);

  const linkClass = (href: string) =>
    cn(
      "nav-link px-4 py-2 transition-colors",
      isActive(href) ? "nav-link-active" : "nav-link-idle",
    );

  return (
    <>
      <nav className="sticky top-0 z-50 navbar-glass">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 md:gap-4 h-16 md:h-20">
            <SiteLogo linkToHome className="h-[2.4rem] md:h-12 shrink-0" />

            <NavbarSearch className="flex-1 max-w-xl mx-auto hidden sm:block" />

            <div className="hidden md:flex items-center gap-1 shrink-0">
              {navItems.map((item) => (
                <Link key={item.label} to={item.href} className={linkClass(item.href)}>
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-auto sm:ml-0">
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="p-2.5 rounded-lg text-white/80 hover:text-white hover:underline underline-offset-4 transition-colors"
                aria-label="Iniciar sesión"
              >
                <User className="w-5 h-5" />
              </button>

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

          <div className="sm:hidden pb-3">
            <NavbarSearch onNavigate={() => setIsMobileMenuOpen(false)} />
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
                    onClick={() => setIsMobileMenuOpen(false)}
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

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
};
