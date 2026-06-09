# UrLibrary Legacy Architecture Audit

Audit date: 2026-06-09

## Existing Application

UrLibrary started as a separated React/Vite frontend and Flask backend for a digital book catalog. The application supported public catalog browsing, client-side search and category filtering, book detail pages, user registration/login, user profiles, favorites, an admin login flow, and admin CRUD for books with cover image uploads.

## Frontend Findings

- Stack: React, Vite, React Router DOM, Context API, Tailwind CSS, DaisyUI, and fetch.
- API configuration was hardcoded to `http://127.0.0.1:5000/api`.
- JWT access tokens were read from `localStorage`, which increases exposure to XSS.
- Catalog filtering and search were mostly handled on the client after fetching broad datasets.
- Route protection existed on the client, but privileged actions still required stronger server-side authorization.

## Backend Findings

- Stack: Flask, Flask-SQLAlchemy, Flask-Migrate, Flask-JWT-Extended, Flask-Bcrypt, Flask-Cors, and SQLite.
- Core models were limited to `User`, `Book`, and a favorites join table.
- The role model used a boolean `is_admin`, which does not support librarian operations.
- The book model represented title-level catalog data only and had no copy or inventory model.
- The books endpoint returned all books at once and did not support server-side search, filtering, sorting, or pagination.
- Runtime artifacts were tracked in Git, including `.env`, virtual environment files, Python bytecode, a local SQLite database, and uploaded images.

## Migration Decision

UrLibrary Nexus will use Option B: a modernized full-stack Next.js application in the repository root. This gives the portfolio a single deployment unit, typed route handlers/server actions, cookie-based credentials authentication, Prisma schema modeling, and a cleaner path toward PostgreSQL or Neon.

The original React/Vite and Flask code has been retained under `legacy/react-vite-flask/` for historical context. Runtime artifacts and local secrets are intentionally excluded from the new tracked source.

## Modernization Goals

- Replace hardcoded API configuration with environment-based application configuration.
- Replace localStorage token storage with HTTP-only session cookies managed by NextAuth.
- Add explicit `ADMIN`, `LIBRARIAN`, and `MEMBER` roles.
- Model real library operations: copies, loans, reservations, fines, notifications, audit logs, reviews, reading lists, reports, and settings.
- Move catalog search, filters, sorting, and pagination to server-side operations.
- Provide dashboard experiences for members, librarians, and admins.
- Add portfolio-quality README, API documentation, seed data, and deployment notes.
