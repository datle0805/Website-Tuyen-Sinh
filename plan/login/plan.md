# Authentication Plan — NextAuth (Email + OAuth) with bcrypt

TL;DR: Use NextAuth in the Next.js App Router with a `Credentials` provider (email/password) plus Google and Facebook providers. Store user records in MongoDB and hash passwords with `bcrypt` (cost 12). Use the NextAuth MongoDB adapter so NextAuth manages sessions via secure cookies; the `Credentials` provider will verify passwords against a backend endpoint.

## Goals

- Email/password signup & login (passwords hashed with bcrypt)
- OAuth sign-in with Google and Facebook
- NextAuth-managed sessions (secure HttpOnly cookies)
- Optional account linking by email

## High-level steps

1. Create a `User` model in the backend: `backend/src/models/User.ts` with fields:
   - `email` (unique)
   - `passwordHash` (nullable for OAuth-only accounts)
   - `name`
   - `oauthProvider` (e.g., `google`, `facebook`)
   - `oauthId`
   - timestamps

2. Backend credential endpoints (minimal):
   - `POST /api/auth/register` — validate input, hash password with `bcrypt` (cost 12), create user.
   - `POST /api/auth/credentials` — verify email/password by comparing `bcrypt.compare`, return minimal user data for NextAuth `Credentials` provider.

3. Backend dependencies: add `bcrypt` and input validation libs (e.g., `validator` or `express-validator`) to `backend/package.json` and run `npm install` in `backend`.

4. NextAuth configuration (frontend App Router):
   - Create `frontend/src/app/api/auth/[...nextauth]/route.ts` and configure:
     - `Credentials` provider: call the backend `POST /api/auth/credentials` to verify email/password.
     - `Google` and `Facebook` providers with client IDs/secrets from env.
     - MongoDB adapter so NextAuth stores users/sessions in MongoDB.

5. Frontend UI pages:
   - `frontend/src/app/register/page.tsx` — simple register form that submits to the backend endpoint or calls NextAuth credentials sign-in after creating user.
   - `frontend/src/app/login/page.tsx` — email/password form that calls `signIn('credentials', ...)` and OAuth buttons that call `signIn('google')` / `signIn('facebook')`.
   - Use existing components: `frontend/src/components/atoms/Input.tsx` and `Button.tsx`.

6. Env & security:
   - Required env vars: `MONGO_URI`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET`.
   - Use `bcrypt` cost = 12.
   - In production ensure `NEXTAUTH_URL` is correct and cookies are `secure` and `SameSite` configured.

7. Optional: account linking
   - When an OAuth sign-in returns an email that matches an existing account, either automatically link the provider to the existing user record (recommended) or surface a linking flow.

## Example env snippet (add to README / .env.example)

```
MONGO_URI=mongodb://.../dbname
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=some-strong-secret
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FACEBOOK_CLIENT_ID=...
FACEBOOK_CLIENT_SECRET=...
```

## Quick next actions I can implement for you

- Create `plan/login/plan.md` (this file).
- Create `backend/src/models/User.ts` and the auth controllers/routes.
- Add `next-auth` route and example frontend `login`/`register` pages.

---

Created on: 2026-02-07
