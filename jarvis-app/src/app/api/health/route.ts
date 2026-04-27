import { NextResponse } from 'next/server';
import { fetchVapi, fetchTwilio, fetchN8n, fetchOpenAI } from '@/lib/api';

export async function GET() {
  const results = {
    vapi: { status: 'unknown', latency: 0, error: '' },
    twilio: { status: 'unknown', latency: 0, error: '' },
    n8n: { status: 'unknown', latency: 0, error: '' },
    openai: { status: 'unknown', latency: 0, error: '' },
  };

  // Check Vapi
  const vstart = Date.now();
  try {
    await fetchVapi('/assistant');
    results.vapi = { status: 'online', latency: Date.now() - vstart, error: '' };
  } catch (e: any) {
    results.vapi = { status: 'offline', latency: Date.now() - vstart, error: e.message };
  }

  // Check Twilio
  const tstart = Date.now();
  try {
    await fetchTwilio('/IncomingPhoneNumbers.json');
    results.twilio = { status: 'online', latency: Date.now() - tstart, error: '' };
  } catch (e: any) {
    results.twilio = { status: 'offline', latency: Date.now() - tstart, error: e.message };
  }

  // Check n8n
  const nstart = Date.now();
  try {
    await fetchN8n('/workflows');
    results.n8n = { status: 'online', latency: Date.now() - nstart, error: '' };
  } catch (e: any) {
    results.n8n = { status: 'offline', latency: Date.now() - nstart, error: e.message };
  }

  // Check OpenAI
  const ostart = Date.now();
  try {
    const ok = await fetchOpenAI();
    results.openai = { status: ok ? 'online' : 'offline', latency: Date.now() - ostart, error: '' };
  } catch (e: any) {
    results.openai = { status: 'offline', latency: Date.now() - ostart, error: e.message };
  }

  return NextResponse.json(results);
}
