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
import { generateObject } from 'ai';
import z from 'zod';
import { openai } from '@/lib/ai';
import { MODEL_NAME } from '@/data/ai-config';

interface ClarifyWithUserResponse {
  need_clarification?: boolean;
  question?: string;
  verification?: string;
  research_brief?: string;
}

function getMessageTextContent(message: Message | undefined): string {
  if (!message) {
    return '';
  }

  if (typeof message.content === 'string') {
    return message.content;
  }

  return message.content
    .map((item) => (item.type === 'text' && item.text ? item.text : ''))
    .join('\n')
    .trim();
}

function parseClarifyWithUserPayload(rawContent: string): ClarifyWithUserResponse | null {
  if (!rawContent) {
    return null;
  }

  const trimmed = rawContent.trim();
  const withoutFence = trimmed
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();

  try {
    const parsed = JSON.parse(withoutFence) as ClarifyWithUserResponse;

    const hasExpectedShape =
      typeof parsed === 'object' &&
      parsed !== null &&
      ('need_clarification' in parsed ||
        'question' in parsed ||
        'verification' in parsed ||
        'research_brief' in parsed);

    return hasExpectedShape ? parsed : null;
  } catch {
    return null;
  }
}

function normalizeResearchBriefState(state: ResearchBriefAgentState): ResearchBriefAgentState {
  if (!state.messages?.length) {
    return state;
  }

  const lastAiMessageIndex = [...state.messages]
    .reverse()
    .findIndex((message) => message.type === 'ai');

  if (lastAiMessageIndex === -1) {
    return state;
  }

  const actualIndex = state.messages.length - 1 - lastAiMessageIndex;
  const lastAiMessage = state.messages[actualIndex];
  const rawContent = getMessageTextContent(lastAiMessage);
  const parsedPayload = parseClarifyWithUserPayload(rawContent);

  if (!parsedPayload) {
    return state;
  }

  const normalizedNeedsClarification =
    typeof parsedPayload.need_clarification === 'boolean'
      ? parsedPayload.need_clarification
      : state.needs_clarification;

  const normalizedQuestion =
    typeof parsedPayload.question === 'string' && parsedPayload.question.trim()
      ? parsedPayload.question.trim()
      : state.question;

  const normalizedResearchBrief =
    typeof parsedPayload.research_brief === 'string' && parsedPayload.research_brief.trim()
      ? parsedPayload.research_brief.trim()
      : typeof parsedPayload.verification === 'string' && parsedPayload.verification.trim()
      ? parsedPayload.verification.trim()
      : state.research_brief;

  const uiMessage =
    normalizedNeedsClarification
      ? normalizedQuestion
      : normalizedResearchBrief;

  const nextMessages = [...state.messages];
  if (uiMessage && typeof lastAiMessage.content === 'string') {
    nextMessages[actualIndex] = {
      ...lastAiMessage,
      content: uiMessage,
    };
  }

  return {
    ...state,
    messages: nextMessages,
    needs_clarification: normalizedNeedsClarification,
    question: normalizedQuestion,
    research_brief: normalizedNeedsClarification ? state.research_brief : normalizedResearchBrief,
  };
}

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

    const normalizedResult = normalizeResearchBriefState(result);

    return {
      success: true,
      data: normalizedResult,
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

    const normalizedResult = normalizeResearchBriefState(result);

    return {
      success: true,
      data: normalizedResult,
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
  const messages = conversationMessages || [];

  try {
    // Primary path: LangGraph research agent
    const result = await invokeResearchAgent({
      research_brief: researchBrief,
      messages,
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Error executing research:', error);

    // Fallback path: direct model synthesis so research remains usable during LangGraph outages
    try {
      const conversationContext = messages
        .map((message) => {
          const content =
            typeof message.content === 'string'
              ? message.content
              : JSON.stringify(message.content);

          return `${message.type.toUpperCase()}: ${content}`;
        })
        .join('\n');

      const fallbackResult = await generateObject({
        model: openai.chat(MODEL_NAME),
        schema: z.object({
          executive_summary: z.string(),
          key_findings: z.array(z.string()),
          assumptions_and_limits: z.array(z.string()),
          recommended_next_steps: z.array(z.string()),
          research_questions: z.array(z.string()),
        }),
        system:
          'You are a careful research analyst. Produce practical, structured results using only the provided brief and conversation context. If evidence is missing, state assumptions explicitly.',
        prompt: `Research brief:\n${researchBrief}\n\nConversation context:\n${conversationContext || 'None provided.'}`,
        temperature: 0.2,
      });

      return {
        success: true,
        data: {
          mode: 'fallback',
          provider: 'openai',
          model: MODEL_NAME,
          ...fallbackResult.object,
          fallback_reason: error instanceof Error ? error.message : String(error),
        },
      };
    } catch (fallbackError) {
      console.error('Fallback research execution failed:', fallbackError);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to execute research',
      };
    }
  }
}
