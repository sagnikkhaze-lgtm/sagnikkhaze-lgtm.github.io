import { Github, Linkedin, Instagram, Mail, Twitter, type LucideIcon } from "lucide-react";
import { socials } from "@/lib/site";

const icons: Record<string, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  x: Twitter,
  email: Mail,
};

export function Socials({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex w-fit flex-wrap gap-px border border-border bg-border ${className}`}>
      {socials.map((s) => {
        const Icon = icons[s.id] ?? Mail;
        return (
          <li key={s.id} className="bg-card">
            <a
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="snap-transition inline-flex items-center gap-2 px-4 py-3 font-mono text-xs hover:bg-secondary"
            >
              <Icon className="h-4 w-4" />
              <span className="uppercase tracking-wider">{s.label}</span>
              <span className="text-muted-foreground">{s.handle}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
