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
  const request: RunRequest<ResearchBriefAgentInput> = {
    assistant_id: GRAPH_IDS.RESEARCH_BRIEF,
    input,
    stream_mode: ['values'],
    config: {
      recursion_limit: 50,
      ...options?.config,
    },
  };

  const response = await makeRequest<RunResponse<ResearchBriefAgentState>>(
    `/assistants/${GRAPH_IDS.RESEARCH_BRIEF}/runs/wait`,
    {
      method: 'POST',
      body: JSON.stringify(request),
      signal: options?.signal,
    }
  );

  if (response.status === 'error') {
    throw new LangGraphError(`Graph execution failed: ${response.error}`);
  }

  if (!response.output) {
    throw new LangGraphError('Graph execution completed but no output was returned');
  }

  return response.output;
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
  const request: RunRequest<ResearchBriefAgentInput> = {
    assistant_id: GRAPH_IDS.RESEARCH_BRIEF,
    input,
    stream_mode: ['values', 'updates'],
    config: {
      recursion_limit: 50,
      ...options?.config,
    },
  };

  const url = `${LANGGRAPH_API_URL}/assistants/${GRAPH_IDS.RESEARCH_BRIEF}/runs/stream`;
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
  const request: RunRequest<ResearchAgentInput> = {
    assistant_id: GRAPH_IDS.RESEARCH,
    input,
    stream_mode: ['values'],
    config: {
      recursion_limit: 50,
      ...options?.config,
    },
  };

  const response = await makeRequest<RunResponse<ResearchAgentState>>(
    `/assistants/${GRAPH_IDS.RESEARCH}/runs/wait`,
    {
      method: 'POST',
      body: JSON.stringify(request),
      signal: options?.signal,
    }
  );

  if (response.status === 'error') {
    throw new LangGraphError(`Graph execution failed: ${response.error}`);
  }

  if (!response.output) {
    throw new LangGraphError('Graph execution completed but no output was returned');
  }

  return response.output;
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
  const request: RunRequest<ResearchAgentInput> = {
    assistant_id: GRAPH_IDS.RESEARCH,
    input,
    stream_mode: ['values', 'updates'],
    config: {
      recursion_limit: 50,
      ...options?.config,
    },
  };

  const url = `${LANGGRAPH_API_URL}/assistants/${GRAPH_IDS.RESEARCH}/runs/stream`;
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
