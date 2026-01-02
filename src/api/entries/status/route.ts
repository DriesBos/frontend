import { NextResponse } from 'next/server';
import { mfFetch } from '@/lib/miniflux';

export async function POST(req: Request) {
  const body = await req.json();
  const entry_ids: number[] = body.entry_ids ?? [];
  const status: 'read' | 'unread' = body.status;

  if (!Array.isArray(entry_ids) || entry_ids.length === 0) {
    return NextResponse.json({ error: 'entry_ids required' }, { status: 400 });
  }
  if (status !== 'read' && status !== 'unread') {
    return NextResponse.json(
      { error: 'status must be read|unread' },
      { status: 400 }
    );
  }

  await mfFetch<void>('/v1/entries', {
    method: 'PUT',
    body: JSON.stringify({ entry_ids, status }),
  });

  return NextResponse.json({ ok: true });
}
