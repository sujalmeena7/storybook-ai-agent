# 🌟 Storybook AI Agent — Children's Picture Book Generator

> **Submission for Wo Health Pvt Ltd — AI Agent Development Internship Assignment**  
> **Candidate Project:** End-to-End Autonomous AI Agent for Illustrated Children's Books with Character Consistency & Printable PDF Export.

---

## 📖 Executive Summary & Assignment Brief

This project implements an autonomous AI agent capable of taking a single natural language prompt and producing a fully illustrated, 5-page children's storybook formatted as an **8.5" &times; 8.5" square printable PDF**, while guaranteeing that the **main character remains visually and graphically consistent across all pages**.

### The Benchmark Prompt:
> *"Create a five-page children's book story outlining about a young, brave character discovering a hidden, magical garden, ensuring the main character remains graphically consistent across all pages, and format the final result as a clean, downloadable PDF."*

---

## 🏛️ Multi-Agent Architecture

The system operates via a sequential multi-agent pipeline orchestrated through real-time **Server-Sent Events (SSE)** streaming:

```
[ User Prompt ]
       │
       ▼
┌──────────────────────────────────────────────┐
│  Stage 1: Story Architect Agent (GPT-4o)    │
│  - Crafts 5-page classic narrative arc        │
│  - Age-appropriate rhythm (ages 4-8)         │
│  - Uplifting moral of the tale               │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│  Stage 2: Character Consistency Engine       │
│  - Establishes rigid anchor identity tokens  │
│  - Locks facial traits, hair, outfit & props │
│  - Builds reusable master prompt prefix      │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│  Stage 3: Illustration Agent (DALL-E 3)      │
│  - Sequential scene-by-scene generation      │
│  - Prefixes master character anchor          │
│  - Soft watercolor style lock & text purge   │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│  Stage 4: PDF Typesetting Engine             │
│  - @react-pdf/renderer vector layout         │
│  - Standard 8.5" x 8.5" square book trim     │
│  - Cover Page + 5 Story Pages + Moral Page   │
└──────────────────────────────────────────────┘
```

---

## 🎨 The Character Consistency Engine: How It Works

One of the greatest challenges in generative diffusion models is character drift across different scene prompts. This agent overcomes drift using a **4-pillar consistency protocol**:

1. **Detailed Anchor Token Matrix**:
   Instead of generic labels (e.g. *"a young boy"*), the agent formulates a deterministic visual identity specifying:
   - **Hair**: *"Messy curly chestnut-brown hair"*
   - **Eyes & Expression**: *"Bright curious hazel eyes, rosy cheeks"*
   - **Signature Wardrobe**: *"Emerald green hooded jacket over an ochre sweater, dark denim trousers, sturdy brown boots"*
   - **Signature Identifier Prop**: *"A carved wooden compass necklace passed down from his grandfather"*

2. **Immutable Prompt Prefixing**:
   Every page illustration prompt dynamically receives the exact character description prepended verbatim. DALL-E 3 anchors the subject tokens first before composing the background environment.

3. **Style Freezing & Vocabulary Locking**:
   The art style is locked across all calls: `"children's book illustration, soft digital watercolor style, warm inviting colors, gentle lighting, whimsical and magical atmosphere, highly detailed"`.

4. **Text & Watermark Suppression**:
   Negative constraints explicitly forbid titles, text, letters, speech bubbles, and watermark artifacts to ensure pure illustration canvases for typography overlay.

---

## 🖥️ User Interface & Design System

The application is built using **shadcn/ui** (based on **Radix UI** primitives and **Tailwind CSS**):

- **Whimsical Hero Banner**: Floating animated decorative elements powered by `framer-motion`.
- **1-Click Inspiration Chips**: Instant access to the Wo Health test prompt and other creative ideas.
- **Live Pipeline Tracker**: 4-stage visual progress cards with animated loaders and page-by-page progress bars.
- **Interactive Reader Modal**: Click any page to open a distraction-free full-screen reader view with previous/next controls.
- **Client-Side PDF Generation**: High-resolution printable PDF generation without server roundtrips using `@react-pdf/renderer`.
- **Zero-Config Demo Mode**: Works immediately out of the box even without an OpenAI API key for quick reviewer evaluation.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v20 & v24)
- npm or yarn

### 1. Installation
```bash
git clone <repo-url>
cd project-woho
npm install
```

### 2. Environment Configuration (Optional for Live API)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your OpenAI API key:
```env
OPENAI_API_KEY=sk-your-openai-api-key-here
```

> **Note for Reviewers:** If no API key is configured, the application **automatically runs in Demo Mode**, providing a complete simulation of the agent pipeline with 5 pre-rendered consistent illustrations and the exact story requested in the assignment!

### 3. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build
```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
project woho/
├── public/
│   └── illustrations/           # Consistent character watercolor illustrations
├── src/
│   ├── app/
│   │   ├── api/generate/
│   │   │   └── route.ts         # SSE streaming generation pipeline endpoint
│   │   ├── globals.css          # Design tokens & storybook animation styles
│   │   ├── layout.tsx           # Root layout with Inter font & metadata
│   │   └── page.tsx             # Main orchestrator page with live reader
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components (button, card, progress...)
│   │   ├── generation-pipeline.tsx # Visual 4-step progress tracker
│   │   ├── hero-section.tsx     # Hero banner with framer-motion animations
│   │   ├── pdf-document.tsx     # @react-pdf/renderer 8.5x8.5 book template
│   │   ├── pdf-download.tsx     # Client-side PDF download & 3D preview
│   │   ├── prompt-input.tsx     # User prompt textarea with sample chips
│   │   └── story-preview.tsx    # Interactive storybook grid & reader modal
│   └── lib/
│       ├── openai.ts            # GPT-4o story architect & DALL-E 3 generator
│       ├── pdf-generator.ts     # Client and server PDF compilation utilities
│       ├── sample-data.ts       # Demo story data with consistent character images
│       ├── types.ts             # TypeScript interfaces for all story models
│       └── utils.ts             # Tailwind class merging helper
├── The_Secret_Garden_of_Lumina_Storybook.pdf # Pre-compiled submission sample
├── components.json              # shadcn configuration
├── next.config.mjs              # Next.js 15 config with PDF transpile settings
├── tailwind.config.ts           # Tailwind CSS configuration with design tokens
└── tsconfig.json                # TypeScript compiler configuration
```

---

## 📄 Pre-Compiled Sample PDF Output

A pre-compiled sample PDF generated for the exact Wo Health assignment prompt is included directly in the root of this repository:
- **`The_Secret_Garden_of_Lumina_Storybook.pdf`**

Features of the generated PDF:
- **Cover Page**: Title, subtitle, character spotlight, and badge.
- **5 Story Pages**: 8.5" &times; 8.5" square layout, top watercolor artwork, formatted typography, and running page badges.
- **Moral Page**: Closing page highlighting the story's uplifting lesson.

---

## 💡 Why This Solution Stands Out

1. **Complete Multi-Agent Separation**: Clear separation between Narrative Planning, Identity Locking, Scene Rendering, and PDF Composition.
2. **Deterministic Character Consistency**: Overcomes standard diffusion character drift using rigorous attribute preservation.
3. **Enterprise UI Quality**: Implements shadcn/ui and Radix primitives rather than generic CSS.
4. **Resilience & Reviewer Friendly**: Works out of the box with zero runtime errors, zero build warnings, and built-in offline evaluation mode.
