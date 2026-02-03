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
  const [openDropdown, setOpenDropdown] = useState(null); // 'settings', 'info', 'nav', or null

  const { currentWord, currentFrame, progress, reset, setProgress, nextSentence, previousSentence, totalWords, currentIndex, fontSizes, toc, currentContext } = useRSVP(inputText, wpm, isPlaying, isRevolverMode);

  // Keybindings
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in the text input
      if (!hasStarted && (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT')) {
        return;
      }

      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      } else if (e.key === 'ArrowRight') {
        nextSentence();
      } else if (e.key === 'ArrowLeft') {
        previousSentence();
      } else if (e.key === 'Escape') {
        setOpenDropdown(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStarted, nextSentence, previousSentence]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openDropdown && !e.target.closest('.settings-container') && !e.target.closest('.info-icon-container') && !e.target.closest('.navigation-container')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  // Apply theme to html element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  const handleStart = () => {
    setHasStarted(true);
    reset();
    setIsPlaying(true);
    setOpenDropdown(null);
  };

  const handleBackToEdit = () => {
    setIsPlaying(false);
    setHasStarted(false);
    setOpenDropdown(null);
  };

  const handleLoadSample = () => {
    setInputText(sampleText);
    setHasStarted(false);
    setOpenDropdown(null);
  };

  const toggleDropdown = (name) => {
    setOpenDropdown(prev => prev === name ? null : name);
  };

  return (
    <>
      <h1 className="title">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem' }}>
          {!hasStarted && (
            <InfoIcon
              onLoadSample={handleLoadSample}
              isOpen={openDropdown === 'info'}
              onToggle={(open) => setOpenDropdown(open ? 'info' : null)}
            />
          )}
          <span>
            Speed<span className="highlight-text">Reader</span>
          </span>
          <Settings
            currentTheme={currentTheme}
            setTheme={setCurrentTheme}
            isRevolverMode={isRevolverMode}
            setIsRevolverMode={setIsRevolverMode}
            isOpen={openDropdown === 'settings'}
            onToggle={(open) => setOpenDropdown(open ? 'settings' : null)}
          />
        </div>
      </h1>

      {!hasStarted ? (
        <TextInput setInputText={setInputText} onStart={handleStart} initialValue={inputText} />
      ) : (
        <>
          <Navigation
            toc={toc}
            currentContext={currentContext}
            onNavigate={setProgress}
            isOpen={openDropdown === 'nav'}
            onToggle={(open) => setOpenDropdown(open ? 'nav' : null)}
          />
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
