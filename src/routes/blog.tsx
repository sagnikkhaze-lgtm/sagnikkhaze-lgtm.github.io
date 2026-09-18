import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { BlogSection } from "@/components/BlogSection";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Sagnik Nag" },
      {
        name: "description",
        content:
          "Notes and write-ups by Sagnik Nag on C, Python, applied GenAI and everyday software engineering.",
      },
      { property: "og:title", content: "Blog — Sagnik Nag" },
      {
        property: "og:description",
        content: "Notes and write-ups on C, Python and applied GenAI by Sagnik Nag.",
      },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  return (
    <main className="min-h-screen px-5 py-16 md:px-10">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/"
          className="snap-transition mb-8 inline-flex items-center gap-2 border border-border px-3 py-1.5 font-mono text-xs hover:border-border-strong"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </Link>
        <p className="rule-label mb-2">Writing</p>
        <h1 className="mb-8 text-3xl font-bold md:text-4xl">Blog</h1>
        <BlogSection />
      </div>
    </main>
  );
}
