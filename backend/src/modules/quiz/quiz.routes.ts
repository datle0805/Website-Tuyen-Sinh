import { Router } from "express";
import {
    startQuiz,
    startQuizForApplication,
    submitQuiz,
    getQuizResults,
    getQuizResultByApplication,
} from "./quiz.controller";
import { protect, admin } from "../../middleware/authMiddleware";

const router = Router();

// Public routes (no auth required)
router.post("/start", startQuiz);
router.post("/submit", submitQuiz);

// Authenticated routes
router.post("/start-for-application", protect, startQuizForApplication);

// Admin routes
router.get("/results", protect, admin, getQuizResults);
router.get("/results/:applicationId", protect, admin, getQuizResultByApplication);

export default router;
