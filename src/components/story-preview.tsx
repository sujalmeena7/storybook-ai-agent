'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { GeneratedStory, StoryPage } from '@/lib/types';
import {
  BookOpen,
  Maximize2,
  X,
  Sparkles,
  User,
  Quote,
  ChevronLeft,
  ChevronRight,
  Heart,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StoryPreviewProps {
  story: GeneratedStory | null;
  isLoading: boolean;
}

export function StoryPreview({ story, isLoading }: StoryPreviewProps) {
  const [selectedPage, setSelectedPage] = useState<StoryPage | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const handleOpenPageModal = (page: StoryPage, index: number) => {
    setSelectedPage(page);
    setSelectedIndex(index);
  };

  const handleClosePageModal = () => {
    setSelectedPage(null);
  };

  const handleNextPage = () => {
    if (!story || !story.pages) return;
    const nextIdx = (selectedIndex + 1) % story.pages.length;
    setSelectedIndex(nextIdx);
    setSelectedPage(story.pages[nextIdx]);
  };

  const handlePrevPage = () => {
    if (!story || !story.pages) return;
    const prevIdx = (selectedIndex - 1 + story.pages.length) % story.pages.length;
    setSelectedIndex(prevIdx);
    setSelectedPage(story.pages[prevIdx]);
  };

  if (!story && !isLoading) {
    return null;
  }

  const pages = story?.pages || [];
  const totalExpectedPages = 5;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 py-6">
      {/* Story Title & Character Profile Header */}
      {story && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50/70 via-rose-50/50 to-purple-50/70 dark:from-amber-950/20 dark:via-rose-950/20 dark:to-purple-950/20 p-6 sm:p-8 backdrop-blur shadow-sm"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300"
                >
                  <BookOpen className="h-3 w-3 mr-1" />
                  Illustrated Storybook
                </Badge>
                {story.artStyle && (
                  <Badge variant="secondary" className="text-xs">
                    {story.artStyle}
                  </Badge>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                {story.bookTitle}
              </h2>
              {story.subtitle && (
                <p className="text-sm sm:text-base text-muted-foreground italic">
                  &ldquo;{story.subtitle}&rdquo;
                </p>
              )}
            </div>

            {/* Character Card Mini-Spotlight */}
            {story.character && (
              <div className="flex items-start gap-3 rounded-xl bg-background/80 p-4 border border-border/80 shadow-xs max-w-md shrink-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
                  <User className="h-5 w-5" />
                </div>
                <div className="text-xs space-y-1">
                  <div className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                    <span>{story.character.name}</span>
                    {story.character.age && (
                      <span className="text-muted-foreground text-xs font-normal">
                        ({story.character.age})
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground line-clamp-2">
                    <span className="font-medium text-foreground">Look: </span>
                    {story.character.appearance || story.character.clothing}
                  </p>
                  {story.character.personality && (
                    <p className="text-muted-foreground line-clamp-1">
                      <span className="font-medium text-foreground">Trait: </span>
                      {story.character.personality}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Pages Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <span>Storybook Pages</span>
            <span className="text-sm font-normal text-muted-foreground">
              ({pages.length} / {totalExpectedPages} pages)
            </span>
          </h3>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Click any page to read in full-screen reader view
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Render Actual Generated Pages */}
          <AnimatePresence mode="popLayout">
            {pages.map((page, idx) => {
              const imageSrc = page.imageUrl || page.imageBase64;
              return (
                <motion.div
                  key={page.pageNumber || idx}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="h-full"
                >
                  <Card
                    onClick={() => handleOpenPageModal(page, idx)}
                    className="group relative cursor-pointer overflow-hidden border border-border/80 hover:border-amber-400 dark:hover:border-amber-500/80 transition-all duration-300 hover:shadow-xl flex flex-col h-full bg-card"
                  >
                    {/* Page Number Pill */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-xs font-semibold text-white shadow-sm flex items-center gap-1">
                        Page {page.pageNumber || idx + 1}
                      </span>
                    </div>

                    {/* Expand Zoom Overlay Button */}
                    <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-md backdrop-blur">
                        <Maximize2 className="h-4 w-4" />
                      </div>
                    </div>

                    {/* Illustration Area */}
                    <div className="relative aspect-square w-full overflow-hidden bg-muted/40 border-b">
                      {imageSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imageSrc}
                          alt={`Page ${page.pageNumber || idx + 1} illustration`}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center text-muted-foreground bg-muted/30">
                          <Skeleton className="h-full w-full absolute inset-0" />
                          <div className="relative z-10 flex flex-col items-center">
                            <Sparkles className="h-6 w-6 text-amber-500 animate-spin mb-2" />
                            <span className="text-xs font-medium">Painting illustration...</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Story Text Content */}
                    <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        {page.title && (
                          <h4 className="font-bold text-sm text-foreground line-clamp-1 mb-1">
                            {page.title}
                          </h4>
                        )}
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                          {page.text}
                        </p>
                      </div>

                      <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border/40">
                        <span className="italic flex items-center gap-1">
                          <BookOpen className="h-3 w-3 text-amber-500" />
                          Read page
                        </span>
                        <span className="text-[11px] group-hover:text-amber-600 dark:group-hover:text-amber-400 font-medium transition-colors">
                          Enlarge ↗
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Skeleton Loaders for remaining or initial pages */}
          {isLoading &&
            Array.from({ length: Math.max(0, totalExpectedPages - pages.length) }).map(
              (_, skeletonIdx) => {
                const placeholderNumber = pages.length + skeletonIdx + 1;
                return (
                  <Card
                    key={`skeleton-${placeholderNumber}`}
                    className="overflow-hidden border border-dashed border-border/70 bg-card/40 flex flex-col h-full"
                  >
                    <div className="relative aspect-square w-full bg-muted/20 flex flex-col items-center justify-center p-6 text-center">
                      <Skeleton className="absolute inset-0 h-full w-full" />
                      <div className="relative z-10 flex flex-col items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background/80 shadow-xs">
                          <Sparkles className="h-5 w-5 text-amber-400 animate-pulse" />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">
                          Generating Page {placeholderNumber}...
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-5 space-y-3 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-5/6" />
                      <Skeleton className="h-3 w-2/3" />
                    </CardContent>
                  </Card>
                );
              }
            )}
        </div>
      </div>

      {/* Moral / Closing Section */}
      {story?.moral && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-amber-300/80 bg-amber-50/70 dark:bg-amber-950/30 p-6 text-center space-y-2"
        >
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
            <Quote className="h-4 w-4" /> The Moral of the Tale
          </div>
          <p className="text-base sm:text-lg font-medium text-foreground max-w-2xl mx-auto italic">
            &ldquo;{story.moral}&rdquo;
          </p>
        </motion.div>
      )}

      {/* Interactive Modal / Reader View for expanded page */}
      <AnimatePresence>
        {selectedPage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-background rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-border"
            >
              {/* Close Button */}
              <button
                onClick={handleClosePageModal}
                className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur transition-colors"
                aria-label="Close reader"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Large Image View */}
              <div className="relative md:w-3/5 bg-black flex items-center justify-center min-h-[300px] md:min-h-[500px]">
                {selectedPage.imageUrl || selectedPage.imageBase64 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedPage.imageUrl || selectedPage.imageBase64}
                    alt={`Page ${selectedPage.pageNumber || selectedIndex + 1}`}
                    className="max-h-[550px] w-full object-contain"
                  />
                ) : (
                  <div className="text-white text-center p-8">
                    <Sparkles className="h-8 w-8 mx-auto mb-2 text-amber-400 animate-pulse" />
                    <span>Illustration rendering in progress...</span>
                  </div>
                )}
              </div>

              {/* Story Text Reader View */}
              <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="border-amber-400 text-amber-600">
                      Page {selectedPage.pageNumber || selectedIndex + 1} of {pages.length}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-medium">
                      {story?.bookTitle}
                    </span>
                  </div>

                  {selectedPage.title && (
                    <h3 className="text-xl font-bold text-foreground">
                      {selectedPage.title}
                    </h3>
                  )}

                  <div className="rounded-xl bg-muted/30 p-4 border border-border/40">
                    <p className="text-base sm:text-lg text-foreground/90 leading-relaxed font-serif">
                      {selectedPage.text}
                    </p>
                  </div>

                  {selectedPage.illustrationPrompt && (
                    <div className="text-xs text-muted-foreground/80 space-y-1">
                      <span className="font-semibold text-muted-foreground">Art Prompt:</span>
                      <p className="line-clamp-2 italic text-[11px]">
                        {selectedPage.illustrationPrompt}
                      </p>
                    </div>
                  )}
                </div>

                {/* Navigation controls within reader modal */}
                <div className="pt-6 border-t mt-6 flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={pages.length <= 1}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </Button>
                  <span className="text-xs text-muted-foreground font-mono">
                    {selectedIndex + 1} / {pages.length}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={pages.length <= 1}
                    className="flex items-center gap-1"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
