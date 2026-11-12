import { NextRequest, NextResponse } from 'next/server';
import { hasTmdbToken, searchTmdb } from '@/lib/tmdb';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') ?? '';

  if (!hasTmdbToken()) {
    return NextResponse.json(
      { error: 'TMDB access token is not configured. Add TMDB_ACCESS_TOKEN in Vercel environment variables.' },
      { status: 500 }
    );
  }

  if (!q.trim()) {
    return NextResponse.json({ results: [] }, { status: 200 });
  }

  try {
    const results = await searchTmdb(q, 12);
    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'TMDB search failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
