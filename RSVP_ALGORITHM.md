# RSVP Algorithm Logic

This document explains the **Rapid Serial Visual Presentation (RSVP)** engine in Speed Reader.

## 1. Overview
The engine converts HTML into a stream of "Word Objects" and plays them back at a user-defined WPM. It uses dynamic delays based on punctuation, structure, and linguistic complexity (syllables).

## 2. Parsing & Chunking
1.  **Style inheritance**: Tracks `B`, `I`, `H1-H6` through the DOM.
2.  **Linguistic Tokenization**: Splits text by whitespace, preserving hyphens.
3.  **Dynamic Word Breaking**: If a word exceeds screen capacity (calculated via viewport width), it uses **Hypher** (TeX patterns) to split the word into readable hyphenated chunks (min 4 chars).

## 3. Pacing Logic (Dynamic Delay)
Total delay is calculated word-by-word:
`Delay = Base_Delay * Multipliers`

| Factor | Multiplier | Rationale |
| :--- | :--- | :--- |
| **Heading** | 2.0x | Identification of title/header |
| **Paragraph End** | 1.8x | Mental reset between blocks |
| **Sentence End** | 1.5x | Full stop (includes Indic ।) |
| **Syllables (5+)** | 1.6x | **RiTa** linguistic complexity |
| **Syllables (3-4)** | 1.3x | **RiTa** linguistic complexity |

## 4. Optical Alignment (ORP)
Words are centered on the **Optimal Recognition Point (ORP)**—the character slightly left of center (highlighted in red)—to minimize eye movement (saccades).

## 5. System Flow

``` mermaid
flowchart TD;
    Input[HTML Input] --> Parser[Parser + Hypher Breaking]
    Parser --> Pacing[RiTa Syllable Analysis]
    Pacing --> Playback[RSVP Loop with Dynamic Delays]
```

### Parser & Playback
``` mermaid
flowchart TD;
    A[Start Node] --> B{Type?}
    B -- Element --> C[Inherit Styles] --> A
    B -- Text --> D[Tokenize]
    D --> E{Too Long?}
    E -- Yes --> F[Hypher Split] --> G[Create Word Objects]
    E -- No --> G
    G --> H[RiTa Syllables]
    H --> I[Calc Delay]
    I --> J[Set Timeout]
    J --> K[Next Word]
```
