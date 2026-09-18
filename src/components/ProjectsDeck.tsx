import { useRef, useState, useCallback } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Github, MessageSquare, X } from "lucide-react";
import { type Repo } from "@/data/repos";
import { useLiveRepos } from "@/lib/useGithub";
import { Markdown } from "./Markdown";
import { LikeButton } from "./LikeButton";
import { useEnquiry } from "./EnquiryProvider";
import { useInView } from "./Reveal";
import { cn } from "@/lib/utils";

function useTiltEffect() {
  const [style, setStyle] = useState<React.CSSProperties>({});

  const onMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setStyle({
      transform: `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.04)`,
      transition: "transform 120ms ease-out",
    });
  }, []);

  const onLeave = useCallback(() => {
    setStyle({
      transform: "perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)",
      transition: "transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)",
    });
  }, []);

  return { style, onMove, onLeave };
}

export function ProjectsDeck() {
  const { repos } = useLiveRepos();
  const trackRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [reading, setReading] = useState<Repo | null>(null);
  const { enquireAbout } = useEnquiry();
  const drag = useRef<{ x: number; left: number } | null>(null);
  const { ref: deckRef, inView } = useInView<HTMLDivElement>();

  function scrollByCard(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 420), behavior: "smooth" });
  }

  return (
    <div ref={deckRef}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="rule-label">Swipe / drag / arrow keys</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Previous project"
            className="snap-transition border border-border p-2 hover:border-border-strong"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Next project"
            className="snap-transition border border-border p-2 hover:border-border-strong"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        tabIndex={0}
        role="group"
        aria-label="Project deck"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") scrollByCard(1);
          if (e.key === "ArrowLeft") scrollByCard(-1);
        }}
        onPointerDown={(e) => {
          const el = trackRef.current;
          if (!el) return;
          drag.current = { x: e.clientX, left: el.scrollLeft };
        }}
        onPointerMove={(e) => {
          const el = trackRef.current;
          if (!el || !drag.current) return;
          el.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerLeave={() => {
          drag.current = null;
          setHovered(null);
        }}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 outline-none"
      >
        {repos.map((repo, i) => {
          const dim = hovered !== null && hovered !== repo.id;
          return (
            <ProjectCard
              key={repo.id}
              repo={repo}
              dim={dim}
              isHovered={hovered === repo.id}
              inView={inView}
              index={i}
              onHover={() => setHovered(repo.id)}
              onRead={() => setReading(repo)}
              onEnquire={() => enquireAbout(repo.title)}
            />
          );
        })}
      </div>

      {reading && (
        <>
          <div
            className="fixed inset-0 z-50 bg-background/85 backdrop-blur-sm animate-backdrop-in"
            onClick={() => setReading(null)}
          />
          <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 md:p-10">
            <div className="w-full max-w-3xl border border-border-strong bg-card animate-modal-in">
              <div className="sticky top-0 flex items-center justify-between gap-4 border-b border-border bg-card px-5 py-4">
                <div>
                  <p className="rule-label">Readme</p>
                  <h3 className="font-mono text-lg font-bold">{reading.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={reading.url}
                    target="_blank"
                    rel="noreferrer"
                    className="snap-transition inline-flex items-center gap-2 border border-border px-3 py-1.5 font-mono text-xs hover:border-border-strong"
                  >
                    <Github className="h-3.5 w-3.5" /> Repo
                  </a>
                  <button
                    type="button"
                    aria-label="Close readme"
                    onClick={() => setReading(null)}
                    className="snap-transition border border-border p-1.5 hover:border-border-strong"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="px-5 pb-8 pt-2">
                <Markdown source={reading.readme} />
                <button
                  type="button"
                  onClick={() => {
                    setReading(null);
                    enquireAbout(reading.title);
                  }}
                  className="snap-transition mt-4 w-full border border-foreground bg-foreground px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-background hover:bg-background hover:text-foreground"
                >
                  Enquire about {reading.title}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ProjectCard({
  repo,
  dim,
  isHovered,
  inView,
  index,
  onHover,
  onRead,
  onEnquire,
}: {
  repo: Repo;
  dim: boolean;
  isHovered: boolean;
  inView: boolean;
  index: number;
  onHover: () => void;
  onRead: () => void;
  onEnquire: () => void;
}) {
  const tilt = useTiltEffect();

  return (
    <article
      onPointerEnter={onHover}
      onPointerMove={tilt.onMove}
      onPointerLeave={tilt.onLeave}
      style={{
        ...(isHovered ? tilt.style : {}),
        opacity: inView ? (dim ? 0.4 : 1) : 0,
        transform: inView
          ? isHovered
            ? tilt.style.transform
            : dim
              ? "scale(0.98)"
              : "scale(1)"
          : "translateY(30px) scale(0.95)",
        filter: dim ? "blur(3px)" : "blur(0px)",
        transition: `opacity 500ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 60}ms, transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1), filter 300ms ease`,
      }}
      className="relative flex w-[min(86vw,22rem)] shrink-0 snap-center flex-col border border-border bg-card p-5"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <span className="rule-label">{repo.language}</span>
        <LikeButton itemId={`repo:${repo.id}`} />
      </div>

      <h3 className="font-mono text-lg font-bold leading-tight">{repo.title}</h3>
      <p className="mt-1 font-mono text-[11px] text-muted-foreground">{repo.name}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {repo.description}
      </p>

      <dl className="mt-4 grid grid-cols-2 gap-px border border-border bg-border font-mono text-[11px]">
        <div className="bg-card px-3 py-2">
          <dt className="text-muted-foreground">Updated</dt>
          <dd>{repo.updated}</dd>
        </div>
        <div className="bg-card px-3 py-2">
          <dt className="text-muted-foreground">Stars</dt>
          <dd>{repo.stars}</dd>
        </div>
      </dl>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onRead}
          className="snap-transition inline-flex items-center justify-center gap-2 border border-border px-3 py-2 font-mono text-xs uppercase tracking-wider hover:border-border-strong"
        >
          <BookOpen className="h-3.5 w-3.5" /> Read
        </button>
        <button
          type="button"
          onClick={onEnquire}
          className="snap-transition inline-flex items-center justify-center gap-2 border border-foreground bg-foreground px-3 py-2 font-mono text-xs uppercase tracking-wider text-background hover:bg-background hover:text-foreground"
        >
          <MessageSquare className="h-3.5 w-3.5" /> Enquire
        </button>
      </div>
    </article>
  );
}
