export interface CharacterProfile {
  name: string;
  age: string | number;
  gender?: string;
  appearance: string;
  clothing: string;
  personality: string;
  distinguishingFeatures: string;
}

export interface StoryPage {
  pageNumber: number;
  title?: string;
  text: string;
  illustrationPrompt: string;
  imageUrl?: string;
  imageBase64?: string;
}

export interface GeneratedStory {
  bookTitle: string;
  subtitle?: string;
  moral?: string;
  artStyle?: string;
  character: CharacterProfile;
  pages: StoryPage[];
}

export type PipelineStage = 'idle' | 'story' | 'character' | 'illustrations' | 'pdf' | 'complete' | 'error';

export interface GenerationProgress {
  stage: PipelineStage;
  message: string;
  currentStep?: number;
  totalSteps?: number;
  pageNum?: number;
  totalPages?: number;
  data?: GeneratedStory;
  story?: GeneratedStory;
  error?: string;
}
