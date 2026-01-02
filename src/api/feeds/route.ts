import { NextResponse } from 'next/server';
import { mfFetch } from '@/lib/miniflux';

export async function GET() {
  const feeds = await mfFetch<any[]>('/v1/feeds');
  return NextResponse.json(feeds);
}
