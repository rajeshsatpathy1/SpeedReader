import React from 'react';
import './Settings.css';

const THEMES = [
    { id: 'light', name: 'Light', previewBg: '#ffffff', previewText: '#000000', previewHighlight: '#e74c3c' },
    { id: 'dark', name: 'Dark', previewBg: '#1a1a1a', previewText: '#f5f5f5', previewHighlight: '#e74c3c' },
    { id: 'sepia', name: 'Sepia', previewBg: '#f4ecd8', previewText: '#5b4636', previewHighlight: '#d35400' },
    { id: 'matrix', name: 'Matrix', previewBg: '#000000', previewText: '#00cc00', previewHighlight: '#e74c3c' },
];

const Settings = ({ currentTheme, setTheme, fontSizeScale, setFontSizeScale, isRevolverMode, setIsRevolverMode }) => {
    return (
        <div className="settings-container">
            <div className="setting-group">
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

            <div className="setting-group">
                <h3>Size</h3>
                <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={fontSizeScale}
                    onChange={(e) => setFontSizeScale(Number(e.target.value))}
                />
            </div>

            <div className="setting-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
        </div>
    );
};

export default Settings;
