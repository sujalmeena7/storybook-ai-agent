'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GeneratedStory } from '@/lib/types';
import { StorybookPDF } from '@/components/pdf-document';
import {
  FileDown,
  BookCheck,
  Sparkles,
  User,
  Layers,
  Heart,
  Palette,
  CheckCircle,
  Loader2,
  Printer,
} from 'lucide-react';
import { motion } from 'framer-motion';

// Dynamically import PDFDownloadLink to prevent SSR hydration errors
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => (
      <Button disabled size="lg" className="rounded-xl px-8 py-6 text-base shadow-lg">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Preparing PDF Engine...
      </Button>
    ),
  }
);

interface PDFDownloadProps {
  story: GeneratedStory;
}

export function PDFDownload({ story }: PDFDownloadProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fileName = `${(story.bookTitle || 'Storybook')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')}-storybook.pdf`;

  const coverImage = story.pages[0]?.imageUrl || story.pages[0]?.imageBase64;

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="overflow-hidden border-2 border-emerald-400/80 bg-gradient-to-br from-emerald-50/50 via-background to-teal-50/40 dark:from-emerald-950/20 dark:via-background dark:to-teal-950/20 shadow-2xl">
          {/* Top celebratory banner */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-6 py-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                <BookCheck className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-bold text-base sm:text-lg">Your Storybook is Ready!</h3>
                <p className="text-xs text-emerald-100 hidden sm:block">
                  Compiled into an 8.5&quot; &times; 8.5&quot; square printable picture book
                </p>
              </div>
            </div>
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 text-xs">
              <CheckCircle className="h-3.5 w-3.5 mr-1" /> Ready to Download
            </Badge>
          </div>

          <CardContent className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* PDF Book Preview Mockup (Left Side) */}
              <div className="md:col-span-5 flex justify-center">
                <div className="relative group perspective-1000">
                  {/* Book Mockup Stack Effect */}
                  <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-amber-500 opacity-30 blur-lg group-hover:opacity-50 transition-opacity" />

                  <div className="relative w-56 sm:w-64 aspect-square rounded-2xl bg-amber-50 dark:bg-neutral-900 border-4 border-amber-200/80 dark:border-amber-700/60 shadow-2xl overflow-hidden flex flex-col justify-between p-4 transform group-hover:scale-[1.02] transition-transform duration-300">
                    {/* Mock Cover Header */}
                    <div className="text-center">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 dark:text-amber-400">
                        Storybook Edition
                      </span>
                      <h4 className="font-bold text-sm text-foreground line-clamp-1 mt-0.5">
                        {story.bookTitle}
                      </h4>
                    </div>

                    {/* Mock Cover Illustration */}
                    <div className="aspect-square w-full rounded-lg overflow-hidden my-2 border border-amber-200/50 bg-muted/40">
                      {coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={coverImage}
                          alt="Book Cover Mockup"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-amber-100/60 text-amber-600">
                          <Sparkles className="h-8 w-8" />
                        </div>
                      )}
                    </div>

                    {/* Mock Cover Footer */}
                    <div className="text-center text-[11px] text-muted-foreground truncate">
                      By AI Storybook &bull; starring {story.character.name}
                    </div>
                  </div>
                </div>
              </div>

              {/* Story Details & Download Action (Right Side) */}
              <div className="md:col-span-7 space-y-6">
                <div>
                  <h4 className="text-2xl font-extrabold text-foreground tracking-tight">
                    {story.bookTitle}
                  </h4>
                  {story.subtitle && (
                    <p className="text-sm text-muted-foreground mt-1 italic">
                      &ldquo;{story.subtitle}&rdquo;
                    </p>
                  )}
                </div>

                {/* Key Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-muted/50 p-3 border border-border/60">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Layers className="h-3.5 w-3.5 text-blue-500" />
                      <span>Pages</span>
                    </div>
                    <div className="text-sm font-bold text-foreground">
                      {story.pages.length} Story Pages + Cover
                    </div>
                  </div>

                  <div className="rounded-xl bg-muted/50 p-3 border border-border/60">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <User className="h-3.5 w-3.5 text-amber-500" />
                      <span>Main Character</span>
                    </div>
                    <div className="text-sm font-bold text-foreground truncate">
                      {story.character.name}
                    </div>
                  </div>

                  <div className="rounded-xl bg-muted/50 p-3 border border-border/60">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Palette className="h-3.5 w-3.5 text-pink-500" />
                      <span>Art Style</span>
                    </div>
                    <div className="text-sm font-bold text-foreground truncate">
                      {story.artStyle || 'Soft Watercolor'}
                    </div>
                  </div>

                  <div className="rounded-xl bg-muted/50 p-3 border border-border/60">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Printer className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Print Format</span>
                    </div>
                    <div className="text-sm font-bold text-foreground">
                      8.5&quot; &times; 8.5&quot; Square PDF
                    </div>
                  </div>
                </div>

                {/* Download CTA Button */}
                <div className="pt-2">
                  {isMounted ? (
                    <PDFDownloadLink
                      document={<StorybookPDF story={story} />}
                      fileName={fileName}
                      className="inline-block w-full sm:w-auto"
                    >
                      {({ loading, error }) => (
                        <Button
                          disabled={loading}
                          size="lg"
                          className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:via-teal-700 hover:to-emerald-800 text-white font-bold text-base px-8 py-6 rounded-xl shadow-xl shadow-emerald-600/25 transition-all duration-300 hover:scale-[1.02]"
                        >
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="h-5 w-5 animate-spin" />
                              <span>Assembling PDF Document...</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-2.5">
                              <FileDown className="h-5 w-5" />
                              <span>Download Printable Storybook PDF</span>
                            </span>
                          )}
                        </Button>
                      )}
                    </PDFDownloadLink>
                  ) : (
                    <Button disabled size="lg" className="rounded-xl px-8 py-6 text-base">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Initializing PDF...
                    </Button>
                  )}

                  <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    High-resolution vector typography with embedded illustrations.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
