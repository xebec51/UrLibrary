export type Role = "ADMIN" | "LIBRARIAN" | "MEMBER";
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type CopyStatus = "AVAILABLE" | "BORROWED" | "RESERVED" | "MAINTENANCE" | "LOST";
export type LoanStatus = "ACTIVE" | "RETURNED" | "OVERDUE" | "LOST";
export type ReservationStatus =
  | "PENDING"
  | "READY_FOR_PICKUP"
  | "FULFILLED"
  | "CANCELLED"
  | "EXPIRED";
export type FineStatus = "UNPAID" | "PAID" | "WAIVED";
export type NotificationType =
  | "DUE_SOON"
  | "OVERDUE"
  | "RESERVATION_READY"
  | "FINE_CREATED"
  | "SYSTEM";
export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "LOGIN"
  | "BORROW"
  | "RETURN"
  | "RESERVE"
  | "CANCEL_RESERVATION"
  | "MARK_READY"
  | "PAY_FINE"
  | "WAIVE_FINE"
  | "EXPORT";

type ReservationSeed = {
  userEmail: string;
  bookSlug: string;
  status: ReservationStatus;
  queuePosition: number;
  reservedAt: string;
  readyAt?: string;
  expiresAt?: string;
  fulfilledAt?: string;
  cancelledAt?: string;
  notes?: string;
};

export const demoPassword = "Password123!";

export const users = [
  {
    name: "Muh. Rinaldi Ruslan",
    email: "admin@urlibrary.demo",
    role: "ADMIN" as Role,
    status: "ACTIVE" as UserStatus,
    memberCode: "STAFF-0001",
    phone: "+62 812 0000 5101",
    address: "Makassar, Indonesia",
    notes: "System owner and portfolio maintainer.",
  },
  {
    name: "Nexus Librarian",
    email: "librarian@urlibrary.demo",
    role: "LIBRARIAN" as Role,
    status: "ACTIVE" as UserStatus,
    memberCode: "STAFF-0002",
    phone: "+62 812 0000 5102",
    address: "Central Library Service Desk",
    notes: "Operational librarian account for circulation flows.",
  },
  {
    name: "Dewi Aksara",
    email: "member@urlibrary.demo",
    role: "MEMBER" as Role,
    status: "ACTIVE" as UserStatus,
    memberCode: "MBR-2026-0001",
    phone: "+62 812 0000 5103",
    address: "Jl. Perintis Kemerdekaan, Makassar",
    notes: "Active member with reservations, favorites, and reading lists.",
  },
  {
    name: "Arman Halim",
    email: "member2@urlibrary.demo",
    role: "MEMBER" as Role,
    status: "ACTIVE" as UserStatus,
    memberCode: "MBR-2026-0002",
    phone: "+62 812 0000 5104",
    address: "Jl. Veteran Selatan, Makassar",
    notes: "Member with overdue sample data.",
  },
];

export const publishers = [
  { name: "Gramedia Pustaka Utama", slug: "gramedia-pustaka-utama", website: "https://gpu.id" },
  { name: "Bentang Pustaka", slug: "bentang-pustaka", website: "https://bentangpustaka.com" },
  { name: "O'Reilly Media", slug: "oreilly-media", website: "https://www.oreilly.com" },
  { name: "Addison-Wesley", slug: "addison-wesley", website: "https://www.pearson.com" },
  { name: "Penguin Random House", slug: "penguin-random-house", website: "https://www.penguinrandomhouse.com" },
  { name: "HarperCollins", slug: "harpercollins", website: "https://www.harpercollins.com" },
  { name: "Mizan", slug: "mizan", website: "https://mizanstore.com" },
  { name: "Simon and Schuster", slug: "simon-and-schuster", website: "https://www.simonandschuster.com" },
];

