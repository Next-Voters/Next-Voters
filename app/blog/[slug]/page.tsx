import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import {
  getBlogPost,
  getAllBlogPosts,
  getBlogPostUrl,
  BLOG_CATEGORIES,
} from "@/data/blog-posts";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Not Found" };

  const url = getBlogPostUrl(slug);

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: post.author.name, url: post.author.url }],
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified ?? post.datePublished,
      authors: [post.author.name],
      siteName: "Next Voters",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
    alternates: {
      canonical: url,
    },
  };
}

function ArticleJsonLd({ post, slug }: { post: Awaited<ReturnType<typeof getBlogPost>>; slug: string }) {
  if (!post) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.datePublished,
    dateModified: post.dateModified ?? post.datePublished,
    author: {
      "@type": "Person",
      name: post.author.name,
      url: post.author.url,
    },
    publisher: {
      "@type": "Organization",
      name: "Next Voters",
      url: "https://nextvoters.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": getBlogPostUrl(slug),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) notFound();

  return (
    <>
      <ArticleJsonLd post={post} slug={slug} />
      <article className="min-h-screen bg-page">
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-red-500 to-red-600" />

        <div className="max-w-[680px] mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-[14px] text-gray-500 hover:text-gray-900 font-plus-jakarta-sans mb-10 transition-colors"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>

          <header className="mb-12 sm:mb-14">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex px-2.5 py-1 rounded-md text-[12px] font-medium bg-gray-100 text-gray-600 font-plus-jakarta-sans">
                {BLOG_CATEGORIES.find((c) => c.id === post.category)?.label ?? post.category}
              </span>
              <time
                className="text-[13px] font-medium tracking-wide uppercase text-gray-400 font-plus-jakarta-sans"
                dateTime={post.datePublished}
              >
              {new Date(post.datePublished).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              </time>
            </div>
            <h1 className="text-[28px] sm:text-[34px] md:text-[40px] font-bold text-gray-900 leading-[1.2] font-plus-jakarta-sans mb-5 tracking-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-sm font-plus-jakarta-sans">
                {post.author.name.charAt(0)}
              </div>
              <div>
                <p className="text-[15px] font-medium text-gray-900 font-plus-jakarta-sans">
                  {post.author.name}
                </p>
                <p className="text-[13px] text-gray-500 font-plus-jakarta-sans">
                  Next Voters Engineering
                </p>
              </div>
            </div>
          </header>

          <div className="article-content font-plus-jakarta-sans text-[16px] sm:text-[17px] leading-[1.85] text-gray-700">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
              {post.content}
            </ReactMarkdown>
          </div>

          <footer className="mt-14 sm:mt-16 pt-10 border-t border-gray-200">
            <p className="text-[15px] text-gray-600 font-plus-jakarta-sans mb-6">
              Ready to explore policy and legislation?
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/chat"
                className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 text-[15px] font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors font-plus-jakarta-sans shadow-sm"
              >
                Start asking questions
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 text-[15px] font-semibold text-gray-900 border-2 border-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-plus-jakarta-sans"
              >
                More articles
              </Link>
            </div>
          </footer>
        </div>
      </article>
    </>
  );
}
