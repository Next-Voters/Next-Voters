import type { BlogPost } from "@/types/blog";

export const blogPosts: BlogPost[] = [
  {
    slug: "why-civic-literacy-matters-for-gen-z",
    title: "Why Civic Literacy Matters for Gen Z",
    description:
      "Young voters face a unique challenge: more information than ever, but less trust in where it comes from. Here's why civic literacy matters now more than ever.",
    excerpt:
      "Young voters face a unique challenge: more information than ever, but less trust in where it comes from.",
    content: `Gen Z is the first generation to grow up entirely in the age of social media. They spend nearly three hours a day on platforms like TikTok, Instagram, and YouTube. For many, that's where they first encounter news about politics and policy.

The problem isn't access to information. It's knowing what to trust. When 87% of people believe online disinformation has harmed their country's politics, and 94% have been misled before realizing it was false, the stakes for civic literacy have never been higher.

That's why we built Next Voters: to give young people tools that cut through the noise. Clear answers. Multiple perspectives. Cited sources. No algorithm optimizing for engagement over understanding.`,
    datePublished: "2025-01-15",
    dateModified: "2025-01-15",
    author: { name: "Next Voters", url: "https://nextvoters.com" },
    keywords: ["civic literacy", "Gen Z", "voter education", "misinformation"],
  },
];

const BASE_URL = "https://nextvoters.com";

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getAllBlogPosts(): BlogPost[] {
  return [...blogPosts].sort(
    (a, b) =>
      new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime()
  );
}

export function getBlogPostUrl(slug: string): string {
  return `${BASE_URL}/blog/${slug}`;
}
