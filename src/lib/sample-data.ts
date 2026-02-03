// Sample data for demonstration purposes
export const sampleClasses = [
  {
    id: 'class-1',
    name: 'Sunshine Room',
    description: 'Key Stage 1 class focusing on foundational communication and social skills',
    gradeLevel: 'Key Stage 1 (Ages 5-7)',
    studentCount: 6
  },
  {
    id: 'class-2',
    name: 'Rainbow Class',
    description: 'Key Stage 2 class working on social interaction and independence skills',
    gradeLevel: 'Key Stage 2 (Ages 7-11)',
    studentCount: 7
  },
  {
    id: 'class-3',
    name: 'Discovery Group',
    description: 'Key Stage 3 class developing life skills and emotional regulation',
    gradeLevel: 'Key Stage 3 (Ages 11-14)',
    studentCount: 6
  }
];

export const sampleStudents = [
  // Sunshine Room Students
  {
    id: 'student-1',
    firstName: 'Oliver',
    lastName: 'Thompson',
    classId: 'class-1',
    className: 'Sunshine Room',
    dateOfBirth: '2019-03-15',
    profileImage: null,
    diagnoses: ['Autism Spectrum Disorder', 'Speech and Language Delay'],
    behaviors: ['Hand flapping when excited', 'Difficulty with transitions', 'Prefers routine activities'],
    strengths: ['Strong visual learner', 'Loves puzzles and patterns', 'Good memory for sequences', 'Enjoys music'],
    challenges: ['Verbal communication', 'Unexpected changes', 'Loud environments'],
    interests: ['Trains and railways', 'Puzzles', 'Music', 'Watching videos on tablet'],
    communicationStyle: 'Uses PECS (Picture Exchange Communication System) and some single words',
    sensoryNeeds: ['Sensitive to loud sounds', 'Seeks proprioceptive input', 'Prefers dim lighting'],
    supportStrategies: ['Visual schedules', 'Timers for transitions', 'First-then boards', 'Social stories'],
    triggers: ['Sudden loud noises', 'Unexpected schedule changes', 'Crowded spaces'],
    calmingStrategies: ['Listening to music with headphones', 'Squeezing stress ball', 'Looking at train pictures', 'Quiet corner time'],
    notes: 'Oliver responds well to visual schedules and timers. Loves anything related to trains.'
  },
  {
    id: 'student-2',
    firstName: 'Emma',
    lastName: 'Williams',
    classId: 'class-1',
    className: 'Sunshine Room',
    dateOfBirth: '2019-07-22',
    profileImage: null,
    diagnoses: ['Autism Spectrum Disorder', 'ADHD'],
    behaviors: ['Runs around when overstimulated', 'Hums during focused activities', 'Lines up objects'],
    strengths: ['Excellent fine motor skills', 'Creative with art', 'Quick learner with numbers', 'Very affectionate'],
    challenges: ['Sitting still', 'Following multi-step instructions', 'Sharing toys'],
    interests: ['Drawing and coloring', 'Building blocks', 'Dancing', 'Animals'],
    communicationStyle: 'Speaks in 2-3 word phrases, understands more than she expresses',
    sensoryNeeds: ['Needs movement breaks', 'Enjoys weighted blanket', 'Avoids certain food textures'],
    supportStrategies: ['Movement breaks every 10 minutes', 'Fidget toys', 'Visual task breakdowns', 'Sticker rewards'],
    triggers: ['Being asked to sit for too long', 'Loud unexpected sounds', 'Having toys taken away'],
    calmingStrategies: ['Dancing to music', 'Weighted blanket', 'Drawing', 'Cuddles with trusted adult'],
    notes: 'Emma benefits from fidget toys and regular movement breaks. Responds well to praise and stickers.'
  },
  {
    id: 'student-3',
    firstName: 'Noah',
    lastName: 'Brown',
    classId: 'class-1',
    className: 'Sunshine Room',
    dateOfBirth: '2018-11-08',
    profileImage: null,
    diagnoses: ['Autism Spectrum Disorder', 'Intellectual Disability'],
    behaviors: ['Seeks deep pressure', 'Repetitive questioning', 'Needs extra processing time'],
    strengths: ['Very gentle and kind', 'Follows routines well', 'Enjoys helping others', 'Loves animals'],
    challenges: ['Abstract concepts', 'New people', 'Complex instructions'],
    interests: ['Animals especially dogs', 'Water play', 'Helping with classroom jobs', 'Soft toys'],
    communicationStyle: 'Uses Makaton signs alongside single words',
    sensoryNeeds: ['Needs compression vest', 'Prefers quiet spaces', 'Enjoys water play'],
    supportStrategies: ['Makaton signs', 'Extra processing time', 'Concrete examples', 'Consistent routines'],
    triggers: ['New people entering the room', 'Being rushed', 'Abstract or unclear instructions'],
    calmingStrategies: ['Deep pressure from compression vest', 'Water play', 'Hugging soft toy', 'Quiet corner'],
    notes: 'Noah needs extra time to process instructions. Works best with concrete, hands-on activities.'
  },
  {
    id: 'student-4',
    firstName: 'Sophia',
    lastName: 'Davis',
    classId: 'class-1',
    className: 'Sunshine Room',
    dateOfBirth: '2019-01-30',
    profileImage: null,
    diagnoses: ['Autism Spectrum Disorder'],
    behaviors: ['Echolalia', 'Strong food preferences', 'Prefers parallel play'],
    strengths: ['Excellent reader', 'Strong vocabulary', 'Remembers facts and details', 'Independent worker'],
    challenges: ['Social interactions', 'Imaginative play', 'Understanding jokes'],
    interests: ['Space and planets', 'Reading books', 'Facts and information', 'Numbers'],
    communicationStyle: 'Verbal but often uses scripted language',
    sensoryNeeds: ['Sensitive to smells', 'Prefers certain clothing textures', 'Dislikes messy activities'],
    supportStrategies: ['Social scripts', 'Structured social activities', 'Clear literal language', 'Special interest integration'],
    triggers: ['Strong smells', 'Messy activities', 'Unexpected social demands'],
    calmingStrategies: ['Reading books', 'Looking at space pictures', 'Counting', 'Quiet independent time'],
    notes: 'Sophia is highly verbal but struggles with social use of language. Loves books about space.'
  },
  // Rainbow Class Students
  {
    id: 'student-5',
    firstName: 'Liam',
    lastName: 'Wilson',
    classId: 'class-2',
    className: 'Rainbow Class',
    dateOfBirth: '2016-05-12',
    profileImage: null,
    diagnoses: ['Autism Spectrum Disorder', 'Anxiety Disorder'],
    behaviors: ['Perfectionism', 'Difficulty accepting mistakes', 'Needs reassurance'],
    strengths: ['Excellent at maths', 'Logical thinking', 'Great attention to detail', 'Kind to younger children'],
    challenges: ['Anxiety about new situations', 'Group work', 'Open-ended tasks'],
    interests: ['Coding and programming', 'Minecraft', 'Mathematics', 'Robots'],
    communicationStyle: 'Fully verbal, can be literal in interpretation',
    sensoryNeeds: ['Noise-canceling headphones helpful', 'Prefers predictable environments'],
    supportStrategies: ['Clear expectations', 'Advance notice of changes', 'Growth mindset coaching', 'Step-by-step instructions'],
    triggers: ['Making mistakes', 'Unexpected changes', 'Vague or unclear instructions'],
    calmingStrategies: ['Noise-canceling headphones', 'Deep breathing', 'Coding on tablet', 'Counting exercises'],
    notes: 'Liam benefits from clear expectations and advance notice of changes. Has a special interest in coding.'
  },
  {
    id: 'student-6',
    firstName: 'Ava',
    lastName: 'Martinez',
    classId: 'class-2',
    className: 'Rainbow Class',
    dateOfBirth: '2015-09-03',
    profileImage: null,
    diagnoses: ['Autism Spectrum Disorder', 'Pathological Demand Avoidance profile'],
    behaviors: ['Avoids direct demands', 'Uses role play to cope', 'Mood can change quickly'],
    strengths: ['Very creative', 'Excellent imagination', 'Empathetic', 'Great problem solver when engaged'],
    challenges: ['Direct instructions', 'Authority', 'Feeling controlled'],
    interests: ['Drama and acting', 'Storytelling', 'Fashion and dress-up', 'Making videos'],
    communicationStyle: 'Highly verbal, responds better to indirect requests',
    sensoryNeeds: ['Needs choice in seating', 'Benefits from fidget items'],
    supportStrategies: ['Indirect language', 'Offering choices', 'Role play requests', 'Collaborative approach'],
    triggers: ['Direct demands', 'Feeling out of control', 'Rigid rules without explanation'],
    calmingStrategies: ['Role playing', 'Creative activities', 'Talking to trusted adult', 'Having choices'],
    notes: 'Ava responds best to choices and collaborative approaches. Loves drama and storytelling.'
  },
  {
    id: 'student-7',
    firstName: 'James',
    lastName: 'Anderson',
    classId: 'class-2',
    className: 'Rainbow Class',
    dateOfBirth: '2016-02-28',
    profileImage: null,
    diagnoses: ['Autism Spectrum Disorder', 'Dyspraxia'],
    behaviors: ['Clumsy movements', 'Avoids writing tasks', 'Strong verbal skills'],
    strengths: ['Excellent verbal reasoning', 'Great memory', 'Enthusiastic learner', 'Good sense of humor'],
    challenges: ['Handwriting', 'Physical coordination', 'Organizing belongings'],
    interests: ['Dinosaurs', 'Science experiments', 'Podcasts', 'History'],
    communicationStyle: 'Very verbal, enjoys discussions',
    sensoryNeeds: ['Benefits from movement breaks', 'Prefers typing to writing'],
    supportStrategies: ['Assistive technology', 'Typing instead of writing', 'Extra time for motor tasks', 'Verbal responses allowed'],
    triggers: ['Being asked to write by hand', 'Timed motor tasks', 'PE activities without support'],
    calmingStrategies: ['Talking about dinosaurs', 'Listening to podcasts', 'Verbal problem-solving', 'Taking breaks'],
    notes: 'James benefits from assistive technology for writing. Has extensive knowledge about dinosaurs.'
  },
  // Discovery Group Students
  {
    id: 'student-8',
    firstName: 'Mia',
    lastName: 'Taylor',
    classId: 'class-3',
    className: 'Discovery Group',
    dateOfBirth: '2013-04-17',
    profileImage: null,
    diagnoses: ['Autism Spectrum Disorder', 'Generalized Anxiety Disorder'],
    behaviors: ['Internalizes stress', 'Selective mutism in unfamiliar settings', 'Highly rule-following'],
    strengths: ['Excellent writer', 'Very artistic', 'Deep thinker', 'Loyal friend once comfortable'],
    challenges: ['Speaking up in groups', 'Making decisions', 'New social situations'],
    interests: ['Drawing manga', 'Creative writing', 'Anime', 'Nature and plants'],
    communicationStyle: 'Verbal in comfortable settings, may use written communication when anxious',
    sensoryNeeds: ['Quiet workspace', 'Advance preparation for noisy activities'],
    supportStrategies: ['Written communication options', '1:1 check-ins', 'Small group work', 'Advance notice of speaking tasks'],
    triggers: ['Being put on the spot', 'Large group presentations', 'Unfamiliar people'],
    calmingStrategies: ['Drawing', 'Writing', 'Quiet time alone', 'Talking to trusted person'],
    notes: 'Mia is a talented artist and writer. Benefits from 1:1 check-ins and written communication options.'
  },
  {
    id: 'student-9',
    firstName: 'Ethan',
    lastName: 'Jackson',
    classId: 'class-3',
    className: 'Discovery Group',
    dateOfBirth: '2012-08-09',
    profileImage: null,
    diagnoses: ['Autism Spectrum Disorder', 'ADHD'],
    behaviors: ['Very energetic', 'Talks extensively about interests', 'Difficulty reading social cues'],
    strengths: ['Enthusiastic', 'Great technical skills', 'Persistent', 'Helpful when given responsibilities'],
    challenges: ['Knowing when to stop talking', 'Personal space', 'Accepting other perspectives'],
    interests: ['Video games', 'YouTube videos', 'Technology and gadgets', 'Building computers'],
    communicationStyle: 'Very verbal, may need reminders about conversation balance',
    sensoryNeeds: ['Movement breaks essential', 'Benefits from standing desk option'],
    supportStrategies: ['Leadership roles', 'Movement breaks', 'Social cue cards', 'Turn-taking visuals'],
    triggers: ['Being ignored', 'Technology being taken away', 'Being told his interests arent important'],
    calmingStrategies: ['Movement break', 'Talking about video games', 'Using technology', 'Having a job to do'],
    notes: 'Ethan is passionate about video games and technology. Responds well to responsibility and leadership roles.'
  },
  {
    id: 'student-10',
    firstName: 'Isabella',
    lastName: 'White',
    classId: 'class-3',
    className: 'Discovery Group',
    dateOfBirth: '2013-12-01',
    profileImage: null,
    diagnoses: ['Autism Spectrum Disorder', 'Sensory Processing Disorder'],
    behaviors: ['Covers ears in loud environments', 'Specific clothing requirements', 'Needs preparation for changes'],
    strengths: ['Musical talent', 'Excellent pattern recognition', 'Very caring', 'Great with animals'],
    challenges: ['Sensory overload', 'Crowded spaces', 'Unexpected touch'],
    interests: ['Playing piano', 'Music in general', 'Animals especially horses', 'Patterns and puzzles'],
    communicationStyle: 'Verbal, expresses needs clearly when comfortable',
    sensoryNeeds: ['Ear defenders available', 'Sensory breaks', 'Soft clothing options'],
    supportStrategies: ['Sensory breaks', 'Quiet space access', 'Advance warning of loud activities', 'Ear defenders'],
    triggers: ['Loud sudden noises', 'Crowded assemblies', 'Unexpected touch', 'Scratchy clothing'],
    calmingStrategies: ['Playing music', 'Ear defenders', 'Quiet room', 'Soft blanket'],
    notes: 'Isabella is a talented musician. Needs sensory considerations but thrives with appropriate accommodations.'
  }
];

