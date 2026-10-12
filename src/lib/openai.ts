import OpenAI from 'openai';
import { CharacterProfile, GeneratedStory, StoryPage } from './types';
import { DEMO_STORY, SAMPLE_IMAGES_B64 } from './sample-data';

export const isDemoMode =
  !process.env.OPENAI_API_KEY ||
  process.env.OPENAI_API_KEY.includes('your-openai-api-key') ||
  !process.env.OPENAI_API_KEY.startsWith('sk-');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Art style to use consistently across all illustrations
export const ART_STYLE =
  "children's book illustration, soft digital watercolor style, warm inviting colors, gentle lighting, whimsical and magical atmosphere, highly detailed, professional illustration quality";

/**
 * Step 1: Story Architect Agent
 * Takes user prompt and generates complete story structure with 5 pages and character profile.
 */
export async function generateStoryStructure(userPrompt: string): Promise<GeneratedStory> {
  const systemPrompt = `You are an award-winning children's book author and art director.
Your mission is to create a delightful, heartwarming 5-page children's storybook tailored for young children (ages 4-8) based on the user's idea.

Story Structure Requirements:
- Age-appropriate language: simple, engaging, warm vocabulary with rhythm and wonder.
- 5 Pages with a complete classic narrative arc:
  * Page 1: Introduction (introduce the protagonist in their world, their personality, and normal life)
  * Page 2: Rising Action (an adventure begins, a mystery arises, or a fun challenge is discovered)
  * Page 3: Climax (the peak moment of excitement, curiosity, or overcoming a small obstacle)
  * Page 4: Falling Action (a heartwarming realization, teamwork, or creative solution)
  * Page 5: Resolution (safe, joyful celebration, peaceful conclusion, and satisfying closure)
- Text length: Exactly 2 to 3 concise, rhythmic, child-friendly sentences per page.
- Moral: A gentle, uplifting lesson (kindness, courage, curiosity, friendship, or perseverance).

Character Consistency Requirements:
- Create an extremely detailed visual profile for the main character so an illustrator can render them identically in every scene.
- Specify exact age, gender/species, hair style and color, skin/fur color, eye color, signature clothing items (with colors and patterns), and distinguishing features (e.g., round rosy cheeks, freckles, a red polka-dot scarf, glasses).

Illustration Requirements:
- For each page, provide a vivid, detailed illustration prompt depicting the exact action, emotions, environment, and background props.
- Each scene must be lively, safe, and visually captivating for a picture book.

You MUST respond strictly with a valid JSON object matching this schema:
{
  "bookTitle": "string",
  "subtitle": "string",
  "moral": "string",
  "character": {
    "name": "string",
    "age": "string",
    "gender": "string",
    "appearance": "string",
    "clothing": "string",
    "personality": "string",
    "distinguishingFeatures": "string"
  },
  "pages": [
    {
      "pageNumber": 1,
      "title": "string",
      "text": "string (2-3 sentences)",
      "illustrationPrompt": "string describing character action, setting, lighting, and mood"
    },
    ... (exactly 5 pages, pageNumber 1 to 5)
  ]
}`;

  if (isDemoMode) {
    // Simulated processing latency for authentic agent pipeline demonstration
    await new Promise((res) => setTimeout(res, 800));
    return DEMO_STORY;
  }

  try {
    const userContent = `Create a 5-page children's storybook based on this premise: "${userPrompt.trim()}". Return JSON format only.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Failed to generate story content from OpenAI');
    }

    const parsed = JSON.parse(content) as GeneratedStory;

    // Validate and ensure 5 pages
    if (!parsed.pages || !Array.isArray(parsed.pages) || parsed.pages.length === 0) {
      throw new Error('Invalid story response: pages array is missing or empty');
    }

    // Guarantee exactly 5 pages with ordered pageNumbers
    const formattedPages: StoryPage[] = parsed.pages.slice(0, 5).map((page, index) => ({
      pageNumber: index + 1,
      title: page.title || `Page ${index + 1}`,
      text: page.text || '',
      illustrationPrompt: page.illustrationPrompt || '',
    }));

    return {
      bookTitle: parsed.bookTitle || 'A Magical Adventure',
      subtitle: parsed.subtitle || 'A story of wonder and discovery',
      moral: parsed.moral || 'Kindness and courage make every day brighter.',
      artStyle: ART_STYLE,
      character: {
        name: parsed.character?.name || 'Little Hero',
        age: parsed.character?.age || '6',
        gender: parsed.character?.gender || 'child',
        appearance: parsed.character?.appearance || 'cute and friendly',
        clothing: parsed.character?.clothing || 'bright, cozy everyday clothes',
        personality: parsed.character?.personality || 'curious, brave, and kind-hearted',
        distinguishingFeatures: parsed.character?.distinguishingFeatures || 'sparkling eyes and a cheerful smile',
      },
      pages: formattedPages,
    };
  } catch (err) {
    console.warn('OpenAI GPT generation encountered an issue, falling back to demo story:', err);
    return DEMO_STORY;
  }
}

/**
 * Step 2: Character Consistency Engine
 * Builds the master character reference prompt prefixed onto every DALL-E prompt
 */
export function buildCharacterPrompt(character: CharacterProfile): string {
  const genderTerm = character.gender ? `${character.gender} ` : '';
  return `Consistent main character design: ${character.name}, a ${character.age}-year-old ${genderTerm}with ${character.appearance}, wearing ${character.clothing}. Identifying details: ${character.distinguishingFeatures}. Personality expression: ${character.personality}. Ensure the character's facial features, proportions, hair, and clothing match consistently`;
}

/**
 * Step 3: Illustration Generator
 * Generates an illustration for a single page with character consistency using DALL-E 3
 */
export async function generateIllustration(
  page: StoryPage,
  characterPrompt: string,
  artStyle: string = ART_STYLE
): Promise<{ imageUrl: string; imageBase64: string }> {
  if (isDemoMode) {
    // Realistic agent generation pacing
    await new Promise((res) => setTimeout(res, 1200));
    const fallbackPage = DEMO_STORY.pages[(page.pageNumber - 1) % DEMO_STORY.pages.length];
    return {
      imageUrl: fallbackPage.imageUrl || '',
      imageBase64: fallbackPage.imageBase64 || '',
    };
  }

  try {
    const fullPrompt = `${characterPrompt}. Story scene: ${page.illustrationPrompt}. Visual style: ${artStyle}. Essential rules: Full picture book page layout, warm gentle lighting, clean composition. Do NOT include any text, letters, titles, words, signs, numbers, watermarks, or speech bubbles anywhere in the image.`;

    const trimmedPrompt = fullPrompt.slice(0, 3950);

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: trimmedPrompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'b64_json',
    });

    const b64Json = response.data?.[0]?.b64_json;
    if (!b64Json) {
      throw new Error(`Failed to generate illustration for page ${page.pageNumber}`);
    }

    const dataUri = `data:image/png;base64,${b64Json}`;

    return {
      imageUrl: dataUri,
      imageBase64: b64Json,
    };
  } catch (err) {
    console.warn(`OpenAI DALL-E generation failed for page ${page.pageNumber}, falling back:`, err);
    const fallbackPage = DEMO_STORY.pages[(page.pageNumber - 1) % DEMO_STORY.pages.length];
    return {
      imageUrl: fallbackPage.imageUrl || '',
      imageBase64: fallbackPage.imageBase64 || '',
    };
  }
}

/**
 * Step 4: Generate all illustrations sequentially
 */
export async function generateAllIllustrations(
  story: GeneratedStory,
  onProgress?: (pageNum: number) => void
): Promise<GeneratedStory> {
  const characterPrompt = buildCharacterPrompt(story.character);
  const updatedPages: StoryPage[] = [];

  for (const page of story.pages) {
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

    onProgress?.(page.pageNumber);
  }

  return { ...story, pages: updatedPages };
}
