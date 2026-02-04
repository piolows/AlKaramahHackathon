'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Plus, 
  Pencil, 
  Trash2, 
  Users, 
  BookOpen,
  Save,
  X,
  UserPlus,
  AlertCircle
} from 'lucide-react'

interface Class {
  id: string
  name: string
  description: string | null
  ageRange: string | null
  studentCount: number
}

interface Student {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  classId: string
  className: string
  diagnoses: string[]
  strengths: string[]
  challenges: string[]
  interests: string[]
  communicationStyle: string
  sensoryNeeds: string[]
  supportStrategies: string[]
  triggers: string[]
  calmingStrategies: string[]
}

type Tab = 'classes' | 'students'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('classes')
  const [classes, setClasses] = useState<Class[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Class form state
  const [showClassForm, setShowClassForm] = useState(false)
  const [editingClass, setEditingClass] = useState<Class | null>(null)
  const [classForm, setClassForm] = useState({
    name: '',
    description: '',
    ageRange: ''
  })

  // Student form state
  const [showStudentForm, setShowStudentForm] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [studentForm, setStudentForm] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    classId: '',
    diagnoses: '',
    strengths: '',
    challenges: '',
    interests: '',
    communicationStyle: '',
    sensoryNeeds: '',
    supportStrategies: '',
    triggers: '',
    calmingStrategies: ''
  })

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'class' | 'student', id: string, name: string } | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    setError(null)
    try {
      const [classesRes, studentsRes] = await Promise.all([
        fetch('/api/classes'),
        fetch('/api/students')
      ])

      if (!classesRes.ok || !studentsRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const [classesData, studentsData] = await Promise.all([
        classesRes.json(),
        studentsRes.json()
      ])

      setClasses(classesData)
      setStudents(studentsData)
    } catch (err) {
      setError('Failed to load data. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Class CRUD operations
  function openClassForm(classData?: Class) {
    if (classData) {
      setEditingClass(classData)
      setClassForm({
        name: classData.name,
        description: classData.description || '',
        ageRange: classData.ageRange || ''
      })
    } else {
      setEditingClass(null)
      setClassForm({ name: '', description: '', ageRange: '' })
    }
    setShowClassForm(true)
  }

  async function saveClass() {
    if (!classForm.name.trim()) {
      alert('Class name is required')
      return
    }

    try {
      const url = editingClass ? `/api/classes/${editingClass.id}` : '/api/classes'
      const method = editingClass ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(classForm)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save class')
      }

      setShowClassForm(false)
      fetchData()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save class')
    }
  }

  async function deleteClass(id: string) {
    try {
      const res = await fetch(`/api/classes/${id}`, { method: 'DELETE' })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete class')
      }

      setDeleteConfirm(null)
      fetchData()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete class')
    }
  }

  // Student CRUD operations
  function openStudentForm(student?: Student) {
    if (student) {
      setEditingStudent(student)
      setStudentForm({
        firstName: student.firstName,
        lastName: student.lastName,
        dateOfBirth: student.dateOfBirth,
        classId: student.classId,
        diagnoses: student.diagnoses.join(', '),
        strengths: student.strengths.join(', '),
        challenges: student.challenges.join(', '),
        interests: student.interests.join(', '),
        communicationStyle: student.communicationStyle,
        sensoryNeeds: student.sensoryNeeds.join(', '),
        supportStrategies: student.supportStrategies.join(', '),
        triggers: student.triggers.join(', '),
        calmingStrategies: student.calmingStrategies.join(', ')
      })
    } else {
      setEditingStudent(null)
      setStudentForm({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        classId: classes[0]?.id || '',
        diagnoses: '',
        strengths: '',
        challenges: '',
        interests: '',
        communicationStyle: '',
        sensoryNeeds: '',
        supportStrategies: '',
        triggers: '',
        calmingStrategies: ''
      })
    }
    setShowStudentForm(true)
  }

  async function saveStudent() {
    if (!studentForm.firstName.trim() || !studentForm.lastName.trim() || !studentForm.dateOfBirth || !studentForm.classId) {
      alert('First name, last name, date of birth, and class are required')
      return
    }

    try {
      const url = editingStudent ? `/api/students/${editingStudent.id}` : '/api/students'
      const method = editingStudent ? 'PUT' : 'POST'

      // Parse comma-separated strings into arrays
      const parseArray = (str: string) => str.split(',').map(s => s.trim()).filter(s => s)

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...studentForm,
          diagnoses: parseArray(studentForm.diagnoses),
          strengths: parseArray(studentForm.strengths),
          challenges: parseArray(studentForm.challenges),
          interests: parseArray(studentForm.interests),
          sensoryNeeds: parseArray(studentForm.sensoryNeeds),
          supportStrategies: parseArray(studentForm.supportStrategies),
          triggers: parseArray(studentForm.triggers),
          calmingStrategies: parseArray(studentForm.calmingStrategies)
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save student')
      }

      setShowStudentForm(false)
      fetchData()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save student')
    }
  }

  async function deleteStudent(id: string) {
    try {
      const res = await fetch(`/api/students/${id}`, { method: 'DELETE' })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete student')
      }

      setDeleteConfirm(null)
      fetchData()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete student')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/classes" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Manage classes and students</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('classes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'classes'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <BookOpen className="h-5 w-5" />
            Classes ({classes.length})
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'students'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Users className="h-5 w-5" />
            Students ({students.length})
          </button>
        </div>

        {/* Classes Tab */}
        {activeTab === 'classes' && (
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Classes</h2>
              <button
                onClick={() => openClassForm()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Class
              </button>
            </div>
            <div className="divide-y">
              {classes.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No classes yet. Click "Add Class" to create one.
                </div>
              ) : (
                classes.map(cls => (
                  <div key={cls.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div>
                      <h3 className="font-medium text-gray-900">{cls.name}</h3>
                      <p className="text-sm text-gray-600">
                        {cls.description || 'No description'}
                        {cls.ageRange && ` • ${cls.ageRange}`}
                      </p>
                      <p className="text-sm text-blue-600">{cls.studentCount} student{cls.studentCount !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openClassForm(cls)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit class"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ type: 'class', id: cls.id, name: cls.name })}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete class"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Students</h2>
              <button
                onClick={() => openStudentForm()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={classes.length === 0}
              >
                <UserPlus className="h-4 w-4" />
                Add Student
              </button>
            </div>
            {classes.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Create a class first before adding students.
              </div>
            ) : (
              <div className="divide-y">
                {students.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No students yet. Click "Add Student" to create one.
                  </div>
                ) : (
                  students.map(student => (
                    <div key={student.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {student.className} • Born: {student.dateOfBirth}
                        </p>
                        {student.diagnoses.length > 0 && (
                          <p className="text-sm text-gray-500">
                            {student.diagnoses.slice(0, 2).join(', ')}
                            {student.diagnoses.length > 2 && ` +${student.diagnoses.length - 2} more`}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/students/${student.id}`}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="View profile"
                        >
                          <Users className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => openStudentForm(student)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit student"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ type: 'student', id: student.id, name: `${student.firstName} ${student.lastName}` })}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete student"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Class Form Modal */}
      {showClassForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {editingClass ? 'Edit Class' : 'Add New Class'}
              </h3>
              <button
                onClick={() => setShowClassForm(false)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class Name *
                </label>
                <input
                  type="text"
                  value={classForm.name}
                  onChange={e => setClassForm({ ...classForm, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Sunshine Room"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={classForm.description}
                  onChange={e => setClassForm({ ...classForm, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Brief description of the class..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age Range
                </label>
                <input
                  type="text"
                  value={classForm.ageRange}
                  onChange={e => setClassForm({ ...classForm, ageRange: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Key Stage 1 (Ages 5-7)"
                />
              </div>
            </div>
            <div className="p-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowClassForm(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveClass}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                {editingClass ? 'Save Changes' : 'Create Class'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Form Modal */}
      {showStudentForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-lg font-semibold">
                {editingStudent ? 'Edit Student' : 'Add New Student'}
              </h3>
              <button
                onClick={() => setShowStudentForm(false)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={studentForm.firstName}
                    onChange={e => setStudentForm({ ...studentForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={studentForm.lastName}
                    onChange={e => setStudentForm({ ...studentForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={studentForm.dateOfBirth}
                    onChange={e => setStudentForm({ ...studentForm, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class *
                  </label>
                  <select
                    value={studentForm.classId}
                    onChange={e => setStudentForm({ ...studentForm, classId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a class...</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Profile Information</h4>
                <p className="text-sm text-gray-500 mb-4">
                  Separate multiple items with commas
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diagnoses
                </label>
                <input
                  type="text"
                  value={studentForm.diagnoses}
                  onChange={e => setStudentForm({ ...studentForm, diagnoses: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Autism Spectrum Disorder, ADHD"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Strengths
                </label>
                <input
                  type="text"
                  value={studentForm.strengths}
                  onChange={e => setStudentForm({ ...studentForm, strengths: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Visual learner, Good memory"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Challenges
                </label>
                <input
                  type="text"
                  value={studentForm.challenges}
                  onChange={e => setStudentForm({ ...studentForm, challenges: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Verbal communication, Transitions"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interests
                </label>
                <input
                  type="text"
                  value={studentForm.interests}
                  onChange={e => setStudentForm({ ...studentForm, interests: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Trains, Puzzles, Music"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Communication Style
                </label>
                <textarea
                  value={studentForm.communicationStyle}
                  onChange={e => setStudentForm({ ...studentForm, communicationStyle: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  placeholder="How does this student communicate?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sensory Needs
                </label>
                <input
                  type="text"
                  value={studentForm.sensoryNeeds}
                  onChange={e => setStudentForm({ ...studentForm, sensoryNeeds: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Sensitive to loud sounds, Seeks deep pressure"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Support Strategies
                </label>
                <input
                  type="text"
                  value={studentForm.supportStrategies}
                  onChange={e => setStudentForm({ ...studentForm, supportStrategies: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Visual schedules, Timers for transitions"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Triggers
                </label>
                <input
                  type="text"
                  value={studentForm.triggers}
                  onChange={e => setStudentForm({ ...studentForm, triggers: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Sudden loud noises, Schedule changes"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Calming Strategies
                </label>
                <input
                  type="text"
                  value={studentForm.calmingStrategies}
                  onChange={e => setStudentForm({ ...studentForm, calmingStrategies: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Music with headphones, Quiet corner time"
                />
              </div>
            </div>
            <div className="p-4 border-t flex justify-end gap-3 sticky bottom-0 bg-white">
              <button
                onClick={() => setShowStudentForm(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveStudent}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                {editingStudent ? 'Save Changes' : 'Create Student'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-red-600">Confirm Delete</h3>
            </div>
            <div className="p-4">
              <p className="text-gray-700">
                Are you sure you want to delete {deleteConfirm.type === 'class' ? 'class' : 'student'}{' '}
                <strong>{deleteConfirm.name}</strong>?
              </p>
              {deleteConfirm.type === 'student' && (
                <p className="text-sm text-gray-500 mt-2">
                  This will also delete all progress records for this student.
                </p>
              )}
            </div>
            <div className="p-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteConfirm.type === 'class') {
                    deleteClass(deleteConfirm.id)
                  } else {
                    deleteStudent(deleteConfirm.id)
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
