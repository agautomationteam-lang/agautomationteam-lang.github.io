import { NextResponse } from 'next/server';
import { fetchVapi } from '@/lib/api';

export async function GET() {
  try {
    const data = await fetchVapi('/call');
    return NextResponse.json({
      connected: true,
      count: Array.isArray(data) ? data.length : 0,
      calls: Array.isArray(data) ? data.slice(0, 50).map((c: any) => ({
        id: c.id,
        status: c.status,
        direction: c.direction,
        assistant: c.assistant?.name || c.assistantId || 'Unknown',
        phone: c.customer?.number || c.phoneNumber || '',
        startedAt: c.startedAt,
        endedAt: c.endedAt,
        duration: c.duration || 0,
        recordingUrl: c.recordingUrl || '',
        transcript: c.transcript || '',
        cost: c.cost || 0,
        messages: c.messages?.length || 0,
      })) : [],
    });
  } catch (err: any) {
    return NextResponse.json(
      { connected: false, error: err.message, calls: [] },
      { status: 200 }
    );
  }
}
