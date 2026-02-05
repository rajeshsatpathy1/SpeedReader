import { useRef, useEffect, useState } from 'react';
import './TextInput.css';
import { parseFile } from '../utils/fileParser';

const TextInput = ({ setInputText, onStart, initialValue = '', isPlayingMusic, toggleMusic, musicVolume, setMusicVolume, musicSpeed, setMusicSpeed }) => {
    const editorRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (editorRef.current && initialValue) {
            editorRef.current.innerHTML = initialValue;
        }
    }, [initialValue]); // Run when initialValue changes

    const handleStart = () => {
        if (editorRef.current) {
            setInputText(editorRef.current.innerHTML);
            onStart();
        }
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

            <div className="action-row">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    accept=".txt,.pdf,.docx"
                />

                <button className="secondary-btn" onClick={handleUploadClick} disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : '📂 Upload File'}
                </button>

                <button className="start-btn" onClick={handleStart} disabled={isProcessing}>
                    Start Reading
                </button>
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
