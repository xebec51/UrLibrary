# UrLibrary Nexus Business Rules

## Borrowing

- Loans are created against `BookCopy`, not only `Book`.
- A member must be `ACTIVE`.
- A copy must be `AVAILABLE`.
- Active loans cannot exceed `LibrarySetting.maxActiveLoans`.
- Unpaid fines cannot exceed `LibrarySetting.fineLimit`.
- Due dates use `LibrarySetting.loanDurationDays`.
- Successful borrowing changes the copy to `BORROWED`, creates a notification, and writes an audit log.

## Returns

- Returning a loan sets `Loan.status` to `RETURNED`.
- Late days are calculated from `dueAt` to `returnedAt`.
- Late returns create an `UNPAID` fine using `LibrarySetting.dailyFineAmount`.
- If the title has a pending reservation, the returned copy becomes `RESERVED` and the first reservation becomes `READY_FOR_PICKUP`.
- Return processing writes notifications and audit logs.

## Reservations

- Reservations are created at title level and use FIFO queue positions.
- Members can cancel their own pending reservations.
- Staff can mark the first pending reservation as `READY_FOR_PICKUP` when a copy is available.
- Ready reservations receive an expiry timestamp based on `LibrarySetting.reservationExpiryDays`.
- Cancelled reservations trigger queue resequencing for remaining pending holds.

## Fines

- Overdue returns generate `UNPAID` fines.
- Members can view only their own fines.
- Librarians and admins can mark fines as paid.
- Only admins can waive fines.
- Fine payments and waivers are written to the audit log.