export const authors = [
  { name: "Andrea Hirata", slug: "andrea-hirata", bio: "Indonesian novelist known for literary stories about education and community." },
  { name: "Leila S. Chudori", slug: "leila-s-chudori", bio: "Indonesian author and journalist." },
  { name: "Pramoedya Ananta Toer", slug: "pramoedya-ananta-toer", bio: "Indonesian literary figure and author of the Buru Quartet." },
  { name: "Tere Liye", slug: "tere-liye", bio: "Popular Indonesian novelist." },
  { name: "James Clear", slug: "james-clear", bio: "Author focused on habits, behavior, and decision-making." },
  { name: "Robert C. Martin", slug: "robert-c-martin", bio: "Software engineer and author known for Clean Code." },
  { name: "Andrew Hunt", slug: "andrew-hunt", bio: "Software developer and co-author of The Pragmatic Programmer." },
  { name: "David Thomas", slug: "david-thomas", bio: "Software developer and co-author of The Pragmatic Programmer." },
  { name: "Yuval Noah Harari", slug: "yuval-noah-harari", bio: "Historian and author of Sapiens." },
  { name: "Walter Isaacson", slug: "walter-isaacson", bio: "Biographer and historian." },
  { name: "Cal Newport", slug: "cal-newport", bio: "Computer science professor and productivity writer." },
  { name: "Daniel Kahneman", slug: "daniel-kahneman", bio: "Psychologist and Nobel laureate." },
  { name: "Harper Lee", slug: "harper-lee", bio: "American novelist." },
  { name: "Paulo Coelho", slug: "paulo-coelho", bio: "Brazilian novelist." },
  { name: "A. Fuadi", slug: "a-fuadi", bio: "Indonesian author known for Negeri 5 Menara." },
  { name: "Henry Manampiring", slug: "henry-manampiring", bio: "Indonesian author of Filosofi Teras." },
];

export const categories = [
  { name: "Technology", slug: "technology", description: "Software engineering, systems, and digital products." },
  { name: "Science", slug: "science", description: "Natural science, social science, and research." },
  { name: "History", slug: "history", description: "World history and Indonesian historical context." },
  { name: "Biography", slug: "biography", description: "Life stories of public figures and innovators." },
  { name: "Fiction", slug: "fiction", description: "Novels and narrative literature." },
  { name: "Self Development", slug: "self-development", description: "Habits, focus, and personal growth." },
  { name: "Business", slug: "business", description: "Management, operations, and strategy." },
  { name: "Education", slug: "education", description: "Learning, pedagogy, and academic culture." },
  { name: "Philosophy", slug: "philosophy", description: "Ethics, stoicism, and reflective thought." },
  { name: "Literature", slug: "literature", description: "Classic and contemporary literary works." },
];

export const tags = [
  { name: "Indonesian", slug: "indonesian" },
  { name: "International", slug: "international" },
  { name: "Programming", slug: "programming" },
  { name: "Operations", slug: "operations" },
  { name: "Leadership", slug: "leadership" },
  { name: "Research", slug: "research" },
  { name: "Popular Science", slug: "popular-science" },
  { name: "Classic", slug: "classic" },
  { name: "Productivity", slug: "productivity" },
  { name: "Career", slug: "career" },
  { name: "Novel", slug: "novel" },
  { name: "Reference", slug: "reference" },
];

