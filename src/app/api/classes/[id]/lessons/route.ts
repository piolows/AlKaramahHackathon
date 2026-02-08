import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all lessons for a class (ordered by newest first)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: classId } = await params;

    const lessons = await prisma.lesson.findMany({
      where: { classId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        curriculumArea: true,
        lessonTopic: true,
        learningObjective: true,
        content: true,
        visualSchedule: true,
        createdAt: true,
      },
    });

    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}

// POST create a new lesson for a class
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: classId } = await params;
    const body = await request.json();
    const { curriculumArea, lessonTopic, learningObjective, additionalNotes, content } = body;

    if (!content || !lessonTopic || !learningObjective) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const lesson = await prisma.lesson.create({
      data: {
        classId,
        curriculumArea: curriculumArea || '',
        lessonTopic,
        learningObjective,
        additionalNotes: additionalNotes || null,
        content,
      },
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    console.error('Error saving lesson:', error);
    return NextResponse.json(
      { error: 'Failed to save lesson' },
      { status: 500 }
    );
  }
}
