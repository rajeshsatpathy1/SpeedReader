import React, { useState, useRef } from 'react';
import './Settings.css';

const THEMES = [
    { id: 'light', name: 'Light', previewBg: '#ffffff', previewText: '#000000', previewHighlight: '#e74c3c' },
    { id: 'dark', name: 'Dark', previewBg: '#1a1a1a', previewText: '#f5f5f5', previewHighlight: '#e74c3c' },
    { id: 'sepia', name: 'Sepia', previewBg: '#f4ecd8', previewText: '#5b4636', previewHighlight: '#d35400' },
    { id: 'matrix', name: 'Matrix', previewBg: '#000000', previewText: '#00cc00', previewHighlight: '#e74c3c' },
];

const Settings = ({ currentTheme, setTheme, isRevolverMode, setIsRevolverMode, isHorizontalMode, setIsHorizontalMode, isFocusMode, setIsFocusMode, hasStarted, isPlayingMusic, toggleMusic, musicVolume, setMusicVolume, musicSpeed, setMusicSpeed, linkBGM, setLinkBGM, isOpen, onToggle }) => {
    const dropdownRef = useRef(null);

    const speedOptions = [1, 1.25, 1.5, 1.75, 2];
    return (
        <div className="settings-container">
            <button
                className="settings-btn"
                onClick={() => onToggle(!isOpen)}
                aria-label="Settings"
                title="Settings"
            >
                ⚙
            </button>

            {isOpen && (
                <div className="settings-dropdown">
                    <div className="setting-group vertical">
                        <h3>Theme</h3>
                        <div className="theme-options">
                            {THEMES.map(theme => (
                                <button
                                    key={theme.id}
                                    className={`theme-btn ${currentTheme === theme.id ? 'active' : ''}`}
                                    onClick={() => setTheme(theme.id)}
                                    title={theme.name}
                                    style={{
                                        backgroundColor: theme.previewBg,
                                        color: theme.previewText,
                                        borderColor: currentTheme === theme.id ? 'var(--highlight-color)' : 'transparent'
                                    }}
                                >
                                    Aa
                                    <span className="dot" style={{ backgroundColor: theme.previewHighlight }}></span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="setting-group-row-container" title="Displays words in a 3-word sliding window for better context.">
                        <div className="setting-group-row">
                            <h3>Revolver Mode</h3>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={isRevolverMode}
                                    onChange={(e) => {
                                        setIsRevolverMode(e.target.checked);
                                        if (!e.target.checked) setIsHorizontalMode(false);
                                    }}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <p className="setting-description">Displays words in a 3-word sliding window for better context.</p>
                    </div>

                    <div className="setting-group-row-container" title="Displays full sentences, highlighting words as you read.">
                        <div className="setting-group-row">
                            <h3>Horizontal Mode</h3>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={isHorizontalMode}
                                    onChange={(e) => setIsHorizontalMode(e.target.checked)}
                                    disabled={!isRevolverMode}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <p className="setting-description">
                            Displays full sentences, highlighting words as you read. (Recommended only for wide screen mode)
                        </p>
                    </div>

                    <div className="setting-group-row-container" title="Focus Mode hides UI elements for a distraction-free experience.">
                        <div className="setting-group-row">
                            <h3>Focus Mode</h3>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={isFocusMode}
                                    onChange={(e) => setIsFocusMode(e.target.checked)}
                                    disabled={!hasStarted}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <p className="setting-description">Hides UI for focus. (Double tap to toggle during reading)</p>
                    </div>

                    <div className="separator"></div>

                    <div className="setting-group">
                        <div className="setting-header">
                            <h3>Atmosphere</h3>
                            <button
                                className={`music-mini-toggle ${isPlayingMusic ? 'active' : ''}`}
                                onClick={toggleMusic}
                            >
                                {isPlayingMusic ? 'Stop' : 'Play'}
                            </button>
                        </div>

                        <div className="setting-sub-row">
                            <span className="setting-label">Volume</span>
                            <input
                                type="range"
                                min="0" max="1" step="0.01"
                                value={musicVolume}
                                onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                                className="mini-slider"
                            />
                        </div>

                        <div className="setting-sub-row">
                            <span className="setting-label">Music Speed</span>
                            <select
                                className="mini-speed-dropdown"
                                value={musicSpeed}
                                onChange={(e) => setMusicSpeed(parseFloat(e.target.value))}
                            >
                                {speedOptions.map(s => (
                                    <option key={s} value={s}>{s}x</option>
                                ))}
                            </select>
                        </div>

                        <div className="setting-group-row-container" style={{ marginTop: '1rem', padding: '0' }}>
                            <div className="setting-group-row">
                                <span className="setting-label" style={{ fontWeight: '600' }}>Link BGM</span>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={linkBGM}
                                        onChange={(e) => setLinkBGM(e.target.checked)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            <p className="setting-description">Auto-play/pause music with reading.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
