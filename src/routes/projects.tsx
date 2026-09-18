import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Github, MessageSquare } from "lucide-react";
import { useLiveRepos } from "@/lib/useGithub";
import { Markdown } from "@/components/Markdown";
import { LikeButton } from "@/components/LikeButton";
import { useEnquiry } from "@/components/EnquiryProvider";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Sagnik Nag" },
      {
        name: "description",
        content: "Full index of Sagnik Nag's public GitHub repositories with readmes, likes and enquiries.",
      },
      { property: "og:title", content: "Projects — Sagnik Nag" },
      {
        property: "og:description",
        content: "Full index of Sagnik Nag's public GitHub repositories with readmes.",
      },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { repos } = useLiveRepos();
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = repos.find((r) => r.id === activeId) ?? repos[0]!;
  const setActive = (r: { id: string }) => setActiveId(r.id);
  const { enquireAbout } = useEnquiry();

  return (
    <main className="min-h-screen px-5 py-16 md:px-10">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/"
          className="snap-transition mb-8 inline-flex items-center gap-2 border border-border px-3 py-1.5 font-mono text-xs hover:border-border-strong"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </Link>

        <p className="rule-label mb-2">Project index</p>
        <h1 className="mb-8 text-3xl font-bold md:text-4xl">All repositories</h1>

        <div className="grid gap-px border border-border bg-border md:grid-cols-[16rem_1fr]">
          <ul className="bg-card">
            {repos.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => setActive(r)}
                  className={cn(
                    "snap-transition w-full border-b border-border px-4 py-4 text-left",
                    active.id === r.id ? "bg-secondary" : "hover:bg-secondary/50",
                  )}
                >
                  <span className="font-mono text-sm">{r.title}</span>
                  <span className="mt-1 block font-mono text-[10px] text-muted-foreground">
                    {r.language} · {r.updated}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="bg-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">{active.title}</h2>
                <p className="font-mono text-[11px] text-muted-foreground">{active.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <LikeButton itemId={`repo:${active.id}`} />
                <a
                  href={active.url}
                  target="_blank"
                  rel="noreferrer"
                  className="snap-transition inline-flex items-center gap-1.5 border border-border px-2 py-1 font-mono text-xs hover:border-border-strong"
                >
                  <Github className="h-3.5 w-3.5" /> Repo
                </a>
                <button
                  type="button"
                  onClick={() => enquireAbout(active.title)}
                  className="snap-transition inline-flex items-center gap-1.5 border border-foreground bg-foreground px-2 py-1 font-mono text-xs text-background hover:bg-background hover:text-foreground"
                >
                  <MessageSquare className="h-3.5 w-3.5" /> Enquire
                </button>
              </div>
            </div>

            <div className="mt-4 border-t border-border pt-2">
              <Markdown source={active.readme} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
