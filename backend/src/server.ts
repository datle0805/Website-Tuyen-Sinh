import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db";
import { errorHandler, notFound } from "./middleware/errorMiddleware";

// Load env vars
dotenv.config();

// Connect to database
// Connect to database (handled in middleware for serverless)
connectDB();

const app = express();

// Middleware
app.use(helmet());
const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json()); // Body parser
app.use(morgan("dev")); // Logger

// Database connection middleware for serverless
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("Database connection error:", error);
        res.status(500).json({
            message: "Database connection failed",
            error: error instanceof Error ? error.message : String(error)
        });
    }
});

// Routes
import healthRoutes from "./modules/health/health.routes";
import authRoutes from "./modules/auth/auth.routes";
import applicationRoutes from "./modules/application/application.routes";
import quizRoutes from "./modules/quiz/quiz.routes";

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/quiz", quizRoutes);

app.get("/", (req, res) => {
    res.send("API is running...");
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start cleanup schedule for anonymous quiz results
import { startCleanupSchedule } from "./utils/cleanup";
startCleanupSchedule();

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
}

export default app;
