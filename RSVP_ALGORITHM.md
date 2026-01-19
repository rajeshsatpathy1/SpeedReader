# RSVP Algorithm Logic

This document details the inner workings of the **Rapid Serial Visual Presentation (RSVP)** engine used in the Speed Reader application.

## 1. Overview
The engine transforms raw HTML content into a stream of "Word Objects" rich with metadata (styles, structure tags). It then plays these words back at a user-defined speed (WPM), applying dynamic delays based on punctuation and sentence structure to create a natural reading rhythm.

## 2. Parsing & Tokenization Logic
The `parseHtmlToWords` function is responsible for converting the DOM tree into a linear list of words.

### A. DOM Traversal
We traverse the input HTML recursively:
1.  **Block Detection**: We track if we are inside a "Block" element (`P`, `DIV`, `H1-H6`, etc.).
2.  **Style inheritance**: We maintain a stack of active styles (`B`, `I`, `H1`) as we descend the tree.
3.  **Text Extraction**: When we hit a Text Node, we extract the string.

### B. Tokenization
1.  **Hyphen Splitting**: We preprocess text to surround hyphens (`-`) and em-dashes (`—`) with spaces.
    -   *Example*: `"long-term"` → `"long"`, `"-"`, `"term"`.
2.  **Splitting**: We split the string by whitespace into individual tokens.
3.  **Metadata Assignment**: Each token is stored as an object:
    -   `text`: The word string.
    -   `styles`: Array of inherited tags (e.g., `['H1', 'B']`).
    -   `isBlockEnd`: A flag set to `true` if this word is the *last* word of a block element (like a Paragraph).

## 3. Playback Loop (Dynamic Pacing)
Instead of a fixed interval, we use a **Recursive Timeout Loop**. This allows us to calculate a unique duration for *every single word*.

### Delay Calculation
$$ \text{Total Delay} = \text{Base Delay} \times \text{Structure Multiplier} \times \text{Pause Multiplier} $$

1.  **Base Delay**: Calculated from Words Per Minute (WPM).
    -   `Base = 60000 / WPM`

2.  **Structure Multiplier**:
    -   **Headings**: If a word has an `H1-H6` tag, speed is **2.0x** slower (Multiplier = 2.0).
    -   *Reason*: Allows the user to recognize they are reading a Title or Chapter Header.

3.  **Pause Multiplier** (Punctuation & Phrasing):
    -   **Paragraph/Block End**: **1.8x** (Mental reset between blocks).
    -   **Sentence End (`. ! ?`)**: **1.5x** (Full stop pause).
    -   **Clause Break (` , ; : `)**: **1.2x** (Short breath).
    -   **Parenthetical (` ( ) - `)**: **1.2x** (Slight separation).

## 4. Optical Alignment (ORP)
The visual renderer centers the word not by its geometric center, but by its **Optical Recognition Point (ORP)**—usually the character just slightly to the left of the center. This reduces eye movement (saccades) and prevents fatigue.

## 5. Logic Flow Diagram

```mermaid
flowchart TD
    UserInput[User Pastes HTML/Text] --> Parser
    
    subgraph Parsing Phase
        Parser[Traverse DOM Tree]
        Parser --> CheckNode{Node Type?}
        
        CheckNode -- Element Node --> CaptureStyle[Inherit Styles (B, I, H1...)]
        CaptureStyle --> Recurse[Recurse Children]
        Recurse --> CheckBlockEnd{End of Block?}
        CheckBlockEnd -- Yes --> MarkFlag[Mark Last Word: isBlockEnd=true]
        
        CheckNode -- Text Node --> SplitHyphens[Replace '-' with ' - ']
        SplitHyphens --> Tokenize[Split by Whitespace]
        Tokenize --> CreateObjects[Create Word Objects\n{text, styles}]
    end

    CreateObjects --> WordList[Word List Ready]
    
    subgraph Playback Phase
        WordList --> StartLoop[Start Playback Loop]
        StartLoop --> GetWord[Get Current Word]
        GetWord --> CalcBase[Base Delay = 60000/WPM]
        
        CalcBase --> CheckHeading{Is Heading?}
        CheckHeading -- Yes --> MultHeading[Multiplier * 2.0]
        CheckHeading -- No --> CheckPunct{Check Punctuation}
        
        MultHeading --> CheckPunct
        
        CheckPunct -- "Block End" --> PauseBlock[Pause * 1.8]
        CheckPunct -- ". ! ?" --> PauseSent[Pause * 1.5]
        CheckPunct -- ", ; :" --> PauseComma[Pause * 1.2]
        
        PauseBlock --> ApplyDelay[Set Timeout(NextWord, TotalDelay)]
        PauseSent --> ApplyDelay
        PauseComma --> ApplyDelay
        
        ApplyDelay --> UpdateIndex[Index++]
        UpdateIndex --> Loop{End of List?}
        Loop -- No --> GetWord
        Loop -- Yes --> Stop
    end
```
