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
    Navigate to the `docs` directory and open the `index.html` file in your preferred web browser.
    For example, you can often do this by right-clicking `index.html` and choosing "Open with..." or by dragging the file into an open browser window. On some systems, you might be able to use a command like:
    ```bash
    # On macOS
    open docs/index.html
    # On Linux (xdg-utils needs to be installed)
    xdg-open docs/index.html
    # On Windows
    start docs/index.html
    ```
    Alternatively, you can serve the `docs` directory using a simple local HTTP server (e.g., using Python's `http.server` module or Node.js `http-server`), but it's not strictly necessary for basic play.

## Hosting

Since this game is entirely client-side, it can be hosted on any static web hosting service. Some popular free options include:

- **GitHub Pages**
- **Netlify**
- **Vercel**
- **Cloudflare Pages**

Simply upload the contents of the `docs` directory to your chosen static hosting provider.

### Deploying to GitHub Pages

If your repository is hosted on GitHub, GitHub Pages is a very convenient way to deploy your game:

1.  **Go to your repository on GitHub.**
2.  Click on the **Settings** tab.
3.  In the left sidebar, navigate to **Pages** (it's usually under the "Code and automation" section).
4.  Under the **Build and deployment** section, for the **Source** option, select **Deploy from a branch**.
5.  Under **Branch**:
    -   Select your main branch (commonly `main` or `master`) from the dropdown.
    -   For the folder, select **`/docs`** from the dropdown menu.
6.  Click **Save**.
7.  After a minute or two, GitHub Pages will build and deploy your site. You should see a URL (e.g., `https://<your-username>.github.io/<repository-name>/`) where your game is live. GitHub will display this URL at the top of the Pages settings once it's ready.

## Development Note
This project previously included a Python-based backend, but has since been refactored to be a purely client-side application. All game logic, including achievements and state persistence, is now handled by JavaScript running in the browser.
