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

const ReaderDisplay = ({ wordObj, words = [], fontSizeScale = 1, fontSizes, isRevolver = false }) => {
    // Helper to render a single word with ORP
    const renderORPWord = (word, key) => {
        const { text, styles } = word;
        const orpIndex = getORPIndex(text);
        const leftPart = text.slice(0, orpIndex);
        const highlightChar = text[orpIndex];
        const rightPart = text.slice(orpIndex + 1);

        const className = ['reader-word'];
        if (styles.includes('B') || styles.includes('STRONG') || styles.includes('H1') || styles.includes('H2')) className.push('bold');
        if (styles.includes('I') || styles.includes('EM')) className.push('italic');

        return (
            <div key={key} className={`word-row ${className.join(' ')}`}>
                <span className="word-left">{leftPart}</span>
                <span className="word-highlight">{highlightChar}</span>
                <span className="word-right">{rightPart}</span>
            </div>
        );
    };

    // Helper to render plain word
    const renderPlainWord = (word, key) => {
        const { text, styles } = word;
        const className = ['reader-word', 'plain']; // plain class for potential styling
        if (styles.includes('B') || styles.includes('STRONG') || styles.includes('H1') || styles.includes('H2')) className.push('bold');
        if (styles.includes('I') || styles.includes('EM')) className.push('italic');

        return (
            <span key={key} className={className.join(' ')} style={{ whiteSpace: 'pre' }}>
                {text}
            </span>
        );
    };


    // Determine font sizes
    const primaryEntry = isRevolver ? words.find(w => w.isPrimary) : { word: wordObj };
    const primaryWord = primaryEntry ? primaryEntry.word : wordObj;
    const { styles } = primaryWord || { styles: [] };

    // Compute font size (shared logic)
    const fontSizeValue = useMemo(() => {
        if (fontSizes) {
            if (styles.includes('H1') || styles.includes('H2')) return `${fontSizes.heading}rem`;
            if (styles.some(s => /^H[3-6]$/.test(s))) return `${fontSizes.subHeading}rem`;
            return `${fontSizes.normal}rem`;
        }
        let mult = 1;
        if (styles.includes('H1') || styles.includes('H2') || styles.includes('H3')) mult = 1.75;
        else if (styles.includes('SMALL')) mult = 0.8;
        return `${4 * mult * fontSizeScale}rem`;
    }, [styles, fontSizeScale, fontSizes]);


    if ((!words || words.length === 0) && !wordObj) return <div className="reader-display placeholder">Ready</div>;

    const containerStyles = {
        fontSize: fontSizeValue,
        height: isRevolver ? '400px' : '300px'
    }

    if (isRevolver) {
        return (
            <div className="reader-container" style={containerStyles}>
                <div className="revolver-wrapper" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'baseline', gap: '0.4em' }}>
                    {words.map((item, i) => {
                        return item.isPrimary ? renderORPWord(item.word, i) : renderPlainWord(item.word, i);
                    })}
                </div>
            </div>
        );
    }

    // Standard Mode
    return (
        <div className="reader-container" style={containerStyles}>
            {primaryWord && renderORPWord(primaryWord, 'single')}
            <div className="center-guide-top"></div>
            <div className="center-guide-bottom"></div>
        </div>
    );
};

export default ReaderDisplay;
