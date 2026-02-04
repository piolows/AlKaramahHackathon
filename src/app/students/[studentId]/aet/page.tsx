'use client';

import Link from 'next/link';
import { use, useState, useEffect } from 'react';
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
  Trash2,
  Settings,
  Target
} from 'lucide-react';
import { AET_FRAMEWORK, COLOR_CLASSES, PROGRESSION_LEVELS, Subcategory, Category, Area, findSubcategoryById } from '@/lib/aet-framework';

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
}

// Progress data structure for subcategories
interface SubcategoryProgress {
  level: number;
  completed: boolean;
  plan: string | null;
}

export default function StudentAETPage({ params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = use(params);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [expandedAreas, setExpandedAreas] = useState<string[]>([AET_FRAMEWORK.areas[0].id]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedSubcategories, setExpandedSubcategories] = useState<string[]>([]);
  const [progress, setProgress] = useState<Record<string, SubcategoryProgress>>({});
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [editedPlan, setEditedPlan] = useState('');
  const [generatingPlan, setGeneratingPlan] = useState<string | null>(null);
  const [customInstructions, setCustomInstructions] = useState<Record<string, string>>({});
  const [showInstructions, setShowInstructions] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Fetch student and progress data
  useEffect(() => {
    async function fetchData() {
      try {
        const [studentRes, progressRes] = await Promise.all([
          fetch(`/api/students/${studentId}`),
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
    fetchData();
  }, [studentId]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!student) {
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

  // Find the current goal (last unfinished subcategory - first one that isn't completed)
  const getCurrentGoal = (): { subcategoryId: string; area: Area; category: Category; subcategory: Subcategory } | null => {
    for (const area of AET_FRAMEWORK.areas) {
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
              <Link 
                href="/admin" 
                className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Admin
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
          <Link href={`/classes/${student.classId}`} className="hover:text-indigo-600">{student.className}</Link>
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

        {/* Page Header with Current Goal */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
          <div className="p-6">
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
          </div>

          {/* Current Goal Section - Integrated into header card */}
          {currentGoal ? (
            (() => {
              const { subcategoryId, area, category, subcategory } = currentGoal;
              const colors = COLOR_CLASSES[area.color];
              const subProgress = progress[subcategoryId];
              const currentLevel = subProgress?.level || 0;
              const isCompleted = subProgress?.completed || false;
              const hasPlan = subProgress?.plan;

              return (
                <div className={`border-t-2 ${colors.border} ${colors.bg} p-6`}>
                  {/* Current Goal Header */}
                  <div className="flex items-center gap-2 mb-4">
                    <Target className={`h-5 w-5 ${colors.text}`} />
                    <h2 className="text-lg font-semibold text-gray-900">Current Goal</h2>
                    <span className={`text-sm px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
                      {area.name}
                    </span>
                  </div>

                  {/* Goal Content */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      {/* Completion Checkbox */}
                      <button
                        onClick={() => toggleCompleted(subcategoryId)}
                        className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                          isCompleted 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-gray-300 hover:border-green-400 bg-white'
                        }`}
                      >
                        {isCompleted && <Check className="h-4 w-4" />}
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-sm font-mono px-2 py-0.5 rounded ${colors.bg} ${colors.text}`}>
                            {subcategory.code}
                          </span>
                          <span className="text-sm text-gray-500">{category.name}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {subcategory.name}
                        </h3>
                        {currentLevel > 0 && (
                          <p className="text-sm text-gray-600 mt-1">
                            Current: <span className="font-medium">{PROGRESSION_LEVELS[currentLevel - 1].name}</span>
                            <span className="text-gray-400 ml-1">— {PROGRESSION_LEVELS[currentLevel - 1].description}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Level Selector */}
                    <div className="flex items-center gap-1 shrink-0">
                      {PROGRESSION_LEVELS.map((levelInfo) => (
                        <button
                          key={levelInfo.level}
                          onClick={() => updateLevel(subcategoryId, levelInfo.level)}
                          title={`${levelInfo.name} (${levelInfo.shortName})`}
                          className={`w-9 h-9 rounded-full text-xs font-bold transition-all ${
                            currentLevel >= levelInfo.level
                              ? `${levelInfo.color} text-white`
                              : 'bg-white text-gray-400 hover:bg-gray-100 border border-gray-200'
                          }`}
                        >
                          {levelInfo.shortName}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Plan Section */}
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {/* Error Message */}
                    {generationError && generatingPlan === null && (
                      <div className="m-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-red-700 font-medium">Generation Failed</p>
                          <p className="text-xs text-red-600">{generationError}</p>
                        </div>
                      </div>
                    )}
                    
                    {generatingPlan === subcategoryId ? (
                      <div className="text-center py-8">
                        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
                        <p className="text-sm text-gray-600 font-medium">Generating personalized plan...</p>
                        <p className="text-xs text-gray-500 mt-1">Analyzing {student.firstName}&apos;s profile</p>
                      </div>
                    ) : editingPlan === subcategoryId ? (
                      <div className="p-4">
                        <textarea
                          value={editedPlan}
                          onChange={(e) => setEditedPlan(e.target.value)}
                          className="w-full h-48 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-mono text-sm bg-white"
                          placeholder="Write your personalized teaching plan..."
                        />
                        <div className="flex justify-end gap-2 mt-3">
                          <button
                            onClick={() => setEditingPlan(null)}
                            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </button>
                          <button
                            onClick={() => savePlan(subcategoryId)}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                          >
                            <Save className="h-4 w-4 mr-1" />
                            Save Plan
                          </button>
                        </div>
                      </div>
                    ) : hasPlan ? (
                      <div className="p-4">
                        <div className="prose prose-sm max-w-none mb-4">
                          <div className="whitespace-pre-wrap text-gray-700 text-sm">
                            {hasPlan}
                          </div>
                        </div>
                        <div className="flex flex-wrap justify-end gap-2 pt-3 border-t border-gray-100">
                          <button
                            onClick={() => generatePlan(subcategoryId, area.name, category.name, subcategory)}
                            className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 border border-indigo-200"
                          >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Regenerate
                          </button>
                          <button
                            onClick={() => setShowInstructions(subcategoryId)}
                            className="inline-flex items-center px-3 py-1.5 bg-white text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 border border-gray-200"
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            With Instructions
                          </button>
                          <button
                            onClick={() => {
                              setEditingPlan(subcategoryId);
                              setEditedPlan(hasPlan);
                            }}
                            className="inline-flex items-center px-3 py-1.5 bg-white text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 border border-gray-200"
                          >
                            <Pencil className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={async () => {
                              setProgress(prev => ({
                                ...prev,
                                [subcategoryId]: {
                                  ...prev[subcategoryId],
                                  plan: null
                                }
                              }));
                              await deletePlanFromDb(subcategoryId);
                            }}
                            className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 border border-red-200"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ) : showInstructions === subcategoryId ? (
                      <div className="p-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <MessageCircle className="h-4 w-4 inline mr-1" />
                            Additional Instructions (Optional)
                          </label>
                          <textarea
                            value={customInstructions[subcategoryId] || ''}
                            onChange={(e) => setCustomInstructions(prev => ({
                              ...prev,
                              [subcategoryId]: e.target.value
                            }))}
                            placeholder={`Add specific instructions for ${student.firstName}'s plan...`}
                            className="w-full h-24 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm bg-white"
                          />
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setShowInstructions(null)}
                            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => generatePlan(subcategoryId, area.name, category.name, subcategory)}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                          >
                            <Wand2 className="h-4 w-4 mr-1" />
                            Generate Plan
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 space-y-4">
                        <div className="text-center py-4">
                          <Wand2 className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            Generate a personalized teaching plan for <strong>{subcategory.name}</strong>
                          </p>
                        </div>
                        
                        <div className="flex flex-wrap justify-center gap-3">
                          <button
                            onClick={() => generatePlan(subcategoryId, area.name, category.name, subcategory)}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                          >
                            <Wand2 className="h-4 w-4 mr-1" />
                            Generate with AI
                          </button>
                          <button
                            onClick={() => setShowInstructions(subcategoryId)}
                            className="inline-flex items-center px-4 py-2 bg-white text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-50 border border-indigo-200"
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Add Instructions
                          </button>
                          <button
                            onClick={() => {
                              setEditingPlan(subcategoryId);
                              setEditedPlan('');
                            }}
                            className="inline-flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 border border-gray-200"
                          >
                            <Pencil className="h-4 w-4 mr-1" />
                            Write Manually
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()
          ) : completedSubcategories > 0 ? (
            <div className="border-t-2 border-green-300 bg-green-50 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-green-800">All Goals Completed!</h2>
                  <p className="text-sm text-green-600">Congratulations! {student.firstName} has completed all {totalSubcategories} AET goals.</p>
                </div>
              </div>
            </div>
          ) : null}
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
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${levelInfo.color}`}>
                  {levelInfo.shortName}
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
                                        <div className="flex items-center gap-1 shrink-0">
                                          {PROGRESSION_LEVELS.map((levelInfo) => (
                                            <button
                                              key={levelInfo.level}
                                              onClick={() => updateLevel(subcategory.id, levelInfo.level)}
                                              title={`${levelInfo.name} (${levelInfo.shortName})`}
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
