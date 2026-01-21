import { useState, useEffect, useRef, useCallback } from 'react';

const useRSVP = (inputText, wpm, isPlaying) => {
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fontSizes, setFontSizes] = useState({ heading: '4rem', subHeading: '3rem', normal: '4rem' });
  const timerRef = useRef(null);

  // Parsing Logic
  useEffect(() => {
    if (!inputText) {
      setWords([]);
      return;
    }

    const parseHtmlToWords = (html) => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      const result = [];
      const lengths = { heading: 0, sub: 0, normal: 0 };

      const traverse = (node, styles = []) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          if (!text.trim()) return;

          // Split by whitespace, preserving hyphens/dashes as separate tokens
          // Replace em-dash and hyphen with " - " or " — " to force split
          const preprocessed = text.replace(/([—-])/g, ' $1 ');
          const splitWords = preprocessed.trim().split(/\s+/);
          splitWords.forEach(word => {
            if (word) {
              const len = word.length;
              if (styles.includes('H1') || styles.includes('H2')) {
                lengths.heading = Math.max(lengths.heading, len);
              } else if (styles.some(s => ['H3', 'H4', 'H5', 'H6'].includes(s))) {
                lengths.sub = Math.max(lengths.sub, len);
              } else {
                lengths.normal = Math.max(lengths.normal, len);
              }

              result.push({
                text: word,
                styles: [...styles]
              });
            }
          });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const tagName = node.tagName.toUpperCase();

          // Capture styles
          const newStyles = [...styles];
          // Standard structural tags
          if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'B', 'STRONG', 'I', 'EM', 'U', 'SMALL'].includes(tagName)) {
            newStyles.push(tagName);
          }
          // Inline styles
          const style = node.style;
          if (style.fontWeight === 'bold' || Number(style.fontWeight) >= 700) {
            if (!newStyles.includes('B')) newStyles.push('B');
          }
          if (style.fontStyle === 'italic') {
            if (!newStyles.includes('I')) newStyles.push('I');
          }

          // Track length before visiting children to detect if words were added
          const startIndex = result.length;

          node.childNodes.forEach(child => traverse(child, newStyles));

          // If this was a block element and we added words, mark the last word as block end
          const isBlock = ['P', 'DIV', 'LI', 'BR', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE'].includes(tagName);
          if (isBlock && result.length > startIndex) {
            result[result.length - 1].isBlockEnd = true;
          }
          // Handle BR specifically if it didn't wrap text (it usually doesn't have children)
          if (tagName === 'BR' && result.length > 0) {
            // If we just hit a BR, the previous word (even if from a sibling) is effectively end of line/block
            result[result.length - 1].isBlockEnd = true;
          }
        }
      };

      traverse(tempDiv);
      return { result, lengths };
    };

    const { result, lengths } = parseHtmlToWords(inputText);

    // Calculate Safe Sizes
    const CONTAINER_REM = 32; // ~512px at 16px base, comfortably fits in 600px width
    const CHAR_EMPIRICAL_WIDTH = 0.6; // Approximate average width of a character in rem per 1rem font size

    const calculateSafeSize = (maxLen, maxCap) => {
      if (maxLen === 0) return maxCap;
      const safeSize = CONTAINER_REM / (maxLen * CHAR_EMPIRICAL_WIDTH);
      return Math.min(safeSize, maxCap);
    };

    setFontSizes({
      heading: calculateSafeSize(lengths.heading, 6), // Cap at 6rem
      subHeading: calculateSafeSize(lengths.sub, 4.5), // Cap at 4.5rem
      normal: calculateSafeSize(lengths.normal, 4.5) // Cap at 4.5rem
    });

    setWords(result);
    setCurrentIndex(0);
  }, [inputText]);

  // Playback Logic

  // Real implementation using Effect recursion
  useEffect(() => {
    if (!isPlaying || currentIndex >= words.length) {
      return;
    }

    const currentWordObj = words[currentIndex];
    const baseDelay = 60000 / wpm;

    let multiplier = 1.0;

    // 1. Structure Multiplier (Headings)
    // "2.0x delay on every word in the heading"
    const isHeading = currentWordObj.styles && currentWordObj.styles.some(s => /^H[1-6]$/.test(s));
    if (isHeading) {
      multiplier *= 2.0;
    }

    // 2. Pause Multipliers (Punctuation & Blocks)
    let pauseFactor = 1.0;

    // Block End / Paragraph Break
    if (currentWordObj.isBlockEnd) {
      pauseFactor = Math.max(pauseFactor, 1.8);
    }

    // Punctuation
    const text = currentWordObj.text;
    const lastChar = text.slice(-1);
    const lastTwo = text.slice(-2); // for quotes like ."

    if (/[\.\!\?]['"]?$/.test(text)) {
      pauseFactor = Math.max(pauseFactor, 1.5);
    } else if (/[,;:]['"]?$/.test(text)) {
      pauseFactor = Math.max(pauseFactor, 1.2);
    } else if (/[\-\(\)]/.test(text)) {
      pauseFactor = Math.max(pauseFactor, 1.2);
    }

    // Combine multipliers
    const finalDelay = baseDelay * multiplier * pauseFactor;

    timerRef.current = setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
    }, finalDelay);

    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentIndex, wpm, words]); // Re-runs every time index changes, scheduling next word.

  const reset = useCallback(() => setCurrentIndex(0), []);
  const setProgress = useCallback((index) => setCurrentIndex(index), []);

  return {
    currentWord: words[currentIndex] || null,
    currentIndex,
    totalWords: words.length,
    progress: words.length ? (currentIndex / words.length) * 100 : 0,
    reset,
    setProgress,
    fontSizes
  };
};

export default useRSVP;
