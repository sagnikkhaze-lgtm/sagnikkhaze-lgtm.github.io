import type { ReactNode } from "react";

/** Small, dependency-free renderer for the repository README files. */
export function Markdown({ source }: { source: string }) {
  const lines = source.split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  const inline = (text: string): ReactNode => {
    // strip badge images, keep link text
    const cleaned = text
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
      .replace(/<[^>]+>/g, "");
    const parts = cleaned.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).filter(Boolean);
    return parts.map((p, idx) => {
      if (p.startsWith("`") && p.endsWith("`")) {
        return (
          <code key={idx} className="bg-secondary px-1 font-mono text-[0.85em]">
            {p.slice(1, -1)}
          </code>
        );
      }
      if (p.startsWith("**") && p.endsWith("**")) {
        return (
          <strong key={idx} className="text-foreground">
            {p.slice(2, -2)}
          </strong>
        );
      }
      return <span key={idx}>{p}</span>;
    });
  };

  while (i < lines.length) {
    const line = lines[i] ?? "";

    if (line.trim().startsWith("```")) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !(lines[i] ?? "").trim().startsWith("```")) {
        code.push(lines[i] ?? "");
        i++;
      }
      i++;
      blocks.push(
        <pre
          key={key++}
          className="no-scrollbar my-4 overflow-x-auto border border-border bg-terminal p-4 font-mono text-xs leading-relaxed text-muted-foreground"
        >
          {code.join("\n")}
        </pre>,
      );
      continue;
    }

    if (line.trim().startsWith("|")) {
      const rows: string[] = [];
      while (i < lines.length && (lines[i] ?? "").trim().startsWith("|")) {
        rows.push(lines[i] ?? "");
        i++;
      }
      const cells = rows
        .filter((r) => !/^\s*\|[\s:|-]+\|\s*$/.test(r))
        .map((r) =>
          r
            .trim()
            .replace(/^\|/, "")
            .replace(/\|$/, "")
            .split("|")
            .map((c) => c.trim()),
        );
      const [head, ...body] = cells;
      blocks.push(
        <div key={key++} className="no-scrollbar my-4 overflow-x-auto border border-border">
          <table className="w-full border-collapse text-left text-sm">
            {head && (
              <thead>
                <tr>
                  {head.map((c, idx) => (
                    <th
                      key={idx}
                      className="border-b border-border bg-secondary px-3 py-2 font-mono text-xs uppercase tracking-wider text-muted-foreground"
                    >
                      {inline(c)}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {body.map((row, r) => (
                <tr key={r}>
                  {row.map((c, idx) => (
                    <td key={idx} className="border-b border-border px-3 py-2 align-top">
                      {inline(c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1]?.length ?? 1;
      const text = inline(heading[2] ?? "");
      const cls =
        level === 1
          ? "mt-8 mb-3 text-2xl font-bold"
          : level === 2
            ? "mt-8 mb-3 text-xl font-bold"
            : "mt-6 mb-2 text-base font-bold";
      blocks.push(
        <p key={key++} className={`${cls} font-mono text-foreground`}>
          {text}
        </p>,
      );
      i++;
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i] ?? "")) {
        items.push((lines[i] ?? "").replace(/^\s*[-*]\s+/, ""));
        i++;
      }
      blocks.push(
        <ul key={key++} className="my-3 space-y-1.5 pl-4 text-sm text-muted-foreground">
          {items.map((it, idx) => (
            <li key={idx} className="list-none before:mr-2 before:text-foreground before:content-['—']">
              {inline(it)}
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    if (/^\s*(---|===)/.test(line)) {
      blocks.push(<hr key={key++} className="my-6 border-border" />);
      i++;
      continue;
    }

    if (line.trim() === "") {
      i++;
      continue;
    }

    const rendered = inline(line);
    blocks.push(
      <p key={key++} className="my-2 text-sm leading-relaxed text-muted-foreground">
        {rendered}
      </p>,
    );
    i++;
  }

  return <div>{blocks}</div>;
}
