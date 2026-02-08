import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all student progress for an entire class in one query
// Returns: { [studentId]: { [subcategoryId]: { level, completed, plan } } }
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: classId } = await params;

    // Single query: get all progress records for all students in this class
    const allProgress = await prisma.studentProgress.findMany({
      where: {
        student: { classId },
      },
      select: {
        studentId: true,
        subcategoryId: true,
        level: true,
        completed: true,
        plan: true,
      },
    });

    // Group by studentId
    const progressMap: Record<string, Record<string, { level: number; completed: boolean; plan: string | null }>> = {};

    for (const p of allProgress) {
      if (!progressMap[p.studentId]) {
        progressMap[p.studentId] = {};
      }
      progressMap[p.studentId][p.subcategoryId] = {
        level: p.level,
        completed: p.completed,
        plan: p.plan,
      };
    }

    return NextResponse.json(progressMap);
  } catch (error) {
    console.error('Error fetching class progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch class progress' },
      { status: 500 }
    );
  }
}
