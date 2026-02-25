import { getAllBlogPosts, getBlogPostUrl } from "@/data/blog-posts";

const BASE_URL = "https://nextvoters.com";

export async function GET() {
  const posts = getAllBlogPosts();

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Next Voters Blog</title>
    <link>${BASE_URL}/blog</link>
    <description>Insights on civic education, political literacy, and how young voters can cut through misinformation.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${posts
      .map(
        (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${getBlogPostUrl(post.slug)}</link>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${new Date(post.datePublished).toUTCString()}</pubDate>
      <guid isPermaLink="true">${getBlogPostUrl(post.slug)}</guid>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
