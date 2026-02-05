'use client';

import Link from 'next/link';
import { use, useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  GraduationCap, 
  ChevronRight,
  Users,
  ArrowLeft,
  Brain,
  Sparkles,
  MessageSquare,
  Settings,
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
  ChevronUp
} from 'lucide-react';
import { AET_FRAMEWORK, COLOR_CLASSES, PROGRESSION_LEVELS, Subcategory, Category, Area } from '@/lib/aet-framework';

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

  // Get current goal for a student
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

  // Toggle completed for a student's subcategory
  const toggleCompleted = (studentId: string, subcategoryId: string) => {
    const currentProgress = studentProgress[studentId]?.[subcategoryId] || { level: 0, completed: false, plan: null };
    const newProgress = {
      level: currentProgress.level || 1,
      completed: !currentProgress.completed,
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
  const generateAllPlans = async () => {
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
            },
            component: {
              name: goal.subcategory.name,
              description: `${goal.category.name} - ${goal.subcategory.code}: ${goal.subcategory.name}`,
              currentLevel: currentLevel,
              currentLevelDescription: levelInfo.description,
              nextLevelDescription: nextLevelInfo?.description || null,
              areaName: goal.area.name,
            },
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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-100">
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
                className="flex items-center gap-1 text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                <Settings className="h-4 w-4" />
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
          <span className="text-gray-900">{classData.name}</span>
        </div>

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
            
            {/* Generate All Plans Button */}
            {students.length > 0 && (() => {
              const studentsNeedingPlans = students.filter(student => {
                const goal = getCurrentGoal(student.id);
                if (!goal) return false;
                const progress = studentProgress[student.id]?.[goal.subcategoryId];
                return !progress?.plan;
              });
              
              if (studentsNeedingPlans.length === 0) return null;
              
              return (
                <button
                  onClick={generateAllPlans}
                  disabled={generatingAllPlans}
                  className="mt-4 md:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                      <span>Generate All Plans ({studentsNeedingPlans.length})</span>
                    </>
                  )}
                </button>
              );
            })()}
          </div>
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
              const currentGoal = getCurrentGoal(student.id);
              const goalKey = currentGoal ? `${student.id}-${currentGoal.subcategoryId}` : null;
              const isGoalExpanded = goalKey ? expandedGoals[goalKey] : false;
              const progress = currentGoal ? studentProgress[student.id]?.[currentGoal.subcategoryId] : null;
              const currentLevel = progress?.level || 0;
              const hasPlan = progress?.plan;
              const colors = currentGoal ? COLOR_CLASSES[currentGoal.area.color] : null;

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
                          <div className="flex items-center gap-2">
                            <Brain className="h-4 w-4 text-purple-500 shrink-0" />
                            <span className="text-sm text-gray-600">{student.diagnoses[0]}</span>
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
                      {currentGoal && colors ? (
                        <div className={`flex-1 ${colors.bg} p-6`}>
                          {/* Goal Header */}
                          <div className="flex items-center gap-2 mb-4">
                            <Target className={`h-5 w-5 ${colors.text}`} />
                            <span className="text-sm font-semibold text-gray-700">Current Goal</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
                              {currentGoal.area.name}
                            </span>
                          </div>

                          {/* Goal Content */}
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex items-start gap-3 flex-1">
                              {/* Completion Checkbox */}
                              <button
                                onClick={() => toggleCompleted(student.id, currentGoal.subcategoryId)}
                                className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                                  progress?.completed 
                                    ? 'bg-green-500 border-green-500 text-white' 
                                    : 'border-gray-300 hover:border-green-400 bg-white'
                                }`}
                              >
                                {progress?.completed && <Check className="h-4 w-4" />}
                              </button>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-sm font-mono px-2 py-0.5 rounded ${colors.bg} ${colors.text}`}>
                                    {currentGoal.subcategory.code}
                                  </span>
                                  <span className="text-xs text-gray-500">{currentGoal.category.name}</span>
                                </div>
                                <p className="text-base font-medium text-gray-900">
                                  {currentGoal.subcategory.name}
                                </p>
                              </div>
                            </div>

                            {/* Level Selector */}
                            <div className="flex items-center gap-1 shrink-0">
                              {PROGRESSION_LEVELS.map((levelInfo) => (
                                <button
                                  key={levelInfo.level}
                                  onClick={() => updateLevel(student.id, currentGoal.subcategoryId, levelInfo.level)}
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
                                        onClick={() => savePlan(student.id, currentGoal.subcategoryId)}
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
                                        onClick={() => generatePlan(student, currentGoal.subcategoryId, currentGoal.area.name, currentGoal.category.name, currentGoal.subcategory)}
                                        className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100"
                                      >
                                        <RefreshCw className="h-4 w-4 mr-1" />
                                        Regenerate
                                      </button>
                                      <button
                                        onClick={() => setShowInstructions(goalKey)}
                                        className="inline-flex items-center px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100"
                                      >
                                        <MessageCircle className="h-4 w-4 mr-1" />
                                        With Instructions
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
                                        onClick={() => deletePlan(student.id, currentGoal.subcategoryId)}
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
                                        onClick={() => generatePlan(student, currentGoal.subcategoryId, currentGoal.area.name, currentGoal.category.name, currentGoal.subcategory)}
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
                                        Generate a personalized plan for <strong>{currentGoal.subcategory.name}</strong>
                                      </p>
                                    </div>
                                    <div className="flex flex-wrap justify-center gap-3">
                                      <button
                                        onClick={() => generatePlan(student, currentGoal.subcategoryId, currentGoal.area.name, currentGoal.category.name, currentGoal.subcategory)}
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
