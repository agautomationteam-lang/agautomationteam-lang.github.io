import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { agent, command, params } = await request.json();
    
    // Log the command
    console.log(`[COMMAND] ${agent}: ${command}`, params);
    
    // Here you would actually send to Vapi/Twilio/n8n
    // For now, return success with echo
    return NextResponse.json({
      success: true,
      command,
      agent,
      params,
      timestamp: new Date().toISOString(),
      message: `Command "${command}" queued for ${agent}`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}
