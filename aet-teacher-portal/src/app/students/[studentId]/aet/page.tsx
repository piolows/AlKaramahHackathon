'use client';

import Link from 'next/link';
import { use, useState } from 'react';
import { 
  GraduationCap, 
  ChevronRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Check,
  Sparkles,
  Wand2,
  Pencil,
  Save,
  X,
  RefreshCw,
  Info,
  MessageCircle,
  AlertCircle,
  Loader2,
  Trash2
} from 'lucide-react';
import { sampleStudents, sampleClasses } from '@/lib/sample-data';
import { AET_FRAMEWORK, COLOR_CLASSES, PROGRESSION_LEVELS, Subcategory, Category, Area } from '@/lib/aet-framework';

// Progress data structure for subcategories
interface SubcategoryProgress {
  level: number;
  completed: boolean;
  plan: string | null;
}

// Sample progress data
const getInitialProgress = (studentId: string): Record<string, SubcategoryProgress> => {
  const progress: Record<string, SubcategoryProgress> = {};
  
  // Sample progress for different students
  if (studentId === 'student-1') { // Oliver
    progress['ci-2-1'] = { level: 2, completed: false, plan: `**Personalized Plan for Oliver - Making requests for items**

Based on Oliver's profile as a strong visual learner who uses PECS and has an interest in trains:

**Week 1-2: Foundation**
- Create train-themed PECS cards for commonly desired items
- Practice during preferred activities (train play time)
- Use visual schedule showing "I want" sequence

**Week 3-4: Expansion**
- Introduce requesting during snack time
- Add new PECS symbols gradually
- Pair PECS exchange with verbal model "train" or "more"

**Resources:** Train-themed PECS cards, Visual "I want" board, Timer

**Success Indicators:** Independently exchanges PECS card, attempts verbal approximation 50% of time` };
    progress['ci-4-3'] = { level: 2, completed: false, plan: null };
    progress['ir-2-1'] = { level: 1, completed: false, plan: null };
    progress['sp-4-1'] = { level: 2, completed: false, plan: null };
  } else if (studentId === 'student-2') { // Emma
    progress['su-2-4'] = { level: 2, completed: false, plan: `**Personalized Plan for Emma - Engaging in play with peers**

Based on Emma's need for movement, creative strengths, and response to praise:

**Week 1-2: Introduction**
- Use art activities for parallel play (painting together)
- Include movement between activities
- Heavy praise and stickers for positive interactions

**Week 3-4: Building Skills**
- Simple cooperative games with clear rules
- "My turn/Your turn" cards with Emma's artwork
- Short play sessions, gradually extended

**Accommodations:** Movement breaks, fidget toy while waiting, visual timer

**Success Indicators:** Engages in parallel play for 5+ minutes, shows awareness of peer` };
    progress['le-2-8'] = { level: 1, completed: false, plan: null };
    progress['su-5-2'] = { level: 2, completed: false, plan: null };
  } else if (studentId === 'student-5') { // Liam
    progress['eu-2-2'] = { level: 2, completed: false, plan: `**Personalized Plan for Liam - Using strategies to manage stress**

Based on Liam's logical thinking, interest in coding, and anxiety triggers:

**Week 1-2: Strategy Introduction**
- Create "debugging my feelings" visual (coding theme)
- Introduce 3 calming strategies as "code commands"
- Practice in calm moments first

**Week 3-4: Recognition & Application**
- "Error detection" - recognizing anxiety signs
- Practice choosing appropriate strategy
- Use logic-based approach: If anxious, then [strategy]

**Strategies (as "Commands"):**
1. BREATHE: 5 deep breaths
2. COUNTDOWN: Count backwards from 10
3. HEADPHONES.ON: Use noise-canceling headphones

**Success Indicators:** Identifies anxiety before escalation, uses strategy independently 70% of time` };
    progress['eu-2-1'] = { level: 2, completed: false, plan: null };
    progress['ir-1-2'] = { level: 2, completed: false, plan: null };
    progress['ci-3-1'] = { level: 3, completed: true, plan: null };
  }
  
  return progress;
};

