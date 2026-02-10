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

    return NextResponse.json({ lesson: replaceResourceTokens(generatedLesson) });

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
  // Determine phase from age range
  const minAge = parseInt(ageRange.split('-')[0]);
  const maxAge = parseInt(ageRange.split('-')[1] || ageRange.split('-')[0]);
  const phase = minAge <= 6 ? 'EYFS' : maxAge <= 8 ? 'KS1' : maxAge <= 11 ? 'KS2' : maxAge <= 14 ? 'KS3' : 'KS4';
  
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
${s.teacherNotes ? `- **Notes:** ${s.teacherNotes}` : ''}
${s.currentGoals?.length ? `- **Current AET Goal:** ${s.currentGoals.map(g => `${g.areaName} > ${g.categoryName} > ${g.subcategoryName} (Level ${g.level}/4)`).join('; ')}` : ''}`;
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
**Phase:** ${phase === 'EYFS' ? 'Early Years Foundation Stage (EYFS)' : phase === 'KS1' ? 'Key Stage 1' : phase === 'KS2' ? 'Key Stage 2' : phase === 'KS3' ? 'Key Stage 3' : 'Key Stage 3/4'}

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

**IMPORTANT: Be concise and practical.** Keep descriptions brief — use short bullet points rather than full sentences where possible. Focus on actionable, teacher-ready content. The lesson plan should be scannable at a glance. Avoid padding or repeating information.

${phase === 'EYFS' ? `
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
` : phase === 'KS1' ? `
## KS1 LESSON STRUCTURE (Ages 6-8)

**1. Circle Time / Hook - 5-10 mins**
- Familiar routine song or chant to signal learning time
- Visual timetable reference; shared attention activity
- Simple, repetitive language paired with concrete objects

**2. Attention Autism: Bucket Time & Introduction - 10 mins**
- Bucket time to capture attention and build engagement
- Introduce the concept using real objects, puppets, or visual storytelling
- Key vocabulary modelled with Makaton/visuals as appropriate

**3. Guided Activity - 15 mins**
- Whole-class or small-group activity with adult modelling
- Hands-on, sensory-friendly resources (counters, sorting trays, textured materials)
- Repetition and scaffolding; tasks broken into small steps

**4. Independent / Supported Practice - 15 mins**
- Same learning intention accessed at different levels
- 1:1 or small-group support; visual task cards to guide steps
- Choice of recording method (mark-making, stickers, objects, photos)

**5. Continuous Provision / Embedded Play - Ongoing**
- Concept reinforced in play areas: role-play corner, construction, sand/water, creative area
- Adults model target language during play interactions
` : phase === 'KS2' ? `
## KS2 LESSON STRUCTURE (Ages 8-11)

**1. Hook / Starter Activity - 5-10 mins**
- Attention-grabbing visual, video clip, or real-life scenario
- Quick interactive warm-up linking to prior learning
- Visual learning objective displayed and referenced

**2. Explicit Teaching - 10-15 mins**
- Clear, concise modelling with real objects and visuals
- Chunked instruction — one step at a time with checking
- Key vocabulary displayed on word mat or working wall

**3. Structured Group Activity - 15-20 mins**
- Collaborative or parallel tasks with clear roles
- Concrete manipulatives, real-life materials, adapted worksheets
- Staff circulate; prompt cards and visual supports available

**4. Independent Application - 10-15 mins**
- Pupils apply learning with graduated independence
- Differentiated by outcome, support level, and recording method
- Extension challenges for those ready

**5. Plenary / Review - 5 mins**
- Visual review: what did we learn?
- Celebration of effort and achievement at ALL levels
- Link forward to next lesson or real-life use
` : phase === 'KS3' ? `
## KS3 LESSON STRUCTURE (Ages 11-14)

**1. Hook / Engagement Starter - 5-10 mins**
- Real-world connection: video, image, object, or scenario
- Brief interactive task (sorting, matching, discussion prompt)
- Learning intention shared visually; relevance made explicit

**2. Direct Instruction - 10-15 mins**
- Concise, scaffolded teaching with visual supports
- Worked examples using real-life contexts
- Key vocabulary introduced and displayed; Makaton/symbols as needed

**3. Guided Practice - 15-20 mins**
- Structured tasks with adult support; small groups or pairs
- Real objects, laminated resources, technology as appropriate
- Multiple entry points within the same task

**4. Independent / Applied Task - 10-15 mins**
- Functional, real-life application where possible
- Differentiated recording options (written, verbal, photographic, digital)
- Staff step back to assess independence levels

