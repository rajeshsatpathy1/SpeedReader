# Speed Reader

A modern, distraction-free speed reading web application built with **React** and **Vite**. This app uses the **RSVP (Rapid Serial Visual Presentation)** method to help you read faster by displaying words one at a time, keeping the optimal recognition point (ORP) centered.

### [🚀 Live Demo](https://rajeshsatpathy1.github.io/SpeedReader/)

## Features

- **🚀 RSVP Reading Engine**: Reads text word-by-word at your desired WPM (Words Per Minute).
- **📝 Rich Text Support**: Preserves **bold**, *italics*, and headers from pasted text or uploaded documents.
- **📂 File Upload**: Support for reading directly from `.txt`, `.pdf`, and `.docx` files.
- **📄 Sample Text**: Includes the essay ["Good Writing" by Paul Graham](https://paulgraham.com/goodwriting.html) for quick testing.
- **🎨 Theming**: Includes Light, Dark, Sepia, and Matrix themes.
- **👁️ Optical Alignment**: Uses advanced centering logic to keep your eyes focused on the red "pivot" character.
- **📱 Responsive**: Works beautifully on desktop and mobile devices.

## Tech Stack

- **Framework**: React + Vite
- **Styling**: Vanilla CSS (Variables, Grid, Flexbox)
- **Libraries**: 
  - `mammoth.js` (Docx parsing)
  - `pdfjs-dist` (PDF parsing)

## Getting Started

### Prerequisites

- Node.js installed.

### Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/yourusername/speed-reader.git
   cd speed-reader
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

The project is configured for deployment on **GitHub Pages**.

1. Build the project:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder to your static host.

## License

MIT
