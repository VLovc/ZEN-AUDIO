# ZEN AUDIO

A modern React application built with Vite.

## System Requirements

Before you can clone and run this project on another machine, you only need to install two main tools:

1. **[Node.js](https://nodejs.org/en/download/)** (version 18 or higher recommended) 
   - This is the environment that allows you to run the application. It comes with `npm` (Node Package Manager), which is the tool that will automatically download all your libraries.
2. **[Git](https://git-scm.com/downloads)**
   - Required to clone your repository from GitHub.

*Note: The **`package.json`** file in this repository acts as your "requirements page". It contains the list of all libraries (React, Tailwind, Framer Motion, etc.) your project needs. You do not need to download them manually one by one!*

---

## 🚀 Getting Started on a New Machine

Follow these exact steps to set up the project on any new computer:

### 1. Clone the Repository
Open your terminal (or Command Prompt / PowerShell) and run:
```bash
git clone https://github.com/VLovc/App-music.git
```

Navigate into the project directory:
```bash
cd App-music/ZENAUDIO
```

### 2. Install All Required Libraries
Now, tell `npm` to read the `package.json` file and automatically download every tool you used. Run:
```bash
npm install
```
*(This might take a minute or two. It creates a `node_modules` folder containing all the libraries).*

### 3. Start the Application
Once everything is downloaded, run the application locally:
```bash
npm run dev
```

Your terminal will show a local web address (usually `http://localhost:5173`). Ctrl+Click that link or open it in your web browser to use the app!

---

## 📦 Main Technologies Used
This project automatically installs the following via `npm install`:
- **React 19**
- **Vite** (Build tool)
- **Tailwind CSS v4** (Styling)
- **Framer Motion & GSAP** (Animations)
- **React Router** (Navigation)
- **Axios** (API Requests)
