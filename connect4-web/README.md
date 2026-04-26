# Connect 4 Web

A whimsical, cottagecore-inspired Connect 4 game built with plain HTML, CSS, and JavaScript.

## Features

- Forest-themed visual design (dark woodland background, fireflies, leaf accents)
- 8-column by 7-row Connect 4 board
- Two-player name inputs:
  - Lavender chip player
  - Light green chip player
- Name locking during active play session
- Auto-advancing rounds after win/tie
- Round counter (`Rounds played`)
- Per-player win counters in tally-mark format
- Winner popup + confetti celebration
- Mobile-responsive layout and controls

## Project Structure

- `index.html` - app structure and UI markup
- `styles.css` - theme, layout, animations, responsive styles
- `app.js` - game logic, rounds, score tracking, win/tie flow

## How to Run

This is a static web project. You can run it with a local server.

### Option 1: Python

```bash
python -m http.server 8080
```

Then open:

- [http://localhost:8080](http://localhost:8080)

### Option 2: Open directly

You can also open `index.html` directly in a browser, but using a local server is recommended.

## Gameplay Notes

- Enter player names before the first move.
- Once a round session starts, names are locked.
- After each round ends:
  - Winner/tie appears
  - Board auto-resets into the next round
- Press **Reset Game** to:
  - clear the board
  - reset rounds played
  - reset both player win counters
  - unlock name inputs

## Tech

- HTML5
- CSS3 (animations + responsive breakpoints)
- Vanilla JavaScript (ES modules)

## Note About C++ Files

This web app runs in the browser using JavaScript.

If this repository also includes C++ source and header files (for example, an original terminal version), those files are kept for reference and version history, but they are not executed directly by the browser in this project setup.

To run C++ logic in a browser, the C++ code would need to be compiled to WebAssembly and then called from JavaScript.
