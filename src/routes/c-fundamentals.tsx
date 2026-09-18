import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Github } from "lucide-react";
import { CSession } from "@/components/CSession";
import { cPrograms } from "@/data/cPrograms";

export const Route = createFileRoute("/c-fundamentals")({
  head: () => ({
    meta: [
      { title: "C Fundamentals Session — Sagnik Nag" },
      {
        name: "description",
        content:
          "Run Sagnik Nag's C practice programs in a simulated terminal, or walk through the source, concepts and compile commands.",
      },
      { property: "og:title", content: "C Fundamentals Session — Sagnik Nag" },
      {
        property: "og:description",
        content: "An interactive session built from the C-practice-fundamentals repository.",
      },
    ],
  }),
  component: CFundamentalsPage,
});

function CFundamentalsPage() {
  return (
    <main className="min-h-screen px-5 py-16 md:px-10">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/"
          className="snap-transition mb-8 inline-flex items-center gap-2 border border-border px-3 py-1.5 font-mono text-xs hover:border-border-strong"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </Link>

        <p className="rule-label mb-2">C-practice-fundamentals</p>
        <h1 className="text-3xl font-bold md:text-4xl">Interactive C session</h1>
        <p className="mb-8 mt-3 max-w-2xl text-sm text-muted-foreground">
          {cPrograms.length} programs from the repository. Five of them run interactively in the browser with the
          original prompts and output; the rest are laid out with source, key concepts and the exact compile command.
        </p>

        <CSession />

        <a
          href="https://github.com/sagnikkhaze-lgtm/C-practice-fundamentals"
          target="_blank"
          rel="noreferrer"
          className="snap-transition mt-4 inline-flex items-center gap-2 border border-border px-4 py-2 font-mono text-xs hover:border-border-strong"
        >
          <Github className="h-3.5 w-3.5" /> View the repository
        </a>
      </div>
    </main>
  );
}
