import type { BlogPost } from "@/types/blog";

export const BLOG_CATEGORIES = [
  { id: "technology" as const, label: "Technology" },
  { id: "civic-education" as const, label: "Civic Education" },
  { id: "policy" as const, label: "Policy" },
  { id: "next-voters-updates" as const, label: "Next Voters Updates" },
] as const;

export const blogPosts: BlogPost[] = [
  {
    slug: "a-guide-to-llm-evals",
    category: "technology",
    title: "A Guide to LLM Evals",
    description:
      "How to measure LLM output quality: human vs LLM-as-a-judge evaluators, G-Evals, chain of thought, and log probabilities. A practical guide from Next Voters Engineering.",
    excerpt:
      "You built an AI system, but how do you know it works properly? LLM evaluations help solve this—here's how G-Evals and chain of thought make LLM-as-a-judge match human judgement.",
    content: `## Overview

You built an AI system, but how do you know it works properly?

Measuring the quality of outputs from systems that employ LLMs are particularly difficult. LLM evaluations help solve this by using evaluators to determine output quality of a test dataset (which includes a prompt and LLM response). These evaluators either check the output against a rubric and generate a score/reasoning or pick a preferred response from 2 different system prompts.

The evaluation's insights are used to better the system prompt to elicit a better response!

The latter approach has been proven to be more effective, so I will be focusing on that method. There are 2 types of evaluators: **human** or **LLM-as-a-judge**.

## Pros and Cons of Each Evaluator

A human would provide good analysis, but it is less scalable due to wages expense and time consumed per eval. An LLM judge, if designed poorly, would give low quality evals because of the LLM limitations like authority bias (favouring responses that are factually incorrect but confidently presented). However, LLM-as-a-judge are cheaper and more scalable since it'll take less time processing information.

Thus, when using LLM judge evaluator, there must be a balance between human-like judgement, in order to bypass LLM limitations, and scalability. Something that has been solved by **G-Evals**.

## So… What Are G-Evals?

G-Evals is a research-backed framework that uses LLM-as-a-judge to determine quality of LLM response. They have been proven to match performance of human judgement.

G-Evals use a custom criteria (defined by engineer) with a **chain of thought (CoT)** approach.

## What is CoT?

Chain of thought is a prompt engineering technique that improves the performance of complex tasks by generating intermediary steps that must be completed. Basically, it mimics human problem solving since we break down larger problems to smaller and manageable chunks.

It does this through the following steps:

1. The LLM transforms your criteria to list of evaluation steps. This is where CoT is implemented as it breaks the criteria into smaller parts
2. These steps are then used to create a judgement on the response
3. Once judgement is generated, a score is given based on their log probabilities.

## What Are Log Probabilities?

Simply put, they take a range of numbers (like 0–5), assign how likely each number is to be the score as a weight for the final score. Then they blend those numbers based on the weightage allotted.

Both the judgement and score are then used to determine how to better system design/prompt :)

---

*P.S. You can check out the [research paper here](https://arxiv.org/pdf/2303.16634).*`,
    datePublished: "2026-02-24",
    dateModified: "2026-02-24",
    author: { name: "Hemit Patel" },
    keywords: ["LLM", "evals", "G-Evals", "chain of thought", "evaluation", "AI"],
  },
  {
    slug: "political-affairs-updates-straight-to-your-inbox",
    category: "next-voters-updates",
    title: "Political Affairs Updates Straight to Your Inbox",
    description:
      "Next Voters is bringing political affairs updates straight to your inbox. We collect legislation and official statements, categorize and summarize them, and deliver them as a newsletter. Launched in NYC, Toronto, and San Diego.",
    excerpt:
      "We built our political party comparison tool to provide young voters an equally fast method of getting political affairs answers as social media. The difference is that we ground our answers in facts.",
    content: `We built our political party comparison tool to provide young voters an equally fast method of getting political affairs answers as social media. The difference is that we ground our answers in facts. Our answers cite and are based solely on official statements by the major political parties, something that social media sites are incentivized against, as sensationalist, viral content results in higher post engagement and profit.

However, political affairs have a year-round impact on Americans, not just during election cycles. And unfortunately, the ability to follow all relevant news and legislation, prepare for upcoming changes, and represent beliefs to legislators has become a luxury afforded by few. For most students and working people, this level of engagement and representation is not possible. Thus, our Next Voters team is working to change this by bringing political affairs updates straight to your inboxes.

Every day, we collect discussed or implemented legislation, and the statements of elected officials based on the topics that interest you. We then categorize it, summarize it, and deliver it straight to you as a newsletter so you can get a quick understanding of political affairs, or a more concrete understanding by opening the links to the exact sources. We've launched in NYC, Toronto, and San Diego, with more cities to come soon!`,
    datePublished: "2026-03-12",
    dateModified: "2026-03-12",
    author: { name: "Danielle D." },
    keywords: ["newsletter", "political affairs", "legislation", "Next Voters Line", "NYC", "Toronto", "San Diego"],
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

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return getAllBlogPosts().filter((p) => p.category === category);
}

export function getBlogPostUrl(slug: string): string {
  return `${BASE_URL}/blog/${slug}`;
}
