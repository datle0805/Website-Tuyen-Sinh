import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

export class AIServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AIServiceError';
  }
}

const logger = {
  info: (msg: any, ...args: any[]) => console.log(`[INFO]`, msg, ...args),
  error: (msg: any, ...args: any[]) => console.error(`[ERROR]`, msg, ...args),
};

type AIProvider = 'openai' | 'gemini';

export class AIService {
  private openai?: OpenAI;
  private gemini?: GoogleGenerativeAI;
  private provider: AIProvider;
  private model: string;

  constructor() {
    // Determine which AI provider to use
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (geminiKey) {
      this.provider = 'gemini';
      this.gemini = new GoogleGenerativeAI(geminiKey);
      this.model = process.env.AI_MODEL || 'gemini-2.5-flash';
      logger.info(`Using Gemini AI provider with model: ${this.model}`);
    } else if (openaiKey) {
      this.provider = 'openai';
      this.openai = new OpenAI({ apiKey: openaiKey });
      this.model = process.env.AI_MODEL || 'gpt-4-turbo-preview';
      logger.info('Using OpenAI provider');
    } else {
      throw new Error(
        'Either GEMINI_API_KEY or OPENAI_API_KEY environment variable is required'
      );
    }
  }

  /**
   * Generate a quiz with 20 multiple-choice questions for a given education level
   */
  async generateQuiz(level: string): Promise<{
    questions: Array<{
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
      category: string;
    }>;
    usage?: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
  }> {
    const systemPrompt = this.getQuizSystemPrompt();
    const userPrompt = this.getQuizUserPrompt(level);

    try {
      let responseText: string;
      let usage: any;

      if (this.provider === 'gemini' && this.gemini) {
        const result = await this.callGemini(systemPrompt, userPrompt);
        responseText = result.text;
        usage = result.usage;
      } else if (this.provider === 'openai' && this.openai) {
        const result = await this.callOpenAI(systemPrompt, userPrompt, 0.7);
        responseText = result.text;
        usage = result.usage;
      } else {
        throw new AIServiceError('AI provider not properly initialized');
      }

      if (usage) {
        console.log(`[AI Quota] Model: ${this.model} | Prompt: ${usage.promptTokens} | Completion: ${usage.completionTokens} | Total: ${usage.totalTokens}`);
      }

      const parsedResponse = JSON.parse(responseText);

      // Validate basic structure
      if (!parsedResponse.questions || !Array.isArray(parsedResponse.questions)) {
        throw new AIServiceError('Invalid quiz response: missing questions array');
      }

      if (parsedResponse.questions.length !== 20) {
        throw new AIServiceError(`Invalid quiz response: expected 20 questions, got ${parsedResponse.questions.length}`);
      }

      // Validate each question
      for (const q of parsedResponse.questions) {
        if (!q.question || !q.options || q.options.length !== 4 ||
          typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3 ||
          !q.explanation || !q.category) {
          throw new AIServiceError('Invalid quiz question structure');
        }
      }

      logger.info('AI quiz generation completed successfully for level:', level);
      return {
        questions: parsedResponse.questions,
        usage
      };
    } catch (error: any) {
      logger.error('AI quiz generation failed:', error.message);

      if (error.status === 429 || error.message?.includes('quota')) {
        throw new AIServiceError('AI service rate limit exceeded. Please try again later.');
      }

      if (error instanceof AIServiceError) {
        throw error;
      }

      throw new AIServiceError(`Quiz generation failed: ${error.message}`);
    }
  }

