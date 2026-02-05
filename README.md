# TrainTrack

> **An AI-powered web application for teachers of autistic children to manage Individualized Education Plans (IEPs) using the Autism Education Trust (AET) Progression Framework.**

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?logo=tailwind-css)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI-4285F4?logo=google)

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
- [Customizing the AI Prompt](#-customizing-the-ai-prompt)
- [Sample Data](#-sample-data)
- [Future Development](#-future-development)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 The Problem

Teachers working with autistic children face significant challenges when creating and managing Individualized Education Plans (IEPs):

1. **Time-Consuming Process**: Creating personalized learning plans for each student across multiple developmental areas takes countless hours.

2. **Complex Framework**: The AET Progression Framework contains **8 areas**, **37 categories**, and **196 individual subcategories** - tracking progress across all of these is overwhelming.

3. **Personalization Challenge**: Each autistic child has unique strengths, challenges, interests, sensory needs, and communication styles. Generic plans don't work.

4. **Documentation Burden**: Teachers must maintain detailed records of student profiles, diagnoses, behavioral triggers, calming strategies, and more.

5. **Lack of Accessible Tools**: Most existing tools are either too complex, too expensive, or not specifically designed for autism education.

---

## 💡 Our Solution

**TrainTrack** is a comprehensive web application that:

- ✅ **Digitizes the entire AET Progression Framework** with an intuitive, collapsible interface
- ✅ **Centralizes student information** including profiles, diagnoses, strengths, challenges, and behavioral data
- ✅ **Uses AI to generate personalized teaching plans** that consider each child's unique profile
- ✅ **Tracks progress** across all 196 subcategories with visual indicators
- ✅ **Allows full customization** - teachers can edit, regenerate, or manually write plans
- ✅ **Provides bulk generation** - generate plans for all goals with one click

---

## ✨ Features

### Student Management
- **Detailed Student Profiles**: Store comprehensive information including:
  - Basic info (name, date of birth, class)
  - Diagnoses (ASD, ADHD, etc.)
  - Strengths and challenges
  - Interests (used to personalize learning)
  - Sensory needs
  - Communication style
  - Support strategies
  - Known triggers
  - Calming strategies
- **Fully Editable**: All profile fields can be edited by teachers
- **Dynamic Lists**: Add or remove items from any list field

### AET Framework Integration
- **Complete Framework**: All 8 areas with 37 categories and 196 subcategories
- **Hierarchical Navigation**: Collapsible areas → categories → subcategories
- **Progress Tracking**: 4-level progression system per subcategory
  - Level 1: Focused support
  - Level 2: Targeted support
  - Level 3: Moderate support
  - Level 4: Independent
- **Completion Marking**: Mark subcategories as complete
- **Visual Progress Bars**: See progress at area and category levels

### AI-Powered Plan Generation
- **Personalized Plans**: AI considers the student's entire profile
- **Custom Instructions**: Add specific guidance before generating
- **Quick Regenerate**: Instantly regenerate any plan
- **Bulk Generation**: Generate plans for all subcategories at once
- **Edit & Delete**: Full control over generated content

### Class Organization
- **Class Management**: Organize students by class
- **Class Overview**: See all students in a class at a glance
- **Easy Navigation**: Breadcrumb navigation throughout

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16.1.6** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Tailwind CSS 4.x** | Utility-first styling |
| **Prisma 7.3.0** | Database ORM (configured for SQLite) |
| **SQLite** | Local database |
| **Google Gemini AI** | AI plan generation (gemini-2.5-flash model) |
| **Lucide React** | Icon library |

---

## 📁 Project Structure

```
AlKaramahHackathon/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # Landing page
│   │   ├── layout.tsx                # Root layout
│   │   ├── globals.css               # Global styles
│   │   ├── api/
│   │   │   └── generate-plan/
│   │   │       └── route.ts          # AI generation API endpoint
│   │   ├── classes/
│   │   │   ├── page.tsx              # Classes list page
│   │   │   └── [classId]/
│   │   │       └── page.tsx          # Individual class page
│   │   └── students/
│   │       └── [studentId]/
│   │           ├── page.tsx          # Student profile page
│   │           └── aet/
│   │               └── page.tsx      # AET progression page
│   │
│   └── lib/
│       ├── sample-data.ts            # Sample students and classes
│       └── aet-framework.ts          # Complete AET framework structure
│
├── prisma/
│   └── schema/
│       └── schema.prisma             # Database schema
│
├── aet-files/                        # AET Framework reference documents
├── prisma.config.ts                  # Prisma configuration
├── .env.local                        # Environment variables (API keys)
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API key (free)

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
   GEMINI_API_KEY=your_api_key_here
   ```
   
   Get your free API key at: https://aistudio.google.com/apikey

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   
   Navigate to http://localhost:3000

---

## 📖 How It Works

### 1. Landing Page
The landing page introduces the portal and provides navigation to the main features.

### 2. Classes Page (`/classes`)
View all classes with student counts. Click on a class to see its students.

### 3. Class Detail Page (`/classes/[classId]`)
See all students in a specific class with quick stats and links to their profiles.

### 4. Student Profile Page (`/students/[studentId]`)
Comprehensive student profile with:
- Personal information
- Diagnoses
- Strengths & challenges
- Interests
- Sensory needs
- Communication style
- Support strategies
- Triggers & calming strategies

All fields are **fully editable** - click the edit icon to modify any section.

### 5. AET Progression Page (`/students/[studentId]/aet`)
The heart of the application:

1. **Header**: Student info, progress summary, and "Generate All Plans" button
2. **Level Legend**: Explanation of the 4 progression levels
3. **Framework Areas**: 8 collapsible areas, each containing:
   - Categories (numbered 1-7 depending on area)
   - Subcategories (coded like 1.1, 1.2, 2.1, etc.)

For each subcategory:
- ✅ Checkbox to mark complete
- 🔢 Level selector (1-4)
- ✨ Add/View Plan button

When viewing a plan:
- **Regenerate**: Instantly create a new plan
- **With Instructions**: Add custom guidance before regenerating
- **Edit**: Manually modify the plan
- **Delete**: Remove the plan entirely

---

## 📚 AET Framework Structure

The AET Progression Framework is organized as follows:

| # | Area | Categories | Subcategories | Color |
|---|------|------------|---------------|-------|
| 1 | Communication and Interaction | 7 | 32 | Blue |
| 2 | Social Understanding and Relationships | 5 | 21 | Green |
| 3 | Sensory Processing | 4 | 11 | Purple |
| 4 | Interests, Routines and Processing | 4 | 13 | Amber |
| 5 | Emotional Understanding and Self-awareness | 5 | 23 | Rose |
| 6 | Learning and Engagement | 5 | 38 | Cyan |
| 7 | Healthy Living | 3 | 27 | Emerald |
| 8 | Independence and Community Participation | 4 | 31 | Orange |

**Total: 8 Areas, 37 Categories, 196 Subcategories**

### Progression Levels

| Level | Name | Description |
|-------|------|-------------|
| 1 | Focused support | Requires focused, individualized support |
| 2 | Targeted support | Requires targeted support in specific areas |
| 3 | Moderate support | Requires moderate support to maintain skills |
| 4 | Independent | Demonstrates skill independently |

---

## 🤖 AI Integration

### How It Works

1. When you click "Generate with AI" or "Regenerate", the app sends a request to `/api/generate-plan`
2. The API builds a detailed prompt including:
   - Student's complete profile
   - Target AET goal information
   - Current progression level
   - Any custom instructions from the teacher
3. The prompt is sent to Google Gemini (gemini-2.5-flash model)
4. The AI generates a concise, personalized teaching plan
5. The plan is displayed and saved to the student's record

### API Configuration

**File:** `src/app/api/generate-plan/route.ts`

Key settings:
```typescript
generationConfig: {
  temperature: 0.7,      // Creativity level (0-1)
  topK: 40,              // Token sampling
  topP: 0.95,            // Nucleus sampling
  maxOutputTokens: 1500, // Maximum response length
}
```

### Rate Limiting

The Gemini API has rate limits. The "Generate All Plans" feature includes a 1-second delay between requests to avoid hitting limits. If you encounter rate limiting:
- Wait 30-60 seconds and try again
- Generate plans individually instead of bulk

---

## ✏️ Customizing the AI Prompt

The AI prompt is defined in `src/app/api/generate-plan/route.ts` in the `buildPrompt()` function (starting around line 118).

### Current Prompt Structure

```
1. System context (autism education expert)
2. Student profile data (auto-populated)
3. Target AET goal information
4. Custom instructions (if provided)
5. Output format requirements
```

### Modifying the Output Format

To change what the AI generates, edit the "REQUIRED FORMAT" section in the prompt (around line 200):

```typescript
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
```

You can add or remove sections, change the word limit, or adjust the tone/style.

---

## 📊 Sample Data

The application comes with sample data for demonstration:

### Classes
- **Sunshine Class** (Early Years, Ages 3-5) - 4 students
- **Rainbow Class** (KS1, Ages 5-7) - 3 students  
- **Star Class** (KS2, Ages 7-11) - 3 students

### Sample Students

| Name | Age | Class | Key Characteristics |
|------|-----|-------|---------------------|
| Oliver Thompson | 4 | Sunshine | Visual learner, loves trains, uses PECS |
| Emma Williams | 5 | Sunshine | Creative, needs movement, responds to praise |
| Noah Garcia | 4 | Sunshine | Music lover, pattern recognition skills |
| Sophia Martinez | 5 | Sunshine | Imaginative, loves animals |
| Liam Johnson | 7 | Rainbow | Tech-savvy, logical thinker, coding interest |
| Ava Brown | 6 | Rainbow | Social butterfly, dance enthusiast |
| Mason Davis | 6 | Rainbow | Active learner, loves dinosaurs |
| Isabella Wilson | 9 | Star | Bookworm, excellent memory |
| Ethan Anderson | 10 | Star | Spatial reasoning, Minecraft expert |
| Mia Taylor | 8 | Star | Artistic, nature lover |

Sample data is defined in `src/lib/sample-data.ts`.

---

## 🔮 Future Development

### Planned Features

- [ ] **Database Integration**: Move from sample data to persistent SQLite database
- [ ] **User Authentication**: Login system for teachers
- [ ] **Multi-User Support**: Multiple teachers with their own classes
- [ ] **PDF Export**: Export student profiles and plans as PDFs
- [ ] **Progress Reports**: Generate progress reports over time
- [ ] **Parent Portal**: Read-only view for parents
- [ ] **Data Visualization**: Charts and graphs for progress tracking
- [ ] **Notifications**: Alerts for goals approaching deadlines
- [ ] **Collaboration**: Share plans between teachers
- [ ] **Offline Support**: PWA for offline access
- [ ] **Mobile App**: React Native companion app

### Known Issues

- Sample data is reset on page refresh (database integration will fix this)
- Bulk generation can hit rate limits with many subcategories
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

This project was created for the Al Karamah Hackathon 2026.

---

## 🙏 Acknowledgments

- **Autism Education Trust (AET)** for the Progression Framework
- **Google** for the Gemini AI API
- **Vercel** for Next.js
- All the teachers who work tirelessly to support autistic children

---

<div align="center">

**Built with ❤️ for teachers of autistic children**

[Report Bug](../../issues) · [Request Feature](../../issues)

</div>
