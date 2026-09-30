# Security Specification

## Data Invariants
1. Articles must have a valid timestamp and author.
2. Sources must have a valid URL.
3. Only the registered admin (pavanmehta99550@gmail.com) can write to any collection.
4. All users can read articles and categories.
5. Only admin can read sources.

## The "Dirty Dozen" Payloads (Rejection Targets)
1. Create article as non-admin.
2. Create article with missing title.
3. Create article with 2MB title string (Resource Poisoning).
4. Create article with spoofed timestamp (not server time).
5. Update article's `author` field (Immortal field).
6. Update source `active` state as non-admin.
7. Create category with invalid slug (regex check).
8. Create document in unmapped collection `secret_data`.
9. Update article with "Ghost Field" `isVerified: true`.
10. Update article with `category` as a number (Type safety).
11. Delete article as non-admin.
12. Create source with missing `url`.

## Test Runner (firestore.rules.test.ts)
(Logic omitted for brevity in spec, will be used in hardening)
