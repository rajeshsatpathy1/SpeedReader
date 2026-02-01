import { useState, useEffect } from 'react'
import './App.css'
import useRSVP from './hooks/useRSVP'
import ReaderDisplay from './components/ReaderDisplay'
import Controls from './components/Controls'
import TextInput from './components/TextInput'
import Settings from './components/Settings'
import InfoIcon from './components/InfoIcon'
import Navigation from './components/Navigation'
import { sampleText } from './utils/sampleText'

function App() {
  const [inputText, setInputText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWpm] = useState(300);
  const [currentTheme, setCurrentTheme] = useState('dark');

  const [hasStarted, setHasStarted] = useState(false); // To toggle between input and reading mode
  const [isRevolverMode, setIsRevolverMode] = useState(true);

  const { currentWord, currentFrame, progress, reset, setProgress, nextSentence, previousSentence, totalWords, currentIndex, fontSizes, toc, currentContext } = useRSVP(inputText, wpm, isPlaying, isRevolverMode);

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
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem' }}>
          <InfoIcon onLoadSample={handleLoadSample} />
          <span>
            Speed<span className="highlight-text">Reader</span>
          </span>
          <Settings
            currentTheme={currentTheme}
            setTheme={setCurrentTheme}
            isRevolverMode={isRevolverMode}
            setIsRevolverMode={setIsRevolverMode}
          />
        </div>
      </h1>

      {!hasStarted ? (
        <TextInput setInputText={setInputText} onStart={handleStart} initialValue={inputText} />
      ) : (
        <>
          <Navigation toc={toc} currentContext={currentContext} onNavigate={setProgress} />
          <ReaderDisplay
            wordObj={currentWord}
            words={currentFrame}
            fontSizes={fontSizes}
            isRevolver={isRevolverMode}
          />

          <Controls
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            wpm={wpm}
            setWpm={setWpm}
            progress={progress}
            setProgress={setProgress}
            onReset={reset}
            onNextSentence={nextSentence}
            onPreviousSentence={previousSentence}
            totalWords={totalWords}
            currentIndex={currentIndex}
          />

          <button style={{ marginTop: '2rem', background: 'transparent', border: 'none', color: 'var(--text-color)', opacity: 0.5, cursor: 'pointer', textDecoration: 'underline' }} onClick={handleBackToEdit}>
            Back to Editor
          </button>
        </>
      )}
    </>
  )
}

export default App
