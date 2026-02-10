import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Helper to parse JSON arrays from strings
function parseJsonArray(value: string | null): string[] {
  if (!value) return []
  try {
    return JSON.parse(value)
  } catch {
    return []
  }
}

// Helper to transform student data from DB format
function transformStudent(student: {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: Date
  classId: string
  class?: { id: string; name: string } | null
  diagnoses: string
  strengths: string
  challenges: string
  interests: string
  sensoryNeeds: string
  communicationStyle: string
  supportStrategies: string
  triggers: string
  calmingStrategies: string
  createdAt: Date
  updatedAt: Date
}) {
  return {
    id: student.id,
    firstName: student.firstName,
    lastName: student.lastName,
    dateOfBirth: student.dateOfBirth.toISOString().split('T')[0],
    classId: student.classId,
    className: student.class?.name || '',
    diagnoses: parseJsonArray(student.diagnoses),
    strengths: parseJsonArray(student.strengths),
    challenges: parseJsonArray(student.challenges),
    interests: parseJsonArray(student.interests),
    sensoryNeeds: parseJsonArray(student.sensoryNeeds),
    communicationStyle: student.communicationStyle,
    supportStrategies: parseJsonArray(student.supportStrategies),
    triggers: parseJsonArray(student.triggers),
    calmingStrategies: parseJsonArray(student.calmingStrategies),
    createdAt: student.createdAt,
    updatedAt: student.updatedAt
  }
}

// GET all students (optionally filter by classId)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const classId = searchParams.get('classId')
    const lang = searchParams.get('lang')

    // When Arabic, read display data from translated tables
    if (lang === 'ar') {
      const classFilter = classId ? `WHERE st.classId = '${classId}'` : ''
      const rows: any[] = await prisma.$queryRawUnsafe(`
        SELECT st.*, ct.name as className
        FROM StudentTranslated st
        LEFT JOIN ClassTranslated ct ON st.classId = ct.id
        ${classFilter}
        ORDER BY st.lastName ASC, st.firstName ASC
      `)
      return NextResponse.json(rows.map(row => ({
        id: row.id,
        firstName: row.firstName,
        lastName: row.lastName,
        dateOfBirth: typeof row.dateOfBirth === 'string' ? row.dateOfBirth.split('T')[0] : new Date(row.dateOfBirth).toISOString().split('T')[0],
        classId: row.classId,
        className: row.className || '',
        diagnoses: parseJsonArray(row.diagnoses),
        strengths: parseJsonArray(row.strengths),
        challenges: parseJsonArray(row.challenges),
        interests: parseJsonArray(row.interests),
        sensoryNeeds: parseJsonArray(row.sensoryNeeds),
        communicationStyle: row.communicationStyle || '',
        supportStrategies: parseJsonArray(row.supportStrategies),
        triggers: parseJsonArray(row.triggers),
        calmingStrategies: parseJsonArray(row.calmingStrategies),
        teacherNotes: row.teacherNotes || '',
        createdAt: row.createdAt,
        updatedAt: row.updatedAt
      })))
    }

    const students = await prisma.student.findMany({
      where: classId ? { classId } : undefined,
      include: {
        class: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: [
        { lastName: 'asc' },
        { firstName: 'asc' }
      ]
    })

    return NextResponse.json(students.map(transformStudent))
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    )
  }
}

// POST create new student
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      firstName,
      lastName,
      dateOfBirth,
      classId,
      diagnoses,
      strengths,
      challenges,
      interests,
      sensoryNeeds,
      communicationStyle,
      supportStrategies,
      triggers,
      calmingStrategies
    } = body

    if (!firstName || !lastName || !dateOfBirth || !classId) {
      return NextResponse.json(
        { error: 'First name, last name, date of birth, and class are required' },
        { status: 400 }
      )
    }

    // Verify class exists
    const classExists = await prisma.class.findUnique({
      where: { id: classId }
    })

    if (!classExists) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      )
    }

    const newStudent = await prisma.student.create({
      data: {
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        classId,
        diagnoses: JSON.stringify(diagnoses || []),
        strengths: JSON.stringify(strengths || []),
        challenges: JSON.stringify(challenges || []),
        interests: JSON.stringify(interests || []),
        sensoryNeeds: JSON.stringify(sensoryNeeds || []),
        communicationStyle: communicationStyle || '',
        supportStrategies: JSON.stringify(supportStrategies || []),
        triggers: JSON.stringify(triggers || []),
        calmingStrategies: JSON.stringify(calmingStrategies || [])
      },
      include: {
        class: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(transformStudent(newStudent), { status: 201 })
  } catch (error) {
    console.error('Error creating student:', error)
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    )
  }
}