**5. Consolidation / Reflection - 5 mins**
- Visual recap of key learning
- Self-assessment (thumbs up / traffic light / symbol-based)
- Link to upcoming learning or everyday use
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

## STYLE GUIDELINES

- Use **short bullet points**, not paragraphs
- Each bullet should be 1 line — aim for **under 15 words per bullet**
- Avoid restating what's already in headers
- Staff notes and key language: keep to 2-3 bullets max per section
- The entire plan should be **scannable in under 2 minutes**

---

## REQUIRED OUTPUT FORMAT

### LESSON PLAN: ${lessonTopic}

**Curriculum Area:** [Area]
**Learning Objective:** [Single clear objective that ALL pupils will access]
**AET Focus:** [Communication/engagement goal embedded throughout]
**Duration:** [Total time]

---

#### 1. CIRCLE TIME SONG / HOOK
**Activity:** [1-2 short bullets]
**Song/Stimulus:** [Specific song or attention-grabber]
**Visuals Needed:** [Comma-separated list]
**Staff Notes:** [1-2 key points]

---

#### 2. ATTENTION AUTISM / INTRODUCTION
**Stage 1 (Bucket Time):** [2-3 bullets]
**Stages 2-3 (Concept Introduction):** [2-3 bullets with props/visuals]
**Key Language:** [2-3 repetitive phrases]
**Visuals Needed:** [Comma-separated list]

---

#### 3. MAIN ACTIVITY / TASK
**Activity Description:** [2-3 bullets — what everyone does]
**Resources Needed:** [Comma-separated list]

**DIFFERENTIATION - ENTRY POINTS:**
${students.map(s => {
    const goal = s.currentGoals?.[0];
    const goalNote = goal ? ` **(AET goal: ${goal.subcategoryName} — explain how this activity links to this goal)**` : '';
    return `- **${s.firstName}:** [Specific adaptation for their level + supports needed]${goalNote}`;
  }).join('\n')}

---

#### 4. CONTINUOUS PROVISION / PRACTICE
**Embedded Activities:** [2-3 bullet points]
**Resources:** [Comma-separated list]

---

#### 5. RESOURCES CHECKLIST
- [ ] [Item 1]
- [ ] [Item 2]
- [ ] [Item 3]
(List all visuals, props, laminated materials, real objects needed)

---

#### 6. COMMUNICATION & THERAPY GOALS EMBEDDED
${students.map(s => `- **${s.firstName}:** [1 line — key communication/therapy focus]`).join('\n')}

---

#### 7. SUCCESS CRITERIA
**All pupils will:** [1 line]
**Some pupils will:** [1 line]
**Individual indicators:**
${students.map(s => `- **${s.firstName}:** [1 line — what success looks like for them]`).join('\n')}

---

#### 8. ADDITIONAL RESOURCES
[Suggest 3-5 online resources relevant to this lesson's topic and age group. Use the EXACT token format below — do NOT write URLs yourself. Our system will convert these tokens into real links automatically.]

FORMAT: {{PLATFORM|search terms}} — 1-line description of how to use it

Available platforms (use EXACTLY these names in the token):
- Twinkl — printable resources, visual aids, lesson packs
- BBC Bitesize — interactive clips and activities
- ARASAAC — free pictograms and symbol-based visuals
- TES — teacher-shared lesson materials and worksheets
- Teach Starter — differentiated worksheets and games
- YouTube — video demonstrations, songs, visual clips
- SEN Teacher — free printable SEN resources (no search — use as: {{SEN Teacher|}})  
- AET — AET tools and guides (no search — use as: {{AET|}})
- Widgit — symbol-supported materials (no search — use as: {{Widgit|}})

EXAMPLES:
- {{Twinkl|counting one to one correspondence SEN}} — Printable counting mats with visuals
- {{BBC Bitesize|counting numbers}} — Interactive clips for early counting
- {{ARASAAC|count}} — Pictograms for visual counting supports
- {{YouTube|attention autism bucket time counting}} — Video examples of bucket time activities
- {{TES|counting SEN autism EYFS}} — Differentiated counting worksheets
- {{SEN Teacher|}} — Free printable number and counting resources
[Only include platforms genuinely relevant to the topic and age group. Keep to 3-5 suggestions.]

---

Be specific, practical, and ensure the plan is immediately usable. Focus on autism-friendly, low-cognitive-load approaches with heavy use of visuals, repetition, and real objects. Keep the total plan concise — every bullet should earn its place.`;
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
function replaceResourceTokens(lesson: string): string {
  return lesson.replace(/\{\{([^|}]+)\|([^}]*)\}\}/g, (_match, platform: string, query: string) => {
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
