import { NextResponse } from 'next/server';
import { mfFetch } from '@/lib/miniflux';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // pass-through common query params
  const status = searchParams.get('status') ?? 'unread';
  const limit = searchParams.get('limit') ?? '50';
  const offset = searchParams.get('offset') ?? '0';
  const order = searchParams.get('order') ?? 'published_at';
  const direction = searchParams.get('direction') ?? 'desc';

  const qs = new URLSearchParams({ status, limit, offset, order, direction });
  const data = await mfFetch<any>(`/v1/entries?${qs.toString()}`);

  return NextResponse.json(data);
}