export const books = [
  {
    title: "Laskar Pelangi",
    slug: "laskar-pelangi",
    isbn: "9789793062792",
    description: "A beloved Indonesian novel about education, friendship, and resilience in Belitung.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9789793062792-L.jpg",
    publicationYear: 2005,
    language: "Indonesian",
    pageCount: 534,
    edition: "Indonesian edition",
    locationShelf: "ID-FIC-A1",
    publisherSlug: "bentang-pustaka",
    authorSlugs: ["andrea-hirata"],
    categorySlugs: ["Fiction", "Education"].map((name) => name.toLowerCase().replaceAll(" ", "-")),
    tagSlugs: ["indonesian", "novel"],
    copyStatuses: ["AVAILABLE", "BORROWED", "AVAILABLE"] as CopyStatus[],
  },
  {
    title: "Laut Bercerita",
    slug: "laut-bercerita",
    isbn: "9786024246945",
    description: "A literary account of memory, activism, and loss during a turbulent political period.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9786024246945-L.jpg",
    publicationYear: 2017,
    language: "Indonesian",
    pageCount: 379,
    edition: "First edition",
    locationShelf: "ID-LIT-B2",
    publisherSlug: "gramedia-pustaka-utama",
    authorSlugs: ["leila-s-chudori"],
    categorySlugs: ["history", "literature"],
    tagSlugs: ["indonesian", "novel"],
    copyStatuses: ["BORROWED", "RESERVED"] as CopyStatus[],
  },
  {
    title: "Bumi Manusia",
    slug: "bumi-manusia",
    isbn: "9780140256352",
    description: "A landmark Indonesian literary work exploring colonial society and identity.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780140256352-L.jpg",
    publicationYear: 1980,
    language: "Indonesian",
    pageCount: 535,
    edition: "Buru Quartet",
    locationShelf: "ID-LIT-B3",
    publisherSlug: "penguin-random-house",
    authorSlugs: ["pramoedya-ananta-toer"],
    categorySlugs: ["history", "literature"],
    tagSlugs: ["indonesian", "classic"],
    copyStatuses: ["AVAILABLE", "AVAILABLE"] as CopyStatus[],
  },
  {
    title: "Pulang",
    slug: "pulang",
    isbn: "9786020822129",
    description: "A sweeping Indonesian novel about home, conflict, and family memory.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9786020822129-L.jpg",
    publicationYear: 2015,
    language: "Indonesian",
    pageCount: 400,
    edition: "Standard edition",
    locationShelf: "ID-FIC-C1",
    publisherSlug: "gramedia-pustaka-utama",
    authorSlugs: ["tere-liye"],
    categorySlugs: ["fiction", "literature"],
    tagSlugs: ["indonesian", "novel"],
    copyStatuses: ["AVAILABLE", "MAINTENANCE"] as CopyStatus[],
  },
  {
    title: "Negeri 5 Menara",
    slug: "negeri-5-menara",
    isbn: "9789792248616",
    description: "A coming-of-age story about learning, discipline, and ambition.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9789792248616-L.jpg",
    publicationYear: 2009,
    language: "Indonesian",
    pageCount: 423,
    edition: "Standard edition",
    locationShelf: "ID-EDU-D1",
    publisherSlug: "gramedia-pustaka-utama",
    authorSlugs: ["a-fuadi"],
    categorySlugs: ["education", "fiction"],
    tagSlugs: ["indonesian", "novel"],
    copyStatuses: ["AVAILABLE", "BORROWED"] as CopyStatus[],
  },
  {
    title: "Filosofi Teras",
    slug: "filosofi-teras",
    isbn: "9786233463034",
    description: "An accessible Indonesian introduction to stoicism for everyday decisions.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9786233463034-L.jpg",
    publicationYear: 2018,
    language: "Indonesian",
    pageCount: 320,
    edition: "Revised edition",
    locationShelf: "ID-PHI-E2",
    publisherSlug: "gramedia-pustaka-utama",
    authorSlugs: ["henry-manampiring"],
    categorySlugs: ["philosophy", "self-development"],
    tagSlugs: ["indonesian", "productivity"],
    copyStatuses: ["AVAILABLE", "AVAILABLE"] as CopyStatus[],
  },
  {
    title: "Atomic Habits",
    slug: "atomic-habits",
    isbn: "9780735211292",
    description: "A practical guide to building better habits through tiny behavior changes.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg",
    publicationYear: 2018,
    language: "English",
    pageCount: 320,
    edition: "Hardcover",
    locationShelf: "EN-SEL-A1",
    publisherSlug: "penguin-random-house",
    authorSlugs: ["james-clear"],
    categorySlugs: ["self-development"],
    tagSlugs: ["international", "productivity"],
    copyStatuses: ["BORROWED", "AVAILABLE", "AVAILABLE"] as CopyStatus[],
  },
  {
    title: "Clean Code",
    slug: "clean-code",
    isbn: "9780132350884",
    description: "A software engineering reference on writing maintainable, humane code.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg",
    publicationYear: 2008,
    language: "English",
    pageCount: 464,
    edition: "First edition",
    locationShelf: "TECH-PROG-A2",
    publisherSlug: "addison-wesley",
    authorSlugs: ["robert-c-martin"],
    categorySlugs: ["technology"],
    tagSlugs: ["international", "programming", "reference"],
    copyStatuses: ["AVAILABLE", "BORROWED", "LOST"] as CopyStatus[],
  },
  {
    title: "The Pragmatic Programmer",
    slug: "the-pragmatic-programmer",
    isbn: "9780201616224",
    description: "A practical guide to software craftsmanship and engineering judgment.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780201616224-L.jpg",
    publicationYear: 1999,
    language: "English",
    pageCount: 352,
    edition: "20th Anniversary notes",
    locationShelf: "TECH-PROG-A3",
    publisherSlug: "addison-wesley",
    authorSlugs: ["andrew-hunt", "david-thomas"],
    categorySlugs: ["technology"],
    tagSlugs: ["international", "programming", "career"],
    copyStatuses: ["AVAILABLE", "AVAILABLE"] as CopyStatus[],
  },
  {
    title: "Sapiens",
    slug: "sapiens",
    isbn: "9780062316097",
    description: "A wide-ranging history of humankind from cognition to modern institutions.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg",
    publicationYear: 2011,
    language: "English",
    pageCount: 464,
    edition: "Illustrated references",
    locationShelf: "HIS-WLD-B1",
    publisherSlug: "harpercollins",
    authorSlugs: ["yuval-noah-harari"],
    categorySlugs: ["history", "science"],
    tagSlugs: ["international", "popular-science"],
    copyStatuses: ["BORROWED", "RESERVED", "AVAILABLE"] as CopyStatus[],
  },
  {
    title: "Steve Jobs",
    slug: "steve-jobs",
    isbn: "9781451648539",
    description: "A biography of Steve Jobs based on interviews with Jobs and people around him.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781451648539-L.jpg",
    publicationYear: 2011,
    language: "English",
    pageCount: 656,
    edition: "Biography edition",
    locationShelf: "BIO-TECH-C1",
    publisherSlug: "simon-and-schuster",
    authorSlugs: ["walter-isaacson"],
    categorySlugs: ["biography", "business"],
    tagSlugs: ["international", "leadership"],
    copyStatuses: ["AVAILABLE", "AVAILABLE"] as CopyStatus[],
  },
  {
    title: "Deep Work",
    slug: "deep-work",
    isbn: "9781455586691",
    description: "A productivity book about focus, concentration, and high-value knowledge work.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg",
    publicationYear: 2016,
    language: "English",
    pageCount: 304,
    edition: "Standard edition",
    locationShelf: "SEL-PROD-D2",
    publisherSlug: "penguin-random-house",
    authorSlugs: ["cal-newport"],
    categorySlugs: ["self-development", "business"],
    tagSlugs: ["international", "productivity", "career"],
    copyStatuses: ["AVAILABLE", "BORROWED"] as CopyStatus[],
  },
  {
    title: "Thinking, Fast and Slow",
    slug: "thinking-fast-and-slow",
    isbn: "9780374533557",
    description: "A psychology and decision-making classic about cognitive biases and judgment.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg",
    publicationYear: 2011,
    language: "English",
    pageCount: 499,
    edition: "Paperback",
    locationShelf: "SCI-PSY-E1",
    publisherSlug: "penguin-random-house",
    authorSlugs: ["daniel-kahneman"],
    categorySlugs: ["science", "business"],
    tagSlugs: ["international", "research"],
    copyStatuses: ["AVAILABLE"] as CopyStatus[],
  },
  {
    title: "To Kill a Mockingbird",
    slug: "to-kill-a-mockingbird",
    isbn: "9780061120084",
    description: "A classic novel about justice, childhood, and moral courage.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg",
    publicationYear: 1960,
    language: "English",
    pageCount: 336,
    edition: "Classic paperback",
    locationShelf: "LIT-CLS-A4",
    publisherSlug: "harpercollins",
    authorSlugs: ["harper-lee"],
    categorySlugs: ["fiction", "literature"],
    tagSlugs: ["international", "classic", "novel"],
    copyStatuses: ["AVAILABLE", "AVAILABLE"] as CopyStatus[],
  },
  {
    title: "The Alchemist",
    slug: "the-alchemist",
    isbn: "9780061122415",
    description: "A philosophical novel about purpose, travel, and self-discovery.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780061122415-L.jpg",
    publicationYear: 1988,
    language: "English",
    pageCount: 208,
    edition: "International edition",
    locationShelf: "LIT-FIC-C2",
    publisherSlug: "harpercollins",
    authorSlugs: ["paulo-coelho"],
    categorySlugs: ["fiction", "philosophy"],
    tagSlugs: ["international", "novel"],
    copyStatuses: ["AVAILABLE"] as CopyStatus[],
  },
  {
    title: "Designing Data-Intensive Applications",
    slug: "designing-data-intensive-applications",
    isbn: "9781449373320",
    description: "A deep engineering book about reliable, scalable, and maintainable systems.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781449373320-L.jpg",
    publicationYear: 2017,
    language: "English",
    pageCount: 616,
    edition: "First edition",
    locationShelf: "TECH-SYS-B4",
    publisherSlug: "oreilly-media",
    authorSlugs: ["robert-c-martin"],
    categorySlugs: ["technology"],
    tagSlugs: ["international", "programming", "reference"],
    copyStatuses: ["AVAILABLE", "AVAILABLE"] as CopyStatus[],
  },
  {
    title: "Learning React",
    slug: "learning-react",
    isbn: "9781492051725",
    description: "A modern introduction to React concepts, hooks, components, and application design.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781492051725-L.jpg",
    publicationYear: 2020,
    language: "English",
    pageCount: 310,
    edition: "Second edition",
    locationShelf: "TECH-WEB-C5",
    publisherSlug: "oreilly-media",
    authorSlugs: ["andrew-hunt"],
    categorySlugs: ["technology", "education"],
    tagSlugs: ["programming", "reference"],
    copyStatuses: ["AVAILABLE", "BORROWED"] as CopyStatus[],
  },
  {
    title: "Database Internals",
    slug: "database-internals",
    isbn: "9781492040347",
    description: "A practical reference on storage engines, distributed systems, and database architecture.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781492040347-L.jpg",
    publicationYear: 2019,
    language: "English",
    pageCount: 350,
    edition: "First edition",
    locationShelf: "TECH-DB-D4",
    publisherSlug: "oreilly-media",
    authorSlugs: ["david-thomas"],
    categorySlugs: ["technology"],
    tagSlugs: ["programming", "reference"],
    copyStatuses: ["AVAILABLE"] as CopyStatus[],
  },
  {
    title: "The Lean Startup",
    slug: "the-lean-startup",
    isbn: "9780307887894",
    description: "A startup management book about validated learning and iterative product development.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780307887894-L.jpg",
    publicationYear: 2011,
    language: "English",
    pageCount: 336,
    edition: "Business edition",
    locationShelf: "BUS-OPS-A2",
    publisherSlug: "penguin-random-house",
    authorSlugs: ["cal-newport"],
    categorySlugs: ["business"],
    tagSlugs: ["international", "operations", "leadership"],
    copyStatuses: ["AVAILABLE", "AVAILABLE"] as CopyStatus[],
  },
  {
    title: "Range",
    slug: "range",
    isbn: "9780735214484",
    description: "An evidence-based argument for broad exploration and interdisciplinary learning.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780735214484-L.jpg",
    publicationYear: 2019,
    language: "English",
    pageCount: 352,
    edition: "Hardcover",
    locationShelf: "SEL-CAREER-F1",
    publisherSlug: "penguin-random-house",
    authorSlugs: ["daniel-kahneman"],
    categorySlugs: ["self-development", "education"],
    tagSlugs: ["research", "career"],
    copyStatuses: ["AVAILABLE"] as CopyStatus[],
  },
  {
    title: "Educated",
    slug: "educated",
    isbn: "9780399590504",
    description: "A memoir about family, education, and self-determination.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780399590504-L.jpg",
    publicationYear: 2018,
    language: "English",
    pageCount: 352,
    edition: "Memoir edition",
    locationShelf: "BIO-EDU-E4",
    publisherSlug: "penguin-random-house",
    authorSlugs: ["walter-isaacson"],
    categorySlugs: ["biography", "education"],
    tagSlugs: ["international"],
    copyStatuses: ["AVAILABLE", "AVAILABLE"] as CopyStatus[],
  },
  {
    title: "Brief Answers to the Big Questions",
    slug: "brief-answers-to-the-big-questions",
    isbn: "9781984819192",
    description: "A concise exploration of science, humanity, and future-facing questions.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781984819192-L.jpg",
    publicationYear: 2018,
    language: "English",
    pageCount: 256,
    edition: "Science edition",
    locationShelf: "SCI-GEN-B5",
    publisherSlug: "penguin-random-house",
    authorSlugs: ["yuval-noah-harari"],
    categorySlugs: ["science"],
    tagSlugs: ["popular-science", "international"],
    copyStatuses: ["AVAILABLE"] as CopyStatus[],
  },
  {
    title: "The Manager's Path",
    slug: "the-managers-path",
    isbn: "9781491973899",
    description: "A guide to engineering leadership, management, and growing technical teams.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781491973899-L.jpg",
    publicationYear: 2017,
    language: "English",
    pageCount: 244,
    edition: "First edition",
    locationShelf: "BUS-TECH-G2",
    publisherSlug: "oreilly-media",
    authorSlugs: ["andrew-hunt"],
    categorySlugs: ["business", "technology"],
    tagSlugs: ["leadership", "career", "operations"],
    copyStatuses: ["AVAILABLE", "BORROWED"] as CopyStatus[],
  },
  {
    title: "Refactoring",
    slug: "refactoring",
    isbn: "9780134757599",
    description: "A practical catalog of refactoring techniques for improving existing code.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780134757599-L.jpg",
    publicationYear: 2018,
    language: "English",
    pageCount: 448,
    edition: "Second edition",
    locationShelf: "TECH-PROG-H1",
    publisherSlug: "addison-wesley",
    authorSlugs: ["robert-c-martin"],
    categorySlugs: ["technology"],
    tagSlugs: ["programming", "reference"],
    copyStatuses: ["AVAILABLE", "AVAILABLE"] as CopyStatus[],
  },
  {
    title: "Ikigai",
    slug: "ikigai",
    isbn: "9780143130727",
    description: "A short self-development book about purpose, habits, and longevity.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780143130727-L.jpg",
    publicationYear: 2016,
    language: "English",
    pageCount: 208,
    edition: "International edition",
    locationShelf: "SEL-LIFE-I2",
    publisherSlug: "penguin-random-house",
    authorSlugs: ["paulo-coelho"],
    categorySlugs: ["self-development", "philosophy"],
    tagSlugs: ["productivity", "international"],
    copyStatuses: ["AVAILABLE"] as CopyStatus[],
  },
  {
    title: "The Innovators",
    slug: "the-innovators",
    isbn: "9781476708690",
    description: "A history of the people who created the computer and the internet.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781476708690-L.jpg",
    publicationYear: 2014,
    language: "English",
    pageCount: 560,
    edition: "History edition",
    locationShelf: "HIS-TECH-J1",
    publisherSlug: "simon-and-schuster",
    authorSlugs: ["walter-isaacson"],
    categorySlugs: ["history", "technology"],
    tagSlugs: ["international", "research"],
    copyStatuses: ["AVAILABLE", "AVAILABLE"] as CopyStatus[],
  },
  {
    title: "The Mythical Man-Month",
    slug: "the-mythical-man-month",
    isbn: "9780201835953",
    description: "A classic collection of essays about software project management.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780201835953-L.jpg",
    publicationYear: 1975,
    language: "English",
    pageCount: 322,
    edition: "Anniversary edition",
    locationShelf: "TECH-MGMT-K1",
    publisherSlug: "addison-wesley",
    authorSlugs: ["david-thomas"],
    categorySlugs: ["technology", "business"],
    tagSlugs: ["classic", "operations"],
    copyStatuses: ["AVAILABLE"] as CopyStatus[],
  },
];

