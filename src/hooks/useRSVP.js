import { useState, useEffect, useRef, useCallback } from 'react';

const useRSVP = (inputText, wpm, isPlaying, isRevolverMode = false) => {
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fontSizes, setFontSizes] = useState({ heading: '4rem', subHeading: '3rem', normal: '4rem' });
  const [toc, setToc] = useState([]);
  const [currentContext, setCurrentContext] = useState({ section: '', subSection: '' });
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
      const tempToc = [];

      // Detect script: Returns 'indic' if it contains Devanagari, Kannada, or Bengali characters
      const detectScript = (text) => {
        const indicRegex = /[\u0900-\u097F\u0C80-\u0CFF\u0980-\u09FF]/;
        return indicRegex.test(text) ? 'indic' : 'latin';
      };

      // Grapheme segmenter for Indic scripts
      const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });

      const traverse = (node, styles = []) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          if (!text.trim()) return;

          // Split by whitespace, preserving hyphens/dashes as separate tokens
          const preprocessed = text.replace(/([—-])/g, ' $1 ');
          const splitWords = preprocessed.trim().split(/\s+/);

          splitWords.forEach(word => {
            if (word) {
              const script = detectScript(word);
              // For Indic scripts, we store graphemes to prevent breaking characters
              const graphemes = script === 'indic' ? [...segmenter.segment(word)].map(s => s.segment) : null;
              const len = graphemes ? graphemes.length : word.length;

              if (styles.includes('H1') || styles.includes('H2')) {
                lengths.heading = Math.max(lengths.heading, len);
              } else if (styles.some(s => ['H3', 'H4', 'H5', 'H6'].includes(s))) {
                lengths.sub = Math.max(lengths.sub, len);
              } else {
                lengths.normal = Math.max(lengths.normal, len);
              }

              result.push({
                text: word,
                graphemes, // null for Latin, array of strings for Indic
                script,
                styles: [...styles]
              });
            }
          });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const tagName = node.tagName.toUpperCase();

          const newStyles = [...styles];
          if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'B', 'STRONG', 'I', 'EM', 'U', 'SMALL'].includes(tagName)) {
            newStyles.push(tagName);
          }

          if (/^H[1-6]$/.test(tagName)) {
            tempToc.push({
              text: node.textContent,
              index: result.length,
              level: parseInt(tagName[1])
            });
          }

          const style = node.style;
          if (style.fontWeight === 'bold' || Number(style.fontWeight) >= 700) {
            if (!newStyles.includes('B')) newStyles.push('B');
          }
          if (style.fontStyle === 'italic') {
            if (!newStyles.includes('I')) newStyles.push('I');
          }

          const startIndex = result.length;
          node.childNodes.forEach(child => traverse(child, newStyles));

          const isBlock = ['P', 'DIV', 'LI', 'BR', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE'].includes(tagName);
          if (isBlock && result.length > startIndex) {
            result[result.length - 1].isBlockEnd = true;
          }
          if (tagName === 'BR' && result.length > 0) {
            result[result.length - 1].isBlockEnd = true;
          }
        }
      };

      traverse(tempDiv);
      return { result, lengths, tempToc };
    };

    const { result, lengths, tempToc } = parseHtmlToWords(inputText);

    // Filter empty TOC items
    const refinedToc = tempToc.filter(item => item.text.trim().length > 0);
    setToc(refinedToc);

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
    const isIndic = currentWordObj.script === 'indic';

    // Standard Latin Punctuation
    if (/[\.\!\?]['"]?$/.test(text)) {
      pauseFactor = Math.max(pauseFactor, 1.5);
    }
    // Indic Punctuation: । (Danda), ॥ (Double Danda)
    else if (isIndic && /[\u0964]/.test(text)) {
      pauseFactor = Math.max(pauseFactor, 1.5);
    } else if (isIndic && /[\u0965]/.test(text)) {
      pauseFactor = Math.max(pauseFactor, 1.8);
    }
    // Clause breaks
    else if (/[,;:]['"]?$/.test(text)) {
      pauseFactor = Math.max(pauseFactor, 1.2);
    } else if (/[\-\(\)]/.test(text)) {
      pauseFactor = Math.max(pauseFactor, 1.2);
    }

    // 3. Length Multiplier (Long Words)
    let lengthMultiplier = 1.0;
    const wordLength = isIndic ? (currentWordObj.graphemes ? currentWordObj.graphemes.length : text.length) : text.length;

    if (wordLength >= 12) {
      lengthMultiplier = 1.5;
    } else if (wordLength >= 8) {
      lengthMultiplier = 1.2;
    }

    // Combine multipliers
    const finalDelay = baseDelay * multiplier * pauseFactor * lengthMultiplier;

    timerRef.current = setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
    }, finalDelay);

    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentIndex, wpm, words]); // Re-runs every time index changes, scheduling next word.

  // Context Tracking (Active Heading)
  useEffect(() => {
    if (!toc.length) {
      setCurrentContext({ section: '', subSection: '' });
      return;
    }

    let section = '';
    let subSection = '';

    // Find the latest heading before or at currentIndex
    // Iterate backwards or filter
    const pastHeadings = toc.filter(h => h.index <= currentIndex);
    if (pastHeadings.length > 0) {
      // Find last Section (H1/H2)
      const lastSection = [...pastHeadings].reverse().find(h => h.level <= 2);
      if (lastSection) section = lastSection.text;

      // Find last Subsection (H3-H6) that is AFTER the last section (hierarchically)
      // Actually simple rule: just find the very last heading. If it's a sub, show it.
      const lastHeading = pastHeadings[pastHeadings.length - 1];
      if (lastHeading.level > 2) {
        subSection = lastHeading.text;
      }
    }

    setCurrentContext({ section, subSection });

  }, [currentIndex, toc]);

  const nextSentence = useCallback(() => {
    if (currentIndex >= words.length - 1) return;

    // Start looking from the word AFTER the current one
    for (let i = currentIndex; i < words.length - 1; i++) {
      const word = words[i];
      const nextWord = words[i + 1];

      // If current word is a sentence ender or block end, the NEXT word is the start of a new sentence
      const wordText = word.text;
      const isIndic = word.script === 'indic';
      const isSentenceEnd = /[\.\!\?]['"]?$/.test(wordText) || (isIndic && /[\u0964\u0965]/.test(wordText));

      if (isSentenceEnd || word.isBlockEnd) {
        setCurrentIndex(i + 1);
        return;
      }
    }
    // If no more sentence boundaries, go to the end
    setCurrentIndex(words.length - 1);
  }, [currentIndex, words]);

  const previousSentence = useCallback(() => {
    if (currentIndex <= 0) return;

    // 1. If we are in the middle of a sentence, go to the START of this sentence.
    // 2. If we are already at the START of a sentence, go to the START of the PREVIOUS sentence.

    // A "start of sentence" is a word whose PREVIOUS word was a sentence ender.
    const isAtStartOfSentence = (idx) => {
      if (idx === 0) return true;
      const prevWord = words[idx - 1];
      const prevText = prevWord.text;
      const isIndic = prevWord.script === 'indic';

      const isSentenceEnd = /[\.\!\?]['"]?$/.test(prevText) || (isIndic && /[\u0964\u0965]/.test(prevText));
      return isSentenceEnd || prevWord.isBlockEnd;
    };

    let startIdx = currentIndex;

    // If we are at the start of a sentence already, we want to go back further to the previous one
    if (isAtStartOfSentence(startIdx)) {
      startIdx--;
    }

    // Now look backwards for the start of the current/previous sentence
    for (let i = startIdx; i >= 0; i--) {
      if (isAtStartOfSentence(i)) {
        setCurrentIndex(i);
        return;
      }
    }

    setCurrentIndex(0);
  }, [currentIndex, words]);

  const reset = useCallback(() => setCurrentIndex(0), []);
  const setProgress = useCallback((index) => setCurrentIndex(index), []);

  return {
    currentWord: words[currentIndex] || null,
    currentIndex,
    totalWords: words.length,
    progress: words.length ? (currentIndex / words.length) * 100 : 0,
    reset,
    setProgress,
    nextSentence,
    previousSentence,
    fontSizes,
    toc,
    currentContext,
    currentFrame: (() => {
      if (!words.length || currentIndex >= words.length) return [];
      if (!isRevolverMode) return [{ word: words[currentIndex], isPrimary: true }];

      const frame = [];
      const currentWord = words[currentIndex];

      const getHeading = (w) => w.styles ? w.styles.find(s => /^H[1-6]$/.test(s)) : undefined;

      const isBoundary = (w1, w2) => {
        if (!w1 || !w2) return false;
        // Sentence Punctuation
        const t1 = w1.text;
        const isIndic1 = w1.script === 'indic';
        const isSentenceEnd1 = /[\.\!\?]['"]?$/.test(t1) || (isIndic1 && /[\u0964\u0965]/.test(t1));

        if (isSentenceEnd1) return true;
        // Block/Paragraph End
        if (w1.isBlockEnd) return true;
        // Heading Change
        if (getHeading(w1) !== getHeading(w2)) return true;

        return false;
      }

      // Previous Word
      if (currentIndex > 0) {
        const prevWord = words[currentIndex - 1];
        if (!isBoundary(prevWord, currentWord)) {
          frame.push({ word: prevWord, isPrimary: false });
        }
      }

      // Current Word (Center/Focus)
      if (currentWord) {
        frame.push({ word: currentWord, isPrimary: true });
      }

      // Next Word
      if (currentIndex < words.length - 1) {
        const nextWord = words[currentIndex + 1];
        if (!isBoundary(currentWord, nextWord)) {
          frame.push({ word: nextWord, isPrimary: false });
        }
      }

      return frame;
    })()
  };
};

export default useRSVP;
