import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Accessibility,
  Contrast,
  Menu,
  Minus,
  Moon,
  Plus,
  RotateCcw,
  Sun,
  Underline,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useA11y } from "@/lib/a11y";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/request", label: "Request a scribe" },
  { to: "/matching", label: "Matching" },
  { to: "/verify", label: "Verify OTP" },
  { to: "/dashboard", label: "Dashboard" },
];

function Logo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 rounded-md py-1 font-display text-lg font-semibold tracking-tight text-foreground"
    >
      <svg viewBox="0 0 40 40" className="h-8 w-8" aria-hidden="true">
        <path
          d="M8 30c8-2 12-6 16-12s6-10 8-12"
          className="ink-path"
          strokeWidth="2.6"
          style={{ stroke: "var(--teal)" }}
        />
        <path
          d="M6 34c10 1 20 1 28-1"
          className="ink-path"
          strokeWidth="2"
          style={{ stroke: "var(--accent)" }}
        />
      </svg>
      <span>
        SCRIBE <span className="text-accent">Connect</span>
      </span>
    </Link>
  );
}

function ThemeButton() {
  const { theme, cycleTheme } = useA11y();
  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Contrast;
  const next = theme === "light" ? "dark" : theme === "dark" ? "high contrast" : "light";
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={cycleTheme}
      aria-label={`Theme: ${theme === "hc" ? "high contrast" : theme}. Switch to ${next} theme`}
      className="rounded-lg"
    >
      <Icon aria-hidden="true" />
    </Button>
  );
}

function A11yMenu() {
  const {
    scale,
    increase,
    decrease,
    resetScale,
    highlightLinks,
    toggleHighlightLinks,
    theme,
    setTheme,
  } = useA11y();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Accessibility options" className="rounded-lg">
          <Accessibility aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 rounded-xl">
        <h3 className="font-display text-base font-semibold">Accessibility</h3>
        <p className="mt-1 text-xs text-muted-foreground">Your settings are saved on this device.</p>

        <div className="mt-4">
          <p className="text-sm font-medium">Text size</p>
          <div className="mt-2 flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={decrease} aria-label="Decrease text size">
              <Minus aria-hidden="true" />
            </Button>
            <span className="min-w-14 text-center font-mono text-sm" aria-live="polite">
              {Math.round(scale * 100)}%
            </span>
            <Button variant="outline" size="icon" onClick={increase} aria-label="Increase text size">
              <Plus aria-hidden="true" />
            </Button>
            <Button variant="ghost" size="icon" onClick={resetScale} aria-label="Reset text size">
              <RotateCcw aria-hidden="true" />
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <Button
            variant={highlightLinks ? "default" : "outline"}
            onClick={toggleHighlightLinks}
            aria-pressed={highlightLinks}
            className="w-full justify-start rounded-lg"
          >
            <Underline aria-hidden="true" />
            Highlight all clickables
          </Button>
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium">Theme</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {(["light", "dark", "hc"] as const).map((t) => (
              <Button
                key={t}
                size="sm"
                variant={theme === t ? "default" : "outline"}
                aria-pressed={theme === t}
                onClick={() => setTheme(t)}
                className="rounded-lg text-xs"
              >
                {t === "hc" ? "Contrast" : t === "light" ? "Light" : "Dark"}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function SiteNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to main content
      </a>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeProps={{ className: "text-accent underline underline-offset-8" }}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:text-accent"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <A11yMenu />
          <ThemeButton />
          <Button asChild className="hidden rounded-lg sm:inline-flex">
            <Link to="/signup">Get started</Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-lg lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={cn("border-t border-border lg:hidden", open ? "block" : "hidden")}
      >
        <nav aria-label="Mobile" className="mx-auto grid max-w-6xl gap-1 px-4 py-3">
          {links.concat({ to: "/signup", label: "Sign up" }).map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              activeProps={{ className: "text-accent" }}
              className="rounded-md px-2 py-3 text-base font-medium hover:bg-secondary"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}