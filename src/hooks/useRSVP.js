import { useState, useEffect, useRef, useCallback } from 'react';

const useRSVP = (inputText, wpm, isPlaying) => {
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
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

      const traverse = (node, styles = []) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          if (!text.trim()) return;

          // Split by whitespace but keep them effectively as separate words
          const splitWords = text.trim().split(/\s+/);
          splitWords.forEach(word => {
            if (word) {
              result.push({
                text: word,
                styles: [...styles]
              });
            }
          });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // Capture relevant tags
          const newStyles = [...styles];
          const tagName = node.tagName.toUpperCase();
          const style = node.style;

          // Standard Tags
          if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'B', 'STRONG', 'I', 'EM', 'U', 'SMALL'].includes(tagName)) {
            newStyles.push(tagName);
          }

          // Inline Styles (common in copy-paste)
          if (style.fontWeight === 'bold' || Number(style.fontWeight) >= 700) {
            if (!newStyles.includes('B')) newStyles.push('B');
          }
          if (style.fontStyle === 'italic') {
            if (!newStyles.includes('I')) newStyles.push('I');
          }

          // Note: Detecting font-size is tricky as it can be px, em, etc. 
          // We'll rely on Heading tags for now as requested for structure.

          node.childNodes.forEach(child => traverse(child, newStyles));
        }
      };

      traverse(tempDiv);
      return result;
    };

    setWords(parseHtmlToWords(inputText));
    setCurrentIndex(0);
  }, [inputText]);

  // Playback Logic
  useEffect(() => {
    if (isPlaying && words.length > 0) {
      const intervalMs = 60000 / wpm;

      timerRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev >= words.length - 1) {
            clearInterval(timerRef.current);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isPlaying, wpm, words]);

  const reset = useCallback(() => setCurrentIndex(0), []);
  const setProgress = useCallback((index) => setCurrentIndex(index), []);

  return {
    currentWord: words[currentIndex] || null,
    currentIndex,
    totalWords: words.length,
    progress: words.length ? (currentIndex / words.length) * 100 : 0,
    reset,
    setProgress
  };
};

export default useRSVP;
