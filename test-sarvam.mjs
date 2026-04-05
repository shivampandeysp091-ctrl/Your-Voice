import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const sarvamKeyMatch = envContent.match(/SARVAM_API_KEY=(.*)/);
const sarvamKey = sarvamKeyMatch ? sarvamKeyMatch[1].trim() : '';

async function test() {
  console.log("Testing Sarvam API with key:", sarvamKey.slice(0, 4) + '...');
  
  const payload = {
    inputs: ["This is a test"],
    target_language_code: "hi-IN",
    speaker: "anushka",
    model: "bulbul:v1",
    speech_sample_rate: 8000,
    enable_preprocessing: true,
    pace: 1.0
  };

  const response = await fetch('https://api.sarvam.ai/text-to-speech', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'api-subscription-key': sarvamKey
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("SARVAM ERROR STATUS:", response.status);
    console.error("SARVAM ERROR TEXT:", errText);
  } else {
    console.log("SARVAM API TEST SUCCESS");
  }
}

test();
