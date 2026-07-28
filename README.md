# Bloom 🌸

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
[![Zustand](https://img.shields.io/badge/State-Zustand-orange)](https://github.com/pmndrs/zustand)

A high-performance, interactive web application for spatial note-taking, task management, and document organization. Built with React 19, Vite, Tailwind CSS, and Zustand, Bloom delivers flexible spatial canvas layouts, full Unicode dataset searching, custom theme token injection, and hardware-accelerated animations.

## Key Technical Specifications

### 1. Spatial Board & Grid Rendering Engine
* **Dual Rendering Modes:** Supports dynamic responsive grid layouts (`Grid` view) and freeform absolute spatial placement (`Board` view) with interactive bounds constraints.
* **Layout Reflow & Animation:** Powered by Framer Motion layout animations (`AnimatePresence`) for 60fps card reordering, filter reflows, and spring physics.
* **GPU Hardware Acceleration:** Hardware compositing enabled via CSS `will-change: transform` and `transform-gpu` directives, isolating card motion to dedicated GPU layers and eliminating DOM layout recalculation overhead.

### 2. State Management & Hydration Architecture
* **Atomic State Store (`useSlateStore.js`):** Centralized state management utilizing Zustand for state management of notes, checklists, folders, tags, theme tokens, and focus journal records.
* **Persistence Layer:** Automated synchronization via Zustand `persist` middleware targeting `localStorage` with defensive fallbacks against schema corruption or uninitialized entries.

### 3. Portal-Anchored Emoji Picker & Dataset Lookup
* **React Portal Architecture (`EmojiPickerPopover.jsx`):** Renders floating popovers at the root `document.body` level via `createPortal`, isolating picker overlays from parent container scroll boundaries and overflow clipping. Dynamic positioning calculated via `getBoundingClientRect()`.
* **Full Unicode Dataset (`@emoji-mart/data`):** Sourced from official Unicode emoji datasets. Implements instant client-side search indexing across display names, primary IDs, and keyword/alias arrays.

### 4. Interactive Canvas Layer & Image Processing
* **HTML5 Canvas Particle Loop (`ClickSpark.jsx`, `ConfettiPortal.jsx`):** Custom 2D canvas rendering loops utilizing `requestAnimationFrame`. Features explicit lifecycle teardown hooks (`cancelAnimationFrame`, `clearRect`) for memory management and frame stabilization.
* **Client-Side Image Synthesis (`html2canvas`):** Dynamic off-screen DOM clone transformation and canvas rasterization, exporting notes as high-resolution PNG image artifacts.

## Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19 (`^19.2.4`) |
| **Build Tooling & HMR** | Vite (`^7.3.1`) |
| **Styling System** | Tailwind CSS (`^3.4.17`), Vanilla CSS Variables |
| **State Management** | Zustand (`^5.0.3`) |
| **Animation Engine** | Framer Motion (`^12.4.7`) |
| **Emoji Dataset** | `@emoji-mart/data` (`^1.1.2`), `emoji-picker-react` |
| **Canvas Utility** | `html2canvas` (`^1.4.1`), Lucide React (`^0.475.0`) |

## Project Structure

```text
Bloom/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── AppLayout.jsx        # Root application layout wrapper
│   │   │   │   ├── MainCanvas.jsx       # Grid and board canvas renderer
│   │   │   │   ├── Sidebar.jsx          # Folder and tag navigation sidebar
│   │   │   │   ├── JournalPanel.jsx     # Focus journal panel component
│   │   │   │   └── ThemeSwitcher.jsx    # Aesthetic theme configuration selector
│   │   │   ├── notes/
│   │   │   │   └── NoteCard.jsx         # Card component for text & checklist notes
│   │   │   └── ui/
│   │   │       ├── ClickSpark.jsx       # Canvas particle sparkle & drag trail
│   │   │       ├── ConfettiPortal.jsx   # Canvas celebration explosion
│   │   │       ├── CustomEmojiPicker.jsx# Dataset search & category grid
│   │   │       ├── EmojiPickerPopover.jsx# React Portal anchor popover
│   │   │       └── Doodles.jsx          # UI vector overlays & checkbox component
│   │   ├── store/
│   │   │   └── useSlateStore.js         # Zustand global state store & persistence
│   │   ├── utils/
│   │   │   └── theme-config.js          # Theme design tokens & CSS property injector
│   │   ├── App.jsx                      # Root React entry component
│   │   └── index.css                    # Base Tailwind rules & custom directives
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Setup & Local Development

### Prerequisites
* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Bhoomikaxoxo/bloom.git
   cd bloom
   ```

2. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Start local development server:**
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

4. **Build for production:**
   ```bash
   npm run build
   ```
   Production build artifacts are emitted to `frontend/dist/`.
