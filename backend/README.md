# Backend - Website Tuyển Sinh

This is the backend API for the Admissions Website, built with Node.js, Express, and MongoDB.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT

## Getting Started

1.  **Install Dependencies**:

    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Create a `.env` file in the root:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/admissions
    JWT_SECRET=your_secret_key
    ```

### Auth / NextAuth configuration

When using NextAuth on the frontend with the backend credentials provider, add the following to your `.env` (or copy from project root `.env.example`):

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace_with_strong_random_value
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
BCRYPT_SALT_ROUNDS=12
```

Set `NEXT_PUBLIC_BACKEND_URL` in the frontend to point at this backend when running locally (e.g. `http://localhost:5000`).

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## Structure

- `src/modules`: Feature-based modules (Auth, Applications, etc.)
- `src/middleware`: Custom middleware (Auth, Error handling)
- `src/models`: Mongoose models
