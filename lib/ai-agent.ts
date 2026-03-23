/**
 * LangGraph AI Agent Client
 *
 * Invokes the research brief and research agents via the deployed LangGraph API.
 * @see https://disastrous-doretta-next-voters-1be027c9.koyeb.app
 */

import type {
  Message,
  HumanMessage,
  SystemMessage,
  ResearchBriefAgentState,
  ResearchAgentState,
} from "@/types/langgraph";

const LANGGRAPH_API_URL =
  process.env.LANGGRAPH_API_URL ||
  "https://disastrous-doretta-next-voters-1be027c9.koyeb.app";

const RESEARCH_BRIEF_ASSISTANT_ID =
  process.env.LANGGRAPH_RESEARCH_BRIEF_ASSISTANT_ID || "research-brief-agent";
const RESEARCH_ASSISTANT_ID =
  process.env.LANGGRAPH_RESEARCH_ASSISTANT_ID || "research-agent";

// ---------------------------------------------------------------------------
// Message helpers
// ---------------------------------------------------------------------------

export function createHumanMessage(content: string): HumanMessage {
  return { type: "human", content };
}

export function createSystemMessage(content: string): SystemMessage {
  return { type: "system", content };
}

// ---------------------------------------------------------------------------
// LangGraph API invocation
// ---------------------------------------------------------------------------

async function invokeAssistant<TInput, TOutput>(
  assistantId: string,
  input: TInput
): Promise<TOutput> {
  const url = `${LANGGRAPH_API_URL.replace(/\/$/, "")}/runs/wait`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const apiKey = process.env.LANGGRAPH_API_KEY;
  if (apiKey) {
    headers["X-Api-Key"] = apiKey;
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ assistant_id: assistantId, input }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `LangGraph API error (${res.status}): ${text || res.statusText}`
    );
  }

  const data = (await res.json()) as { values?: TOutput; output?: TOutput };
  return (data.values ?? data.output ?? data) as TOutput;
}

// ---------------------------------------------------------------------------
// Research Brief Agent
// ---------------------------------------------------------------------------

export async function invokeResearchBriefAgent(input: {
  messages: Message[];
  research_brief?: string;
}): Promise<ResearchBriefAgentState> {
  const result = await invokeAssistant<
    { messages: Message[]; research_brief?: string },
    ResearchBriefAgentState
  >(RESEARCH_BRIEF_ASSISTANT_ID, input);

  return result as ResearchBriefAgentState;
}

// ---------------------------------------------------------------------------
// Research Agent
// ---------------------------------------------------------------------------

export async function invokeResearchAgent(input: {
  research_brief: string;
  messages: Message[];
}): Promise<ResearchAgentState> {
  const result = await invokeAssistant<
    { research_brief: string; messages: Message[] },
    ResearchAgentState
  >(RESEARCH_ASSISTANT_ID, input);

  return result as ResearchAgentState;
}
