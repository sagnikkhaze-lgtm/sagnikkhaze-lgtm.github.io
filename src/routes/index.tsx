import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { site } from "@/lib/site";
import { Hero } from "@/components/Hero";
import { Reveal, RevealWords } from "@/components/Reveal";
import { ScrollProgress } from "@/components/ScrollProgress";
import { repos } from "@/data/repos";
import { cPrograms } from "@/data/cPrograms";
import { ProjectsDeck } from "@/components/ProjectsDeck";
import { CSession } from "@/components/CSession";
import { EnquiryForm } from "@/components/EnquiryForm";
import { BlogSection } from "@/components/BlogSection";
import { Socials } from "@/components/Socials";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sagnik Nag — Software Developer Portfolio" },
      {
        name: "description",
        content:
          "Sagnik Nag builds in C, Python and Java. Browse the project deck, run the C fundamentals session, and send an enquiry.",
      },
      { property: "og:title", content: "Sagnik Nag — Software Developer Portfolio" },
      {
        property: "og:description",
        content: "Project deck, interactive C fundamentals session and direct enquiry line.",
      },
    ],
  }),
  component: Home,
});

function Section({
  id,
  label,
  title,
  children,
}: {
  id: string;
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-t border-border px-5 py-20 md:px-10">
      <div className="mx-auto max-w-6xl">
        <Reveal direction="right" duration={520}>
          <p className="rule-label mb-2">{label}</p>
        </Reveal>
        <h2 className="mb-8 text-2xl font-bold md:text-3xl">
          <RevealWords text={title} delay={80} step={55} />
        </h2>
        <Reveal delay={200} blur={false}>
          {children}
        </Reveal>
      </div>
    </section>
  );
}

function Home() {
  return (
    <main className="min-h-screen">
      <ScrollProgress />
      <Hero />

      <Section id="about" label="01 / About" title="Who is behind the commits">
        <div className="grid gap-px border border-border bg-border md:grid-cols-3">
          <div className="bg-card p-6 md:col-span-2">
            <p className="text-sm leading-relaxed text-muted-foreground">
              I'm Sagnik Nag, a software developer studying at {site.college}. My public work spans low-level C
              systems programming—pointers, structs, dynamic memory, and file I/O—up to applied GenAI tools built with
              Python, LangChain, and Gradio. Every repository ships with full documentation, clean architecture, and
              locked dependencies.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              I have {repos.length} public repositories and {cPrograms.length} C programs documented below, five of which
              you can execute right here in your browser.
            </p>
          </div>
          <div className="bg-card p-6">
            <p className="rule-label mb-3">Tools:</p>
            <ul className="space-y-1.5 font-mono text-xs text-muted-foreground">
              {site.tools.map((t) => (
                <li key={t}>• {t}</li>
              ))}
              <li>• macOS</li>
            </ul>
            <p className="rule-label mt-6 mb-3">Links</p>
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer"
              className="block font-mono text-xs text-foreground underline underline-offset-4"
            >
              github.com/sagnikkhaze-lgtm
            </a>
            <a
              href={`mailto:${site.email}`}
              className="mt-1 block font-mono text-xs text-foreground underline underline-offset-4"
            >
              {site.email}
            </a>
          </div>
        </div>
      </Section>

      <Section id="projects" label="02 / Projects" title="Every repository, as a deck">
        <ProjectsDeck />
        <Link
          to="/projects"
          className="snap-transition mt-2 inline-block border border-border px-4 py-2 font-mono text-xs uppercase tracking-wider hover:border-border-strong"
        >
          Open full project index
        </Link>
      </Section>

      <Section id="c-session" label="03 / C Fundamentals" title="Run it, or walk through it">
        <CSession />
        <Link
          to="/c-fundamentals"
          className="snap-transition mt-2 inline-block border border-border px-4 py-2 font-mono text-xs uppercase tracking-wider hover:border-border-strong"
        >
          Open the session full screen
        </Link>
      </Section>

      <Section id="blog" label="04 / Blog" title="Notes, straight from GitHub">
        <BlogSection />
        <Link
          to="/blog"
          className="snap-transition mt-2 inline-block border border-border px-4 py-2 font-mono text-xs uppercase tracking-wider hover:border-border-strong"
        >
          Open the blog
        </Link>
      </Section>

      <Section id="contact" label="05 / Contact" title="Enquire about anything here">
        <div className="grid gap-px border border-border bg-border md:grid-cols-2">
          <div className="bg-card p-6">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Pressing “Enquire” on any project or program quotes it here automatically. Messages are stored and
              reach Sagnik at <span className="text-foreground">{site.email}</span>.
            </p>
            <a
              href={`mailto:${site.email}`}
              className="snap-transition mt-6 inline-flex items-center gap-2 border border-border px-4 py-2 font-mono text-xs hover:border-border-strong"
            >
              <Mail className="h-3.5 w-3.5" /> {site.email}
            </a>
          </div>
          <div className="bg-card p-6">
            <EnquiryForm />
          </div>
        </div>
      </Section>

      <footer className="border-t border-border px-5 py-8 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 font-mono text-[11px] text-muted-foreground">
          <span>© {new Date().getFullYear()} Sagnik Nag</span>
          <span>{site.college}</span>
        </div>
        <div className="mx-auto mt-5 max-w-6xl">
          <Socials />
        </div>
      </footer>
    </main>
  );
}
