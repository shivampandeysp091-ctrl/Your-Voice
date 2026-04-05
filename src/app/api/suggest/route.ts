import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { text, language } = await req.json();

    // DEBUG — check key exists
    console.log('=== SUGGEST API ===');
    console.log('Gemini key exists:', !!process.env.GEMINI_API_KEY);
    console.log('Gemini key start:', process.env.GEMINI_API_KEY?.substring(0, 8));
    console.log('Text received:', text);
    console.log('==================');

    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY missing from .env.local');
      // Return hardcoded suggestions so app doesn't break
      return NextResponse.json({
        suggestions: [
          'I need help',
          'I am hungry',
          'I feel sick',
          'Call a doctor',
          'Thank you',
          'Where is the restroom?'
        ]
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Use flash model — fastest and free
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash'  // more stable than 2.5-flash
    });

    const prompt = `You are an assistive communication helper for speech-impaired users in India.
The user has typed: "${text}"
Their selected language is: ${language}

Suggest 6 short helpful phrases they might want to say next.
Rules:
- Keep each phrase under 8 words
- Make them natural and conversational  
- Relevant to what they typed
- Return ONLY a JSON array of 6 strings
- No explanation, no markdown, no code blocks
- Example format: ["phrase1","phrase2","phrase3","phrase4","phrase5","phrase6"]`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    
    console.log('Gemini raw response:', responseText);

    // Clean the response and parse JSON safely
    const cleaned = responseText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    let suggestions: string[];
    try {
      suggestions = JSON.parse(cleaned);
      if (!Array.isArray(suggestions)) throw new Error('Not array');
    } catch {
      // If parsing fails, extract strings manually
      suggestions = cleaned
        .split('\n')
        .filter(line => line.trim().length > 0)
        .slice(0, 6)
        .map(line => line.replace(/^[-*"'\d.)\s]+/, '').replace(/["',]+$/, '').trim())
        .filter(s => s.length > 0);
    }

    console.log('✅ Suggestions:', suggestions);
    return NextResponse.json({ suggestions: suggestions.slice(0, 6) });

  } catch (error: any) {
    console.error('Suggest API error:', error.message);
    
    // Always return fallback suggestions — never let the app crash
    return NextResponse.json({
      suggestions: [
        'I need help',
        'I am hungry', 
        'I feel sick',
        'I need a doctor',
        'Thank you',
        'Please help me'
      ]
    });
  }
}