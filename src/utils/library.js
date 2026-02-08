import { libraryManifest } from './libraryManifest';

// Function to extract title from HTML content
const extractTitle = (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const h1 = doc.querySelector('h1');
    return h1 ? h1.textContent : 'Untitled Document';
};

// Function to load a single library document
const loadLibraryDocument = async (manifestItem) => {
    try {
        const response = await fetch(`${import.meta.env.BASE_URL}${manifestItem.path}`);
        if (!response.ok) {
            throw new Error(`Failed to load ${manifestItem.path}`);
        }
        const htmlContent = await response.text();
        const title = extractTitle(htmlContent);

        return {
            id: manifestItem.id,
            title: title,
            content: htmlContent,
            path: manifestItem.path
        };
    } catch (error) {
        console.error(`Error loading library document ${manifestItem.id}:`, error);
        return null;
    }
};

// Function to load all library documents
export const loadLibrary = async () => {
    const loadPromises = libraryManifest.map(item => loadLibraryDocument(item));
    const results = await Promise.all(loadPromises);
    // Filter out any failed loads
    return results.filter(item => item !== null);
};
