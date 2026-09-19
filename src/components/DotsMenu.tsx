import { useState, useEffect } from "react";
import { MoreVertical, X, Github, Instagram, Sun, Moon, Pin } from "lucide-react";
import { site } from "@/lib/site";

const STORAGE_KEY = "sn-theme";
type Theme = "dark" | "light";

function playClickSound() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    // Ignore audio error if blocked by browser policy
  }
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("light", theme === "light");
  root.style.colorScheme = theme;
}

export function DotsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");
  const [showPinCard, setShowPinCard] = useState(false);

  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "dark";
    setTheme(stored);
    applyTheme(stored);
  }, []);

  const toggleTheme = () => {
    playClickSound();
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  return (
    <>
      <div className="fixed right-4 top-4 z-50 flex items-center gap-2 md:right-6 md:top-6">
        {/* Paper Pin Social Card Button */}
        <button
          type="button"
          onClick={() => {
            playClickSound();
            setShowPinCard(!showPinCard);
            if (isOpen) setIsOpen(false);
          }}
          aria-label="Pinned Social Profiles"
          title="Pinned Social Profiles"
          className="snap-transition border border-border bg-background p-2 text-foreground hover:border-border-strong"
        >
          <Pin className="h-5 w-5 text-foreground" />
        </button>

        {/* 3 Dots Quick Menu Button */}
        <button
          type="button"
          onClick={() => {
            playClickSound();
            setIsOpen(!isOpen);
            if (showPinCard) setShowPinCard(false);
          }}
          aria-label="Open Quick Menu"
          className="snap-transition border border-border bg-background p-2 text-foreground hover:border-border-strong"
        >
          {isOpen ? <X className="h-5 w-5" /> : <MoreVertical className="h-5 w-5" />}
        </button>
      </div>

      {/* Backdrop */}
      {(isOpen || showPinCard) && (
        <div
          aria-hidden
          onClick={() => {
            setIsOpen(false);
            setShowPinCard(false);
          }}
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-xs animate-backdrop-in"
        />
      )}

      {/* Pinned Socials Popup */}
      {showPinCard && (
        <div className="fixed right-4 top-16 z-50 w-[min(92vw,22rem)] border border-border-strong bg-card p-5 md:right-6 md:top-20 animate-slide-in-right">
          <div className="mb-3 flex items-center gap-2">
            <Pin className="h-4 w-4 text-foreground" />
            <p className="rule-label">Pinned Profiles</p>
          </div>
          <h4 className="font-mono text-sm font-bold">{site.name}</h4>
          <p className="mt-1 font-mono text-xs text-muted-foreground">{site.college}</p>

          <div className="mt-4 flex flex-col gap-2">
            <a
              href="https://github.com/sagnikkhaze-lgtm"
              target="_blank"
              rel="noreferrer"
              className="snap-transition flex items-center justify-between border border-border bg-background p-3 font-mono text-xs hover:border-border-strong"
            >
              <div className="flex items-center gap-2.5">
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </div>
              <span className="text-muted-foreground">@sagnikkhaze-lgtm</span>
            </a>

            <a
              href="https://www.instagram.com/sagnikkk.haze"
              target="_blank"
              rel="noreferrer"
              className="snap-transition flex items-center justify-between border border-border bg-background p-3 font-mono text-xs hover:border-border-strong"
            >
              <div className="flex items-center gap-2.5">
                <Instagram className="h-4 w-4" />
                <span>Instagram</span>
              </div>
              <span className="text-muted-foreground">@sagnikkk.haze</span>
            </a>
          </div>
        </div>
      )}

      {/* Quick Menu Popup */}
      {isOpen && (
        <div className="fixed right-4 top-16 z-50 w-[min(92vw,22rem)] border border-border-strong bg-card p-5 md:right-6 md:top-20 animate-slide-in-right">
          <p className="rule-label mb-2">Quick Controls</p>
          <h4 className="mb-4 font-mono text-base font-bold">{site.name}</h4>

          {/* Tactile Theme Switcher */}
          <div className="flex items-center justify-between border border-border bg-background p-3.5">
            <div className="flex items-center gap-2 font-mono text-xs">
              {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-amber-500" />}
              <span>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                theme === "light" ? "bg-foreground" : "bg-muted-foreground/40"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform bg-card shadow-xs transition duration-200 ease-in-out ${
                  theme === "light" ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
