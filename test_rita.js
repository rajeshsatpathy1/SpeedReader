import { RiTa } from 'rita';

const words = [
    'antidisestablishmentarianism',
    'supercalifragilisticexpialidocious',
    'internationalization',
    'spectrophotofluorometrically'
];

words.forEach(word => {
    const syllables = RiTa.syllables(word);
    console.log(`${word} -> ${syllables}`);
});
