import { NextResponse } from 'next/server';
import { fetchVapi } from '@/lib/api';

export async function GET() {
  try {
    const data = await fetchVapi('/assistant');
    return NextResponse.json({
      connected: true,
      count: Array.isArray(data) ? data.length : 0,
      agents: Array.isArray(data) ? data.map((a: any) => ({
        id: a.id,
        name: a.name || 'Unnamed Agent',
        voice: a.voice?.voiceId || a.voice?.provider || 'default',
        model: a.model?.model || 'unknown',
        status: a.status || 'active',
        firstMessage: a.firstMessage || '',
        createdAt: a.createdAt,
      })) : [],
    });
  } catch (err: any) {
    return NextResponse.json(
      { connected: false, error: err.message, agents: [] },
      { status: 200 }
    );
  }
}
