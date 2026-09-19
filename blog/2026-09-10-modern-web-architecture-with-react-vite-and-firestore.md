# Designing Neobrutalist Web Apps with React, Vite, and Firestore

Neobrutalism combines bold typography, high-contrast borders, structural grid layouts, and vibrant dark modes to create memorable user experiences.

---

## 1. Single Page Application Architecture

Using **Vite** with **TanStack Router** provides type-safe client-side routing, instant hot-module replacement (HMR), and lightning-fast sub-second build times.

```tsx
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });
```

---

## 2. Real-Time Data & Firestore Atomic Increments

For interactive features like real-time project like counters or contact forms, Google Cloud Firestore provides serverless scalability:

```typescript
import { db } from "@/lib/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

async function addLike(itemId: string) {
  const ref = doc(db, "likes", itemId);
  await updateDoc(ref, { count: increment(1) });
}
```

By combining sleek CSS keyframe micro-animations with structured backend database APIs, modern web apps deliver dynamic responsiveness.
