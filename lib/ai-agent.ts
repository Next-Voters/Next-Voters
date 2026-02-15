/**
 * LangGraph API Client
 * 
 * Client functions for interacting with deployed LangGraph agents:
 * - research_brief_agent
 * - research_agent
 */

import {
  ResearchBriefAgentInput,
  ResearchBriefAgentState,
  ResearchAgentInput,
  ResearchAgentState,
  InvokeOptions,
  StreamOptions,
  RunRequest,
  RunResponse,
  StreamEvent,
  LangGraphError,
  Message,
} from '@/types/langgraph';

// ============================================================================
// Configuration
// ============================================================================

const LANGGRAPH_API_URL = process.env.LANGGRAPH_API_URL || 'https://disastrous-doretta-next-voters-1be027c9.koyeb.app';

// Graph IDs (these act as assistant_id in the API)
const GRAPH_IDS = {
  RESEARCH_BRIEF: 'research_brief_agent',
  RESEARCH: 'research_agent',
} as const;

const assistantIdCache = new Map<string, string>();

interface AssistantSearchResult {
  assistant_id: string;
  graph_id: string;
  name?: string;
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Makes an HTTP request to the LangGraph API
 */
async function makeRequest<T>(
  endpoint: string,
  options: RequestInit & { signal?: AbortSignal }
): Promise<T> {
  const url = `${LANGGRAPH_API_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new LangGraphError(
        errorData.detail || errorData.message || `API request failed: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof LangGraphError) {
      throw error;
    }
    throw new LangGraphError(
      `Network error: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Helper to create a human message
 */
export function createHumanMessage(content: string): Message {
  return {
    type: 'human',
    content,
  };
}

/**
 * Helper to create a system message
 */
export function createSystemMessage(content: string): Message {
  return {
    type: 'system',
    content,
  };
}

/**
 * Extracts the graph output from a run response.
 * Tries `output`, then `result`, then `values` to handle different API response shapes.
 */
function extractRunOutput<T>(response: RunResponse<T>): T {
  const maybeEnvelope = response as unknown as Partial<RunResponse<T>>;
  const isRunEnvelope =
    typeof maybeEnvelope === 'object' &&
    maybeEnvelope !== null &&
    ('run_id' in maybeEnvelope ||
      'status' in maybeEnvelope ||
      'output' in maybeEnvelope ||
      'result' in maybeEnvelope ||
      'values' in maybeEnvelope);

  if (!isRunEnvelope) {
    return response as unknown as T;
  }

  const output = maybeEnvelope.output ?? maybeEnvelope.result ?? maybeEnvelope.values;

  if (output !== undefined && output !== null) {
    return output;
  }

  throw new LangGraphError(
    `Graph execution completed but no output was returned (run_id: ${maybeEnvelope.run_id ?? 'unknown'})`
  );
}

/**
 * Resolves a graph id/name to an assistant UUID.
 * Falls back to the provided graph id if lookup fails so existing deployments keep working.
 */
async function resolveAssistantId(graphId: string, signal?: AbortSignal): Promise<string> {
  const cached = assistantIdCache.get(graphId);
  if (cached) {
    return cached;
  }

  try {
    const assistants = await makeRequest<AssistantSearchResult[]>(
      '/assistants/search',
      {
        method: 'POST',
        body: JSON.stringify({}),
        signal,
      }
    );

    const matches = assistants.filter((assistant) =>
      assistant.graph_id === graphId || assistant.name === graphId
    );

    const match = matches
      .sort((a, b) => {
        const aTime = Date.parse(a.updated_at || a.created_at || '1970-01-01T00:00:00.000Z');
        const bTime = Date.parse(b.updated_at || b.created_at || '1970-01-01T00:00:00.000Z');
        return bTime - aTime;
      })[0];

    if (match?.assistant_id) {
      assistantIdCache.set(graphId, match.assistant_id);
      return match.assistant_id;
    }
  } catch (error) {
    console.warn(`Failed to resolve assistant ID for ${graphId}:`, error);
  }

  return graphId;
}

function shouldRetryWithGraphId(error: unknown): boolean {
  if (!(error instanceof LangGraphError)) {
    return false;
  }

  return /failed to get assistant .* from database/i.test(error.message);
}

// ============================================================================
// Research Brief Agent Functions
// ============================================================================

/**
 * Invokes the research_brief_agent and waits for completion
 * 
 * @param input - The input containing messages and optional research_brief
 * @param options - Optional configuration
 * @returns The final state with messages and research_brief
 * 
 * @example
 * ```ts
 * const result = await invokeResearchBriefAgent({
 *   messages: [createHumanMessage("Research AI agents in 2024")],
 * });
 * console.log(result.research_brief);
 * ```
 */
export async function invokeResearchBriefAgent(
  input: ResearchBriefAgentInput,
  options?: InvokeOptions
): Promise<ResearchBriefAgentState> {
  const graphId = GRAPH_IDS.RESEARCH_BRIEF;
  let assistantId = await resolveAssistantId(graphId, options?.signal);

  for (let attempt = 0; attempt < 2; attempt++) {
    const request: RunRequest<ResearchBriefAgentInput> = {
      assistant_id: assistantId,
      input,
      stream_mode: ['values'],
      config: {
        recursion_limit: 50,
        ...options?.config,
      },
    };

    try {
      const response = await makeRequest<RunResponse<ResearchBriefAgentState> | ResearchBriefAgentState>(
        `/runs/wait`,
        {
          method: 'POST',
          body: JSON.stringify(request),
          signal: options?.signal,
        }
      );

      if ('status' in response && response.status === 'error') {
        throw new LangGraphError(`Graph execution failed: ${response.error}`);
      }

      return extractRunOutput(response as RunResponse<ResearchBriefAgentState>);
    } catch (error) {
      if (attempt === 0 && shouldRetryWithGraphId(error) && assistantId !== graphId) {
        assistantIdCache.delete(graphId);
        assistantId = graphId;
        continue;
      }
      throw error;
    }
  }

  throw new LangGraphError('Graph execution failed after retry');
}

/**
 * Streams the execution of research_brief_agent using Server-Sent Events
 * 
 * @param input - The input containing messages and optional research_brief
 * @param options - Optional configuration including event handlers
 * @returns Promise that resolves when streaming completes
 * 
 * @example
 * ```ts
 * await streamResearchBriefAgent(
 *   { messages: [createHumanMessage("Research AI agents")] },
 *   {
 *     onMessage: (event) => console.log('Event:', event),
 *     onDone: () => console.log('Done!'),
 *   }
 * );
 * ```
 */
export async function streamResearchBriefAgent(
  input: ResearchBriefAgentInput,
  options?: StreamOptions
): Promise<void> {
  const assistantId = await resolveAssistantId(GRAPH_IDS.RESEARCH_BRIEF, options?.signal);

  const request: RunRequest<ResearchBriefAgentInput> = {
    assistant_id: assistantId,
    input,
    stream_mode: ['values', 'updates'],
    config: {
      recursion_limit: 50,
      ...options?.config,
    },
  };

  const url = `${LANGGRAPH_API_URL}/runs/stream`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
    },
    body: JSON.stringify(request),
    signal: options?.signal,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new LangGraphError(
      errorData.detail || `Stream request failed: ${response.statusText}`,
      response.status,
      errorData
    );
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new LangGraphError('Response body is not readable');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            options?.onDone?.();
            return;
          }

          try {
            const event: StreamEvent = JSON.parse(data);
            options?.onMessage?.(event);
          } catch (e) {
            console.warn('Failed to parse SSE data:', data);
          }
        }
      }
    }

    options?.onDone?.();
  } catch (error) {
    options?.onError?.(error instanceof Error ? error : new Error(String(error)));
    throw error;
  } finally {
    reader.releaseLock();
  }
}

// ============================================================================
// Research Agent Functions
// ============================================================================

/**
 * Invokes the research_agent and waits for completion
 * 
 * Note: The research_agent schema is currently unavailable from the API.
 * This function accepts a flexible input object.
 * 
 * @param input - The input for the research agent
 * @param options - Optional configuration
 * @returns The final state from the research agent
 * 
 * @example
 * ```ts
 * const result = await invokeResearchAgent({
 *   topic: "AI developments in 2024",
 * });
 * ```
 */
export async function invokeResearchAgent(
  input: ResearchAgentInput,
  options?: InvokeOptions
): Promise<ResearchAgentState> {
  const graphId = GRAPH_IDS.RESEARCH;
  let assistantId = await resolveAssistantId(graphId, options?.signal);

  for (let attempt = 0; attempt < 2; attempt++) {
    const request: RunRequest<ResearchAgentInput> = {
      assistant_id: assistantId,
      input,
      stream_mode: ['values'],
      config: {
        recursion_limit: 50,
        ...options?.config,
      },
    };

    try {
      const response = await makeRequest<RunResponse<ResearchAgentState> | ResearchAgentState>(
        `/runs/wait`,
        {
          method: 'POST',
          body: JSON.stringify(request),
          signal: options?.signal,
        }
      );

      if ('status' in response && response.status === 'error') {
        throw new LangGraphError(`Graph execution failed: ${response.error}`);
      }

      return extractRunOutput(response as RunResponse<ResearchAgentState>);
    } catch (error) {
      if (attempt === 0 && shouldRetryWithGraphId(error) && assistantId !== graphId) {
        assistantIdCache.delete(graphId);
        assistantId = graphId;
        continue;
      }
      throw error;
    }
  }

  throw new LangGraphError('Graph execution failed after retry');
}

/**
 * Streams the execution of research_agent using Server-Sent Events
 * 
 * @param input - The input for the research agent
 * @param options - Optional configuration including event handlers
 * @returns Promise that resolves when streaming completes
 * 
 * @example
 * ```ts
 * await streamResearchAgent(
 *   { topic: "AI developments" },
 *   {
 *     onMessage: (event) => console.log('Event:', event),
 *     onDone: () => console.log('Done!'),
 *   }
 * );
 * ```
 */
export async function streamResearchAgent(
  input: ResearchAgentInput,
  options?: StreamOptions
): Promise<void> {
  const assistantId = await resolveAssistantId(GRAPH_IDS.RESEARCH, options?.signal);

  const request: RunRequest<ResearchAgentInput> = {
    assistant_id: assistantId,
    input,
    stream_mode: ['values', 'updates'],
    config: {
      recursion_limit: 50,
      ...options?.config,
    },
  };

  const url = `${LANGGRAPH_API_URL}/runs/stream`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
    },
    body: JSON.stringify(request),
    signal: options?.signal,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new LangGraphError(
      errorData.detail || `Stream request failed: ${response.statusText}`,
      response.status,
      errorData
    );
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new LangGraphError('Response body is not readable');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            options?.onDone?.();
            return;
          }

          try {
            const event: StreamEvent = JSON.parse(data);
            options?.onMessage?.(event);
          } catch (e) {
            console.warn('Failed to parse SSE data:', data);
          }
        }
      }
    }

    options?.onDone?.();
  } catch (error) {
    options?.onError?.(error instanceof Error ? error : new Error(String(error)));
    throw error;
  } finally {
    reader.releaseLock();
  }
}
