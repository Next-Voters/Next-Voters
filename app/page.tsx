import { handleGetRequestCount, handleGetResponseCount } from "@/lib/analytics";
import HomeContent from "@/components/home-content";

export default async function Home() {
  let initialAnalytics: { requestCount: number; responseCount: number } | null = null;

  try {
    const [requestCount, responseCount] = await Promise.all([
      handleGetRequestCount(),
      handleGetResponseCount(),
    ]);
    initialAnalytics = { requestCount, responseCount };
  } catch {
    // Analytics non-critical; page works without it
  }

  return <HomeContent initialAnalytics={initialAnalytics} />;
}
