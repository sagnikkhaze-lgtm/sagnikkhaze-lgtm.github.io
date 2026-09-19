# Building the Tech Jargon Explainer with LangChain & OpenAI

Ever tried explaining *Kubernetes* or *Vector Databases* to someone non-technical? You usually end up losing them in technical terms. I wanted a fast tool that breaks down dev concepts into simple analogies under 30 words.

---

## Simple Prompt Template Setup

Using LangChain with OpenAI's `gpt-4o-mini`, I chained a straightforward system prompt:

```python
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI

template = """
You explain developer jargon simply.
Explain "{concept}" in under 30 words using a quick real-world analogy.
"""

prompt = PromptTemplate.from_template(template)
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.3)
chain = prompt | llm
```

---

## What I Learned

1. Keep system prompts concise to reduce response latency.
2. Store API keys strictly in `.env` variables (`python-dotenv`).
3. Gradio makes it effortless to slap a reactive UI on top of Python scripts.
