'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { GenerationProgress, PipelineStage } from '@/lib/types';
import {
  BookOpen,
  Palette,
  Image as ImageIcon,
  FileDown,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GenerationPipelineProps {
  progress: GenerationProgress;
}

type StepStatus = 'pending' | 'active' | 'complete' | 'error';

interface StepConfig {
  id: string;
  stageKey: PipelineStage;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StepConfig[] = [
  {
    id: 'story',
    stageKey: 'story',
    title: 'Story Writing',
    description: 'GPT-4 crafting 5-page narrative arc & moral',
    icon: BookOpen,
  },
  {
    id: 'character',
    stageKey: 'character',
    title: 'Character Design',
    description: 'Establishing consistent visual traits & outfit',
    icon: Palette,
  },
  {
    id: 'illustrations',
    stageKey: 'illustrations',
    title: 'Illustrations',
    description: 'DALL-E 3 rendering whimsical watercolor art',
    icon: ImageIcon,
  },
  {
    id: 'pdf',
    stageKey: 'pdf',
    title: 'PDF Assembly',
    description: 'Compiling 8.5x8.5 format children book',
    icon: FileDown,
  },
];

export function GenerationPipeline({ progress }: GenerationPipelineProps) {
  const getStepStatus = (stepIndex: number): StepStatus => {
    if (progress.stage === 'error') {
      // Determine if this step failed or previous completed
      const stageOrder: PipelineStage[] = ['story', 'character', 'illustrations', 'pdf', 'complete'];
      const currentIdx = stageOrder.indexOf(progress.stage);
      if (stepIndex === currentIdx) return 'error';
    }

    if (progress.stage === 'idle') return 'pending';
    if (progress.stage === 'complete') return 'complete';

    // Stage rank order:
    // 0: story
    // 1: character
    // 2: illustrations
    // 3: pdf
    const stageMap: Record<PipelineStage, number> = {
      idle: -1,
      story: 0,
      character: 1,
      illustrations: 2,
      pdf: 3,
      complete: 4,
      error: -1,
    };

    const currentRank = stageMap[progress.stage] ?? -1;

    if (currentRank > stepIndex) {
      return 'complete';
    } else if (currentRank === stepIndex) {
      return 'active';
    } else {
      return 'pending';
    }
  };

  // Calculate overall percentage progress for global progress bar
  const calculateOverallProgress = (): number => {
    if (progress.stage === 'idle') return 0;
    if (progress.stage === 'story') return 15;
    if (progress.stage === 'character') return 30;
    if (progress.stage === 'illustrations') {
      const pageNum = progress.pageNum || 1;
      const totalPages = progress.totalPages || 5;
      // Illustrations take up 30% to 85%
      return Math.min(85, Math.round(30 + ((pageNum - 0.5) / totalPages) * 55));
    }
    if (progress.stage === 'pdf') return 90;
    if (progress.stage === 'complete') return 100;
    return 0;
  };

  const overallPercent = calculateOverallProgress();

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Current Status Banner */}
      <Card className="border-amber-200/60 bg-amber-50/40 dark:bg-amber-950/20 backdrop-blur shadow-sm">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                {progress.stage === 'complete' ? (
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                ) : progress.stage === 'error' ? (
                  <AlertCircle className="h-6 w-6 text-destructive" />
                ) : (
                  <Sparkles className="h-5 w-5 animate-spin text-amber-500" />
                )}
              </div>
              <div>
                <h4 className="text-sm font-semibold tracking-wide text-foreground">
                  {progress.stage === 'complete'
                    ? 'Book Complete & Ready!'
                    : progress.stage === 'error'
                    ? 'Generation Interrupted'
                    : 'AI Storybook Agents at Work'}
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {progress.message || 'Processing your storybook request...'}
                </p>
              </div>
            </div>

            {/* Overall Percentage / Page Details */}
            <div className="w-full sm:w-48 text-right space-y-1.5 self-end sm:self-center">
              <div className="flex justify-between sm:justify-end gap-2 text-xs font-medium text-muted-foreground">
                {progress.stage === 'illustrations' && progress.pageNum && (
                  <span>
                    Illustration {progress.pageNum} of {progress.totalPages || 5}
                  </span>
                )}
                <span className="font-mono text-amber-600 dark:text-amber-400 font-semibold">
                  {overallPercent}%
                </span>
              </div>
              <Progress value={overallPercent} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4-Step Pipeline Cards with Connector Lines */}
      <div className="relative">
        {/* Horizontal connector line on larger screens */}
        <div className="hidden md:block absolute top-1/2 left-8 right-8 h-1 -translate-y-1/2 bg-muted -z-0" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
          {STEPS.map((step, idx) => {
            const status = getStepStatus(idx);
            const Icon = step.icon;

            const isPending = status === 'pending';
            const isActive = status === 'active';
            const isComplete = status === 'complete';
            const isError = status === 'error';

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="h-full"
              >
                <Card
                  className={`h-full transition-all duration-300 relative overflow-hidden ${
                    isActive
                      ? 'border-blue-400 ring-2 ring-blue-400/30 bg-blue-50/30 dark:bg-blue-950/20 shadow-md'
                      : isComplete
                      ? 'border-emerald-300/80 bg-emerald-50/20 dark:bg-emerald-950/10 shadow-xs'
                      : isError
                      ? 'border-destructive bg-destructive/10'
                      : 'border-border/60 bg-card/60 opacity-60'
                  }`}
                >
                  {/* Subtle active top highlight bar */}
                  {isActive && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse" />
                  )}

                  <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-3">
                    <div className="flex items-start justify-between">
                      {/* Step Icon with State Styles */}
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all ${
                          isComplete
                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300'
                            : isActive
                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300 ring-4 ring-blue-100 dark:ring-blue-900/50'
                            : isError
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      {/* Status Indicator Icon */}
                      <div>
                        {isComplete && (
                          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Done
                          </span>
                        )}
                        {isActive && (
                          <span className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100/80 dark:bg-blue-950/60 px-2 py-0.5 rounded-full animate-pulse">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" /> In Progress
                          </span>
                        )}
                        {isPending && (
                          <span className="text-xs text-muted-foreground/80 bg-muted px-2 py-0.5 rounded-full">
                            Step {idx + 1}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4
                        className={`text-sm font-semibold transition-colors ${
                          isActive
                            ? 'text-blue-700 dark:text-blue-300'
                            : isComplete
                            ? 'text-foreground'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {step.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-snug">
                        {step.description}
                      </p>
                    </div>

                    {/* Stage-specific micro-status */}
                    {step.id === 'illustrations' && isActive && progress.pageNum && (
                      <div className="pt-2 border-t border-blue-200/60 dark:border-blue-900/40">
                        <div className="text-[11px] font-medium text-blue-600 dark:text-blue-300 flex justify-between items-center">
                          <span>Rendering page {progress.pageNum}...</span>
                          <span>{progress.pageNum}/5</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
