# Neon Cube Dodger 3D

A fast-paced, 3D endless runner game built with [Three.js](https://threejs.org/) and [Vite](https://vitejs.dev/). Dodge neon red obstacles, survive as long as you can, and beat your high score!

![Game Preview](https://via.placeholder.com/800x400.png?text=Neon+Cube+Dodger)

## How to Play

- **Desktop:** Use the **Left/Right Arrow Keys** or **A/D** keys to move left and right.
- **Mobile/Touch:** Tap the **left or right side of your screen** to steer.

## Running in GitHub Codespaces

This project is fully ready to be executed in a GitHub Codespace. Follow these step-by-step instructions:

1. **Open the Repository in Codespaces:**
   - Go to your repository on GitHub.
   - Click the green **`<> Code`** button.
   - Switch to the **Codespaces** tab.
   - Click **Create codespace on main**.
   - Wait a few moments for the cloud environment to initialize.

2. **Install Dependencies:**
   - Once the Codespace editor loads, open the integrated terminal (you can press `` Ctrl + ` `` or go to the top menu: `Terminal -> New Terminal`).
   - Run the following command:
     ```bash
     npm install
     ```

3. **Start the Development Server:**
   - In the same terminal, run:
     ```bash
     npm run dev
     ```
   - Vite will start a local server, usually on port `5173`.

4. **Play the Game:**
   - Codespaces will automatically detect the running port and show a pop-up saying **"Open in Browser"**.
   - Click **Open in Browser** (or click the local URL like `http://localhost:5173` in the terminal and follow the prompt).
   - The game will open in a new browser tab. Click **PLAY NOW** and enjoy!

## Technologies Used
- HTML5 Canvas & WebGL
- [Vanilla JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Three.js](https://threejs.org/) (for 3D rendering)
- [Vite](https://vitejs.dev/) (for fast bundling and development)

## Uploading to GitHub
If you haven't already, you can push this entire folder to your GitHub account to share with the world or host it via GitHub Pages.

1. `git init`
2. `git add .`
3. `git commit -m "Initial commit of Neon Cube Dodger"`
4. `git branch -M main`
5. `git remote add origin <your-repo-url>`
6. `git push -u origin main`
