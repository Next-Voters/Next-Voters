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
  const posts = category ? getBlogPostsByCategory(category) : getAllBlogPosts();

  return (
    <div className="min-h-screen bg-page">
      <div className="max-w-[720px] mx-auto px-5 sm:px-6 py-14 sm:py-18">
        <header className="mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400 mb-3">From the team</p>
          <h1 className="text-[30px] sm:text-[36px] font-bold text-gray-950 tracking-tight mb-3">Blog</h1>
          <p className="text-[15.5px] text-gray-500 max-w-md leading-relaxed mb-7">
            Insights on civic education, political literacy, and how young voters can cut through misinformation.
          </p>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            <Link
              href="/blog"
              className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-colors ${
                !category
                  ? "bg-brand text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900"
              }`}
            >
              All
            </Link>
            {BLOG_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/blog?category=${cat.id}`}
                className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-colors ${
                  category === cat.id
                    ? "bg-brand text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900"
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </header>

        <div className="space-y-5">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 hover:border-gray-300 hover:shadow-md transition-all duration-200"
            >
              <article>
                <div className="flex items-center gap-3 mb-3.5">
                  <span className="inline-flex px-2.5 py-1 rounded-md text-[11.5px] font-semibold bg-gray-100 text-gray-600">
                    {BLOG_CATEGORIES.find((c) => c.id === post.category)?.label ?? post.category}
                  </span>
                  <time className="text-[12.5px] font-medium text-gray-400" dateTime={post.datePublished}>
                    {new Date(post.datePublished).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <h2 className="text-[19px] sm:text-[22px] font-bold text-gray-950 group-hover:text-brand transition-colors leading-snug mb-2.5">
                  {post.title}
                </h2>
                <p className="text-[14.5px] text-gray-500 leading-relaxed line-clamp-2">{post.excerpt}</p>
                <span className="inline-flex items-center gap-1.5 mt-4 text-[13px] font-semibold text-brand group-hover:text-brand-hover">
                  Read article
                  <svg
                    className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </article>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-14 text-center">
            <p className="text-gray-400 text-[15px]">
              {category
                ? `No posts in ${BLOG_CATEGORIES.find((c) => c.id === category)?.label ?? category} yet.`
                : "No posts yet. Check back soon."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
