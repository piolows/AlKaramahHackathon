'use client';

import Link from 'next/link';
import { use } from 'react';
import { 
  GraduationCap, 
  ChevronRight,
  Users,
  ArrowLeft,
  Target,
  Brain,
  Heart,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { sampleClasses, sampleStudents, sampleAETGoals } from '@/lib/sample-data';

export default function ClassDetailPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = use(params);
  const classData = sampleClasses.find(c => c.id === classId);
  const students = sampleStudents.filter(s => s.classId === classId);

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
              <p className="text-gray-600 mb-4">{classData.description}</p>
              <div className="flex items-center space-x-4">
                <span className="inline-flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-1" />
                  {students.length} Students
                </span>
                <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                  {classData.gradeLevel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Students Grid */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Students</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => {
            const studentGoals = sampleAETGoals.filter(g => g.studentId === student.id);
            const inProgressGoals = studentGoals.filter(g => g.status === 'in_progress').length;
            
            return (
              <div
                key={student.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                {/* Student Header */}
                <div className="flex items-center mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-lg font-semibold">
                    {student.firstName[0]}{student.lastName[0]}
                  </div>
                  <div className="ml-4">
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
                <div className="space-y-3 mb-4">
                  <div className="flex items-start">
                    <Brain className="h-4 w-4 text-purple-500 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {student.diagnoses.join(', ')}
                    </p>
                  </div>
                  <div className="flex items-start">
                    <Sparkles className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {student.strengths.slice(0, 2).join(', ')}
                    </p>
                  </div>
                  <div className="flex items-start">
                    <MessageSquare className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {student.communicationStyle}
                    </p>
                  </div>
                </div>

                {/* Goals Summary */}
                {studentGoals.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Active Goals</span>
                      <span className="font-medium text-indigo-600">{inProgressGoals} in progress</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-4 border-t border-gray-100">
                  <Link
                    href={`/students/${student.id}`}
                    className="flex-1 text-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    Profile
                  </Link>
                  <Link
                    href={`/students/${student.id}/aet`}
                    className="flex-1 text-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                  >
                    AET Goals
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
