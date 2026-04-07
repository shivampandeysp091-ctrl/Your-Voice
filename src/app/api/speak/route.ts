import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text, language, speed, gender } = await req.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: 'No text' }, { status: 400 });
    }

    const apiKey = process.env.SARVAM_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json({ fallback: true });
    }

    let textToSpeak = text;

    // ── STEP 1: Translate using Sarvam Mayura ──
    const isTargetEnglish = language === 'en-IN';
    const sourceLanguage = isTargetEnglish ? 'hi-IN' : 'en-IN';

    // We skip translation ONLY if they specifically want pure English to English
    if (language) {
      try {
        const translateRes = await fetch(
          'https://api.sarvam.ai/translate',
          {
            method: 'POST',
            headers: {
              'api-subscription-key': apiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              input: text,
              source_language_code: sourceLanguage,
              target_language_code: language,
              speaker_gender: gender === 'Male' ? 'Male' : 'Female',
              mode: 'classic-colloquial',
              model: 'mayura:v1',
              enable_preprocessing: true,
            }),
          }
        );

        if (translateRes.ok) {
          const translateData = await translateRes.json();
          const translated = translateData.translated_text;
          if (translated && translated.trim()) {
            textToSpeak = translated;
            console.log(`✅ Translated to ${language}:`, textToSpeak);
          }
        } else {
          const err = await translateRes.text();
          console.warn('Sarvam translate failed:', err);
        }
      } catch (translateErr) {
        console.warn('Translation error:', translateErr);
        // Continue with original text if translation fails
      }
    }

    // ── STEP 2: Speak the translated text ──
    const ttsRes = await fetch(
      'https://api.sarvam.ai/text-to-speech',
      {
        method: 'POST',
        headers: {
          'api-subscription-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: [textToSpeak],
          target_language_code: language || 'hi-IN',
          speaker: gender === 'Male' ? 'abhilash' : 'anushka',
          model: 'bulbul:v2',
          speech_sample_rate: 22050,
          enable_preprocessing: true,
          pace: parseFloat(speed) || 1.0,
        }),
      }
    );

    if (!ttsRes.ok) {
      const err = await ttsRes.text();
      console.error('Sarvam TTS failed:', ttsRes.status, err);
      return NextResponse.json({ fallback: true });
    }

    const ttsData = await ttsRes.json();
    const audio = ttsData.audios?.[0];

    if (!audio) {
      console.error('No audio in response');
      return NextResponse.json({ fallback: true });
    }

    console.log('✅ Sarvam TTS success, length:', audio.length);
    return NextResponse.json({
      audio,
      spokenText: textToSpeak,
    });

  } catch (err: any) {
    console.error('speak route error:', err.message);
    return NextResponse.json({ fallback: true });
  }
}