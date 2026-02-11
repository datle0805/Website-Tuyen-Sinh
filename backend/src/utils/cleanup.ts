import QuizResult from "../models/QuizResult";

const CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours
const ANONYMOUS_RESULT_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Delete anonymous quiz results older than 24 hours
 */
async function cleanupAnonymousResults() {
    try {
        const cutoff = new Date(Date.now() - ANONYMOUS_RESULT_MAX_AGE_MS);
        const result = await QuizResult.deleteMany({
            isAnonymous: true,
            completedAt: { $lt: cutoff },
        });
        console.log(`[Cleanup] Deleted ${result.deletedCount} anonymous quiz results`);
    } catch (error) {
        console.error("[Cleanup] Failed to delete anonymous quiz results:", error);
    }
}

/**
 * Start the daily cleanup schedule
 */
export function startCleanupSchedule() {
    // Run once on startup
    cleanupAnonymousResults();

    // Then run every 24 hours
    setInterval(cleanupAnonymousResults, CLEANUP_INTERVAL_MS);

    console.log("[Cleanup] Anonymous quiz result cleanup scheduled (every 24h)");
}
