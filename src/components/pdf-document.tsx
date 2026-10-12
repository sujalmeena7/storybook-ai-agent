import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import { GeneratedStory } from '@/lib/types';

// Native standard PDF fonts (Helvetica) are used for instant rendering without network dependencies

const styles = StyleSheet.create({
  page: {
    width: 612,
    height: 612,
    backgroundColor: '#FFFDF9',
    padding: 32,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    fontFamily: 'Helvetica',
  },
  coverPage: {
    width: 612,
    height: 612,
    backgroundColor: '#FDF8F0',
    padding: 36,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    border: '6px double #D97706',
  },
  coverBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  coverBadgeText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  coverTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 1.2,
  },
  coverSubtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 24,
    textAlign: 'center',
    maxWidth: 440,
  },
  coverHeroImageContainer: {
    width: 250,
    height: 250,
    borderRadius: 16,
    overflow: 'hidden',
    border: '4px solid #FDE68A',
    marginBottom: 24,
    backgroundColor: '#F3F4F6',
  },
  coverHeroImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  coverCharacterBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#FEF9C3',
    borderRadius: 8,
    width: '80%',
    textAlign: 'center',
  },
  coverCharacterText: {
    fontSize: 12,
    color: '#854D0E',
    fontWeight: 'bold',
  },
  coverFooter: {
    marginTop: 16,
    fontSize: 10,
    color: '#94A3B8',
  },
  // Story Page styles
  storyPageContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  storyHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottom: '1px solid #E2E8F0',
    marginBottom: 12,
  },
  storyBookTitleMini: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  storyPageNumberBadge: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: 'bold',
  },
  illustrationContainer: {
    width: '100%',
    height: 330,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
    marginBottom: 16,
    border: '1px solid #E2E8F0',
  },
  illustration: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  illustrationPlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  placeholderText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  textContentContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10,
    border: '1px solid #F1F5F9',
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  pageTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 6,
  },
  storyText: {
    fontSize: 13,
    lineHeight: 1.6,
    color: '#334155',
    textAlign: 'justify',
  },
  footer: {
    textAlign: 'center',
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 8,
  },
  moralPage: {
    width: 612,
    height: 612,
    backgroundColor: '#FEF3C7',
    padding: 40,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  moralBox: {
    backgroundColor: '#FFFFFF',
    padding: 28,
    borderRadius: 16,
    width: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    border: '2px solid #FCD34D',
  },
  moralHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B45309',
    marginBottom: 12,
  },
  moralText: {
    fontSize: 14,
    color: '#451A03',
    lineHeight: 1.6,
  },
  theEndText: {
    marginTop: 24,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#D97706',
    letterSpacing: 2,
  },
});

interface StorybookPDFProps {
  story: GeneratedStory;
}

export function StorybookPDF({ story }: StorybookPDFProps) {
  const firstImage = story.pages[0]?.imageUrl || story.pages[0]?.imageBase64;

  return (
    <Document title={story.bookTitle} author="Storybook AI">
      {/* Cover Page */}
      <Page size={[612, 612]} style={styles.coverPage}>
        <View style={styles.coverBadge}>
          <Text style={styles.coverBadgeText}>A Whimsical Children&apos;s Story</Text>
        </View>

        <Text style={styles.coverTitle}>{story.bookTitle}</Text>
        {story.subtitle && <Text style={styles.coverSubtitle}>{story.subtitle}</Text>}

        {firstImage && (
          <View style={styles.coverHeroImageContainer}>
            <Image src={firstImage} style={styles.coverHeroImage} />
          </View>
        )}

        <View style={styles.coverCharacterBox}>
          <Text style={styles.coverCharacterText}>
            Starring {story.character.name} ({story.character.personality || 'A brave little adventurer'})
          </Text>
        </View>

        <Text style={styles.coverFooter}>Created with AI Children&apos;s Storybook Generator</Text>
      </Page>

      {/* Story Pages */}
      {story.pages.map((page, index) => {
        const imageSource = page.imageUrl || page.imageBase64;
        return (
          <Page key={index} size={[612, 612]} style={styles.page}>
            <View style={styles.storyPageContainer}>
              <View style={styles.storyHeader}>
                <Text style={styles.storyBookTitleMini}>{story.bookTitle}</Text>
                <Text style={styles.storyPageNumberBadge}>
                  Page {page.pageNumber || index + 1} of {story.pages.length}
                </Text>
              </View>

              <View style={styles.illustrationContainer}>
                {imageSource ? (
                  <Image src={imageSource} style={styles.illustration} />
                ) : (
                  <View style={styles.illustrationPlaceholder}>
                    <Text style={styles.placeholderText}>Illustration {index + 1}</Text>
                  </View>
                )}
              </View>

              <View style={styles.textContentContainer}>
                {page.title && <Text style={styles.pageTitle}>{page.title}</Text>}
                <Text style={styles.storyText}>{page.text}</Text>
              </View>

              <Text style={styles.footer}>~ {page.pageNumber || index + 1} ~</Text>
            </View>
          </Page>
        );
      })}

      {/* The End / Moral Page */}
      {story.moral && (
        <Page size={[612, 612]} style={styles.moralPage}>
          <View style={styles.moralBox}>
            <Text style={styles.moralHeading}>The Moral of The Story</Text>
            <Text style={styles.moralText}>&ldquo;{story.moral}&rdquo;</Text>
            <Text style={styles.theEndText}>THE END</Text>
          </View>
        </Page>
      )}
    </Document>
  );
}

export default StorybookPDF;
