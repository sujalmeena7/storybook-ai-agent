'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, Star, Wand2, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function HeroSection() {
  return (
    <div className="relative overflow-hidden py-12 md:py-20 text-center">
      {/* Background Decorative Blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[350px] w-[600px] rounded-full bg-gradient-to-tr from-amber-200/40 via-pink-200/40 to-indigo-200/40 blur-3xl" />
      </div>

      {/* Floating Animated Icons */}
      <motion.div
        aria-hidden="true"
        animate={{
          y: [-8, 8, -8],
          rotate: [0, 8, 0],
        }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute left-6 top-8 hidden md:flex items-center justify-center rounded-2xl bg-amber-100/80 p-3 shadow-lg shadow-amber-200/30 backdrop-blur-sm dark:bg-amber-950/40"
      >
        <Sparkles className="h-7 w-7 text-amber-500" />
      </motion.div>

      <motion.div
        aria-hidden="true"
        animate={{
          y: [10, -10, 10],
          rotate: [-4, 4, -4],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="pointer-events-none absolute right-8 top-12 hidden md:flex items-center justify-center rounded-2xl bg-purple-100/80 p-3 shadow-lg shadow-purple-200/30 backdrop-blur-sm dark:bg-purple-950/40"
      >
        <BookOpen className="h-7 w-7 text-purple-600 dark:text-purple-400" />
      </motion.div>

      <motion.div
        aria-hidden="true"
        animate={{
          y: [-6, 6, -6],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="pointer-events-none absolute left-16 bottom-4 hidden lg:flex items-center justify-center rounded-full bg-yellow-100/90 p-2.5 shadow-md shadow-yellow-200/40 dark:bg-yellow-950/40"
      >
        <Star className="h-5 w-5 fill-yellow-400 text-yellow-500" />
      </motion.div>

      <motion.div
        aria-hidden="true"
        animate={{
          y: [8, -8, 8],
          rotate: [5, -5, 5],
        }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="pointer-events-none absolute right-16 bottom-6 hidden lg:flex items-center justify-center rounded-full bg-rose-100/90 p-2.5 shadow-md shadow-rose-200/40 dark:bg-rose-950/40"
      >
        <Heart className="h-5 w-5 fill-rose-400 text-rose-500" />
      </motion.div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Top pill badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-6"
        >
          <Badge
            variant="secondary"
            className="px-4 py-1.5 text-xs sm:text-sm font-medium border border-amber-200/60 bg-amber-50/80 text-amber-900 shadow-sm backdrop-blur hover:bg-amber-100 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300"
          >
            <Wand2 className="mr-1.5 h-3.5 w-3.5 text-amber-600" />
            Powered by GPT-4 &amp; DALL-E 3
          </Badge>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl leading-tight"
        >
          <span>Create Magical</span>{' '}
          <span className="bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            AI Storybooks
          </span>{' '}
          <span>in Seconds</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Turn a simple idea into a fully illustrated, 5-page children&apos;s storybook.
          Featuring consistent character designs, whimsical watercolor art, and an
          instant print-ready PDF download.
        </motion.p>

        {/* Feature Highlights Pills */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground"
        >
          <span className="flex items-center gap-1.5 rounded-full bg-background/80 px-3 py-1 border shadow-xs">
            <span className="text-amber-500">✨</span> Consistent Characters
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-background/80 px-3 py-1 border shadow-xs">
            <span className="text-blue-500">🎨</span> Watercolor Illustrations
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-background/80 px-3 py-1 border shadow-xs">
            <span className="text-emerald-500">📄</span> Ready-to-Print PDF
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-background/80 px-3 py-1 border shadow-xs">
            <span className="text-purple-500">🤖</span> Multi-Agent Pipeline
          </span>
        </motion.div>
      </div>
    </div>
  );
}
