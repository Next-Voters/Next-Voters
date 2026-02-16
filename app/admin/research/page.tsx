'use client';

/**
 * Research Assistant Page
 * 
 * Main page that orchestrates the two-stage research workflow:
 * 1. Research Brief Agent with clarification loop
 * 2. Research Agent execution with approved brief
 */

import { useState } from 'react';
import { ResearchBriefForm } from '@/components/research/research-brief-form';
import { ResearchResults } from '@/components/research/research-results';
import { Message } from '@/types/langgraph';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ResearchPage() {
  const [researchBrief, setResearchBrief] = useState<string | null>(null);
  const [conversationMessages, setConversationMessages] = useState<Message[]>([]);

  const handleBriefComplete = (brief: string, messages: Message[]) => {
    setResearchBrief(brief);
    setConversationMessages(messages);
  };

  const handleStartOver = () => {
    setResearchBrief(null);
    setConversationMessages([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
      <div className="container mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            AI Research Assistant
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get comprehensive research on any topic with our AI-powered assistant that asks
            clarifying questions to understand exactly what you need.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {!researchBrief ? (
            // Stage 1: Research Brief Creation
            <ResearchBriefForm onBriefComplete={handleBriefComplete} />
          ) : (
            // Stage 2: Research Execution & Results
            <>
              <div className="flex justify-center">
                <Button variant="outline" onClick={handleStartOver} className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Start New Research
                </Button>
              </div>
              <ResearchResults
                researchBrief={researchBrief}
                conversationMessages={conversationMessages}
              />
            </>
          )}
        </div>

        {/* Footer Info */}
        <div className="text-center text-sm text-muted-foreground pt-8">
          <p>
            Powered by LangGraph • Multi-agent research workflow with
            <span className="font-semibold text-primary"> research_brief_agent</span> and
            <span className="font-semibold text-primary"> research_agent</span>
          </p>
        </div>
      </div>
    </div>
  );
}