export const loans = [
  {
    userEmail: "member@urlibrary.demo",
    copyCode: "URL-LP-002",
    borrowedAt: "2026-06-05T09:00:00.000Z",
    dueAt: "2026-06-19T09:00:00.000Z",
    status: "ACTIVE" as LoanStatus,
    createdByEmail: "librarian@urlibrary.demo",
    notes: "Standard two-week checkout.",
  },
  {
    userEmail: "member2@urlibrary.demo",
    copyCode: "URL-LB-001",
    borrowedAt: "2026-05-27T10:30:00.000Z",
    dueAt: "2026-06-10T10:30:00.000Z",
    status: "OVERDUE" as LoanStatus,
    createdByEmail: "librarian@urlibrary.demo",
    notes: "Overdue sample for fine workflow.",
  },
  {
    userEmail: "member@urlibrary.demo",
    copyCode: "URL-AH-001",
    borrowedAt: "2026-06-02T14:00:00.000Z",
    dueAt: "2026-06-16T14:00:00.000Z",
    returnedAt: "2026-06-15T08:40:00.000Z",
    status: "RETURNED" as LoanStatus,
    createdByEmail: "librarian@urlibrary.demo",
    returnedByEmail: "librarian@urlibrary.demo",
    notes: "Returned before due date.",
  },
  {
    userEmail: "member2@urlibrary.demo",
    copyCode: "URL-CC-002",
    borrowedAt: "2026-06-01T11:00:00.000Z",
    dueAt: "2026-06-15T11:00:00.000Z",
    returnedAt: "2026-06-20T15:20:00.000Z",
    status: "RETURNED" as LoanStatus,
    createdByEmail: "librarian@urlibrary.demo",
    returnedByEmail: "librarian@urlibrary.demo",
    notes: "Late return generated a fine.",
  },
  {
    userEmail: "member@urlibrary.demo",
    copyCode: "URL-N5M-002",
    borrowedAt: "2026-06-12T13:20:00.000Z",
    dueAt: "2026-06-26T13:20:00.000Z",
    status: "ACTIVE" as LoanStatus,
    createdByEmail: "librarian@urlibrary.demo",
    notes: "Member dashboard active loan.",
  },
];

