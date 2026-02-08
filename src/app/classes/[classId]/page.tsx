'use client';

import Link from 'next/link';
import { use, useState, useEffect, useRef, useCallback } from 'react';
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
  MessageSquare,
  BookOpen,
  FileText,
  Printer,
  History,
  Calendar,
  Clock,
  ImageIcon,
  ArrowRight,
  Plus,
  Search,
  GripVertical
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

interface SavedLesson {
  id: string;
  curriculumArea: string;
  lessonTopic: string;
  learningObjective: string;
  content: string;
  visualSchedule: string | null;
  createdAt: string;
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

  
  // State for goal navigation (studentId -> subcategoryId of viewed goal)
  const [viewedGoals, setViewedGoals] = useState<Record<string, string>>({});
  // State for completion animation (studentId -> 'completing' | 'fading' | null)
  const [completionPhase, setCompletionPhase] = useState<Record<string, 'completing' | 'fading' | null>>({});
  
  // State for class lesson generation
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [generatingLesson, setGeneratingLesson] = useState(false);
  const [generatedLesson, setGeneratedLesson] = useState<string | null>(null);
  const [lessonError, setLessonError] = useState<string | null>(null);
  const [lessonForm, setLessonForm] = useState({
    curriculumArea: 'Mathematics',
    lessonTopic: '',
    learningObjective: '',
    additionalNotes: ''
  });
  
  // State for saved lessons
  const [savedLessons, setSavedLessons] = useState<SavedLesson[]>([]);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [showLessonHistory, setShowLessonHistory] = useState(false);
  const [deletingLessonId, setDeletingLessonId] = useState<string | null>(null);
  
  // State for lesson editing/refining
  const [editingLesson, setEditingLesson] = useState(false);
  const [editedLessonContent, setEditedLessonContent] = useState('');
  const [showRefineInput, setShowRefineInput] = useState(false);
  const [refineFeedback, setRefineFeedback] = useState('');
  const [refiningLesson, setRefiningLesson] = useState(false);
  
  // State for visual schedule
  const [visualSteps, setVisualSteps] = useState<{
    label: string;
    searchWord: string;
    alternativeWords?: string[];
    pictogramId: number | null;
    pictogramUrl: string | null;
  }[] | null>(null);
  const [generatingVisuals, setGeneratingVisuals] = useState(false);
  const [visualError, setVisualError] = useState<string | null>(null);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [cardSearchQuery, setCardSearchQuery] = useState('');
  const [cardSearchResults, setCardSearchResults] = useState<{ id: number; url: string; keywords: string[] }[]>([]);
  const [cardSearching, setCardSearching] = useState(false);
  const [newCardLabel, setNewCardLabel] = useState('');
  const [regeneratingCardIndex, setRegeneratingCardIndex] = useState<number | null>(null);
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragCounter = useRef<Record<number, number>>({});

