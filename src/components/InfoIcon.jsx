import React, { useState } from 'react';
import './InfoIcon.css';

const InfoIcon = ({ onLoadSample, isOpen, onToggle }) => {
    return (
        <div
            className="info-icon-container"
        >
            <button
                className="info-btn"
                onClick={() => onToggle(!isOpen)}
                aria-label="App Information"
            >
                i
            </button>
            {isOpen && (
                <div className="info-tooltip">
                    <strong>How it works:</strong>
                    <p>Paste your text to start speed reading.</p>

                    <div className="info-section">
                        <strong>Keyboard Shortcuts:</strong>
                        <ul className="info-list">
                            <li><kbd>Space</kbd><span> : Play / Pause</span></li>
                            <li><kbd>→</kbd><span> : Next Sentence</span></li>
                            <li><kbd>←</kbd><span> : Previous Sentence</span></li>
                            <li><kbd>Esc</kbd><span> : Close Menu / Exit Focus Mode</span></li>
                        </ul>
                    </div>

                    <div className="info-section">
                        <strong>Pro Tips:</strong>
                        <ul className="info-list">
                            <li><span><b>Double Tap</b> to toggle Focus Mode</span></li>
                            <li><span>Use the <b>Navigation Bar</b> to jump between sections</span></li>
                        </ul>
                    </div>

                    <p className="note">
                        <span className="note-label">Note:</span> This reader preserves <b>bold</b>, <i>italics</i>, and headers from your source text to maintain the original emphasis!
                    </p>
                </div>
            )}
        </div>
    );
};

export default InfoIcon;
