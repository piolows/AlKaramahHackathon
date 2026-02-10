import getGeminiApiKey from '@/lib/gemini-key';
import { NextRequest, NextResponse } from 'next/server';

// Google Gemini API integration
// To get your free API key:
// 1. Go to https://aistudio.google.com/apikey
// 2. Click "Create API Key"
// 3. Copy the key and add it to your .env.local file

// Using Gemini 2.5 Flash - latest and best free model
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

interface GeneratePlanRequest {
  student: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    className?: string;
    diagnoses: string[];
    strengths: string[];
    challenges: string[];
    interests: string[];
    sensoryNeeds: string[];
    communicationStyle: string;
    supportStrategies: string[];
    triggers: string[];
    calmingStrategies: string[];
    teacherNotes?: string;
  };
  component: {
    name: string;
    description: string;
    currentLevel: number;
    currentLevelDescription: string;
    nextLevelDescription: string | null;
    areaName: string;
  };
  customInstructions?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GeneratePlanRequest = await request.json();
    const { student, component, customInstructions } = body;

    const apiKey = getGeminiApiKey();
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured. Please add GEMINI_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    // Build a detailed prompt for the AI
    const prompt = buildPrompt(student, component, customInstructions);

    // Call Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192, // Increased for Gemini 2.5 Flash thinking model
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_NONE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_NONE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_NONE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_NONE'
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', JSON.stringify(errorData, null, 2));
      
      // Check for rate limit error
      if (response.status === 429) {
        const retryMatch = errorData.error?.message?.match(/retry in ([\d.]+)s/i);
        const retrySeconds = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : 30;
        return NextResponse.json(
          { error: `Rate limit reached. Please wait ${retrySeconds} seconds and try again.` },
          { status: 429 }
        );
      }
      
      const errorMessage = errorData.error?.message || 'Failed to generate plan';
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Extract the generated text from Gemini's response
    // Gemini 2.5 Flash is a "thinking" model that returns multiple parts:
    // - Thought parts (thought: true) are internal reasoning — skip these
    // - Text parts without thought flag are the actual output
    const candidate = data.candidates?.[0];
    const parts = candidate?.content?.parts || [];
    const textParts = parts.filter((p: any) => p.text && !p.thought);
    const generatedPlan = textParts.map((p: any) => p.text).join('') || null;

    if (!generatedPlan) {
      return NextResponse.json(
        { error: 'No plan generated. Please try again.' },
        { status: 500 }
      );
    }

    // Check if generation was cut off
    const finishReason = candidate?.finishReason;
    if (finishReason === 'MAX_TOKENS') {
      // Still return what we have, but it may be truncated
      console.warn('Plan generation was truncated due to MAX_TOKENS');
    }

    return NextResponse.json({ plan: replaceResourceTokens(generatedPlan) });

  } catch (error) {
    console.error('Error generating plan:', error);
    return NextResponse.json(
      { error: 'An error occurred while generating the plan.' },
      { status: 500 }
    );
  }
}

