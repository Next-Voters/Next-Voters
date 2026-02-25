import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import {
  getBlogPost,
  getAllBlogPosts,
  getBlogPostUrl,
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
        <div className="max-w-2xl mx-auto px-6 py-16 md:py-24">
          <Link
            href="/blog"
            className="text-[14px] text-gray-500 hover:text-gray-900 font-plus-jakarta-sans mb-8 inline-block"
          >
            ← Back to Blog
          </Link>

          <header className="mb-10">
            <time
              className="text-[13px] text-gray-500 font-plus-jakarta-sans block mb-3"
              dateTime={post.datePublished}
            >
              {new Date(post.datePublished).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <h1 className="text-[32px] md:text-[40px] font-bold text-gray-900 leading-tight font-plus-jakarta-sans mb-4">
              {post.title}
            </h1>
            <p className="text-[16px] text-gray-600 font-plus-jakarta-sans">
              {post.author.name}
            </p>
          </header>

          <div className="markdown-body font-plus-jakarta-sans text-[16px] leading-[1.8] text-gray-700">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
              {post.content}
            </ReactMarkdown>
          </div>

          <footer className="mt-16 pt-8 border-t border-gray-200">
            <Link
              href="/chat"
              className="inline-block px-6 py-3 text-[15px] font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors font-plus-jakarta-sans"
            >
              Start asking questions
            </Link>
          </footer>
        </div>
      </article>
    </>
  );
}
