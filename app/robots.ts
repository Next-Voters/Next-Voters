import type { MetadataRoute } from "next";

const BASE_URL = "https://nextvoters.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/request-admin/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/admin/", "/request-admin/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
