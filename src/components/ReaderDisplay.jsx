import React, { useMemo } from 'react';
import './ReaderDisplay.css';

const getORPIndex = (word, graphemeCount) => {
    const len = graphemeCount || word.length;
    if (len === 1) return 0;
    if (len <= 5) return 1;
    if (len <= 9) return 2;
    if (len <= 13) return 3;
    return 4;
};

const ReaderDisplay = ({ wordObj, words = [], fontSizes, isRevolver = false }) => {
    // Helper to render a single word with ORP
    const renderORPWord = (word, key) => {
        const { text, styles, graphemes, script } = word;

        // Use graphemes if available (for Indic scripts), otherwise fallback to characters
        const units = graphemes || [...text];
        const orpIndex = getORPIndex(text, units.length);

        const leftPart = units.slice(0, orpIndex).join('');
        const highlightChar = units[orpIndex];
        const rightPart = units.slice(orpIndex + 1).join('');

        const className = ['reader-word'];
        if (styles.includes('B') || styles.includes('STRONG') || styles.includes('H1') || styles.includes('H2')) className.push('bold');
        if (styles.includes('I') || styles.includes('EM')) className.push('italic');
        if (script === 'indic') className.push('indic-script');

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
        const { text, styles, script } = word;
        const className = ['reader-word', 'plain'];
        if (styles.includes('B') || styles.includes('STRONG') || styles.includes('H1') || styles.includes('H2')) className.push('bold');
        if (styles.includes('I') || styles.includes('EM')) className.push('italic');
        if (script === 'indic') className.push('indic-script');

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
        const baseSize = 4; // Constant baseline in rem
        let mult = 1;
        if (styles.includes('H1') || styles.includes('H2') || styles.includes('H3')) mult = 1.75;
        else if (styles.includes('SMALL')) mult = 0.8;

        const targetSize = baseSize * mult;

        if (fontSizes) {
            let val;
            if (styles.includes('H1') || styles.includes('H2')) val = fontSizes.heading;
            else if (styles.some(s => /^H[3-6]$/.test(s))) val = fontSizes.subHeading;
            else val = fontSizes.normal;

            // Use clamp to ensure it doesn't get too big for the screen
            // 80vw / 10 (approx max word length) = 8vw as a ceiling for responsiveness
            return `clamp(1rem, ${val}rem, 15vw)`;
        }

        return `clamp(1rem, ${targetSize}rem, 15vw)`;
    }, [styles, fontSizes]);


    if ((!words || words.length === 0) && !wordObj) return <div className="reader-display placeholder">Ready</div>;

    const containerStyles = {
        fontSize: fontSizeValue,
        minHeight: isRevolver ? '300px' : '200px'
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
