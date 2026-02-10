'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutGrid, List } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { Breadcrumb } from '@/components';

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
  const router = useRouter();
  const { t, locale } = useLanguage();
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'classes' | 'admin'>('classes');
  const [viewMode, setViewMode] = useState<'tile' | 'list'>('tile');

  useEffect(() => {
    async function fetchData() {
      try {
        const [classesRes, studentsRes] = await Promise.all([
          fetch(`/api/classes?lang=${locale}`),
          fetch(`/api/students?lang=${locale}`)
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
  }, [locale]);

  const handleTabClick = (tab: 'classes' | 'admin') => {
    setActiveTab(tab);
    if (tab === 'admin') {
      router.push('/admin');
    }
  };

  const getClassStudents = (classId: string) => {
    return students.filter(s => s.classId === classId);
  };

  return (
    <>
      <div style={{ background: '#f5f2ee', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Breadcrumb */}
        <Breadcrumb items={[
          { label: t('classesPage.title') }
        ]} />

        {/* Header */}
        <div style={{
          padding: '2.5rem 2rem',
          background: 'white',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between'
        }}>
          <div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#2f3f58',
              margin: '0 0 0.5rem 0',
              letterSpacing: '-0.6px'
            }}>{t('classesPage.title')}</h1>
            <p style={{
              fontSize: '0.95rem',
              color: '#7a8492',
              margin: 0,
              fontWeight: 400,
              lineHeight: 1.7
            }}>{t('classesPage.subtitle')}</p>
          </div>
          
          {/* View Toggle */}
          {classes.length > 0 && (
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setViewMode('tile')}
                className={`cursor-pointer p-2 rounded-md transition-all ${
                  viewMode === 'tile'
                    ? 'bg-white shadow-sm text-primary-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                style={viewMode === 'tile' ? { color: '#618232' } : {}}
                title="Tile view"
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`cursor-pointer p-2 rounded-md transition-all ${
                  viewMode === 'list'
                    ? 'bg-white shadow-sm text-primary-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                style={viewMode === 'list' ? { color: '#618232' } : {}}
                title="List view"
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '2.5rem 2rem', background: '#f5f2ee' }}>
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  border: '4px solid #e8ebe6',
                  borderTopColor: '#96c652',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
              </div>
            ) : classes.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                background: 'white',
                borderRadius: '1.25rem',
                border: '1.5px solid #e8ebe6'
              }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto', color: '#b8bec4' }}>
                  <path d="M12 2L2 7V10C2 16.627 7.373 22 12 22C16.627 22 22 16.627 22 10V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M12 11V17M8 14H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2f3f58', margin: '1rem 0 0.5rem' }}>{t('classesPage.noClasses')}</h3>
                <p style={{ color: '#7a8492', marginBottom: '1.5rem' }}>{t('classesPage.noClassesDesc')}</p>
                <Link href="/admin" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: '#96c652',
                  color: 'white',
                  borderRadius: '0.75rem',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" />
                    <path d="M19.4 15C19.1277 15.6171 19.2583 16.3378 19.73 16.82L19.79 16.88C20.1656 17.2551 20.3766 17.7642 20.3766 18.295C20.3766 18.8258 20.1656 19.3349 19.79 19.71C19.4149 20.0856 18.9058 20.2966 18.375 20.2966C17.8442 20.2966 17.3351 20.0856 16.96 19.71L16.9 19.65C16.4178 19.1783 15.6971 19.0477 15.08 19.32C14.4755 19.5791 14.0826 20.1724 14.08 20.83V21C14.08 22.1046 13.1846 23 12.08 23C10.9754 23 10.08 22.1046 10.08 21V20.91C10.0642 20.2327 9.63587 19.6339 9 19.4C8.38291 19.1277 7.66219 19.2583 7.18 19.73L7.12 19.79C6.74494 20.1656 6.23584 20.3766 5.705 20.3766C5.17416 20.3766 4.66506 20.1656 4.29 19.79C3.91445 19.4149 3.70343 18.9058 3.70343 18.375C3.70343 17.8442 3.91445 17.3351 4.29 16.96L4.35 16.9C4.82167 16.4178 4.95226 15.6971 4.68 15.08C4.42093 14.4755 3.82764 14.0826 3.17 14.08H3C1.89543 14.08 1 13.1846 1 12.08C1 10.9754 1.89543 10.08 3 10.08H3.09C3.76733 10.0642 4.36613 9.63587 4.6 9C4.87226 8.38291 4.74167 7.66219 4.27 7.18L4.21 7.12C3.83445 6.74494 3.62343 6.23584 3.62343 5.705C3.62343 5.17416 3.83445 4.66506 4.21 4.29C4.58506 3.91445 5.09416 3.70343 5.625 3.70343C6.15584 3.70343 6.66494 3.91445 7.04 4.29L7.1 4.35C7.58219 4.82167 8.30291 4.95226 8.92 4.68H9C9.60447 4.42093 9.99738 3.82764 10 3.17V3C10 1.89543 10.8954 1 12 1C13.1046 1 14 1.89543 14 3V3.09C14.0026 3.74764 14.3955 4.34093 15 4.6C15.6171 4.87226 16.3378 4.74167 16.82 4.27L16.88 4.21C17.2551 3.83445 17.7642 3.62343 18.295 3.62343C18.8258 3.62343 19.3349 3.83445 19.71 4.21C20.0856 4.58506 20.2966 5.09416 20.2966 5.625C20.2966 6.15584 20.0856 6.66494 19.71 7.04L19.65 7.1C19.1783 7.58219 19.0477 8.30291 19.32 8.92V9C19.5791 9.60447 20.1724 9.99738 20.83 10H21C22.1046 10 23 10.8954 23 12C23 13.1046 22.1046 14 21 14H20.91C20.2524 14.0026 19.6591 14.3955 19.4 15Z" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  {t('classesPage.goToAdmin')}
                </Link>
              </div>
            ) : viewMode === 'tile' ? (
              <>
                {/* Classes Grid - Tile View */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '2rem',
                  marginBottom: '3rem',
                  alignItems: 'start'
                }}>
                  {classes.map((classItem) => {
                    const classStudents = getClassStudents(classItem.id);
                    
                    return (
                      <Link
                        key={classItem.id}
                        href={`/classes/${classItem.id}`}
                        tabIndex={0}
                        role="button"
                        aria-label={`Open ${classItem.name} details`}
                        style={{
                          textDecoration: 'none',
                          background: 'white',
                          border: '1.5px solid #e8ebe6',
                          borderTop: '4px solid transparent',
                          borderRadius: '1.25rem',
                          padding: '1.75rem',
                          display: 'flex',
                          flexDirection: 'column',
                          height: '100%',
                          boxShadow: '0 4px 12px rgba(47, 63, 88, 0.08), 0 8px 24px rgba(47, 63, 88, 0.04)',
                          transition: 'all 0.35s ease'
                        }}
                        className="class-card-hover"
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: '#96c652' }}>
                            <path d="M12 2L2 7V10C2 16.627 7.373 22 12 22C16.627 22 22 16.627 22 10V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                            <path d="M12 11V17M8 14H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                          <svg width="22" height="22" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: '#d1d5db' }}>
                            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#2f3f58', margin: '0 0 0.5rem 0', letterSpacing: '-0.2px' }}>{classItem.name}</h3>
                        <p style={{ fontSize: '0.88rem', color: '#7a8492', margin: '0 0 1.25rem 0', lineHeight: 1.65, flexGrow: 1 }}>{classItem.description || t('common.noDescription')}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.6rem 1.1rem',
                            background: '#b6d886',
                            color: '#2d5016',
                            borderRadius: '2rem',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            letterSpacing: '0.3px'
                          }}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="5" cy="4" r="2" stroke="currentColor" strokeWidth="1.5" />
                              <path d="M8.5 10C8.5 8.895 7.605 8 6.5 8H3.5C2.395 8 1.5 8.895 1.5 10V12H8.5V10Z" stroke="currentColor" strokeWidth="1.5" />
                              <circle cx="11" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                              <path d="M13 10C13 9.172 12.328 8.5 11.5 8.5H9.5C8.672 8.5 8 9.172 8 10V11.5H13V10Z" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                            <span>{classItem.studentCount} {t('common.students')}</span>
                          </div>
                        </div>
                        {classStudents.length > 0 && (
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                            {classStudents.slice(0, 5).map((student) => (
                              <div key={student.id} style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '32px',
                                height: '32px',
                                borderRadius: '0.5rem',
                                background: '#e0f2fe',
                                color: '#1e3a8a',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                border: '1.5px solid #0284c7'
                              }}>
                                {student.firstName[0]}{student.lastName[0]}
                              </div>
                            ))}
                            {classStudents.length > 5 && (
                              <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '32px',
                                height: '32px',
                                borderRadius: '0.5rem',
                                background: '#f3f4f6',
                                color: '#6b7280',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                border: '1.5px solid #d1d5db'
                              }}>
                                +{classStudents.length - 5}
                              </div>
                            )}
                          </div>
                        )}
                        <p style={{ fontSize: '0.75rem', color: '#b8bec4', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', marginTop: 'auto' }}>{classItem.ageRange || t('common.ageRangeNotSet')}</p>
                      </Link>
                    );
                  })}
                </div>

                {/* Manage Section */}
                <div style={{
                  background: '#f9fbf6',
                  border: '1.5px solid #d4e7b8',
                  borderRadius: '1.25rem',
                  padding: '2.5rem',
                  marginTop: '2rem',
                  boxShadow: '0 4px 16px rgba(150, 198, 82, 0.08)'
                }}>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#2f3f58', margin: '0 0 1rem 0', letterSpacing: '-0.2px' }}>{t('classesPage.manageTitle')}</h2>
                  <p style={{ fontSize: '0.95rem', color: '#7a8492', margin: 0, lineHeight: 1.8 }}>
                    {t('classesPage.manageDesc1')} <Link href="/admin" style={{ color: '#618232', fontWeight: 600, textDecoration: 'none' }}>{t('classesPage.manageDesc2')}</Link> {t('classesPage.manageDesc3')}
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Classes List View */}
                <div style={{ background: 'white', borderRadius: '1.25rem', boxShadow: '0 4px 12px rgba(47, 63, 88, 0.08)', border: '1.5px solid #e8ebe6', overflow: 'hidden', marginBottom: '3rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {classes.map((classItem, index) => {
                      const classStudents = getClassStudents(classItem.id);
                      
                      return (
                        <Link
                          key={classItem.id}
                          href={`/classes/${classItem.id}`}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '1rem', 
                            padding: '1rem 1.5rem', 
                            textDecoration: 'none',
                            borderBottom: index < classes.length - 1 ? '1px solid #f0f0f0' : 'none',
                            transition: 'background-color 0.2s ease'
                          }}
                          className="list-item-hover"
                        >
                          <div style={{ 
                            width: '40px', 
                            height: '40px', 
                            borderRadius: '0.5rem', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            border: '1px solid #e8ebe6',
                            background: '#f5f2ee',
                            flexShrink: 0
                          }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: '#96c652' }}>
                              <path d="M12 2L2 7V10C2 16.627 7.373 22 12 22C16.627 22 22 16.627 22 10V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                              <path d="M12 11V17M8 14H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          </div>
                          
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h2 style={{ 
                              fontSize: '1rem', 
                              fontWeight: 600, 
                              color: '#2f3f58', 
                              margin: 0,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {classItem.name}
                            </h2>
                            <p style={{ 
                              fontSize: '0.875rem', 
                              color: '#7a8492', 
                              margin: 0,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {classItem.description || t('common.noDescription')}
                            </p>
                          </div>

                          {/* Student Avatars */}
                          {classStudents.length > 0 && (
                            <div style={{ display: 'flex', marginLeft: '-0.5rem', flexShrink: 0 }}>
                              {classStudents.slice(0, 3).map((student, idx) => (
                                <div
                                  key={student.id}
                                  style={{ 
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '0.7rem',
                                    fontWeight: 500,
                                    border: '2px solid white',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    marginLeft: idx > 0 ? '-0.5rem' : 0,
                                    background: idx % 2 === 0 ? 'linear-gradient(135deg, #96c652 0%, #618232 100%)' : 'linear-gradient(135deg, #f97316 0%, #2f3f58 100%)'
                                  }}
                                  title={`${student.firstName} ${student.lastName}`}
                                >
                                  {student.firstName[0]}{student.lastName[0]}
                                </div>
                              ))}
                              {classStudents.length > 3 && (
                                <div style={{ 
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: '#e5e7eb',
                                  color: '#6b7280',
                                  fontSize: '0.7rem',
                                  fontWeight: 500,
                                  border: '2px solid white',
                                  marginLeft: '-0.5rem'
                                }}>
                                  +{classStudents.length - 3}
                                </div>
                              )}
                            </div>
                          )}

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#7a8492' }}>
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.25rem' }}>
                                <circle cx="5" cy="4" r="2" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M8.5 10C8.5 8.895 7.605 8 6.5 8H3.5C2.395 8 1.5 8.895 1.5 10V12H8.5V10Z" stroke="currentColor" strokeWidth="1.5" />
                                <circle cx="11" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M13 10C13 9.172 12.328 8.5 11.5 8.5H9.5C8.672 8.5 8 9.172 8 10V11.5H13V10Z" stroke="currentColor" strokeWidth="1.5" />
                              </svg>
                              {classItem.studentCount}
                            </div>
                            {classItem.ageRange && (
                              <span style={{ 
                                fontSize: '0.75rem', 
                                padding: '0.25rem 0.5rem', 
                                borderRadius: '9999px', 
                                fontWeight: 500,
                                background: '#b6d886',
                                color: '#2d5016'
                              }}>
                                {classItem.ageRange}
                              </span>
                            )}
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: '#d1d5db' }}>
                              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Manage Section */}
                <div style={{
                  background: '#f9fbf6',
                  border: '1.5px solid #d4e7b8',
                  borderRadius: '1.25rem',
                  padding: '2.5rem',
                  marginTop: '2rem',
                  boxShadow: '0 4px 16px rgba(150, 198, 82, 0.08)'
                }}>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#2f3f58', margin: '0 0 1rem 0', letterSpacing: '-0.2px' }}>Manage Your Classes</h2>
                  <p style={{ fontSize: '0.95rem', color: '#7a8492', margin: 0, lineHeight: 1.8 }}>
                    Use the <Link href="/admin" style={{ color: '#618232', fontWeight: 600, textDecoration: 'none' }}>Admin Panel</Link> to add new classes, edit existing ones, and manage student enrollment. TrainTracks automatically generates personalized AET progression tracking and AI-powered learning plans for each student.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Global styles for hover effects */}
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .class-card-hover:hover {
          border-top-color: #96c652 !important;
          box-shadow: 0 12px 32px rgba(150, 198, 82, 0.18), 0 20px 40px rgba(47, 63, 88, 0.12) !important;
          transform: translateY(-6px);
        }
        .list-item-hover:hover {
          background-color: #f9fafb;
        }
        .list-item-hover:hover h2 {
          color: #618232 !important;
        }
      `}</style>
    </>
  );
}


// =====================================================
// OLD CLASSES PAGE CODE (COMMENTED OUT)
// =====================================================

// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { 
//   Users, 
//   ChevronRight,
//   School,
//   Settings,
//   LayoutGrid,
//   List
// } from 'lucide-react';
// import { Breadcrumb, LoadingSpinner } from '@/components';

// interface ClassData {
//   id: string;
//   name: string;
//   description: string | null;
//   ageRange: string | null;
//   studentCount: number;
// }

// interface Student {
//   id: string;
//   firstName: string;
//   lastName: string;
//   classId: string;
// }

// type ViewMode = 'tile' | 'list';

// export default function ClassesPage() {
//   const [classes, setClasses] = useState<ClassData[]>([]);
//   const [students, setStudents] = useState<Student[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [viewMode, setViewMode] = useState<ViewMode>('tile');

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const [classesRes, studentsRes] = await Promise.all([
//           fetch('/api/classes'),
//           fetch('/api/students')
//         ]);
//         const [classesData, studentsData] = await Promise.all([
//           classesRes.json(),
//           studentsRes.json()
//         ]);
//         setClasses(classesData);
//         setStudents(studentsData);
//       } catch (error) {
//         console.error('Failed to fetch data:', error);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchData();
//   }, []);

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div className="min-h-[60vh]">
//       {/* Page Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Breadcrumb */}
//         <Breadcrumb items={[{ label: 'Classes' }]} />

//         {/* Page Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--dark-blue-500)' }}>Classes</h1>
//             <p style={{ color: 'var(--primary-400)' }}>Select a class to view students and their individual education plans.</p>
//           </div>
          
//           {/* View Toggle */}
//           {classes.length > 0 && (
//             <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
//               <button
//                 onClick={() => setViewMode('tile')}
//                 className={`cursor-pointer p-2 rounded-md transition-all ${
//                   viewMode === 'tile'
//                     ? 'bg-white shadow-sm text-primary-500'
//                     : 'text-gray-500 hover:text-gray-700'
//                 }`}
//                 style={viewMode === 'tile' ? { color: 'var(--primary-500)' } : {}}
//                 title="Tile view"
//               >
//                 <LayoutGrid className="h-5 w-5" />
//               </button>
//               <button
//                 onClick={() => setViewMode('list')}
//                 className={`cursor-pointer p-2 rounded-md transition-all ${
//                   viewMode === 'list'
//                     ? 'bg-white shadow-sm text-primary-500'
//                     : 'text-gray-500 hover:text-gray-700'
//                 }`}
//                 style={viewMode === 'list' ? { color: 'var(--primary-500)' } : {}}
//                 title="List view"
//               >
//                 <List className="h-5 w-5" />
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Classes Grid/List */}
//         {classes.length === 0 ? (
//           <div className="bg-white rounded-2xl p-12 text-center">
//             <School className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No Classes Yet</h3>
//             <p className="text-gray-600 mb-4">Get started by creating your first class in the admin panel.</p>
//             <Link
//               href="/admin"
//               className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg shadow-md hover:shadow-lg hover:opacity-90 transition-all"
//               style={{ background: 'linear-gradient(135deg, var(--primary-300) 0%, var(--primary-400) 100%)' }}
//             >
//               <Settings className="h-4 w-4" />
//               Go to Admin
//             </Link>
//           </div>
//         ) : viewMode === 'tile' ? (
//           /* Tile View */
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {classes.map((classItem) => {
//               const classStudents = students.filter(s => s.classId === classItem.id);
              
//               return (
//                 <Link
//                   key={classItem.id}
//                   href={`/classes/${classItem.id}`}
//                   className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary-300 hover:-translate-y-1 transition-all duration-300 group"
//                 >
//                   <div className="flex items-start justify-between mb-4">
//                     <div className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:shadow-md transition-all border border-gray-100"
//                     style={{ backgroundColor: 'var(--background)' }}
//                     >
//                       <School className="h-6 w-6" style={{ color: 'var(--primary-400)' }} />
//                     </div>
//                     <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
//                   </div>
                  
//                   <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-500 transition-colors">
//                     {classItem.name}
//                   </h2>
                  
//                   <p className="text-gray-600 text-sm mb-4">
//                     {classItem.description || 'No description'}
//                   </p>
                  
//                   <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//                     <div className="flex items-center text-sm text-gray-500">
//                       <Users className="h-4 w-4 mr-1" />
//                       {classItem.studentCount} Students
//                     </div>
//                     {classItem.ageRange && (
//                       <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: 'var(--primary-50)', color: 'var(--primary-400)' }}>
//                         {classItem.ageRange}
//                       </span>
//                     )}
//                   </div>

//                   {/* Student Avatars Preview */}
//                   {classStudents.length > 0 && (
//                     <div className="mt-4 flex -space-x-2">
//                       {classStudents.slice(0, 5).map((student, idx) => (
//                         <div
//                           key={student.id}
//                           className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white shadow-sm"
//                           style={{ 
//                             background: `linear-gradient(135deg, ${idx % 2 === 0 ? 'var(--primary-300)' : 'var(--accent-400)'} 0%, ${idx % 2 === 0 ? 'var(--primary-400)' : 'var(--dark-blue-600)'} 100%)` 
//                           }}
//                           title={`${student.firstName} ${student.lastName}`}
//                         >
//                           {student.firstName[0]}{student.lastName[0]}
//                         </div>
//                       ))}
//                       {classStudents.length > 5 && (
//                         <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-medium border-2 border-white">
//                           +{classStudents.length - 5}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </Link>
//               );
//             })}
//           </div>
//         ) : (
//           /* List View */
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//             <div className="divide-y divide-gray-100">
//               {classes.map((classItem) => {
//                 const classStudents = students.filter(s => s.classId === classItem.id);
                
//                 return (
//                   <Link
//                     key={classItem.id}
//                     href={`/classes/${classItem.id}`}
//                     className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group"
//                   >
//                     <div className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-100 flex-shrink-0"
//                       style={{ backgroundColor: 'var(--background)' }}
//                     >
//                       <School className="h-5 w-5" style={{ color: 'var(--primary-400)' }} />
//                     </div>
                    
//                     <div className="flex-1 min-w-0">
//                       <h2 className="text-base font-semibold text-gray-900 group-hover:text-primary-500 transition-colors truncate">
//                         {classItem.name}
//                       </h2>
//                       <p className="text-sm text-gray-500 truncate">
//                         {classItem.description || 'No description'}
//                       </p>
//                     </div>

//                     {/* Student Avatars */}
//                     {classStudents.length > 0 && (
//                       <div className="hidden sm:flex -space-x-2 flex-shrink-0">
//                         {classStudents.slice(0, 3).map((student, idx) => (
//                           <div
//                             key={student.id}
//                             className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white shadow-sm"
//                             style={{ 
//                               background: `linear-gradient(135deg, ${idx % 2 === 0 ? 'var(--primary-300)' : 'var(--accent-400)'} 0%, ${idx % 2 === 0 ? 'var(--primary-400)' : 'var(--dark-blue-600)'} 100%)` 
//                             }}
//                             title={`${student.firstName} ${student.lastName}`}
//                           >
//                             {student.firstName[0]}{student.lastName[0]}
//                           </div>
//                         ))}
//                         {classStudents.length > 3 && (
//                           <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-medium border-2 border-white">
//                             +{classStudents.length - 3}
//                           </div>
//                         )}
//                       </div>
//                     )}

//                     <div className="flex items-center gap-3 flex-shrink-0">
//                       <div className="flex items-center text-sm text-gray-500">
//                         <Users className="h-4 w-4 mr-1" />
//                         {classItem.studentCount}
//                       </div>
//                       {classItem.ageRange && (
//                         <span className="hidden sm:inline text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: 'var(--primary-50)', color: 'var(--primary-400)' }}>
//                           {classItem.ageRange}
//                         </span>
//                       )}
//                       <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
//                     </div>
//                   </Link>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* Info Card */}
//         <div className="mt-12 rounded-2xl p-8 shadow-md" style={{ background: 'linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 50%, var(--accent-50) 100%)' }}>
//           <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--dark-blue-600)' }}>
//             Manage Your Classes
//           </h3>
//           <p className="text-gray-600">
//             Use the <Link href="/admin" className="font-medium hover:underline" style={{ color: 'var(--primary-500)' }}>Admin Panel</Link> to add, edit, or remove classes and students.
//             Each student can have personalized AET progression tracking and AI-generated teaching plans.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }