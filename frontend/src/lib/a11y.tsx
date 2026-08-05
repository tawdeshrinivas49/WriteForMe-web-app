import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ThemeName = "light" | "dark" | "hc";

type A11yState = {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  cycleTheme: () => void;
  scale: number;
  increase: () => void;
  decrease: () => void;
  resetScale: () => void;
  highlightLinks: boolean;
  toggleHighlightLinks: () => void;
};

const A11yContext = createContext<A11yState | null>(null);

const MIN = 0.85;
const MAX = 1.6;

export function A11yProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("light");
  const [scale, setScale] = useState(1);
  const [highlightLinks, setHighlight] = useState(false);

  useEffect(() => {
    try {
      const t = localStorage.getItem("sc-theme") as ThemeName | null;
      const s = Number(localStorage.getItem("sc-scale"));
      const h = localStorage.getItem("sc-highlight");
      if (t) setThemeState(t);
      if (s && !Number.isNaN(s)) setScale(s);
      if (h === "1") setHighlight(true);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("hc", theme === "hc");
    root.classList.toggle("highlight-links", highlightLinks);
    root.style.fontSize = `${16 * scale}px`;
    try {
      localStorage.setItem("sc-theme", theme);
      localStorage.setItem("sc-scale", String(scale));
      localStorage.setItem("sc-highlight", highlightLinks ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [theme, scale, highlightLinks]);

  const setTheme = useCallback((t: ThemeName) => setThemeState(t), []);

  const value = useMemo<A11yState>(
    () => ({
      theme,
      setTheme,
      cycleTheme: () =>
        setThemeState((t) => (t === "light" ? "dark" : t === "dark" ? "hc" : "light")),
      scale,
      increase: () => setScale((s) => Math.min(MAX, Math.round((s + 0.1) * 100) / 100)),
      decrease: () => setScale((s) => Math.max(MIN, Math.round((s - 0.1) * 100) / 100)),
      resetScale: () => setScale(1),
      highlightLinks,
      toggleHighlightLinks: () => setHighlight((v) => !v),
    }),
    [theme, setTheme, scale, highlightLinks],
  );

  return <A11yContext.Provider value={value}>{children}</A11yContext.Provider>;
}

export function useA11y() {
  const ctx = useContext(A11yContext);
  if (!ctx) throw new Error("useA11y must be used inside A11yProvider");
  return ctx;
}