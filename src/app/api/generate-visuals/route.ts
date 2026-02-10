import getGeminiApiKey from '@/lib/gemini-key';
import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
const ARASAAC_API = 'https://api.arasaac.org/v1/pictograms/en/bestsearch';
const ARASAAC_IMG = 'https://static.arasaac.org/pictograms';

interface VisualStep {
  label: string;
  searchWord: string;
  alternativeWords: string[];
  pictogramId: number | null;
  pictogramUrl: string | null;
}

interface GenerateVisualsRequest {
  lessonContent: string;
  type?: 'lesson_schedule' | 'student_tasks' | 'custom';
  studentProfile?: {
    firstName: string;
    lastName: string;
    diagnoses: string[];
    strengths: string[];
    challenges: string[];
    interests: string[];
    sensoryNeeds: string[];
    communicationStyle: string;
    supportStrategies: string[];
  };
  customPrompt?: string;
  stepCount?: number; // target number of steps (taken from lesson schedule length)
}

// Search ARASAAC for a pictogram matching a keyword
async function searchPictogram(keyword: string): Promise<{ id: number; url: string } | null> {
  try {
    const res = await fetch(`${ARASAAC_API}/${encodeURIComponent(keyword.toLowerCase())}`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    // Prefer AAC-flagged pictograms (designed for communication aids), then schematic ones
    const sorted = [...data].sort((a, b) => {
      if (a.aac && !b.aac) return -1;
      if (!a.aac && b.aac) return 1;
      if (a.schematic && !b.schematic) return -1;
      if (!a.schematic && b.schematic) return 1;
      return 0;
    });

    const best = sorted[0];
    return {
      id: best._id,
      url: `${ARASAAC_IMG}/${best._id}/${best._id}_500.png`,
    };
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateVisualsRequest = await request.json();
    const { lessonContent, type = 'lesson_schedule', studentProfile, customPrompt, stepCount } = body;

    if (!lessonContent && type !== 'custom') {
      return NextResponse.json(
        { error: 'Lesson content is required.' },
        { status: 400 }
      );
    }

    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured.' },
        { status: 500 }
      );
    }

    const targetSteps = stepCount ? `exactly ${stepCount}` : '6-12';

    // Build prompt based on type
    let prompt: string;

    if (type === 'student_tasks' && studentProfile) {
      prompt = `You are helping create a PECS-style individual task schedule for an autistic student. Given a lesson plan and the student's profile, extract the KEY TASKS/ACTIVITIES that THIS SPECIFIC STUDENT will do during the lesson.

## STUDENT PROFILE

Name: ${studentProfile.firstName} ${studentProfile.lastName}
Diagnoses: ${studentProfile.diagnoses.join(', ') || 'Not specified'}
Strengths: ${studentProfile.strengths.join(', ') || 'Not specified'}
Challenges: ${studentProfile.challenges.join(', ') || 'Not specified'}
Interests: ${studentProfile.interests.join(', ') || 'Not specified'}
Sensory Needs: ${studentProfile.sensoryNeeds.join(', ') || 'Not specified'}
Communication Style: ${studentProfile.communicationStyle || 'Not specified'}
Support Strategies: ${studentProfile.supportStrategies.join(', ') || 'Not specified'}

## LESSON PLAN

${lessonContent}

---

## YOUR TASK

Create ${targetSteps} task cards for ${studentProfile.firstName}'s individual visual schedule during this lesson. Focus on:
- What ${studentProfile.firstName} specifically needs to do at each stage
- Include any differentiated tasks mentioned for this student in the lesson
- Add support steps (e.g., "use communication board", "sensory break") that match their profile
- Include transitions and rewards/motivators based on their interests
- Keep it personalized — not generic lesson steps, but what THIS child does

Return ONLY valid JSON, nothing else. No markdown code fences. Use this exact format:

[
  {
    "label": "Sit Down",
    "searchWord": "sit",
    "alternativeWords": ["chair", "seat"]
  }
]

Rules:
- ${targetSteps} steps
- Labels should be 1-3 words, child-friendly, in ENGLISH AND ARABIC ([English version] / [Arabic version])
- searchWord should be ONE simple, common English word (noun or verb)
- alternativeWords: 2-3 fallback single words
- Think about what pictograms would actually exist
- Include personal supports and transitions
- Keep it in lesson order`;
    } else if (type === 'custom' && customPrompt) {
      prompt = `You are helping create a PECS-style visual schedule/task board for autistic children. A teacher has described what they want. Create pictogram cards based on their description.

## TEACHER'S REQUEST

${customPrompt}

---

## YOUR TASK

Create ${targetSteps} visual cards based on the teacher's request above. Think about what would work well as individual pictogram cards on a visual strip.

Return ONLY valid JSON, nothing else. No markdown code fences. Use this exact format:

[
  {
    "label": "Sit Down",
    "searchWord": "sit",
    "alternativeWords": ["chair", "seat"]
  }
]

Rules:
- ${targetSteps} steps
- Labels should be 1-3 words, child-friendly, in ENGLISH AND ARABIC ([English version] / [Arabic version])
- searchWord should be ONE simple, common English word (noun or verb)
- alternativeWords: 2-3 fallback single words
- Think about what pictograms would actually exist: common objects, actions, body parts, emotions, school items
- Match the teacher's request as closely as possible`;
    } else {
      // Default: lesson_schedule (original behavior)
      prompt = `You are helping create a PECS-style visual schedule for autistic children. Given a lesson plan, extract the KEY ACTIVITY STEPS in chronological order.

## LESSON PLAN

${lessonContent}

---

## YOUR TASK

Extract 6-12 key steps from this lesson that a child would follow during the day. Each step should be a simple activity/action that can be represented by a single pictogram symbol.

Think about what a visual schedule strip on the wall would look like — simple, clear steps like:
"sit down", "listen", "count", "draw", "play", "wash hands", "snack time", etc.

Return ONLY valid JSON, nothing else. No markdown code fences. Use this exact format:

[
  {
    "label": "Sit Down",
    "searchWord": "sit",
    "alternativeWords": ["chair", "seat"]
  },
  {
    "label": "Listen",
    "searchWord": "listen",
    "alternativeWords": ["hear", "ear"]
  }
]

Rules:
- 6-12 steps maximum
- Labels should be 1-3 words, child-friendly, in ENGLISH AND ARABIC ([English version] / [Arabic version])
- searchWord should be ONE simple, common English word (noun or verb) — this will be used to search a pictogram database
- alternativeWords: 2-3 fallback single words if the first doesn't match
- Think about what pictograms would actually exist: common objects, actions, body parts, emotions, school items
- Include transitions: "sit down", "tidy up", "well done" etc.
- Keep it in lesson order`;
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          topK: 20,
          topP: 0.9,
          maxOutputTokens: 4096,
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
      if (response.status === 429) {
        const retryMatch = errorData.error?.message?.match(/retry in ([\d.]+)s/i);
        const retrySeconds = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : 30;
        return NextResponse.json(
          { error: `Rate limit reached. Please wait ${retrySeconds} seconds and try again.` },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to extract visual steps' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const parts = candidate?.content?.parts || [];
    const textParts = parts.filter((p: { text?: string; thought?: boolean }) => p.text && !p.thought);
    const rawText = textParts.map((p: { text: string }) => p.text).join('');

    if (!rawText) {
      return NextResponse.json(
        { error: 'No visual steps generated. Please try again.' },
        { status: 500 }
      );
    }

    // Parse the JSON response from AI
    let steps: { label: string; searchWord: string; alternativeWords: string[] }[];
    try {
      // Strip any markdown code fences if present
      const cleaned = rawText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      steps = JSON.parse(cleaned);
    } catch {
      console.error('Failed to parse AI response:', rawText);
      return NextResponse.json(
        { error: 'Failed to parse visual steps. Please try again.' },
        { status: 500 }
      );
    }

    // Step 2: Search ARASAAC for pictograms for each step
    const visualSteps: VisualStep[] = await Promise.all(
      steps.map(async (step) => {
        // Try primary search word first
        let result = await searchPictogram(step.searchWord);

        // Try alternatives if primary fails
        if (!result && step.alternativeWords) {
          for (const alt of step.alternativeWords) {
            result = await searchPictogram(alt);
            if (result) break;
          }
        }

        return {
          label: step.label,
          searchWord: step.searchWord,
          alternativeWords: step.alternativeWords || [],
          pictogramId: result?.id || null,
          pictogramUrl: result?.url || null,
        };
      })
    );

    return NextResponse.json({ steps: visualSteps });
  } catch (error) {
    console.error('Error generating visuals:', error);
    return NextResponse.json(
      { error: 'An error occurred while generating visuals.' },
      { status: 500 }
    );
  }
}
