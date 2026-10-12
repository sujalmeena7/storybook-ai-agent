import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { StorybookPDF as StorybookPdfDocument } from '@/components/pdf-document';
import { GeneratedStory } from './types';

/**
 * Generates a PDF Blob from a GeneratedStory object.
 * Can be used in browser environments for direct downloading or viewing.
 */
export async function generateStoryPdfBlob(story: GeneratedStory): Promise<Blob> {
  const element = React.createElement(StorybookPdfDocument, { story });
  const instance = pdf(element as any);
  const blob = await instance.toBlob();
  return blob;
}

/**
 * Triggers a direct browser download of the children's storybook PDF.
 */
export async function downloadStoryPdf(
  story: GeneratedStory,
  filename?: string
): Promise<void> {
  if (typeof window === 'undefined') {
    throw new Error('downloadStoryPdf must be executed in a browser environment');
  }

  const blob = await generateStoryPdfBlob(story);
  const url = URL.createObjectURL(blob);
  const cleanTitle = (filename || story.bookTitle || 'childrens-storybook')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const link = document.createElement('a');
  link.href = url;
  link.download = `${cleanTitle}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

/**
 * Server-side helper to generate a PDF buffer (Node.js runtime).
 */
export async function generateStoryPdfBuffer(story: GeneratedStory): Promise<Buffer> {
  const element = React.createElement(StorybookPdfDocument, { story });
  const instance = pdf(element as any);
  const buffer = await instance.toBuffer();
  return buffer as unknown as Buffer;
}
