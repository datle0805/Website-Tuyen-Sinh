import { Request, Response } from "express";
import Quiz from "../../models/Quiz";
import QuizResult from "../../models/QuizResult";
import Application from "../../models/Application";
import { AIService } from "../../services/ai.service";
import { AuthRequest } from "../../middleware/authMiddleware";

const QUIZ_CACHE_THRESHOLD = 10; // If >= 10 quizzes for level, use random from DB

/**
 * Get or generate a quiz for a given level (public, no auth)
 */
export const startQuiz = async (req: Request, res: Response) => {
    try {
        const { level } = req.body;

        if (!level) {
            return res.status(400).json({ message: "Level is required" });
        }

        const validLevels = [
            'Mẫu giáo',
            'Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5',
            'Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9',
            'Lớp 10', 'Lớp 11', 'Lớp 12',
            'Đại học', 'TOEIC'
        ];

        if (!validLevels.includes(level)) {
            return res.status(400).json({ message: "Invalid level" });
        }

        // Check how many quizzes exist for this level
        const quizCount = await Quiz.countDocuments({ level });

        let quiz;

        if (quizCount >= QUIZ_CACHE_THRESHOLD) {
            // Pick random quiz from DB
            const randomIndex = Math.floor(Math.random() * quizCount);
            quiz = await Quiz.findOne({ level }).skip(randomIndex);
        } else {
            // Generate new quiz via AI
            try {
                const aiService = new AIService();
                const generated = await aiService.generateQuiz(level);

                quiz = await Quiz.create({
                    level,
                    questions: generated.questions,
                    generatedBy: 'ai',
                });
            } catch (aiError: any) {
                // If AI generation fails and we have some quizzes, return a random one
                if (quizCount > 0) {
                    const randomIndex = Math.floor(Math.random() * quizCount);
                    quiz = await Quiz.findOne({ level }).skip(randomIndex);
                } else {
                    return res.status(503).json({
                        message: "Không thể tạo đề thi. Vui lòng thử lại sau.",
                        error: aiError.message,
                    });
                }
            }
        }

        if (!quiz) {
            return res.status(500).json({ message: "Unable to get quiz" });
        }

        // Return questions WITHOUT correctAnswer for the user
        const sanitizedQuestions = quiz.questions.map((q: any, idx: number) => ({
            id: idx,
            question: q.question,
            options: q.options,
            category: q.category,
        }));

        return res.json({
            quizId: quiz._id,
            level: quiz.level,
            totalQuestions: quiz.questions.length,
            questions: sanitizedQuestions,
        });
    } catch (err: any) {
        return res.status(500).json({ message: err.message || "Server error" });
    }
};

/**
 * Start quiz linked to an application (requires auth)
 */
