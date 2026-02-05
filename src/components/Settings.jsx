import React, { useState } from 'react';
import './Settings.css';

const THEMES = [
    { id: 'light', name: 'Light', previewBg: '#ffffff', previewText: '#000000', previewHighlight: '#e74c3c' },
    { id: 'dark', name: 'Dark', previewBg: '#1a1a1a', previewText: '#f5f5f5', previewHighlight: '#e74c3c' },
    { id: 'sepia', name: 'Sepia', previewBg: '#f4ecd8', previewText: '#5b4636', previewHighlight: '#d35400' },
    { id: 'matrix', name: 'Matrix', previewBg: '#000000', previewText: '#00cc00', previewHighlight: '#e74c3c' },
];

const Settings = ({ currentTheme, setTheme, isRevolverMode, setIsRevolverMode, isFocusMode, setIsFocusMode, hasStarted, isOpen, onToggle }) => {
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
                                    onChange={(e) => setIsRevolverMode(e.target.checked)}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <p className="setting-description">Displays words in a 3-word sliding window for better context.</p>
                    </div>

                    <div
                        className={`setting-group-row-container ${!hasStarted ? 'disabled' : ''}`}
                        title={hasStarted ? "Immersive mode that hides all UI elements (Double Tap to toggle)." : "Start reading to enable Focus Mode."}
                    >
                        <div className="setting-group-row">
                            <h3>Focus Mode</h3>
                            <label className="switch focus-switch">
                                <input
                                    type="checkbox"
                                    checked={isFocusMode}
                                    onChange={(e) => setIsFocusMode(e.target.checked)}
                                    disabled={!hasStarted}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <p className="setting-description">
                            {hasStarted
                                ? "Immersive mode that hides all UI elements (Double Tap to toggle)."
                                : "Start reading to enable Focus Mode."}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
