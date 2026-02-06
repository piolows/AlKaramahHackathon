import getGeminiApiKey from '@/lib/gemini-key';
import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

interface ConsultRequest {
  studentName: string;
  diagnoses: string[];
  question: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ConsultRequest = await request.json();
    const { studentName, diagnoses, question } = body;

    const apiKey = getGeminiApiKey();

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured.' },
        { status: 500 }
      );
    }

    if (!question?.trim()) {
      return NextResponse.json(
        { error: 'Please enter a question.' },
        { status: 400 }
      );
    }

    const prompt = `You are a knowledgeable special education consultant with expertise in developmental and behavioral conditions in children. A teacher is asking you a question about a student's diagnoses.

## STUDENT CONTEXT

**Student Name:** ${studentName}
**Diagnoses:**
${diagnoses.map(d => `- ${d}`).join('\n')}

## TEACHER'S QUESTION

${question}

## INSTRUCTIONS

- Answer the question specifically in the context of the student's diagnoses listed above.
- Be practical and classroom-focused — the teacher needs actionable information.
- If relevant, explain how the diagnoses may interact with each other.
- Keep your answer concise but thorough (200-300 words max).
- Use clear headings and bullet points for readability.
- If the question is outside your expertise or requires medical advice, clearly state that and recommend consulting a specialist.
- Do not diagnose or prescribe — provide educational and behavioral guidance only.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1500,
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
        return NextResponse.json(
          { error: 'Rate limit reached. Please wait a moment and try again.' },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to get response.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    // Gemini 2.5 Flash returns "thought" parts (internal reasoning) and text parts.
    // Filter out thought parts and concatenate actual text output.
    const candidate = data.candidates?.[0];
    const parts = candidate?.content?.parts || [];
    const textParts = parts.filter((p: any) => p.text && !p.thought);
    const answer = textParts.map((p: any) => p.text).join('') || null;

    if (!answer) {
      return NextResponse.json(
        { error: 'No response generated. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ answer });

  } catch (error) {
    console.error('Error in consult API:', error);
    return NextResponse.json(
      { error: 'An error occurred.' },
      { status: 500 }
    );
  }
}
