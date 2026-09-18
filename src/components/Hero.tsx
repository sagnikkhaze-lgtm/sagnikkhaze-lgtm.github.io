import { useEffect, useRef, useState } from "react";
import { Github } from "lucide-react";
import { site } from "@/lib/site";
import { Socials } from "@/components/Socials";
import { Reveal, RevealWords } from "@/components/Reveal";
import { useScrollY } from "@/components/ScrollProgress";

function useTypewriter(text: string, speed = 45, startDelay = 800) {
  const [display, setDisplay] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(timer);
  }, [startDelay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplay(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, started]);

  return { display, done: display.length === text.length };
}

function FloatingShape({
  className,
  delay = "0s",
}: {
  className: string;
  delay?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute -z-10 border border-border opacity-20 ${className}`}
      style={{ animationDelay: delay }}
    />
  );
}

export function Hero() {
  const scrollY = useScrollY();
  const fade = Math.max(0, 1 - scrollY / 520);
  const { display: roleText, done: typeDone } = useTypewriter(site.role);

  return (
    <header className="relative overflow-hidden border-b border-border px-5 py-28 md:px-10 md:py-40">
      {/* Parallax grid backdrop */}
      <div
        aria-hidden
        className="grid-backdrop pointer-events-none absolute inset-0 -z-10"
        style={{ transform: `translate3d(0, ${scrollY * 0.18}px, 0)`, opacity: 0.9 }}
      />

      {/* Floating geometric shapes */}
      <FloatingShape
        className="animate-float right-[-3rem] top-10 h-[420px] w-[420px] rounded-full"
        delay="0s"
      />
      <FloatingShape
        className="animate-float-slow left-[-5rem] bottom-20 h-64 w-64 rotate-45"
        delay="2s"
      />
      <FloatingShape
        className="animate-float right-[15%] bottom-10 h-32 w-32 rounded-full"
        delay="4s"
      />

      {/* Decorative diagonal line */}
      <div
        aria-hidden
        className="pointer-events-none absolute -z-10 left-[10%] top-0 h-full w-px bg-gradient-to-b from-transparent via-border-strong/30 to-transparent"
        style={{ transform: `translate3d(0, ${scrollY * -0.1}px, 0)` }}
      />

      <div
        className="mx-auto max-w-6xl"
        style={{ opacity: fade, transform: `translate3d(0, ${scrollY * 0.08}px, 0)` }}
      >
        <Reveal direction="down" duration={520}>
          <p className="rule-label mb-4">{site.college}</p>
        </Reveal>

        <h1 className="text-5xl font-bold leading-[0.95] md:text-8xl">
          <RevealWords text="SAGNIK" className="block" />
          <RevealWords text="NAG" className="block" delay={120} />
        </h1>

        <Reveal delay={260} className="mt-6 max-w-xl">
          <p className="text-base text-muted-foreground md:text-lg font-mono">
            <span>{roleText}</span>
            <span
              className={`inline-block w-[2px] h-[1.1em] ml-0.5 align-text-bottom ${typeDone ? "animate-pulse" : ""}`}
              style={{
                backgroundColor: "var(--color-foreground)",
                animation: typeDone ? undefined : "blinkCaret 0.75s step-end infinite",
              }}
            />
          </p>
        </Reveal>

        <ul className="mt-8 flex w-fit flex-wrap gap-px border border-border bg-border">
          {site.stack.map((s, i) => (
            <Reveal
              key={s}
              as="li"
              direction="up"
              delay={340 + i * 60}
              duration={480}
              className="bg-background px-4 py-2 font-mono text-xs uppercase tracking-wider"
            >
              {s}
            </Reveal>
          ))}
        </ul>

        <Reveal delay={620} className="mt-10 flex flex-wrap gap-3">
          <a
            href="#projects"
            className="snap-transition border border-foreground bg-foreground px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-background hover:bg-background hover:text-foreground"
          >
            View projects
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer"
            className="snap-transition inline-flex items-center gap-2 border border-border px-5 py-2.5 font-mono text-xs uppercase tracking-wider hover:border-border-strong"
          >
            <Github className="h-4 w-4" /> GitHub
          </a>
        </Reveal>

        <Reveal delay={720}>
          <Socials className="mt-10" />
        </Reveal>
      </div>

      <div
        aria-hidden
        className="mt-20 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
        style={{ opacity: fade }}
      >
        <span className="h-px w-10 animate-pulse bg-border-strong" /> Scroll
      </div>
    </header>
  );
}
