import { useRef, useEffect, useState } from 'react';
import './TextInput.css';
import { parseFile } from '../utils/fileParser';
import { loadLibrary } from '../utils/library';

const TextInput = ({ setInputText, onStart, initialValue = '', isPlayingMusic, toggleMusic, musicVolume, setMusicVolume, musicSpeed, setMusicSpeed }) => {
    const editorRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [view, setView] = useState('editor'); // 'editor' or 'library'
    const [library, setLibrary] = useState([]);
    const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);

    // Populate editor when initialValue changes
    useEffect(() => {
        if (editorRef.current && initialValue) {
            editorRef.current.innerHTML = initialValue;
        }
    }, [initialValue]);

    // Switch to editor view when initialValue is set while in library view
    useEffect(() => {
        if (initialValue && view === 'library') {
            setView('editor');
        }
    }, [initialValue]); // Only depend on initialValue to avoid loops

    // Load library when switching to library view
    useEffect(() => {
        if (view === 'library' && library.length === 0 && !isLoadingLibrary) {
            setIsLoadingLibrary(true);
            loadLibrary().then(loadedLibrary => {
                setLibrary(loadedLibrary);
                setIsLoadingLibrary(false);
            }).catch(error => {
                console.error('Failed to load library:', error);
                setIsLoadingLibrary(false);
            });
        }
    }, [view, library.length, isLoadingLibrary]);

    const handleStart = () => {
        if (editorRef.current) {
            setInputText(editorRef.current.innerHTML);
            onStart();
        }
    };

    const handleLibrarySelect = (content) => {
        setInputText(content);
        // We need to wait for setInputText to propagate or handle it in parent
        // Actually, setInputText is a prop. If we call it and then onStart, it might use stale state in App.js
        // But App.js's handleStart calls reset() and setIsPlaying(true)
        // Let's assume onStart() will work correctly if we update the state.
        // Wait, App's handleStart doesn't take the text as argument.
        // It uses inputText which is state.
        // To be safe, let's slightly modify handleStart or update parent state.
        onStart();
    };

    const handleClear = () => {
        if (editorRef.current) {
            editorRef.current.innerHTML = '';
            editorRef.current.focus();
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsProcessing(true);
        try {
            const htmlContent = await parseFile(file);
            if (editorRef.current) {
                // simple append or replace? Replace feels correct for "uploading a document"
                editorRef.current.innerHTML = htmlContent;
                // Notify parent immediately? No, let user review before starting.
                setView('editor');
            }
        } catch (error) {
            console.error(error);
            alert("Failed to parse file: " + error.message);
        } finally {
            setIsProcessing(false);
            // Reset input so same file can be selected again
            e.target.value = '';
        }
    };

    const speedOptions = [1, 1.25, 1.5, 1.75, 2];

    return (
        <div className="text-input-container">
            {view === 'editor' ? (
                <div className="editor-wrapper">
                    <div
                        className="rich-text-editor"
                        contentEditable
                        ref={editorRef}
                        data-placeholder="Paste your text or upload a file..."
                    >
                    </div>
                    <button className="clear-btn" onClick={handleClear} title="Clear text">
                        ✕
                    </button>
                </div>
            ) : (
                <div className="library-grid">
                    {isLoadingLibrary ? (
                        <div className="library-loading">Loading library...</div>
                    ) : (
                        <>
                            {library.map((item) => (
                                <button
                                    key={item.id}
                                    className="library-item"
                                    onClick={() => handleLibrarySelect(item.content)}
                                >
                                    <span className="library-item-title">{item.title}</span>
                                </button>
                            ))}
                        </>
                    )}
                </div>
            )}

            <div className="action-row">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    accept=".txt,.pdf,.docx"
                />

                {view === 'editor' && (
                    <button className="start-btn" onClick={handleStart} disabled={isProcessing}>
                        Start Reading
                    </button>
                )}

                {view === 'editor' && (
                    <button
                        className="secondary-btn library-toggle"
                        onClick={() => setView('library')}
                    >
                        📚 Check out Library
                    </button>
                )}

                {view === 'library' && (
                    <button className="secondary-btn" onClick={() => setView('editor')}>
                        ✍️ Go back to Editor
                    </button>
                )}

                {view === 'editor' && (
                    <button className="secondary-btn" onClick={handleUploadClick} disabled={isProcessing}>
                        {isProcessing ? 'Processing...' : '📂 Upload File'}
                    </button>
                )}
            </div>

            <div className="music-player-row">
                <div className="music-controls">
                    <button
                        className={`music-toggle-btn ${isPlayingMusic ? 'active' : ''}`}
                        onClick={toggleMusic}
                        title={isPlayingMusic ? "Stop BGM" : "Play BGM"}
                    >
                        {isPlayingMusic ? '⏸ Stop BGM' : '▶ Play BGM'}
                    </button>

                    <div className="music-settings-group">
                        <div className="volume-control">
                            <span className="volume-icon">🔈</span>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={musicVolume}
                                onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                                className="volume-slider"
                            />
                            <span className="volume-icon">🔊</span>
                        </div>

                        <div className="music-speed-control">
                            <label htmlFor="music-speed-select" className="speed-label">Speed</label>
                            <select
                                id="music-speed-select"
                                className="music-speed-dropdown"
                                value={musicSpeed}
                                onChange={(e) => setMusicSpeed(parseFloat(e.target.value))}
                            >
                                {speedOptions.map(s => (
                                    <option key={s} value={s}>{s}x</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <p className="music-attribution">
                    Ambient Strings by Alfarran Basalim
                </p>
            </div>
        </div>
    );
};

export default TextInput;
