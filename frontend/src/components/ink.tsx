import { cn } from "@/lib/utils";

/** Hand-drawn, slightly imperfect underline that draws itself. */
export function InkUnderline({
  className,
  loop = false,
  width = 240,
}: {
  className?: string;
  loop?: boolean;
  width?: number;
}) {
  return (
    <svg
      viewBox="0 0 240 18"
      width={width}
      height={18}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="none"
      className={cn("ink-illustration block max-w-full", className)}
    >
      <path
        d="M3 12.4c26-4.6 53.7-6.9 82.2-7.3 30.4-.5 61 1.4 91.4 4.1 18.6 1.7 37.1 3.9 60.9 8.2"
        className={cn("ink-path", loop ? "animate-ink-loop" : "animate-ink-draw")}
        style={{ ["--dash" as string]: 300 }}
        strokeWidth={3}
      />
      <path
        d="M16 16.2c40-3.4 82-5 124.5-4.2"
        className="ink-path animate-ink-draw"
        style={{ ["--dash" as string]: 200, opacity: 0.4, animationDelay: "0.35s" }}
        strokeWidth={1.6}
      />
    </svg>
  );
}

/** Looping "connecting line" — two points joined by a wandering ink stroke. */
export function InkConnector({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 900 220"
      aria-hidden="true"
      focusable="false"
      className={cn("ink-illustration w-full", className)}
    >
      <path
        d="M20 168c86-14 132-104 214-104 74 0 96 96 176 96s108-92 186-92c62 0 96 52 164 62"
        className="ink-path animate-ink-loop"
        style={{ ["--dash" as string]: 1200 }}
        strokeWidth={2.6}
      />
      <path
        d="M28 182c92-10 140-96 220-96 76 0 98 94 174 94"
        className="ink-path animate-ink-loop"
        style={{ ["--dash" as string]: 900, opacity: 0.35, animationDelay: "0.8s" }}
        strokeWidth={1.6}
      />
      <circle cx="20" cy="168" r="6" fill="var(--teal)" />
      <circle cx="760" cy="130" r="6" fill="var(--accent)" />
    </svg>
  );
}

/** Loading indicator: the ink line writes a word instead of spinning. */
export function InkWriting({
  label = "Writing…",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)} role="status">
      <svg
        viewBox="0 0 320 90"
        aria-hidden="true"
        focusable="false"
        className="ink-illustration h-24 w-full max-w-[320px]"
      >
        {/* a cursive-ish 'scribe' stroke */}
        <path
          d="M28 62c14-30 26-34 30-18s-10 34-2 38 20-16 24-30 14-16 14 2-4 26 4 26 16-14 20-28 12-14 12 2-2 24 6 24 18-16 22-30 12-12 12 4 0 22 8 22c10 0 16-10 22-22"
          className="ink-path animate-ink-loop"
          style={{ ["--dash" as string]: 700 }}
          strokeWidth={3}
        />
        <path
          d="M20 78c78-6 168-8 268-4"
          className="ink-path animate-ink-loop"
          style={{ ["--dash" as string]: 300, opacity: 0.35, animationDelay: "0.5s" }}
          strokeWidth={1.6}
        />
      </svg>
      <p className="text-sm text-muted-foreground">{label}</p>
      <span className="sr-only">Loading</span>
    </div>
  );
}

/** Simple line-art illustrations used on the "Who it's for" cards. */
export function InkGlyph({ kind, className }: { kind: string; className?: string }) {
  const paths: Record<string, string> = {
    candidate:
      "M40 70c0-14 10-24 24-24s24 10 24 24M64 46a14 14 0 100-28 14 14 0 000 28M20 86h88",
    volunteer:
      "M64 96c-18-14-36-26-36-44 0-12 9-20 20-20 8 0 13 4 16 9 3-5 8-9 16-9 11 0 20 8 20 20 0 18-18 30-36 44z",
    contributor:
      "M64 22v84M44 40c0-10 9-14 20-14s20 4 20 12-8 12-20 14-20 6-20 16 9 14 20 14 20-5 20-13",
    organization: "M28 96V44l36-22 36 22v52M52 96V70h24v26M44 56h8M80 56h8",
    pen: "M24 96c14-4 22-8 30-16l38-38 12 12-38 38c-8 8-12 16-16 30M86 34l12 12",
  };
  return (
    <svg
      viewBox="0 0 128 112"
      aria-hidden="true"
      focusable="false"
      className={cn("ink-illustration h-20 w-20", className)}
    >
      <path
        d={paths[kind] ?? paths["pen"]}
        className="ink-path"
        strokeWidth={2.6}
        style={{ stroke: "currentColor" }}
      />
    </svg>
  );
}

/** Section heading with a self-drawing hand-inked underline. */
export function SectionTitle({
  children,
  eyebrow,
  className,
}: {
  children: React.ReactNode;
  eyebrow?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-8", className)}>
      {eyebrow ? (
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
      ) : null}
      <h2 className="text-2xl leading-tight font-semibold text-foreground sm:text-3xl">
        {children}
      </h2>
      <InkUnderline className="mt-1 h-3 w-44" />
    </div>
  );
}

/** Anonymous "bitmoji"-style avatar built from initials + deterministic line art. */
export function InkAvatar({
  initials,
  size = 56,
  className,
}: {
  initials: string;
  size?: number;
  className?: string;
}) {
  const seed = initials
    .split("")
    .reduce((a, c) => a + c.charCodeAt(0), 0);
  const hair = seed % 3;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border-2 border-border bg-secondary",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 64 64" width={size * 0.8} height={size * 0.8} aria-hidden="true">
        <circle cx="32" cy="28" r="14" fill="none" stroke="var(--teal)" strokeWidth="2.2" />
        <path
          d={
            hair === 0
              ? "M18 24c2-12 26-14 28 0"
              : hair === 1
                ? "M18 26c0-14 28-14 28 0c0-6-6-8-14-8s-14 3-14 8z"
                : "M19 22c6-8 20-8 26 0M20 18c4-4 20-4 24 0"
          }
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M12 58c2-11 10-16 20-16s18 5 20 16"
          fill="none"
          stroke="var(--teal)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
      <span className="sr-only">{initials}</span>
    </span>
  );
}