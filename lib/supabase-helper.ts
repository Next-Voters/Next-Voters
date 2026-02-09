export const getLastSummaryFolder = async () => {
  const { data: folders, error } = await supabase.storage
    .from("public/next-voters-summaries")
    .list("/*", { depth: 1 });

  if (error) {
    throw new Error(`Failed to list folders: ${error.message}`);
  }

  const lastFolder = folders[folders.length - 1].name;
  return lastFolder;
};