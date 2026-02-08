import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE a specific lesson
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; lessonId: string }> }
) {
  try {
    const { lessonId } = await params;

    await prisma.lesson.delete({
      where: { id: lessonId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return NextResponse.json(
      { error: 'Failed to delete lesson' },
      { status: 500 }
    );
  }
}

// PATCH update a lesson's content
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; lessonId: string }> }
) {
  try {
    const { lessonId } = await params;
    const body = await request.json();
    const { content, visualSchedule } = body;

    if (!content && visualSchedule === undefined) {
      return NextResponse.json(
        { error: 'Content or visualSchedule is required' },
        { status: 400 }
      );
    }

    const updateData: { content?: string; visualSchedule?: string | null } = {};
    if (content) updateData.content = content;
    if (visualSchedule !== undefined) updateData.visualSchedule = visualSchedule;

    const lesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: updateData,
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

    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Error updating lesson:', error);
    return NextResponse.json(
      { error: 'Failed to update lesson' },
      { status: 500 }
    );
  }
}