export const reservations: ReservationSeed[] = [
  {
    userEmail: "member@urlibrary.demo",
    bookSlug: "laut-bercerita",
    status: "READY_FOR_PICKUP" as ReservationStatus,
    queuePosition: 1,
    reservedAt: "2026-06-14T10:00:00.000Z",
    readyAt: "2026-06-18T09:30:00.000Z",
    expiresAt: "2026-06-21T09:30:00.000Z",
    notes: "First queue item ready after staff review.",
  },
  {
    userEmail: "member2@urlibrary.demo",
    bookSlug: "sapiens",
    status: "PENDING" as ReservationStatus,
    queuePosition: 1,
    reservedAt: "2026-06-17T16:00:00.000Z",
    notes: "Waiting for next available copy.",
  },
  {
    userEmail: "member@urlibrary.demo",
    bookSlug: "clean-code",
    status: "CANCELLED" as ReservationStatus,
    queuePosition: 2,
    reservedAt: "2026-06-11T12:00:00.000Z",
    cancelledAt: "2026-06-12T08:30:00.000Z",
    notes: "Cancelled by member before fulfillment.",
  },
];

export const favorites = [
  { userEmail: "member@urlibrary.demo", bookSlug: "atomic-habits" },
  { userEmail: "member@urlibrary.demo", bookSlug: "laskar-pelangi" },
  { userEmail: "member@urlibrary.demo", bookSlug: "clean-code" },
  { userEmail: "member2@urlibrary.demo", bookSlug: "sapiens" },
  { userEmail: "member2@urlibrary.demo", bookSlug: "the-pragmatic-programmer" },
];

