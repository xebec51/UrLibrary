# UrLibrary Nexus

UrLibrary Nexus is a modern digital library management platform for catalog discovery, member engagement, copy inventory, borrowing, returns, reservations, fines, reports, exports, and role-based administration.

The project preserves the original UrLibrary identity while modernizing the architecture into a single full-stack Next.js application suitable for a portfolio review.

## Live Demo

Deployment URL: not deployed yet. The application is ready to deploy after configuring production environment variables and a PostgreSQL database.

## Original Context

UrLibrary started as a separated React/Vite frontend and Flask backend for a digital book catalog. The original app included public catalog browsing, book detail pages, register/login, profiles, favorites, admin login, and admin book CRUD.

The legacy source is retained in `legacy/react-vite-flask/`. Runtime artifacts such as `.env`, Python bytecode, virtual environments, local SQLite databases, and uploaded local files were intentionally removed from tracked source.

## Modernization Summary

- Migrated the root app to Next.js App Router, React, TypeScript, Tailwind CSS, Prisma, and NextAuth.
- Added `ADMIN`, `LIBRARIAN`, and `MEMBER` roles.
- Replaced localStorage token usage with signed HTTP-only sessions.
- Added copy-level inventory, loans, returns, reservations, fines, notifications, reviews, reading lists, audit logs, reports, and XLSX export.
- Added server-side route protection, role guards, business rule helpers, seed data, API documentation, and deployment notes.

## Features

- Public landing page, catalog, authors, categories, book detail pages, login, register, unauthorized, and about pages.
- Server-shaped catalog search, category/tag filtering, availability filtering, sorting, and pagination.
- Member workspace for favorites, reading lists, loans, reservations, fines, notifications, profile, reviews, and developer page.
- Librarian workspace for books, copies, loans, returns, reservations, members, and operational reports.
- Admin workspace for users, catalog, authors, publishers, categories, tags, settings, audit logs, and reports.
- Borrowing and return workflow with eligibility checks, due dates, copy status updates, notifications, fines, and audit logs.
- FIFO reservation queue with ready-for-pickup, expiry, cancellation, and queue resequencing helpers.
- Fine payment and waiver actions with role restrictions.
- XLSX export route with dynamic `xlsx` import.

## Role Matrix

| Capability | Guest | Member | Librarian | Admin |
| --- | --- | --- | --- | --- |
| Browse public catalog | Yes | Yes | Yes | Yes |
| Manage own favorites, reading lists, reservations, reviews | No | Yes | Yes | Yes |
| View own loans, fines, notifications | No | Yes | Yes | Yes |
| Manage catalog and copies | No | No | Yes | Yes |
| Issue loans and returns | No | No | Yes | Yes |
| Manage reservations | No | No | Yes | Yes |
| View member directory | No | No | Yes | Yes |
| Manage users, roles, settings, audit logs | No | No | No | Yes |
| Waive fines | No | No | No | Yes |

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL or Neon
- NextAuth credentials auth
- bcryptjs
- Zod
- React Hook Form dependency ready
- Recharts
- date-fns
- xlsx
- lucide-react

## Architecture

- `app/`: Next.js routes, server pages, route handlers, and server actions.
- `src/components/`: reusable UI, layout, catalog, and report components.
- `src/lib/`: domain helpers for auth, RBAC, catalog, circulation, reservations, fines, reports, and seed-backed demo data.
- `prisma/`: Prisma schema, migration SQL, and seed script.
- `docs/`: timeline, audit, business rules, security/performance, and API notes.
- `legacy/react-vite-flask/`: preserved original React/Vite and Flask implementation.

## Database Summary

The Prisma schema implements:

`User`, `LibraryProfile`, `Book`, `BookCopy`, `Author`, `Publisher`, `Category`, `Tag`, `BookAuthor`, `BookCategory`, `BookTag`, `Favorite`, `ReadingList`, `ReadingListItem`, `Review`, `Loan`, `Reservation`, `Fine`, `Notification`, `AuditLog`, and `LibrarySetting`.

Enums include roles, statuses, copy states, loan states, reservation states, fine states, notification types, and audit actions.

## Business Flows

Borrowing is copy-level. Staff selects a member and an available copy; the server checks account status, active loan limits, unpaid fine limits, and copy status. The system creates a loan, calculates the due date, marks the copy as borrowed, creates a notification, and writes an audit log.

Returns update the loan to returned, calculate late days, create a fine when overdue, update copy availability, promote the first pending reservation when applicable, create notifications, and write an audit log.

Reservations use FIFO queue positions. Members can reserve titles and cancel pending reservations. Staff can mark the first pending reservation as ready for pickup, fulfill pickup, cancel holds, and expire old ready reservations.

Fines are generated from late returns. Members can view their own fines. Librarians and admins can mark fines as paid; only admins can waive fines.

## Demo Accounts

All demo accounts use the password `Password123!`.

| Email | Role |
| --- | --- |
| `admin@urlibrary.demo` | ADMIN |
| `librarian@urlibrary.demo` | LIBRARIAN |
| `member@urlibrary.demo` | MEMBER |
| `member2@urlibrary.demo` | MEMBER |

## Setup

```bash
npm install
copy .env.example .env
npx prisma validate
npx prisma generate
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL or Neon connection string. |
| `AUTH_SECRET` | Local or production NextAuth signing secret generated outside the repo. |
| `AUTH_URL` | App URL for auth callbacks. |
| `NEXT_PUBLIC_APP_URL` | Public app URL used by docs and deployment notes. |

Do not commit `.env`.

## Validation Commands

```bash
npx prisma validate
npx prisma generate
npm run lint
npm run build
```

## Deployment Notes

- Configure PostgreSQL or Neon and set `DATABASE_URL`.
- Generate `AUTH_SECRET` outside the repository.
- Run Prisma migration and seed commands in the deployment environment.
- Set `AUTH_URL` and `NEXT_PUBLIC_APP_URL` to the deployed URL.
- No live deployment URL is claimed in this README.

## Security Notes

- Dashboard routes are protected by middleware.
- Server actions enforce role checks with `requireRole`.
- Export routes check active authenticated staff/admin sessions.
- Sensitive member data is not exposed by public catalog routes.
- The old tracked `.env` from the legacy app was removed from source control.

## Known Limitations

- No real institutional SSO.
- No hardware barcode scanner integration.
- No payment gateway for fines.
- No multi-branch library mode.
- No offline kiosk mode.
- No production email provider.
- No full MARC21 import pipeline.

## Future Improvements

- Add automated Playwright smoke tests.
- Add real hosted PostgreSQL integration in CI.
- Add email reminders and scheduled reservation expiry jobs.
- Add barcode scanner hardware integration.
- Add richer review moderation workflows.
- Add MARC21 import and bibliographic enrichment.

## Original Contributors

- Muh. Rinaldi Ruslan
- Muh. Alif Anugerah Putra
- Dhian Alifka Azzahra
- Muhammad Rifky Kurniawan

## Developer Contact

Muh. Rinaldi Ruslan  
Email: rinaldi.ruslan51@gmail.com  
LinkedIn: https://www.linkedin.com/in/rinaldiruslan  
GitHub: https://github.com/xebec51
