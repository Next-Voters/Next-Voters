import Link from "next/link";
import { getAllBlogPosts } from "@/data/blog-posts";

export const metadata = {
  title: "Blog",
  description:
    "Insights on civic education, political literacy, and how young voters can cut through misinformation. From the team at Next Voters.",
  openGraph: {
    title: "Blog | Next Voters",
    description:
      "Insights on civic education, political literacy, and how young voters can cut through misinformation.",
    url: "https://nextvoters.com/blog",
    type: "website",
  },
  alternates: {
    canonical: "https://nextvoters.com/blog",
  },
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="min-h-screen bg-page">
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <h1 className="text-[32px] md:text-[40px] font-bold text-gray-900 mb-4 font-plus-jakarta-sans">
          Blog
        </h1>
        <p className="text-[17px] text-gray-600 mb-12 font-plus-jakarta-sans">
          Insights on civic education, political literacy, and how young voters
          can cut through misinformation.
        </p>

        <div className="space-y-10">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="border-b border-gray-200 pb-10 last:border-0 last:pb-0"
            >
              <Link href={`/blog/${post.slug}`} className="group block">
                <time
                  className="text-[13px] text-gray-500 font-plus-jakarta-sans block mb-2"
                  dateTime={post.datePublished}
                >
                  {new Date(post.datePublished).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <h2 className="text-[22px] md:text-[26px] font-semibold text-gray-900 group-hover:text-red-600 transition-colors font-plus-jakarta-sans mb-2">
                  {post.title}
                </h2>
                <p className="text-[16px] text-gray-600 font-plus-jakarta-sans">
                  {post.excerpt}
                </p>
              </Link>
            </article>
          ))}
        </div>

        {posts.length === 0 && (
          <p className="text-gray-500 font-plus-jakarta-sans">
            No posts yet. Check back soon.
          </p>
        )}
      </div>
    </div>
  );
}
