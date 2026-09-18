import { MoreVertical, X, Github, Mail } from "lucide-react";
import { useEnquiry } from "./EnquiryProvider";
import { EnquiryForm } from "./EnquiryForm";
import { site } from "@/lib/site";

export function DotsMenu() {
  const { panelOpen, setPanelOpen } = useEnquiry();

  return (
    <>
      <button
        type="button"
        onClick={() => setPanelOpen(!panelOpen)}
        aria-label="Open contact menu"
        className="snap-transition fixed right-4 top-4 z-50 border border-border bg-background p-2 text-foreground hover:border-border-strong md:right-6 md:top-6"
      >
        {panelOpen ? <X className="h-5 w-5" /> : <MoreVertical className="h-5 w-5" />}
      </button>

      {panelOpen && (
        <>
          <button
            type="button"
            aria-label="Close contact menu"
            onClick={() => setPanelOpen(false)}
            className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm animate-backdrop-in"
          />
          <div className="fixed right-4 top-16 z-50 w-[min(92vw,26rem)] border border-border-strong bg-popover p-5 md:right-6 md:top-20 animate-slide-in-right">
            <p className="rule-label mb-1">Contact / Enquire</p>
            <h3 className="mb-4 font-mono text-lg font-bold">{site.name}</h3>
            <EnquiryForm compact />
            <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
              <a
                href={`mailto:${site.email}`}
                className="snap-transition inline-flex items-center gap-2 border border-border px-3 py-1.5 font-mono text-xs hover:border-border-strong"
              >
                <Mail className="h-3.5 w-3.5" /> {site.email}
              </a>
              <a
                href={site.github}
                target="_blank"
                rel="noreferrer"
                className="snap-transition inline-flex items-center gap-2 border border-border px-3 py-1.5 font-mono text-xs hover:border-border-strong"
              >
                <Github className="h-3.5 w-3.5" /> GitHub
              </a>
            </div>
          </div>
        </>
      )}
    </>
  );
}
