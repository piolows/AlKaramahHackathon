'use client';

import Link from 'next/link';
import { use, useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  ChevronLeft,
  ChevronRight,
  Users,
  ArrowLeft,
  Sparkles,
  Target,
  Wand2,
  MessageCircle,
  Pencil,
  RefreshCw,
  Trash2,
  Check,
  X,
  Save,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  SkipForward,
  Settings,
  Brain,
  MessageSquare
} from 'lucide-react';
import { AET_FRAMEWORK, COLOR_CLASSES, PROGRESSION_LEVELS, Subcategory, Category, Area } from '@/lib/aet-framework';
import { Breadcrumb, LoadingSpinner } from '@/components';

interface ClassData {
  id: string;
  name: string;
  description: string | null;
  ageRange: string | null;
  studentCount: number;
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  classId: string;
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

interface SubcategoryProgress {
  level: number;
  completed: boolean;
  plan: string | null;
}

interface CurrentGoal {
  subcategoryId: string;
  area: Area;
  category: Category;
  subcategory: Subcategory;
}

export default function ClassDetailPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = use(params);
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Progress data for all students
  const [studentProgress, setStudentProgress] = useState<Record<string, Record<string, SubcategoryProgress>>>({});
  
  // UI state for plan generation/editing
  const [expandedGoals, setExpandedGoals] = useState<Record<string, boolean>>({});
  const [generatingPlan, setGeneratingPlan] = useState<string | null>(null);
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [editedPlan, setEditedPlan] = useState('');
  const [showInstructions, setShowInstructions] = useState<string | null>(null);
  const [customInstructions, setCustomInstructions] = useState<Record<string, string>>({});
  const [generationError, setGenerationError] = useState<string | null>(null);
  
  // State for generating all plans
  const [generatingAllPlans, setGeneratingAllPlans] = useState(false);
  const [allPlansProgress, setAllPlansProgress] = useState<{ current: number; total: number } | null>(null);
  const [showAllInstructions, setShowAllInstructions] = useState(false);
  const [allPlansInstructions, setAllPlansInstructions] = useState('');
  
  // State for goal navigation (studentId -> subcategoryId of viewed goal)
  const [viewedGoals, setViewedGoals] = useState<Record<string, string>>({});
  // State for completion animation (studentId -> 'completing' | 'fading' | null)
  const [completionPhase, setCompletionPhase] = useState<Record<string, 'completing' | 'fading' | null>>({});

