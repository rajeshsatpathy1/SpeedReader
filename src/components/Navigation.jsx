import React, { useState } from 'react';
import './Navigation.css';

const Navigation = ({ toc, currentContext, onNavigate, isOpen, onToggle }) => {
    if (!toc || toc.length === 0) return null;

    const handleSelect = (index) => {
        onNavigate(index);
        onToggle(false);
    };

    return (
        <div className="navigation-container">
            {/* Collapsed View: Current Context */}
            <div className="nav-bar" onClick={() => onToggle(!isOpen)}>
                <div className="nav-info">
                    {currentContext.section && <span className="nav-section">{currentContext.section}</span>}
                    {currentContext.section && currentContext.subSection && <span className="nav-separator">›</span>}
                    {currentContext.subSection && <span className="nav-subsection">{currentContext.subSection}</span>}

                    {!currentContext.section && !currentContext.subSection && <span className="nav-placeholder">Navigation</span>}
                </div>
                <div className={`nav-toggle ${isOpen ? 'expanded' : ''}`}>
                    ▼
                </div>
            </div>

            {/* Expanded View: Table of Contents */}
            {isOpen && (
                <div className="nav-dropdown">
                    {toc.map((item, i) => (
                        <div
                            key={i}
                            className={`nav-item level-${item.level}`}
                            onClick={() => handleSelect(item.index)}
                        >
                            {item.text}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Navigation;
