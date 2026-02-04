import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all classes with student count
export async function GET() {
  try {
    const classes = await prisma.class.findMany({
      include: {
        _count: {
          select: { students: true }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    // Transform to include studentCount
    const result = classes.map(c => ({
      id: c.id,
      name: c.name,
      description: c.description,
      ageRange: c.ageRange,
      studentCount: c._count.students,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching classes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch classes' },
      { status: 500 }
    )
  }
}

// POST create new class
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, ageRange } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Class name is required' },
        { status: 400 }
      )
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        description: description || null,
        ageRange: ageRange || null
      }
    })

    return NextResponse.json(newClass, { status: 201 })
  } catch (error) {
    console.error('Error creating class:', error)
    return NextResponse.json(
      { error: 'Failed to create class' },
      { status: 500 }
    )
  }
}
