import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all progress for a student
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: studentId } = await params
    
    // Verify student exists
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    const progress = await prisma.studentProgress.findMany({
      where: { studentId },
      orderBy: {
        subcategoryId: 'asc'
      }
    })

    // Transform to a map keyed by subcategoryId for easy frontend usage
    const progressMap: Record<string, {
      id: string
      level: number
      completed: boolean
      plan: string | null
      updatedAt: Date
    }> = {}

    progress.forEach(p => {
      progressMap[p.subcategoryId] = {
        id: p.id,
        level: p.level,
        completed: p.completed,
        plan: p.plan,
        updatedAt: p.updatedAt
      }
    })

    return NextResponse.json(progressMap)
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}

// PUT update or create progress for a specific subcategory
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: studentId } = await params
    const body = await request.json()
    const { subcategoryId, level, completed, plan } = body

    if (!subcategoryId) {
      return NextResponse.json(
        { error: 'subcategoryId is required' },
        { status: 400 }
      )
    }

    // Verify student exists
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    // Upsert progress record
    const progress = await prisma.studentProgress.upsert({
      where: {
        studentId_subcategoryId: {
          studentId,
          subcategoryId
        }
      },
      update: {
        level: level !== undefined ? level : undefined,
        completed: completed !== undefined ? completed : undefined,
        plan: plan !== undefined ? plan : undefined
      },
      create: {
        studentId,
        subcategoryId,
        level: level || 0,
        completed: completed || false,
        plan: plan || null
      }
    })

    return NextResponse.json({
      subcategoryId: progress.subcategoryId,
      level: progress.level,
      completed: progress.completed,
      plan: progress.plan,
      updatedAt: progress.updatedAt
    })
  } catch (error) {
    console.error('Error updating progress:', error)
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    )
  }
}

// DELETE remove plan for a specific subcategory
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: studentId } = await params
    const { searchParams } = new URL(request.url)
    const subcategoryId = searchParams.get('subcategoryId')

    if (!subcategoryId) {
      return NextResponse.json(
        { error: 'subcategoryId is required' },
        { status: 400 }
      )
    }

    // Update progress to remove plan (set to null)
    const progress = await prisma.studentProgress.update({
      where: {
        studentId_subcategoryId: {
          studentId,
          subcategoryId
        }
      },
      data: {
        plan: null
      }
    })

    return NextResponse.json({
      message: 'Plan deleted successfully',
      subcategoryId: progress.subcategoryId
    })
  } catch (error) {
    console.error('Error deleting plan:', error)
    return NextResponse.json(
      { error: 'Failed to delete plan' },
      { status: 500 }
    )
  }
}
