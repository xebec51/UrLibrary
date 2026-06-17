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