  /**
   * Call OpenAI API
   */
  private async callOpenAI(
    systemPrompt: string,
    userPrompt: string,
    temperature: number
  ): Promise<{ text: string; usage?: any }> {
    if (!this.openai) {
      throw new AIServiceError('OpenAI not initialized');
    }

    const completion = await this.openai.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature,
    });

    const responseText = completion.choices[0].message.content;
    const usage = completion.usage ? {
      promptTokens: completion.usage.prompt_tokens,
      completionTokens: completion.usage.completion_tokens,
      totalTokens: completion.usage.total_tokens
    } : undefined;

    if (!responseText) {
      throw new AIServiceError('Empty response from OpenAI');
    }

    return { text: responseText, usage };
  }

  /**
   * Call Gemini API
   */
  private async callGemini(
    systemPrompt: string,
    userPrompt: string
  ): Promise<{ text: string; usage?: any }> {
    if (!this.gemini) {
      throw new AIServiceError('Gemini not initialized');
    }

    const model = this.gemini.getGenerativeModel({
      model: this.model,
      generationConfig: {
        temperature: 0.4,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json',
      },
    });

    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const responseText = response.text();
    const usageMetadata = response.usageMetadata;

    const usage = usageMetadata ? {
      promptTokens: usageMetadata.promptTokenCount,
      completionTokens: usageMetadata.candidatesTokenCount,
      totalTokens: usageMetadata.totalTokenCount
    } : undefined;

    if (!responseText) {
      throw new AIServiceError('Empty response from Gemini');
    }

    return { text: responseText, usage };
  }

  /**
   * System prompt for quiz generation
   */
  private getQuizSystemPrompt(): string {
    return `You are a professional English teacher. Your task is to create a 20-question multiple-choice English competency test appropriate for the requested education level.

IMPORTANT: You MUST return valid JSON. DO NOT include markdown, explanations, or text outside the JSON structure.

Requirements:
1. Create exactly 20 multiple-choice questions.
2. Each question must have 4 options (A, B, C, D).
3. Questions must be appropriate for the requested level.
4. Categories should include: Grammar, Vocabulary, Reading Comprehension, and Life Skills/Common Expressions.
5. Provide a brief explanation for why the correct answer is right (in English).
6. Questions and options must be in English.
7. Difficulty should be consistent with the level.

Return JSON in the following format:
{
  "questions": [
    {
      "question": "Question content?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Explanation of why Option A is correct",
      "category": "Grammar"
    }
  ]
}

Notes:
- correctAnswer is the index (0, 1, 2, or 3) corresponding to the correct option in the options array.
- category must be one of: "Grammar", "Vocabulary", "Reading", "Communication".`;
  }

  /**
   * User prompt for quiz generation
   */
  private getQuizUserPrompt(level: string): string {
    const levelContext: Record<string, string> = {
      'Mẫu giáo': 'Pre-school level: Basic colors, shapes, numbers 1-10, common animals, and greetings.',
      'Lớp 1': 'Grade 1: Phonics, basic nouns/verbs, self-introduction, family members.',
      'Lớp 2': 'Grade 2: Simple sentences, present continuous, basic prepositions, school items.',
      'Lớp 3': 'Grade 3: Past simple (basic), comparative adjectives, hobbies, weather.',
      'Lớp 4': 'Grade 4: Frequency adverbs, modal verbs (can/must), daily routines, jobs.',
      'Lớp 5': 'Grade 5: Future tense, directions, health problems, superlatives.',
      'Lớp 6': 'Grade 6: Pronouns, possessives, school subjects, neighborhood.',
      'Lớp 7': 'Grade 7: Quantifiers, compound sentences, past simple (irregular), movies.',
      'Lớp 8': 'Grade 8: Passive voice, reported speech (basic), festivities, technology.',
      'Lớp 9': 'Grade 9: Relative clauses, conditional sentences type 1 & 2, environment.',
      'Lớp 10': 'Grade 10: Tense review, gerunds/infinitives, eco-tourism, inventions.',
      'Lớp 11': 'Grade 11: Perfect tenses, modal verbs in past, friendship, population.',
      'Lớp 12': 'Grade 12: Advanced grammar, conditional sentences type 3, careers, globalization.',
      'Đại học': 'University level: Academic English, complex sentence structures, IELTS/TOEFL topics, critical thinking.',
      'TOEIC': 'TOEIC level: Business English, office situations, travel, banking, marketing, and formal emails.',
    };

    const context = levelContext[level] || 'General English competency';

    return `Generate 20 multiple-choice English questions for level: ${level}

Level Context: ${context}

Requirements:
- Questions must be appropriate for ${level} level.
- Balanced distribution of Grammar, Vocabulary, and Reading categories.
- Ensure only ONE correct answer exists for each question.
- Explanations should be clear and concise in English.

Return exactly 20 questions in the specified JSON format.`;
  }
}
