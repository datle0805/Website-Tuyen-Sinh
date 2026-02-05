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
connectDB();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json()); // Body parser
app.use(morgan("dev")); // Logger

// Routes
import healthRoutes from "./modules/health/health.routes";

app.use("/api/health", healthRoutes);

app.get("/", (req, res) => {
    res.send("API is running...");
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
