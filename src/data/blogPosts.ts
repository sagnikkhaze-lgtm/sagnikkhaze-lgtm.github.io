import type { BlogPost } from "@/lib/github.functions";

export const bakedBlogPosts: BlogPost[] = [
  {
    slug: "2026-09-18-building-high-performance-c-systems",
    title: "Building High-Performance C & Systems Programming Tools",
    date: "2026-09-18",
    excerpt: "Insights on memory safety, pointer hygiene, stack vs heap allocation, and building deterministic CLI utilities in low-level C.",
    url: "https://github.com/sagnikkhaze-lgtm/sagnikkhaze-lgtm/tree/main/blog/2026-09-18-building-high-performance-c-systems.md",
    body: `# Building High-Performance C & Systems Programming Tools

When writing systems code in C, efficiency and predictability are paramount. Unlike garbage-collected languages, C grants direct memory management and layout control, requiring explicit pointer hygiene and runtime discipline.

---

## 1. Memory Safety & Heap Allocations

A common source of bugs in systems utilities stems from uninitialized heap pointers and dangling references. Always check memory allocation results before dereferencing:

\`\`\`c
#include <stdio.h>
#include <stdlib.h>

int *allocate_array(size_t count) {
    int *arr = (int *)malloc(count * sizeof(int));
    if (arr == NULL) {
        fprintf(stderr, "[ERROR] Memory allocation failed\\n");
        return NULL;
    }
    return arr;
}
\`\`\`

### Key Pointer Rules:
1. **Always set freed pointers to \`NULL\`**: Prevents accidental double-free vulnerabilities.
2. **Buffer Sanitization**: Flush residual characters in terminal input streams when using \`getchar()\` loops.
3. **Struct Alignment**: Order struct members by decreasing byte size to minimize compiler padding.

---

## 2. Deterministic CLI Terminal Utilities

Building interactive CLI tools requires safe input parsing. Replacing naive \`scanf()\` calls with \`fgets()\` combined with newline stripping ensures deterministic user interaction:

\`\`\`c
char buffer[128];
if (fgets(buffer, sizeof(buffer), stdin) != NULL) {
    size_t len = strlen(buffer);
    if (len > 0 && buffer[len - 1] == '\\n') {
        buffer[len - 1] = '\\0'; // Safe newline truncation
    }
}
\`\`\`

---

## Conclusion

Mastering low-level primitives in C builds a solid foundation for systems engineering, database engines, and embedded systems architecture.
`
  },
  {
    slug: "2026-09-15-applied-genai-with-langchain-and-python",
    title: "Applied Generative AI: From Prompt Engineering to LangChain Micro-Apps",
    date: "2026-09-15",
    excerpt: "Lessons learned building real-time LLM tools like the Tech Jargon Explainer using LangChain, OpenAI models, and reactive UIs.",
    url: "https://github.com/sagnikkhaze-lgtm/sagnikkhaze-lgtm/tree/main/blog/2026-09-15-applied-genai-with-langchain-and-python.md",
    body: `# Applied Generative AI: From Prompt Engineering to LangChain Micro-Apps

Generative AI applications are transforming software engineering by converting dense technical domain knowledge into intuitive human explanations.

---

## Few-Shot Prompting & Analogy Generation

To translate complex developer concepts like *Kubernetes*, *Vector Databases*, or *Latency* into simple analogies under 30 words, structured system instructions are critical.

\`\`\`python
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI

template = """
You are a technical jargon simplifier.
Explain the following concept in plain English under 30 words using a real-world analogy:
Concept: {concept}
"""

prompt = PromptTemplate.from_template(template)
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.3)
chain = prompt | llm
\`\`\`

---

## Security & Environment Best Practices

When deploying GenAI projects:
- **Zero-Leak Policy**: Keep API credentials exclusively inside environment variables (\`.env\`).
- **Input Guardrails**: Validate prompt lengths and sanitize inputs to avoid context window injection.

Building modular AI tools with clear boundaries ensures reliable, production-ready inference.
`
  },
  {
    slug: "2026-09-10-modern-web-architecture-with-react-vite-and-firestore",
    title: "Designing Neobrutalist Web Apps with React, Vite, and Firestore",
    date: "2026-09-10",
    excerpt: "Architecting responsive, high-performance portfolios with TanStack Router, neobrutalist UI design, and real-time Firestore database integration.",
    url: "https://github.com/sagnikkhaze-lgtm/sagnikkhaze-lgtm/tree/main/blog/2026-09-10-modern-web-architecture-with-react-vite-and-firestore.md",
    body: `# Designing Neobrutalist Web Apps with React, Vite, and Firestore

Neobrutalism combines bold typography, high-contrast borders, structural grid layouts, and vibrant dark modes to create memorable user experiences.

---

## 1. Single Page Application Architecture

Using **Vite** with **TanStack Router** provides type-safe client-side routing, instant hot-module replacement (HMR), and lightning-fast sub-second build times.

\`\`\`tsx
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });
\`\`\`

---

## 2. Real-Time Data & Firestore Atomic Increments

For interactive features like real-time project like counters or contact forms, Google Cloud Firestore provides serverless scalability:

\`\`\`typescript
import { db } from "@/lib/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

async function addLike(itemId: string) {
  const ref = doc(db, "likes", itemId);
  await updateDoc(ref, { count: increment(1) });
}
\`\`\`

By combining sleek CSS keyframe micro-animations with structured backend database APIs, modern web apps deliver dynamic responsiveness.
`
  }
];