  useEffect(() => {
    async function fetchData() {
      try {
        const [classRes, studentsRes, lessonsRes] = await Promise.all([
          fetch(`/api/classes/${classId}`),
          fetch(`/api/students?classId=${classId}`),
          fetch(`/api/classes/${classId}/lessons`)
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
        
        // Load saved lessons (don't auto-expand — user can open via dropdown)
        if (lessonsRes.ok) {
          const lessonsData = await lessonsRes.json();
          setSavedLessons(lessonsData);
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
            className: classData?.name,
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
              className: classData?.name,
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

  // Generate unified class lesson plan
  const generateClassLesson = async () => {
    if (!classData || students.length === 0) return;
    
    setGeneratingLesson(true);
    setLessonError(null);
    
    try {
      // Build student profiles with their current goals
      const studentProfiles = students.map(student => {
        const currentGoal = getCurrentGoal(student.id);
        return {
          id: student.id,
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
          currentGoals: currentGoal ? [{
            areaName: currentGoal.area.name,
            categoryName: currentGoal.category.name,
            subcategoryName: currentGoal.subcategory.name,
            level: studentProgress[student.id]?.[currentGoal.subcategoryId]?.level || 1
          }] : []
        };
      });

      const response = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          className: classData.name,
          ageRange: classData.ageRange || '5-10',
          students: studentProfiles,
          lessonTopic: lessonForm.lessonTopic,
          curriculumArea: lessonForm.curriculumArea,
          learningObjective: lessonForm.learningObjective,
          additionalNotes: lessonForm.additionalNotes || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate lesson');
      }

      // Save the lesson to the database
      const saveRes = await fetch(`/api/classes/${classId}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          curriculumArea: lessonForm.curriculumArea,
          lessonTopic: lessonForm.lessonTopic,
          learningObjective: lessonForm.learningObjective,
          additionalNotes: lessonForm.additionalNotes || null,
          content: data.lesson,
        }),
      });

      if (saveRes.ok) {
        const savedLesson = await saveRes.json();
        setSavedLessons(prev => [savedLesson, ...prev]);
        setCurrentLessonId(savedLesson.id);
      }

      setGeneratedLesson(data.lesson);
      setShowLessonModal(false);
      // Reset form for next use
      setLessonForm({ curriculumArea: 'Mathematics', lessonTopic: '', learningObjective: '', additionalNotes: '' });
    } catch (error) {
      console.error('Error generating lesson:', error);
      setLessonError(error instanceof Error ? error.message : 'Failed to generate lesson');
    } finally {
      setGeneratingLesson(false);
    }
  };

  // Refine an existing lesson with AI
  const refineLesson = async () => {
    if (!generatedLesson || !refineFeedback.trim()) return;
    
    setRefiningLesson(true);
    try {
      const response = await fetch('/api/refine-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentLesson: generatedLesson,
          teacherFeedback: refineFeedback.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to refine lesson');

      setGeneratedLesson(data.lesson);
      setShowRefineInput(false);
      setRefineFeedback('');

      // Update in database if this is a saved lesson
      if (currentLessonId) {
        const patchRes = await fetch(`/api/classes/${classId}/lessons/${currentLessonId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: data.lesson }),
        });
        if (patchRes.ok) {
          const updated = await patchRes.json();
          setSavedLessons(prev => prev.map(l => l.id === currentLessonId ? { ...l, content: updated.content } : l));
        }
      }
    } catch (error) {
      console.error('Error refining lesson:', error);
      setLessonError(error instanceof Error ? error.message : 'Failed to refine lesson');
    } finally {
      setRefiningLesson(false);
    }
  };

  // Save manually edited lesson content
  const saveLessonEdit = async () => {
    setGeneratedLesson(editedLessonContent);
    setEditingLesson(false);

    if (currentLessonId) {
      const patchRes = await fetch(`/api/classes/${classId}/lessons/${currentLessonId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editedLessonContent }),
      });
      if (patchRes.ok) {
        const updated = await patchRes.json();
        setSavedLessons(prev => prev.map(l => l.id === currentLessonId ? { ...l, content: updated.content } : l));
      }
    }
  };

  // Delete the currently viewed lesson
  const deleteCurrentLesson = async () => {
    if (!currentLessonId) {
      // Unsaved lesson — just clear it
      setGeneratedLesson(null);
      setVisualSteps(null);
      return;
    }

    if (!confirm('Delete this lesson plan?')) return;

    try {
      const res = await fetch(`/api/classes/${classId}/lessons/${currentLessonId}`, { method: 'DELETE' });
      if (res.ok) {
        const remaining = savedLessons.filter(l => l.id !== currentLessonId);
        setSavedLessons(remaining);
        if (remaining.length > 0) {
          setGeneratedLesson(remaining[0].content);
          setCurrentLessonId(remaining[0].id);
        } else {
          setGeneratedLesson(null);
          setCurrentLessonId(null);
          setShowLessonHistory(false);
          setVisualSteps(null);
        }
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
    }
  };

  // Save visual schedule to database
  const saveVisualSchedule = useCallback(async (steps: typeof visualSteps) => {
    if (!currentLessonId || !steps) return;
    try {
      await fetch(`/api/classes/${classId}/lessons/${currentLessonId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visualSchedule: JSON.stringify(steps) }),
      });
      // Update local savedLessons cache
      setSavedLessons(prev => prev.map(l =>
        l.id === currentLessonId ? { ...l, visualSchedule: JSON.stringify(steps) } : l
      ));
    } catch (error) {
      console.error('Error saving visual schedule:', error);
    }
  }, [currentLessonId, classId]);

