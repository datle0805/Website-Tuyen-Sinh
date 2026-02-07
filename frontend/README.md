# Frontend - Website Tuyển Sinh

This is the frontend for the Admissions Website, built with Next.js (App Router).

## Tech Stack

- **Framework**: Next.js 15+
- **Styling**: TailwindCSS
- **Forms**: React Hook Form + Yup
- **Package Manager**: NPM

## Getting Started

1.  **Install Dependencies**:

    ```bash
    npm install
    ```

2.  **Run Development Server**:

    ```bash
    npm run dev
    ```

3.  **Open Browser**:
    Visit [http://localhost:3000](http://localhost:3000).

## Project Structure

- `src/app`: App Router pages and layouts.
- `src/components`: Atomic components (atoms, molecules, organisms).
- `src/features`: Feature-based modules (Auth, Application form, etc.).

## Environment variables

Create a `.env.local` file at the project root (or copy from the repository `.env.example`) and set at minimum:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace_with_strong_random_value
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
```

The frontend uses NextAuth (App Router). Credentials provider calls the backend `POST /api/auth/credentials` endpoint — ensure `NEXT_PUBLIC_BACKEND_URL` points to the running backend.
