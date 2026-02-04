import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

// Create Prisma adapter for SQLite
const adapter = new PrismaLibSql({
  url: 'file:./prisma/dev.db'
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Starting database seed...')
  
  // Clean existing data
  await prisma.studentProgress.deleteMany()
  await prisma.student.deleteMany()
  await prisma.class.deleteMany()
  
  console.log('✅ Cleared existing data')

  // ============================================
  // SEED CLASSES
  // ============================================
  const sunshineRoom = await prisma.class.create({
    data: {
      id: 'class-1',
      name: 'Sunshine Room',
      description: 'Key Stage 1 class focusing on foundational communication and social skills',
      ageRange: 'Key Stage 1 (Ages 5-7)'
    }
  })

  const rainbowClass = await prisma.class.create({
    data: {
      id: 'class-2',
      name: 'Rainbow Class',
      description: 'Key Stage 2 class working on social interaction and independence skills',
      ageRange: 'Key Stage 2 (Ages 7-11)'
    }
  })

  const discoveryGroup = await prisma.class.create({
    data: {
      id: 'class-3',
      name: 'Discovery Group',
      description: 'Key Stage 3 class developing life skills and emotional regulation',
      ageRange: 'Key Stage 3 (Ages 11-14)'
    }
  })

  console.log('✅ Created 3 classes')

  // ============================================
  // SEED STUDENTS - Sunshine Room
  // ============================================
  const oliver = await prisma.student.create({
    data: {
      id: 'student-1',
      firstName: 'Oliver',
      lastName: 'Thompson',
      dateOfBirth: new Date('2019-03-15'),
      classId: sunshineRoom.id,
      diagnoses: JSON.stringify(['Autism Spectrum Disorder', 'Speech and Language Delay']),
      strengths: JSON.stringify(['Strong visual learner', 'Loves puzzles and patterns', 'Good memory for sequences', 'Enjoys music']),
      challenges: JSON.stringify(['Verbal communication', 'Unexpected changes', 'Loud environments']),
      interests: JSON.stringify(['Trains and railways', 'Puzzles', 'Music', 'Watching videos on tablet']),
      communicationStyle: 'Uses PECS (Picture Exchange Communication System) and some single words',
      sensoryNeeds: JSON.stringify(['Sensitive to loud sounds', 'Seeks proprioceptive input', 'Prefers dim lighting']),
      supportStrategies: JSON.stringify(['Visual schedules', 'Timers for transitions', 'First-then boards', 'Social stories']),
      triggers: JSON.stringify(['Sudden loud noises', 'Unexpected schedule changes', 'Crowded spaces']),
      calmingStrategies: JSON.stringify(['Listening to music with headphones', 'Squeezing stress ball', 'Looking at train pictures', 'Quiet corner time'])
    }
  })

  const emma = await prisma.student.create({
    data: {
      id: 'student-2',
      firstName: 'Emma',
      lastName: 'Williams',
      dateOfBirth: new Date('2019-07-22'),
      classId: sunshineRoom.id,
      diagnoses: JSON.stringify(['Autism Spectrum Disorder', 'ADHD']),
      strengths: JSON.stringify(['Excellent fine motor skills', 'Creative with art', 'Quick learner with numbers', 'Very affectionate']),
      challenges: JSON.stringify(['Sitting still', 'Following multi-step instructions', 'Sharing toys']),
      interests: JSON.stringify(['Drawing and coloring', 'Building blocks', 'Dancing', 'Animals']),
      communicationStyle: 'Speaks in 2-3 word phrases, understands more than she expresses',
      sensoryNeeds: JSON.stringify(['Needs movement breaks', 'Enjoys weighted blanket', 'Avoids certain food textures']),
      supportStrategies: JSON.stringify(['Movement breaks every 10 minutes', 'Fidget toys', 'Visual task breakdowns', 'Sticker rewards']),
      triggers: JSON.stringify(['Being asked to sit for too long', 'Loud unexpected sounds', 'Having toys taken away']),
      calmingStrategies: JSON.stringify(['Dancing to music', 'Weighted blanket', 'Drawing', 'Cuddles with trusted adult'])
    }
  })

  const noah = await prisma.student.create({
    data: {
      id: 'student-3',
      firstName: 'Noah',
      lastName: 'Brown',
      dateOfBirth: new Date('2018-11-08'),
      classId: sunshineRoom.id,
      diagnoses: JSON.stringify(['Autism Spectrum Disorder', 'Intellectual Disability']),
      strengths: JSON.stringify(['Very gentle and kind', 'Follows routines well', 'Enjoys helping others', 'Loves animals']),
      challenges: JSON.stringify(['Abstract concepts', 'New people', 'Complex instructions']),
      interests: JSON.stringify(['Animals especially dogs', 'Water play', 'Helping with classroom jobs', 'Soft toys']),
      communicationStyle: 'Uses Makaton signs alongside single words',
      sensoryNeeds: JSON.stringify(['Needs compression vest', 'Prefers quiet spaces', 'Enjoys water play']),
      supportStrategies: JSON.stringify(['Makaton signs', 'Extra processing time', 'Concrete examples', 'Consistent routines']),
      triggers: JSON.stringify(['New people entering the room', 'Being rushed', 'Abstract or unclear instructions']),
      calmingStrategies: JSON.stringify(['Deep pressure from compression vest', 'Water play', 'Hugging soft toy', 'Quiet corner'])
    }
  })

  const sophia = await prisma.student.create({
    data: {
      id: 'student-4',
      firstName: 'Sophia',
      lastName: 'Davis',
      dateOfBirth: new Date('2019-01-30'),
      classId: sunshineRoom.id,
      diagnoses: JSON.stringify(['Autism Spectrum Disorder']),
      strengths: JSON.stringify(['Excellent reader', 'Strong vocabulary', 'Remembers facts and details', 'Independent worker']),
      challenges: JSON.stringify(['Social interactions', 'Imaginative play', 'Understanding jokes']),
      interests: JSON.stringify(['Space and planets', 'Reading books', 'Facts and information', 'Numbers']),
      communicationStyle: 'Verbal but often uses scripted language',
      sensoryNeeds: JSON.stringify(['Sensitive to smells', 'Prefers certain clothing textures', 'Dislikes messy activities']),
      supportStrategies: JSON.stringify(['Social scripts', 'Structured social activities', 'Clear literal language', 'Special interest integration']),
      triggers: JSON.stringify(['Strong smells', 'Messy activities', 'Unexpected social demands']),
      calmingStrategies: JSON.stringify(['Reading books', 'Looking at space pictures', 'Counting', 'Quiet independent time'])
    }
  })

  // ============================================
  // SEED STUDENTS - Rainbow Class
  // ============================================
  const liam = await prisma.student.create({
    data: {
      id: 'student-5',
      firstName: 'Liam',
      lastName: 'Wilson',
      dateOfBirth: new Date('2016-05-12'),
      classId: rainbowClass.id,
      diagnoses: JSON.stringify(['Autism Spectrum Disorder', 'Anxiety Disorder']),
      strengths: JSON.stringify(['Excellent at maths', 'Logical thinking', 'Great attention to detail', 'Kind to younger children']),
      challenges: JSON.stringify(['Anxiety about new situations', 'Group work', 'Open-ended tasks']),
      interests: JSON.stringify(['Coding and programming', 'Minecraft', 'Mathematics', 'Robots']),
      communicationStyle: 'Fully verbal, can be literal in interpretation',
      sensoryNeeds: JSON.stringify(['Noise-canceling headphones helpful', 'Prefers predictable environments']),
      supportStrategies: JSON.stringify(['Clear expectations', 'Advance notice of changes', 'Growth mindset coaching', 'Step-by-step instructions']),
      triggers: JSON.stringify(['Making mistakes', 'Unexpected changes', 'Vague or unclear instructions']),
      calmingStrategies: JSON.stringify(['Noise-canceling headphones', 'Deep breathing', 'Coding on tablet', 'Counting exercises'])
    }
  })

  const ava = await prisma.student.create({
    data: {
      id: 'student-6',
      firstName: 'Ava',
      lastName: 'Martinez',
      dateOfBirth: new Date('2015-09-03'),
      classId: rainbowClass.id,
      diagnoses: JSON.stringify(['Autism Spectrum Disorder', 'Pathological Demand Avoidance profile']),
      strengths: JSON.stringify(['Very creative', 'Excellent imagination', 'Empathetic', 'Great problem solver when engaged']),
      challenges: JSON.stringify(['Direct instructions', 'Authority', 'Feeling controlled']),
      interests: JSON.stringify(['Drama and acting', 'Storytelling', 'Fashion and dress-up', 'Making videos']),
      communicationStyle: 'Highly verbal, responds better to indirect requests',
      sensoryNeeds: JSON.stringify(['Needs choice in seating', 'Benefits from fidget items']),
      supportStrategies: JSON.stringify(['Indirect language', 'Offering choices', 'Role play requests', 'Collaborative approach']),
      triggers: JSON.stringify(['Direct demands', 'Feeling out of control', 'Rigid rules without explanation']),
      calmingStrategies: JSON.stringify(['Role playing', 'Creative activities', 'Talking to trusted adult', 'Having choices'])
    }
  })

  const james = await prisma.student.create({
    data: {
      id: 'student-7',
      firstName: 'James',
      lastName: 'Anderson',
      dateOfBirth: new Date('2016-02-28'),
      classId: rainbowClass.id,
      diagnoses: JSON.stringify(['Autism Spectrum Disorder', 'Dyspraxia']),
      strengths: JSON.stringify(['Excellent verbal reasoning', 'Great memory', 'Enthusiastic learner', 'Good sense of humor']),
      challenges: JSON.stringify(['Handwriting', 'Physical coordination', 'Organizing belongings']),
      interests: JSON.stringify(['Dinosaurs', 'Science experiments', 'Podcasts', 'History']),
      communicationStyle: 'Very verbal, enjoys discussions',
      sensoryNeeds: JSON.stringify(['Benefits from movement breaks', 'Prefers typing to writing']),
      supportStrategies: JSON.stringify(['Assistive technology', 'Typing instead of writing', 'Extra time for motor tasks', 'Verbal responses allowed']),
      triggers: JSON.stringify(['Being asked to write by hand', 'Timed motor tasks', 'PE activities without support']),
      calmingStrategies: JSON.stringify(['Talking about dinosaurs', 'Listening to podcasts', 'Verbal problem-solving', 'Taking breaks'])
    }
  })

  // ============================================
  // SEED STUDENTS - Discovery Group
  // ============================================
  const mia = await prisma.student.create({
    data: {
      id: 'student-8',
      firstName: 'Mia',
      lastName: 'Taylor',
      dateOfBirth: new Date('2013-04-17'),
      classId: discoveryGroup.id,
      diagnoses: JSON.stringify(['Autism Spectrum Disorder', 'Generalized Anxiety Disorder']),
      strengths: JSON.stringify(['Excellent writer', 'Very artistic', 'Deep thinker', 'Loyal friend once comfortable']),
      challenges: JSON.stringify(['Speaking up in groups', 'Making decisions', 'New social situations']),
      interests: JSON.stringify(['Drawing manga', 'Creative writing', 'Anime', 'Nature and plants']),
      communicationStyle: 'Verbal in comfortable settings, may use written communication when anxious',
      sensoryNeeds: JSON.stringify(['Quiet workspace', 'Advance preparation for noisy activities']),
      supportStrategies: JSON.stringify(['Written communication options', '1:1 check-ins', 'Small group work', 'Advance notice of speaking tasks']),
      triggers: JSON.stringify(['Being put on the spot', 'Large group presentations', 'Unfamiliar people']),
      calmingStrategies: JSON.stringify(['Drawing', 'Writing', 'Quiet time alone', 'Talking to trusted person'])
    }
  })

  const ethan = await prisma.student.create({
    data: {
      id: 'student-9',
      firstName: 'Ethan',
      lastName: 'Jackson',
      dateOfBirth: new Date('2012-08-09'),
      classId: discoveryGroup.id,
      diagnoses: JSON.stringify(['Autism Spectrum Disorder', 'ADHD']),
      strengths: JSON.stringify(['Enthusiastic', 'Great technical skills', 'Persistent', 'Helpful when given responsibilities']),
      challenges: JSON.stringify(['Knowing when to stop talking', 'Personal space', 'Accepting other perspectives']),
      interests: JSON.stringify(['Video games', 'YouTube videos', 'Technology and gadgets', 'Building computers']),
      communicationStyle: 'Very verbal, may need reminders about conversation balance',
      sensoryNeeds: JSON.stringify(['Movement breaks essential', 'Benefits from standing desk option']),
      supportStrategies: JSON.stringify(['Leadership roles', 'Movement breaks', 'Social cue cards', 'Turn-taking visuals']),
      triggers: JSON.stringify(["Being ignored", "Technology being taken away", "Being told his interests aren't important"]),
      calmingStrategies: JSON.stringify(['Movement break', 'Talking about video games', 'Using technology', 'Having a job to do'])
    }
  })

  const isabella = await prisma.student.create({
    data: {
      id: 'student-10',
      firstName: 'Isabella',
      lastName: 'White',
      dateOfBirth: new Date('2013-12-01'),
      classId: discoveryGroup.id,
      diagnoses: JSON.stringify(['Autism Spectrum Disorder', 'Sensory Processing Disorder']),
      strengths: JSON.stringify(['Musical talent', 'Excellent pattern recognition', 'Very caring', 'Great with animals']),
      challenges: JSON.stringify(['Sensory overload', 'Crowded spaces', 'Unexpected touch']),
      interests: JSON.stringify(['Playing piano', 'Music in general', 'Animals especially horses', 'Patterns and puzzles']),
      communicationStyle: 'Verbal, expresses needs clearly when comfortable',
      sensoryNeeds: JSON.stringify(['Ear defenders available', 'Sensory breaks', 'Soft clothing options']),
      supportStrategies: JSON.stringify(['Sensory breaks', 'Quiet space access', 'Advance warning of loud activities', 'Ear defenders']),
      triggers: JSON.stringify(['Loud sudden noises', 'Crowded assemblies', 'Unexpected touch', 'Scratchy clothing']),
      calmingStrategies: JSON.stringify(['Playing music', 'Ear defenders', 'Quiet room', 'Soft blanket'])
    }
  })

  console.log('✅ Created 10 students')

  // ============================================
  // SEED SAMPLE STUDENT PROGRESS
  // ============================================
  
  // Oliver's progress - Communication & Interaction area
  await prisma.studentProgress.createMany({
    data: [
      {
        studentId: oliver.id,
        subcategoryId: 'ci-1-1', // Engagement
        level: 2,
        completed: false,
        plan: `**Personalized Plan for Oliver - Engagement**

Based on Oliver's profile as a strong visual learner who uses PECS and has an interest in trains:

**Week 1-2: Foundation**
- Use train-themed activities to capture attention
- Establish eye contact during preferred activities
- Create visual engagement cards

**Week 3-4: Building Skills**
- Practice sustained engagement during structured activities
- Use visual timers to show engagement duration
- Incorporate train themes into learning activities

**Success Indicators:**
- Maintains engagement for 5+ minutes
- Responds to name within 3 seconds`
      },
      {
        studentId: oliver.id,
        subcategoryId: 'ci-1-2', // Joint attention
        level: 1,
        completed: false,
        plan: null
      },
      {
        studentId: oliver.id,
        subcategoryId: 'ci-2-1', // Receptive understanding
        level: 2,
        completed: false,
        plan: null
      }
    ]
  })

  // Emma's progress
  await prisma.studentProgress.createMany({
    data: [
      {
        studentId: emma.id,
        subcategoryId: 'si-1-1', // Turn taking
        level: 2,
        completed: false,
        plan: `**Personalized Plan for Emma - Turn Taking**

Based on Emma's need for movement and creative strengths:

**Week 1-2: Introduction**
- Use art activities for turn-taking (pass the crayon)
- Include movement between turns
- Praise and stickers for waiting

**Week 3-4: Building Skills**
- Simple board games with visual turn indicator
- Short waiting times, gradually extended

**Success Indicators:**
- Waits for turn with visual support
- Takes turns in 3+ different activities`
      },
      {
        studentId: emma.id,
        subcategoryId: 'si-1-2', // Sharing
        level: 1,
        completed: false,
        plan: null
      }
    ]
  })

  // Sophia's progress
  await prisma.studentProgress.createMany({
    data: [
      {
        studentId: sophia.id,
        subcategoryId: 'ci-3-1', // Commenting
        level: 3,
        completed: false,
        plan: `**Personalized Plan for Sophia - Spontaneous Commenting**

Based on Sophia's interest in space and tendency toward scripted language:

**Week 1-2: Creating Opportunities**
- Use space books to prompt comments
- Model varied commenting phrases
- Create "Comment Cards" with sentence starters

**Week 3-4: Expanding Language**
- Introduce new comment forms (I see, I like, I notice)
- Practice during reading time with space books

**Success Indicators:**
- Makes 3+ spontaneous comments per session
- Uses varied language structures`
      }
    ]
  })

  // Liam's progress
  await prisma.studentProgress.createMany({
    data: [
      {
        studentId: liam.id,
        subcategoryId: 'er-1-1', // Recognising emotions
        level: 3,
        completed: true,
        plan: null
      },
      {
        studentId: liam.id,
        subcategoryId: 'er-1-2', // Expressing emotions
        level: 2,
        completed: false,
        plan: null
      }
    ]
  })

  console.log('✅ Created sample progress records')

  console.log('')
  console.log('🎉 Database seeding completed successfully!')
  console.log('')
  console.log('Summary:')
  console.log(`  - Classes: 3`)
  console.log(`  - Students: 10`)
  console.log(`  - Progress records: ${await prisma.studentProgress.count()}`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
