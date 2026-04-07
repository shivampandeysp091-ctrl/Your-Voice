
async function run() {
  const apiKey = 'sk_shkuqcqf_Mg5UBMUC3wNBic85PcjKN032';

  const r = await fetch('https://api.sarvam.ai/translate', {
    method: 'POST',
    headers: {
      'api-subscription-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: "hello kaisa hai bhai maje me",
      source_language_code: 'en-IN',
      target_language_code: 'en-IN', // what if we wanna translate to 'mr-IN'?
      speaker_gender: 'Male',
      mode: 'classic-colloquial',
      model: 'mayura:v1',
      enable_preprocessing: true,
    })
  });
  
  if (r.ok) {
    const data = await r.json();
    console.log("English Target:", data);
  } else {
    console.log("Error:", await r.text());
  }

  const r2 = await fetch('https://api.sarvam.ai/translate', {
    method: 'POST',
    headers: {
      'api-subscription-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: "hello kaisa hai bhai maje me",
      source_language_code: 'hi-IN', // maybe source should be hi-IN?
      target_language_code: 'en-IN',
      speaker_gender: 'Male',
      mode: 'classic-colloquial',
      model: 'mayura:v1',
      enable_preprocessing: true,
    })
  });
  
  if (r2.ok) {
    const data = await r2.json();
    console.log("Hinglish input source hi-IN, to English:", data);
  } else {
    console.log("Error:", await r2.text());
  }
}

run();
