import { NextRequest, NextResponse } from 'next/server';

const ARASAAC_API = 'https://api.arasaac.org/v1/pictograms/en/bestsearch';
const ARASAAC_IMG = 'https://static.arasaac.org/pictograms';

// GET /api/pictogram-search?q=listen&limit=20
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);

    if (!query || !query.trim()) {
      return NextResponse.json(
        { error: 'Search query is required (?q=...)' },
        { status: 400 }
      );
    }

    const res = await fetch(
      `${ARASAAC_API}/${encodeURIComponent(query.trim().toLowerCase())}`,
      { signal: AbortSignal.timeout(8000) }
    );

    if (!res.ok) {
      return NextResponse.json({ results: [] });
    }

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ results: [] });
    }

    // Sort: AAC-flagged first, then schematic, then others
    const sorted = [...data].sort((a, b) => {
      if (a.aac && !b.aac) return -1;
      if (!a.aac && b.aac) return 1;
      if (a.schematic && !b.schematic) return -1;
      if (!a.schematic && b.schematic) return 1;
      return 0;
    });

    const results = sorted.slice(0, limit).map((item) => ({
      id: item._id,
      url: `${ARASAAC_IMG}/${item._id}/${item._id}_500.png`,
      keywords: (item.keywords || [])
        .map((k: { keyword: string }) => k.keyword)
        .slice(0, 5),
      categories: item.categories || [],
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Pictogram search error:', error);
    return NextResponse.json({ results: [] });
  }
}