export const readingLists = [
  {
    userEmail: "member@urlibrary.demo",
    title: "Semester Research Stack",
    description: "Books for software engineering and research writing.",
    isPublic: false,
    items: [
      { bookSlug: "clean-code", notes: "Review chapter 7 before refactoring lab.", order: 1 },
      { bookSlug: "designing-data-intensive-applications", notes: "Use for backend architecture notes.", order: 2 },
      { bookSlug: "database-internals", notes: "Reference for storage engine section.", order: 3 },
    ],
  },
  {
    userEmail: "member2@urlibrary.demo",
    title: "Leadership and Focus",
    description: "Reading plan for team management and personal focus.",
    isPublic: true,
    items: [
      { bookSlug: "deep-work", notes: "Build weekly focus routine.", order: 1 },
      { bookSlug: "the-managers-path", notes: "Discuss with project team.", order: 2 },
    ],
  },
];

export const reviews = [
  {
    userEmail: "member@urlibrary.demo",
    bookSlug: "atomic-habits",
    rating: 5,
    title: "Practical and easy to revisit",
    body: "A strong recommendation for members who want a practical habit system.",
  },
  {
    userEmail: "member@urlibrary.demo",
    bookSlug: "laskar-pelangi",
    rating: 5,
    title: "Warm and inspiring",
    body: "Still one of the best books for connecting education with everyday courage.",
  },
  {
    userEmail: "member2@urlibrary.demo",
    bookSlug: "sapiens",
    rating: 4,
    title: "Broad historical lens",
    body: "Useful for discussion groups, especially with guided questions from librarians.",
  },
  {
    userEmail: "member2@urlibrary.demo",
    bookSlug: "clean-code",
    rating: 4,
    title: "Good reference",
    body: "Helpful as a reference, though some examples need modern context.",
  },
];

