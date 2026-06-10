# Bookem

Bookem is a minimal bookmarks app built with Next.js App Router, Supabase Postgres, shadcn/ui, Resend, bcryptjs, jose, and zod.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment file:

```bash
cp .env.example .env
```

3. Fill in `.env`:

- `SUPABASE_URL`: your Supabase project URL.
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key. This is server-only and must never be exposed to clients.
- `RESEND_API_KEY`: API key used to send welcome emails. Signup still works if this is empty.
- `RESEND_FROM_EMAIL`: optional sender identity for verification emails, for example `Bookem <onboarding@yourdomain.com>`. Use a sender from a verified Resend domain in production.
- `JWT_SECRET`: random secret with at least 32 characters for signing session cookies.
- `NEXT_PUBLIC_APP_URL`: public app URL, such as `http://localhost:3000`.

## Database Schema

Open the Supabase SQL editor and apply this schema if it has not already been applied:

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE bookmark_visibility AS ENUM ('public', 'private');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    handle VARCHAR(50) NOT NULL UNIQUE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT users_handle_length CHECK (char_length(handle) >= 3)
);

CREATE TABLE bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    visibility bookmark_visibility NOT NULL DEFAULT 'private',
    user_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_bookmarks_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_visibility ON bookmarks(visibility);
CREATE INDEX idx_users_handle ON users(handle);
```

The app uses the service role key only in server-side Supabase query modules under `src/lib/db`.

## Run Locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Auth Flow

Signup creates an unverified user and sends a verification email through Resend. The verification link calls `/api/auth/verify?token=...`, marks `users.is_verified` as `true`, and redirects to login. Login returns `403` until the email is verified.

## Public Discovery

- `/explore`: public page to search verified users by name or handle.
- `/[handle]`: public profile page showing public bookmarks only.
- `/api/profile/search?q=...`: public search API.
- `/api/profile/[handle]`: public profile API.

## Scripts

- `npm run dev`: start the development server.
- `npm run build`: create a production build.
- `npm run start`: start the production server.
- `npm run lint`: run ESLint.
