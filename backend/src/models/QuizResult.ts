import mongoose, { Schema, Document } from "mongoose";

export interface IQuizResult extends Document {
    userId: mongoose.Types.ObjectId | null;
    applicationId: mongoose.Types.ObjectId | null;
    quizId: mongoose.Types.ObjectId;
    level: string;
    answers: number[];
    score: number;
    totalQuestions: number;
    isAnonymous: boolean;
    completedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const QuizResultSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
        applicationId: { type: Schema.Types.ObjectId, ref: "Application", default: null },
        quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
        level: { type: String, required: true },
        answers: { type: [Number], required: true },
        score: { type: Number, required: true, min: 0 },
        totalQuestions: { type: Number, required: true, default: 20 },
        isAnonymous: { type: Boolean, default: false },
        completedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// Index for efficient cleanup of anonymous results
QuizResultSchema.index({ isAnonymous: 1, completedAt: 1 });
// Index for finding results by application
QuizResultSchema.index({ applicationId: 1 });

const QuizResult = mongoose.models.QuizResult || mongoose.model<IQuizResult>("QuizResult", QuizResultSchema);

export default QuizResult;
