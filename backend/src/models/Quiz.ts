import mongoose, { Schema, Document } from "mongoose";

export interface IQuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    category: string;
}

export interface IQuiz extends Document {
    level: string;
    questions: IQuizQuestion[];
    generatedBy: 'ai' | 'manual';
    createdAt: Date;
    updatedAt: Date;
}

const QuizQuestionSchema = new Schema({
    question: { type: String, required: true },
    options: { type: [String], required: true, validate: [(v: string[]) => v.length === 4, 'Must have exactly 4 options'] },
    correctAnswer: { type: Number, required: true, min: 0, max: 3 },
    explanation: { type: String, required: true },
    category: { type: String, required: true },
}, { _id: false });

const QuizSchema: Schema = new Schema(
    {
        level: {
            type: String,
            required: true,
            enum: [
                'Mẫu giáo',
                'Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5',
                'Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9',
                'Lớp 10', 'Lớp 11', 'Lớp 12',
                'Đại học',
                'TOEIC'
            ],
            index: true,
        },
        questions: {
            type: [QuizQuestionSchema],
            required: true,
            validate: [(v: IQuizQuestion[]) => v.length === 20, 'Must have exactly 20 questions'],
        },
        generatedBy: {
            type: String,
            enum: ['ai', 'manual'],
            default: 'ai',
        },
    },
    { timestamps: true }
);

const Quiz = mongoose.models.Quiz || mongoose.model<IQuiz>("Quiz", QuizSchema);

export default Quiz;
