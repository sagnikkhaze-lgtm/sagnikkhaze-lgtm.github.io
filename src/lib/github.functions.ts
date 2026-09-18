import { repos as bakedRepos, type Repo } from "@/data/repos";

const USER = "sagnikkhaze-lgtm";
const BLOG_REPO = "sagnikkhaze-lgtm";
const BLOG_DIR = "blog";
const TTL_MS = 5 * 60 * 1000;

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  body: string;
  url: string;
};

type Cache<T> = { at: number; value: T } | null;
let repoCache: Cache<Repo[]> = null;
let blogCache: Cache<BlogPost[]> = null;

const headers: HeadersInit = {
  Accept: "application/vnd.github+json",
  "User-Agent": "sagnik-portfolio",
};

function titleize(name: string) {
  return name
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

async function fetchReadme(fullName: string): Promise<string> {
  const res = await fetch(`https://api.github.com/repos/${fullName}/readme`, {
    headers: { ...headers, Accept: "application/vnd.github.raw" },
  });
  if (!res.ok) return "";
  return await res.text();
}

export async function getRepos(): Promise<Repo[]> {
  if (repoCache && Date.now() - repoCache.at < TTL_MS) return repoCache.value;

  try {
    const res = await fetch(
      `https://api.github.com/users/${USER}/repos?sort=updated&per_page=100&type=owner`,
      { headers },
    );
    if (!res.ok) throw new Error(`GitHub ${res.status}`);
    const raw = (await res.json()) as Array<{
      name: string;
      full_name: string;
      description: string | null;
      language: string | null;
      pushed_at: string;
      stargazers_count: number;
      html_url: string;
      fork: boolean;
      archived: boolean;
      private: boolean;
    }>;

    const list = raw.filter((r) => !r.fork && !r.private && !r.archived);
    const live: Repo[] = await Promise.all(
      list.map(async (r) => {
        const baked = bakedRepos.find((b) => b.name === r.name);
        const readme = (await fetchReadme(r.full_name)) || baked?.readme || "";
        return {
          id: r.name,
          name: r.name,
          title: baked?.title ?? titleize(r.name),
          description: r.description ?? baked?.description ?? "No description provided yet.",
          language: r.language ?? baked?.language ?? "Other",
          updated: r.pushed_at.slice(0, 10),
          stars: r.stargazers_count,
          url: r.html_url,
          readme,
        };
      }),
    );

    if (live.length === 0) return bakedRepos;
    repoCache = { at: Date.now(), value: live };
    return live;
  } catch (error) {
    console.error("GitHub repo sync failed:", error);
    return bakedRepos;
  }
}

function parsePost(name: string, markdown: string, url: string): BlogPost {
  const slug = name.replace(/\.mdx?$/i, "");
  const dateMatch = slug.match(/^(\d{4}-\d{2}-\d{2})[-_]?/);
  const lines = markdown.split("\n");
  const headingIndex = lines.findIndex((l) => /^#\s+/.test(l.trim()));
  const title =
    headingIndex >= 0
      ? lines[headingIndex]!.replace(/^#\s+/, "").trim()
      : titleize(slug.replace(/^\d{4}-\d{2}-\d{2}[-_]?/, ""));
  const excerpt =
    lines
      .slice(headingIndex + 1)
      .find((l) => l.trim() && !l.trim().startsWith("#") && !l.trim().startsWith("!["))
      ?.trim()
      .slice(0, 180) ?? "";

  return {
    slug,
    title,
    excerpt,
    date: dateMatch?.[1] ?? "",
    body: markdown,
    url,
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (blogCache && Date.now() - blogCache.at < TTL_MS) return blogCache.value;

  try {
    const res = await fetch(
      `https://api.github.com/repos/${USER}/${BLOG_REPO}/contents/${BLOG_DIR}`,
      { headers },
    );
    if (!res.ok) {
      blogCache = { at: Date.now(), value: [] };
      return [];
    }
    const entries = (await res.json()) as Array<{
      name: string;
      type: string;
      download_url: string | null;
      html_url: string;
    }>;

    const files = entries.filter((e) => e.type === "file" && /\.mdx?$/i.test(e.name));
    const posts = await Promise.all(
      files.map(async (f) => {
        const md = f.download_url ? await fetch(f.download_url).then((r) => r.text()) : "";
        return parsePost(f.name, md, f.html_url);
      }),
    );

    posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title)));
    blogCache = { at: Date.now(), value: posts };
    return posts;
  } catch (error) {
    console.error("GitHub blog sync failed:", error);
    return [];
  }
}
