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
  teacherNotes: string
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
    teacherNotes: student.teacherNotes || '',
    createdAt: student.createdAt,
    updatedAt: student.updatedAt
  }
}

// GET single student by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        class: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(transformStudent(student))
  } catch (error) {
    console.error('Error fetching student:', error)
    return NextResponse.json(
      { error: 'Failed to fetch student' },
      { status: 500 }
    )
  }
}

// PUT update student
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
      calmingStrategies,
      teacherNotes
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

    const updatedStudent = await prisma.student.update({
      where: { id },
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
        calmingStrategies: JSON.stringify(calmingStrategies || []),
        teacherNotes: teacherNotes || ''
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

    return NextResponse.json(transformStudent(updatedStudent))
  } catch (error) {
    console.error('Error updating student:', error)
    return NextResponse.json(
      { error: 'Failed to update student' },
      { status: 500 }
    )
  }
}

// DELETE student
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    // Delete student (this will cascade delete progress records)
    await prisma.student.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Student deleted successfully' })
  } catch (error) {
    console.error('Error deleting student:', error)
    return NextResponse.json(
      { error: 'Failed to delete student' },
      { status: 500 }
    )
  }
}
