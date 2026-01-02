import { NextResponse } from 'next/server';
import { mfFetch } from '@/lib/miniflux';

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: 'invalid id' }, { status: 400 });
  }

  await mfFetch<void>(`/v1/entries/${id}/bookmark`, { method: 'PUT' });
  return NextResponse.json({ ok: true });
}
