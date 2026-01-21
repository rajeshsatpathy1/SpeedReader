import { useState, useEffect } from 'react'
import './App.css'
import useRSVP from './hooks/useRSVP'
import ReaderDisplay from './components/ReaderDisplay'
import Controls from './components/Controls'
import TextInput from './components/TextInput'
import Settings from './components/Settings'
import InfoIcon from './components/InfoIcon'
import { sampleText } from './utils/sampleText'

function App() {
  const [inputText, setInputText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWpm] = useState(300);
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [fontSizeScale, setFontSizeScale] = useState(1);
  const [hasStarted, setHasStarted] = useState(false); // To toggle between input and reading mode

  const { currentWord, progress, reset, setProgress, totalWords, currentIndex, fontSizes } = useRSVP(inputText, wpm, isPlaying);

  // Apply theme to html element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  const handleStart = () => {
    setHasStarted(true);
    reset();
    setIsPlaying(true);
  };

  const handleBackToEdit = () => {
    setIsPlaying(false);
    setHasStarted(false);
  };

  const handleLoadSample = () => {
    setInputText(sampleText);
    setHasStarted(false);
  };

  return (
    <>
      <h1 className="title">
        Speed<span className="highlight-text">Reader</span>
        <InfoIcon onLoadSample={handleLoadSample} />
      </h1>

      {!hasStarted ? (
        <TextInput setInputText={setInputText} onStart={handleStart} initialValue={inputText} />
      ) : (
        <>
          <ReaderDisplay wordObj={currentWord} fontSizeScale={fontSizeScale} fontSizes={fontSizes} />

          <Controls
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            wpm={wpm}
            setWpm={setWpm}
            progress={progress}
            setProgress={setProgress}
            onReset={reset}
            totalWords={totalWords}
            currentIndex={currentIndex}
          />

          <button style={{ marginTop: '2rem', background: 'transparent', border: 'none', color: 'var(--text-color)', opacity: 0.5, cursor: 'pointer', textDecoration: 'underline' }} onClick={handleBackToEdit}>
            Back to Editor
          </button>
        </>
      )}

      <Settings
        currentTheme={currentTheme}
        setTheme={setCurrentTheme}
        fontSizeScale={fontSizeScale}
        setFontSizeScale={setFontSizeScale}
      />
    </>
  )
}

export default App
