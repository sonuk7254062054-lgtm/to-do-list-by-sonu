# Daylist

Daylist is a clean and minimal task manager built with React and TypeScript. It helps you organize work in a calm, focused way by letting you add tasks, set priorities, assign due dates, filter views, and track progress.

This project stores tasks in the browser using localStorage so your list stays available even after a refresh.

## Features

- Add new tasks with title, priority, and due date
- Search tasks by name
- View tasks by:
  - All
  - Today
  - Upcoming
  - Completed
- Mark tasks as complete or incomplete
- Delete tasks
- Check overall progress percentage
- Responsive design for desktop and mobile
- Task persistence in browser storage

## Tech Stack

- React
- TypeScript
- Vite
- Lucide React Icons
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

Open the local URL shown in the terminal, usually:

```text
http://127.0.0.1:5173/
```

## Production Build

```bash
npm run build
```

## Why this project

This project is a great example of building a small but practical productivity app using:

- React state management
- TypeScript type safety
- Browser-based persistence with localStorage
- Modular UI structure
- Responsive styling

## GitHub Repository Setup

After creating your GitHub repository, run:

```bash
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git branch -M main
git push -u origin main
```

Example:

```bash
git remote add origin https://github.com/sonukumar/to-do-list-by-sonu.git
git branch -M main
git push -u origin main
```

## Local Preview

```text
http://127.0.0.1:5173/
```

## License

This project is open for learning and personal use.

## Author

Built by Sonu Kumar as a learning project in React + TypeScript.