export const fines = [
  {
    userEmail: "member2@urlibrary.demo",
    copyCode: "URL-CC-002",
    amount: 10000,
    status: "UNPAID" as FineStatus,
    reason: "5 days overdue at IDR 2,000 per day.",
  },
];

export const notifications = [
  {
    userEmail: "member@urlibrary.demo",
    type: "DUE_SOON" as NotificationType,
    title: "Loan due soon",
    message: "Laskar Pelangi is due on 19 June 2026.",
  },
  {
    userEmail: "member@urlibrary.demo",
    type: "RESERVATION_READY" as NotificationType,
    title: "Reservation ready",
    message: "Laut Bercerita is ready for pickup until 21 June 2026.",
  },
  {
    userEmail: "member2@urlibrary.demo",
    type: "FINE_CREATED" as NotificationType,
    title: "Fine created",
    message: "A late return fine was created for Clean Code.",
  },
  {
    userEmail: "librarian@urlibrary.demo",
    type: "SYSTEM" as NotificationType,
    title: "Daily circulation summary",
    message: "There are overdue loans and pending reservations requiring review.",
  },
];

export const auditLogs = [
  {
    userEmail: "admin@urlibrary.demo",
    action: "CREATE" as AuditAction,
    module: "catalog",
    description: "Created initial catalog structure and seed data.",
    metadataJson: { phase: "seed", source: "UrLibrary Nexus" },
  },
  {
    userEmail: "librarian@urlibrary.demo",
    action: "BORROW" as AuditAction,
    module: "loans",
    description: "Created active loan for Laskar Pelangi.",
    metadataJson: { copyCode: "URL-LP-002" },
  },
  {
    userEmail: "librarian@urlibrary.demo",
    action: "RETURN" as AuditAction,
    module: "returns",
    description: "Processed late return for Clean Code and generated fine.",
    metadataJson: { copyCode: "URL-CC-002", lateDays: 5 },
  },
  {
    userEmail: "member@urlibrary.demo",
    action: "RESERVE" as AuditAction,
    module: "reservations",
    description: "Created reservation for Laut Bercerita.",
    metadataJson: { bookSlug: "laut-bercerita" },
  },
  {
    userEmail: "admin@urlibrary.demo",
    action: "EXPORT" as AuditAction,
    module: "reports",
    description: "Generated sample circulation export.",
    metadataJson: { format: "xlsx" },
  },
];

