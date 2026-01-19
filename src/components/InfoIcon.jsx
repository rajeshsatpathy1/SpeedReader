import React, { useState } from 'react';
import './InfoIcon.css';

const InfoIcon = () => {
    const [visible, setVisible] = useState(false);

    return (
        <div className="info-icon-container">
            <button
                className="info-btn"
                onClick={() => setVisible(!visible)}
                onMouseEnter={() => setVisible(true)}
                onMouseLeave={() => setVisible(false)}
                aria-label="App Information"
            >
                i
            </button>
            {visible && (
                <div className="info-tooltip">
                    <strong>How it works:</strong>
                    <p>Paste your text to start speed reading.</p>
                    <p className="note">
                        <span className="note-label">Note:</span> This reader preserves <b>bold</b>, <i>italics</i>, and headers from your source text to maintain the original emphasis!
                    </p>
                </div>
            )}
        </div>
    );
};

export default InfoIcon;
