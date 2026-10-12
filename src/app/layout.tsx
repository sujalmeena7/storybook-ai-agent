import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "AI Storybook Generator | Magical Children's Books with Consistent Characters",
  description:
    "Generate full 5-page illustrated children's storybooks from a single prompt with consistent character designs and printable PDF export.",
  keywords: [
    'AI storybook',
    "children's book generator",
    'DALL-E 3 children book',
    'GPT-4 storybook',
    'consistent character illustrations',
  ],
  authors: [{ name: 'Storybook AI Studio' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans min-h-screen bg-background text-foreground antialiased`}>
        {children}
      </body>
    </html>
  );
}
