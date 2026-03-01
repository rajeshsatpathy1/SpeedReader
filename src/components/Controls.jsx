import React from 'react';
import './Controls.css';

const Controls = ({ isPlaying, setIsPlaying, wpm, setWpm, progress, setProgress, onReset, onNextSentence, onPreviousSentence, totalWords, currentIndex, bookmarks = [], onToggleBookmark }) => {

    // WPM Multipliers for quick setting
    const adjustWpm = (amount) => {
        setWpm(prev => Math.max(60, Math.min(1000, prev + amount)));
    };

    const isBookmarked = bookmarks.includes(currentIndex);

    return (
        <div className="controls-container">
            <div className="progress-bar-container">
                <div className="slider-wrapper">
                    <input
                        type="range"
                        min="0"
                        max={totalWords - 1}
                        value={currentIndex}
                        onChange={(e) => setProgress(Number(e.target.value))}
                        className="progress-slider"
                        disabled={totalWords === 0}
                    />
                    <div className="bookmarks-overlay">
                        {bookmarks.map((bookmarkIndex) => (
                            <div
                                key={bookmarkIndex}
                                className="bookmark-marker"
                                style={{ left: `${(bookmarkIndex / (totalWords - 1)) * 100}%` }}
                                onClick={() => setProgress(bookmarkIndex)}
                                title={`Jump to bookmark at word ${bookmarkIndex + 1}`}
                            />
                        ))}
                    </div>
                </div>
                <div className="progress-row">
                    <button className="icon-btn restart-btn" onClick={onReset} title="Restart">
                        ↺
                    </button>
                    <button
                        className={`icon-btn bookmark-btn ${isBookmarked ? 'active' : ''}`}
                        onClick={() => onToggleBookmark(currentIndex)}
                        title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
                    >
                        {isBookmarked ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="var(--highlight-color)" stroke="var(--highlight-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                            </svg>
                        )}
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
