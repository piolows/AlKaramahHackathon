import getGeminiApiKey from '@/lib/gemini-key';
import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
const ARASAAC_API = 'https://api.arasaac.org/v1/pictograms/en/bestsearch';
const ARASAAC_IMG = 'https://static.arasaac.org/pictograms';

interface GoalVisualRequest {
  goalName: string;
  goalDescription: string;
  areaName: string;
  plan?: string; // The generated plan text, if available
}

interface GoalVisual {
  label: string;
  searchWord: string;
  alternativeWords: string[];
  pictogramId: number | null;
  pictogramUrl: string | null;
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

    // Prefer AAC-flagged pictograms, then schematic ones
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
    const body: GoalVisualRequest = await request.json();
    const { goalName, goalDescription, areaName, plan } = body;

    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured.' },
        { status: 500 }
      );
    }

    const prompt = `You are helping create ARASAAC pictogram visuals for a special education AET goal.

## AET GOAL
**Area:** ${areaName}
**Goal:** ${goalName}
**Description:** ${goalDescription}
${plan ? `\n**Goal Plan Context:**\n${plan}\n` : ''}

## YOUR TASK

Identify 4-6 key concepts, actions, or objects related to this AET goal that would be useful as ARASAAC pictograms for visual supports. These pictograms will help teachers create visual aids, communication boards, or activity prompts related to this goal.

Think about:
- Core actions/verbs involved in this goal (e.g., "listen", "share", "wait")
- Key objects or concepts (e.g., "friend", "feelings", "turn")
- Social scenarios or settings (e.g., "classroom", "group", "play")

## RESPONSE FORMAT

Return ONLY a valid JSON array. Each item must have:
- "label": A short display label (1-3 words)
- "searchWord": The best single ARASAAC search keyword (simple, concrete English word)
- "alternativeWords": Array of 2-3 alternative search words if the first doesn't find a match

Example:
[
  {"label": "Take Turns", "searchWord": "turn", "alternativeWords": ["share", "wait", "exchange"]},
  {"label": "Listen", "searchWord": "listen", "alternativeWords": ["hear", "attention", "ear"]},
  {"label": "Friend", "searchWord": "friend", "alternativeWords": ["friendship", "companion", "together"]}
]

Return ONLY the JSON array, no other text, no markdown fences.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.5,
          topK: 40,
          topP: 0.95,
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
        { error: errorData.error?.message || 'Failed to generate visuals' },
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
        { error: 'No visuals generated. Please try again.' },
        { status: 500 }
      );
    }

    // Parse the JSON from AI response
    let visualConcepts: { label: string; searchWord: string; alternativeWords: string[] }[];
    try {
      // Strip markdown fences if present
      const cleaned = rawText.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
      visualConcepts = JSON.parse(cleaned);
    } catch {
      console.error('Failed to parse AI response as JSON:', rawText);
      return NextResponse.json(
        { error: 'Failed to parse visual concepts. Please try again.' },
        { status: 500 }
      );
    }

    // Search ARASAAC for each concept
    const visuals: GoalVisual[] = await Promise.all(
      visualConcepts.map(async (concept) => {
        // Try primary search word first
        let result = await searchPictogram(concept.searchWord);

        // Try alternatives if primary didn't find anything
        if (!result && concept.alternativeWords) {
          for (const alt of concept.alternativeWords) {
            result = await searchPictogram(alt);
            if (result) break;
          }
        }

        return {
          label: concept.label,
          searchWord: concept.searchWord,
          alternativeWords: concept.alternativeWords || [],
          pictogramId: result?.id ?? null,
          pictogramUrl: result?.url ?? null,
        };
      })
    );

    return NextResponse.json({ visuals });
  } catch (error) {
    console.error('Error generating goal visuals:', error);
    return NextResponse.json(
      { error: 'An error occurred while generating goal visuals.' },
      { status: 500 }
    );
  }
}
