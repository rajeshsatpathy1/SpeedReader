import React, { useState } from 'react';
import './Navigation.css';

const Navigation = ({ toc, currentContext, onNavigate }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!toc || toc.length === 0) return null;

    const toggleExpand = () => setIsExpanded(!isExpanded);

    const handleSelect = (index) => {
        onNavigate(index);
        setIsExpanded(false);
    };

    return (
        <div className="navigation-container">
            {/* Collapsed View: Current Context */}
            <div className="nav-bar" onClick={toggleExpand}>
                <div className="nav-info">
                    {currentContext.section && <span className="nav-section">{currentContext.section}</span>}
                    {currentContext.section && currentContext.subSection && <span className="nav-separator">›</span>}
                    {currentContext.subSection && <span className="nav-subsection">{currentContext.subSection}</span>}

                    {!currentContext.section && !currentContext.subSection && <span className="nav-placeholder">Navigation</span>}
                </div>
                <div className={`nav-toggle ${isExpanded ? 'expanded' : ''}`}>
                    ▼
                </div>
            </div>

            {/* Expanded View: Table of Contents */}
            {isExpanded && (
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
