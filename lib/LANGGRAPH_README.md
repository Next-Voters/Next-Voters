# LangGraph API Integration

This directory contains the TypeScript client for interacting with the deployed LangGraph API at `https://disastrous-doretta-next-voters-1be027c9.koyeb.app`.

## 📁 Files

- **`lib/ai-agent.ts`** - Main client implementation with functions for both agents
- **`types/langgraph.ts`** - TypeScript type definitions for the API
- **`lib/ai-agent-examples.ts`** - Usage examples and patterns

## 🚀 Quick Start

### 1. Environment Setup

Add the LangGraph API URL to your `.env` file:

```env
LANGGRAPH_API_URL=https://disastrous-doretta-next-voters-1be027c9.koyeb.app
```

### 2. Basic Usage

```typescript
import { invokeResearchBriefAgent, createHumanMessage } from '@/lib/ai-agent';

// Generate a research brief
const result = await invokeResearchBriefAgent({
  messages: [createHumanMessage('Research AI developments in 2024')],
});

console.log(result.research_brief);
```

## 📚 Available Functions

### Research Brief Agent

#### `invokeResearchBriefAgent(input, options?)`
Invokes the `research_brief_agent` and waits for completion.

**Input Schema:**
```typescript
{
  messages: Message[];      // Array of conversation messages
  research_brief?: string;  // Optional initial brief
}
```

**Returns:** `ResearchBriefAgentState` with messages and research_brief

#### `streamResearchBriefAgent(input, options?)`
Streams the execution using Server-Sent Events.

**Options:**
- `onMessage` - Called for each stream event
- `onDone` - Called when streaming completes
- `onError` - Called on errors

### Research Agent

#### `invokeResearchAgent(input, options?)`
Invokes the `research_agent` and waits for completion.

> ⚠️ **Note:** The schema for `research_agent` is currently unavailable from the API. The input accepts a flexible object. Adjust based on your actual schema.

#### `streamResearchAgent(input, options?)`
Streams the execution using Server-Sent Events.

## 🛠️ Helper Functions

- `createHumanMessage(content)` - Create a human message
- `createSystemMessage(content)` - Create a system message

## 📖 Examples

See `lib/ai-agent-examples.ts` for comprehensive examples including:

1. Non-streaming invocation
2. Streaming with event handlers
3. Request cancellation with AbortController
4. Custom configuration (recursion limits, metadata, tags)

## 🔍 Type Safety

All functions are fully typed with TypeScript. The types include:

- `Message` types (Human, AI, System)
- `RunConfig` for graph configuration
- `InvokeOptions` and `StreamOptions`
- Input/Output state types for both agents
- `LangGraphError` for error handling

## ⚠️ Known Issues

1. **`research_agent` Schema Unavailable**: The API returns a 500 error when fetching the schema for `research_agent`. The client uses a flexible input type as a workaround.

2. **Assistant Creation Error**: Creating new assistants for `research_agent` also returns 500 errors, indicating potential database or graph compilation issues on the server.

## 🔗 API Documentation

Full API documentation available at:
https://disastrous-doretta-next-voters-1be027c9.koyeb.app/docs

## 📝 API Endpoint Structure

The LangGraph API requires assistant IDs to be included in the endpoint path:

```
POST /assistants/{assistant_id}/runs/wait     # For synchronous invocations
POST /assistants/{assistant_id}/runs/stream   # For streaming invocations
```

Example:
```typescript
// Correct endpoint structure
const url = `${LANGGRAPH_API_URL}/assistants/research_brief_agent/runs/wait`;

// The assistant_id is included in both the path AND the request body
const request = {
  assistant_id: 'research_brief_agent',
  input: { messages: [...] }
};
```

## 📝 Example: Streaming with React

```typescript
'use client';

import { useState } from 'react';
import { streamResearchBriefAgent, createHumanMessage } from '@/lib/ai-agent';

export function ResearchComponent() {
  const [events, setEvents] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleResearch = async () => {
    setLoading(true);
    setEvents([]);

    await streamResearchBriefAgent(
      {
        messages: [createHumanMessage('Research climate policies')],
      },
      {
        onMessage: (event) => {
          setEvents((prev) => [...prev, JSON.stringify(event, null, 2)]);
        },
        onDone: () => {
          setLoading(false);
        },
        onError: (error) => {
          console.error(error);
          setLoading(false);
        },
      }
    );
  };

  return (
    <div>
      <button onClick={handleResearch} disabled={loading}>
        Start Research
      </button>
      <div>
        {events.map((event, i) => (
          <pre key={i}>{event}</pre>
        ))}
      </div>
    </div>
  );
}
```
