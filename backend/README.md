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

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## Structure
- `src/modules`: Feature-based modules (Auth, Applications, etc.)
- `src/middleware`: Custom middleware (Auth, Error handling)
- `src/models`: Mongoose models