  // Generate visual schedule from lesson
  const generateVisualSchedule = async () => {
    if (!generatedLesson) return;

    setGeneratingVisuals(true);
    setVisualError(null);
    try {
      const response = await fetch('/api/generate-visuals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonContent: generatedLesson }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate visuals');

      setVisualSteps(data.steps);
      // Save to DB
      if (currentLessonId) {
        await fetch(`/api/classes/${classId}/lessons/${currentLessonId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visualSchedule: JSON.stringify(data.steps) }),
        });
        setSavedLessons(prev => prev.map(l =>
          l.id === currentLessonId ? { ...l, visualSchedule: JSON.stringify(data.steps) } : l
        ));
      }
    } catch (error) {
      console.error('Error generating visuals:', error);
      setVisualError(error instanceof Error ? error.message : 'Failed to generate visual schedule');
    } finally {
      setGeneratingVisuals(false);
    }
  };

  // Remove a step from the visual schedule
  const removeVisualStep = (index: number) => {
    setVisualSteps(prev => {
      if (!prev) return null;
      const updated = prev.filter((_, i) => i !== index);
      saveVisualSchedule(updated);
      return updated;
    });
  };

  // Regenerate a single card — cycle to next ARASAAC result
  const regenerateCard = async (index: number) => {
    if (!visualSteps) return;
    const step = visualSteps[index];
    setRegeneratingCardIndex(index);
    try {
      const res = await fetch(`/api/pictogram-search?q=${encodeURIComponent(step.searchWord)}&limit=10`);
      const data = await res.json();
      const results = data.results || [];
      
      if (results.length <= 1) {
        // Try alternative words
        for (const alt of (step.alternativeWords || [])) {
          const altRes = await fetch(`/api/pictogram-search?q=${encodeURIComponent(alt)}&limit=10`);
          const altData = await altRes.json();
          if (altData.results?.length > 0) {
            results.push(...altData.results);
          }
        }
      }

      // Find current index and pick next one
      const currentIdx = results.findIndex((r: { id: number }) => r.id === step.pictogramId);
      const nextIdx = (currentIdx + 1) % results.length;
      const next = results[nextIdx];

      if (next && next.id !== step.pictogramId) {
        const updated = [...visualSteps];
        updated[index] = { ...step, pictogramId: next.id, pictogramUrl: next.url };
        setVisualSteps(updated);
        saveVisualSchedule(updated);
      }
    } catch (error) {
      console.error('Error regenerating card:', error);
    } finally {
      setRegeneratingCardIndex(null);
    }
  };

  // Drag-and-drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnter = (index: number) => {
    dragCounter.current[index] = (dragCounter.current[index] || 0) + 1;
    if (index !== draggedIndex) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (index: number) => {
    dragCounter.current[index] = (dragCounter.current[index] || 0) - 1;
    if (dragCounter.current[index] <= 0) {
      dragCounter.current[index] = 0;
      if (dragOverIndex === index) {
        setDragOverIndex(null);
      }
    }
  };

  const handleDrop = (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex || !visualSteps) return;
    const updated = [...visualSteps];
    const [dragged] = updated.splice(draggedIndex, 1);
    updated.splice(dropIndex, 0, dragged);
    setVisualSteps(updated);
    saveVisualSchedule(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
    dragCounter.current = {};
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    dragCounter.current = {};
  };

  // Search pictograms for manual card adding
  const searchPictograms = async (query: string) => {
    if (!query.trim()) {
      setCardSearchResults([]);
      return;
    }
    setCardSearching(true);
    try {
      const res = await fetch(`/api/pictogram-search?q=${encodeURIComponent(query.trim())}&limit=24`);
      const data = await res.json();
      setCardSearchResults(data.results || []);
    } catch {
      setCardSearchResults([]);
    } finally {
      setCardSearching(false);
    }
  };

  // Add a card manually from picker
  const addManualCard = (pictogram: { id: number; url: string }, label: string) => {
    const newStep = {
      label: label || 'New Step',
      searchWord: label.toLowerCase(),
      pictogramId: pictogram.id,
      pictogramUrl: pictogram.url,
    };
    const updated = [...(visualSteps || []), newStep];
    setVisualSteps(updated);
    saveVisualSchedule(updated);
    setShowAddCardModal(false);
    setCardSearchQuery('');
    setCardSearchResults([]);
    setNewCardLabel('');
  };

  // Print visual schedule
  const printVisualSchedule = () => {
    window.print();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!classData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Class Not Found</h1>
          <Link href="/classes" className="text-primary-600 hover:underline">
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
          className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-6 transition-colors"
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
                  <span className="text-xs bg-primary-50 text-primary-700 px-3 py-1 rounded-full">
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
                <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-2 flex-wrap">
                  {/* New: Generate Class Lesson Button */}
                  <button
                    onClick={() => setShowLessonModal(true)}
                    disabled={generatingLesson}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Generate Class Lesson</span>
                  </button>
                  <button
                    onClick={() => generateAllPlans()}
                    disabled={generatingAllPlans || !hasStudentsNeedingPlans || (!generatedLesson && savedLessons.length === 0)}
                    title={(!generatedLesson && savedLessons.length === 0) ? 'Generate or select a class lesson first' : undefined}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-ai-500 text-white rounded-lg hover:bg-ai-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <span>Individual Goal Plans {hasStudentsNeedingPlans ? `(${studentsNeedingPlans.length})` : ''}</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })()}
          </div>
          

          
          {/* Class Lesson Generation Modal */}
          {showLessonModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <BookOpen className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Generate Class Lesson</h2>
                        <p className="text-sm text-gray-500">Create a unified lesson with differentiated entry points for all students</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowLessonModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                  
                  {lessonError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                      <p className="text-sm text-red-700">{lessonError}</p>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Curriculum Area *
                      </label>
                      <select
                        value={lessonForm.curriculumArea}
                        onChange={(e) => setLessonForm(prev => ({ ...prev, curriculumArea: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        <option value="Mathematics">Mathematics</option>
                        <option value="Literacy">Literacy</option>
                        <option value="Communication and Language">Communication and Language</option>
                        <option value="Understanding the World">Understanding the World</option>
                        <option value="Physical Development">Physical Development</option>
                        <option value="Personal, Social and Emotional Development">Personal, Social and Emotional Development</option>
                        <option value="Expressive Arts and Design">Expressive Arts and Design</option>
                        <option value="Science">Science</option>
                        <option value="Life Skills">Life Skills</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lesson Topic *
                      </label>
                      <input
                        type="text"
                        value={lessonForm.lessonTopic}
                        onChange={(e) => setLessonForm(prev => ({ ...prev, lessonTopic: e.target.value }))}
                        placeholder="e.g., Counting and one-to-one correspondence, Using money, Shapes"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Learning Objective *
                      </label>
                      <input
                        type="text"
                        value={lessonForm.learningObjective}
                        onChange={(e) => setLessonForm(prev => ({ ...prev, learningObjective: e.target.value }))}
                        placeholder="e.g., Children will understand that numbers represent quantities"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                      <p className="mt-1 text-xs text-gray-500">This single objective will be accessed by ALL students at different levels</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        value={lessonForm.additionalNotes}
                        onChange={(e) => setLessonForm(prev => ({ ...prev, additionalNotes: e.target.value }))}
                        placeholder="e.g., We have ducks props available, focus on outdoor activities, link to recent school trip..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                      />
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">What will be generated:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-emerald-500" />
                          Circle Time / Hook activity with songs
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-emerald-500" />
                          Attention Autism stages (Bucket Time, concept introduction)
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-emerald-500" />
                          Main activity with differentiated entry points per student
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-emerald-500" />
                          Continuous provision / play-based activities
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-emerald-500" />
                          Resources checklist (visuals, props, materials)
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-emerald-500" />
                          Communication goals embedded for each student
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setShowLessonModal(false)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={generateClassLesson}
                      disabled={generatingLesson || !lessonForm.lessonTopic || !lessonForm.learningObjective}
                      className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {generatingLesson ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          <span>Generate Lesson Plan</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Last Lesson Dropdown — only shown if there are saved lessons */}
        {savedLessons.length > 0 && !generatedLesson && (() => {
          const lastLesson = savedLessons[0];
          return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
              <button
                onClick={() => {
                  setGeneratedLesson(lastLesson.content);
                  setCurrentLessonId(lastLesson.id);
                  setVisualSteps(lastLesson.visualSchedule ? JSON.parse(lastLesson.visualSchedule) : null);
                }}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <FileText className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">Last Lesson: {lastLesson.lessonTopic}</p>
                    <p className="text-xs text-gray-500">
                      {lastLesson.curriculumArea} &middot; {new Date(lastLesson.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-emerald-600">
                  <span className="text-sm font-medium">View</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </button>
            </div>
          );
        })()}
        
        {/* Generated Class Lesson Display */}
        {generatedLesson && (() => {
          const currentSavedLesson = savedLessons.find(l => l.id === currentLessonId);
          return (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-emerald-200 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <FileText className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Class Lesson Plan</h2>
                  {currentSavedLesson ? (
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {currentSavedLesson.curriculumArea}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(currentSavedLesson.createdAt).toLocaleDateString('en-GB', { 
                          day: 'numeric', month: 'short', year: 'numeric' 
                        })}
                      </span>
                      <span className="text-sm text-gray-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(currentSavedLesson.createdAt).toLocaleTimeString('en-GB', { 
                          hour: '2-digit', minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Unified lesson with differentiated entry points</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {savedLessons.length > 1 && (
                  <button
                    onClick={() => setShowLessonHistory(!showLessonHistory)}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      showLessonHistory 
                        ? 'text-emerald-700 bg-emerald-100' 
                        : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <History className="h-4 w-4" />
                    <span>History ({savedLessons.length})</span>
                  </button>
                )}
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setShowLessonModal(true)}
                  className="inline-flex items-center gap-2 px-3 py-2 text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>New Lesson</span>
                </button>
                <button
                  onClick={() => {
                    setGeneratedLesson(null);
                    setCurrentLessonId(null);
                    setShowLessonHistory(false);
                    setVisualSteps(null);
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Hide lesson"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Lesson History Panel */}
            {showLessonHistory && (
              <div className="mb-6 border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700">Previous Lessons</h3>
                </div>
                <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                  {savedLessons.map((lesson) => (
                    <div 
                      key={lesson.id}
                      className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                        lesson.id === currentLessonId 
                          ? 'bg-emerald-50 border-l-4 border-emerald-500' 
                          : 'hover:bg-gray-50 border-l-4 border-transparent'
                      }`}
                      onClick={() => {
                        setGeneratedLesson(lesson.content);
                        setCurrentLessonId(lesson.id);
                        setVisualSteps(lesson.visualSchedule ? JSON.parse(lesson.visualSchedule) : null);
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            {lesson.curriculumArea}
                          </span>
                          {lesson.id === currentLessonId && (
                            <span className="text-xs text-emerald-600 font-medium">Viewing</span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-gray-900 truncate">{lesson.lessonTopic}</p>
                        <p className="text-xs text-gray-500 truncate">{lesson.learningObjective}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(lesson.createdAt).toLocaleDateString('en-GB', { 
                            day: 'numeric', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Delete this lesson plan?')) {
                            setDeletingLessonId(lesson.id);
                            fetch(`/api/classes/${classId}/lessons/${lesson.id}`, { method: 'DELETE' })
                              .then(res => {
                                if (res.ok) {
                                  setSavedLessons(prev => prev.filter(l => l.id !== lesson.id));
                                  if (currentLessonId === lesson.id) {
                                    const remaining = savedLessons.filter(l => l.id !== lesson.id);
                                    if (remaining.length > 0) {
                                      setGeneratedLesson(remaining[0].content);
                                      setCurrentLessonId(remaining[0].id);
                                    } else {
                                      setGeneratedLesson(null);
                                      setCurrentLessonId(null);
                                      setShowLessonHistory(false);
                                    }
                                  }
                                }
                              })
                              .finally(() => setDeletingLessonId(null));
                          }
                        }}
                        className="ml-3 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                        title="Delete lesson"
                      >
                        {deletingLessonId === lesson.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {editingLesson ? (
              <div>
                <textarea
                  value={editedLessonContent}
                  onChange={(e) => setEditedLessonContent(e.target.value)}
                  className="w-full h-96 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-y font-mono text-sm bg-white"
                  placeholder="Edit your lesson plan..."
                />
                <div className="flex justify-end gap-2 mt-3">
                  <button
                    onClick={() => setEditingLesson(false)}
                    className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </button>
                  <button
                    onClick={saveLessonEdit}
                    className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-4">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-xl font-bold text-gray-800 mt-6 mb-3">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">{children}</h3>,
                    h4: ({ children }) => <h4 className="text-base font-semibold text-gray-700 mt-4 mb-2">{children}</h4>,
                    p: ({ children }) => <p className="text-gray-700 mb-3">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-5 mb-4 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-5 mb-4 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="text-gray-700">{children}</li>,
                    strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                    hr: () => <hr className="my-6 border-gray-200" />,
                  }}
                >
                  {generatedLesson}
                </ReactMarkdown>
              </div>
            )}
            
            {/* Refine Input */}
            {showRefineInput && !editingLesson && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <RefreshCw className="h-4 w-4 inline mr-1" />
                  What would you like to change?
                </label>
                <textarea
                  value={refineFeedback}
                  onChange={(e) => setRefineFeedback(e.target.value)}
                  placeholder="E.g., Make the bucket time activity more sensory-focused, add a calming break between stages, simplify the language for the worksheets..."
                  className="w-full h-24 p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  disabled={refiningLesson}
                />
                <div className="flex justify-end gap-2 mt-3">
                  <button
                    onClick={() => { setShowRefineInput(false); setRefineFeedback(''); }}
                    disabled={refiningLesson}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={refineLesson}
                    disabled={refiningLesson || !refineFeedback.trim()}
                    className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {refiningLesson ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Refining...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4" />
                        Refine Lesson
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Lesson Action Buttons */}
            {!editingLesson && !showRefineInput && (
              <div className="flex flex-wrap justify-end gap-2 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={generateVisualSchedule}
                  disabled={generatingVisuals}
                  className="inline-flex items-center px-3 py-2 bg-violet-50 text-violet-700 rounded-lg text-sm font-medium hover:bg-violet-100 transition-colors disabled:opacity-50"
                >
                  {generatingVisuals ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-4 w-4 mr-1" />
                      Generate Visual Schedule
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowRefineInput(true)}
                  className="inline-flex items-center px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refine Lesson
                </button>
                <button
                  onClick={() => {
                    setEditingLesson(true);
                    setEditedLessonContent(generatedLesson || '');
                  }}
                  className="inline-flex items-center px-3 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={deleteCurrentLesson}
                  className="inline-flex items-center px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            )}

            {/* Visual Schedule Error */}
            {visualError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-red-700 font-medium">Visual Schedule Error</p>
                  <p className="text-xs text-red-600">{visualError}</p>
                </div>
                <button onClick={() => setVisualError(null)} className="ml-auto text-red-400 hover:text-red-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Visual Schedule Display */}
            {visualSteps && visualSteps.length > 0 && (
              <div className="mt-6 pt-6 border-t-2 border-violet-200" id="visual-schedule">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-violet-100 rounded-lg">
                      <ImageIcon className="h-5 w-5 text-violet-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Visual Schedule</h3>
                      <p className="text-xs text-gray-500">Drag to reorder • Hover for options</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setNewCardLabel('');
                        setCardSearchQuery('');
                        setCardSearchResults([]);
                        setShowAddCardModal(true);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-violet-700 bg-violet-50 rounded-lg text-sm hover:bg-violet-100 transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                      Add Card
                    </button>
                    <button
                      onClick={generateVisualSchedule}
                      disabled={generatingVisuals}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-violet-700 bg-violet-50 rounded-lg text-sm hover:bg-violet-100 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`h-3 w-3 ${generatingVisuals ? 'animate-spin' : ''}`} />
                      Regenerate All
                    </button>
                    <button
                      onClick={printVisualSchedule}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-gray-700 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                    >
                      <Printer className="h-3 w-3" />
                      Print
                    </button>
                    <button
                      onClick={() => setVisualSteps(null)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Hide visual schedule"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* The Visual Strip */}
                <div className="bg-white border-2 border-violet-100 rounded-xl p-6 print-visual-schedule">
                  <div className="flex flex-wrap justify-center gap-3">
                    {visualSteps.map((step, index) => (
                      <div key={`${step.label}-${index}`} className="flex items-center gap-1">
                        <div
                          draggable
                          onDragStart={() => handleDragStart(index)}
                          onDragEnter={() => handleDragEnter(index)}
                          onDragLeave={() => handleDragLeave(index)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => handleDrop(index)}
                          onDragEnd={handleDragEnd}
                          className={`group relative flex flex-col items-center w-28 p-3 bg-white border-2 rounded-xl transition-all cursor-grab active:cursor-grabbing ${
                            draggedIndex === index
                              ? 'opacity-40 border-violet-400 scale-95'
                              : dragOverIndex === index
                              ? 'border-violet-500 bg-violet-50 scale-105 shadow-lg'
                              : 'border-gray-200 hover:border-violet-300'
                          }`}
                        >
                          {/* Drag handle */}
                          <div className="absolute top-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <GripVertical className="h-3 w-3 text-gray-300" />
                          </div>

                          {/* Action buttons on hover */}
                          <div className="absolute -top-2 -right-2 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <button
                              onClick={(e) => { e.stopPropagation(); regenerateCard(index); }}
                              disabled={regeneratingCardIndex === index}
                              className="w-5 h-5 bg-violet-500 text-white rounded-full flex items-center justify-center hover:bg-violet-600 transition-colors disabled:opacity-50"
                              title="Try different picture"
                            >
                              {regeneratingCardIndex === index ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <RefreshCw className="h-3 w-3" />
                              )}
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); removeVisualStep(index); }}
                              className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                              title="Remove card"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                          
                          {/* Pictogram */}
                          <div className="w-20 h-20 mb-2 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                            {step.pictogramUrl ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img 
                                src={step.pictogramUrl}
                                alt={step.label}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                  (e.target as HTMLImageElement).parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center text-gray-300"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg></div>`;
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <ImageIcon className="h-8 w-8" />
                              </div>
                            )}
                          </div>
                          
                          {/* Label — click to edit */}
                          {editingCardIndex === index ? (
                            <input
                              autoFocus
                              type="text"
                              defaultValue={step.label}
                              className="text-xs font-bold text-gray-800 text-center leading-tight w-full bg-violet-50 border border-violet-300 rounded px-1 py-0.5 outline-none focus:ring-1 focus:ring-violet-400"
                              onBlur={(e) => {
                                const newLabel = e.target.value.trim();
                                setEditingCardIndex(null);
                                if (newLabel && newLabel !== step.label && visualSteps) {
                                  const updated = [...visualSteps];
                                  updated[index] = { ...updated[index], label: newLabel };
                                  setVisualSteps(updated);
                                  saveVisualSchedule(updated);
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                                if (e.key === 'Escape') setEditingCardIndex(null);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              onDragStart={(e) => e.preventDefault()}
                            />
                          ) : (
                            <span
                              className="text-xs font-bold text-gray-800 text-center leading-tight cursor-text hover:text-violet-700 hover:underline hover:underline-offset-2 hover:decoration-dotted"
                              onClick={(e) => { e.stopPropagation(); setEditingCardIndex(index); }}
                              title="Click to rename"
                            >
                              {step.label}
                            </span>
                          )}
                        </div>
                        
                        {/* Arrow between steps */}
                        {index < visualSteps.length - 1 && (
                          <ArrowRight className="h-5 w-5 text-violet-300 shrink-0 hidden sm:block" />
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* ARASAAC Attribution */}
                  <div className="mt-4 pt-3 border-t border-gray-100 text-center">
                    <p className="text-[10px] text-gray-400">
                      Pictograms by{' '}
                      <a href="https://arasaac.org" target="_blank" rel="noopener noreferrer" className="text-violet-500 hover:underline">
                        ARASAAC
                      </a>
                      {' '}— Gobierno de Aragón. Licensed under{' '}
                      <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer" className="text-violet-500 hover:underline">
                        CC BY-NC-SA 4.0
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Add Card Modal */}
            {showAddCardModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-violet-100 rounded-lg">
                          <Plus className="h-5 w-5 text-violet-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Add Visual Card</h3>
                      </div>
                      <button
                        onClick={() => setShowAddCardModal(false)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Card label input */}
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Card Label</label>
                      <input
                        type="text"
                        value={newCardLabel}
                        onChange={(e) => setNewCardLabel(e.target.value)}
                        placeholder="E.g., Wash Hands, Sit Down, Good Listening..."
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                    </div>

                    {/* Search bar */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={cardSearchQuery}
                        onChange={(e) => {
                          setCardSearchQuery(e.target.value);
                          if (e.target.value.trim().length >= 2) {
                            searchPictograms(e.target.value);
                          } else {
                            setCardSearchResults([]);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && cardSearchQuery.trim()) {
                            searchPictograms(cardSearchQuery);
                          }
                        }}
                        placeholder="Search pictograms... (e.g., happy, eat, book, toilet)"
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                      {cardSearching && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-violet-500 animate-spin" />
                      )}
                    </div>
                  </div>

                  {/* Search results grid */}
                  <div className="flex-1 overflow-y-auto p-6">
                    {cardSearchResults.length > 0 ? (
                      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                        {cardSearchResults.map((pic) => (
                          <button
                            key={pic.id}
                            onClick={() => addManualCard(pic, newCardLabel || cardSearchQuery)}
                            className="flex flex-col items-center p-2 border-2 border-gray-200 rounded-xl hover:border-violet-500 hover:bg-violet-50 transition-all"
                            title={pic.keywords.join(', ')}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={pic.url}
                              alt={pic.keywords[0] || 'pictogram'}
                              className="w-16 h-16 object-contain"
                            />
                            <span className="text-[10px] text-gray-500 mt-1 text-center truncate w-full">
                              {pic.keywords[0] || ''}
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : cardSearchQuery.trim().length >= 2 && !cardSearching ? (
                      <div className="text-center py-12">
                        <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">No pictograms found for &ldquo;{cardSearchQuery}&rdquo;</p>
                        <p className="text-xs text-gray-400 mt-1">Try a simpler word like &ldquo;sit&rdquo;, &ldquo;eat&rdquo;, &ldquo;happy&rdquo;</p>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">Search for a pictogram to add</p>
                        <p className="text-xs text-gray-400 mt-1">Type at least 2 characters to search the ARASAAC database</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          );
        })()}

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
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
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
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-lg font-semibold">
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
                          className="flex-1 text-center px-3 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
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
                                  className="mr-1 px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors flex items-center gap-1"
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
                                {hasPlan ? 'View Goal Plan' : 'Add Goal Plan'}
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
                                    <Loader2 className="w-8 h-8 text-primary-500 animate-spin mx-auto mb-3" />
                                    <p className="text-sm text-gray-600 font-medium">Generating goal overview...</p>
                                    <p className="text-xs text-gray-500 mt-1">Analyzing {student.firstName}&apos;s profile</p>
                                  </div>
                                ) : editingPlan === goalKey ? (
                                  <div>
                                    <textarea
                                      value={editedPlan}
                                      onChange={(e) => setEditedPlan(e.target.value)}
                                      className="w-full h-40 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none font-mono text-sm bg-white"
                                      placeholder="Write your goal plan..."
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
                                        className="inline-flex items-center px-3 py-1.5 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600"
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
                                        className="inline-flex items-center px-3 py-1.5 bg-ai-50 text-ai-600 rounded-lg text-sm font-medium hover:bg-ai-100"
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
                                        Additional Context
                                      </label>
                                      <textarea
                                        value={customInstructions[goalKey!] || ''}
                                        onChange={(e) => setCustomInstructions(prev => ({
                                          ...prev,
                                          [goalKey!]: e.target.value
                                        }))}
                                        placeholder={`Add extra context for ${student.firstName}'s goal...`}
                                        className="w-full h-20 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm bg-white"
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
                                        className="inline-flex items-center px-3 py-1.5 bg-ai-500 text-white rounded-lg text-sm font-medium hover:bg-ai-600"
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
                                        Get goal guidance for <strong>{displayedGoal.subcategory.name}</strong>
                                      </p>
                                    </div>
                                    <div className="flex flex-wrap justify-center gap-3">
                                      <button
                                        onClick={() => generatePlan(student, displayedGoal.subcategoryId, displayedGoal.area.name, displayedGoal.category.name, displayedGoal.subcategory)}
                                        className="inline-flex items-center px-4 py-2 bg-ai-500 text-white rounded-lg text-sm font-medium hover:bg-ai-600"
                                      >
                                        <Wand2 className="h-4 w-4 mr-1" />
                                        Generate with AI
                                      </button>
                                      <button
                                        onClick={() => setShowInstructions(goalKey)}
                                        className="inline-flex items-center px-4 py-2 bg-white text-primary-600 rounded-lg text-sm font-medium hover:bg-primary-50 border border-primary-200"
                                      >
                                        <MessageCircle className="h-4 w-4 mr-1" />
                                        Add Extra Context
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
