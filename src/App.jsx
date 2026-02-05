import { useState, useEffect, useRef } from 'react'
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
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // 'settings', 'info', 'nav', or null

  // Music Engine State
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.3);
  const [musicSpeed, setMusicSpeed] = useState(1.0);

  const audioContextRef = useRef(null);
  const audioBufferRef = useRef(null);
  const gainNodeRef = useRef(null);
  const activeSourcesRef = useRef([]);
  const scheduleTimeoutRef = useRef(null);
  const CROSSFADE_TIME = 1.0;

  // Initialize Audio Context and Load Buffer
  useEffect(() => {
    const loadBuffer = async () => {
      try {
        const response = await fetch('/assets/music/farran_ez-string-violin-cello-loop-456150.mp3');
        const arrayBuffer = await response.arrayBuffer();
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
        const decodedBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
        audioBufferRef.current = decodedBuffer;
      } catch (err) {
        console.error("Audio loading failed:", err);
      }
    };
    loadBuffer();
    return () => {
      stopAllMusic();
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  const stopAllMusic = () => {
    clearTimeout(scheduleTimeoutRef.current);
    activeSourcesRef.current.forEach(source => {
      try { source.stop(); } catch (e) { }
    });
    activeSourcesRef.current = [];
    setIsPlayingMusic(false);
  };

  const scheduleNextSection = (startTime) => {
    if (!isPlayingMusic || !audioBufferRef.current || !audioContextRef.current) return;

    const duration = audioBufferRef.current.duration / musicSpeed;
    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBufferRef.current;
    source.playbackRate.value = musicSpeed;

    const localGain = audioContextRef.current.createGain();

    // Crossfade logic
    localGain.gain.setValueAtTime(0, startTime);
    localGain.gain.linearRampToValueAtTime(1, startTime + CROSSFADE_TIME);

    const fadeOutStart = startTime + duration - CROSSFADE_TIME;
    localGain.gain.setValueAtTime(1, Math.max(startTime, fadeOutStart));
    localGain.gain.linearRampToValueAtTime(0, startTime + duration);

    source.connect(localGain);
    localGain.connect(gainNodeRef.current);

    source.start(startTime);
    source.stop(startTime + duration);

    activeSourcesRef.current.push(source);

    source.onended = () => {
      activeSourcesRef.current = activeSourcesRef.current.filter(s => s !== source);
    };

    const nextStart = startTime + duration - CROSSFADE_TIME;
    const delayMs = (nextStart - audioContextRef.current.currentTime) * 1000 - 500;

    scheduleTimeoutRef.current = setTimeout(() => {
      scheduleNextSection(nextStart);
    }, Math.max(0, delayMs));
  };

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(musicVolume, audioContextRef.current.currentTime, 0.1);
    }
  }, [musicVolume]);

  // Update speed of currently playing sources
  useEffect(() => {
    if (isPlayingMusic) {
      activeSourcesRef.current.forEach(source => {
        source.playbackRate.setTargetAtTime(musicSpeed, audioContextRef.current.currentTime, 0.1);
      });
      // Note: This doesn't fix the scheduling of the NEXT one perfectly if speed changes mid-loop,
      // but the next scheduled one will use the new speed logic. 
      // For short loops it's usually fine.
    }
  }, [musicSpeed, isPlayingMusic]);

  const toggleMusic = async () => {
    if (!audioBufferRef.current || !audioContextRef.current) return;
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    if (isPlayingMusic) {
      stopAllMusic();
    } else {
      if (!gainNodeRef.current) {
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.gain.value = musicVolume;
        gainNodeRef.current.connect(audioContextRef.current.destination);
      }
      setIsPlayingMusic(true);
    }
  };

  useEffect(() => {
    if (isPlayingMusic && audioContextRef.current) {
      scheduleNextSection(audioContextRef.current.currentTime);
    }
  }, [isPlayingMusic]);

  const { currentWord, currentFrame, progress, reset, setProgress, nextSentence, previousSentence, totalWords, currentIndex, fontSizes, toc, currentContext } = useRSVP(inputText, wpm, isPlaying, isRevolverMode);

  // Keybindings
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in the text input
      if (!hasStarted && (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT' || e.target.contentEditable === 'true')) {
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
        if (isFocusMode) {
          setIsFocusMode(false);
        } else {
          setOpenDropdown(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStarted, nextSentence, previousSentence, isFocusMode]);

  // Double tap to toggle Focus Mode
  useEffect(() => {
    const handleDblClick = () => {
      if (hasStarted) {
        setIsFocusMode(prev => !prev);
      }
    };
    window.addEventListener('dblclick', handleDblClick);
    return () => window.removeEventListener('dblclick', handleDblClick);
  }, [hasStarted]);

  // Apply theme to html element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    if (isFocusMode) {
      document.body.classList.add('focus-mode-active');
    } else {
      document.body.classList.remove('focus-mode-active');
    }
  }, [isFocusMode]);

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
    setIsFocusMode(false);
  };

  const handleLoadSample = () => {
    setInputText(sampleText);
    setHasStarted(false);
    setOpenDropdown(null);
  };

  const toggleDropdown = (name) => {
    setOpenDropdown(prev => prev === name ? null : name);
  };

  const speedOptions = [1, 1.25, 1.5, 1.75, 2];

  return (
    <>
      <h1 className={`title ${isFocusMode ? 'hidden-ui' : ''}`}>
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
            isFocusMode={isFocusMode}
            setIsFocusMode={setIsFocusMode}
            hasStarted={hasStarted}
            isPlayingMusic={isPlayingMusic}
            toggleMusic={toggleMusic}
            musicVolume={musicVolume}
            setMusicVolume={setMusicVolume}
            musicSpeed={musicSpeed}
            setMusicSpeed={setMusicSpeed}
            isOpen={openDropdown === 'settings'}
            onToggle={(open) => setOpenDropdown(open ? 'settings' : null)}
          />
        </div>
      </h1>

      {!hasStarted ? (
        <TextInput
          setInputText={setInputText}
          onStart={handleStart}
          initialValue={inputText}
          isPlayingMusic={isPlayingMusic}
          toggleMusic={toggleMusic}
          musicVolume={musicVolume}
          setMusicVolume={setMusicVolume}
          musicSpeed={musicSpeed}
          setMusicSpeed={setMusicSpeed}
        />
      ) : (
        <>
          <div className={isFocusMode ? 'hidden-ui' : ''}>
            <Navigation
              toc={toc}
              currentContext={currentContext}
              onNavigate={setProgress}
              isOpen={openDropdown === 'nav'}
              onToggle={(open) => setOpenDropdown(open ? 'nav' : null)}
            />
          </div>

          <ReaderDisplay
            wordObj={currentWord}
            words={currentFrame}
            fontSizes={fontSizes}
            isRevolver={isRevolverMode}
          />

          <div className={isFocusMode ? 'hidden-ui' : ''}>
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

            <div className="music-player-row reading-mode">
              <div className="music-controls">
                <button
                  className={`music-toggle-btn ${isPlayingMusic ? 'active' : ''}`}
                  onClick={toggleMusic}
                  title={isPlayingMusic ? "Stop BGM" : "Play Atmosphere"}
                >
                  {isPlayingMusic ? '⏸ Stop BGM' : '▶ Play Atmosphere'}
                </button>

                <div className="music-settings-group">
                  <div className="volume-control">
                    <span className="volume-icon">🔈</span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={musicVolume}
                      onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                      className="volume-slider"
                    />
                    <span className="volume-icon">🔊</span>
                  </div>

                  <div className="music-speed-control">
                    <label htmlFor="music-speed-select-reading" className="speed-label">Speed</label>
                    <select
                      id="music-speed-select-reading"
                      className="music-speed-dropdown"
                      value={musicSpeed}
                      onChange={(e) => setMusicSpeed(parseFloat(e.target.value))}
                    >
                      {speedOptions.map(s => (
                        <option key={s} value={s}>{s}x</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <button style={{ marginTop: '2rem', background: 'transparent', border: 'none', color: 'var(--text-color)', opacity: 0.5, cursor: 'pointer', textDecoration: 'underline' }} onClick={handleBackToEdit}>
              Back to Editor
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default App
