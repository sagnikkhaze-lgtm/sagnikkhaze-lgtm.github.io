import { useEffect, useRef, useState } from "react";

type Direction = "up" | "down" | "left" | "right" | "none" | "scale";

const offsets: Record<Direction, string> = {
  up: "translate3d(0, 34px, 0)",
  down: "translate3d(0, -34px, 0)",
  left: "translate3d(38px, 0, 0)",
  right: "translate3d(-38px, 0, 0)",
  none: "translate3d(0, 0, 0)",
  scale: "translate3d(0, 0, 0) scale(0.92)",
};

const visibleTransform: Record<Direction, string> = {
  up: "translate3d(0, 0, 0)",
  down: "translate3d(0, 0, 0)",
  left: "translate3d(0, 0, 0)",
  right: "translate3d(0, 0, 0)",
  none: "translate3d(0, 0, 0)",
  scale: "translate3d(0, 0, 0) scale(1)",
};

export function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 620,
  className,
  as: Tag = "div",
  blur = true,
}: {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  as?: React.ElementType;
  blur?: boolean;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const blurAmount = direction === "scale" ? 8 : 6;

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? visibleTransform[direction] : offsets[direction],
        filter: blur ? (inView ? "blur(0px)" : `blur(${blurAmount}px)`) : undefined,
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, filter ${duration}ms ease ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </Tag>
  );
}

/** Splits a string into words that rise into place one after another. */
export function RevealWords({
  text,
  className,
  delay = 0,
  step = 70,
}: {
  text: string;
  className?: string;
  delay?: number;
  step?: number;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.2);
  const words = text.split(" ");

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <span
            className="inline-block"
            style={{
              transform: inView ? "translateY(0)" : "translateY(105%)",
              opacity: inView ? 1 : 0,
              transition: `transform 760ms cubic-bezier(0.16, 1, 0.3, 1) ${delay + i * step}ms, opacity 500ms ease ${delay + i * step}ms`,
            }}
          >
            {word}
          </span>
          {i < words.length - 1 ? <span>&nbsp;</span> : null}
        </span>
      ))}
    </span>
  );
}

/** Reveals children with staggered delays based on their index. */
export function RevealStagger({
  children,
  className,
  baseDelay = 0,
  step = 80,
  direction = "up",
}: {
  children: React.ReactNode[];
  className?: string;
  baseDelay?: number;
  step?: number;
  direction?: Direction;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div ref={ref} className={className}>
      {children.map((child, i) => (
        <div
          key={i}
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? visibleTransform[direction] : offsets[direction],
            filter: inView ? "blur(0px)" : "blur(4px)",
            transition: `opacity 500ms cubic-bezier(0.16, 1, 0.3, 1) ${baseDelay + i * step}ms, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) ${baseDelay + i * step}ms, filter 500ms ease ${baseDelay + i * step}ms`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
