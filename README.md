https://github.com/sonukumar/daylist-app# Daylist

Daylist ek minimal aur modern React + TypeScript task manager app hai. Isme aap tasks add kar sakte ho, priority assign kar sakte ho, due date set kar sakte ho, aur list ko `All`, `Today`, `Upcoming`, `Completed` views ke through filter kar sakte ho.

Ye app localStorage ke through browser me data save karta hai, isliye refresh ke baad bhi tasks rahega.

## Features

- Add new task with title, priority, and due date
- Search tasks by title
- Filter by view: All / Today / Upcoming / Completed
- Mark task as complete or incomplete
- Delete task
- Progress tracking and summary cards
- Responsive design for desktop and mobile
- Data persists in browser using localStorage

## Tech Stack

- React
- TypeScript
- Vite
- Lucide React
- CSS

## Project Structure

```bash
src/
  App.tsx
  main.tsx
  index.css
package.json
vite.config.ts
tsconfig.json
README.md
```

## Installation

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Then open the local URL shown in terminal, usually:

```text
http://127.0.0.1:5173/
```

## Production Build

```bash
npm run build
```

## Why this project is useful

This project is a simple example of how to build a productivity app with:

- React state management
- TypeScript types for safe data handling
- localStorage for persistence
- reusable UI logic
- responsive CSS design

## GitHub Publish / Push Guide

This project is ready to be pushed to GitHub.

1. Create a new repository on GitHub.
2. Run:

```bash
git init -b main
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

## Live Preview URL

Once deployed, the project can be accessed through the deployed URL, for example:

```text
https://github.com/<your-username>/<your-repo-name>
```

For local development, use:

```text
http://127.0.0.1:5173/
```

## License

This project is open for learning and personal use.

## Author

Built as a learning project in React + TypeScript.
