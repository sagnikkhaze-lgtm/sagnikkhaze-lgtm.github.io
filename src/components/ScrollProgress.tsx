import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-px bg-border">
      <div
        className="h-px bg-foreground"
        style={{
          width: `${progress * 100}%`,
          transition: "width 90ms linear",
          boxShadow: progress > 0 ? "0 0 8px 1px var(--glow-color), 0 0 2px var(--color-foreground)" : "none",
        }}
      />
    </div>
  );
}

/** Returns how far the page is scrolled in raw pixels, for parallax. */
export function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const update = () => setY(window.scrollY);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return y;
}
