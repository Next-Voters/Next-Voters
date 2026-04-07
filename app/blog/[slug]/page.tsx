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
        <div className="max-w-[680px] mx-auto px-5 sm:px-6 py-12 sm:py-16">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-gray-500 hover:text-gray-900 mb-10 transition-colors"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All articles
          </Link>

          <header className="mb-10">
            <div className="flex items-center gap-3 mb-5">
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

            <h1 className="text-[28px] sm:text-[34px] font-bold text-gray-950 leading-[1.2] mb-6 tracking-tight">
              {post.title}
            </h1>

            <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-[13px] shrink-0">
                {post.author.name.charAt(0)}
              </div>
              <div>
                <p className="text-[14px] font-semibold text-gray-900">{post.author.name}</p>
                <p className="text-[12.5px] text-gray-500">Next Voters</p>
              </div>
            </div>
          </header>

          <div className="article-content text-[16px] sm:text-[16.5px] leading-[1.85] text-gray-700">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
              {post.content}
            </ReactMarkdown>
          </div>

          <footer className="mt-14 pt-8 border-t border-gray-200">
            <p className="text-[15px] text-gray-600 mb-5">Ready to explore policy and legislation?</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/chat"
                className="inline-flex items-center justify-center min-h-[46px] px-6 py-3 text-[14.5px] font-semibold text-white bg-brand rounded-xl hover:bg-brand-hover transition-colors shadow-sm"
              >
                Start asking questions
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center min-h-[46px] px-6 py-3 text-[14.5px] font-semibold text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-colors"
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
