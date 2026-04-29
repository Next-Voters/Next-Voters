const LANGUAGE_CODE_BY_NAME: Record<string, string> = {
  english: "en",
  spanish: "es",
  french: "fr",
};
const KNOWN_LANGUAGE_CODES = new Set(["en", "es", "fr"]);

export const slugify = (s: string): string =>
  s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const citySlug = (city: string): string => slugify(city);
export const topicSlug = (topic: string): string => slugify(topic);

// Tolerant of casing, leading/trailing whitespace, and full-name vs
// short-code form: "English", "english", " EN ", "en" all return "en".
// Anything we can't recognise returns null so callers fall through to
// their bail path instead of constructing a bogus storage path.
export const languageCode = (lang: string): string | null => {
  const k = lang.trim().toLowerCase();
  if (!k) return null;
  if (KNOWN_LANGUAGE_CODES.has(k)) return k;
  return LANGUAGE_CODE_BY_NAME[k] ?? null;
};
