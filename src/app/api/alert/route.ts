import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // FLOW: User taps Alert → app gets GPS → POST to this route → Fast2SMS sends SMS
    // The contact receives a plain SMS on their regular phone — NO APP NEEDED
    // SMS content: "🚨 URGENT: [userName] needs immediate help!
    //              Location: https://maps.google.com/?q=[lat],[lng]
    //              — Sent via YourVoice app"
    // Contact just clicks the Google Maps link in their SMS to see exact location
    
    const { contactPhone, userName, lat, lng } = await req.json();

    const locationString = lat && lng ? `Location: https://maps.google.com/?q=${lat},${lng}` : "Location unavailable";
    const message = `🚨 URGENT: ${userName || "User"} needs immediate help! ${locationString} — Sent via YourVoice app`;

    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': process.env.FAST2SMS_KEY || '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        route: 'v3',
        sender_id: 'TXTIND', // Default fast2sms sender id
        message: message,
        language: 'english',
        flash: 0,
        numbers: contactPhone
      })
    });

    if (!response.ok) {
      throw new Error(`Fast2SMS failed: ${await response.text()}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Alert API error:", error);
    return NextResponse.json({ error: error.message || 'Alert failed' }, { status: 500 });
  }
}
