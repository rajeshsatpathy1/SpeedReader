import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// Use the minified worker
// This setup works for Vite builds usually.
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString();

export const parseFile = async (file) => {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
        return await parseTextFile(file);
    } else if (
        fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        fileName.endsWith('.docx')
    ) {
        return await parseDocxFile(file);
    } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
        return await parsePdfFile(file);
    } else {
        throw new Error('Unsupported file type. Please upload .txt, .docx, or .pdf');
    }
};

const parseTextFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            // Wrap lines in paragraphs to preserve some structure
            const text = e.target.result;
            const html = text.split('\n').map(line => `<p>${line}</p>`).join('');
            resolve(html);
        };
        reader.onerror = reject;
        reader.readAsText(file);
    });
};

const parseDocxFile = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const arrayBuffer = e.target.result;
                const result = await mammoth.convertToHtml({ arrayBuffer });
                resolve(result.value); // The generated HTML
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
};

const parsePdfFile = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const typedarray = new Uint8Array(e.target.result);
                const pdf = await pdfjsLib.getDocument(typedarray).promise;
                let fullText = '';

                // Naively extract text page by page
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map(item => item.str).join(' ');
                    fullText += `<p>${pageText}</p>`;
                }

                resolve(fullText);
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
};
