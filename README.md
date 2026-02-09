# TrainTrack

> **An AI-powered special education platform for teachers of autistic children — combining the Autism Education Trust (AET) Progression Framework with AI-generated lesson plans, visual schedules, and individualized goal tracking.**

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-7.3-2D3748?logo=prisma)
![Google Gemini](https://img.shields.io/badge/Google_Gemini_2.5_Flash-AI-4285F4?logo=google)
![Netlify](https://img.shields.io/badge/Deployed-Netlify-00C7B7?logo=netlify)

---

## 📋 Table of Contents

- [The Problem](#-the-problem)
- [Our Solution](#-our-solution)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [How It Works](#-how-it-works)
- [AET Framework Structure](#-aet-framework-structure)
- [AI Integration](#-ai-integration)
- [Database & Deployment](#-database--deployment)
- [Sample Data](#-sample-data)
- [Future Development](#-future-development)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 The Problem

Teachers working with autistic children face significant challenges when creating and managing Individualized Education Plans (IEPs):

1. **Time-Consuming Process**: Creating personalized learning plans for each student across multiple developmental areas takes countless hours.

2. **Complex Framework**: The AET Progression Framework contains **8 areas**, **37 categories**, and **196 individual subcategories** — tracking progress across all of these is overwhelming.

3. **Personalization Challenge**: Each autistic child has unique strengths, challenges, interests, sensory needs, and communication styles. Generic plans don't work.

4. **Lesson Planning Burden**: Designing inclusive, differentiated lessons that embed communication targets, sensory accommodations, and therapy goals for an entire class of diverse learners is extremely demanding.

5. **Visual Schedule Creation**: Many autistic students rely on visual schedules, but manually finding and organizing pictograms for every lesson is tedious.

6. **Lack of Accessible Tools**: Most existing tools are either too complex, too expensive, or not specifically designed for autism education.

---

## 💡 Our Solution

**TrainTrack** is a comprehensive special education platform that:

- ✅ **Digitizes the entire AET Progression Framework** with an intuitive, collapsible interface
- ✅ **Centralizes student information** — profiles, diagnoses, strengths, challenges, sensory needs, and behavioral data
- ✅ **Uses AI to generate personalized goal plans** that consider each child's unique profile
- ✅ **Generates full differentiated lesson plans** tailored to the entire class, embedding individual student goals, communication targets, and sensory accommodations
- ✅ **Creates PECS-style visual schedules** automatically from lessons using ARASAAC pictograms, with drag-and-drop editing
- ✅ **Provides AI consultation** — teachers can ask questions about student diagnoses and get practical classroom advice
- ✅ **Tracks progress** across all AET subcategories with visual progress bars and level indicators
- ✅ **Persists all data** in a real database (SQLite locally / Turso cloud in production)
- ✅ **Supports bulk operations** — generate plans for all goals or all students with one click

---

## ✨ Features

### Student Management
- **Detailed Student Profiles**: Store comprehensive information including:
  - Basic info (name, date of birth, class)
  - Diagnoses (ASD, ADHD, etc.)
  - Strengths and challenges
  - Interests (used to personalize AI-generated content)
  - Sensory needs
  - Communication style
  - Support strategies
  - Known triggers
  - Calming strategies
  - Free-form teacher notes
- **Inline Editing**: All profile fields can be edited in-place and auto-save to the database
- **Dynamic Lists**: Add or remove items from any list field with tag-style UI

### AET Framework Integration
- **Complete Framework**: All 8 areas with ~40 categories and ~130 subcategories
- **Hierarchical Navigation**: Collapsible areas → categories → subcategories
- **Progress Tracking**: 4-level progression system per subcategory
  - Level 1: Not Yet Developed
  - Level 2: Developing
  - Level 3: Established
  - Level 4: Generalised
- **Current Goal Tracking**: Automatically identifies the first uncompleted goal, with "Jump to Current Goal" navigation and scroll-to-highlight animation
- **Goal Navigation**: Navigate between goals on the class page with prev/next controls
- **Set as Current Goal**: Skip ahead by auto-completing all preceding goals
- **Completion Animations**: Visual fade-in/out effects when marking goals complete, with auto-advance to the next goal
- **Visual Progress Bars**: See completion progress at area and category levels with summary stats (completed / in progress / not started)

### AI-Powered Goal Plans
- **Personalized Plans**: AI considers the student's entire profile (diagnoses, interests, communication style, sensory needs, etc.)
- **Structured Output**: Each plan includes "What This Goal Means", "Advice & Guidance", and "What Success Looks Like"
- **Custom Instructions**: Add specific guidance before generating
- **Quick Regenerate**: Instantly regenerate any plan
- **Bulk Generation**: Generate plans for all subcategories at once
- **Edit & Delete**: Full control over generated content
- **Markdown Rendering**: Plans render with rich formatting

### AI Lesson Planning
- **Full Lesson Generation**: Generate complete, differentiated lesson plans for an entire class
- **Phase-Aware**: Automatically adapts lesson structure based on age range (EYFS / KS1 / KS2 / KS3 / KS4)
- **Attention Autism Integration**: Incorporates Gina Davies' Attention Autism methodology where appropriate
- **Per-Student Differentiation**: Embeds each student's AET goals, communication targets, therapy goals, and sensory accommodations directly into the lesson
- **Curated Resource Links**: Lessons include auto-generated links to real educational resources (Twinkl, BBC Bitesize, ARASAAC, TES, YouTube, SEN Teacher, AET, Widgit, Teach Starter)
- **Lesson Refinement**: Provide feedback and let AI revise the lesson while keeping its structure
- **Lesson History**: Save, load, and manage past lesson plans per class
- **Print Support**: Print-ready lesson output via `window.print()`

### Visual Schedule Builder
- **Automatic Generation**: AI extracts 6–12 key activity steps from a lesson and finds matching ARASAAC pictograms
- **Drag & Drop**: Reorder schedule cards by dragging
- **Card Editing**: Change labels, swap pictograms via live ARASAAC search
- **Custom Card Upload**: Upload your own pictogram images (stored as base64)
- **Add / Remove Cards**: Full control over the visual schedule
- **Save to Lesson**: Visual schedules persist as part of the lesson record

### AI Consultation
- **Ask About Diagnoses**: Type a free-form question about a student's diagnoses and get practical, classroom-focused advice
- **Context-Aware**: The AI consult is given the student's full diagnostic profile
- **Special Education Expertise**: Responses are framed as advice from a special education consultant (200–300 words)

### Admin Dashboard
- **Classes CRUD**: Create, edit, and delete classes (with delete protection if students exist)
- **Students CRUD**: Create and manage students with full profile fields via modal forms
- **Two-Tab Interface**: Switch between class and student management

### Class Organization
- **Class Overview**: See all students in a class at a glance with goal cards
- **Student Goal Cards**: Each student displays their current AET goal with level selector, completion toggle, and AI plan controls
- **Breadcrumb Navigation**: Context-aware breadcrumbs throughout the app

### UI Components
- **Reusable Component Library**: Button (with variants: primary, secondary, ghost, danger, success), Card, LinkCard, Breadcrumb, PageHeader, LoadingSpinner, EmptyState
- **Loading States**: Skeleton loading pages for classes and student views
- **Responsive Design**: Tailwind CSS utility-first styling with mobile support

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16.1.6** | React framework with App Router |
| **React 19** | UI library with React Compiler enabled |
| **TypeScript 5** | Type-safe development |
| **Tailwind CSS 4** | Utility-first styling |
| **Prisma 7.3** | Database ORM with LibSQL adapter |
| **SQLite** | Local development database |
| **Turso (LibSQL)** | Cloud database for production |
| **Google Gemini 2.5 Flash** | AI model for plan generation, lesson planning, visual schedule creation, and consultation |
| **ARASAAC API** | Pictogram search for visual schedules |
| **React Markdown** | Rendering AI-generated markdown content |
| **Lucide React** | Icon library |
| **Netlify** | Deployment platform |

---

## 📁 Project Structure

```
AlKaramahHackathon/
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Landing / hero page
│   │   ├── layout.tsx                # Root layout (fonts, metadata, Header/Footer)
│   │   ├── globals.css               # Global styles
│   │   │
│   │   ├── admin/
│   │   │   └── page.tsx              # Admin dashboard (CRUD for classes & students)
│   │   │
│   │   ├── api/
│   │   │   ├── classes/
│   │   │   │   ├── route.ts          # GET all / POST create class
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts      # GET / PUT / DELETE class
│   │   │   │       ├── lessons/
│   │   │   │       │   ├── route.ts          # GET / POST lessons for a class
│   │   │   │       │   └── [lessonId]/
│   │   │   │       │       └── route.ts      # DELETE / PATCH lesson
│   │   │   │       └── progress/
│   │   │   │           └── route.ts  # GET all student progress in a class
│   │   │   ├── consult/
│   │   │   │   └── route.ts          # POST AI consultation about diagnoses
│   │   │   ├── custom-cards/
│   │   │   │   ├── route.ts          # GET all / POST new custom pictogram card
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts      # DELETE custom card
│   │   │   ├── generate-lesson/
│   │   │   │   └── route.ts          # POST AI lesson plan generation
│   │   │   ├── generate-plan/
│   │   │   │   └── route.ts          # POST AI goal plan generation
│   │   │   ├── generate-visuals/
│   │   │   │   └── route.ts          # POST AI visual schedule generation
│   │   │   ├── pictogram-search/
│   │   │   │   └── route.ts          # GET ARASAAC pictogram proxy search
│   │   │   ├── refine-lesson/
│   │   │   │   └── route.ts          # POST AI lesson refinement
│   │   │   ├── students/
│   │   │   │   ├── route.ts          # GET all / POST create student
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts      # GET / PUT / DELETE student
│   │   │   │       └── progress/
│   │   │   │           └── route.ts  # GET / PUT / DELETE student progress
│   │   │
│   │   ├── classes/
│   │   │   ├── page.tsx              # Classes list page
│   │   │   ├── loading.tsx           # Loading skeleton
│   │   │   └── [classId]/
│   │   │       ├── page.tsx          # Class detail — goal cards, lessons, visual schedules
│   │   │       └── loading.tsx       # Loading skeleton
│   │   │
│   │   └── students/
│   │       └── [studentId]/
│   │           ├── page.tsx          # Student profile (inline editing, AI consult)
│   │           ├── loading.tsx       # Loading skeleton
│   │           └── aet/
│   │               ├── page.tsx      # Full AET framework progression tracking
│   │               └── loading.tsx   # Loading skeleton
│   │
│   ├── components/
│   │   ├── Header.tsx                # Sticky nav bar with logo and links
│   │   ├── Footer.tsx                # Footer with credits
│   │   ├── index.ts                  # Barrel exports
│   │   └── ui/
│   │       ├── Breadcrumb.tsx        # Dynamic breadcrumb navigation
│   │       ├── Button.tsx            # Variant button (primary/secondary/ghost/danger/success)
│   │       ├── Card.tsx              # Card, LinkCard, CardHeader, EmptyState
│   │       ├── LoadingSpinner.tsx    # Spinner with optional full-screen mode
│   │       ├── PageHeader.tsx        # Title + description + icon + actions
│   │       └── index.ts             # UI barrel exports
│   │
│   └── lib/
│       ├── aet-framework.ts          # Complete AET framework data structure & helpers
│       ├── gemini-key.ts             # Round-robin Gemini API key rotation (up to 5 keys)
│       ├── prisma.ts                 # Prisma client with LibSQL adapter (Turso/SQLite)
│       └── sample-data.ts            # Legacy sample data reference
│
├── prisma/
│   ├── schema.prisma                 # Database schema (5 models)
│   ├── seed.ts                       # Seed script (3 classes, 10 students with profiles)
│   └── migrations/                   # Database migration history
│
├── scripts/
│   └── push-to-turso.ts              # Utility to push local SQLite data to Turso cloud
│
├── aet-files/                        # AET Framework reference documents
├── extras/
│   ├── ToDo.txt                      # Feature ideas & notes
│   └── color_schemes.txt             # Alternative color scheme definitions
│
├── prisma.config.ts                  # Prisma configuration
├── netlify.toml                      # Netlify deployment config
├── next.config.ts                    # Next.js config (React Compiler enabled)
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm
- Google Gemini API key (free at [Google AI Studio](https://aistudio.google.com/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AlKaramahHackathon
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   # Required — at least one Gemini API key
   GEMINI_API_KEY_1=your_api_key_here

   # Optional — additional keys for round-robin rotation (up to 5)
   GEMINI_API_KEY_2=
   GEMINI_API_KEY_3=
   GEMINI_API_KEY_4=
   GEMINI_API_KEY_5=

   # For production (Turso cloud database)
   TURSO_DATABASE_URL=libsql://your-db.turso.io
   TURSO_AUTH_TOKEN=your_token_here
   ```

   Get your free Gemini API key at: https://aistudio.google.com/apikey

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   npm run db:seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**

   Navigate to http://localhost:3000

### Database Commands

| Command | Description |
|---------|-------------|
| `npm run db:seed` | Seed the database with sample data |
| `npm run db:reset` | Reset and re-seed the database |
| `npx prisma studio` | Open Prisma Studio to browse data |

---

## 📖 How It Works

### 1. Landing Page (`/`)
Hero page introducing TrainTrack with feature highlights, platform stats, and a "How It Works" overview. Links to the classes page.

### 2. Admin Dashboard (`/admin`)
Full CRUD management for classes and students via a two-tab interface:
- **Classes tab**: Create / edit / delete classes (name, description, age range). Delete is blocked if the class has students.
- **Students tab**: Create / edit / delete students with all profile fields (comma-separated inputs for list fields).

### 3. Classes Page (`/classes`)
Grid of class cards showing name, description, student count, age range, and student avatar previews (initials).

### 4. Class Detail Page (`/classes/[classId]`)
The main working hub for a class. Contains three major features:

#### Student Goal Cards
Each student shows their current AET goal with:
- Goal navigation (prev / next through all subcategories)
- Level selector (NYD / Dev / Est / Gen)
- Completion toggle with animation and auto-advance
- AI plan generation, editing, regeneration, and custom instructions
- "Generate All Plans" batch mode

#### Lesson Planning
- Form: select curriculum area, topic, learning objective, optional notes
- AI generates a full differentiated lesson plan considering every student's profile and AET goals
- Edit raw markdown, refine with AI feedback, save to database
- Load / delete past lessons from history dropdown
- Print-ready output

#### Visual Schedule Builder
- From a saved lesson, AI extracts key activity steps and matches them to ARASAAC pictograms
- Drag-and-drop reordering of schedule cards
- Edit card labels, swap pictograms via search, add new cards (ARASAAC search / custom upload / camera)
- Delete cards, save visual schedule to the lesson record

### 5. Student Profile Page (`/students/[studentId]`)
Comprehensive student profile with inline-editable fields:
- Personal information, diagnoses (tags), strengths, challenges, interests, sensory needs, communication style, support strategies, triggers, calming strategies, teacher notes
- **AI Consult**: Ask a free-form question about the student's diagnoses and get practical classroom advice from the AI (rendered in markdown)
- All changes auto-save to the database

### 6. AET Progression Page (`/students/[studentId]/aet`)
Complete expandable tree view of the entire AET framework:

1. **Summary Stats**: Completed / In Progress / Not Started counts
2. **Jump to Current Goal**: Button that scrolls to and highlights the first uncompleted subcategory
3. **Framework Tree**: 8 areas → categories → subcategories, each with:
   - Level selector (1–4 radio buttons)
   - Completion checkbox
   - AI plan generation (generate, regenerate, add context, write manually, edit, delete)
   - Progress bars at area and category levels
4. **Set as Current Goal**: Skip ahead by auto-completing all preceding goals

---

## 📚 AET Framework Structure

The AET Progression Framework is organized as follows:

| # | Area | Color |
|---|------|-------|
| 1 | Communication and Interaction | Blue |
| 2 | Social Understanding and Relationships | Green |
| 3 | Sensory Processing | Purple |
| 4 | Interests, Routines and Processing | Amber |
| 5 | Emotional Understanding and Self-awareness | Rose |
| 6 | Learning and Engagement | Cyan |
| 7 | Healthy Living | Emerald |
| 8 | Independence and Community Participation | Orange |

### Progression Levels

| Level | Name | Description |
|-------|------|-------------|
| 1 | Not Yet Developed (NYD) | Skill not yet observed or emerging |
| 2 | Developing (Dev) | Skill is beginning to develop with support |
| 3 | Established (Est) | Skill is established in familiar contexts |
| 4 | Generalised (Gen) | Skill is generalised across contexts independently |

---

## 🤖 AI Integration

TrainTrack uses **Google Gemini 2.5 Flash** (thinking model) across five AI-powered features:

### 1. Goal Plan Generation (`/api/generate-plan`)
Generates concise (<120 words) individualized teaching plans for specific AET subcategories. Each plan includes:
- **What This Goal Means** — plain-language explanation of the AET goal
- **Advice & Guidance** — practical strategies tailored to the student's profile
- **What Success Looks Like** — observable success indicators

The prompt incorporates the student's full profile: diagnoses, strengths, challenges, interests, sensory needs, communication style, support strategies, triggers, and calming strategies.

### 2. Lesson Plan Generation (`/api/generate-lesson`)
Generates full differentiated lesson plans for an entire class. The prompt is heavily engineered with:
- **Phase-specific structures** — adapts to EYFS, KS1, KS2, KS3, or KS4 based on class age range
- **Attention Autism methodology** — incorporates Gina Davies' stages where appropriate
- **Per-student differentiation** — individual entry points, communication targets, and accommodations
- **Resource link tokens** — `{{Platform|search terms}}` placeholders are post-processed into real URLs for educational platforms (Twinkl, BBC Bitesize, ARASAAC, TES, YouTube, SEN Teacher, AET, Widgit, Teach Starter)

### 3. Lesson Refinement (`/api/refine-lesson`)
Takes the current lesson plan and teacher feedback, producing a revised version that incorporates the requested changes while maintaining the lesson structure.

### 4. Visual Schedule Generation (`/api/generate-visuals`)
Extracts 6–12 key activity steps from a lesson, then searches the ARASAAC pictogram API for matching images:
- AI generates step labels and search keywords (with fallback alternatives)
- Each step is matched to a pictogram from the ARASAAC database
- Results in a PECS-style visual schedule ready for editing

### 5. AI Consultation (`/api/consult`)
Free-form Q&A about a student's diagnoses. The AI responds as a special education consultant with practical, classroom-focused advice (200–300 words).

### API Key Rotation
TrainTrack supports up to **5 Gemini API keys** (`GEMINI_API_KEY_1` through `GEMINI_API_KEY_5`) with round-robin rotation starting at a random index. This distributes load and helps mitigate rate limits.

### Rate Limiting
All AI endpoints handle Gemini 429 (rate limit) responses and parse `retry-after` headers. The bulk generation feature includes delays between requests. If you encounter rate limiting:
- Wait 30–60 seconds and try again
- Use multiple API keys to distribute load
- Generate plans individually instead of in bulk

---

## 🗄 Database & Deployment

### Database Schema

The application uses **5 database models**:

| Model | Purpose |
|-------|---------|
| **Class** | School class (name, description, age range) → has many Students and Lessons |
| **Student** | Full student profile with JSON-encoded arrays for diagnoses, strengths, interests, etc. |
| **StudentProgress** | Per-student per-AET-subcategory tracker (level 0–4, completed flag, plan text). Unique on `[studentId, subcategoryId]` |
| **Lesson** | Class-level lesson plan with curriculum metadata, markdown content, and optional visual schedule (JSON) |
| **CustomCard** | Teacher-uploaded pictogram cards (name + base64 image data) |

### Local Development
Uses **SQLite** via Prisma with a local `dev.db` file.

### Production Deployment
- **Database**: [Turso](https://turso.tech/) (LibSQL cloud database) via the `@prisma/adapter-libsql` adapter
- **Hosting**: [Netlify](https://www.netlify.com/) with the `@netlify/plugin-nextjs` plugin
- **Build command**: `npx prisma generate && npm run build`
- **Node version**: 20

A utility script (`scripts/push-to-turso.ts`) is included to push local SQLite data to the Turso cloud database.

---

## 📊 Sample Data

The database seed (`prisma/seed.ts`) provides sample data for demonstration:

### Classes
- **Class 1A** (Grade 1)
- **Class 2A** (Grade 2)
- **Class 3A** (Grade 3)

### Sample Students (10 total)

| Name | Class | Key Characteristics |
|------|-------|---------------------|
| Ahmed | Class 1A | Full profile with diagnoses, strengths, sensory needs |
| Fatima | Class 1A | Comprehensive special education profile |
| Rashid | Class 1A | Detailed communication and support strategies |
| Mariam | Class 1A | Individual interests and calming strategies |
| Khalid | Class 2A | Unique learning profile and triggers |
| Noura | Class 2A | Communication style and sensory accommodations |
| Sultan | Class 2A | Behavioral support strategies |
| Ayesha | Class 3A | Academic strengths and challenges |
| Mohammed | Class 3A | Detailed teacher notes and goals |
| Latifa | Class 3A | Comprehensive developmental profile |

Each student has a complete profile including diagnoses, strengths, challenges, interests, sensory needs, communication style, support strategies, triggers, calming strategies, and teacher notes.

Run `npm run db:seed` to populate the database with this sample data.

---

## 🔮 Future Development

### Completed (since initial version)
- [x] **Database Integration**: Persistent SQLite/Turso database replacing sample data
- [x] **Admin Dashboard**: Full CRUD for classes and students
- [x] **AI Lesson Planning**: Complete differentiated lesson generation
- [x] **Visual Schedule Builder**: ARASAAC pictogram-based visual schedules
- [x] **AI Consultation**: Free-form Q&A about student diagnoses
- [x] **Lesson History**: Save, load, and manage past lessons
- [x] **Custom Pictogram Cards**: Upload and manage custom visual cards
- [x] **API Key Rotation**: Round-robin across multiple Gemini keys
- [x] **Lesson Refinement**: AI-powered lesson revision with teacher feedback
- [x] **Cloud Deployment**: Netlify hosting + Turso cloud database
- [x] **Goal Navigation**: Prev/next controls and "Jump to Current Goal"
- [x] **Print Support**: Print-ready lesson output

### Planned Features
- [ ] **User Authentication**: Login system for teachers
- [ ] **Multi-User Support**: Multiple teachers with their own classes
- [ ] **PDF / Word Export**: Export student profiles, plans, and lessons
- [ ] **Progress Reports**: Generate progress reports over time
- [ ] **Parent Portal**: Read-only view for parents
- [ ] **Data Visualization**: Charts and graphs for progress tracking
- [ ] **Arabic Language Support**: Including Arabic pictogram search
- [ ] **Knowledge Base**: Shared teacher resource library
- [ ] **Token Boards & AAC Tools**: Extended visual support tools
- [ ] **Offline Support**: PWA for offline access
- [ ] **Mobile App**: React Native companion app

### Known Issues
- Bulk generation can hit rate limits with many subcategories — mitigated by multi-key rotation
- Some Tailwind v4 lint warnings (cosmetic, not functional)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project was created for the **Al Karamah Hackathon 2026**.

---

## 🙏 Acknowledgments

- **Autism Education Trust (AET)** for the Progression Framework
- **Google** for the Gemini AI API
- **ARASAAC** (Aragonese Centre for Augmentative & Alternative Communication) for the pictogram API
- **Vercel** for Next.js
- **Turso** for the LibSQL cloud database
- **Netlify** for hosting
- All the teachers who work tirelessly to support autistic children

---

<div align="center">

**Built with ❤️ for special education teachers**

[Report Bug](../../issues) · [Request Feature](../../issues)

</div>
