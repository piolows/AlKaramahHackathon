'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
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
import { LoadingSpinner, Breadcrumb } from '@/components'
import { useLanguage } from '@/lib/i18n'

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
  const { t, locale, isHydrated } = useLanguage()
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

  const BackArrow = locale === 'ar' ? ArrowRight : ArrowLeft

  useEffect(() => {
    if (!isHydrated) return
    fetchData()
  }, [locale, isHydrated])

  async function fetchData() {
    setLoading(true)
    setError(null)
    try {
      const [classesRes, studentsRes] = await Promise.all([
        fetch(`/api/classes?lang=${locale}`),
        fetch(`/api/students?lang=${locale}`)
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
      setError(t('adminPage.failedToLoad'))
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

  return (
    <div>
      {/* Breadcrumb - always visible */}
      <Breadcrumb items={[
        { label: t('adminPage.title') }
      ]} />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Header */}
          <div className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center gap-4">
                <Link
                  href="/classes"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <BackArrow className="h-5 w-5" />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{t('adminPage.title')}</h1>
                  <p className="text-sm text-gray-600">{t('adminPage.subtitle')}</p>
                </div>
              </div>
            </div>
          </div>

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
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <BookOpen className="h-5 w-5" />
            {t('adminPage.classesTab')} ({classes.length})
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'students'
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Users className="h-5 w-5" />
            {t('adminPage.studentsTab')} ({students.length})
          </button>
        </div>

        {/* Classes Tab */}
        {activeTab === 'classes' && (
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">{t('adminPage.classesTab')}</h2>
              <button
                onClick={() => openClassForm()}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                {t('adminPage.addClass')}
              </button>
            </div>
            <div className="divide-y">
              {classes.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  {t('adminPage.noClassesYet')}
                </div>
              ) : (
                classes.map(cls => (
                  <div key={cls.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div>
                      <h3 className="font-medium text-gray-900">{cls.name}</h3>
                      <p className="text-sm text-gray-600">
                        {cls.description || t('common.noDescription')}
                        {cls.ageRange && ` • ${cls.ageRange}`}
                      </p>
                      <p className="text-sm text-primary-600">
                        {cls.studentCount} {cls.studentCount !== 1 ? t('adminPage.studentPlural') : t('adminPage.student')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openClassForm(cls)}
                        className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title={t('adminPage.editClass')}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ type: 'class', id: cls.id, name: cls.name })}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title={t('adminPage.deleteClass')}
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
              <h2 className="text-lg font-semibold text-gray-900">{t('adminPage.studentsTab')}</h2>
              <button
                onClick={() => openStudentForm()}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                disabled={classes.length === 0}
              >
                <UserPlus className="h-4 w-4" />
                {t('adminPage.addStudent')}
              </button>
            </div>
            {classes.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {t('adminPage.createClassFirst')}
              </div>
            ) : (
              <div className="divide-y">
                {students.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    {t('adminPage.noStudentsYet')}
                  </div>
                ) : (
                  students.map(student => (
                    <div key={student.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {student.className} • {t('adminPage.born')}: {student.dateOfBirth}
                        </p>
                        {student.diagnoses.length > 0 && (
                          <p className="text-sm text-gray-500">
                            {student.diagnoses.slice(0, 2).join(', ')}
                            {student.diagnoses.length > 2 && ` +${student.diagnoses.length - 2} ${t('adminPage.more')}`}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/students/${student.id}`}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title={t('adminPage.viewProfile')}
                        >
                          <Users className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => openStudentForm(student)}
                          className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title={t('adminPage.editStudent')}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ type: 'student', id: student.id, name: `${student.firstName} ${student.lastName}` })}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title={t('adminPage.deleteStudent')}
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
                {editingClass ? t('adminPage.editClassTitle') : t('adminPage.addNewClass')}
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
                  {t('adminPage.classNameRequired')}
                </label>
                <input
                  type="text"
                  value={classForm.name}
                  onChange={e => setClassForm({ ...classForm, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder={t('adminPage.classNamePlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('adminPage.description')}
                </label>
                <textarea
                  value={classForm.description}
                  onChange={e => setClassForm({ ...classForm, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  rows={3}
                  placeholder={t('adminPage.descriptionPlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('adminPage.ageRange')}
                </label>
                <input
                  type="text"
                  value={classForm.ageRange}
                  onChange={e => setClassForm({ ...classForm, ageRange: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder={t('adminPage.ageRangePlaceholder')}
                />
              </div>
            </div>
            <div className="p-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowClassForm(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={saveClass}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                {editingClass ? t('adminPage.saveChanges') : t('adminPage.createClass')}
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
                {editingStudent ? t('adminPage.editStudentTitle') : t('adminPage.addNewStudent')}
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
                    {t('adminPage.firstName')}
                  </label>
                  <input
                    type="text"
                    value={studentForm.firstName}
                    onChange={e => setStudentForm({ ...studentForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('adminPage.lastName')}
                  </label>
                  <input
                    type="text"
                    value={studentForm.lastName}
                    onChange={e => setStudentForm({ ...studentForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('adminPage.dateOfBirth')}
                  </label>
                  <input
                    type="date"
                    value={studentForm.dateOfBirth}
                    onChange={e => setStudentForm({ ...studentForm, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('adminPage.class')}
                  </label>
                  <select
                    value={studentForm.classId}
                    onChange={e => setStudentForm({ ...studentForm, classId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">{t('adminPage.selectClass')}</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">{t('adminPage.profileInformation')}</h4>
                <p className="text-sm text-gray-500 mb-4">
                  {t('adminPage.separateWithCommas')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('adminPage.diagnoses')}
                </label>
                <input
                  type="text"
                  value={studentForm.diagnoses}
                  onChange={e => setStudentForm({ ...studentForm, diagnoses: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder={t('adminPage.diagnosesPlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('adminPage.strengths')}
                </label>
                <input
                  type="text"
                  value={studentForm.strengths}
                  onChange={e => setStudentForm({ ...studentForm, strengths: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder={t('adminPage.strengthsPlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('adminPage.challenges')}
                </label>
                <input
                  type="text"
                  value={studentForm.challenges}
                  onChange={e => setStudentForm({ ...studentForm, challenges: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder={t('adminPage.challengesPlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('adminPage.interests')}
                </label>
                <input
                  type="text"
                  value={studentForm.interests}
                  onChange={e => setStudentForm({ ...studentForm, interests: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder={t('adminPage.interestsPlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('adminPage.communicationStyle')}
                </label>
                <textarea
                  value={studentForm.communicationStyle}
                  onChange={e => setStudentForm({ ...studentForm, communicationStyle: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  rows={2}
                  placeholder={t('adminPage.communicationStylePlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('adminPage.sensoryNeeds')}
                </label>
                <input
                  type="text"
                  value={studentForm.sensoryNeeds}
                  onChange={e => setStudentForm({ ...studentForm, sensoryNeeds: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder={t('adminPage.sensoryNeedsPlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('adminPage.supportStrategies')}
                </label>
                <input
                  type="text"
                  value={studentForm.supportStrategies}
                  onChange={e => setStudentForm({ ...studentForm, supportStrategies: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder={t('adminPage.supportStrategiesPlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('adminPage.triggers')}
                </label>
                <input
                  type="text"
                  value={studentForm.triggers}
                  onChange={e => setStudentForm({ ...studentForm, triggers: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder={t('adminPage.triggersPlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('adminPage.calmingStrategies')}
                </label>
                <input
                  type="text"
                  value={studentForm.calmingStrategies}
                  onChange={e => setStudentForm({ ...studentForm, calmingStrategies: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder={t('adminPage.calmingStrategiesPlaceholder')}
                />
              </div>
            </div>
            <div className="p-4 border-t flex justify-end gap-3 sticky bottom-0 bg-white">
              <button
                onClick={() => setShowStudentForm(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={saveStudent}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                {editingStudent ? t('adminPage.saveChanges') : t('adminPage.createStudent')}
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
              <h3 className="text-lg font-semibold text-red-600">{t('adminPage.confirmDelete')}</h3>
            </div>
            <div className="p-4">
              <p className="text-gray-700">
                {deleteConfirm.type === 'class' ? t('adminPage.confirmDeleteClass') : t('adminPage.confirmDeleteStudent')}{' '}
                <strong>{deleteConfirm.name}</strong>?
              </p>
              {deleteConfirm.type === 'student' && (
                <p className="text-sm text-gray-500 mt-2">
                  {t('adminPage.deleteProgressWarning')}
                </p>
              )}
            </div>
            <div className="p-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {t('common.cancel')}
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
                {t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  )
}
