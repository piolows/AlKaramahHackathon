import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single class by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const lang = searchParams.get('lang')

    // When Arabic, read display data from translated tables
    if (lang === 'ar') {
      const classRows: any[] = await prisma.$queryRawUnsafe(`
        SELECT * FROM ClassTranslated WHERE id = '${id}' LIMIT 1
      `)
      if (classRows.length === 0) {
        return NextResponse.json(
          { error: 'Class not found' },
          { status: 404 }
        )
      }
      const studentRows: any[] = await prisma.$queryRawUnsafe(`
        SELECT id, firstName, lastName, dateOfBirth
        FROM StudentTranslated WHERE classId = '${id}'
      `)
      const c = classRows[0]
      return NextResponse.json({
        id: c.id,
        name: c.name,
        description: c.description,
        ageRange: c.ageRange,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        students: studentRows,
        studentCount: studentRows.length,
        _count: { students: studentRows.length }
      })
    }
    
    const classData = await prisma.class.findUnique({
      where: { id },
      include: {
        students: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true
          }
        },
        _count: {
          select: { students: true }
        }
      }
    })

    if (!classData) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...classData,
      studentCount: classData._count.students
    })
  } catch (error) {
    console.error('Error fetching class:', error)
    return NextResponse.json(
      { error: 'Failed to fetch class' },
      { status: 500 }
    )
  }
}

// PUT update class
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, description, ageRange } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Class name is required' },
        { status: 400 }
      )
    }

    const updatedClass = await prisma.class.update({
      where: { id },
      data: {
        name,
        description: description || null,
        ageRange: ageRange || null
      }
    })

    return NextResponse.json(updatedClass)
  } catch (error) {
    console.error('Error updating class:', error)
    return NextResponse.json(
      { error: 'Failed to update class' },
      { status: 500 }
    )
  }
}

// DELETE class
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if class has students
    const classData = await prisma.class.findUnique({
      where: { id },
      include: {
        _count: {
          select: { students: true }
        }
      }
    })

    if (!classData) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      )
    }

    if (classData._count.students > 0) {
      return NextResponse.json(
        { error: 'Cannot delete class with students. Please move or delete students first.' },
        { status: 400 }
      )
    }

    await prisma.class.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Class deleted successfully' })
  } catch (error) {
    console.error('Error deleting class:', error)
    return NextResponse.json(
      { error: 'Failed to delete class' },
      { status: 500 }
    )
  }
}
