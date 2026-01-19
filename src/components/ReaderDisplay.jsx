import React, { useMemo } from 'react';
import './ReaderDisplay.css';

const getORPIndex = (word) => {
    const len = word.length;
    if (len === 1) return 0;
    if (len <= 5) return 1; // 2-5 -> 2nd letter (index 1) checks: "it"->t(1), "the"->h(1), "that"->h(1), "apple"->p(1)
    if (len <= 9) return 2; // 6-9 -> 3rd letter
    if (len <= 13) return 3; // 10-13 -> 4th letter
    return 4; // >13 -> 5th letter
};

const ReaderDisplay = ({ wordObj, fontSizeScale = 1 }) => {
    const { text, styles } = wordObj || { text: "Paste text to start", styles: [] };

    const orpIndex = useMemo(() => wordObj ? getORPIndex(text) : 0, [text, wordObj]);

    const leftPart = text.slice(0, orpIndex);
    const highlightChar = text[orpIndex];
    const rightPart = text.slice(orpIndex + 1);

    // Compute dynamic classes/styles based on tags
    const className = useMemo(() => {
        const classes = ['reader-word'];
        if (styles.includes('B') || styles.includes('STRONG') || styles.includes('H1') || styles.includes('H2')) classes.push('bold');
        if (styles.includes('I') || styles.includes('EM')) classes.push('italic');
        return classes.join(' ');
    }, [styles]);

    // Compute font size multiplier
    const sizeMultiplier = useMemo(() => {
        let mult = 1;
        if (styles.includes('H1')) mult = 2.5;
        else if (styles.includes('H2')) mult = 2;
        else if (styles.includes('H3')) mult = 1.75;
        else if (styles.includes('SMALL')) mult = 0.8;
        return mult * fontSizeScale;
    }, [styles, fontSizeScale]);


    if (!wordObj && !text) return <div className="reader-display placeholder">Ready</div>;

    return (
        <div className="reader-container" style={{ fontSize: `${4 * sizeMultiplier}rem` }}>
            <div className={`word-row ${className}`}>
                <span className="word-left">{leftPart}</span>
                <span className="word-highlight">{highlightChar}</span>
                <span className="word-right">{rightPart}</span>
            </div>
            <div className="center-guide-top"></div>
            <div className="center-guide-bottom"></div>
        </div>
    );
};

export default ReaderDisplay;
