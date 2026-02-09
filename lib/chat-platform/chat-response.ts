import { MODEL_NAME } from "@/data/ai-config";
import { handleSystemPrompt } from "@/data/prompts";
import supportedRegionDetails from "@/data/supported-regions";
import { SupportedRegions } from "@/types/supported-regions";
import { generateObject } from "ai";
import z from "zod";
import { openai } from "@/lib/ai";

export const generateResponseForParty = async (
  prompt: string,
  country: SupportedRegions,
  partyName: string,
  contexts: string[]
) => {
  const parties = supportedRegionDetails.find(region => region.name === country)?.politicalParties;
    
  if (!parties) {
    throw new Error(`Party ${partyName} not found in politicalPartiesMap for ${country}`);
  }

  const party = parties.find(p => p === partyName);
  
  const result = await generateObject({
    model: openai.chat(MODEL_NAME),
    schema: z.object({
      partyStance: z.array(z.string()),
      supportingDetails: z.array(z.string())
    }),
    system: handleSystemPrompt(party, contexts),
    prompt,
    temperature: 0.2,
    frequencyPenalty: 0,
    presencePenalty: 0
  });

  if (!result.object) {
    throw new Error("Failed to generate response for party");
  }  
   return result.object;
};

