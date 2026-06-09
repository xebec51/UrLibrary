# UrLibrary Legacy React/Vite + Flask Application

This folder preserves the original UrLibrary implementation for historical context while the root of the repository becomes UrLibrary Nexus.

## Preserved Source

- `frontend/`: React/Vite single-page application with Tailwind CSS, DaisyUI, React Router, Context API, and fetch-based API calls.
- `backend/`: Flask API source, SQLAlchemy models, Flask-Migrate migration files, JWT auth routes, favorites routes, and book CRUD routes.

## Intentionally Removed Runtime Artifacts

The modernization removed local runtime artifacts from tracked source:

- `.env`
- Python virtual environment files
- Python bytecode cache folders
- local SQLite database files
- local uploaded cover images

These artifacts should be recreated locally from documented setup steps and must not be committed.
