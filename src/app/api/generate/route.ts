import { NextRequest, NextResponse } from 'next/server';
import {
  generateStoryStructure,
  generateIllustration,
  buildCharacterPrompt,
  ART_STYLE,
} from '@/lib/openai';
import { GeneratedStory, GenerationProgress, StoryPage } from '@/lib/types';

export const maxDuration = 300; // 5 minute timeout for Vercel
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = body?.prompt;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (progress: GenerationProgress) => {
          const payload = `data: ${JSON.stringify(progress)}\n\n`;
          controller.enqueue(encoder.encode(payload));
        };

        try {
          // Stage 1: Story Architect Agent
          sendEvent({
            stage: 'story',
            message: 'Crafting your 5-page story and magical narrative arc...',
          });

          const story = await generateStoryStructure(prompt);

          // Stage 2: Character Designer Agent
          sendEvent({
            stage: 'character',
            message: `Designing consistent character appearance for ${story.character.name}...`,
            data: story,
          });

          // Stage 3: Illustration Agent (Sequential generation for DALL-E 3)
          const characterPrompt = buildCharacterPrompt(story.character);
          const updatedPages: StoryPage[] = [];

          for (let i = 0; i < story.pages.length; i++) {
            const page = story.pages[i];
            sendEvent({
              stage: 'illustrations',
              message: `Painting illustration for Page ${page.pageNumber} of ${story.pages.length}...`,
              pageNum: page.pageNumber,
              totalPages: story.pages.length,
            });

            const { imageUrl, imageBase64 } = await generateIllustration(
              page,
              characterPrompt,
              story.artStyle || ART_STYLE
            );

            updatedPages.push({
              ...page,
              imageUrl,
              imageBase64,
            });

            // Stream incremental update so user sees each page appear in real-time
            sendEvent({
              stage: 'illustrations',
              message: `Page ${page.pageNumber} illustrated! Moving to next page...`,
              pageNum: page.pageNumber,
              totalPages: story.pages.length,
              story: {
                ...story,
                pages: [...updatedPages],
              },
            });
          }

          const finalStory: GeneratedStory = {
            ...story,
            pages: updatedPages,
          };

          // Stage 4: Complete
          sendEvent({
            stage: 'complete',
            message: 'Your printable storybook is ready to download!',
            data: finalStory,
            story: finalStory,
          });

          controller.close();
        } catch (err: any) {
          console.error('Error during story generation pipeline:', err);
          sendEvent({
            stage: 'error',
            message: err?.message || 'Failed to generate storybook',
            error: err?.message || 'An unexpected error occurred during generation',
          });
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Generation API route error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to initialize story generation' },
      { status: 500 }
    );
  }
}