export const startQuizForApplication = async (req: AuthRequest, res: Response) => {
    try {
        const { applicationId } = req.body;

        if (!applicationId) {
            return res.status(400).json({ message: "Application ID is required" });
        }

        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        // Verify the application belongs to the logged-in user
        if (application.userId.toString() !== req.user?._id?.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // Check if quiz already taken for this application
        const existingResult = await QuizResult.findOne({ applicationId });
        if (existingResult) {
            return res.status(400).json({
                message: "Bạn đã làm bài kiểm tra cho hồ sơ này rồi.",
                resultId: existingResult._id,
                score: existingResult.score,
            });
        }

        const level = application.educationLevel;

        // Reuse start logic
        const quizCount = await Quiz.countDocuments({ level });
        let quiz;

        if (quizCount >= QUIZ_CACHE_THRESHOLD) {
            const randomIndex = Math.floor(Math.random() * quizCount);
            quiz = await Quiz.findOne({ level }).skip(randomIndex);
        } else {
            try {
                const aiService = new AIService();
                const generated = await aiService.generateQuiz(level);
                quiz = await Quiz.create({
                    level,
                    questions: generated.questions,
                    generatedBy: 'ai',
                });
            } catch (aiError: any) {
                if (quizCount > 0) {
                    const randomIndex = Math.floor(Math.random() * quizCount);
                    quiz = await Quiz.findOne({ level }).skip(randomIndex);
                } else {
                    return res.status(503).json({
                        message: "Không thể tạo đề thi. Vui lòng thử lại sau.",
                        error: aiError.message,
                    });
                }
            }
        }

        if (!quiz) {
            return res.status(500).json({ message: "Unable to get quiz" });
        }

        const sanitizedQuestions = quiz.questions.map((q: any, idx: number) => ({
            id: idx,
            question: q.question,
            options: q.options,
            category: q.category,
        }));

        return res.json({
            quizId: quiz._id,
            level: quiz.level,
            totalQuestions: quiz.questions.length,
            questions: sanitizedQuestions,
            applicationId,
        });
    } catch (err: any) {
        return res.status(500).json({ message: err.message || "Server error" });
    }
};

/**
 * Submit quiz answers and get graded result
 */
export const submitQuiz = async (req: Request, res: Response) => {
    try {
        const { quizId, answers, applicationId } = req.body;

        if (!quizId || !answers || !Array.isArray(answers)) {
            return res.status(400).json({ message: "quizId and answers are required" });
        }

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        if (answers.length !== quiz.questions.length) {
            return res.status(400).json({
                message: `Expected ${quiz.questions.length} answers, got ${answers.length}`,
            });
        }

        // Grade the quiz
        let score = 0;
        const details = quiz.questions.map((q: any, idx: number) => {
            const isCorrect = answers[idx] === q.correctAnswer;
            if (isCorrect) score++;
            return {
                question: q.question,
                options: q.options,
                userAnswer: answers[idx],
                correctAnswer: q.correctAnswer,
                isCorrect,
                explanation: q.explanation,
                category: q.category,
            };
        });

        // Determine if anonymous or authenticated
        const userId = (req as AuthRequest).user?._id || null;
        const isAnonymous = !userId;

        // Create quiz result
        const quizResult = await QuizResult.create({
            userId,
            applicationId: applicationId || null,
            quizId: quiz._id,
            level: quiz.level,
            answers,
            score,
            totalQuestions: quiz.questions.length,
            isAnonymous,
            completedAt: new Date(),
        });

        // If linked to application, update the application
        if (applicationId && userId) {
            await Application.findByIdAndUpdate(applicationId, {
                quizResultId: quizResult._id,
            });
        }

        return res.json({
            resultId: quizResult._id,
            score,
            totalQuestions: quiz.questions.length,
            percentage: Math.round((score / quiz.questions.length) * 100),
            details,
        });
    } catch (err: any) {
        return res.status(500).json({ message: err.message || "Server error" });
    }
};

/**
 * Get all quiz results (admin only)
 */
export const getQuizResults = async (req: AuthRequest, res: Response) => {
    try {
        const { level, minScore, maxScore, page = 1, limit = 20 } = req.query;

        const filter: any = { isAnonymous: false };
        if (level) filter.level = level;
        if (minScore || maxScore) {
            filter.score = {};
            if (minScore) filter.score.$gte = Number(minScore);
            if (maxScore) filter.score.$lte = Number(maxScore);
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [results, total] = await Promise.all([
            QuizResult.find(filter)
                .populate('userId', 'name email')
                .populate('applicationId', 'applicationNumber fullName educationLevel')
                .sort({ completedAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            QuizResult.countDocuments(filter),
        ]);

        return res.json({
            results,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
        });
    } catch (err: any) {
        return res.status(500).json({ message: err.message || "Server error" });
    }
};

/**
 * Get quiz result for a specific application (admin only)
 */
export const getQuizResultByApplication = async (req: AuthRequest, res: Response) => {
    try {
        const { applicationId } = req.params;

        const result = await QuizResult.findOne({ applicationId })
            .populate('userId', 'name email')
            .populate('quizId');

        if (!result) {
            return res.status(404).json({ message: "No quiz result found for this application" });
        }

        // Include full quiz details for review
        const quiz = await Quiz.findById(result.quizId);

        const details = quiz?.questions.map((q: any, idx: number) => ({
            question: q.question,
            options: q.options,
            userAnswer: result.answers[idx],
            correctAnswer: q.correctAnswer,
            isCorrect: result.answers[idx] === q.correctAnswer,
            explanation: q.explanation,
            category: q.category,
        }));

        return res.json({
            result,
            details,
        });
    } catch (err: any) {
        return res.status(500).json({ message: err.message || "Server error" });
    }
};
