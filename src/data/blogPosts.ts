import type { BlogPost } from "@/lib/github.functions";

export const bakedBlogPosts: BlogPost[] = [
  {
    slug: "2026-09-18-building-high-performance-c-systems",
    title: "Practical C: Dealing with Heap Allocations and Terminal Buffers",
    date: "2026-09-18",
    excerpt: "A quick walkthrough on preventing dynamic allocation crashes and handling leftover newline characters when writing CLI utilities in C.",
    url: "https://github.com/sagnikkhaze-lgtm/sagnikkhaze-lgtm/tree/main/blog/2026-09-18-building-high-performance-c-systems.md",
    body: `# Practical C: Dealing with Heap Allocations and Terminal Buffers

Working close to the metal in C means you don't get the safety net of garbage collection. If you mess up pointer hygiene or forget to clear stdin, your app either segfaults or acts weirdly on user input. Here are two patterns I stick to when building CLI utilities.

---

## 1. Safe Heap Allocation & Pointer Cleanup

Unchecked \`malloc\` returns can blow up your program if memory runs out. I always wrap heap allocations and explicitly set freed pointers back to \`NULL\` to catch accidental reuse:

\`\`\`c
#include <stdio.h>
#include <stdlib.h>

int *init_buffer(size_t size) {
    int *buf = malloc(size * sizeof(int));
    if (!buf) {
        perror("Allocation failed");
        return NULL;
    }
    return buf;
}

void cleanup(int **buf) {
    if (buf && *buf) {
        free(*buf);
        *buf = NULL; // Zero out the pointer
    }
}
\`\`\`

---

## 2. Cleaning up \`fgets\` Trailing Newlines

\`scanf("%c")\` often leaves trailing \`\\n\` characters in the input stream, causing subsequent prompts to be skipped. Using \`fgets()\` and trimming the newline directly keeps input handling predictable:

\`\`\`c
char input[128];
if (fgets(input, sizeof(input), stdin)) {
    input[strcspn(input, "\\n")] = '\\0'; // Clean newline
}
\`\`\`

---

## Conclusion

Writing clean C takes extra care, but the speed and small binary footprint make it completely worth it.
`
  },
  {
    slug: "2026-09-15-applied-genai-with-langchain-and-python",
    title: "Building the Tech Jargon Explainer with LangChain & OpenAI",
    date: "2026-09-15",
    excerpt: "How I built a small micro-app that translates complex dev concepts into short 30-word analogies using Python and Gradio.",
    url: "https://github.com/sagnikkhaze-lgtm/sagnikkhaze-lgtm/tree/main/blog/2026-09-15-applied-genai-with-langchain-and-python.md",
    body: `# Building the Tech Jargon Explainer with LangChain & OpenAI

Ever tried explaining *Kubernetes* or *Vector Databases* to someone non-technical? You usually end up losing them in technical terms. I wanted a fast tool that breaks down dev concepts into simple analogies under 30 words.

---

## Simple Prompt Template Setup

Using LangChain with OpenAI's \`gpt-4o-mini\`, I chained a straightforward system prompt:

\`\`\`python
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI

template = """
You explain developer jargon simply.
Explain "{concept}" in under 30 words using a quick real-world analogy.
"""

prompt = PromptTemplate.from_template(template)
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.3)
chain = prompt | llm
\`\`\`

---

## What I Learned

1. Keep system prompts concise to reduce response latency.
2. Store API keys strictly in \`.env\` variables (\`python-dotenv\`).
3. Gradio makes it effortless to slap a reactive UI on top of Python scripts.
`
  },
  {
    slug: "2026-09-10-modern-web-architecture-with-react-vite-and-firestore",
    title: "Setting up a Neobrutalist SPA with Vite & Firestore",
    date: "2026-09-10",
    excerpt: "Notes on using React, TanStack Router for SPA navigation, and connecting Firestore for real-time like counters.",
    url: "https://github.com/sagnikkhaze-lgtm/sagnikkhaze-lgtm/tree/main/blog/2026-09-10-modern-web-architecture-with-react-vite-and-firestore.md",
    body: `# Setting up a Neobrutalist SPA with Vite & Firestore

For this portfolio redesign, I wanted a sharp, dark-first neobrutalist aesthetic with zero bloat and instant page loads. Here is how the stack comes together.

---

## 1. SPA Routing with TanStack Router

Instead of heavy SSR frameworks, standard Vite with TanStack Router provides lightweight client-side routing with clean 404 fallbacks for GitHub Pages:

\`\`\`tsx
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });
\`\`\`

---

## 2. Atomic Likes with Firestore

For the interactive project like button, I hooked up Google Cloud Firestore using \`increment(1)\` so total likes update in real-time without overwriting concurrent clicks:

\`\`\`typescript
import { db } from "@/lib/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

async function handleLike(itemId: string) {
  const ref = doc(db, "likes", itemId);
  await updateDoc(ref, { count: increment(1) });
}
\`\`\`

---

## Conclusion

Clean layout, fast build step, and live database persistence—everything runs smoothly on GitHub Pages.
`
  }
];
