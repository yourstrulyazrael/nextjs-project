import Link from "next/link";
import { ArrowLeft, CalendarCheck } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";

/** Header for inner pages: logo, theme switcher, and a back link. */
export function SiteHeader({
  backHref = "/",
  backLabel = "Home",
}: {
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <CalendarCheck className="size-5" />
          <span>ReserveIt</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <Button asChild variant="ghost" size="sm">
            <Link href={backHref}>
              <ArrowLeft /> {backLabel}
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
