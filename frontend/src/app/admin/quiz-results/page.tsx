"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Trophy, ChevronDown, ChevronUp, CheckCircle, XCircle, Search, Filter, BookOpen, Clock, User, GraduationCap } from "lucide-react";
import api from "@/lib/api";

interface QuizResultItem {
    _id: string;
    userId: { _id: string; name: string; email: string } | null;
    applicationId: { _id: string; applicationNumber: string; fullName: string; educationLevel: string } | null;
    level: string;
    score: number;
    totalQuestions: number;
    completedAt: string;
    isAnonymous: boolean;
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

export default function AdminQuizResults() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [results, setResults] = useState<QuizResultItem[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [filterLevel, setFilterLevel] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [expandedDetails, setExpandedDetails] = useState<QuizDetail[] | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const LEVELS = [
        '', 'Mẫu giáo',
        'Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5',
        'Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9',
        'Lớp 10', 'Lớp 11', 'Lớp 12',
        'Đại học', 'TOEIC'
    ];

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated" && (session?.user as any)?.role !== 'admin') {
            router.push("/");
        }
    }, [status, session, router]);

    const fetchResults = useCallback(async () => {
        setLoading(true);
        try {
            const params: any = { page, limit: 15 };
            if (filterLevel) params.level = filterLevel;
            const res = await api.get('/api/quiz/results', { params });
            setResults(res.data.results);
            setTotal(res.data.total);
            setTotalPages(res.data.totalPages);
        } catch (err: any) {
            console.error('Failed to fetch quiz results:', err);
        } finally {
            setLoading(false);
        }
    }, [page, filterLevel]);

    useEffect(() => {
        if (status === "authenticated" && (session?.user as any)?.role === 'admin') {
            fetchResults();
        }
    }, [status, session, fetchResults]);

    const handleExpand = async (result: QuizResultItem) => {
        if (expandedId === result._id) {
            setExpandedId(null);
            setExpandedDetails(null);
            return;
        }

        setExpandedId(result._id);
        setLoadingDetails(true);
        try {
            if (result.applicationId) {
                const res = await api.get(`/api/quiz/results/${result.applicationId._id}`);
                setExpandedDetails(res.data.details);
            }
        } catch (err) {
            console.error('Failed to fetch details', err);
        } finally {
            setLoadingDetails(false);
        }
    };

    const getScoreColor = (score: number, total: number) => {
        const pct = (score / total) * 100;
        if (pct >= 70) return 'text-emerald-400';
        if (pct >= 50) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getScoreBg = (score: number, total: number) => {
        const pct = (score / total) * 100;
        if (pct >= 70) return 'bg-emerald-500/10 border-emerald-500/30';
        if (pct >= 50) return 'bg-yellow-500/10 border-yellow-500/30';
        return 'bg-red-500/10 border-red-500/30';
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#020617]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500" />
            </div>
        );
    }

    return (
        <main className="min-h-screen relative overflow-hidden font-body">
            <div className="fixed inset-0 bg-[#020617]" />
            <div className="fixed inset-0 bg-grid opacity-20" />
            <div className="fixed top-[-10%] left-[-5%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] animate-blob" />

            <div className="relative z-10 py-20 px-4 max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-black text-white font-heading mb-2">
                        Kết quả bài thi Tiếng Anh
                    </h1>
                    <p className="text-slate-400">
                        {total} kết quả
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 mb-8">
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10">
                        <Filter className="h-4 w-4 text-slate-400" />
                        <select
                            value={filterLevel}
                            onChange={(e) => { setFilterLevel(e.target.value); setPage(1); }}
                            className="bg-transparent text-sm text-slate-300 outline-none cursor-pointer"
                        >
                            <option value="" className="bg-slate-900">Tất cả trình độ</option>
                            {LEVELS.filter(Boolean).map(l => (
                                <option key={l} value={l} className="bg-slate-900">{l}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Results Table */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500" />
                    </div>
                ) : results.length === 0 ? (
                    <div className="text-center py-20">
                        <Trophy className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400 text-lg">Chưa có kết quả nào</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {results.map((r) => (
                            <div key={r._id} className="glass-card rounded-2xl overflow-hidden">
                                {/* Row */}
                                <button
                                    onClick={() => handleExpand(r)}
                                    className="cursor-pointer w-full p-5 flex items-center gap-4 text-left hover:bg-white/5 transition-all"
                                >
                                    {/* Score Circle */}
                                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl border flex items-center justify-center font-black text-lg ${getScoreBg(r.score, r.totalQuestions)} ${getScoreColor(r.score, r.totalQuestions)}`}>
                                        {r.score}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-white font-semibold truncate">
                                                {r.applicationId?.fullName || r.userId?.name || 'Ẩn danh'}
                                            </p>
                                            <span className="px-2 py-0.5 rounded-full bg-white/5 text-xs text-slate-400">
                                                {r.level}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-slate-500">
                                            {r.applicationId && (
                                                <span className="flex items-center gap-1">
                                                    <GraduationCap className="h-3 w-3" />
                                                    {r.applicationId.applicationNumber}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {new Date(r.completedAt).toLocaleDateString('vi-VN')}
                                            </span>
                                            {r.userId && (
                                                <span className="flex items-center gap-1">
                                                    <User className="h-3 w-3" />
                                                    {r.userId.email}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Score percentage */}
                                    <div className="hidden sm:block text-right">
                                        <span className={`text-2xl font-black ${getScoreColor(r.score, r.totalQuestions)}`}>
                                            {Math.round((r.score / r.totalQuestions) * 100)}%
                                        </span>
                                        <p className="text-xs text-slate-500">{r.score}/{r.totalQuestions}</p>
                                    </div>

                                    <div className="flex-shrink-0">
                                        {expandedId === r._id
                                            ? <ChevronUp className="h-5 w-5 text-slate-400" />
                                            : <ChevronDown className="h-5 w-5 text-slate-400" />
                                        }
                                    </div>
                                </button>

                                {/* Expanded Details */}
                                {expandedId === r._id && (
                                    <div className="border-t border-white/5 p-5 animate-fadeIn">
                                        {loadingDetails ? (
                                            <div className="flex items-center justify-center py-8">
                                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-emerald-500" />
                                            </div>
                                        ) : expandedDetails ? (
                                            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                                                {expandedDetails.map((d, idx) => (
                                                    <div key={idx} className={`flex items-start gap-3 p-4 rounded-xl ${d.isCorrect ? 'bg-emerald-500/5' : 'bg-red-500/5'}`}>
                                                        {d.isCorrect
                                                            ? <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-1" />
                                                            : <XCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-1" />
                                                        }
                                                        <div className="min-w-0">
                                                            <p className="text-xs text-slate-500 mb-1">{d.category} • Câu {idx + 1}</p>
                                                            <p className="text-sm text-white mb-2">{d.question}</p>
                                                            <div className="flex flex-wrap gap-2 text-xs">
                                                                <span className={`px-2 py-1 rounded-lg ${d.isCorrect
                                                                    ? 'bg-emerald-500/20 text-emerald-300'
                                                                    : 'bg-red-500/20 text-red-300'
                                                                    }`}>
                                                                    Trả lời: {String.fromCharCode(65 + d.userAnswer)}. {d.options[d.userAnswer]}
                                                                </span>
                                                                {!d.isCorrect && (
                                                                    <span className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-300">
                                                                        Đúng: {String.fromCharCode(65 + d.correctAnswer)}. {d.options[d.correctAnswer]}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-slate-400 text-sm text-center py-4">Không thể tải chi tiết</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="cursor-pointer px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
                        >
                            Trước
                        </button>
                        <span className="text-slate-400 text-sm px-3">
                            {page}/{totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="cursor-pointer px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
                        >
                            Sau
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}
