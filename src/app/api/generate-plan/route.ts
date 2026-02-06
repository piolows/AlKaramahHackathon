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
          maxOutputTokens: 1500,
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

    return NextResponse.json({ plan: generatedPlan });

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
  
  return `You are an expert special education teacher specializing in autism education, specifically trained in the Autism Education Trust (AET) Progression Framework. Your task is to create a detailed, personalized teaching plan.

## STUDENT PROFILE

**Name:** ${student.firstName} ${student.lastName}
**Age:** ${age} years old
${student.className ? `**Class:** ${student.className}` : ''}

**Diagnoses:**
${student.diagnoses.map(d => `- ${d}`).join('\n')}

**Strengths (USE THESE in your plan!):**
${student.strengths.map(s => `- ${s}`).join('\n')}

**Challenges:**
${student.challenges.map(c => `- ${c}`).join('\n')}

**Interests (Incorporate these for motivation!):**
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

${customInstructions ? `## TEACHER'S ADDITIONAL INSTRUCTIONS
${customInstructions}

---

` : ''}## YOUR TASK

Create a SHORT, practical teaching plan (1-2 weeks focus). Keep it concise and actionable.
This is for a school for autistic children, and it follows a British curriculum.
Keep in mind the student's age and grade.
Unless specified in any above instructions, do not incorporate any devices, students do not use any in class.

## REQUIRED FORMAT (keep it brief!)

**Goal:** [One clear, measurable sentence]

**Activities (3-4 bullet points max):**
- [Activity using their interests]
- [Activity using their strength]
- [Practice opportunity]

**Supports Needed:**
- [Key accommodation based on sensory/communication needs]

**Success Looks Like:**
- [One observable indicator]

Be concise! Maximum 150 words total. No lengthy explanations.`;
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
