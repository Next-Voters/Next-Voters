export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  content: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: {
    name: string;
    url?: string;
  };
  keywords?: string[];
};
