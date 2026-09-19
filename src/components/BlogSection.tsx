import { useState } from "react";
import { ArrowUpRight, X, Sparkles } from "lucide-react";
import { useBlogPosts } from "@/lib/useGithub";
import { site } from "@/lib/site";
import { Markdown } from "./Markdown";
import { LikeButton } from "./LikeButton";
import { useInView } from "./Reveal";
import { AskAIDialog } from "./AskAIDialog";
import type { BlogPost } from "@/lib/github.functions";

export function BlogSection() {
  const { posts, isLoading } = useBlogPosts();
  const [reading, setReading] = useState<BlogPost | null>(null);
  const [askingAI, setAskingAI] = useState<BlogPost | null>(null);
  const { ref: gridRef, inView } = useInView<HTMLUListElement>();

  if (isLoading) {
    return (
      <div className="grid gap-px border border-border bg-border md:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className="bg-card p-6">
            <div className="h-4 w-20 animate-shimmer rounded" />
            <div className="mt-4 h-6 w-48 animate-shimmer rounded" />
            <div className="mt-3 h-4 w-full animate-shimmer rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          No posts yet. Add a markdown file to the{" "}
          <span className="font-mono text-foreground">blog/</span> folder of your profile repository
          and it appears here within minutes — the first{" "}
          <span className="font-mono text-foreground"># Heading</span> becomes the title, and a name
          like <span className="font-mono text-foreground">2026-09-18-first-post.md</span> sets the
          date.
        </p>
        <a
          href={site.blogSource}
          target="_blank"
          rel="noreferrer"
          className="snap-transition mt-4 inline-flex items-center gap-2 border border-border px-4 py-2 font-mono text-xs hover:border-border-strong"
        >
          Open the blog folder <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    );
  }

  return (
    <>
      <ul ref={gridRef} className="grid gap-px border border-border bg-border md:grid-cols-2">
        {posts.map((post, i) => (
          <li
            key={post.slug}
            className="flex flex-col bg-card p-6 card-hover-lift"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(20px)",
              transition: `opacity 500ms cubic-bezier(0.16, 1, 0.3, 1) ${i * 100}ms, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) ${i * 100}ms`,
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="rule-label">{post.date || "Undated"}</p>
              <LikeButton itemId={`post:${post.slug}`} />
            </div>
            <h3 className="mt-3 font-mono text-lg font-bold leading-tight">{post.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setReading(post)}
                className="snap-transition border border-border px-3 py-2 font-mono text-xs uppercase tracking-wider hover:border-border-strong"
              >
                Read
              </button>
              <button
                type="button"
                onClick={() => setAskingAI(post)}
                className="snap-transition inline-flex items-center justify-center gap-1.5 border border-foreground bg-foreground px-3 py-2 font-mono text-xs uppercase tracking-wider text-background hover:bg-background hover:text-foreground"
              >
                <Sparkles className="h-3.5 w-3.5" /> Ask AI
              </button>
            </div>
          </li>
        ))}
      </ul>

      {askingAI && (
        <AskAIDialog
          itemTitle={askingAI.title}
          itemContext={askingAI.body}
          onClose={() => setAskingAI(null)}
        />
      )}


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
                  <p className="rule-label">{reading.date || "Post"}</p>
                  <h3 className="font-mono text-lg font-bold">{reading.title}</h3>
                </div>
                <button
                  type="button"
                  aria-label="Close post"
                  onClick={() => setReading(null)}
                  className="snap-transition border border-border p-1.5 hover:border-border-strong"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="px-5 pb-8 pt-2">
                <Markdown source={reading.body} />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