function buildPrompt(
  student: GeneratePlanRequest['student'],
  component: GeneratePlanRequest['component'],
  customInstructions?: string
): string {
  const age = calculateAge(student.dateOfBirth);
  
  return `You are an expert special education teacher specializing in autism education, specifically trained in the Autism Education Trust (AET) Progression Framework. You are writing a concise goal overview for a teacher.

## STUDENT PROFILE

**Name:** ${student.firstName} ${student.lastName}
**Age:** ${age} years old
${student.className ? `**Class:** ${student.className}` : ''}

**Diagnoses:**
${student.diagnoses.map(d => `- ${d}`).join('\n')}

**Strengths:**
${student.strengths.map(s => `- ${s}`).join('\n')}

**Challenges:**
${student.challenges.map(c => `- ${c}`).join('\n')}

**Interests:**
${student.interests.map(i => `- ${i}`).join('\n')}

**Sensory Needs:**
${student.sensoryNeeds.map(s => `- ${s}`).join('\n')}

**Communication Style:** ${student.communicationStyle}

**Effective Support Strategies:**
${student.supportStrategies.map(s => `- ${s}`).join('\n')}

**Known Triggers:**
${student.triggers.map(t => `- ${t}`).join('\n')}

**Calming Strategies:**
${student.calmingStrategies.map(c => `- ${c}`).join('\n')}

${student.teacherNotes ? `**Teacher Notes:**\n${student.teacherNotes}` : ''}

---

## TARGET AET GOAL

**Area:** ${component.areaName}
**Skill:** ${component.name}
**Description:** ${component.description}

**Current Level (${component.currentLevel}/4):** ${component.currentLevelDescription}
${component.nextLevelDescription ? `**Target (Next Level):** ${component.nextLevelDescription}` : '**Note:** Student is at the highest level - focus on maintenance and generalization.'}

---

${customInstructions ? `## TEACHER'S ADDITIONAL CONTEXT
${customInstructions}

---

` : ''}## YOUR TASK

Write a short, helpful goal overview for this child. This is for a school for autistic children following a British curriculum. Keep it personalised to this specific child — reference their profile, strengths, and interests where relevant.

## REQUIRED FORMAT (keep it concise!)

**What This Goal Means:**
[2-3 sentences explaining what this AET skill/goal involves in plain language. What does it look like in practice?]

**Advice & Guidance:**
[3-4 bullet points of practical tips specific to this child — reference their strengths, interests, and communication style]

**What Success Looks Like for ${student.firstName}:**
[2-3 observable, realistic indicators that ${student.firstName} is progressing — personalised to their profile]

**Helpful Resources:**
[Suggest exactly 3 online resources relevant to this specific AET goal and the child's profile. Use the EXACT token format below — do NOT write URLs yourself. Our system will convert these tokens into real links automatically.]

FORMAT: {{PLATFORM|search terms}} — 1-line description of how it helps with this goal

Available platforms (use EXACTLY these names in the token):
- Twinkl — printable resources, visual aids, lesson packs
- BBC Bitesize — interactive clips and activities
- ARASAAC — free pictograms and symbol-based visuals
- TES — teacher-shared materials and worksheets
- Teach Starter — differentiated worksheets and games
- YouTube — video demonstrations, strategy examples
- SEN Teacher — free printable SEN resources (no search — use as: {{SEN Teacher|}})
- AET — AET tools and guides (no search — use as: {{AET|}})
- Widgit — symbol-supported materials (no search — use as: {{Widgit|}})

EXAMPLES:
- {{Twinkl|social stories turn taking autism}} — Printable social stories for turn-taking
- {{YouTube|attention autism bucket time}} — Video examples of bucket time strategies
- {{ARASAAC|emotions feelings}} — Pictograms for emotion recognition visuals

[Only include platforms genuinely relevant to this goal. Keep to exactly 3 suggestions.]

Keep the first three sections under 120 words total. Be warm, practical, and specific to this child. No generic advice.`;
}

// Map platform tokens to real, verified search URLs
const RESOURCE_URL_MAP: Record<string, (query: string) => string> = {
  'twinkl': (q) => q
    ? `https://www.twinkl.co.uk/search?term=${encodeURIComponent(q)}`
    : 'https://www.twinkl.co.uk/resources/specialeducationalneeds-sen',
  'bbc bitesize': (q) => q
    ? `https://www.bbc.co.uk/bitesize/search?q=${encodeURIComponent(q)}`
    : 'https://www.bbc.co.uk/bitesize',
  'arasaac': (q) => q
    ? `https://arasaac.org/pictograms/search/${encodeURIComponent(q)}`
    : 'https://arasaac.org/pictograms/search',
  'tes': (q) => q
    ? `https://www.tes.com/teaching-resources/search/?q=${encodeURIComponent(q)}`
    : 'https://www.tes.com/teaching-resources/hub/whole-school/special-educational-needs',
  'teach starter': (q) => q
    ? `https://www.teachstarter.com/search/?q=${encodeURIComponent(q)}`
    : 'https://www.teachstarter.com/',
  'youtube': (q) => q
    ? `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`
    : 'https://www.youtube.com/',
  'sen teacher': () => 'https://www.senteacher.org/',
  'aet': () => 'https://www.autismeducationtrust.org.uk/resources',
  'widgit': () => 'https://www.widgitonline.com/',
};

// Replace {{Platform|search terms}} tokens with real markdown hyperlinks
function replaceResourceTokens(plan: string): string {
  return plan.replace(/\{\{([^|}]+)\|([^}]*)\}\}/g, (_match, platform: string, query: string) => {
    const key = platform.trim().toLowerCase();
    const searchTerms = query.trim();
    const urlBuilder = RESOURCE_URL_MAP[key];
    if (urlBuilder) {
      const url = urlBuilder(searchTerms);
      const label = searchTerms
        ? `${platform.trim()}: ${searchTerms}`
        : platform.trim();
      return `[${label}](${url})`;
    }
    // Unknown platform — return as plain text
    return searchTerms ? `${platform.trim()} (${searchTerms})` : platform.trim();
  });
}

function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}
