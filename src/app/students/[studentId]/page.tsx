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
  Trash2
} from 'lucide-react';
import { Breadcrumb, LoadingSpinner } from '@/components';

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
          <Icon className={`h-5 w-5 ${iconColor} mr-2`} />
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700"
          >
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="inline-flex items-center text-sm text-green-600 hover:text-green-700"
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-700"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </button>
          </div>
        )}
      </div>

      {!isEditing ? (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-start text-gray-700">
              <div className={`w-2 h-2 ${bulletColor} rounded-full mr-3 mt-2 flex-shrink-0`}></div>
              {item}
            </li>
          ))}
          {items.length === 0 && (
            <p className="text-gray-400 italic">No items added yet</p>
          )}
        </ul>
      ) : (
        <div className="space-y-3">
          {editedItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className={`w-2 h-2 ${bulletColor} rounded-full flex-shrink-0`}></div>
              <input
                type="text"
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
              <button
                onClick={() => removeItem(index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <div className="flex items-center space-x-2 pt-2">
            <Plus className={`h-4 w-4 ${iconColor}`} />
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 border border-dashed border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
            <button
              onClick={addItem}
              disabled={!newItem.trim()}
              className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
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
  placeholder 
}: { 
  items: string[], 
  onUpdate: (items: string[]) => void,
  icon: React.ElementType,
  iconColor: string,
  tagBg: string,
  tagText: string,
  title: string,
  placeholder: string
}) {
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

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Icon className={`h-5 w-5 ${iconColor} mr-2`} />
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700"
          >
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="inline-flex items-center text-sm text-green-600 hover:text-green-700"
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-700"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
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
            <p className="text-gray-400 italic">No items added yet</p>
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
                  className="ml-2 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 border border-dashed border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
            <button
              onClick={addItem}
              disabled={!newItem.trim()}
              className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </div>
      )}
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
          <Icon className={`h-5 w-5 ${iconColor} mr-2`} />
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700"
          >
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="inline-flex items-center text-sm text-green-600 hover:text-green-700"
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-700"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </button>
          </div>
        )}
      </div>

      {!isEditing ? (
        <p className="text-gray-700 whitespace-pre-wrap">
          {value || <span className="text-gray-400 italic">No information added yet</span>}
        </p>
      ) : (
        multiline ? (
          <textarea
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            placeholder={placeholder}
            className="w-full h-32 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
        ) : (
          <input
            type="text"
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        )
      )}
    </div>
  );
}

export default function StudentProfilePage({ params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = use(params);
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

  useEffect(() => {
    async function fetchStudent() {
      try {
        const res = await fetch(`/api/students/${studentId}`);
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
  }, [studentId]);

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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!student) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Student Not Found</h1>
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
          { label: student.className, href: `/classes/${student.classId}` },
          { label: `${student.firstName} ${student.lastName}` }
        ]} />

        {/* Back Button */}
        <Link 
          href={`/classes/${student.classId}`}
          className="inline-flex items-center text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {student.className}
        </Link>

        {/* Student Header Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-2xl font-semibold">
                {student.firstName[0]}{student.lastName[0]}
              </div>
              <div className="ml-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  {student.firstName} {student.lastName}
                </h1>
                <p className="text-gray-600 mt-1">{student.className}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Born: {new Date(student.dateOfBirth).toLocaleDateString('en-GB', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <Link
              href={`/students/${student.id}/aet`}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              <Target className="h-5 w-5 mr-2" />
              View AET Progress
            </Link>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Diagnoses */}
            <EditableTags
              items={diagnoses}
              onUpdate={(items) => { setDiagnoses(items); setTimeout(saveChanges, 100); }}
              icon={Brain}
              iconColor="text-purple-600"
              tagBg="bg-purple-50"
              tagText="text-purple-700"
              title="Diagnoses"
              placeholder="Add a diagnosis..."
            />

            {/* Strengths */}
            <EditableList
              items={strengths}
              onUpdate={(items) => { setStrengths(items); setTimeout(saveChanges, 100); }}
              icon={Sparkles}
              iconColor="text-amber-500"
              bulletColor="bg-amber-400"
              title="Strengths"
              placeholder="Add a strength..."
            />

            {/* Challenges */}
            <EditableList
              items={challenges}
              onUpdate={(items) => { setChallenges(items); setTimeout(saveChanges, 100); }}
              icon={AlertCircle}
              iconColor="text-red-500"
              bulletColor="bg-red-400"
              title="Challenges"
              placeholder="Add a challenge..."
            />

            {/* Interests */}
            <EditableList
              items={interests}
              onUpdate={(items) => { setInterests(items); setTimeout(saveChanges, 100); }}
              icon={Heart}
              iconColor="text-pink-500"
              bulletColor="bg-pink-400"
              title="Interests"
              placeholder="Add an interest..."
            />

            {/* Triggers */}
            <EditableList
              items={triggers}
              onUpdate={(items) => { setTriggers(items); setTimeout(saveChanges, 100); }}
              icon={AlertCircle}
              iconColor="text-orange-500"
              bulletColor="bg-orange-400"
              title="Triggers"
              placeholder="Add a trigger..."
            />

            {/* Calming Strategies */}
            <EditableList
              items={calmingStrategies}
              onUpdate={(items) => { setCalmingStrategies(items); setTimeout(saveChanges, 100); }}
              icon={Heart}
              iconColor="text-teal-500"
              bulletColor="bg-teal-400"
              title="Calming Strategies"
              placeholder="Add a calming strategy..."
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
              title="Communication Style"
              placeholder="Describe how this student communicates..."
              multiline={true}
            />

            {/* Sensory Needs */}
            <EditableList
              items={sensoryNeeds}
              onUpdate={(items) => { setSensoryNeeds(items); setTimeout(saveChanges, 100); }}
              icon={Eye}
              iconColor="text-green-500"
              bulletColor="bg-green-400"
              title="Sensory Needs"
              placeholder="Add a sensory need..."
            />

            {/* Support Strategies */}
            <EditableList
              items={supportStrategies}
              onUpdate={(items) => { setSupportStrategies(items); setTimeout(saveChanges, 100); }}
              icon={Target}
              iconColor="text-indigo-500"
              bulletColor="bg-indigo-400"
              title="Support Strategies"
              placeholder="Add a support strategy..."
            />

            {/* Teacher Notes */}
            <EditableText
              value={teacherNotes}
              onUpdate={(value) => { setTeacherNotes(value); setTimeout(saveChanges, 100); }}
              icon={Pencil}
              iconColor="text-amber-500"
              title="Teacher Notes"
              placeholder="Add any additional notes about this student..."
              multiline={true}
            />

            {/* AET Link Card */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
              <h2 className="text-lg font-semibold mb-4">AET Progress</h2>
              <p className="text-indigo-100 text-sm mb-4">
                Track this student's progress across all AET framework areas with AI-generated personalized teaching plans.
              </p>
              <Link
                href={`/students/${student.id}/aet`}
                className="block w-full text-center py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
              >
                View Full Progress →
              </Link>
            </div>
          </div>
        </div>

        {/* Saving Indicator */}
        {saving && (
          <div className="fixed bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
            Saving...
          </div>
        )}
      </div>
    </div>
  );
}
