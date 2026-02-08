import getGeminiApiKey from '@/lib/gemini-key';
import { NextRequest, NextResponse } from 'next/server';

// Using Gemini 2.5 Flash
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

interface StudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
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
  // AET current goals
  currentGoals?: {
    areaName: string;
    categoryName: string;
    subcategoryName: string;
    level: number;
  }[];
  // Therapy targets
  therapyTargets?: string[];
}

interface GenerateLessonRequest {
  className: string;
  ageRange: string; // e.g., "3-6", "14-17"
  students: StudentProfile[];
  lessonTopic: string; // e.g., "Counting and one-to-one correspondence", "Using money"
  curriculumArea: string; // e.g., "Mathematics", "Literacy", "Understanding the World"
  learningObjective: string; // The single learning intention
  additionalNotes?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateLessonRequest = await request.json();
    const { className, ageRange, students, lessonTopic, curriculumArea, learningObjective, additionalNotes } = body;

    const apiKey = getGeminiApiKey();
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured. Please add GEMINI_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    // Build the prompt for unified lesson plan
    const prompt = buildLessonPrompt(className, ageRange, students, lessonTopic, curriculumArea, learningObjective, additionalNotes);

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
          maxOutputTokens: 16384, // Large for full lesson plans with thinking model
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
        ]
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
      
      const errorMessage = errorData.error?.message || 'Failed to generate lesson';
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    const candidate = data.candidates?.[0];
    const parts = candidate?.content?.parts || [];
    const textParts = parts.filter((p: { text?: string; thought?: boolean }) => p.text && !p.thought);
    const generatedLesson = textParts.map((p: { text: string }) => p.text).join('') || null;

    // Check if generation was truncated
    const finishReason = candidate?.finishReason;
    if (finishReason === 'MAX_TOKENS') {
      console.warn('Lesson generation was truncated due to MAX_TOKENS');
    }

    if (!generatedLesson) {
      return NextResponse.json(
        { error: 'No lesson generated. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ lesson: generatedLesson });

  } catch (error) {
    console.error('Error generating lesson:', error);
    return NextResponse.json(
      { error: 'An error occurred while generating the lesson.' },
      { status: 500 }
    );
  }
}

function buildLessonPrompt(
  className: string,
  ageRange: string,
  students: StudentProfile[],
  lessonTopic: string,
  curriculumArea: string,
  learningObjective: string,
  additionalNotes?: string
): string {
  const isEYFS = parseInt(ageRange.split('-')[0]) <= 6;
  
  // Build student profiles summary
  const studentProfiles = students.map(s => {
    const age = calculateAge(s.dateOfBirth);
    return `
### ${s.firstName} ${s.lastName} (Age ${age})
- **Communication:** ${s.communicationStyle || 'Not specified'}
- **Diagnoses:** ${s.diagnoses.join(', ') || 'None specified'}
- **Strengths:** ${s.strengths.join(', ') || 'Not specified'}
- **Interests:** ${s.interests.join(', ') || 'Not specified'}
- **Challenges:** ${s.challenges.join(', ') || 'Not specified'}
- **Sensory Needs:** ${s.sensoryNeeds.join(', ') || 'None specified'}
- **Support Strategies:** ${s.supportStrategies.join(', ') || 'Standard support'}
- **Triggers:** ${s.triggers.join(', ') || 'None identified'}
- **Calming Strategies:** ${s.calmingStrategies.join(', ') || 'Standard strategies'}
${s.therapyTargets?.length ? `- **Therapy Targets:** ${s.therapyTargets.join(', ')}` : ''}
${s.teacherNotes ? `- **Notes:** ${s.teacherNotes}` : ''}`;
  }).join('\n');

  return `You are an expert special education teacher specializing in autism education. You follow the Autism Education Trust (AET) framework and understand the Attention Autism methodology (Gina Davies).

## CONTEXT

You are creating a lesson plan for a class of autistic learners. This school follows the British curriculum but delivers it through autism-friendly, sensory-rich, repetitive, and communication-focused approaches.

**KEY PRINCIPLES:**
- All pupils access the SAME overarching learning intention
- Success looks different depending on developmental stage and communication profile
- We do NOT write separate lessons for each child
- We plan ONE core learning intention with MULTIPLE ENTRY POINTS
- Communication, interaction, and engagement are the PRIMARY drivers
- Curriculum content is the vehicle through which we develop these skills
- Therapy goals are WOVEN INTO lessons, not taught in isolation

## CLASS INFORMATION

**Class:** ${className}
**Age Range:** ${ageRange} years old
**Number of Students:** ${students.length}
${isEYFS ? '**Phase:** Early Years Foundation Stage (EYFS)' : '**Phase:** Key Stage 3/4'}

## CURRICULUM DETAILS

**Curriculum Area:** ${curriculumArea}
**Topic:** ${lessonTopic}
**Learning Objective:** ${learningObjective}

${additionalNotes ? `**Additional Notes:** ${additionalNotes}` : ''}

## STUDENT PROFILES
${studentProfiles}

---

## YOUR TASK

Create ONE unified lesson plan that all students will access at their own level. Follow the AET-informed lesson structure below.

${isEYFS ? `
## EYFS LESSON STRUCTURE (Ages 3-6)

**1. Circle Time Song (Hook) - 5 mins**
- Transition into learning time
- Provides predictability and routine
- Encourages shared attention and regulation
- Songs should be repetitive, paired with actions and visuals

**2. Attention Autism Stage 1: Bucket Time - 5-10 mins**
- Capture attention and build engagement
- Encourage shared enjoyment
- No expectation for response - success is attending and watching

**3. Attention Autism Stages 2 & 3: Introducing the Concept - 10-15 mins**
- Introduce the key concept visually and engagingly
- Use props, songs, real objects, visual storytelling
- Language is LIMITED and MODELLED carefully with repetition

**4. Attention Autism Stage 4: Independent/Supported Task - 10-15 mins**
- Children apply learning independently or with minimal support
- Tasks ADAPTED so ALL children access the SAME learning intention at DIFFERENT LEVELS

**5. Main Development: Practising the Concept - 15-20 mins**
- Structured, repetitive activities
- Reinforcement through different modalities

**6. Continuous Provision: Play-Based Learning - Ongoing**
- Concepts embedded in play for generalisation
- Examples: playdough, water play, sorting, sensory trays, small-world play
` : `
## SECONDARY LESSON STRUCTURE (Ages 14-17)

**1. Introduction / Hook - 5-10 mins**
- Short, visual presentation
- Real-life context and relatability
- Shared counting, pointing, engaging activity

**2. Main Body / Explicit Teaching - 15-20 mins**
- Pupils work 1:1 or in small groups with staff
- Use laminated resources, real objects, tangible materials
- Multiple levels of differentiation within the same activity

**3. Practice / Application - 15-20 mins**
- Functional, real-life application
- Role play, community simulation, hands-on practice

**4. Consolidation / Reflection - 5-10 mins**
- Visual review of learning
- Celebration of success at ALL levels
`}

---

## REQUIRED OUTPUT FORMAT

### LESSON PLAN: ${lessonTopic}

**Curriculum Area:** [Area]
**Learning Objective:** [Single clear objective that ALL pupils will access]
**AET Focus:** [Communication/engagement goal embedded throughout]
**Duration:** [Total time]

---

#### 1. CIRCLE TIME SONG / HOOK
**Activity:** [Description]
**Song/Stimulus:** [Specific song or attention-grabber]
**Visuals Needed:** [List]
**Staff Notes:** [Key modeling points]

---

#### 2. ATTENTION AUTISM / INTRODUCTION
**Stage 1 (Bucket Time):** [Description]
**Stages 2-3 (Concept Introduction):** [Description with props/visuals]
**Key Language:** [Limited, repetitive phrases to use]
**Visuals Needed:** [List]

---

#### 3. MAIN ACTIVITY / TASK
**Activity Description:** [What everyone does]
**Resources Needed:** [Physical items, laminated materials, real objects]

**DIFFERENTIATION - ENTRY POINTS:**
${students.map(s => `- **${s.firstName}:** [How they access this activity - specific adaptation based on their communication level, supports needed, success criteria]`).join('\n')}

---

#### 4. CONTINUOUS PROVISION / PRACTICE
**Embedded Activities:** [2-3 play-based or practice activities]
**Resources:** [List]

---

#### 5. RESOURCES CHECKLIST
- [ ] [Item 1]
- [ ] [Item 2]
- [ ] [Item 3]
(List all visuals, props, laminated materials, real objects needed)

---

#### 6. COMMUNICATION & THERAPY GOALS EMBEDDED
${students.map(s => `- **${s.firstName}:** [Specific communication/therapy focus during this lesson]`).join('\n')}

---

#### 7. SUCCESS CRITERIA
**All pupils will:** [Universal success indicator]
**Some pupils will:** [Extended success indicator]
**Individual indicators:**
${students.map(s => `- **${s.firstName}:** [What success looks like for them]`).join('\n')}

---

Be specific, practical, and ensure the plan is immediately usable. Focus on autism-friendly, low-cognitive-load approaches with heavy use of visuals, repetition, and real objects.`;
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
