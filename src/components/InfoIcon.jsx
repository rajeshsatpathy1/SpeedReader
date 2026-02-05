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
                            <li><kbd>Space</kbd> : Play / Pause</li>
                            <li><kbd>→</kbd> : Next Sentence</li>
                            <li><kbd>←</kbd> : Previous Sentence</li>
                            <li><kbd>Esc</kbd> : Close Menu / Exit Focus Mode</li>
                        </ul>
                    </div>

                    <div className="info-section">
                        <strong>Pro Tips:</strong>
                        <ul className="info-list">
                            <li><b>Double Tap</b> to toggle Focus Mode</li>
                            <li>Use the <b>Navigation Bar</b> to jump between sections</li>
                        </ul>
                    </div>

                    <p className="note">
                        <span className="note-label">Note:</span> This reader preserves <b>bold</b>, <i>italics</i>, and headers from your source text to maintain the original emphasis!
                    </p>

                    {onLoadSample && (
                        <div className="tooltip-action">
                            <button
                                className="link-btn"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent closing
                                    onLoadSample();
                                    onToggle(false);
                                }}
                            >
                                Try a default document
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default InfoIcon;
