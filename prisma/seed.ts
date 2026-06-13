import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  auditLogs,
  authors,
  bookCopies,
  books,
  categories,
  demoPassword,
  favorites,
  fines,
  librarySettings,
  loans,
  notifications,
  publishers,
  readingLists,
  reservations,
  reviews,
  tags,
  users,
} from "../src/lib/seed-data";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash(demoPassword, 12);

  const userByEmail = new Map<string, Awaited<ReturnType<typeof prisma.user.upsert>>>();
  for (const user of users) {
    const record = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role,
        status: user.status,
      },
      create: {
        name: user.name,
        email: user.email,
        password,
        role: user.role,
        status: user.status,
      },
    });
    userByEmail.set(user.email, record);
    await prisma.libraryProfile.upsert({
      where: { memberCode: user.memberCode },
      update: {
        userId: record.id,
        phone: user.phone,
        address: user.address,
        notes: user.notes,
      },
      create: {
        userId: record.id,
        memberCode: user.memberCode,
        phone: user.phone,
        address: user.address,
        notes: user.notes,
        joinedAt: new Date("2026-06-01T00:00:00.000Z"),
      },
    });
  }

  const publisherBySlug = new Map<string, Awaited<ReturnType<typeof prisma.publisher.upsert>>>();
  for (const publisher of publishers) {
    const record = await prisma.publisher.upsert({
      where: { slug: publisher.slug },
      update: publisher,
      create: publisher,
    });
    publisherBySlug.set(publisher.slug, record);
  }

  const authorBySlug = new Map<string, Awaited<ReturnType<typeof prisma.author.upsert>>>();
  for (const author of authors) {
    const record = await prisma.author.upsert({
      where: { slug: author.slug },
      update: author,
      create: author,
    });
    authorBySlug.set(author.slug, record);
  }

  const categoryBySlug = new Map<string, Awaited<ReturnType<typeof prisma.category.upsert>>>();
  for (const category of categories) {
    const record = await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
    categoryBySlug.set(category.slug, record);
  }

  const tagBySlug = new Map<string, Awaited<ReturnType<typeof prisma.tag.upsert>>>();
  for (const tag of tags) {
    const record = await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: tag,
      create: tag,
    });
    tagBySlug.set(tag.slug, record);
  }

  const bookBySlug = new Map<string, Awaited<ReturnType<typeof prisma.book.upsert>>>();
  for (const book of books) {
    const publisher = publisherBySlug.get(book.publisherSlug);
    if (!publisher) throw new Error(`Missing publisher ${book.publisherSlug}`);
    const record = await prisma.book.upsert({
      where: { slug: book.slug },
      update: {
        title: book.title,
        isbn: book.isbn,
        description: book.description,
        coverUrl: book.coverUrl,
        publicationYear: book.publicationYear,
        language: book.language,
        pageCount: book.pageCount,
        edition: book.edition,
        locationShelf: book.locationShelf,
        isPublished: true,
        publisherId: publisher.id,
      },
      create: {
        title: book.title,
        slug: book.slug,
        isbn: book.isbn,
        description: book.description,
        coverUrl: book.coverUrl,
        publicationYear: book.publicationYear,
        language: book.language,
        pageCount: book.pageCount,
        edition: book.edition,
        locationShelf: book.locationShelf,
        isPublished: true,
        publisherId: publisher.id,
      },
    });
    bookBySlug.set(book.slug, record);

    for (const authorSlug of book.authorSlugs) {
      const author = authorBySlug.get(authorSlug);
      if (!author) throw new Error(`Missing author ${authorSlug}`);
      await prisma.bookAuthor.upsert({
        where: { bookId_authorId: { bookId: record.id, authorId: author.id } },
        update: {},
        create: { bookId: record.id, authorId: author.id },
      });
    }

    for (const categorySlug of book.categorySlugs) {
      const category = categoryBySlug.get(categorySlug);
      if (!category) throw new Error(`Missing category ${categorySlug}`);
      await prisma.bookCategory.upsert({
        where: { bookId_categoryId: { bookId: record.id, categoryId: category.id } },
        update: {},
        create: { bookId: record.id, categoryId: category.id },
      });
    }

    for (const tagSlug of book.tagSlugs) {
      const tag = tagBySlug.get(tagSlug);
      if (!tag) throw new Error(`Missing tag ${tagSlug}`);
      await prisma.bookTag.upsert({
        where: { bookId_tagId: { bookId: record.id, tagId: tag.id } },
        update: {},
        create: { bookId: record.id, tagId: tag.id },
      });
    }
  }

  const copyByCode = new Map<string, Awaited<ReturnType<typeof prisma.bookCopy.upsert>>>();
  for (const copy of bookCopies) {
    const book = bookBySlug.get(copy.bookSlug);
    if (!book) throw new Error(`Missing book ${copy.bookSlug}`);
    const record = await prisma.bookCopy.upsert({
      where: { copyCode: copy.copyCode },
      update: {
        bookId: book.id,
        barcode: copy.barcode,
        status: copy.status,
        acquisitionDate: new Date(copy.acquisitionDate),
        conditionNote: copy.conditionNote,
      },
      create: {
        bookId: book.id,
        copyCode: copy.copyCode,
        barcode: copy.barcode,
        status: copy.status,
        acquisitionDate: new Date(copy.acquisitionDate),
        conditionNote: copy.conditionNote,
      },
    });
    copyByCode.set(copy.copyCode, record);
  }

  for (const favorite of favorites) {
    const user = userByEmail.get(favorite.userEmail);
    const book = bookBySlug.get(favorite.bookSlug);
    if (!user || !book) continue;
    await prisma.favorite.upsert({
      where: { userId_bookId: { userId: user.id, bookId: book.id } },
      update: {},
      create: { userId: user.id, bookId: book.id },
    });
  }

  for (const list of readingLists) {
    const user = userByEmail.get(list.userEmail);
    if (!user) continue;
    const existing = await prisma.readingList.findFirst({
      where: { userId: user.id, title: list.title },
    });
    const record = existing
      ? await prisma.readingList.update({
          where: { id: existing.id },
          data: {
            description: list.description,
            isPublic: list.isPublic,
          },
        })
      : await prisma.readingList.create({
          data: {
            userId: user.id,
            title: list.title,
            description: list.description,
            isPublic: list.isPublic,
          },
        });

    for (const item of list.items) {
      const book = bookBySlug.get(item.bookSlug);
      if (!book) continue;
      await prisma.readingListItem.upsert({
        where: { readingListId_bookId: { readingListId: record.id, bookId: book.id } },
        update: { notes: item.notes, order: item.order },
        create: {
          readingListId: record.id,
          bookId: book.id,
          notes: item.notes,
          order: item.order,
        },
      });
    }
  }

  for (const review of reviews) {
    const user = userByEmail.get(review.userEmail);
    const book = bookBySlug.get(review.bookSlug);
    if (!user || !book) continue;
    await prisma.review.upsert({
      where: { userId_bookId: { userId: user.id, bookId: book.id } },
      update: {
        rating: review.rating,
        title: review.title,
        body: review.body,
      },
      create: {
        userId: user.id,
        bookId: book.id,
        rating: review.rating,
        title: review.title,
        body: review.body,
      },
    });
  }

  const loanByCopyCode = new Map<string, Awaited<ReturnType<typeof prisma.loan.create>>>();
  for (const loan of loans) {
    const user = userByEmail.get(loan.userEmail);
    const copy = copyByCode.get(loan.copyCode);
    const createdBy = userByEmail.get(loan.createdByEmail);
    const returnedBy = loan.returnedByEmail ? userByEmail.get(loan.returnedByEmail) : undefined;
    if (!user || !copy || !createdBy) continue;
    const existing = await prisma.loan.findFirst({
      where: {
        userId: user.id,
        bookCopyId: copy.id,
        borrowedAt: new Date(loan.borrowedAt),
      },
    });
    const record = existing
      ? await prisma.loan.update({
          where: { id: existing.id },
          data: {
            dueAt: new Date(loan.dueAt),
            returnedAt: loan.returnedAt ? new Date(loan.returnedAt) : null,
            status: loan.status,
            notes: loan.notes,
            returnedById: returnedBy?.id,
          },
        })
      : await prisma.loan.create({
          data: {
            userId: user.id,
            bookCopyId: copy.id,
            borrowedAt: new Date(loan.borrowedAt),
            dueAt: new Date(loan.dueAt),
            returnedAt: loan.returnedAt ? new Date(loan.returnedAt) : undefined,
            status: loan.status,
            notes: loan.notes,
            createdById: createdBy.id,
            returnedById: returnedBy?.id,
          },
        });
    loanByCopyCode.set(loan.copyCode, record);
  }

  for (const reservation of reservations) {
    const user = userByEmail.get(reservation.userEmail);
    const book = bookBySlug.get(reservation.bookSlug);
    if (!user || !book) continue;
    const existing = await prisma.reservation.findFirst({
      where: {
        userId: user.id,
        bookId: book.id,
        reservedAt: new Date(reservation.reservedAt),
      },
    });
    const data = {
      status: reservation.status,
      queuePosition: reservation.queuePosition,
      readyAt: reservation.readyAt ? new Date(reservation.readyAt) : null,
      expiresAt: reservation.expiresAt ? new Date(reservation.expiresAt) : null,
      fulfilledAt: reservation.fulfilledAt ? new Date(reservation.fulfilledAt) : null,
      cancelledAt: reservation.cancelledAt ? new Date(reservation.cancelledAt) : null,
      notes: reservation.notes,
    };
    if (existing) {
      await prisma.reservation.update({ where: { id: existing.id }, data });
    } else {
      await prisma.reservation.create({
        data: {
          userId: user.id,
          bookId: book.id,
          reservedAt: new Date(reservation.reservedAt),
          ...data,
        },
      });
    }
  }

  for (const fine of fines) {
    const user = userByEmail.get(fine.userEmail);
    const loan = loanByCopyCode.get(fine.copyCode);
    if (!user || !loan) continue;
    await prisma.fine.upsert({
      where: { loanId: loan.id },
      update: {
        amount: fine.amount,
        status: fine.status,
        reason: fine.reason,
      },
      create: {
        userId: user.id,
        loanId: loan.id,
        amount: fine.amount,
        status: fine.status,
        reason: fine.reason,
      },
    });
  }

  for (const notification of notifications) {
    const user = userByEmail.get(notification.userEmail);
    if (!user) continue;
    const existing = await prisma.notification.findFirst({
      where: { userId: user.id, title: notification.title },
    });
    if (existing) {
      await prisma.notification.update({
        where: { id: existing.id },
        data: {
          type: notification.type,
          message: notification.message,
        },
      });
    } else {
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
        },
      });
    }
  }

  for (const audit of auditLogs) {
    const user = userByEmail.get(audit.userEmail);
    const existing = await prisma.auditLog.findFirst({
      where: {
        userId: user?.id,
        action: audit.action,
        module: audit.module,
        description: audit.description,
      },
    });
    if (!existing) {
      await prisma.auditLog.create({
        data: {
          userId: user?.id,
          action: audit.action,
          module: audit.module,
          description: audit.description,
          metadataJson: audit.metadataJson,
        },
      });
    }
  }

  const existingSetting = await prisma.librarySetting.findFirst();
  if (existingSetting) {
    await prisma.librarySetting.update({
      where: { id: existingSetting.id },
      data: librarySettings,
    });
  } else {
    await prisma.librarySetting.create({ data: librarySettings });
  }

  console.log(`Seeded ${books.length} books, ${bookCopies.length} copies, and ${users.length} demo users.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
