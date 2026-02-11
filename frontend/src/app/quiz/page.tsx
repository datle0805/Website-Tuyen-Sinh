"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock, BookOpen, Trophy, ArrowRight, Sparkles, RotateCcw } from "lucide-react";
import api from "@/lib/api";

const EDUCATION_LEVELS = [
    'Mẫu giáo',
    'Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5',
    'Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9',
    'Lớp 10', 'Lớp 11', 'Lớp 12',
    'Đại học', 'TOEIC'
];

interface Question {
    id: number;
    question: string;
    options: string[];
    category: string;
}

interface QuizDetail {
    question: string;
    options: string[];
    userAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
    explanation: string;
    category: string;
}

type Phase = 'select' | 'loading' | 'quiz' | 'result';

export default function QuizPage() {
    const { data: session } = useSession();
    const router = useRouter();

    const [phase, setPhase] = useState<Phase>('select');
    const [level, setLevel] = useState('');
    const [quizId, setQuizId] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>([]);
    const [score, setScore] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [details, setDetails] = useState<QuizDetail[]>([]);
    const [error, setError] = useState('');
    const [elapsed, setElapsed] = useState(0);
    const [showReview, setShowReview] = useState(false);

    // Timer
    useEffect(() => {
        if (phase !== 'quiz') return;
        const interval = setInterval(() => setElapsed(e => e + 1), 1000);
        return () => clearInterval(interval);
    }, [phase]);

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    const handleStart = useCallback(async () => {
        if (!level) return;
        setPhase('loading');
        setError('');
        try {
            const res = await api.post('/api/quiz/start', { level });
            const data = res.data;

            setQuizId(data.quizId);
            setQuestions(data.questions);
            setAnswers(new Array(data.questions.length).fill(null));
            setCurrentQ(0);
            setElapsed(0);
            setPhase('quiz');
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to start quiz');
            setPhase('select');
        }
    }, [level]);

    const selectAnswer = (idx: number) => {
        const newAnswers = [...answers];
        newAnswers[currentQ] = idx;
        setAnswers(newAnswers);
    };

    const handleSubmit = useCallback(async () => {
        if (answers.some(a => a === null)) {
            setError('Bạn chưa trả lời hết tất cả câu hỏi!');
            return;
        }
        setPhase('loading');
        setError('');
        try {
            const res = await api.post('/api/quiz/submit', { quizId, answers });
            const data = res.data;

            setScore(data.score);
            setTotalQuestions(data.totalQuestions);
            setDetails(data.details);
            setPhase('result');
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to submit');
            setPhase('quiz');
        }
    }, [quizId, answers]);

    const answeredCount = answers.filter(a => a !== null).length;
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    return (
        <main className="min-h-screen relative overflow-hidden font-body selection:bg-emerald-500/30 selection:text-white">
            {/* Background */}
            <div className="fixed inset-0 bg-[#020617]" />
            <div className="fixed inset-0 bg-grid opacity-20" />
            <div className="fixed top-[-10%] left-[-5%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] animate-blob" />
            <div className="fixed bottom-[-10%] right-[-5%] w-[55%] h-[55%] bg-teal-500/10 rounded-full blur-[140px] animate-blob stagger-3" />

            <div className="relative z-10 py-20 px-4 max-w-4xl mx-auto min-h-screen">

                {/* ─── PHASE: SELECT LEVEL ─── */}
                {phase === 'select' && (
                    <div className="animate-fadeIn">
                        <div className="text-center mb-12 space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4">
                                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Kiểm tra năng lực Tiếng Anh</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white font-heading leading-tight">
                                Thử Sức <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Ngay</span>
                            </h1>
                            <p className="text-slate-400 max-w-xl mx-auto text-lg">
                                Chọn trình độ để bắt đầu bài kiểm tra 20 câu trắc nghiệm Tiếng Anh. AI sẽ tạo đề phù hợp với bạn.
                            </p>
                            {!session && (
                                <p className="text-xs text-slate-500">
                                    Kết quả sẽ không được lưu lại. <Link href="/login" className="text-emerald-400 hover:underline">Đăng nhập</Link> để lưu kết quả.
                                </p>
                            )}
                        </div>

                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-10">
                            {EDUCATION_LEVELS.map(l => (
                                <button
                                    key={l}
                                    onClick={() => setLevel(l)}
                                    className={`cursor-pointer relative p-4 rounded-2xl border transition-all duration-200 text-sm font-semibold
                    ${level === l
                                            ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 shadow-[0_0_20px_rgba(34,197,94,0.15)]'
                                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                                        }`}
                                >
                                    <BookOpen className="h-4 w-4 mb-1.5 mx-auto opacity-60" />
                                    {l}
                                </button>
                            ))}
                        </div>

                        <div className="text-center">
                            <button
                                onClick={handleStart}
                                disabled={!level}
                                className={`cursor-pointer inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-base font-bold transition-all duration-300
                  ${level
                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5'
                                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                    }`}
                            >
                                <GraduationCap className="h-5 w-5" />
                                Bắt đầu làm bài
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* ─── PHASE: LOADING ─── */}
                {phase === 'loading' && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fadeIn">
                        <div className="relative mb-6">
                            <div className="w-16 h-16 border-4 border-emerald-500/20 rounded-full" />
                            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-emerald-500 rounded-full animate-spin" />
                        </div>
                        <p className="text-slate-400 text-lg font-medium">Đang tạo đề thi bằng AI...</p>
                        <p className="text-slate-500 text-sm mt-2">Có thể mất vài giây</p>
                    </div>
                )}

                {/* ─── PHASE: QUIZ ─── */}
                {phase === 'quiz' && questions.length > 0 && (
                    <div className="animate-fadeIn">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase">
                                    {level}
                                </span>
                                <span className="text-slate-400 text-sm">
                                    {answeredCount}/{questions.length} đã trả lời
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                <Clock className="h-4 w-4" />
                                {formatTime(elapsed)}
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-slate-800 rounded-full mb-8 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                                style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                            />
                        </div>

                        {error && (
                            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}

                        {/* Question Card */}
                        <div className="glass-card rounded-3xl p-6 md:p-10 mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold text-lg">
                                    {currentQ + 1}
                                </span>
                                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                                    {questions[currentQ].category}
                                </span>
                            </div>

                            <h2 className="text-xl md:text-2xl font-bold text-white mb-8 leading-relaxed">
                                {questions[currentQ].question}
                            </h2>

                            <div className="space-y-3">
                                {questions[currentQ].options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => selectAnswer(idx)}
                                        className={`cursor-pointer w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center gap-4 group
                      ${answers[currentQ] === idx
                                                ? 'bg-emerald-500/15 border-emerald-500/50 text-white'
                                                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all
                      ${answers[currentQ] === idx
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-white/10 text-slate-400 group-hover:bg-white/20'
                                            }`}>
                                            {String.fromCharCode(65 + idx)}
                                        </span>
                                        <span className="text-sm md:text-base">{option}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => setCurrentQ(q => Math.max(0, q - 1))}
                                disabled={currentQ === 0}
                                className={`cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all
                  ${currentQ === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-white/10'}`}
                            >
                                <ChevronLeft className="h-4 w-4" /> Back
                            </button>

                            {/* Question dots */}
                            <div className="hidden md:flex gap-1.5 flex-wrap justify-center max-w-[300px]">
                                {questions.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentQ(idx)}
                                        className={`cursor-pointer w-3 h-3 rounded-full transition-all
                      ${idx === currentQ ? 'bg-emerald-500 scale-125' :
                                                answers[idx] !== null ? 'bg-emerald-500/40' : 'bg-slate-700'
                                            }`}
                                    />
                                ))}
                            </div>

                            {currentQ < questions.length - 1 ? (
                                <button
                                    onClick={() => setCurrentQ(q => Math.min(questions.length - 1, q + 1))}
                                    className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-slate-300 hover:bg-white/10 transition-all"
                                >
                                    Next <ChevronRight className="h-4 w-4" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    className="cursor-pointer flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
                                >
                                    Nộp bài <CheckCircle className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* Mobile question grid */}
                        <div className="md:hidden mt-6 flex gap-1.5 flex-wrap justify-center">
                            {questions.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentQ(idx)}
                                    className={`cursor-pointer w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all
                    ${idx === currentQ ? 'bg-emerald-500 text-white' :
                                            answers[idx] !== null ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'
                                        }`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ─── PHASE: RESULT ─── */}
                {phase === 'result' && (
                    <div className="animate-fadeIn">
                        {/* Score Card */}
                        <div className="glass-card rounded-3xl p-8 md:p-12 text-center mb-8">
                            <Trophy className={`h-16 w-16 mx-auto mb-6 ${percentage >= 70 ? 'text-yellow-400' : percentage >= 50 ? 'text-emerald-400' : 'text-slate-400'}`} />

                            <h2 className="text-3xl md:text-4xl font-black text-white mb-2 font-heading">
                                {percentage >= 80 ? 'Xuất sắc!' : percentage >= 60 ? 'Tốt lắm!' : percentage >= 40 ? 'Cần cố gắng thêm!' : 'Hãy thử lại!'}
                            </h2>

                            <div className="flex items-center justify-center gap-4 my-8">
                                <div className="relative w-32 h-32">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                                        <circle
                                            cx="50" cy="50" r="42" fill="none"
                                            stroke={percentage >= 70 ? '#22C55E' : percentage >= 50 ? '#EAB308' : '#EF4444'}
                                            strokeWidth="8" strokeLinecap="round"
                                            strokeDasharray={`${percentage * 2.64} 264`}
                                            className="transition-all duration-1000"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-3xl font-black text-white">{percentage}%</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-slate-400 text-lg mb-2">
                                Bạn trả lời đúng <span className="text-white font-bold">{score}/{totalQuestions}</span> câu
                            </p>
                            <p className="text-slate-500 text-sm">
                                Thời gian: {formatTime(elapsed)} • Trình độ: {level}
                            </p>

                            <div className="flex flex-wrap gap-3 justify-center mt-8">
                                <button
                                    onClick={() => setShowReview(!showReview)}
                                    className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all"
                                >
                                    <BookOpen className="h-4 w-4" />
                                    {showReview ? 'Ẩn chi tiết' : 'Xem chi tiết'}
                                </button>
                                <button
                                    onClick={() => { setPhase('select'); setLevel(''); setError(''); }}
                                    className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg transition-all"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                    Thử lại
                                </button>
                                {!session && (
                                    <Link
                                        href="/register"
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm bg-white/5 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-all"
                                    >
                                        Đăng ký để lưu kết quả <ArrowRight className="h-4 w-4" />
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Detail Review */}
                        {showReview && (
                            <div className="space-y-4 animate-fadeIn">
                                <h3 className="text-xl font-bold text-white mb-4">Chi tiết bài thi</h3>
                                {details.map((d, idx) => (
                                    <div key={idx} className={`glass-card rounded-2xl p-6 border-l-4 ${d.isCorrect ? 'border-l-emerald-500' : 'border-l-red-500'}`}>
                                        <div className="flex items-start gap-3 mb-4">
                                            {d.isCorrect
                                                ? <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                                : <XCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                                            }
                                            <div>
                                                <p className="text-xs text-slate-500 font-semibold uppercase mb-1">{d.category} • Câu {idx + 1}</p>
                                                <p className="text-white font-medium">{d.question}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2 ml-8 mb-4">
                                            {d.options.map((opt, oi) => (
                                                <div key={oi} className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg
                          ${oi === d.correctAnswer ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' :
                                                        oi === d.userAnswer && !d.isCorrect ? 'bg-red-500/10 text-red-300 border border-red-500/30' :
                                                            'text-slate-400'}`}
                                                >
                                                    <span className="font-bold w-5">{String.fromCharCode(65 + oi)}.</span>
                                                    {opt}
                                                    {oi === d.correctAnswer && <CheckCircle className="h-3.5 w-3.5 ml-auto text-emerald-400" />}
                                                    {oi === d.userAnswer && !d.isCorrect && <XCircle className="h-3.5 w-3.5 ml-auto text-red-400" />}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="ml-8 p-3 rounded-lg bg-white/5 text-slate-400 text-sm">
                                            <span className="font-semibold text-slate-300">Giải thích: </span>{d.explanation}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
