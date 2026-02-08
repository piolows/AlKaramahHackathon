import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all custom cards
export async function GET() {
  try {
    const cards = await prisma.customCard.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        imageData: true,
        createdAt: true,
      },
    });

    return NextResponse.json(cards);
  } catch (error) {
    console.error('Error fetching custom cards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch custom cards' },
      { status: 500 }
    );
  }
}

// POST create a new custom card (upload image)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, imageData } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Card name is required' },
        { status: 400 }
      );
    }

    if (!imageData) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    // Validate it's a data URI
    if (!imageData.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Invalid image format. Must be a data URI (data:image/...)' },
        { status: 400 }
      );
    }

    // Limit size to ~2MB (base64 is ~1.37x the binary size)
    if (imageData.length > 3_000_000) {
      return NextResponse.json(
        { error: 'Image too large. Maximum size is ~2MB.' },
        { status: 400 }
      );
    }

    const card = await prisma.customCard.create({
      data: {
        name: name.trim(),
        imageData,
      },
    });

    return NextResponse.json(card, { status: 201 });
  } catch (error) {
    console.error('Error creating custom card:', error);
    return NextResponse.json(
      { error: 'Failed to create custom card' },
      { status: 500 }
    );
  }
}
