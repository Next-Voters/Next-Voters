/**
 * LangGraph API Usage Examples
 * 
 * This file demonstrates how to use the LangGraph API client
 * to interact with research_brief_agent and research_agent.
 */

import {
  invokeResearchBriefAgent,
  streamResearchBriefAgent,
  invokeResearchAgent,
  streamResearchAgent,
  createHumanMessage,
  createSystemMessage,
} from '@/lib/ai-agent';

// ============================================================================
// Example 1: Research Brief Agent - Non-Streaming
// ============================================================================

export async function exampleResearchBrief() {
  try {
    console.log('Starting research brief generation...');
    
    const result = await invokeResearchBriefAgent({
      messages: [
        createHumanMessage('Research the latest developments in AI agents and autonomous systems in 2024'),
      ],
    });

    console.log('Research Brief Generated:');
    console.log(result.research_brief);
    console.log('\nFull conversation:');
    console.log(result.messages);

    return result;
  } catch (error) {
    console.error('Error generating research brief:', error);
    throw error;
  }
}

// ============================================================================
// Example 2: Research Brief Agent - Streaming
// ============================================================================

export async function exampleResearchBriefStreaming() {
  try {
    console.log('Starting streaming research brief generation...');
    
    await streamResearchBriefAgent(
      {
        messages: [
          createHumanMessage('Research climate change policies in the US'),
        ],
      },
      {
        onMessage: (event) => {
          console.log('Stream event:', event.event);
          // You can access the data with event.data
          if (event.data) {
            console.log('Data:', JSON.stringify(event.data, null, 2));
          }
        },
        onDone: () => {
          console.log('Stream completed!');
        },
        onError: (error) => {
          console.error('Stream error:', error);
        },
      }
    );
  } catch (error) {
    console.error('Error in streaming research brief:', error);
    throw error;
  }
}

// ============================================================================
// Example 3: Research Agent - Non-Streaming
// ============================================================================

export async function exampleResearchAgent() {
  try {
    console.log('Starting research agent...');
    
    // Note: Adjust the input fields based on your actual research_agent schema
    const result = await invokeResearchAgent({
      topic: 'Latest developments in renewable energy technology',
      // Add other fields as needed based on your schema
    });

    console.log('Research completed:');
    console.log(JSON.stringify(result, null, 2));

    return result;
  } catch (error) {
    console.error('Error running research agent:', error);
    throw error;
  }
}

// ============================================================================
// Example 4: Research Agent - Streaming
// ============================================================================

export async function exampleResearchAgentStreaming() {
  try {
    console.log('Starting streaming research agent...');
    
    await streamResearchAgent(
      {
        topic: 'AI regulations in the European Union',
        // Add other fields as needed
      },
      {
        onMessage: (event) => {
          console.log('Stream event:', event.event);
          if (event.data) {
            console.log('Data:', JSON.stringify(event.data, null, 2));
          }
        },
        onDone: () => {
          console.log('Research stream completed!');
        },
        onError: (error) => {
          console.error('Research stream error:', error);
        },
      }
    );
  } catch (error) {
    console.error('Error in streaming research agent:', error);
    throw error;
  }
}

// ============================================================================
// Example 5: Using with AbortController (Cancellation)
// ============================================================================

export async function exampleWithCancellation() {
  const controller = new AbortController();
  
  // Set a timeout to cancel after 30 seconds
  setTimeout(() => {
    console.log('Cancelling request...');
    controller.abort();
  }, 30000);

  try {
    const result = await invokeResearchBriefAgent(
      {
        messages: [createHumanMessage('Research quantum computing')],
      },
      {
        signal: controller.signal,
      }
    );

    console.log('Result:', result);
    return result;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('Request was cancelled');
    } else {
      console.error('Error:', error);
    }
    throw error;
  }
}

// ============================================================================
// Example 6: Using with Custom Configuration
// ============================================================================

export async function exampleWithCustomConfig() {
  try {
    const result = await invokeResearchBriefAgent(
      {
        messages: [
          createSystemMessage('You are a helpful research assistant focused on providing concise summaries.'),
          createHumanMessage('Research the impact of remote work on productivity'),
        ],
      },
      {
        config: {
          recursion_limit: 100, // Allow more steps
          metadata: {
            user_id: 'user-123',
            session_id: 'session-456',
          },
          tags: ['research', 'productivity'],
        },
      }
    );

    console.log('Result:', result);
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
