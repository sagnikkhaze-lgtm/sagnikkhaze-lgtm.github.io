import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type EnquiryState = {
  subject: string;
  panelOpen: boolean;
  setSubject: (s: string) => void;
  setPanelOpen: (open: boolean) => void;
  /** Quote a project/program and take the visitor to the enquiry form. */
  enquireAbout: (item: string) => void;
};

const Ctx = createContext<EnquiryState | null>(null);

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [subject, setSubject] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);

  const enquireAbout = useCallback((item: string) => {
    setSubject(`Enquiry about ${item}`);
    const target = typeof document !== "undefined" ? document.getElementById("contact") : null;
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => {
        document.getElementById("enquiry-name")?.focus({ preventScroll: true });
      }, 500);
    } else {
      setPanelOpen(true);
    }
  }, []);

  const value = useMemo(
    () => ({ subject, panelOpen, setSubject, setPanelOpen, enquireAbout }),
    [subject, panelOpen, enquireAbout],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useEnquiry() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useEnquiry must be used inside EnquiryProvider");
  return ctx;
}
