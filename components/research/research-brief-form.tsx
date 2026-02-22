'use client';

/**
 * Research Brief Form Component
 * 
 * Handles the interactive clarification loop with the research_brief_agent
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Send, Brain } from 'lucide-react';
import { submitResearchTopic, answerClarificationQuestion } from '@/server-actions/research-actions';
import { Message, ResearchBriefAgentState } from '@/types/langgraph';

interface ResearchBriefFormProps {
  onBriefComplete: (brief: string, messages: Message[]) => void;
}

export function ResearchBriefForm({ onBriefComplete }: ResearchBriefFormProps) {
  const [topic, setTopic] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<ResearchBriefAgentState | null>(null);
  const [conversationStarted, setConversationStarted] = useState(false);

  const needsClarification = state?.needs_clarification === true;
  const hasResearchBrief = typeof state?.research_brief === 'string' && state.research_brief.trim().length > 0;

  const handleSubmitTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);

    const result = await submitResearchTopic(topic);

    setLoading(false);

    if (result.success && result.data) {
      setState(result.data);
      setConversationStarted(true);
      
      // Check if we're done immediately (no clarification needed)
      const done = result.data.needs_clarification === false;
      const brief = typeof result.data.research_brief === 'string' ? result.data.research_brief.trim() : '';
      if (done && brief) {
        onBriefComplete(brief, result.data.messages);
      }
    } else {
      setError(result.error || 'Failed to submit topic');
    }
  };

  const handleAnswerQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || !state) return;

    setLoading(true);
    setError(null);

    const result = await answerClarificationQuestion(answer, state.messages);

    setLoading(false);
    setAnswer('');

    if (result.success && result.data) {
      setState(result.data);
      
      // Check if we're done with clarifications
      const done = result.data.needs_clarification === false;
      const brief = typeof result.data.research_brief === 'string' ? result.data.research_brief.trim() : '';
      if (done && brief) {
        onBriefComplete(brief, result.data.messages);
      }
    } else {
      setError(result.error || 'Failed to answer question');
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-6 h-6" />
          Research Brief Assistant
        </CardTitle>
        <CardDescription>
          {!conversationStarted
            ? 'Enter your research topic, and I\'ll help you refine it with clarifying questions.'
            : 'Answer the clarifying questions to create a comprehensive research brief.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Initial Topic Input */}
        {!conversationStarted && (
          <form onSubmit={handleSubmitTopic} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="topic" className="text-sm font-medium">
                What would you like to research?
              </label>
              <Input
                id="topic"
                type="text"
                placeholder="e.g., Impact of AI on healthcare in developing countries"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={loading}
                className="w-full"
              />
            </div>
            <Button type="submit" disabled={loading || !topic.trim()} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Start Research Brief
                </>
              )}
            </Button>
          </form>
        )}

        {/* Conversation History */}
        {state && state.messages && state.messages.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Conversation</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {state.messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    message.type === 'human'
                      ? 'bg-primary/10 ml-8'
                      : message.type === 'ai'
                      ? 'bg-secondary/50 mr-8'
                      : 'bg-muted/50'
                  }`}
                >
                  <div className="text-xs font-medium mb-1 uppercase text-muted-foreground">
                    {message.type === 'human' ? 'You' : message.type === 'ai' ? 'AI Assistant' : 'System'}
                  </div>
                  <div className="text-sm whitespace-pre-wrap">
                    {typeof message.content === 'string' ? message.content : JSON.stringify(message.content)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clarification Question */}
        {state && needsClarification && state.question && (
          <Alert className="border-primary/50 bg-primary/5">
            <AlertDescription className="space-y-4">
              <div className="font-medium text-primary">Clarification Needed:</div>
              <div className="text-sm">{state.question}</div>
            </AlertDescription>
          </Alert>
        )}

        {/* Answer Input */}
        {conversationStarted && needsClarification && (
          <form onSubmit={handleAnswerQuestion} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="answer" className="text-sm font-medium">
                Your Answer
              </label>
              <Input
                id="answer"
                type="text"
                placeholder="Type your answer..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={loading}
                className="w-full"
              />
            </div>
            <Button type="submit" disabled={loading || !answer.trim()} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Answer
                </>
              )}
            </Button>
          </form>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Brief Complete Message */}
        {state && !needsClarification && hasResearchBrief && (
          <Alert className="border-green-500/50 bg-green-500/5">
            <AlertDescription>
              <div className="font-medium text-green-700 dark:text-green-400 mb-2">
                ✓ Research Brief Complete!
              </div>
              <div className="text-sm text-muted-foreground">
                Starting research execution...
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
