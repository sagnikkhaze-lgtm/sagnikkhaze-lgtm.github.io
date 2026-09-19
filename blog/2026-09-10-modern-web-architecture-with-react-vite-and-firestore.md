# Setting up a Neobrutalist SPA with Vite & Firestore

For this portfolio redesign, I wanted a sharp, dark-first neobrutalist aesthetic with zero bloat and instant page loads. Here is how the stack comes together.

---

## 1. SPA Routing with TanStack Router

Instead of heavy SSR frameworks, standard Vite with TanStack Router provides lightweight client-side routing with clean 404 fallbacks for GitHub Pages:

```tsx
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });
```

---

## 2. Atomic Likes with Firestore

For the interactive project like button, I hooked up Google Cloud Firestore using `increment(1)` so total likes update in real-time without overwriting concurrent clicks:

```typescript
import { db } from "@/lib/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

async function handleLike(itemId: string) {
  const ref = doc(db, "likes", itemId);
  await updateDoc(ref, { count: increment(1) });
}
```

---

## Conclusion

Clean layout, fast build step, and live database persistence—everything runs smoothly on GitHub Pages.
