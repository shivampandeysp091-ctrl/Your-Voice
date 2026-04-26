async function run() {
  const apiKey = process.env.SARVAM_API_KEY || 'sk_shkuqcqf_Mg5UBMUC3wNBic85PcjKN032';

  const ttsRes = await fetch('https://api.sarvam.ai/text-to-speech', {
    method: 'POST',
    headers: {
      'api-subscription-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: ["મને ભૂખ લાગી છે"],
      target_language_code: "gu-IN",
      speaker: 'anushka',
      model: 'bulbul:v2',
      speech_sample_rate: 22050,
      enable_preprocessing: true,
      pace: 1.0,
    }),
  });

  if (!ttsRes.ok) {
    console.log("TTS Error:", await ttsRes.text());
  } else {
    console.log("TTS Success!");
  }
}

run();
