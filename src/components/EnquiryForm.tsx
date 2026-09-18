import { useEffect, useState } from "react";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useEnquiry } from "./EnquiryProvider";
import { site } from "@/lib/site";

export function EnquiryForm({ compact = false }: { compact?: boolean }) {
  const { subject, setSubject } = useEnquiry();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (subject) setMessage((m) => m);
  }, [subject]);

  const field =
    "w-full border border-border bg-background px-3 py-2 font-sans text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-border-strong";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Name, email and message are required.");
      return;
    }
    setSending(true);
    const finalSubject = subject.trim() || "General enquiry";

    try {
      await addDoc(collection(db, "enquiries"), {
        name: name.trim(),
        email: email.trim(),
        subject: finalSubject,
        message: message.trim(),
        createdAt: serverTimestamp(),
      });
      toast.success("Enquiry sent. Sagnik will get back to you.");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      toast.error("Could not save your enquiry. Opening your mail app instead.");
    }

    setSending(false);

    const body = `${message.trim()}\n\n— ${name.trim()} (${email.trim()})`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(finalSubject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className={compact ? "space-y-3" : "grid gap-3 sm:grid-cols-2"}>
        <div>
          <label htmlFor="enquiry-name" className="rule-label mb-1.5 block">
            Name
          </label>
          <input
            id="enquiry-name"
            className={field}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="enquiry-email" className="rule-label mb-1.5 block">
            Email
          </label>
          <input
            id="enquiry-email"
            type="email"
            className={field}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="enquiry-subject" className="rule-label mb-1.5 block">
          Subject
        </label>
        <input
          id="enquiry-subject"
          className={field}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enquiry about ..."
        />
      </div>

      <div>
        <label htmlFor="enquiry-message" className="rule-label mb-1.5 block">
          Message
        </label>
        <textarea
          id="enquiry-message"
          rows={compact ? 4 : 5}
          className={field}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What would you like to know?"
        />
      </div>

      <button
        type="submit"
        disabled={sending}
        className="snap-transition w-full border border-foreground bg-foreground px-4 py-2.5 font-mono text-sm uppercase tracking-wider text-background hover:bg-background hover:text-foreground disabled:opacity-50"
      >
        {sending ? "Sending…" : "Send enquiry"}
      </button>
      <p className="font-mono text-[11px] text-muted-foreground">
        Goes to {site.email}. Your mail app opens with the same message as a backup.
      </p>
    </form>
  );
}
