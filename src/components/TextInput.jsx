import { useRef, useEffect, useState } from 'react';
import './TextInput.css';
import { parseFile } from '../utils/fileParser';

const TextInput = ({ setInputText, onStart, initialValue = '' }) => {
    const editorRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (editorRef.current && initialValue) {
            editorRef.current.innerHTML = initialValue;
        }
    }, []); // Run only on mount

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
        </div>
    );
};

export default TextInput;
