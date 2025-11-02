# AI Aptitude - Aptitude Practice Quiz App

A full-stack web application for practicing aptitude questions across multiple categories. Built with React, TypeScript, Tailwind CSS, and Express.js.

## Features

- **4 Quiz Categories**: Quantitative Aptitude, Logical Reasoning, Verbal Ability, and Technical
- **Timed Questions**: 60-second countdown timer for each question
- **Instant Feedback**: Immediate visual feedback with explanations
- **Difficulty Levels**: Questions categorized as Easy, Medium, or Hard
- **Progress Tracking**: See your score and accuracy at the end
- **Clean UI**: LearnTheta-inspired design with smooth transitions

## Project Structure

```
/client                     # Frontend (React + Vite + TypeScript)
  /src
    /components            # Reusable UI components
    /pages                # Page components (Home, Quiz)
    /lib                  # Utilities and query client
    App.tsx               # Main app component
    main.tsx              # Entry point
    index.css             # Global styles
/server                    # Backend (Express.js)
  /data
    questions.json        # Question database (easily editable!)
  routes.ts               # API routes
  index.ts               # Server entry point
/shared                    # Shared types between frontend and backend
  schema.ts               # TypeScript types and Zod schemas
```

## Getting Started

### Prerequisites

- Node.js 20+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd ai-aptitude
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5000`

## Adding More Questions

To add more questions without coding, simply edit the `server/data/questions.json` file.

Each question follows this format:

```json
{
  "id": 1,
  "category": "quant",
  "difficulty": "easy",
  "question": "What is 25% of 160?",
  "options": ["30", "35", "40", "45"],
  "answer": "40",
  "explanation": "25% = 1/4, so 160/4 = 40"
}
```

**Categories:**
- `"quant"` - Quantitative Aptitude
- `"logical"` - Logical Reasoning
- `"verbal"` - Verbal Ability
- `"technical"` - Technical

**Difficulty Levels:**
- `"easy"`
- `"medium"`
- `"hard"`

## GitHub Setup

### Files to Push to GitHub

Push these files and folders:

```
/client (entire folder)
/server (entire folder)
/shared (entire folder)
package.json
package-lock.json
tsconfig.json
tailwind.config.ts
vite.config.ts
.gitignore
README.md
```

### Files NOT to Push

Do NOT push these (already in .gitignore):

```
node_modules/          # Dependencies (install with npm install)
dist/                  # Build output
build/                 # Build output
.env                   # Environment variables
.env.local
*.log                  # Log files
/tmp/                  # Temporary files
```

## Environment Variables

This application doesn't require any environment variables for basic usage since the frontend and backend run on the same server.

If you need to configure the backend URL separately in the future, you can set:

```bash
VITE_BACKEND_URL=http://localhost:5000
```

However, this is **not needed** for the default setup.

## API Endpoints

- `GET /api/questions/:category` - Get shuffled questions for a category
  - Returns an array of questions with random order
  - Categories: `quant`, `logical`, `verbal`, `technical`

## Tech Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- TanStack Query (React Query)
- Wouter (routing)
- Lucide React (icons)
- shadcn/ui components

**Backend:**
- Node.js
- Express.js
- TypeScript

## License

MIT