  useEffect(() => {
    async function fetchData() {
      try {
        const [classRes, studentsRes] = await Promise.all([
          fetch(`/api/classes/${classId}`),
          fetch(`/api/students?classId=${classId}`)
        ]);
        
        if (classRes.ok) {
          setClassData(await classRes.json());
        }
        
        if (studentsRes.ok) {
          const studentsData = await studentsRes.json();
          setStudents(studentsData);
          
          // Fetch progress for all students
          const progressPromises = studentsData.map((s: Student) => 
            fetch(`/api/students/${s.id}/progress`).then(r => r.ok ? r.json() : {})
          );
          const progressResults = await Promise.all(progressPromises);
          
          const progressMap: Record<string, Record<string, SubcategoryProgress>> = {};
          studentsData.forEach((s: Student, i: number) => {
            progressMap[s.id] = progressResults[i];
          });
          setStudentProgress(progressMap);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [classId]);

  // Get all goals as a flat list
  const getAllGoals = (): CurrentGoal[] => {
    const goals: CurrentGoal[] = [];
    for (const area of AET_FRAMEWORK.areas) {
      for (const category of area.categories) {
        for (const subcategory of category.subcategories) {
          goals.push({ subcategoryId: subcategory.id, area, category, subcategory });
        }
      }
    }
    return goals;
  };

  // Get current goal for a student (first incomplete)
  const getCurrentGoal = (studentId: string): CurrentGoal | null => {
    const progress = studentProgress[studentId] || {};
    for (const area of AET_FRAMEWORK.areas) {
      for (const category of area.categories) {
        for (const subcategory of category.subcategories) {
          const subProgress = progress[subcategory.id];
          if (!subProgress?.completed) {
            return { subcategoryId: subcategory.id, area, category, subcategory };
          }
        }
      }
    }
    return null;
  };

  // Get goal by subcategory ID
  const getGoalBySubcategoryId = (subcategoryId: string): CurrentGoal | null => {
    for (const area of AET_FRAMEWORK.areas) {
      for (const category of area.categories) {
        for (const subcategory of category.subcategories) {
          if (subcategory.id === subcategoryId) {
            return { subcategoryId: subcategory.id, area, category, subcategory };
          }
        }
      }
    }
    return null;
  };

  // Get the goal to display for a student (either viewed goal or current goal)
  const getDisplayedGoal = (studentId: string): CurrentGoal | null => {
    const viewedGoalId = viewedGoals[studentId];
    if (viewedGoalId) {
      return getGoalBySubcategoryId(viewedGoalId);
    }
    return getCurrentGoal(studentId);
  };

  // Navigate to previous/next goal
  const navigateGoal = (studentId: string, direction: 'prev' | 'next') => {
    const allGoals = getAllGoals();
    const currentDisplayed = getDisplayedGoal(studentId);
    if (!currentDisplayed) return;
    
    const currentIndex = allGoals.findIndex(g => g.subcategoryId === currentDisplayed.subcategoryId);
    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    
    // Clamp to valid range
    if (newIndex < 0) newIndex = 0;
    if (newIndex >= allGoals.length) newIndex = allGoals.length - 1;
    
    const newGoal = allGoals[newIndex];
    setViewedGoals(prev => ({
      ...prev,
      [studentId]: newGoal.subcategoryId
    }));
  };

  // Jump to current goal (clear viewed goal override)
  const jumpToCurrentGoal = (studentId: string) => {
    setViewedGoals(prev => {
      const newViewed = { ...prev };
      delete newViewed[studentId];
      return newViewed;
    });
  };

  // Check if we're viewing the actual current goal
  const isViewingCurrentGoal = (studentId: string): boolean => {
    const viewedGoalId = viewedGoals[studentId];
    if (!viewedGoalId) return true;
    const currentGoal = getCurrentGoal(studentId);
    return currentGoal?.subcategoryId === viewedGoalId;
  };

  // Save progress to database
  async function saveProgress(studentId: string, subcategoryId: string, data: SubcategoryProgress) {
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
  async function deletePlanFromDb(studentId: string, subcategoryId: string) {
    try {
      await fetch(`/api/students/${studentId}/progress?subcategoryId=${subcategoryId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Failed to delete plan:', error);
    }
  }

  // Update level for a student's subcategory
  const updateLevel = (studentId: string, subcategoryId: string, level: number) => {
    const currentProgress = studentProgress[studentId]?.[subcategoryId] || { level: 0, completed: false, plan: null };
    const newProgress = {
      level,
      completed: level === 4 ? currentProgress.completed : false,
      plan: currentProgress.plan
    };
    setStudentProgress(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [subcategoryId]: newProgress
      }
    }));
    saveProgress(studentId, subcategoryId, newProgress);
  };

  // Toggle completed for a student's subcategory with animation
  const toggleCompleted = async (studentId: string, subcategoryId: string) => {
    const currentProgress = studentProgress[studentId]?.[subcategoryId] || { level: 0, completed: false, plan: null };
    const willBeCompleted = !currentProgress.completed;
    
    const newProgress = {
      level: currentProgress.level || 1,
      completed: willBeCompleted,
      plan: currentProgress.plan
    };
    
    setStudentProgress(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [subcategoryId]: newProgress
      }
    }));
    saveProgress(studentId, subcategoryId, newProgress);
    
    // If marking as complete, show animation with fade in, then fade out
    if (willBeCompleted) {
      // Phase 1: Fade in
      setCompletionPhase(prev => ({ ...prev, [studentId]: 'completing' }));
      
      // Wait for display time
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Phase 2: Fade out
      setCompletionPhase(prev => ({ ...prev, [studentId]: 'fading' }));
      
      // Wait for fade out animation
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Phase 3: Clear and move to next goal
      setCompletionPhase(prev => ({ ...prev, [studentId]: null }));
      setViewedGoals(prev => {
        const newViewed = { ...prev };
        delete newViewed[studentId];
        return newViewed;
      });
    }
  };

  // Generate plan for a student
  const generatePlan = async (
    student: Student,
    subcategoryId: string,
    areaName: string,
    categoryName: string,
    subcategory: Subcategory
  ) => {
    const key = `${student.id}-${subcategoryId}`;
    setGeneratingPlan(key);
    setGenerationError(null);
    
    const currentProgress = studentProgress[student.id]?.[subcategoryId] || { level: 1, completed: false, plan: null };
    const currentLevel = currentProgress.level || 1;
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
          customInstructions: customInstructions[key] || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate plan');
      }

      const newProgress = {
        level: currentLevel,
        completed: currentProgress.completed,
        plan: data.plan
      };
      setStudentProgress(prev => ({
        ...prev,
        [student.id]: {
          ...prev[student.id],
          [subcategoryId]: newProgress
        }
      }));
      saveProgress(student.id, subcategoryId, newProgress);
      setShowInstructions(null);
    } catch (error) {
      console.error('Error generating plan:', error);
      setGenerationError(error instanceof Error ? error.message : 'Failed to generate plan');
    } finally {
      setGeneratingPlan(null);
    }
  };

  // Save edited plan
  const savePlan = (studentId: string, subcategoryId: string) => {
    const currentProgress = studentProgress[studentId]?.[subcategoryId] || { level: 1, completed: false, plan: null };
    const newProgress = {
      level: currentProgress.level || 1,
      completed: currentProgress.completed,
      plan: editedPlan
    };
    setStudentProgress(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [subcategoryId]: newProgress
      }
    }));
    saveProgress(studentId, subcategoryId, newProgress);
    setEditingPlan(null);
  };

  // Delete plan
  const deletePlan = async (studentId: string, subcategoryId: string) => {
    const currentProgress = studentProgress[studentId]?.[subcategoryId] || { level: 1, completed: false, plan: null };
    const newProgress = {
      ...currentProgress,
      plan: null
    };
    setStudentProgress(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [subcategoryId]: newProgress
      }
    }));
    await deletePlanFromDb(studentId, subcategoryId);
  };

  // Generate plans for all students' current goals
  const generateAllPlans = async (globalInstructions?: string) => {
    // Capture goals and progress upfront to avoid stale state issues
    const studentsWithGoals: Array<{
      student: Student;
      goal: CurrentGoal;
      progress: SubcategoryProgress;
    }> = [];

    for (const student of students) {
      const goal = getCurrentGoal(student.id);
      if (!goal) continue;
      const progress = studentProgress[student.id]?.[goal.subcategoryId] || { level: 1, completed: false, plan: null };
      if (!progress.plan) {
        studentsWithGoals.push({ student, goal, progress });
      }
    }

    if (studentsWithGoals.length === 0) return;

    setGeneratingAllPlans(true);
    setAllPlansProgress({ current: 0, total: studentsWithGoals.length });
    setGenerationError(null);
    setShowAllInstructions(false);

    for (let i = 0; i < studentsWithGoals.length; i++) {
      const { student, goal, progress } = studentsWithGoals[i];

      setAllPlansProgress({ current: i + 1, total: studentsWithGoals.length });

      try {
        const currentLevel = progress.level || 1;
        const levelInfo = PROGRESSION_LEVELS[currentLevel - 1];
        const nextLevelInfo = currentLevel < 4 ? PROGRESSION_LEVELS[currentLevel] : null;

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
              teacherNotes: student.teacherNotes,
            },
            component: {
              name: goal.subcategory.name,
              description: `${goal.category.name} - ${goal.subcategory.code}: ${goal.subcategory.name}`,
              currentLevel: currentLevel,
              currentLevelDescription: levelInfo.description,
              nextLevelDescription: nextLevelInfo?.description || null,
              areaName: goal.area.name,
            },
            customInstructions: globalInstructions || undefined,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          const newProgress = {
            level: currentLevel,
            completed: progress.completed,
            plan: data.plan
          };
          setStudentProgress(prev => ({
            ...prev,
            [student.id]: {
              ...prev[student.id],
              [goal.subcategoryId]: newProgress
            }
          }));
          saveProgress(student.id, goal.subcategoryId, newProgress);
        }
      } catch (error) {
        console.error(`Error generating plan for ${student.firstName}:`, error);
      }
    }

    setGeneratingAllPlans(false);
    setAllPlansProgress(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!classData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Class Not Found</h1>
          <Link href="/classes" className="text-indigo-600 hover:underline">
            Return to Classes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={[
          { label: 'Classes', href: '/classes' },
          { label: classData.name }
        ]} />

        {/* Back Button */}
        <Link 
          href="/classes"
          className="inline-flex items-center text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Classes
        </Link>

        {/* Class Header */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{classData.name}</h1>
              <p className="text-gray-600 mb-4">{classData.description || 'No description'}</p>
              <div className="flex items-center space-x-4">
                <span className="inline-flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-1" />
                  {students.length} Students
                </span>
                {classData.ageRange && (
                  <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                    {classData.ageRange}
                  </span>
                )}
              </div>
            </div>
            
            {/* Generate All Plans Buttons */}
            {students.length > 0 && (() => {
              const studentsNeedingPlans = students.filter(student => {
                const goal = getCurrentGoal(student.id);
                if (!goal) return false;
                const progress = studentProgress[student.id]?.[goal.subcategoryId];
                return !progress?.plan;
              });
              
              const hasStudentsNeedingPlans = studentsNeedingPlans.length > 0;
              
              return (
                <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-2">
                  <button
                    onClick={() => generateAllPlans()}
                    disabled={generatingAllPlans || !hasStudentsNeedingPlans}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {generatingAllPlans ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {allPlansProgress ? (
                          <span>Generating {allPlansProgress.current}/{allPlansProgress.total}...</span>
                        ) : (
                          <span>Starting...</span>
                        )}
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span>Generate All {hasStudentsNeedingPlans ? `(${studentsNeedingPlans.length})` : ''}</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowAllInstructions(true)}
                    disabled={generatingAllPlans || !hasStudentsNeedingPlans}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Add Instructions</span>
                  </button>
                </div>
              );
            })()}
          </div>
          
          {/* Generate All with Instructions Panel */}
          {showAllInstructions && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-start gap-3">
                <MessageCircle className="h-5 w-5 text-indigo-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Custom Instructions for All Plans</h3>
                  <p className="text-xs text-gray-500 mb-3">These instructions will be applied to all generated plans in this class.</p>
                  <textarea
                    value={allPlansInstructions}
                    onChange={(e) => setAllPlansInstructions(e.target.value)}
                    placeholder="E.g., Focus on visual supports, include parent involvement activities, keep activities under 10 minutes..."
                    className="w-full h-24 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      onClick={() => {
                        setShowAllInstructions(false);
                        setAllPlansInstructions('');
                      }}
                      className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => generateAllPlans(allPlansInstructions)}
                      disabled={generatingAllPlans}
                      className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50"
                    >
                      <Sparkles className="h-4 w-4" />
                      Generate All Plans
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Students Grid */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Students</h2>
        </div>

        {students.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Yet</h3>
            <p className="text-gray-600 mb-4">Add students to this class in the admin panel.</p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Settings className="h-4 w-4" />
              Go to Admin
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {students.map((student) => {
              const displayedGoal = getDisplayedGoal(student.id);
              const actualCurrentGoal = getCurrentGoal(student.id);
              const goalKey = displayedGoal ? `${student.id}-${displayedGoal.subcategoryId}` : null;
              const isGoalExpanded = goalKey ? expandedGoals[goalKey] : false;
              const progress = displayedGoal ? studentProgress[student.id]?.[displayedGoal.subcategoryId] : null;
              const currentLevel = progress?.level || 0;
              const hasPlan = progress?.plan;
              const colors = displayedGoal ? COLOR_CLASSES[displayedGoal.area.color] : null;
              const animationPhase = completionPhase[student.id];
              const isAtCurrentGoal = isViewingCurrentGoal(student.id);
              const allGoals = getAllGoals();
              const currentGoalIndex = displayedGoal ? allGoals.findIndex(g => g.subcategoryId === displayedGoal.subcategoryId) : -1;
              const isFirstGoal = currentGoalIndex === 0;
              const isLastGoal = currentGoalIndex === allGoals.length - 1;

              return (
                <div
                  key={student.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all overflow-hidden"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Left Side - Student Info */}
                    <div className="lg:w-1/3 p-6 lg:border-r border-gray-100">
                      {/* Student Header */}
                      <div className="flex items-center mb-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-lg font-semibold">
                          {student.firstName[0]}{student.lastName[0]}
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {student.firstName} {student.lastName}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(student.dateOfBirth).toLocaleDateString('en-GB', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Quick Info */}
                      <div className="space-y-2 mb-4">
                        {student.diagnoses.length > 0 && (
                          <div className="flex items-start gap-2">
                            <Brain className="h-4 w-4 text-purple-500 shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-600">{student.diagnoses.join(', ')}</span>
                          </div>
                        )}
                        {student.communicationStyle && (
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-blue-500 shrink-0" />
                            <span className="text-sm text-gray-600 truncate">{student.communicationStyle}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Link
                          href={`/students/${student.id}`}
                          className="flex-1 text-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                        >
                          Profile
                        </Link>
                        <Link
                          href={`/students/${student.id}/aet`}
                          className="flex-1 text-center px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                        >
                          All Goals
                        </Link>
                      </div>
                    </div>

                    {/* Right Side - Current Goal */}
                    <div className="lg:w-2/3 flex flex-col">
                      {displayedGoal && colors ? (
                        <div className={`flex-1 ${colors.bg} p-6 relative ${animationPhase ? 'overflow-hidden' : ''}`}>
                          {/* Completion Animation Overlay */}
                          {animationPhase && (
                            <div className={`absolute inset-0 bg-green-500/95 flex flex-col items-center justify-center z-10 ${animationPhase === 'fading' ? 'animate-fade-out-scale' : 'animate-fade-in-scale'}`}>
                              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-3 animate-success-pulse">
                                <Check className="h-10 w-10 text-green-500" />
                              </div>
                              <p className="text-white font-bold text-lg animate-fade-in-up">Goal Completed!</p>
                              <p className="text-green-100 text-sm mt-1 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>Moving to next goal...</p>
                            </div>
                          )}
                          
                          {/* Goal Header with Navigation */}
                          <div className="flex items-center justify-between gap-2 mb-4">
                            <div className="flex items-center gap-2">
                              <Target className={`h-5 w-5 ${colors.text}`} />
                              <span className="text-sm font-semibold text-gray-700">
                                {isAtCurrentGoal ? 'Current Goal' : 'Viewing Goal'}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
                                {displayedGoal.area.name}
                              </span>
                              {!isAtCurrentGoal && (
                                <span className={`text-xs px-2 py-0.5 rounded-full ${progress?.completed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                  {progress?.completed ? 'Completed' : 'Not Current'}
                                </span>
                              )}
                            </div>
                            
                            {/* Navigation Buttons */}
                            <div className="flex items-center gap-1">
                              {!isAtCurrentGoal && actualCurrentGoal && (
                                <button
                                  onClick={() => jumpToCurrentGoal(student.id)}
                                  className="mr-1 px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors flex items-center gap-1"
                                  title="Jump to current goal"
                                >
                                  <SkipForward className="h-3 w-3" />
                                  Current
                                </button>
                              )}
                              <button
                                onClick={() => navigateGoal(student.id, 'prev')}
                                disabled={isFirstGoal}
                                className="p-1.5 rounded-lg hover:bg-white/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                title="Previous goal"
                              >
                                <ChevronLeft className="h-4 w-4 text-gray-600" />
                              </button>
                              <span className="text-xs text-gray-500 px-1">
                                {currentGoalIndex + 1}/{allGoals.length}
                              </span>
                              <button
                                onClick={() => navigateGoal(student.id, 'next')}
                                disabled={isLastGoal}
                                className="p-1.5 rounded-lg hover:bg-white/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                title="Next goal"
                              >
                                <ChevronRight className="h-4 w-4 text-gray-600" />
                              </button>
                            </div>
                          </div>

                          {/* Goal Content */}
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex items-start gap-3 flex-1">
                              {/* Completion Checkbox */}
                              <button
                                onClick={() => toggleCompleted(student.id, displayedGoal.subcategoryId)}
                                className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                                  progress?.completed 
                                    ? 'bg-green-500 border-green-500 text-white scale-110' 
                                    : 'border-gray-300 hover:border-green-400 bg-white hover:scale-105'
                                }`}
                              >
                                {progress?.completed && <Check className="h-4 w-4" />}
                              </button>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-sm font-mono px-2 py-0.5 rounded ${colors.bg} ${colors.text}`}>
                                    {displayedGoal.subcategory.code}
                                  </span>
                                  <span className="text-xs text-gray-500">{displayedGoal.category.name}</span>
                                </div>
                                <p className="text-base font-medium text-gray-900">
                                  {displayedGoal.subcategory.name}
                                </p>
                              </div>
                            </div>

                            {/* Level Selector */}
                            <div className="flex items-center gap-1 shrink-0">
                              {PROGRESSION_LEVELS.map((levelInfo) => (
                                <button
                                  key={levelInfo.level}
                                  onClick={() => updateLevel(student.id, displayedGoal.subcategoryId, levelInfo.level)}
                                  title={`${levelInfo.name} (${levelInfo.shortName})`}
                                  className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
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
                            {/* Plan Toggle Header */}
                            <button
                              onClick={() => setExpandedGoals(prev => ({ ...prev, [goalKey!]: !isGoalExpanded }))}
                              className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors ${
                                hasPlan 
                                  ? `${colors.bg} ${colors.text} hover:opacity-90`
                                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4" />
                                {hasPlan ? 'View Teaching Plan' : 'Add Teaching Plan'}
                              </span>
                              {isGoalExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </button>

                            {/* Expanded Plan Content */}
                            {isGoalExpanded && (
                              <div className="p-4 border-t border-gray-200">
                                {/* Error Message */}
                                {generationError && generatingPlan === null && (
                                  <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                                    <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                    <div>
                                      <p className="text-sm text-red-700 font-medium">Generation Failed</p>
                                      <p className="text-xs text-red-600">{generationError}</p>
                                    </div>
                                  </div>
                                )}

                                {generatingPlan === goalKey ? (
                                  <div className="text-center py-8">
                                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
                                    <p className="text-sm text-gray-600 font-medium">Generating personalized plan...</p>
                                    <p className="text-xs text-gray-500 mt-1">Analyzing {student.firstName}&apos;s profile</p>
                                  </div>
                                ) : editingPlan === goalKey ? (
                                  <div>
                                    <textarea
                                      value={editedPlan}
                                      onChange={(e) => setEditedPlan(e.target.value)}
                                      className="w-full h-40 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-mono text-sm bg-white"
                                      placeholder="Write your teaching plan..."
                                    />
                                    <div className="flex justify-end gap-2 mt-3">
                                      <button
                                        onClick={() => setEditingPlan(null)}
                                        className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                                      >
                                        <X className="h-4 w-4 mr-1" />
                                        Cancel
                                      </button>
                                      <button
                                        onClick={() => savePlan(student.id, displayedGoal.subcategoryId)}
                                        className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                                      >
                                        <Save className="h-4 w-4 mr-1" />
                                        Save Plan
                                      </button>
                                    </div>
                                  </div>
                                ) : hasPlan ? (
                                  <div>
                                    <div className="prose prose-sm max-w-none text-gray-700 mb-4 max-h-48 overflow-y-auto">
                                      <ReactMarkdown>{hasPlan}</ReactMarkdown>
                                    </div>
                                    <div className="flex flex-wrap justify-end gap-2 pt-3 border-t border-gray-100">
                                      <button
                                        onClick={() => generatePlan(student, displayedGoal.subcategoryId, displayedGoal.area.name, displayedGoal.category.name, displayedGoal.subcategory)}
                                        className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100"
                                      >
                                        <RefreshCw className="h-4 w-4 mr-1" />
                                        Regenerate
                                      </button>
                                      <button
                                        onClick={() => {
                                          setEditingPlan(goalKey);
                                          setEditedPlan(hasPlan);
                                        }}
                                        className="inline-flex items-center px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100"
                                      >
                                        <Pencil className="h-4 w-4 mr-1" />
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => deletePlan(student.id, displayedGoal.subcategoryId)}
                                        className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100"
                                      >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                ) : showInstructions === goalKey ? (
                                  <div className="space-y-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <MessageCircle className="h-4 w-4 inline mr-1" />
                                        Additional Instructions
                                      </label>
                                      <textarea
                                        value={customInstructions[goalKey!] || ''}
                                        onChange={(e) => setCustomInstructions(prev => ({
                                          ...prev,
                                          [goalKey!]: e.target.value
                                        }))}
                                        placeholder={`Add specific instructions for ${student.firstName}'s plan...`}
                                        className="w-full h-20 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm bg-white"
                                      />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                      <button
                                        onClick={() => setShowInstructions(null)}
                                        className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        onClick={() => generatePlan(student, displayedGoal.subcategoryId, displayedGoal.area.name, displayedGoal.category.name, displayedGoal.subcategory)}
                                        className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                                      >
                                        <Wand2 className="h-4 w-4 mr-1" />
                                        Generate Plan
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-4">
                                    <div className="text-center py-4">
                                      <Wand2 className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                      <p className="text-sm text-gray-600">
                                        Generate a personalized plan for <strong>{displayedGoal.subcategory.name}</strong>
                                      </p>
                                    </div>
                                    <div className="flex flex-wrap justify-center gap-3">
                                      <button
                                        onClick={() => generatePlan(student, displayedGoal.subcategoryId, displayedGoal.area.name, displayedGoal.category.name, displayedGoal.subcategory)}
                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                                      >
                                        <Wand2 className="h-4 w-4 mr-1" />
                                        Generate with AI
                                      </button>
                                      <button
                                        onClick={() => setShowInstructions(goalKey)}
                                        className="inline-flex items-center px-4 py-2 bg-white text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-50 border border-indigo-200"
                                      >
                                        <MessageCircle className="h-4 w-4 mr-1" />
                                        Add Instructions
                                      </button>
                                      <button
                                        onClick={() => {
                                          setEditingPlan(goalKey);
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
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 bg-green-50 p-6 flex items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                              <Check className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <span className="text-base font-semibold text-green-800">All AET goals completed!</span>
                              <p className="text-sm text-green-600">Great progress on the framework</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
