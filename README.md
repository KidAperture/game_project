# Card Game

This is a web-based card game demo that runs entirely in your browser. Players can play cards, manage items in a shop, earn achievements, and unlock new features as they progress through rounds. All game state is saved locally in your browser using `localStorage`.

## Technology Stack

This game is built purely with client-side technologies:
- HTML
- CSS
- JavaScript

There is no server-side backend required.

## Features

- **Card Gameplay**: Engage in a simple card playing loop.
- **Shop**: Spend coins earned from rounds to buy items.
- **Achievements**: Unlock achievements based on your progress (e.g., first win, high score).
- **Unlockables**: Gain access to new features or items through achievements.
- **Client-Side Persistence**: Your game progress (score, coins, achievements, etc.) is automatically saved in your browser via `localStorage`, allowing you to resume playing later.
- **Difficulty Selection**: Choose your preferred difficulty level at the start of a new game.

## How to Run Locally

1.  **Clone the repository (or download the files):**
    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```
2.  **Open the game in your browser:**
    Navigate to the `web` directory and open the `index.html` file in your preferred web browser.
    For example, you can often do this by right-clicking `index.html` and choosing "Open with..." or by dragging the file into an open browser window. On some systems, you might be able to use a command like:
    ```bash
    # On macOS
    open web/index.html
    # On Linux (xdg-utils needs to be installed)
    xdg-open web/index.html
    # On Windows
    start web/index.html
    ```
    Alternatively, you can serve the `web` directory using a simple local HTTP server (e.g., using Python's `http.server` module or Node.js `http-server`), but it's not strictly necessary for basic play.

## Hosting

Since this game is entirely client-side, it can be hosted on any static web hosting service. Some popular free options include:

- **GitHub Pages**: Ideal if your repository is already on GitHub.
- **Netlify**
- **Vercel**
- **Cloudflare Pages**

Simply upload the contents of the `web` directory to your chosen static hosting provider.

## Development Note
This project previously included a Python-based backend, but has since been refactored to be a purely client-side application. All game logic, including achievements and state persistence, is now handled by JavaScript running in the browser.
