import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const sarvamKeyMatch = envContent.match(/SARVAM_API_KEY=(.*)/);
const sarvamKey = sarvamKeyMatch ? sarvamKeyMatch[1].trim() : '';

async function test() {
  console.log("Testing Sarvam Translate API...");
  
  const payload = {
    input: "i am hungry",
    source_language_code: "en-IN",
    target_language_code: "mr-IN",
    speaker_gender: "Female",
    mode: "classic-colloquial",
    model: "mayura:v1",
    enable_preprocessing: true
  };

  const response = await fetch('https://api.sarvam.ai/translate', {
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
    const data = await response.json();
    console.log("SARVAM API TEST SUCCESS", data);
  }
}

test();
