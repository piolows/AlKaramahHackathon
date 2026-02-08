import getGeminiApiKey from '@/lib/gemini-key';
import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

interface RefineLessonRequest {
  currentLesson: string;
  teacherFeedback: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RefineLessonRequest = await request.json();
    const { currentLesson, teacherFeedback } = body;

    if (!currentLesson || !teacherFeedback) {
      return NextResponse.json(
        { error: 'Both the current lesson and your feedback are required.' },
        { status: 400 }
      );
    }

    const apiKey = getGeminiApiKey();

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured. Please add GEMINI_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    const prompt = `You are an expert special education teacher. A teacher has generated a lesson plan and wants you to refine it based on their feedback.

## CURRENT LESSON PLAN

${currentLesson}

---

## TEACHER'S FEEDBACK / REQUESTED CHANGES

${teacherFeedback}

---

## YOUR TASK

Revise the lesson plan above based on the teacher's feedback. Keep the same overall structure and format, but incorporate their requested changes. Only modify what the teacher has asked for — keep everything else intact.

Output ONLY the revised lesson plan in the same markdown format. Do not include any preamble, explanation, or commentary — just the updated lesson.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 16384,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', JSON.stringify(errorData, null, 2));

      if (response.status === 429) {
        const retryMatch = errorData.error?.message?.match(/retry in ([\d.]+)s/i);
        const retrySeconds = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : 30;
        return NextResponse.json(
          { error: `Rate limit reached. Please wait ${retrySeconds} seconds and try again.` },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to refine lesson' },
        { status: response.status }
      );
    }

    const data = await response.json();

    const candidate = data.candidates?.[0];
    const parts = candidate?.content?.parts || [];
    const textParts = parts.filter((p: { text?: string; thought?: boolean }) => p.text && !p.thought);
    const refinedLesson = textParts.map((p: { text: string }) => p.text).join('') || null;

    if (!refinedLesson) {
      return NextResponse.json(
        { error: 'No refined lesson generated. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ lesson: refinedLesson });
  } catch (error) {
    console.error('Error refining lesson:', error);
    return NextResponse.json(
      { error: 'An error occurred while refining the lesson.' },
      { status: 500 }
    );
  }
}
