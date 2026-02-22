'use client';

/**
 * Research Results Component
 * 
 * Displays the final research brief and research agent results
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { executeResearch } from '@/server-actions/research-actions';
import { Message, ResearchAgentState } from '@/types/langgraph';

interface ResearchResultsProps {
  researchBrief: string;
  conversationMessages: Message[];
}

export function ResearchResults({ researchBrief, conversationMessages }: ResearchResultsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ResearchAgentState | null>(null);

  useEffect(() => {
    const runResearch = async () => {
      setLoading(true);
      setError(null);

      const result = await executeResearch(researchBrief, conversationMessages);

      setLoading(false);

      if (result.success && result.data) {
        setResults(result.data);
      } else {
        setError(result.error || 'Failed to execute research');
      }
    };

    runResearch();
  }, [researchBrief, conversationMessages]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Research Brief Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Research Brief
          </CardTitle>
          <CardDescription>The approved research scope and objectives</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap bg-muted/50 p-4 rounded-lg">
              {researchBrief}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Research Results Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : error ? (
              <XCircle className="w-5 h-5 text-destructive" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            )}
            Research Results
          </CardTitle>
          <CardDescription>
            {loading
              ? 'Executing research agent...'
              : error
              ? 'Research execution failed'
              : 'Research completed successfully'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
                <p className="text-sm text-muted-foreground">
                  Running research agent... This may take a few minutes.
                </p>
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {results && !loading && !error && (
            <div className="space-y-6">
              {/* Display all results data */}
              {Object.entries(results).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      {key}
                    </Badge>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    {typeof value === 'string' ? (
                      <div className="whitespace-pre-wrap text-sm">{value}</div>
                    ) : Array.isArray(value) ? (
                      <div className="space-y-2">
                        {value.map((item, index) => (
                          <div key={index} className="border-l-2 border-primary/30 pl-3">
                            <pre className="text-xs overflow-x-auto">
                              {typeof item === 'string' ? item : JSON.stringify(item, null, 2)}
                            </pre>
                          </div>
                        ))}
                      </div>
                    ) : typeof value === 'object' && value !== null ? (
                      <pre className="text-xs overflow-x-auto">
                        {JSON.stringify(value, null, 2)}
                      </pre>
                    ) : (
                      <div className="text-sm">{String(value)}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
