import Link from "next/link";
import {
  getAllBlogPosts,
  getBlogPostsByCategory,
  BLOG_CATEGORIES,
} from "@/data/blog-posts";

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

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export default async function BlogPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const posts = category
    ? getBlogPostsByCategory(category)
    : getAllBlogPosts();

  return (
    <div className="min-h-screen bg-page">
      {/* Top accent */}
      <div className="h-1 w-full bg-gradient-to-r from-red-500 to-red-600" />

      <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <header className="mb-10 sm:mb-12">
          <h1 className="text-[28px] sm:text-[34px] md:text-[40px] font-bold text-gray-900 mb-3 font-plus-jakarta-sans tracking-tight">
            Blog
          </h1>
          <p className="text-[16px] sm:text-[17px] text-gray-600 font-plus-jakarta-sans max-w-xl mb-6">
            Insights on civic education, political literacy, and how young voters
            can cut through misinformation.
          </p>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            <Link
              href="/blog"
              className={`inline-flex items-center px-4 py-2 rounded-full text-[14px] font-medium font-plus-jakarta-sans transition-colors ${
                !category
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All
            </Link>
            {BLOG_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/blog?category=${cat.id}`}
                className={`inline-flex items-center px-4 py-2 rounded-full text-[14px] font-medium font-plus-jakarta-sans transition-colors ${
                  category === cat.id
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </header>

        <div className="space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200"
            >
              <article>
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex px-2.5 py-1 rounded-md text-[12px] font-medium bg-gray-100 text-gray-600 font-plus-jakarta-sans">
                    {BLOG_CATEGORIES.find((c) => c.id === post.category)?.label ?? post.category}
                  </span>
                  <time
                    className="text-[13px] font-medium text-gray-400 font-plus-jakarta-sans"
                    dateTime={post.datePublished}
                  >
                  {new Date(post.datePublished).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  </time>
                </div>
                <h2 className="text-[20px] sm:text-[24px] font-bold text-gray-900 group-hover:text-red-600 transition-colors font-plus-jakarta-sans mb-3 leading-snug">
                  {post.title}
                </h2>
                <p className="text-[15px] sm:text-[16px] text-gray-600 font-plus-jakarta-sans leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
                <span className="inline-flex items-center gap-1.5 mt-4 text-[14px] font-medium text-red-600 group-hover:text-red-700 font-plus-jakarta-sans">
                  Read article
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </article>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <p className="text-gray-500 font-plus-jakarta-sans text-[16px]">
              {category
                ? `No posts in ${BLOG_CATEGORIES.find((c) => c.id === category)?.label ?? category} yet. Check back soon.`
                : "No posts yet. Check back soon."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
