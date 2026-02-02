# Speed Reader

A premium, distraction-free speed reading web application built with **React 19** and **Vite**. This app leverages advanced reading methods and intelligent algorithms to help you consume text faster and with better comprehension.

- ### 🚀 **[Live Demo](https://rajeshsatpathy1.github.io/SpeedReader/)** 
- ### 📚 **[How the Thing Works](./RSVP_ALGORITHM.md)**

## ✨ Key Features

### � Intelligent Reading Modes
- **RSVP Engine**: Rapid Serial Visual Presentation. Words are displayed one-by-one, keeping your eyes fixed on a central "pivot" point to minimize saccadic eye movements.
- **Revolver Mode**: A sliding window view that provides context by showing the previous and next words while keeping the current word centered.

### 🧠 Smart Reading Logic
- **Dynamic Pauses**: The engine automatically adjusts timing based on punctuation. Sentence endings, clause breaks, and paragraph transitions receive natural, context-aware pauses.
- **Optical Alignment**: Advanced centering logic ensures the Optimal Recognition Point (ORP) — highlighted in red — stays perfectly aligned for maximum Focus.
- **Adaptive Text Scaling**: Intelligent font size management that scales content based on word length to prevent UI overflow while maintaining readability.

### 📄 Comprehensive Content Support
- **Rich Text Preservation**: Maintains **bold**, *italics*, and header structures from pasted text.
- **Multi-Format Upload**: Seamlessly read from `.txt`, `.pdf`, and `.docx` files using client-side parsing.
- **Pre-loaded Samples**: Includes high-quality sample text to get you started immediately.

### 🎨 Premium Experience
- **Fluid UI**: A modern, clean interface with smooth micro-animations.
- **Custom Themes**: Choose from Light, Dark, Sepia, or the immersive Matrix theme.
- **Mobile First**: Fully responsive design with touch-optimized controls and overflow-proof layouts.

## 🛠️ Tech Stack

- **Core**: React 19, Vite, Vanilla CSS
- **Parsing**: `mammoth.js` (DOCX), `pdfjs-dist` (PDF)
- **State Management**: Custom hooks (`useRSVP`) for precise timing and control.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rajeshsatpathy1/SpeedReader.git
   cd SpeedReader
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Launch development server**
   ```bash
   npm run dev
   ```

## 📦 Deployment

The project is optimized for **GitHub Pages**.

1. **Build**: `npm run build`
2. **Deploy**: `npm run deploy` (requires `gh-pages` branch setup)

## 📜 License

MIT © [Rajesh Satpathy](https://github.com/rajeshsatpathy1)
