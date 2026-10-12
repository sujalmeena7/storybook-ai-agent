'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GeneratedStory, GenerationProgress } from '@/lib/types';
import { HeroSection } from '@/components/hero-section';
import { PromptInput } from '@/components/prompt-input';
import { GenerationPipeline } from '@/components/generation-pipeline';
import { StoryPreview } from '@/components/story-preview';
import dynamic from 'next/dynamic';
import { AlertCircle, BookOpen, Sparkles, RefreshCw, Heart } from 'lucide-react';

const PDFDownload = dynamic(
  () => import('@/components/pdf-download').then((mod) => mod.PDFDownload),
  { ssr: false }
);
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [progress, setProgress] = useState<GenerationProgress>({
    stage: 'idle',
    currentStep: 0,
    totalSteps: 4,
    message: '',
  });

  const [story, setStory] = useState<GeneratedStory | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Section refs for smooth scrolling as the generation advances
  const pipelineRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const downloadRef = useRef<HTMLDivElement>(null);

  const isLoading =
    progress.stage !== 'idle' &&
    progress.stage !== 'complete' &&
    progress.stage !== 'error';

  // Smooth scroll helper
  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const handleGenerate = useCallback(async (promptText: string) => {
    setErrorMessage(null);
    setStory(null);
    setProgress({
      stage: 'story',
      currentStep: 1,
      totalSteps: 4,
      message: 'Crafting magical story structure and narrative arc...',
    });

    scrollTo(pipelineRef);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText }),
      });

      if (!response.ok) {
        let errMsg = 'Failed to generate storybook';
        try {
          const errData = await response.json();
          errMsg = errData.error || errMsg;
        } catch {
          // use default
        }
        throw new Error(errMsg);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body from generation stream');
      }

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            try {
              const jsonStr = trimmed.slice(6).trim();
              if (!jsonStr || jsonStr === '[DONE]') continue;

              const data = JSON.parse(jsonStr);

              // Update progress state
              if (data.stage) {
                setProgress((prev) => ({
                  ...prev,
                  stage: data.stage,
                  message: data.message || prev.message,
                  pageNum: data.pageNum !== undefined ? data.pageNum : prev.pageNum,
                  totalPages: data.totalPages !== undefined ? data.totalPages : prev.totalPages,
                  currentStep: data.currentStep !== undefined ? data.currentStep : prev.currentStep,
                  totalSteps: data.totalSteps !== undefined ? data.totalSteps : prev.totalSteps,
                }));

                // Auto-scroll on completion or when illustration stage starts
                if (data.stage === 'complete') {
                  scrollTo(downloadRef);
                } else if (data.stage === 'illustrations' && !story) {
                  scrollTo(previewRef);
                }
              }

              // Update story state if incoming
              const incomingStory = data.story || data.data;
              if (incomingStory) {
                setStory(incomingStory);
              }
            } catch (err) {
              console.warn('Skipping non-JSON SSE chunk', err);
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Generation error:', error);
      const msg = error.message || 'An unexpected error occurred during generation.';
      setErrorMessage(msg);
      setProgress({
        stage: 'error',
        currentStep: 0,
        totalSteps: 4,
        message: msg,
        error: msg,
      });
    }
  }, [story]);

  const handleReset = () => {
    setProgress({
      stage: 'idle',
      currentStep: 0,
      totalSteps: 4,
      message: '',
    });
    setStory(null);
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50/30 via-background to-background selection:bg-amber-200 selection:text-amber-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5 font-bold text-base sm:text-lg tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/20">
              <BookOpen className="h-5 w-5" />
            </span>
            <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
              Storybook AI
            </span>
          </div>

          <div className="flex items-center gap-3">
            {story && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="text-xs flex items-center gap-1.5 border-amber-200 hover:bg-amber-50 dark:hover:bg-amber-950/40"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>New Story</span>
              </Button>
            )}
            <span className="rounded-full bg-amber-100 dark:bg-amber-950/60 px-3 py-1 text-xs font-semibold text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 hidden sm:inline-block">
              GPT-4 + DALL-E 3
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 pb-24">
        {/* Hero Section */}
        <HeroSection />

        <div className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-12 sm:space-y-16">
          {/* Prompt Input Section */}
          <section id="prompt-section">
            <PromptInput onSubmit={handleGenerate} isLoading={isLoading} />
          </section>

          {/* Toast / Error Banner */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-3xl mx-auto"
              >
                <div className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-destructive shadow-sm">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <div className="flex-1 text-sm">
                    <p className="font-semibold">Generation encountered an issue</p>
                    <p className="text-xs mt-1 text-destructive/90">{errorMessage}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setErrorMessage(null)}
                    className="h-7 text-xs text-destructive hover:bg-destructive/20"
                  >
                    Dismiss
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generation Pipeline Indicator (Visible once generation begins) */}
          {progress.stage !== 'idle' && (
            <motion.section
              ref={pipelineRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              id="pipeline-section"
            >
              <GenerationPipeline progress={progress} />
            </motion.section>
          )}

          {/* Story Preview Section (Visible when story data is available or during loading) */}
          {(story || (isLoading && progress.stage === 'illustrations')) && (
            <motion.section
              ref={previewRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              id="preview-section"
            >
              <StoryPreview story={story} isLoading={isLoading} />
            </motion.section>
          )}

          {/* PDF Download Section (Visible when generation completes) */}
          {story && progress.stage === 'complete' && (
            <motion.section
              ref={downloadRef}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              id="download-section"
            >
              <PDFDownload story={story} />
            </motion.section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-muted/20 py-8 text-center text-xs text-muted-foreground">
        <div className="container mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span>Built with</span>
            <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
            <span>for magical bedtime storytelling.</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span>Next.js 14 (App Router)</span>
            <span>&bull;</span>
            <span>shadcn/ui + Tailwind</span>
            <span>&bull;</span>
            <span>@react-pdf/renderer</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
