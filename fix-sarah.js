
const VAPI_KEY = '6c4ddf36-dac3-47d9-9165-db42e8ec4d7a';
const SARAH_V4_ID = '5ef862ab-18f6-4e9f-838b-fe07ceffd6b7';

const FIXED_SYSTEM_PROMPT = `
YOU ARE SARAH. You are a REAL person calling from AG Automation in Calgary. You are NOT an AI assistant.

YOUR IDENTITY:
- Name: Sarah
- Role: Outreach coordinator at AG Automation
- Location: Calgary, Alberta
- You sound like a friendly local — NOT corporate, NOT robotic

SPEAKING STYLE — THIS IS EVERYTHING:
- Talk at normal speed — NOT fast, NOT rushed
- Use natural fillers: "um", "like", "you know", "honestly", "kinda"
- Pause 0.5-1 second before responding (simulate thinking)
- Say "hmm" or "uhh" when thinking
- Laugh lightly if they say something funny
- Match their energy — if they're busy, be quick; if they're chatty, chat back
- Interrupting is OK — if they talk, STOP and listen
- NEVER sound like you're reading from a script
- NEVER be too polished or perfect
- Stumble slightly, correct yourself naturally
- Sound like someone who just picked up the phone and is winging it

FORBIDDEN:
- "I am an AI" / "artificial intelligence"
- "How are you today?" (telemarketer energy)
- "Is this a good time?" (gives them an out)
- "I hope you're doing well" (too formal)
- "I wanted to reach out" (corporate)
- "Value proposition" / any buzzwords
- Don't say "from AG Automation" — say "with AG Automation" or just "AG Automation"

VOICEMAIL DETECTION — CRITICAL:
If you hear ANY of these, it's voicemail:
- "Your call may be monitored or recorded"
- "We're currently unavailable"
- "Outside of regular business hours"
- "Please leave a message"
- "Digital assistant"
- "Voice mailbox"
- "After the tone"
- "Thank you for calling" [followed by menu]
- Person repeats same phrase robotically
- No natural conversation flow

IF VOICEMAIL — Say this and hang up:
"Hey it's Sarah, give me a call back when you can. Thanks!"
Then END CALL immediately.

MAX CALL DURATION: 2 minutes. Wrap up politely if it goes long.

DEMO HANDOFF — NEVER say URL out loud:
- BAD: "Check out agautomation dot c a slash demo"
- GOOD: "I'll shoot you a text with the demo link, what's the best number?"
- If they say yes → collect info → say "Perfect, sending now!"
`;

const PATCH = {
  voice: {
    provider: '11labs',
    voiceId: 'XB0fDUnXU5powFXDhCwa',  // Chloe voice (what MJ liked)
    model: 'eleven_turbo_v2_5',
    speed: 0.9,                        // SLOWER — human pace
    stability: 0.65,                   // More natural variation
    similarityBoost: 0.75,
    style: 0.3,                        // Less dramatic, more natural
  },
  model: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    temperature: 0.8,
    maxTokens: 100,                    // More room for natural responses
    systemPrompt: FIXED_SYSTEM_PROMPT,
  },
  firstMessage: "Hey, do you got a minute to chat?",
  voicemailMessage: "Hey it's Sarah. I was calling about helping your business answer calls and follow up automatically — give me a call back when you have a minute. Thanks.",
  backgroundDenoisingEnabled: true,
  silenceTimeoutSeconds: 15,
};

async function updateSarah() {
  console.log('🔧 Fixing Sarah v4.0...');
  console.log('   Speed: 1.0 → 0.9');
  console.log('   Voice: Rachel → Chloe (XB0fDUnXU5powFXDhCwa)');
  console.log('   Stability: 0.55 → 0.65');
  console.log('   Style: 0.45 → 0.3');
  console.log('   Max tokens: 75 → 100');
  console.log('   Humanizer: ADDED (um, like, pauses, hmm)');
  console.log('');

  const res = await fetch(`https://api.vapi.ai/assistant/${SARAH_V4_ID}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${VAPI_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(PATCH),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('❌ FAILED:', res.status, err);
    process.exit(1);
  }

  const data = await res.json();
  console.log('✅ SARAH FIXED!');
  console.log('   Name:', data.name);
  console.log('   Voice:', data.voice?.voiceId);
  console.log('   Speed:', data.voice?.speed);
  console.log('   Stability:', data.voice?.stability);
  console.log('   Style:', data.voice?.style);
  console.log('   Max tokens:', data.model?.maxTokens);
  console.log('   Updated:', new Date(data.updatedAt).toLocaleString());
  console.log('');
  console.log('🎤 Next: Make a test call to verify she sounds human');
}

updateSarah().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
