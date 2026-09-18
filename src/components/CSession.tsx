import { useEffect, useRef, useState } from "react";
import { MessageSquare, Play, RotateCcw, Terminal } from "lucide-react";
import { cPrograms, type CProgram } from "@/data/cPrograms";
import { runners, type Session } from "@/lib/cRunners";
import { LikeButton } from "./LikeButton";
import { useEnquiry } from "./EnquiryProvider";
import { cn } from "@/lib/utils";

const runnable = cPrograms.filter((p) => p.runner);

export function CSession() {
  const [mode, setMode] = useState<"run" | "walk">("run");
  const [switching, setSwitching] = useState(false);

  function switchMode(next: "run" | "walk") {
    if (next === mode) return;
    setSwitching(true);
    setTimeout(() => {
      setMode(next);
      setSwitching(false);
    }, 200);
  }

  return (
    <div className="border border-border bg-card">
      <div className="flex border-b border-border">
        {(
          [
            ["run", "Run it", <Terminal key="t" className="h-3.5 w-3.5" />],
            ["walk", "Walk it", <Play key="p" className="h-3.5 w-3.5" />],
          ] as const
        ).map(([key, label, icon]) => (
          <button
            key={key}
            type="button"
            onClick={() => switchMode(key)}
            className={cn(
              "snap-transition relative inline-flex flex-1 items-center justify-center gap-2 border-r border-border px-4 py-3 font-mono text-xs uppercase tracking-wider last:border-r-0 overflow-hidden",
              mode === key ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {icon}
            {label}
            {/* Active indicator bar */}
            <span
              className={cn(
                "absolute bottom-0 left-0 h-[2px] bg-foreground transition-transform duration-300 w-full",
                mode === key ? "scale-x-100" : "scale-x-0",
              )}
            />
          </button>
        ))}
      </div>

      <div
        style={{
          opacity: switching ? 0 : 1,
          transform: switching ? "translateY(8px)" : "translateY(0)",
          transition: "opacity 200ms ease, transform 200ms ease",
        }}
      >
        {mode === "run" ? <RunIt /> : <WalkIt />}
      </div>
    </div>
  );
}

function TerminalOutput({ lines }: { lines: string[] }) {
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  return (
    <div
      ref={logRef}
      className="no-scrollbar h-72 overflow-y-auto whitespace-pre-wrap border border-border bg-terminal p-4 font-mono text-xs leading-relaxed text-terminal-foreground"
    >
      {lines.map((line, i) => (
        <div
          key={i}
          style={{
            animation: `terminalLine 200ms cubic-bezier(0.16, 1, 0.3, 1) ${Math.min(i * 30, 300)}ms both`,
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
}

function RunIt() {
  const [selected, setSelected] = useState<CProgram>(runnable[0] as CProgram);
  const [lines, setLines] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const { enquireAbout } = useEnquiry();

  function start(program: CProgram) {
    const make = runners[program.runner as string];
    if (!make) return;
    const s = make();
    setSession(s);
    setLines([`$ ${program.compile}`, ...s.boot()]);
    setInput("");
  }

  useEffect(() => {
    start(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected.id]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!session || session.isDone()) return;
    const value = input;
    setInput("");
    const out = session.send(value);
    setLines((l) => [...l, `> ${value}`, ...out]);
    if (session.isDone()) setLines((l) => [...l, "", "[process exited 0]"]);
  }

  return (
    <div className="grid gap-px bg-border md:grid-cols-[14rem_1fr]">
      <ul className="bg-card">
        {runnable.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => setSelected(p)}
              className={cn(
                "snap-transition w-full border-b border-border px-4 py-3 text-left font-mono text-xs",
                selected.id === p.id ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {p.title}
              <span className="mt-0.5 block text-[10px] text-muted-foreground">{p.file}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="bg-card p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="rule-label">Simulated terminal</p>
          <div className="flex items-center gap-2">
            <LikeButton itemId={`prog:${selected.id}`} />
            <button
              type="button"
              onClick={() => start(selected)}
              className="snap-transition inline-flex items-center gap-1.5 border border-border px-2 py-1 font-mono text-xs hover:border-border-strong"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Restart
            </button>
            <button
              type="button"
              onClick={() => enquireAbout(`${selected.title} (${selected.file})`)}
              className="snap-transition inline-flex items-center gap-1.5 border border-border px-2 py-1 font-mono text-xs hover:border-border-strong"
            >
              <MessageSquare className="h-3.5 w-3.5" /> Enquire
            </button>
          </div>
        </div>

        <TerminalOutput lines={lines} />

        <form onSubmit={submit} className="mt-2 flex">
          <span className="border border-r-0 border-border px-3 py-2 font-mono text-xs text-muted-foreground">
            stdin
          </span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={session?.isDone()}
            placeholder={session?.isDone() ? "program finished — restart to run again" : "type and press enter"}
            className="w-full border border-border bg-background px-3 py-2 font-mono text-xs outline-none focus:border-border-strong disabled:opacity-50"
            style={{
              caretColor: "var(--color-terminal-foreground)",
            }}
          />
        </form>
      </div>
    </div>
  );
}

function WalkIt() {
  const [selected, setSelected] = useState<CProgram>(cPrograms[0] as CProgram);
  const { enquireAbout } = useEnquiry();

  return (
    <div className="grid gap-px bg-border md:grid-cols-[14rem_1fr]">
      <ul className="no-scrollbar max-h-[34rem] overflow-y-auto bg-card">
        {cPrograms.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => setSelected(p)}
              className={cn(
                "snap-transition w-full border-b border-border px-4 py-3 text-left font-mono text-xs",
                selected.id === p.id ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {p.title}
              <span className="mt-0.5 block text-[10px] text-muted-foreground">{p.category}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="bg-card p-5">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="rule-label">{selected.category}</p>
            <h3 className="font-mono text-lg font-bold">{selected.title}</h3>
            <p className="font-mono text-[11px] text-muted-foreground">{selected.file}</p>
          </div>
          <div className="flex items-center gap-2">
            <LikeButton itemId={`prog:${selected.id}`} />
            <button
              type="button"
              onClick={() => enquireAbout(`${selected.title} (${selected.file})`)}
              className="snap-transition inline-flex items-center gap-1.5 border border-border px-2 py-1 font-mono text-xs hover:border-border-strong"
            >
              <MessageSquare className="h-3.5 w-3.5" /> Enquire
            </button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">{selected.description}</p>

        <p className="rule-label mt-5 mb-2">Key concepts</p>
        <ul className="flex flex-wrap gap-2">
          {selected.concepts.map((c) => (
            <li key={c} className="snap-transition border border-border px-2 py-1 font-mono text-[11px] text-muted-foreground hover:border-border-strong hover:text-foreground">
              {c}
            </li>
          ))}
        </ul>

        <p className="rule-label mt-5 mb-2">Highlight</p>
        <p className="border-l-2 border-border-strong pl-3 text-sm text-muted-foreground">{selected.highlight}</p>

        <p className="rule-label mt-5 mb-2">Compile &amp; run</p>
        <pre className="no-scrollbar overflow-x-auto border border-border bg-terminal p-3 font-mono text-xs text-terminal-foreground">
          {selected.compile}
        </pre>

        <p className="rule-label mt-5 mb-2">Source</p>
        <pre className="no-scrollbar max-h-96 overflow-auto border border-border bg-terminal p-4 font-mono text-xs leading-relaxed text-muted-foreground">
          {selected.source}
        </pre>
      </div>
    </div>
  );
}
