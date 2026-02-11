/**
 * Returns the name of the most recent summary folder in Supabase Storage.
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
 * to be set; throws a clear message when they're missing so the build
 * doesn't fail with a cryptic "Cannot find name 'supabase'" error.
 */
export const getLastSummaryFolder = async (): Promise<string> => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY missing)"
    );
  }

  // Dynamic import so the build never fails when @supabase/supabase-js isn't installed.
  type CreateClientFn = (url: string, key: string) => {
    storage: {
      from: (bucket: string) => {
        list: (
          path?: string,
          options?: { sortBy?: { column: string; order: "asc" | "desc" } }
        ) => Promise<{ data: { name: string }[] | null; error: { message: string } | null }>;
      };
    };
  };
  let createClient: CreateClientFn;
  try {
    const moduleName = "@supabase/" + "supabase-js";
    const mod = await import(moduleName);
    if (typeof mod?.createClient !== "function") {
      throw new Error("createClient export not found in @supabase/supabase-js");
    }
    createClient = mod.createClient as CreateClientFn;
  } catch {
    throw new Error(
      "@supabase/supabase-js is not installed. Run: pnpm add @supabase/supabase-js"
    );
  }

  const supabase = createClient(url, key);

  const { data: folders, error } = await supabase.storage
    .from("next-voters-summaries")
    .list("public", { sortBy: { column: "name", order: "asc" } });

  if (error) {
    throw new Error(`Failed to list folders: ${error.message}`);
  }

  if (!folders || folders.length === 0) {
    throw new Error("No summary folders found in storage.");
  }

  return folders[folders.length - 1].name;
};
