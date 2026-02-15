'use server';

/**
 * Server Actions for Research Assistant
 * 
 * Handles interactions with the LangGraph API for the research workflow
 */

import {
  invokeResearchBriefAgent,
  invokeResearchAgent,
  createHumanMessage,
  createSystemMessage,
} from '@/lib/ai-agent';
import {
  Message,
  ResearchBriefAgentState,
  ResearchAgentState,
} from '@/types/langgraph';

// ============================================================================
// Research Brief Actions
// ============================================================================

/**
 * Submit initial research topic to start the clarification loop
 */
export async function submitResearchTopic(topic: string): Promise<{
  success: boolean;
  data?: ResearchBriefAgentState;
  error?: string;
}> {
  try {
    const result = await invokeResearchBriefAgent({
      messages: [
        createSystemMessage('You are a helpful research assistant. Ask clarifying questions to understand the research scope before creating a research brief.'),
        createHumanMessage(topic),
      ],
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Error submitting research topic:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit research topic',
    };
  }
}

/**
 * Answer a clarification question from the research brief agent
 */
export async function answerClarificationQuestion(
  answer: string,
  conversationMessages: Message[]
): Promise<{
  success: boolean;
  data?: ResearchBriefAgentState;
  error?: string;
}> {
  try {
    // Add the user's answer to the conversation
    const updatedMessages = [
      ...conversationMessages,
      createHumanMessage(answer),
    ];

    const result = await invokeResearchBriefAgent({
      messages: updatedMessages,
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Error answering clarification question:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to answer clarification question',
    };
  }
}

// ============================================================================
// Research Execution Actions
// ============================================================================

/**
 * Execute the research agent with the approved research brief
 */
export async function executeResearch(
  researchBrief: string,
  conversationMessages?: Message[]
): Promise<{
  success: boolean;
  data?: ResearchAgentState;
  error?: string;
}> {
  try {
    // Pass the research brief to the research agent
    // Adjust the input structure based on your actual research_agent schema
    const result = await invokeResearchAgent({
      research_brief: researchBrief,
      messages: conversationMessages || [],
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Error executing research:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to execute research',
    };
  }
}
