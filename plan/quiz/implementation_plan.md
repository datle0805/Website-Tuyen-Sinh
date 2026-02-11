# AI Quiz System for Admissions (English Competency Test)

Build a 20-question multiple-choice **English competency quiz** with **two modes**:
1. **Public quiz** (`/quiz`) — anyone (no login) can try a quiz to test their level. Results auto-deleted daily.
2. **Application quiz** (`/quiz/[applicationId]`) — logged-in users take a quiz after submitting an application. Results saved permanently and linked to the application for admin review.

AI generates English quizzes based on education level (Lớp 1 → Đại học). All questions, options, and explanations should be in English (except where Vietnamese is needed for translation-type questions if applicable, but predominantly English).

---

## Backend — Models

### [NEW] Quiz.ts
```typescript
{
  level: string,          // 'Lớp 1' .. 'Đại học' | 'TOEIC'
  questions: [{
    question: string,
    options: string[],     // 4 choices
    correctAnswer: number, // index 0-3
    explanation: string,   // AI hint (English preferred)
    category: string,      // "Grammar", "Vocabulary", "Reading", etc.
  }],
  generatedBy: 'ai' | 'manual',
  createdAt: Date
}
```

### [NEW] QuizResult.ts
```typescript
{
  userId: ObjectId | null,       // null = anonymous
  applicationId: ObjectId | null, // null = public quiz
  quizId: ObjectId,
  level: string,
  answers: number[],
  score: number,
  totalQuestions: number,        // 20
  isAnonymous: boolean,
  completedAt: Date
}
```

### [MODIFY] Application.ts
Add optional field `quizResultId: ObjectId` referencing the linked quiz result.

---

## Backend — AI & Logic

### [MODIFY] ai.service.ts
Add `generateQuiz(level)` method with Vietnamese prompt → 20 questions as strict JSON.

### [NEW] quiz.controller.ts

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/quiz/start` | POST | None | `{ level }` — public quiz |
| `/api/quiz/start-for-application` | POST | `protect` | `{ applicationId }` — uses application's educationLevel |
| `/api/quiz/submit` | POST | None | `{ quizId, answers[], applicationId? }` — grades + saves |
| `/api/quiz/results` | GET | `protect, admin` | All results (filterable) |
| `/api/quiz/results/:applicationId` | GET | `protect, admin` | Result for specific application |

### [NEW] quiz.routes.ts + register in server.ts

### [NEW] cleanup.ts
Daily cron: delete anonymous QuizResult where completedAt < 24h ago.

---

## Frontend

### [NEW] /quiz/page.tsx
Public quiz page — level selector, no login required.

### [NEW] /quiz/[applicationId]/page.tsx
Application-linked quiz — auto-detects level, requires login.

### [MODIFY] submit/page.tsx
Add quiz CTA after successful submission.

### [NEW] /admin/quiz-results/page.tsx
Admin table + detail view of all quiz results.

### [MODIFY] Navbar.tsx
Add "Kiểm tra năng lực" link + admin "Kết quả bài thi" link.
