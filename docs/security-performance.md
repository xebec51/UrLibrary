# Security and Performance Notes

## Security

- Authentication uses NextAuth credentials with signed HTTP-only cookies instead of `localStorage` tokens.
- Passwords in Prisma seed data are hashed with `bcryptjs`.
- Middleware protects all `/dashboard` routes and redirects inactive or suspended users to `/unauthorized`.
- Server actions call `requireRole` before mutating catalog, circulation, reservation, fine, user, or settings data.
- Members can only use member-scoped pages and cannot access librarian or admin routes.
- Librarians can access operational routes but not admin settings or user role management.
- Admin-only actions include user role/status changes, system settings, audit log access, and fine waiver.
- Report export checks the active session role on the server before generating XLSX output.
- Runtime secrets are excluded from Git; `.env.example` documents required variables without real secrets.
- Security headers are configured in `next.config.ts`.

## Performance

- Catalog query helpers support server-shaped search, filters, sorting, page size limits, and pagination.
- Public catalog cards render paginated slices instead of the entire seed dataset.
- Heavy XLSX code is loaded with dynamic import only inside the export route.
- Dashboard tables use prepared summary helpers to keep page components focused and avoid repeated aggregation logic.
- Prisma schema includes indexes for role/status, catalog publication state, copy status, loan status/due dates, reservation queues, fines, notifications, and audit logs.
