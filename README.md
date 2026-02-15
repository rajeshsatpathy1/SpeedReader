# Speed Reader

A premium, distraction-free speed reading web application built with **React 19** and **Vite**. This app leverages advanced reading methods and intelligent algorithms to help you consume text faster and with better comprehension.

- ### 🚀 **[Live Demo](https://rajeshsatpathy1.github.io/SpeedReader/)** 
- ### 📚 **[How the Thing Works](./RSVP_ALGORITHM.md)**

## ✨ Key Features

### � Intelligent Reading Modes
- **RSVP Engine**: Rapid Serial Visual Presentation. Words are displayed one-by-one, keeping your eyes fixed on a central "pivot" point to minimize saccadic eye movements.
- **Revolver Mode**: A sliding window view that provides context by showing the previous and next words while keeping the current word centered.
- **Horizontal Mode**: An advanced view for Revolver Mode that displays text in a natural left-to-right flow, mimicking traditional reading while maintaining the centered focus.

### 🧠 Smart Reading Logic
- **Dynamic Pauses**: The engine automatically adjusts timing based on punctuation. Sentence endings, clause breaks, and paragraph transitions receive natural, context-aware pauses.
- **Optical Alignment**: Advanced centering logic ensures the Optimal Recognition Point (ORP) — highlighted in red — stays perfectly aligned for maximum Focus.
- **Adaptive Text Scaling**: Intelligent font size management that scales content based on word length to prevent UI overflow while maintaining readability.
- **Length-based Delays**: The engine automatically slows down for longer, complex words to ensure you have enough time to process them.

### 🎮 Precision Control & Navigation
- **Sentence-based Navigation**: Missed a detail? Meaningful controls allow you to jump to the previous or next sentence instantly, ensuring you never lose the thread of the narrative.
- **Smart Navigation Bar**: A dynamic Table of Contents that tracks your progress. Click to jump instantly between chapters or sections, perfect for long-form content.
- **Interactive Progress**: Scrub through the text with a precision slider or restart sections with a single click.

### 📄 Comprehensive Content Support
- **Rich Text Preservation**: Maintains **bold**, *italics*, and header structures from pasted text.
- **Multi-Format Upload**: Seamlessly read from `.txt`, `.pdf`, and `.docx` files using client-side parsing.
- **Built-in Library**: Access a curated collection of texts, including multilingual samples (Hindi, Kannada, Bengali, Spanish) to test the engine's capabilities with complex scripts.

### 🎨 Premium Experience
- **Fluid UI**: A modern, clean interface with smooth micro-animations.
- **Refined Themes**: Professionally calibrated Light, Dark, Sepia, and Matrix themes for optimal contrast in any environment.
- **Mobile First**: Fully responsive design with touch-optimized controls and overflow-proof layouts.
- **Focus Mode**: An immersive reading experience that hides all distraction elements with a simple gesture.
- **Atmospheric Audio**: High-fidelity background strings with full control over **Volume** and **Playback Speed**.
    - *Linkable BGM*: Toggle to sync background music automatically with reading state (plays when reading, stops when paused).
    - *Gapless Looping Engine*: Uses a dual-source Web Audio scheduler to overlap buffers by 1s (`nextStart = currentStart + (duration / speed) - crossfade`), ensuring zero-latency transitions via linear gain crossfading.

## 🛠️ Tech Stack

- **Core**: React 19, Vite, Vanilla CSS
- **Parsing**: `mammoth.js` (DOCX), `pdfjs-dist` (PDF)
- **State Management**: Custom hooks (`useRSVP`) for precise timing and control.

## 📜 Credits & Attribution

- **Music**: Music by <a href="https://pixabay.com/users/farran_ez-45967570/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=456150">Alfarran Basalim</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=456150">Pixabay</a>.

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