export const sampleAETGoals = [
  // Oliver's Goals
  {
    id: 'goal-1',
    studentId: 'student-1',
    category: 'Social Communication',
    subcategory: 'Requesting',
    goalTitle: 'Make a request for an item',
    goalDescription: 'Oliver will independently request desired items using PECS or verbal approximations',
    currentLevel: 1,
    targetLevel: 2,
    status: 'in_progress',
    generatedPlan: `**Personalized Plan for Oliver - Requesting Items**

Based on Oliver's profile as a strong visual learner who uses PECS and has an interest in trains, here is a tailored approach:

**Week 1-2: Foundation**
- Create train-themed PECS cards for commonly desired items
- Practice during preferred activities (train play time)
- Use visual schedule showing "I want" sequence

**Week 3-4: Expansion**
- Introduce requesting during snack time
- Add new PECS symbols gradually
- Pair PECS exchange with verbal model "train" or "more"

**Week 5-6: Generalization**
- Practice with different adults
- Use in different locations (playground, lunch hall)
- Encourage verbal approximations alongside PECS

**Resources Needed:**
- Train-themed PECS cards
- Visual "I want" board
- Timer for structured practice sessions

**Success Indicators:**
- Independently exchanges PECS card to request item
- Attempts verbal approximation 50% of time`,
    customPlan: null
  },
  {
    id: 'goal-2',
    studentId: 'student-1',
    category: 'Social Imagination & Flexibility',
    subcategory: 'Transitions',
    goalTitle: 'Manage transitions between activities',
    goalDescription: 'Oliver will transition between activities with minimal distress using visual supports',
    currentLevel: 1,
    targetLevel: 2,
    status: 'not_started',
    generatedPlan: null,
    customPlan: null
  },
  // Emma's Goals
  {
    id: 'goal-3',
    studentId: 'student-2',
    category: 'Social Interaction',
    subcategory: 'Turn Taking',
    goalTitle: 'Take turns during activities',
    goalDescription: 'Emma will take turns with peers during structured games and activities',
    currentLevel: 1,
    targetLevel: 2,
    status: 'in_progress',
    generatedPlan: `**Personalized Plan for Emma - Turn Taking**

Based on Emma's need for movement, creative strengths, and response to praise, here is a tailored approach:

**Week 1-2: Introduction**
- Use art activities for turn-taking (pass the crayon)
- Include movement between turns (jump, then it's your turn)
- Heavy praise and stickers for waiting

**Week 3-4: Building Skills**
- Simple board games with visual turn indicator
- "My turn/Your turn" cards with Emma's artwork
- Short waiting times, gradually extended

**Week 5-6: Practice with Peers**
- Paired activities with supportive peer
- Turn-taking during preferred activities
- Self-monitoring chart with stickers

**Accommodations:**
- Movement breaks between turns
- Fidget toy while waiting
- Visual timer showing wait time

**Success Indicators:**
- Waits for turn with visual support
- Takes turns in 3+ different activities`,
    customPlan: null
  },
  // Sophia's Goals
  {
    id: 'goal-4',
    studentId: 'student-4',
    category: 'Social Communication',
    subcategory: 'Commenting',
    goalTitle: 'Comment on objects or activities',
    goalDescription: 'Sophia will make spontaneous comments about activities using her own words rather than scripts',
    currentLevel: 2,
    targetLevel: 3,
    status: 'in_progress',
    generatedPlan: `**Personalized Plan for Sophia - Spontaneous Commenting**

Based on Sophia's strong reading skills, interest in space, and tendency toward scripted language:

**Week 1-2: Creating Opportunities**
- Use space books and materials to prompt comments
- Model varied commenting phrases
- Create "Comment Cards" with sentence starters

**Week 3-4: Expanding Language**
- Introduce new comment forms (I see, I like, I notice)
- Practice during reading time with space books
- Gentle prompting away from scripts

**Week 5-6: Generalization**
- Comment during other activities
- Peer commenting activities
- Celebrate original phrases

**Resources:**
- Space-themed materials
- Comment starter cards
- Recording special comments in a "Sophia Says" book

**Success Indicators:**
- Uses 3+ different commenting phrases
- Makes original (non-scripted) comments daily`,
    customPlan: null
  },
  // Liam's Goals
  {
    id: 'goal-5',
    studentId: 'student-5',
    category: 'Emotional Regulation',
    subcategory: 'Regulation Strategies',
    goalTitle: 'Use calming strategies',
    goalDescription: 'Liam will independently use calming strategies when feeling anxious',
    currentLevel: 2,
    targetLevel: 3,
    status: 'in_progress',
    generatedPlan: `**Personalized Plan for Liam - Calming Strategies**

Based on Liam's logical thinking, interest in coding, and anxiety triggers:

**Week 1-2: Strategy Introduction**
- Create "debugging my feelings" visual (coding theme)
- Introduce 3 calming strategies as "code commands"
- Practice in calm moments first

**Week 3-4: Recognition & Application**
- "Error detection" - recognizing anxiety signs
- Practice choosing appropriate strategy
- Use logic-based approach: If anxious, then [strategy]

**Week 5-6: Independence**
- Self-monitoring "program log"
- Reduce adult prompting
- Celebrate successful self-regulation

**Strategies (as "Commands"):**
1. BREATHE: 5 deep breaths
2. COUNTDOWN: Count backwards from 10
3. HEADPHONES.ON: Use noise-canceling headphones

**Success Indicators:**
- Identifies anxiety before escalation
- Uses strategy independently 70% of time`,
    customPlan: null
  }
];

export const sampleComments = [
  {
    id: 'comment-1',
    content: 'Oliver successfully used PECS to request his train toy three times today! Great progress.',
    authorName: 'Mrs. Johnson',
    authorRole: 'Class Teacher',
    studentId: 'student-1',
    aetGoalId: 'goal-1',
    createdAt: '2026-01-28T10:30:00Z'
  },
  {
    id: 'comment-2',
    content: 'Noticed Oliver is also starting to vocalize "tr" sound when requesting. Should we add this to the plan?',
    authorName: 'Ms. Patel',
    authorRole: 'Speech Therapist',
    studentId: 'student-1',
    aetGoalId: 'goal-1',
    createdAt: '2026-01-30T14:15:00Z'
  },
  {
    id: 'comment-3',
    content: 'Emma waited for her turn beautifully during art today with only one reminder. The movement breaks are really helping!',
    authorName: 'Mr. Thompson',
    authorRole: 'Teaching Assistant',
    studentId: 'student-2',
    aetGoalId: 'goal-3',
    createdAt: '2026-01-29T11:45:00Z'
  }
];
