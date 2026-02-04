'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  Users, 
  ChevronRight,
  School,
  Settings
} from 'lucide-react';

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
  classId: string;
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [classesRes, studentsRes] = await Promise.all([
          fetch('/api/classes'),
          fetch('/api/students')
        ]);
        const [classesData, studentsData] = await Promise.all([
          classesRes.json(),
          studentsRes.json()
        ]);
        setClasses(classesData);
        setStudents(studentsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
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
          <span className="text-gray-900">Classes</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Classes</h1>
          <p className="text-gray-600">Select a class to view students and their individual education plans.</p>
        </div>

        {/* Classes Grid */}
        {classes.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <School className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Classes Yet</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first class in the admin panel.</p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Settings className="h-4 w-4" />
              Go to Admin
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classItem) => {
              const classStudents = students.filter(s => s.classId === classItem.id);
              
              return (
                <Link
                  key={classItem.id}
                  href={`/classes/${classItem.id}`}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                      <School className="h-6 w-6 text-indigo-600" />
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                  </div>
                  
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {classItem.name}
                  </h2>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    {classItem.description || 'No description'}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      {classItem.studentCount} Students
                    </div>
                    {classItem.ageRange && (
                      <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">
                        {classItem.ageRange}
                      </span>
                    )}
                  </div>

                  {/* Student Avatars Preview */}
                  {classStudents.length > 0 && (
                    <div className="mt-4 flex -space-x-2">
                      {classStudents.slice(0, 5).map((student) => (
                        <div
                          key={student.id}
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                          title={`${student.firstName} ${student.lastName}`}
                        >
                          {student.firstName[0]}{student.lastName[0]}
                        </div>
                      ))}
                      {classStudents.length > 5 && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-medium border-2 border-white">
                          +{classStudents.length - 5}
                        </div>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {/* Info Card */}
        <div className="mt-12 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Manage Your Classes
          </h3>
          <p className="text-gray-600">
            Use the <Link href="/admin" className="text-indigo-600 hover:underline">Admin Panel</Link> to add, edit, or remove classes and students.
            Each student can have personalized AET progression tracking and AI-generated teaching plans.
          </p>
        </div>
      </div>
    </div>
  );
}
