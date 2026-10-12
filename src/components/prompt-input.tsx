'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Sparkles,
  BookOpen,
  Lightbulb,
  Loader2,
  ShieldCheck,
  Palette,
  FileText,
  Layers,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

interface SamplePrompt {
  id: string;
  badge: string;
  badgeColor: string;
  emoji: string;
  title: string;
  prompt: string;
}

const SAMPLE_PROMPTS: SamplePrompt[] = [
  {
    id: 'wo-health',
    badge: 'Assignment Benchmark',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-700',
    emoji: '🌸',
    title: 'The Hidden Magical Garden',
    prompt:
      "Create a five-page children's book story outlining about a young, brave character discovering a hidden, magical garden, ensuring the main character remains graphically consistent across all pages, and format the final result as a clean, downloadable PDF.",
  },
  {
    id: 'hedgehog-tea',
    badge: 'Heartwarming',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-700',
    emoji: '🦔',
    title: "Maya's Hedgehog Tea Party",
    prompt:
      'An inquisitive 6-year-old girl named Maya with curly pigtails and yellow rain boots discovers a miniature tea party hosted by friendly woodland hedgehogs beneath an oak root.',
  },
  {
    id: 'bubble-dragon',
    badge: 'Whimsical Fantasy',
    badgeColor: 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950 dark:text-sky-200 dark:border-sky-700',
    emoji: '🫧',
    title: 'Pip the Bubble Dragon',
    prompt:
      'A shy, emerald baby dragon named Pip who breathes shimmering soap bubbles instead of fire, helping bring joy and colorful laughter to a gloomy mountaintop village.',
  },
  {
    id: 'library-squirrel',
    badge: 'Cozy Adventure',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-700',
    emoji: '🐿️',
    title: "Oliver's Treehouse Library",
    prompt:
      'A cheerful, glasses-wearing squirrel named Oliver who builds a cozy canopy library inside an ancient cedar tree, lending acorn-bound picture books to all his animal neighbors.',
  },
];

const MAX_CHARS = 600;

export function PromptInput({ onSubmit, isLoading }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (prompt.trim() && !isLoading) {
        onSubmit(prompt.trim());
      }
    }
  };

  const handleSelectSample = (sample: SamplePrompt) => {
    if (!isLoading) {
      setPrompt(sample.prompt);
      setSelectedId(sample.id);
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Outer Glow Aura */}
      <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-amber-400/25 via-orange-400/20 to-rose-400/25 blur-xl -z-10 transition-opacity duration-500 opacity-70 group-hover:opacity-100" />

      <Card className="relative overflow-hidden rounded-3xl border-2 border-amber-200/80 dark:border-amber-700/60 bg-card/95 backdrop-blur-xl shadow-2xl transition-all duration-300">
        {/* Subtle decorative top gradient stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500" />

        <CardContent className="p-6 sm:p-9 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header: Label + Character Counter */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/20">
                  <BookOpen className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold text-lg sm:text-xl text-foreground tracking-tight">
                    What story shall we create today?
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Enter a single premise. The multi-agent pipeline handles story, character consistency & PDF.
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/60 border border-border/60 text-xs font-mono text-muted-foreground">
                <span className={prompt.length > MAX_CHARS ? 'text-destructive font-bold' : 'font-medium'}>
                  {prompt.length}
                </span>
                <span>/{MAX_CHARS}</span>
              </div>
            </div>

            {/* Premium Textarea Editor Container */}
            <div className="relative rounded-2xl border-2 border-border/80 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/15 bg-background shadow-inner transition-all duration-200">
              <Textarea
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value.slice(0, MAX_CHARS));
                  setSelectedId(null);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Describe your story idea in 1 or 2 sentences... e.g. A brave 7-year-old boy discovering a hidden, magical garden with glowing blossoms and a friendly winged creature..."
                disabled={isLoading}
                rows={4}
                className="w-full resize-none bg-transparent p-5 text-base sm:text-lg font-medium text-foreground placeholder:text-muted-foreground/60 placeholder:font-normal leading-relaxed border-0 focus-visible:ring-0 focus-visible:outline-none"
              />

              {/* Bottom bar inside textarea */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-muted/30 border-t border-border/50 text-xs text-muted-foreground rounded-b-2xl">
                <div className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-medium text-foreground/80">AI Agents Ready</span>
                  <span className="hidden md:inline text-muted-foreground">&bull; GPT-4o + DALL-E 3</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline text-[11px] text-muted-foreground">
                    Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border/80 font-mono text-[10px]">Ctrl+Enter</kbd> to run
                  </span>
                  {prompt.length > 0 && !isLoading && (
                    <button
                      type="button"
                      onClick={() => {
                        setPrompt('');
                        setSelectedId(null);
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw className="h-3 w-3" /> Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Inspiration Chips: Interactive Cards */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  <span>Curated Inspiration Prompts:</span>
                </div>
                <span className="text-[11px] text-muted-foreground">Click any prompt to test</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SAMPLE_PROMPTS.map((sample) => {
                  const isSelected = selectedId === sample.id || prompt === sample.prompt;
                  return (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleSelectSample(sample)}
                      disabled={isLoading}
                      className={`group relative text-left p-3.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-1.5 disabled:opacity-50 disabled:pointer-events-none ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/25 shadow-md'
                          : 'border-border/70 bg-card hover:border-amber-300 hover:bg-amber-50/40 dark:hover:bg-amber-950/20 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{sample.emoji}</span>
                          <span className="font-bold text-xs sm:text-sm text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                            {sample.title}
                          </span>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${sample.badgeColor}`}>
                          {sample.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                        {sample.prompt}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Agent Specifications & Guarantee Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-border/60">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground p-2 rounded-xl bg-muted/40">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span className="font-medium truncate">Character Consistency</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground p-2 rounded-xl bg-muted/40">
                <Palette className="h-3.5 w-3.5 text-pink-500 shrink-0" />
                <span className="font-medium truncate">Soft Watercolor Art</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground p-2 rounded-xl bg-muted/40">
                <Layers className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                <span className="font-medium truncate">5-Page Narrative Arc</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground p-2 rounded-xl bg-muted/40">
                <FileText className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span className="font-medium truncate">8.5&quot;&times;8.5&quot; Square PDF</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground text-center sm:text-left">
                Generates complete illustrations, story narrative, and printable PDF.
              </p>

              <Button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                size="lg"
                className="w-full sm:w-auto relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 text-white font-bold text-base px-8 py-6 rounded-2xl shadow-xl shadow-orange-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-orange-500/40 disabled:opacity-50 disabled:pointer-events-none group"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2.5">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Orchestrating Storybook Agents...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2.5">
                    <Sparkles className="h-5 w-5 transition-transform group-hover:rotate-12" />
                    <span>Generate My Storybook</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
