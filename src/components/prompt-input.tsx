'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, BookOpen, Lightbulb, Loader2, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

const SAMPLE_PROMPTS = [
  'A young, brave character discovering a hidden, magical garden with glowing blossoms and gentle whispers.',
  'An inquisitive 6-year-old girl named Maya who discovers a hidden tea party hosted by friendly garden hedgehogs.',
  'A shy baby dragon named Pip who breathes bubbles instead of fire and helps save the village festival.',
  'A cheerful squirrel named Oliver who builds a treehouse library for all the forest animals.',
];

const MAX_CHARS = 500;

export function PromptInput({ onSubmit, isLoading }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt.trim());
    }
  };

  const handleSelectSample = (sample: string) => {
    if (!isLoading) {
      setPrompt(sample);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl border-amber-200/50 bg-card/95 backdrop-blur-sm transition-all hover:shadow-2xl hover:border-amber-300">
      <CardContent className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-foreground text-sm sm:text-base">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                <BookOpen className="h-4 w-4" />
              </span>
              <span>Describe your story idea</span>
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              <span className={prompt.length > MAX_CHARS ? 'text-destructive font-bold' : ''}>
                {prompt.length}
              </span>
              /{MAX_CHARS}
            </div>
          </div>

          <div className="relative">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value.slice(0, MAX_CHARS))}
              placeholder="e.g. A brave little sea turtle named Toby who gets lost among glowing coral reefs and makes three unique ocean friends on his journey home..."
              disabled={isLoading}
              rows={4}
              className="resize-none text-base sm:text-lg p-4 rounded-xl border-muted focus-visible:ring-amber-500/50 transition-all bg-background/50 placeholder:text-muted-foreground/60 leading-relaxed"
            />
          </div>

          {/* Quick inspiration suggestion chips */}
          <div className="pt-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
              <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
              <span>Need inspiration? Try one of these:</span>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {SAMPLE_PROMPTS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  disabled={isLoading}
                  className="text-left text-xs bg-muted/60 hover:bg-amber-100 hover:text-amber-900 dark:hover:bg-amber-950/50 dark:hover:text-amber-200 transition-colors px-2.5 py-1 rounded-md border text-muted-foreground border-border/60 disabled:opacity-50 disabled:pointer-events-none line-clamp-1 max-w-[280px] sm:max-w-none"
                >
                  &ldquo;{sample.slice(0, 48)}...&rdquo;
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            {prompt.length > 0 && !isLoading && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setPrompt('')}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </Button>
            )}

            <Button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              size="lg"
              className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 text-white font-semibold shadow-lg shadow-orange-500/25 px-6 sm:px-8 py-6 rounded-xl text-base transition-all duration-300 disabled:opacity-50 group"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Weaving Storybook Magic...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 transition-transform group-hover:rotate-12" />
                  <span>Generate My Storybook</span>
                </span>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
