import { RiTa } from 'rita';

const testWords = [
    { text: 'the', expectedSyllables: 1 },
    { text: 'reading', expectedSyllables: 2 },
    { text: 'fundamental', expectedSyllables: 4 },
    { text: 'antidisestablishmentarianism', expectedSyllables: 12 },
    { text: 'internationalization', expectedSyllables: 8 }
];

console.log('--- RiTa Syllable Verification ---');
testWords.forEach(wordObj => {
    const syllables = RiTa.syllables(wordObj.text);
    const count = syllables ? syllables.split('/').length : 0;
    console.log(`Word: ${wordObj.text.padEnd(30)} | RiTa syllables: ${syllables.padEnd(30)} | Count: ${count} | Match: ${count === wordObj.expectedSyllables ? '✅' : '❌ (Expected ' + wordObj.expectedSyllables + ')'}`);
});

console.log('\n--- Pacing Multiplier Logic Simulation ---');
testWords.forEach(wordObj => {
    const ritaSyllables = RiTa.syllables(wordObj.text);
    const syllableCount = ritaSyllables ? ritaSyllables.split('/').length : 1;
    const wordLength = wordObj.text.length;

    let lengthMultiplier = 1.0;
    if (syllableCount >= 5) {
        lengthMultiplier = 1.6;
    } else if (syllableCount >= 3) {
        lengthMultiplier = 1.3;
    } else if (wordLength >= 12) {
        lengthMultiplier = 1.5;
    } else if (wordLength >= 8) {
        lengthMultiplier = 1.2;
    }

    console.log(`Word: ${wordObj.text.padEnd(30)} | Length: ${wordLength.toString().padEnd(2)} | Syllables: ${syllableCount.toString().padEnd(2)} | Multiplier: ${lengthMultiplier}x`);
});
