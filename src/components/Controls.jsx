import React from 'react';
import './Controls.css';

const Controls = ({ isPlaying, setIsPlaying, wpm, setWpm, progress, setProgress, onReset, onNextSentence, onPreviousSentence, totalWords, currentIndex }) => {

    // WPM Multipliers for quick setting
    const adjustWpm = (amount) => {
        setWpm(prev => Math.max(60, Math.min(1000, prev + amount)));
    };

    return (
        <div className="controls-container">
            <div className="progress-bar-container">
                <input
                    type="range"
                    min="0"
                    max={totalWords - 1}
                    value={currentIndex}
                    onChange={(e) => setProgress(Number(e.target.value))}
                    className="progress-slider"
                    disabled={totalWords === 0}
                />
                <div className="progress-row">
                    <button className="icon-btn restart-btn" onClick={onReset} title="Restart">
                        ↺
                    </button>
                    <div className="progress-info">
                        {currentIndex + 1} / {totalWords}
                    </div>
                </div>
            </div>

            <div className="main-controls">
                <div className="playback-group">
                    <button className="icon-btn nav-btn" onClick={onPreviousSentence} title="Previous Sentence">
                        «
                    </button>
                    <button className={`play-btn ${isPlaying ? 'active' : ''}`} onClick={() => setIsPlaying(!isPlaying)}>
                        {isPlaying ? 'PAUSE' : 'PLAY'}
                    </button>
                    <button className="icon-btn nav-btn" onClick={onNextSentence} title="Next Sentence">
                        »
                    </button>
                </div>
            </div>

            <div className="speed-controls">
                <button onClick={() => adjustWpm(-50)}>-50</button>
                <div className="wpm-display">
                    <span className="wpm-value">{wpm}</span>
                    <span className="wpm-label">WPM</span>
                </div>
                <button onClick={() => adjustWpm(50)}>+50</button>
            </div>

        </div>
    );
};

export default Controls;
