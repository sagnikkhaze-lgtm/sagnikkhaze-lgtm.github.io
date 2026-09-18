export const site = {
  name: "Sagnik Nag",
  role: "A very enthusiastic software developer",
  email: "sagnikk.haze@gmail.com",
  github: "https://github.com/sagnikkhaze-lgtm",
  college: "St. Xavier's College, Kolkata",
  stack: ["C", "Python", "Java", "HTML", "CSS", "macOS"],
  tools: ["VS Code", "PyCharm", "IntelliJ IDEA", "Clang / GCC"],
  // Where blog posts come from: markdown files pushed to
  // github.com/sagnikkhaze-lgtm/sagnikkhaze-lgtm inside the /blog folder.
  blogSource: "https://github.com/sagnikkhaze-lgtm/sagnikkhaze-lgtm/tree/main/blog",
};

/**
 * Social links. Set a handle to "" to hide that link from the site.
 */
export const socials = [
  { id: "github", label: "GitHub", handle: "@sagnikkhaze-lgtm", href: "https://github.com/sagnikkhaze-lgtm" },
  { id: "linkedin", label: "LinkedIn", handle: "", href: "" },
  { id: "x", label: "X", handle: "", href: "" },
  { id: "instagram", label: "Instagram", handle: "sagnikkk.haze", href: "https://www.instagram.com/sagnikkk.haze" },
  { id: "email", label: "Email", handle: "sagnikk.haze@gmail.com", href: "mailto:sagnikk.haze@gmail.com" },
].filter((s) => s.href !== "");
