'use client';

import Link from 'next/link';
import { use, useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
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
  Trash2,
  Target,
  SkipForward,
  Image
} from 'lucide-react';
import { AET_FRAMEWORK, AET_FRAMEWORK_AR, COLOR_CLASSES, PROGRESSION_LEVELS, Subcategory, Category, Area } from '@/lib/aet-framework';
import { Breadcrumb, LoadingSpinner } from '@/components';
import { useLanguage } from '@/lib/i18n';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  classId: string;
  className: string;
  diagnoses: string[];
  strengths: string[];
  challenges: string[];
  interests: string[];
  sensoryNeeds: string[];
  communicationStyle: string;
  supportStrategies: string[];
  triggers: string[];
  calmingStrategies: string[];
  teacherNotes: string;
}

// Progress data structure for subcategories
interface SubcategoryProgress {
  level: number;
  completed: boolean;
  plan: string | null;
}

// Goal visual pictogram
interface GoalVisual {
  label: string;
  searchWord: string;
  alternativeWords: string[];
  pictogramId: number | null;
  pictogramUrl: string | null;
}

export default function StudentAETPage({ params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = use(params);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [expandedAreas, setExpandedAreas] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedSubcategories, setExpandedSubcategories] = useState<string[]>([]);
  const [progress, setProgress] = useState<Record<string, SubcategoryProgress>>({});
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [editedPlan, setEditedPlan] = useState('');
  const [generatingPlan, setGeneratingPlan] = useState<string | null>(null);
  const [customInstructions, setCustomInstructions] = useState<Record<string, string>>({});
  const [showInstructions, setShowInstructions] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // ARASAAC goal visuals state
  const [goalVisuals, setGoalVisuals] = useState<Record<string, GoalVisual[]>>({});
  const [generatingVisuals, setGeneratingVisuals] = useState<string | null>(null);
  const [visualsError, setVisualsError] = useState<string | null>(null);
  const { t, locale, isHydrated } = useLanguage();
  const framework = locale === 'ar' ? AET_FRAMEWORK_AR : AET_FRAMEWORK;
  const [planLanguage, setPlanLanguage] = useState<'en' | 'ar'>('en');

  // Fetch student and progress data
  useEffect(() => {
    async function fetchData() {
      try {
        const [studentRes, progressRes] = await Promise.all([
          fetch(`/api/students/${studentId}?lang=${locale}`),
          fetch(`/api/students/${studentId}/progress`)
        ]);
        
        if (studentRes.ok) {
          setStudent(await studentRes.json());
        }
        
        if (progressRes.ok) {
          const progressData = await progressRes.json();
          // Transform to expected format
          const transformedProgress: Record<string, SubcategoryProgress> = {};
          Object.entries(progressData).forEach(([subcategoryId, data]) => {
            const d = data as { level: number; completed: boolean; plan: string | null };
            transformedProgress[subcategoryId] = {
              level: d.level,
              completed: d.completed,
              plan: d.plan
            };
          });
          setProgress(transformedProgress);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    if (!isHydrated) return;
    fetchData();
  }, [studentId, locale, isHydrated]);

  // Sync plan language with site locale
  useEffect(() => {
    setPlanLanguage(locale);
  }, [locale]);

  // Save progress to database
  async function saveProgress(subcategoryId: string, data: SubcategoryProgress) {
    try {
      await fetch(`/api/students/${studentId}/progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subcategoryId,
          level: data.level,
          completed: data.completed,
          plan: data.plan
        })
      });
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }

  // Delete plan from database
  async function deletePlanFromDb(subcategoryId: string) {
    try {
      await fetch(`/api/students/${studentId}/progress?subcategoryId=${subcategoryId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Failed to delete plan:', error);
    }
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
    const newProgress = {
      level,
      completed: level === 4 ? progress[subcategoryId]?.completed || false : false,
      plan: progress[subcategoryId]?.plan || null
    };
    setProgress(prev => ({
      ...prev,
      [subcategoryId]: newProgress
    }));
    saveProgress(subcategoryId, newProgress);
  };

  const toggleCompleted = (subcategoryId: string) => {
    const newProgress = {
      level: progress[subcategoryId]?.level || 1,
      completed: !progress[subcategoryId]?.completed,
      plan: progress[subcategoryId]?.plan || null
    };
    setProgress(prev => ({
      ...prev,
      [subcategoryId]: newProgress
    }));
    saveProgress(subcategoryId, newProgress);
  };

  const generatePlan = async (
    subcategoryId: string, 
    areaName: string,
    categoryName: string,
    subcategory: Subcategory
  ) => {
    if (!student) return;
    
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
            className: student.className,
            diagnoses: student.diagnoses,
            strengths: student.strengths,
            challenges: student.challenges,
            interests: student.interests,
            sensoryNeeds: student.sensoryNeeds,
            communicationStyle: student.communicationStyle,
            supportStrategies: student.supportStrategies,
            triggers: student.triggers,
            calmingStrategies: student.calmingStrategies,
            teacherNotes: student.teacherNotes,
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
          outputLanguage: planLanguage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate plan');
      }

      const newProgress = {
        level: progress[subcategoryId]?.level || 1,
        completed: progress[subcategoryId]?.completed || false,
        plan: data.plan
      };
      setProgress(prev => ({
        ...prev,
        [subcategoryId]: newProgress
      }));
      saveProgress(subcategoryId, newProgress);
      setShowInstructions(null);
    } catch (error) {
      console.error('Error generating plan:', error);
      setGenerationError(error instanceof Error ? error.message : 'Failed to generate plan. Please try again.');
    } finally {
      setGeneratingPlan(null);
    }
  };

  // Generate ARASAAC visuals for a goal
  const generateGoalVisuals = async (
    subcategoryId: string,
    areaName: string,
    subcategoryName: string,
    description: string
  ) => {
    setGeneratingVisuals(subcategoryId);
    setVisualsError(null);

    try {
      const response = await fetch('/api/generate-goal-visuals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalName: subcategoryName,
          goalDescription: description,
          areaName,
          plan: progress[subcategoryId]?.plan || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate visuals');
      }

      setGoalVisuals(prev => ({
        ...prev,
        [subcategoryId]: data.visuals,
      }));
    } catch (error) {
      console.error('Error generating goal visuals:', error);
      setVisualsError(error instanceof Error ? error.message : 'Failed to generate visuals.');
    } finally {
      setGeneratingVisuals(null);
    }
  };

  const savePlan = (subcategoryId: string) => {
    const newProgress = {
      level: progress[subcategoryId]?.level || 1,
      completed: progress[subcategoryId]?.completed || false,
      plan: editedPlan
    };
    setProgress(prev => ({
      ...prev,
      [subcategoryId]: newProgress
    }));
    saveProgress(subcategoryId, newProgress);
    setEditingPlan(null);
  };

  // Calculate overall progress
  const totalSubcategories = framework.areas.reduce((acc, area) => 
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

  // Find the current goal (first one that isn't completed)
  interface GoalInfo {
    subcategoryId: string;
    area: Area;
    category: Category;
    subcategory: Subcategory;
  }
  
  const getCurrentGoal = (): GoalInfo | null => {
    for (const area of framework.areas) {
      for (const category of area.categories) {
        for (const subcategory of category.subcategories) {
          const subProgress = progress[subcategory.id];
          // If not completed, this is the current goal
          if (!subProgress?.completed) {
            return { subcategoryId: subcategory.id, area, category, subcategory };
          }
        }
      }
    }
    return null; // All goals completed!
  };

  const currentGoal = getCurrentGoal();

  // Function to scroll to current goal
  const scrollToCurrentGoal = () => {
    if (!currentGoal) return;
    
    // Expand the area and category containing the current goal
    if (!expandedAreas.includes(currentGoal.area.id)) {
      setExpandedAreas(prev => [...prev, currentGoal.area.id]);
    }
    if (!expandedCategories.includes(currentGoal.category.id)) {
      setExpandedCategories(prev => [...prev, currentGoal.category.id]);
    }
    
    // Small delay to allow expansion animation, then scroll
    setTimeout(() => {
      const element = document.getElementById(`subcategory-${currentGoal.subcategoryId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Add a brief highlight effect
        element.classList.add('ring-2', 'ring-primary-500', 'ring-offset-2');
        setTimeout(() => {
          element.classList.remove('ring-2', 'ring-primary-500', 'ring-offset-2');
        }, 2000);
      }
    }, 100);
  };

  return (
    <div>
      {/* Breadcrumb - always visible */}
      <Breadcrumb items={[
        { label: t('classesPage.title'), href: '/classes' },
        { label: loading ? '...' : (student?.className || t('classesPage.title')), href: student ? `/classes/${student.classId}` : '/classes' },
        { label: loading ? '...' : (student?.firstName || t('studentAET.studentNotFound')), href: student ? `/students/${student.id}` : '/classes' },
        { label: t('studentAET.aetProgress') }
      ]} />

      {loading ? (
        <LoadingSpinner />
      ) : !student ? (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('studentAET.studentNotFound')}</h1>
            <Link href="/classes" className="text-primary-600 hover:underline">
              {t('studentAET.returnToClasses')}
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Page Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back Button */}
            <Link
              href={`/students/${student.id}`}
              className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('studentAET.backToProfile')}
            </Link>

            {/* Page Header with Current Goal */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-xl font-semibold">
                  {student.firstName[0]}{student.lastName[0]}
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {student.firstName}{t('studentAET.aetProgression')}
                  </h1>
                  <p className="text-gray-600">
                    {t('studentAET.trackProgress')}
                  </p>
                </div>
              </div>
              
              {/* Progress Summary */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{completedSubcategories}</div>
                  <div className="text-xs text-gray-500">{t('studentAET.completedLabel')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-500">{inProgressSubcategories}</div>
                  <div className="text-xs text-gray-500">{t('studentAET.inProgressLabel')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-400">{totalSubcategories - completedSubcategories - inProgressSubcategories}</div>
                  <div className="text-xs text-gray-500">{t('studentAET.notStartedLabel')}</div>
                </div>
                
                {/* Jump to Current Goal Button */}
                {currentGoal ? (
                  <button
                    onClick={scrollToCurrentGoal}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    <Target className="h-4 w-4" />
                    <span>{t('studentAET.jumpToCurrentGoal')}</span>
                  </button>
                ) : completedSubcategories === totalSubcategories ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                    <Check className="h-4 w-4" />
                    <span>{t('studentAET.allComplete')}</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Level Legend */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Info className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">{t('studentAET.progressionLevels')}</span>
          </div>
          <div className="flex flex-wrap gap-4">
            {PROGRESSION_LEVELS.map((levelInfo) => (
              <div key={levelInfo.level} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${levelInfo.color}`}>
                  {levelInfo.shortName}
                </div>
                <span className="text-sm text-gray-600">{t(`studentAET.level${levelInfo.shortName}`)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AET Framework Areas */}
        <div className="space-y-4">
          {framework.areas.map((area) => {
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
                                <p className="text-xs text-gray-500">{categoryProgressData.completed}/{categoryProgressData.total} {t('studentAET.completed')}</p>
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
                                const isCurrentGoal = currentGoal?.subcategoryId === subcategory.id;

                                return (
                                  <div 
                                    key={subcategory.id}
                                    id={`subcategory-${subcategory.id}`}
                                    className={`rounded-lg border transition-all ${
                                      isCurrentGoal 
                                        ? 'border-primary-300 bg-primary-50/50 ring-1 ring-primary-200' 
                                        : isCompleted 
                                          ? 'border-green-200 bg-green-50/50' 
                                          : 'border-gray-100 bg-gray-50/50'
                                    }`}
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
                                            <div className="flex items-center gap-2 flex-wrap">
                                              <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${colors.bg} ${colors.text}`}>
                                                {subcategory.code}
                                              </span>
                                              <h4 className={`text-sm font-medium ${isCompleted ? 'text-green-700' : 'text-gray-900'}`}>
                                                {subcategory.name}
                                              </h4>
                                              {isCurrentGoal && (
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 font-medium">
                                                  {t('studentAET.currentGoal')}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        </div>

                                        {/* Level Selector */}
                                        <div className="flex items-center gap-1 shrink-0">
                                          {PROGRESSION_LEVELS.map((levelInfo) => (
                                            <button
                                              key={levelInfo.level}
                                              onClick={() => updateLevel(subcategory.id, levelInfo.level)}
                                              title={`${t(`studentAET.level${levelInfo.shortName}`)} (${levelInfo.shortName})`}
                                              className={`w-7 h-7 rounded-full text-[10px] font-bold transition-all ${
                                                currentLevel >= levelInfo.level
                                                  ? `${levelInfo.color} text-white`
                                                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                              }`}
                                            >
                                              {levelInfo.shortName}
                                            </button>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Current Level Info & Plan Button */}
                                      <div className="mt-2 ml-7 flex items-center gap-2">
                                        {currentLevel > 0 && (
                                          <>
                                            <span className="text-xs text-gray-500">
                                              {t(`studentAET.level${PROGRESSION_LEVELS[currentLevel - 1].shortName}`)}
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
                                          {hasPlan ? t('studentAET.viewGoalPlan') : t('studentAET.addGoalPlan')}
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
                                              <p className="text-xs text-red-700 font-medium">{t('studentAET.generationFailed')}</p>
                                              <p className="text-xs text-red-600">{generationError}</p>
                                            </div>
                                          </div>
                                        )}
                                        
                                        {generatingPlan === subcategory.id ? (
                                          <div className="text-center py-6">
                                            <Loader2 className="w-6 h-6 text-primary-500 animate-spin mx-auto mb-3" />
                                            <p className="text-sm text-gray-600 font-medium">{t('studentAET.generatingGoalOverview')}</p>
                                            <p className="text-xs text-gray-500 mt-1">{t('studentAET.analyzingProfile').replace('{name}', student.firstName)}</p>
                                          </div>
                                        ) : editingPlan === subcategory.id ? (
                                          <div>
                                            <textarea
                                              value={editedPlan}
                                              onChange={(e) => setEditedPlan(e.target.value)}
                                              className="w-full h-48 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none font-mono text-xs bg-white"
                                              placeholder={t('studentAET.writeGoalPlan')}
                                            />
                                            <div className="flex justify-end gap-2 mt-2">
                                              <button
                                                onClick={() => setEditingPlan(null)}
                                                className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200"
                                              >
                                                <X className="h-3 w-3 mr-1" />
                                                {t('common.cancel')}
                                              </button>
                                              <button
                                                onClick={() => savePlan(subcategory.id)}
                                                className="inline-flex items-center px-3 py-1.5 bg-primary-500 text-white rounded-lg text-xs font-medium hover:bg-primary-600"
                                              >
                                                <Save className="h-3 w-3 mr-1" />
                                                {t('studentAET.save')}
                                              </button>
                                            </div>
                                          </div>
                                        ) : hasPlan ? (
                                          <div>
                                            <div className="bg-white rounded-lg p-3 prose prose-xs max-w-none text-gray-700">
                                              <ReactMarkdown components={{
                                                a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:text-sky-800 underline decoration-sky-300 hover:decoration-sky-500 transition-colors">{children}</a>,
                                              }}>{hasPlan}</ReactMarkdown>
                                            </div>
                                            <div className="flex flex-wrap justify-end gap-2 mt-2">
                                              <button
                                                onClick={() => generateGoalVisuals(subcategory.id, area.name, subcategory.name, `${category.name} - ${subcategory.code}: ${subcategory.name}`)}
                                                className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border transition-colors ${
                                                  goalVisuals[subcategory.id]
                                                    ? 'bg-primary-50 text-primary-600 hover:bg-primary-100 border-primary-200'
                                                    : 'bg-white text-primary-600 hover:bg-primary-50 border-primary-200'
                                                }`}
                                              >
                                                {generatingVisuals === subcategory.id ? (
                                                  <Loader2 className="h-3 w-3 me-1 animate-spin" />
                                                ) : (
                                                  <Image className="h-3 w-3 me-1" />
                                                )}
                                                {generatingVisuals === subcategory.id
                                                  ? t('studentAET.generatingVisuals')
                                                  : goalVisuals[subcategory.id]
                                                    ? t('studentAET.regenerateVisuals')
                                                    : t('studentAET.generateArasaacVisuals')
                                                }
                                              </button>
                                              <button
                                                onClick={() => generatePlan(subcategory.id, area.name, category.name, subcategory)}
                                                className="inline-flex items-center px-2 py-1 bg-ai-50 text-ai-600 rounded text-xs font-medium hover:bg-ai-100 border border-ai-200"
                                              >
                                                <RefreshCw className="h-3 w-3 mr-1" />
                                                {t('studentAET.regenerate')}
                                              </button>
                                              <button
                                                onClick={() => {
                                                  setEditingPlan(subcategory.id);
                                                  setEditedPlan(hasPlan);
                                                }}
                                                className="inline-flex items-center px-2 py-1 bg-white text-gray-600 rounded text-xs font-medium hover:bg-gray-50 border border-gray-200"
                                              >
                                                <Pencil className="h-3 w-3 mr-1" />
                                                {t('common.edit')}
                                              </button>
                                              <button
                                                onClick={async () => {
                                                  setProgress(prev => ({
                                                    ...prev,
                                                    [subcategory.id]: {
                                                      ...prev[subcategory.id],
                                                      plan: null
                                                    }
                                                  }));
                                                  // Delete from database
                                                  await deletePlanFromDb(subcategory.id);
                                                }}
                                                className="inline-flex items-center px-2 py-1 bg-red-50 text-red-600 rounded text-xs font-medium hover:bg-red-100 border border-red-200"
                                              >
                                                <Trash2 className="h-3 w-3 mr-1" />
                                                {t('common.delete')}
                                              </button>
                                            </div>

                                            {/* ARASAAC Goal Visuals Display */}
                                            {goalVisuals[subcategory.id] && (
                                              <div className="mt-3 border-t border-gray-200 pt-3">
                                                <div className="flex items-center justify-between mb-2">
                                                  <div className="flex items-center gap-1.5">
                                                    <Image className="h-3.5 w-3.5 text-primary-500" />
                                                    <span className="text-xs font-medium text-gray-700">{t('studentAET.arasaacVisuals')}</span>
                                                  </div>
                                                  <button
                                                    onClick={() => setGoalVisuals(prev => { const updated = { ...prev }; delete updated[subcategory.id]; return updated; })}
                                                    className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 border border-red-200"
                                                  >
                                                    <X className="h-2.5 w-2.5 me-1" />
                                                    {t('studentAET.clearVisuals')}
                                                  </button>
                                                </div>
                                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                                  {goalVisuals[subcategory.id].map((visual, idx) => (
                                                    <div key={idx} className="bg-white rounded-lg border border-gray-200 p-2 text-center">
                                                      {visual.pictogramUrl ? (
                                                        <img
                                                          src={visual.pictogramUrl}
                                                          alt={visual.label}
                                                          className="w-16 h-16 mx-auto object-contain"
                                                        />
                                                      ) : (
                                                        <div className="w-16 h-16 mx-auto bg-gray-100 rounded flex items-center justify-center">
                                                          <Image className="h-6 w-6 text-gray-300" />
                                                        </div>
                                                      )}
                                                      <p className="text-[10px] font-medium text-gray-700 mt-1 truncate">{visual.label}</p>
                                                    </div>
                                                  ))}
                                                </div>
                                              </div>
                                            )}
                                            {visualsError && generatingVisuals === null && (
                                              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                                                <AlertCircle className="h-3.5 w-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                                                <p className="text-xs text-red-600">{visualsError}</p>
                                              </div>
                                            )}
                                          </div>
                                        ) : showInstructions === subcategory.id ? (
                                          <div className="space-y-3">
                                            <div>
                                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                                <MessageCircle className="h-3 w-3 inline mr-1" />
                                                {t('studentAET.additionalContextOptional')}
                                              </label>
                                              <textarea
                                                value={customInstructions[subcategory.id] || ''}
                                                onChange={(e) => setCustomInstructions(prev => ({
                                                  ...prev,
                                                  [subcategory.id]: e.target.value
                                                }))}
                                                placeholder={t('studentAET.addExtraContextPlaceholder').replace('{name}', student.firstName)}
                                                className="w-full h-20 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-xs bg-white"
                                              />
                                            </div>

                                            <div>
                                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                                {t('common.outputLanguage')}
                                              </label>
                                              <select
                                                value={planLanguage}
                                                onChange={(e) => setPlanLanguage(e.target.value as 'en' | 'ar')}
                                                className="w-full p-2 border border-gray-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                              >
                                                <option value="en">{t('common.english')}</option>
                                                <option value="ar">{t('common.arabic')}</option>
                                              </select>
                                            </div>

                                            <div className="flex justify-end gap-2">
                                              <button
                                                onClick={() => setShowInstructions(null)}
                                                className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200"
                                              >
                                                {t('common.cancel')}
                                              </button>
                                              <button
                                                onClick={() => generatePlan(subcategory.id, area.name, category.name, subcategory)}
                                                className="inline-flex items-center px-3 py-1.5 bg-ai-500 text-white rounded-lg text-xs font-medium hover:bg-ai-600"
                                              >
                                                <Wand2 className="h-3 w-3 mr-1" />
                                                {t('studentAET.generate')}
                                              </button>
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="space-y-3">
                                            <div className="text-center py-2">
                                              <Wand2 className="h-6 w-6 text-gray-300 mx-auto mb-2" />
                                              <p className="text-xs text-gray-600">
                                                {t('studentAET.getGoalGuidance')} <strong>{subcategory.name}</strong>
                                              </p>
                                            </div>

                                            <div className="flex justify-center">
                                              <select
                                                value={planLanguage}
                                                onChange={(e) => setPlanLanguage(e.target.value as 'en' | 'ar')}
                                                className="px-2 py-1 border border-gray-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                              >
                                                <option value="en">{t('common.english')}</option>
                                                <option value="ar">{t('common.arabic')}</option>
                                              </select>
                                            </div>

                                            <div className="flex flex-wrap justify-center gap-2">
                                              <button
                                                onClick={() => generatePlan(subcategory.id, area.name, category.name, subcategory)}
                                                className="inline-flex items-center px-3 py-1.5 bg-ai-500 text-white rounded-lg text-xs font-medium hover:bg-ai-600"
                                              >
                                                <Wand2 className="h-3 w-3 mr-1" />
                                                {t('studentAET.generateWithAI')}
                                              </button>
                                              <button
                                                onClick={() => setShowInstructions(subcategory.id)}
                                                className="inline-flex items-center px-3 py-1.5 bg-white text-primary-600 rounded-lg text-xs font-medium hover:bg-primary-50 border border-primary-200"
                                              >
                                                <MessageCircle className="h-3 w-3 mr-1" />
                                                {t('studentAET.addExtraContext')}
                                              </button>
                                              <button
                                                onClick={() => {
                                                  setEditingPlan(subcategory.id);
                                                  setEditedPlan('');
                                                }}
                                                className="inline-flex items-center px-3 py-1.5 bg-white text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 border border-gray-200"
                                              >
                                                <Pencil className="h-3 w-3 mr-1" />
                                                {t('studentAET.writeManually')}
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
            {t('studentAET.aetFrameworkStats')} • {framework.areas.length} {t('studentAET.areas')} • {
              framework.areas.reduce((acc, area) => acc + area.categories.length, 0)
            } {t('studentAET.categories')} • {totalSubcategories} {t('studentAET.subcategories')}
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