export default function StudentAETPage({ params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = use(params);
  const student = sampleStudents.find(s => s.id === studentId);
  const classData = student ? sampleClasses.find(c => c.id === student.classId) : null;
  
  const [expandedAreas, setExpandedAreas] = useState<string[]>([AET_FRAMEWORK.areas[0].id]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedSubcategories, setExpandedSubcategories] = useState<string[]>([]);
  const [progress, setProgress] = useState(() => getInitialProgress(studentId));
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [editedPlan, setEditedPlan] = useState('');
  const [generatingPlan, setGeneratingPlan] = useState<string | null>(null);
  const [customInstructions, setCustomInstructions] = useState<Record<string, string>>({});
  const [showInstructions, setShowInstructions] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [generationProgress, setGenerationProgress] = useState({ current: 0, total: 0 });

  if (!student || !classData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Student Not Found</h1>
          <Link href="/classes" className="text-indigo-600 hover:underline">
            Return to Classes
          </Link>
        </div>
      </div>
    );
  }

  const toggleArea = (areaId: string) => {
    setExpandedAreas(prev => 
      prev.includes(areaId) 
        ? prev.filter(id => id !== areaId)
        : [...prev, areaId]
    );
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleSubcategory = (subcategoryId: string) => {
    setExpandedSubcategories(prev => 
      prev.includes(subcategoryId) 
        ? prev.filter(id => id !== subcategoryId)
        : [...prev, subcategoryId]
    );
  };

  const updateLevel = (subcategoryId: string, level: number) => {
    setProgress(prev => ({
      ...prev,
      [subcategoryId]: {
        ...prev[subcategoryId],
        level,
        completed: level === 4 ? prev[subcategoryId]?.completed || false : false,
        plan: prev[subcategoryId]?.plan || null
      }
    }));
  };

  const toggleCompleted = (subcategoryId: string) => {
    setProgress(prev => ({
      ...prev,
      [subcategoryId]: {
        ...prev[subcategoryId],
        level: prev[subcategoryId]?.level || 1,
        completed: !prev[subcategoryId]?.completed,
        plan: prev[subcategoryId]?.plan || null
      }
    }));
  };

  const generatePlan = async (
    subcategoryId: string, 
    areaName: string, 
    categoryName: string,
    subcategory: Subcategory
  ) => {
    setGeneratingPlan(subcategoryId);
    setGenerationError(null);
    
    const currentLevel = progress[subcategoryId]?.level || 1;
    const levelInfo = PROGRESSION_LEVELS[currentLevel - 1];
    const nextLevelInfo = currentLevel < 4 ? PROGRESSION_LEVELS[currentLevel] : null;
    
    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student: {
            firstName: student.firstName,
            lastName: student.lastName,
            dateOfBirth: student.dateOfBirth,
            diagnoses: student.diagnoses,
            strengths: student.strengths,
            challenges: student.challenges,
            interests: student.interests,
            sensoryNeeds: student.sensoryNeeds,
            communicationStyle: student.communicationStyle,
            supportStrategies: student.supportStrategies,
            triggers: student.triggers,
            calmingStrategies: student.calmingStrategies,
          },
          component: {
            name: subcategory.name,
            description: `${categoryName} - ${subcategory.code}: ${subcategory.name}`,
            currentLevel: currentLevel,
            currentLevelDescription: levelInfo.description,
            nextLevelDescription: nextLevelInfo?.description || null,
            areaName: areaName,
          },
          customInstructions: customInstructions[subcategoryId] || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate plan');
      }

      setProgress(prev => ({
        ...prev,
        [subcategoryId]: {
          ...prev[subcategoryId],
          level: prev[subcategoryId]?.level || 1,
          completed: prev[subcategoryId]?.completed || false,
          plan: data.plan
        }
      }));
      setShowInstructions(null);
    } catch (error) {
      console.error('Error generating plan:', error);
      setGenerationError(error instanceof Error ? error.message : 'Failed to generate plan. Please try again.');
    } finally {
      setGeneratingPlan(null);
    }
  };

  const savePlan = (subcategoryId: string) => {
    setProgress(prev => ({
      ...prev,
      [subcategoryId]: {
        ...prev[subcategoryId],
        level: prev[subcategoryId]?.level || 1,
        completed: prev[subcategoryId]?.completed || false,
        plan: editedPlan
      }
    }));
    setEditingPlan(null);
  };

  // Generate all plans for subcategories that have a level set but no plan yet
  const generateAllPlans = async () => {
    setIsGeneratingAll(true);
    setGenerationError(null);
    
    // Collect all subcategories that need plans (have level set but no plan)
    const subcategoriesToGenerate: { subcategoryId: string; areaName: string; categoryName: string; subcategory: Subcategory }[] = [];
    
    AET_FRAMEWORK.areas.forEach(area => {
      area.categories.forEach(category => {
        category.subcategories.forEach(subcategory => {
          const subProgress = progress[subcategory.id];
          // Generate for those with a level set OR those without any progress (will default to level 1)
          if (!subProgress?.plan) {
            subcategoriesToGenerate.push({
              subcategoryId: subcategory.id,
              areaName: area.name,
              categoryName: category.name,
              subcategory
            });
          }
        });
      });
    });

    setGenerationProgress({ current: 0, total: subcategoriesToGenerate.length });

    // Generate plans sequentially to avoid rate limits
    for (let i = 0; i < subcategoriesToGenerate.length; i++) {
      const { subcategoryId, areaName, categoryName, subcategory } = subcategoriesToGenerate[i];
      setGenerationProgress({ current: i + 1, total: subcategoriesToGenerate.length });
      setGeneratingPlan(subcategoryId);
      
      const currentLevel = progress[subcategoryId]?.level || 1;
      const levelInfo = PROGRESSION_LEVELS[currentLevel - 1];
      const nextLevelInfo = currentLevel < 4 ? PROGRESSION_LEVELS[currentLevel] : null;
      
      try {
        const response = await fetch('/api/generate-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            student: {
              firstName: student.firstName,
              lastName: student.lastName,
              dateOfBirth: student.dateOfBirth,
              diagnoses: student.diagnoses,
              strengths: student.strengths,
              challenges: student.challenges,
              interests: student.interests,
              sensoryNeeds: student.sensoryNeeds,
              communicationStyle: student.communicationStyle,
              supportStrategies: student.supportStrategies,
              triggers: student.triggers,
              calmingStrategies: student.calmingStrategies,
            },
            component: {
              name: subcategory.name,
              description: `${categoryName} - ${subcategory.code}: ${subcategory.name}`,
              currentLevel: currentLevel,
              currentLevelDescription: levelInfo.description,
              nextLevelDescription: nextLevelInfo?.description || null,
              areaName: areaName,
            },
          }),
        });

        const data = await response.json();

        if (response.ok && data.plan) {
          setProgress(prev => ({
            ...prev,
            [subcategoryId]: {
              ...prev[subcategoryId],
              level: prev[subcategoryId]?.level || 1,
              completed: prev[subcategoryId]?.completed || false,
              plan: data.plan
            }
          }));
        }
        
        // Small delay between requests to avoid rate limits
        if (i < subcategoriesToGenerate.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`Error generating plan for ${subcategory.name}:`, error);
        // Continue with next one even if this fails
      }
    }

    setGeneratingPlan(null);
    setIsGeneratingAll(false);
    setGenerationProgress({ current: 0, total: 0 });
  };

  // Calculate overall progress
  const totalSubcategories = AET_FRAMEWORK.areas.reduce((acc, area) => 
    acc + area.categories.reduce((catAcc, cat) => catAcc + cat.subcategories.length, 0), 0
  );
  const completedSubcategories = Object.values(progress).filter(p => p.completed).length;
  const inProgressSubcategories = Object.values(progress).filter(p => !p.completed && p.level > 0).length;

  // Helper to count progress for an area
  const getAreaProgress = (area: Area) => {
    let completed = 0;
    let total = 0;
    area.categories.forEach(cat => {
      cat.subcategories.forEach(sub => {
        total++;
        if (progress[sub.id]?.completed) completed++;
      });
    });
    return { completed, total };
  };

  // Helper to count progress for a category
  const getCategoryProgress = (category: Category) => {
    let completed = 0;
    category.subcategories.forEach(sub => {
      if (progress[sub.id]?.completed) completed++;
    });
    return { completed, total: category.subcategories.length };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <GraduationCap className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">AET Portal</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/classes" 
                className="text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Classes
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-indigo-600">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/classes" className="hover:text-indigo-600">Classes</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href={`/classes/${classData.id}`} className="hover:text-indigo-600">{classData.name}</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href={`/students/${student.id}`} className="hover:text-indigo-600">{student.firstName}</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900">AET Progress</span>
        </div>

        {/* Back Button */}
        <Link 
          href={`/students/${student.id}`}
          className="inline-flex items-center text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Link>

        {/* Page Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xl font-semibold">
                {student.firstName[0]}{student.lastName[0]}
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {student.firstName}&apos;s AET Progression
                </h1>
                <p className="text-gray-600">
                  Track progress across all AET Framework areas
                </p>
              </div>
            </div>
            
            {/* Progress Summary */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completedSubcategories}</div>
                <div className="text-xs text-gray-500">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">{inProgressSubcategories}</div>
                <div className="text-xs text-gray-500">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400">{totalSubcategories - completedSubcategories - inProgressSubcategories}</div>
                <div className="text-xs text-gray-500">Not Started</div>
              </div>
            </div>
          </div>
          
          {/* Generate All Plans Button */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={generateAllPlans}
              disabled={isGeneratingAll}
              className={`w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                isGeneratingAll
                  ? 'bg-indigo-100 text-indigo-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {isGeneratingAll ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Generating... ({generationProgress.current}/{generationProgress.total})
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5 mr-2" />
                  Generate All Plans with AI
                </>
              )}
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Generates personalized plans for all subcategories. May take a few minutes.
            </p>
          </div>
        </div>

        {/* Level Legend */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Info className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Progression Levels</span>
          </div>
          <div className="flex flex-wrap gap-4">
            {PROGRESSION_LEVELS.map((levelInfo) => (
              <div key={levelInfo.level} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${levelInfo.color}`}>
                  {levelInfo.level}
                </div>
                <span className="text-sm text-gray-600">{levelInfo.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AET Framework Areas */}
        <div className="space-y-4">
          {AET_FRAMEWORK.areas.map((area) => {
            const colors = COLOR_CLASSES[area.color];
            const isAreaExpanded = expandedAreas.includes(area.id);
            const areaProgressData = getAreaProgress(area);

            return (
              <div key={area.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Area Header */}
                <button
                  onClick={() => toggleArea(area.id)}
                  className={`w-full p-5 flex items-center justify-between ${colors.bg} hover:opacity-90 transition-opacity`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl ${colors.bgAccent} flex items-center justify-center`}>
                      <span className="text-white font-bold text-sm">{areaProgressData.completed}/{areaProgressData.total}</span>
                    </div>
                    <div className="text-left">
                      <h2 className={`text-lg font-semibold ${colors.textDark}`}>{area.name}</h2>
                      <p className="text-sm text-gray-600">{area.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Progress Bar */}
                    <div className="hidden sm:block w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${colors.bgAccent} transition-all`}
                        style={{ width: `${(areaProgressData.completed / areaProgressData.total) * 100}%` }}
                      />
                    </div>
                    {isAreaExpanded ? (
                      <ChevronUp className={`h-5 w-5 ${colors.text}`} />
                    ) : (
                      <ChevronDown className={`h-5 w-5 ${colors.text}`} />
                    )}
                  </div>
                </button>

                {/* Area Categories */}
                {isAreaExpanded && (
                  <div className="p-4 space-y-3">
                    {area.categories.map((category) => {
                      const isCategoryExpanded = expandedCategories.includes(category.id);
                      const categoryProgressData = getCategoryProgress(category);

                      return (
                        <div 
                          key={category.id}
                          className={`rounded-xl border border-gray-200 overflow-hidden`}
                        >
                          {/* Category Header */}
                          <button
                            onClick={() => toggleCategory(category.id)}
                            className={`w-full p-4 flex items-center justify-between ${colors.bg} hover:opacity-90 transition-opacity`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg ${colors.bgDark} flex items-center justify-center`}>
                                <span className={`${colors.textDark} font-bold text-sm`}>{category.number}</span>
                              </div>
                              <div className="text-left">
                                <h3 className={`font-medium ${colors.textDark}`}>{category.name}</h3>
                                <p className="text-xs text-gray-500">{categoryProgressData.completed}/{categoryProgressData.total} completed</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${colors.bgAccent}`}
                                  style={{ width: `${(categoryProgressData.completed / categoryProgressData.total) * 100}%` }}
                                />
                              </div>
                              {isCategoryExpanded ? (
                                <ChevronUp className="h-4 w-4 text-gray-400" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                          </button>

                          {/* Subcategories */}
                          {isCategoryExpanded && (
                            <div className="p-3 space-y-2 bg-white">
                              {category.subcategories.map((subcategory) => {
                                const subProgress = progress[subcategory.id];
                                const currentLevel = subProgress?.level || 0;
                                const isCompleted = subProgress?.completed || false;
                                const hasPlan = subProgress?.plan;
                                const isSubExpanded = expandedSubcategories.includes(subcategory.id);

                                return (
                                  <div 
                                    key={subcategory.id}
                                    className={`rounded-lg border ${isCompleted ? 'border-green-200 bg-green-50/50' : 'border-gray-100 bg-gray-50/50'}`}
                                  >
                                    {/* Subcategory Header */}
                                    <div className="p-3">
                                      <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-start gap-2 flex-1">
                                          {/* Completion Checkbox */}
                                          <button
                                            onClick={() => toggleCompleted(subcategory.id)}
                                            className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                                              isCompleted 
                                                ? 'bg-green-500 border-green-500 text-white' 
                                                : 'border-gray-300 hover:border-green-400'
                                            }`}
                                          >
                                            {isCompleted && <Check className="h-3 w-3" />}
                                          </button>
                                          
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                              <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${colors.bg} ${colors.text}`}>
                                                {subcategory.code}
                                              </span>
                                              <h4 className={`text-sm font-medium ${isCompleted ? 'text-green-700' : 'text-gray-900'}`}>
                                                {subcategory.name}
                                              </h4>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Level Selector */}
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                          {PROGRESSION_LEVELS.map((levelInfo) => (
                                            <button
                                              key={levelInfo.level}
                                              onClick={() => updateLevel(subcategory.id, levelInfo.level)}
                                              title={levelInfo.name}
                                              className={`w-6 h-6 rounded-full text-xs font-bold transition-all ${
                                                currentLevel >= levelInfo.level
                                                  ? `${levelInfo.color} text-white`
                                                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                              }`}
                                            >
                                              {levelInfo.level}
                                            </button>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Current Level Info & Plan Button */}
                                      <div className="mt-2 ml-7 flex items-center gap-2">
                                        {currentLevel > 0 && (
                                          <>
                                            <span className="text-xs text-gray-500">
                                              {PROGRESSION_LEVELS[currentLevel - 1].name}
                                            </span>
                                            <span className="text-gray-300">•</span>
                                          </>
                                        )}
                                        <button
                                          onClick={() => toggleSubcategory(subcategory.id)}
                                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium transition-colors ${
                                            hasPlan 
                                              ? `${colors.bg} ${colors.text}`
                                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                          }`}
                                        >
                                          <Sparkles className="h-3 w-3 mr-1" />
                                          {hasPlan ? 'View Plan' : 'Add Plan'}
                                          {isSubExpanded ? (
                                            <ChevronUp className="h-3 w-3 ml-1" />
                                            ) : (
                                              <ChevronDown className="h-3 w-3 ml-1" />
                                          )}
                                        </button>
                                      </div>
                                    </div>

                                    {/* Expanded Plan Section */}
                                    {isSubExpanded && (
                                      <div className={`border-t ${colors.border} ${colors.bg} p-3`}>
                                        {/* Error Message */}
                                        {generationError && generatingPlan === null && (
                                          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                                            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                                            <div>
                                              <p className="text-xs text-red-700 font-medium">Generation Failed</p>
                                              <p className="text-xs text-red-600">{generationError}</p>
                                            </div>
                                          </div>
                                        )}
                                        
                                        {generatingPlan === subcategory.id ? (
                                          <div className="text-center py-6">
                                            <Loader2 className="w-6 h-6 text-indigo-600 animate-spin mx-auto mb-3" />
                                            <p className="text-sm text-gray-600 font-medium">Generating personalized plan...</p>
                                            <p className="text-xs text-gray-500 mt-1">Analyzing {student.firstName}&apos;s profile</p>
                                          </div>
                                        ) : editingPlan === subcategory.id ? (
                                          <div>
                                            <textarea
                                              value={editedPlan}
                                              onChange={(e) => setEditedPlan(e.target.value)}
                                              className="w-full h-48 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-mono text-xs bg-white"
                                              placeholder="Write your personalized teaching plan..."
                                            />
                                            <div className="flex justify-end gap-2 mt-2">
                                              <button
                                                onClick={() => setEditingPlan(null)}
                                                className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200"
                                              >
                                                <X className="h-3 w-3 mr-1" />
                                                Cancel
                                              </button>
                                              <button
                                                onClick={() => savePlan(subcategory.id)}
                                                className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700"
                                              >
                                                <Save className="h-3 w-3 mr-1" />
                                                Save
                                              </button>
                                            </div>
                                          </div>
                                        ) : hasPlan ? (
                                          <div>
                                            <div className="bg-white rounded-lg p-3 prose prose-sm max-w-none">
                                              <div className="whitespace-pre-wrap text-gray-700 text-xs">
                                                {hasPlan}
                                              </div>
                                            </div>
                                            <div className="flex flex-wrap justify-end gap-2 mt-2">
                                              <button
                                                onClick={() => generatePlan(subcategory.id, area.name, category.name, subcategory)}
                                                className="inline-flex items-center px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs font-medium hover:bg-indigo-100 border border-indigo-200"
                                              >
                                                <RefreshCw className="h-3 w-3 mr-1" />
                                                Regenerate
                                              </button>
                                              <button
                                                onClick={() => setShowInstructions(subcategory.id)}
                                                className="inline-flex items-center px-2 py-1 bg-white text-gray-600 rounded text-xs font-medium hover:bg-gray-50 border border-gray-200"
                                              >
                                                <MessageCircle className="h-3 w-3 mr-1" />
                                                With Instructions
                                              </button>
                                              <button
                                                onClick={() => {
                                                  setEditingPlan(subcategory.id);
                                                  setEditedPlan(hasPlan);
                                                }}
                                                className="inline-flex items-center px-2 py-1 bg-white text-gray-600 rounded text-xs font-medium hover:bg-gray-50 border border-gray-200"
                                              >
                                                <Pencil className="h-3 w-3 mr-1" />
                                                Edit
                                              </button>
                                              <button
                                                onClick={() => {
                                                  setProgress(prev => ({
                                                    ...prev,
                                                    [subcategory.id]: {
                                                      ...prev[subcategory.id],
                                                      plan: null
                                                    }
                                                  }));
                                                }}
                                                className="inline-flex items-center px-2 py-1 bg-red-50 text-red-600 rounded text-xs font-medium hover:bg-red-100 border border-red-200"
                                              >
                                                <Trash2 className="h-3 w-3 mr-1" />
                                                Delete
                                              </button>
                                            </div>
                                          </div>
                                        ) : showInstructions === subcategory.id ? (
                                          <div className="space-y-3">
                                            <div>
                                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                                <MessageCircle className="h-3 w-3 inline mr-1" />
                                                Additional Instructions (Optional)
                                              </label>
                                              <textarea
                                                value={customInstructions[subcategory.id] || ''}
                                                onChange={(e) => setCustomInstructions(prev => ({
                                                  ...prev,
                                                  [subcategory.id]: e.target.value
                                                }))}
                                                placeholder={`Add specific instructions for ${student.firstName}'s plan...`}
                                                className="w-full h-20 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-xs bg-white"
                                              />
                                            </div>
                                            
                                            <div className="flex justify-end gap-2">
                                              <button
                                                onClick={() => setShowInstructions(null)}
                                                className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200"
                                              >
                                                Cancel
                                              </button>
                                              <button
                                                onClick={() => generatePlan(subcategory.id, area.name, category.name, subcategory)}
                                                className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700"
                                              >
                                                <Wand2 className="h-3 w-3 mr-1" />
                                                Generate
                                              </button>
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="space-y-3">
                                            <div className="text-center py-2">
                                              <Wand2 className="h-6 w-6 text-gray-300 mx-auto mb-2" />
                                              <p className="text-xs text-gray-600">
                                                Generate a personalized plan for <strong>{subcategory.name}</strong>
                                              </p>
                                            </div>
                                            
                                            <div className="flex flex-wrap justify-center gap-2">
                                              <button
                                                onClick={() => generatePlan(subcategory.id, area.name, category.name, subcategory)}
                                                className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700"
                                              >
                                                <Wand2 className="h-3 w-3 mr-1" />
                                                Generate with AI
                                              </button>
                                              <button
                                                onClick={() => setShowInstructions(subcategory.id)}
                                                className="inline-flex items-center px-3 py-1.5 bg-white text-indigo-600 rounded-lg text-xs font-medium hover:bg-indigo-50 border border-indigo-200"
                                              >
                                                <MessageCircle className="h-3 w-3 mr-1" />
                                                Add Instructions
                                              </button>
                                              <button
                                                onClick={() => {
                                                  setEditingPlan(subcategory.id);
                                                  setEditedPlan('');
                                                }}
                                                className="inline-flex items-center px-3 py-1.5 bg-white text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 border border-gray-200"
                                              >
                                                <Pencil className="h-3 w-3 mr-1" />
                                                Write Manually
                                              </button>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Framework Stats */}
        <div className="mt-8 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-center text-sm text-gray-500">
            AET Progression Framework • {AET_FRAMEWORK.areas.length} Areas • {
              AET_FRAMEWORK.areas.reduce((acc, area) => acc + area.categories.length, 0)
            } Categories • {totalSubcategories} Subcategories
          </div>
        </div>
      </div>
    </div>
  );
}
