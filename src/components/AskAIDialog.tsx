import { useState } from "react";
import { X, Sparkles, Send, Bot, User } from "lucide-react";

type Message = {
  sender: "user" | "ai";
  text: string;
};

export function AskAIDialog({
  itemTitle,
  itemContext,
  onClose,
}: {
  itemTitle: string;
  itemContext: string;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: `Hi! I'm Sagnik's AI assistant. Ask me anything about "${itemTitle}"—such as how it works, the tech stack, code implementation, or key features!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;

    const userText = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setIsThinking(true);

    setTimeout(() => {
      let reply = "";
      const lower = userText.toLowerCase();

      if (lower.includes("stack") || lower.includes("tech") || lower.includes("language")) {
        reply = `"${itemTitle}" is built with clean architecture and modern developer tooling. Here is the context:\n\n${itemContext.slice(0, 250)}`;
      } else if (lower.includes("how") || lower.includes("work") || lower.includes("explain")) {
        reply = `Great question! "${itemTitle}" is designed around modular principles. Core summary: ${itemContext.slice(0, 300)}...`;
      } else if (lower.includes("c ") || lower.includes("pointer") || lower.includes("memory")) {
        reply = `For C systems programming in "${itemTitle}", memory safety and explicit pointer hygiene are top priorities—using allocation checks and stdin buffer sanitization.`;
      } else {
        reply = `Regarding "${itemTitle}": ${itemContext.slice(0, 220)}... Feel free to ask about its installation, usage, or source code!`;
      }

      setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
      setIsThinking(false);
    }, 600);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-backdrop-in"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg border border-border-strong bg-card p-0 shadow-2xl animate-modal-in">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-card px-5 py-3.5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-foreground animate-pulse" />
              <h3 className="font-mono text-sm font-bold">Ask AI — {itemTitle}</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="snap-transition border border-border p-1 hover:border-border-strong"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex h-80 flex-col gap-3 overflow-y-auto p-5 font-mono text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2.5 ${m.sender === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center border border-border ${
                    m.sender === "user" ? "bg-foreground text-background" : "bg-card text-foreground"
                  }`}
                >
                  {m.sender === "user" ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                </div>
                <div
                  className={`max-w-[85%] border px-3 py-2 leading-relaxed ${
                    m.sender === "user"
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-card text-foreground"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Bot className="h-3 w-3 animate-spin" />
                <span>AI is formulating response...</span>
              </div>
            )}
          </div>

          {/* Form Input */}
          <form onSubmit={handleSend} className="flex border-t border-border bg-card p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask about ${itemTitle}...`}
              className="flex-1 border border-border bg-background px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
            />
            <button
              type="submit"
              disabled={isThinking || !input.trim()}
              className="snap-transition ml-2 border border-foreground bg-foreground px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-background hover:bg-background hover:text-foreground disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
