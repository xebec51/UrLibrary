# UrLibrary Nexus API and Server Actions

## Auth

- `GET/POST /api/auth/[...nextauth]`: NextAuth credentials auth.
- `registerMember`: server action for member registration with bcryptjs hashing.
- `requireActiveUser`: server helper for authenticated active users.
- `requireRole`: server helper for RBAC.

## Catalog

- `getCatalogBooks`: server-shaped helper for search, filters, sorting, and pagination.
- `getCatalogBook`: book detail helper with availability, authors, categories, tags, reviews, favorites, and reservations.

## Member

- `toggleFavoriteAction`
- `createReadingListAction`
- `reserveBookAction`
- `cancelReservationAction`
- `upsertReviewAction`

All member actions require an active authenticated user.

## Circulation

- `issueLoanAction`: admin/librarian action for copy-level loan creation.
- `returnLoanAction`: admin/librarian action for returns, overdue fine creation, copy status updates, reservation promotion, notifications, and audit logs.

## Reservations

- `createReservationForMemberAction`
- `markReservationReadyAction`
- `fulfillReservationAction`
- `cancelReservationByStaffAction`
- `expireReservationsAction`

Reservation helpers enforce FIFO queue behavior.

## Fines

- `payFineAction`: admin/librarian action.
- `waiveFineAction`: admin-only action.

## Reports

- `GET /api/reports/export`: admin/librarian XLSX export. The route dynamically imports `xlsx` only when called.

## Admin

- `updateUserAccessAction`: admin-only role/status update.
- `updateLibrarySettingsAction`: admin-only circulation setting update.
