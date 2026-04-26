export const LANGUAGE_CODE: Record<string, string> = {
  English: "en",
  Spanish: "es",
  French: "fr",
};

export const slugify = (s: string): string =>
  s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const citySlug = (city: string): string => slugify(city);
export const topicSlug = (topic: string): string => slugify(topic);
export const languageCode = (lang: string): string | null =>
  LANGUAGE_CODE[lang] ?? null;
