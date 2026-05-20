import { SupabaseClient } from "@supabase/supabase-js"

export interface ClassifiedRegions {
  country: string | null
  region: string | null
  city: string | null
}

/**
 * Given an array of region names, query supported_regions for their types
 * and return one value per geographic level.
 */
export async function classifyRegions(
  admin: SupabaseClient,
  rawRegions: string[],
): Promise<ClassifiedRegions> {
  if (rawRegions.length === 0) return { country: null, region: null, city: null }

  const { data: regionRows } = await admin
    .from("supported_regions")
    .select("region, type")
    .in("region", rawRegions)

  const result: ClassifiedRegions = { country: null, region: null, city: null }
  for (const row of regionRows ?? []) {
    if (row.type === "country" && !result.country) result.country = row.region
    else if (row.type === "state" && !result.region) result.region = row.region
    else if (row.type === "city" && !result.city) result.city = row.region
  }
  return result
}

/** Strip the city column for free-tier enforcement. */
export function stripCityForFree(classified: ClassifiedRegions): ClassifiedRegions {
  return { ...classified, city: null }
}
