/**
 * LangGraph API Type Definitions
 * 
 * Types for interacting with the deployed LangGraph API at:
 * https://disastrous-doretta-next-voters-1be027c9.koyeb.app
 */

// ============================================================================
// Message Types (based on LangGraph schemas)
// ============================================================================

export type MessageRole = 'human' | 'ai' | 'system' | 'function' | 'tool';

export interface BaseMessage {
  type: string;
  content: string | MessageContent[];
  additional_kwargs?: Record<string, unknown>;
  response_metadata?: Record<string, unknown>;
  name?: string;
  id?: string;
}

export interface MessageContent {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: string | { url: string };
}

export interface HumanMessage extends BaseMessage {
  type: 'human';
}

export interface AIMessage extends BaseMessage {
  type: 'ai';
}

export interface SystemMessage extends BaseMessage {
  type: 'system';
}

export type Message = HumanMessage | AIMessage | SystemMessage;

// ============================================================================
// Graph State Types
// ============================================================================

export interface ResearchBriefAgentState {
  messages: Message[];
  research_brief?: string;
  needs_clarification?: boolean;
  question?: string;
}

export interface ResearchAgentState {
  [key: string]: unknown; // Flexible state for research_agent
}

// ============================================================================
// Graph Input Types
// ============================================================================

export interface ResearchBriefAgentInput {
  messages: Message[];
  research_brief?: string;
}

export interface ResearchAgentInput {
  [key: string]: unknown; // Flexible input for research_agent
}

// ============================================================================
// Run Configuration
// ============================================================================

export interface RunConfig {
  recursion_limit?: number;
  configurable?: Record<string, unknown>;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface RunRequest<T = unknown> {
  assistant_id: string;
  input: T;
  stream_mode?: ('values' | 'messages' | 'updates' | 'debug')[];
  config?: RunConfig;
  multitask_strategy?: string;
  webhook?: string;
  on_completion?: 'delete' | 'keep';
  on_disconnect?: 'cancel' | 'continue';
}

export interface RunResponse<T = unknown> {
  run_id: string;
  status: 'pending' | 'running' | 'success' | 'error' | 'timeout' | 'interrupted';
  output?: T;
  result?: T;
  values?: T;
  error?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface StreamEvent<T = unknown> {
  event: string;
  data: T;
}

// ============================================================================
// Helper Types for Client Functions
// ============================================================================

export interface InvokeOptions {
  config?: RunConfig;
  signal?: AbortSignal;
}

export interface StreamOptions extends InvokeOptions {
  onMessage?: (event: StreamEvent) => void;
  onDone?: () => void;
  onError?: (error: Error) => void;
}

// ============================================================================
// Error Types
// ============================================================================

export class LangGraphError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'LangGraphError';
  }
}