export const librarySettings = {
  maxActiveLoans: 5,
  loanDurationDays: 14,
  maxRenewals: 1,
  dailyFineAmount: 2000,
  fineLimit: 50000,
  reservationExpiryDays: 3,
};

export const bookCopies = books.flatMap((book) =>
  book.copyStatuses.map((status, index) => ({
    bookSlug: book.slug,
    copyCode: `URL-${book.slug
      .split("-")
      .map((part) => part[0])
      .join("")
      .toUpperCase()}-${String(index + 1).padStart(3, "0")}`,
    barcode: `BC-${book.slug.toUpperCase().replaceAll("-", "")}-${String(index + 1).padStart(3, "0")}`,
    status,
    acquisitionDate: `2026-0${(index % 5) + 1}-15T00:00:00.000Z`,
    conditionNote:
      status === "MAINTENANCE"
        ? "Cover repair scheduled."
        : status === "LOST"
          ? "Marked lost for reconciliation."
          : "Good condition.",
  })),
);

export function getBookBySlug(slug: string) {
  return books.find((book) => book.slug === slug);
}

export function getBookCopies(slug: string) {
  return bookCopies.filter((copy) => copy.bookSlug === slug);
}

export function getAvailability(slug: string) {
  const copies = getBookCopies(slug);
  return {
    total: copies.length,
    available: copies.filter((copy) => copy.status === "AVAILABLE").length,
    borrowed: copies.filter((copy) => copy.status === "BORROWED").length,
    reserved: copies.filter((copy) => copy.status === "RESERVED").length,
  };
}

export function getAverageRating(slug: string) {
  const bookReviews = reviews.filter((review) => review.bookSlug === slug);
  if (!bookReviews.length) return 0;
  return bookReviews.reduce((total, review) => total + review.rating, 0) / bookReviews.length;
}

export function getCatalogStats() {
  return {
    totalBooks: books.length,
    totalCopies: bookCopies.length,
    availableCopies: bookCopies.filter((copy) => copy.status === "AVAILABLE").length,
    activeLoans: loans.filter((loan) => loan.status === "ACTIVE" || loan.status === "OVERDUE").length,
    overdueLoans: loans.filter((loan) => loan.status === "OVERDUE").length,
    pendingReservations: reservations.filter((reservation) => reservation.status === "PENDING").length,
    unpaidFines: fines
      .filter((fine) => fine.status === "UNPAID")
      .reduce((total, fine) => total + fine.amount, 0),
  };
}
