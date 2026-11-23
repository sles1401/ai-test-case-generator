# AI Test Case Generator

A modern, responsive web application tailored for QA Engineers to transform user stories, requirements, and acceptance criteria into structured test cases or BDD Gherkin scenarios.

## Features

- **Split-Screen QA Workspace**: Collapsible left sidebar for saved history and a central dashboard for test generation.
- **Smart Requirement Input**: Multi-line requirements textarea with quick-fill sample prompts, character counter, `Ctrl+Enter` / `Cmd+Enter` shortcut, and a **Clear Input** action.
- **Configurable Test Generation**:
  - **Testing Types**: `All Types`, `Positive`, `Negative`, `Boundary`, and `Security`.
  - **Output Formats**: `Standard Table` (with `ID`, `Scenario Title`, `Type`, `Pre-conditions`, `Test Steps`, and `Expected Result`) and `BDD Gherkin Syntax` (syntax-highlighted `Given-When-Then` blocks).
- **Interactive Loading State**: Animated progress bar with contextual status updates and skeleton loaders.
- **Keyword Filtering & Exports**:
  - Real-time keyword search bar across generated test cases.
  - **Copy to Clipboard** (with `"Copied!"` confirmation), **Export to CSV**, **Export to Excel** (`.xlsx` via SheetJS), and **Download Markdown** (`.md`).
- **Local History Management**: Automatically persists generated sessions in `localStorage` with requirement snippets and timestamps; click any entry to restore it, or use **Clear History** to reset.
- **Domain-Aware Client-Side Simulation**: Detects requirement context (Authentication/Login, E-Commerce/Checkout, Search/Filter, File Upload, API, or generic workflows) to generate tailored QA scenarios out of the box before backend API integration.

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Excel Export**: SheetJS (`xlsx`)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation & Running Locally

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

### Production Build

```bash
# Type-check and build for production
npm run build

# Preview the production build locally
npm run preview
```

## Project Structure

```text
src/
├── components/
│   ├── InputSection.tsx      # Requirements input, presets, type/format selectors
│   ├── LoadingState.tsx      # Progress bar, contextual messages, skeleton loader
│   ├── ResultsSection.tsx    # Table & Gherkin views, search filter, export actions
│   └── Sidebar.tsx           # Collapsible history sidebar & mobile drawer
├── types/
│   └── testCase.ts           # TypeScript types for test cases and sessions
├── utils/
│   ├── exporters.ts          # Clipboard, CSV, Excel (.xlsx), and Markdown exports
│   └── testCaseGenerator.ts  # Domain-aware client-side test case generator
├── App.tsx                   # Main split-screen layout & localStorage persistence
├── index.css                 # Tailwind CSS configuration and base styles
└── main.tsx                  # Application entry point
```
