import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const LOGO_SRC = "/newLogo.svg";

interface SiteLogoProps {
  className?: string;
  linkToHome?: boolean;
}

export function SiteLogo({ className, linkToHome = false }: SiteLogoProps) {
  const logo = (
    <img
      src={LOGO_SRC}
      alt="AUCHAR"
      className={cn("h-8 md:h-10 w-auto", className)}
      width={1391}
      height={379}
    />
  );

  if (linkToHome) {
    return (
      <Link to="/" className="inline-flex shrink-0" aria-label="AUCHAR — inicio">
        {logo}
      </Link>
    );
  }

  return logo;
}
