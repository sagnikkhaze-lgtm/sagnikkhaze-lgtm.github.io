import { useEffect, useState } from "react";

/**
 * Custom crosshair cursor. Disabled on touch devices and when the visitor
 * prefers reduced motion.
 */
export function Crosshair() {
  const [enabled, setEnabled] = useState(false);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hot, setHot] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    setEnabled(true);
    document.documentElement.classList.add("crosshair-active");

    const move = (e: PointerEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const el = e.target as HTMLElement | null;
      setHot(Boolean(el?.closest("a, button, input, textarea, select, [data-crosshair-hot]")));
    };
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      document.documentElement.classList.remove("crosshair-active");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  if (!enabled) return null;

  const size = hot ? 38 : 26;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100]"
      style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
    >
      <div
        className="snap-transition absolute"
        style={{
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          opacity: down ? 0.6 : 1,
        }}
      >
        <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-foreground" />
        <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-foreground" />
        {hot && <span className="absolute inset-0 border border-foreground" />}
      </div>
    </div>
  );
}
