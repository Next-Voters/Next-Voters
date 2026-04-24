// Client-side cookie that carries onboarding state across the Google OAuth
// round-trip without embedding it in the OAuth redirect URL. Embedding state
// in `redirectTo` runs into Supabase's redirect-URL whitelist matching: an
// encoded query-string-inside-a-query-string can fail strict-matching and
// Supabase falls back to the project's Site URL, stranding the user at home.
//
// A cookie with SameSite=Lax survives top-level cross-site GET redirects,
// so it's preserved through the Google → Supabase → /auth/callback → /local
// redirect chain. Cleared on success or abandonment.

export type PendingAction =
  | {
      type: "subscribe";
      plan: "free" | "pro";
      city: string;
      language: string;
      topics: string[];
      cityRequest: { city: string } | null;
      referralCode: string | null;
    }
  | {
      type: "request";
      city: string;
      referralCode: string | null;
    };

const COOKIE_NAME = "nv_pending_action";
const MAX_AGE_SECONDS = 15 * 60;

function encodeUtf8ToBase64(input: string): string {
  // UTF-8 safe base64 encode. btoa() alone mangles non-ASCII characters.
  return btoa(unescape(encodeURIComponent(input)));
}

function decodeBase64ToUtf8(input: string): string {
  return decodeURIComponent(escape(atob(input)));
}

export function writePendingAction(action: PendingAction): void {
  if (typeof document === "undefined") return;
  const encoded = encodeUtf8ToBase64(JSON.stringify(action));
  const secure =
    typeof location !== "undefined" && location.protocol === "https:"
      ? "; Secure"
      : "";
  document.cookie = `${COOKIE_NAME}=${encoded}; Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

export function readPendingAction(): PendingAction | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`),
  );
  if (!match) return null;
  try {
    const json = decodeBase64ToUtf8(match[1]);
    const parsed = JSON.parse(json) as PendingAction;
    if (parsed.type !== "subscribe" && parsed.type !== "request") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearPendingAction(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
}
