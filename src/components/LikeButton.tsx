import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, increment } from "firebase/firestore";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "sn-liked-items";

function likedSet(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as string[]);
  } catch {
    return new Set();
  }
}

export function LikeButton({ itemId, className }: { itemId: string; className?: string }) {
  const [count, setCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    setLiked(likedSet().has(itemId));

    const docRef = doc(db, "likes", itemId);
    getDoc(docRef).then((snap) => {
      if (active) {
        setCount(snap.exists() ? (snap.data()["count"] as number) ?? 0 : 0);
      }
    });

    return () => {
      active = false;
    };
  }, [itemId]);

  async function like(e: React.MouseEvent) {
    e.stopPropagation();
    if (liked || busy) return;
    setBusy(true);
    setCount((c) => (c ?? 0) + 1);
    setLiked(true);
    const set = likedSet();
    set.add(itemId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));

    try {
      const docRef = doc(db, "likes", itemId);
      await setDoc(docRef, { count: increment(1) }, { merge: true });
      // Re-read to get the server-authoritative count
      const snap = await getDoc(docRef);
      if (snap.exists()) setCount((snap.data()["count"] as number) ?? 0);
    } catch {
      // Silently fail — optimistic UI already updated
    }
    setBusy(false);
  }

  return (
    <button
      type="button"
      onClick={like}
      aria-label={liked ? "Liked" : "Like"}
      aria-pressed={liked}
      className={cn(
        "snap-transition inline-flex items-center gap-1.5 border border-border px-2 py-1 font-mono text-xs text-muted-foreground hover:border-border-strong hover:text-foreground",
        liked && "border-border-strong text-foreground",
        className,
      )}
    >
      <Heart className={cn("h-3.5 w-3.5", liked && "fill-current")} />
      {count ?? "–"}
    </button>
  );
}
