'use client';

import Link from 'next/link';
import { use, useState, useEffect } from 'react';
import {
  ArrowLeft,
  Brain,
  Heart,
  Sparkles,
  MessageSquare,
  AlertCircle,
  Eye,
  Pencil,
  Save,
  X,
  Target,
  Plus,
  Trash2,
  Loader2,
  Wand2,
  Send
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
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

// Editable List Component
function EditableList({
  items,
  onUpdate,
  icon: Icon,
  iconColor,
  bulletColor,
  title,
  placeholder
}: {
  items: string[],
  onUpdate: (items: string[]) => void,
  icon: React.ElementType,
  iconColor: string,
  bulletColor: string,
  title: string,
  placeholder: string
}) {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editedItems, setEditedItems] = useState(items);
  const [newItem, setNewItem] = useState('');

  const handleSave = () => {
    onUpdate(editedItems.filter(item => item.trim() !== ''));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedItems(items);
    setNewItem('');
    setIsEditing(false);
  };

  const addItem = () => {
    if (newItem.trim()) {
      setEditedItems([...editedItems, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeItem = (index: number) => {
    setEditedItems(editedItems.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, value: string) => {
    const updated = [...editedItems];
    updated[index] = value;
    setEditedItems(updated);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Icon className={`h-5 w-5 ${iconColor} me-2`} />
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
          >
            <Pencil className="h-4 w-4 me-1" />
            {t('common.edit')}
          </button>
        ) : (
          <div className="flex space-x-2 rtl:space-x-reverse">
            <button
              onClick={handleSave}
              className="inline-flex items-center text-sm text-green-600 hover:text-green-700"
            >
              <Save className="h-4 w-4 me-1" />
              {t('common.save')}
            </button>
            <button
              onClick={handleCancel}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-700"
            >
              <X className="h-4 w-4 me-1" />
              {t('common.cancel')}
            </button>
          </div>
        )}
      </div>

      {!isEditing ? (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-start text-gray-700">
              <div className={`w-2 h-2 ${bulletColor} rounded-full me-3 mt-2 flex-shrink-0`}></div>
              {item}
            </li>
          ))}
          {items.length === 0 && (
            <p className="text-gray-400 italic">{t('studentProfile.noItemsYet')}</p>
          )}
        </ul>
      ) : (
        <div className="space-y-3">
          {editedItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className={`w-2 h-2 ${bulletColor} rounded-full flex-shrink-0`}></div>
              <input
                type="text"
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
              <button
                onClick={() => removeItem(index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <div className="flex items-center space-x-2 rtl:space-x-reverse pt-2">
            <Plus className={`h-4 w-4 ${iconColor}`} />
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 border border-dashed border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
            <button
              onClick={addItem}
              disabled={!newItem.trim()}
              className="px-3 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('common.add')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Editable Tags Component (for diagnoses)
function EditableTags({
  items,
  onUpdate,
  icon: Icon,
  iconColor,
  tagBg,
  tagText,
  title,
  placeholder,
  bare = false
}: {
  items: string[],
  onUpdate: (items: string[]) => void,
  icon: React.ElementType,
  iconColor: string,
  tagBg: string,
  tagText: string,
  title: string,
  placeholder: string,
  bare?: boolean
}) {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editedItems, setEditedItems] = useState(items);
  const [newItem, setNewItem] = useState('');

  const handleSave = () => {
    onUpdate(editedItems.filter(item => item.trim() !== ''));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedItems(items);
    setNewItem('');
    setIsEditing(false);
  };

  const addItem = () => {
    if (newItem.trim() && !editedItems.includes(newItem.trim())) {
      setEditedItems([...editedItems, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeItem = (index: number) => {
    setEditedItems(editedItems.filter((_, i) => i !== index));
  };

  const content = (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Icon className={`h-5 w-5 ${iconColor} me-2`} />
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
          >
            <Pencil className="h-4 w-4 me-1" />
            {t('common.edit')}
          </button>
        ) : (
          <div className="flex space-x-2 rtl:space-x-reverse">
            <button
              onClick={handleSave}
              className="inline-flex items-center text-sm text-green-600 hover:text-green-700"
            >
              <Save className="h-4 w-4 me-1" />
              {t('common.save')}
            </button>
            <button
              onClick={handleCancel}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-700"
            >
              <X className="h-4 w-4 me-1" />
              {t('common.cancel')}
            </button>
          </div>
        )}
      </div>

      {!isEditing ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <span
              key={index}
              className={`px-3 py-1.5 ${tagBg} ${tagText} rounded-lg text-sm font-medium`}
            >
              {item}
            </span>
          ))}
          {items.length === 0 && (
            <p className="text-gray-400 italic">{t('studentProfile.noItemsYet')}</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {editedItems.map((item, index) => (
              <span
                key={index}
                className={`inline-flex items-center px-3 py-1.5 ${tagBg} ${tagText} rounded-lg text-sm font-medium`}
              >
                {item}
                <button
                  onClick={() => removeItem(index)}
                  className="ms-2 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse pt-2">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 border border-dashed border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
            <button
              onClick={addItem}
              disabled={!newItem.trim()}
              className="px-3 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('common.add')}
            </button>
          </div>
        </div>
      )}
    </>
  );

  if (bare) return content;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      {content}
    </div>
  );
}

// Editable Text Component (for single text fields)
function EditableText({
  value,
  onUpdate,
  icon: Icon,
  iconColor,
  title,
  placeholder,
  multiline = false
}: {
  value: string,
  onUpdate: (value: string) => void,
  icon: React.ElementType,
  iconColor: string,
  title: string,
  placeholder: string,
  multiline?: boolean
}) {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value);

  const handleSave = () => {
    onUpdate(editedValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedValue(value);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Icon className={`h-5 w-5 ${iconColor} me-2`} />
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
          >
            <Pencil className="h-4 w-4 me-1" />
            {t('common.edit')}
          </button>
        ) : (
          <div className="flex space-x-2 rtl:space-x-reverse">
            <button
              onClick={handleSave}
              className="inline-flex items-center text-sm text-green-600 hover:text-green-700"
            >
              <Save className="h-4 w-4 me-1" />
              {t('common.save')}
            </button>
            <button
              onClick={handleCancel}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-700"
            >
              <X className="h-4 w-4 me-1" />
              {t('common.cancel')}
            </button>
          </div>
        )}
      </div>

      {!isEditing ? (
        <p className="text-gray-700 whitespace-pre-wrap">
          {value || <span className="text-gray-400 italic">{t('studentProfile.noInfoYet')}</span>}
        </p>
      ) : (
        multiline ? (
          <textarea
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            placeholder={placeholder}
            className="w-full h-32 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          />
        ) : (
          <input
            type="text"
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        )
      )}
    </div>
  );
}

export default function StudentProfilePage({ params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = use(params);
  const { t, locale, isHydrated } = useLanguage();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // State for all editable fields
  const [diagnoses, setDiagnoses] = useState<string[]>([]);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [challenges, setChallenges] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [sensoryNeeds, setSensoryNeeds] = useState<string[]>([]);
  const [communicationStyle, setCommunicationStyle] = useState('');
  const [supportStrategies, setSupportStrategies] = useState<string[]>([]);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [calmingStrategies, setCalmingStrategies] = useState<string[]>([]);
  const [teacherNotes, setTeacherNotes] = useState('');

  // AI Consult state
  const [showConsult, setShowConsult] = useState(false);
  const [consultQuestion, setConsultQuestion] = useState('');
  const [consultAnswer, setConsultAnswer] = useState('');
  const [consultLoading, setConsultLoading] = useState(false);
  const [consultError, setConsultError] = useState<string | null>(null);

  const handleConsult = async () => {
    if (!consultQuestion.trim() || !student) return;
    setConsultLoading(true);
    setConsultError(null);
    setConsultAnswer('');

    try {
      const res = await fetch('/api/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: `${student.firstName} ${student.lastName}`,
          diagnoses,
          question: consultQuestion,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      setConsultAnswer(data.answer);
    } catch (err: any) {
      setConsultError(err.message || 'Something went wrong');
    } finally {
      setConsultLoading(false);
    }
  };

  useEffect(() => {
    if (!isHydrated) return;
    async function fetchStudent() {
      setLoading(true);
      try {
        const res = await fetch(`/api/students/${studentId}?lang=${locale}`);
        if (res.ok) {
          const data = await res.json();
          setStudent(data);
          setDiagnoses(data.diagnoses || []);
          setStrengths(data.strengths || []);
          setChallenges(data.challenges || []);
          setInterests(data.interests || []);
          setSensoryNeeds(data.sensoryNeeds || []);
          setCommunicationStyle(data.communicationStyle || '');
          setSupportStrategies(data.supportStrategies || []);
          setTriggers(data.triggers || []);
          setCalmingStrategies(data.calmingStrategies || []);
          setTeacherNotes(data.teacherNotes || '');
        }
      } catch (error) {
        console.error('Failed to fetch student:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStudent();
  }, [studentId, locale, isHydrated]);

  // Save changes to database
  async function saveChanges() {
    if (!student) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/students/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: student.firstName,
          lastName: student.lastName,
          dateOfBirth: student.dateOfBirth,
          classId: student.classId,
          diagnoses,
          strengths,
          challenges,
          interests,
          sensoryNeeds,
          communicationStyle,
          supportStrategies,
          triggers,
          calmingStrategies,
          teacherNotes
        })
      });
      if (!res.ok) throw new Error('Failed to save');
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save changes');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      {/* Breadcrumb - always visible */}
      <Breadcrumb items={[
        { label: t('classesPage.title'), href: '/classes' },
        { label: loading ? '...' : (student?.className || 'Class'), href: student ? `/classes/${student.classId}` : '/classes' },
        { label: loading ? '...' : (student ? `${student.firstName} ${student.lastName}` : 'Student') }
      ]} />

      {loading ? (
        <LoadingSpinner />
      ) : !student ? (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('studentProfile.studentNotFound')}</h1>
            <Link href="/classes" className="text-primary-600 hover:underline">
              {t('studentProfile.returnToClasses')}
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Page Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back Button */}
            <Link
              href={`/classes/${student.classId}`}
              className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 me-2" />
              {t('studentProfile.backTo')} {student.className}
            </Link>

        {/* Student Header Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-2xl font-semibold">
                {student.firstName[0]}{student.lastName[0]}
              </div>
              <div className="ms-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  {student.firstName} {student.lastName}
                </h1>
                <p className="text-gray-600 mt-1">{student.className}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {t('studentProfile.born')}: {new Date(student.dateOfBirth).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
            <Link
              href={`/students/${student.id}/aet`}
              className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
            >
              <Target className="h-5 w-5 me-2" />
              {t('studentProfile.viewAETProgress')}
            </Link>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Diagnoses + AI Consult (combined card) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <EditableTags
                  items={diagnoses}
                  onUpdate={(items) => { setDiagnoses(items); setTimeout(saveChanges, 100); }}
                  icon={Brain}
                  iconColor="text-purple-600"
                  tagBg="bg-purple-50"
                  tagText="text-purple-700"
                  title={t('studentProfile.diagnoses')}
                  placeholder={t('studentProfile.addDiagnosis')}
                  bare
                />
              </div>

              {diagnoses.length > 0 && (
                <div className="border-t border-gray-100">
                  {!showConsult ? (
                    <button
                      onClick={() => setShowConsult(true)}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-ai-50 text-ai-600 hover:bg-ai-100 transition-colors font-medium text-sm"
                    >
                      <Wand2 className="h-4 w-4" />
                      {t('studentProfile.consultAI')}
                    </button>
                  ) : (
                    <div className="p-6 bg-gray-50/50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Wand2 className="h-5 w-5 text-ai-500" />
                          <h3 className="text-sm font-semibold text-gray-900">{t('studentProfile.askAboutDiagnoses')}</h3>
                        </div>
                        <button
                          onClick={() => { setShowConsult(false); setConsultAnswer(''); setConsultError(null); setConsultQuestion(''); }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={consultQuestion}
                          onChange={(e) => setConsultQuestion(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && !consultLoading && handleConsult()}
                          placeholder={t('studentProfile.consultPlaceholder')}
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-ai-500 focus:border-transparent bg-white"
                          disabled={consultLoading}
                        />
                        <button
                          onClick={handleConsult}
                          disabled={consultLoading || !consultQuestion.trim()}
                          className="inline-flex items-center px-4 py-2 bg-ai-500 text-white rounded-lg text-sm font-medium hover:bg-ai-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {consultLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      {consultError && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm mb-3">
                          {consultError}
                        </div>
                      )}

                      {consultAnswer && (
                        <div className="p-4 bg-ai-50 rounded-lg border border-ai-100">
                          <div className="prose prose-sm max-w-none text-gray-700">
                            <ReactMarkdown>{consultAnswer}</ReactMarkdown>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Strengths */}
            <EditableList
              items={strengths}
              onUpdate={(items) => { setStrengths(items); setTimeout(saveChanges, 100); }}
              icon={Sparkles}
              iconColor="text-primary-500"
              bulletColor="bg-primary-400"
              title={t('studentProfile.strengths')}
              placeholder={t('studentProfile.addStrength')}
            />

            {/* Challenges */}
            <EditableList
              items={challenges}
              onUpdate={(items) => { setChallenges(items); setTimeout(saveChanges, 100); }}
              icon={AlertCircle}
              iconColor="text-red-500"
              bulletColor="bg-red-400"
              title={t('studentProfile.challenges')}
              placeholder={t('studentProfile.addChallenge')}
            />

            {/* Interests */}
            <EditableList
              items={interests}
              onUpdate={(items) => { setInterests(items); setTimeout(saveChanges, 100); }}
              icon={Heart}
              iconColor="text-pink-500"
              bulletColor="bg-pink-400"
              title={t('studentProfile.interests')}
              placeholder={t('studentProfile.addInterest')}
            />

            {/* Triggers */}
            <EditableList
              items={triggers}
              onUpdate={(items) => { setTriggers(items); setTimeout(saveChanges, 100); }}
              icon={AlertCircle}
              iconColor="text-orange-500"
              bulletColor="bg-orange-400"
              title={t('studentProfile.triggers')}
              placeholder={t('studentProfile.addTrigger')}
            />

            {/* Calming Strategies */}
            <EditableList
              items={calmingStrategies}
              onUpdate={(items) => { setCalmingStrategies(items); setTimeout(saveChanges, 100); }}
              icon={Heart}
              iconColor="text-teal-500"
              bulletColor="bg-teal-400"
              title={t('studentProfile.calmingStrategies')}
              placeholder={t('studentProfile.addCalmingStrategy')}
            />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Communication Style */}
            <EditableText
              value={communicationStyle}
              onUpdate={(value) => { setCommunicationStyle(value); setTimeout(saveChanges, 100); }}
              icon={MessageSquare}
              iconColor="text-blue-500"
              title={t('studentProfile.communicationStyle')}
              placeholder={t('studentProfile.communicationStylePlaceholder')}
              multiline={true}
            />

            {/* Sensory Needs */}
            <EditableList
              items={sensoryNeeds}
              onUpdate={(items) => { setSensoryNeeds(items); setTimeout(saveChanges, 100); }}
              icon={Eye}
              iconColor="text-green-500"
              bulletColor="bg-green-400"
              title={t('studentProfile.sensoryNeeds')}
              placeholder={t('studentProfile.addSensoryNeed')}
            />

            {/* Support Strategies */}
            <EditableList
              items={supportStrategies}
              onUpdate={(items) => { setSupportStrategies(items); setTimeout(saveChanges, 100); }}
              icon={Target}
              iconColor="text-primary-500"
              bulletColor="bg-primary-400"
              title={t('studentProfile.supportStrategies')}
              placeholder={t('studentProfile.addSupportStrategy')}
            />

            {/* Teacher Notes */}
            <EditableText
              value={teacherNotes}
              onUpdate={(value) => { setTeacherNotes(value); setTimeout(saveChanges, 100); }}
              icon={Pencil}
              iconColor="text-primary-500"
              title={t('studentProfile.teacherNotes')}
              placeholder={t('studentProfile.addTeacherNote')}
              multiline={true}
            />

            {/* AET Link Card */}
            <div className="bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl p-6 text-white">
              <h2 className="text-lg font-semibold mb-4">{t('studentProfile.aetProgress')}</h2>
              <p className="text-primary-100 text-sm mb-4">
                {t('studentProfile.aetProgressDesc')}
              </p>
              <Link
                href={`/students/${student.id}/aet`}
                className="block w-full text-center py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
              >
                {t('studentProfile.viewFullProgress')}
              </Link>
            </div>
          </div>
        </div>

        {/* Saving Indicator */}
        {saving && (
          <div className="fixed bottom-4 right-4 bg-primary-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent me-2"></div>
            {t('common.saving')}
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
}
