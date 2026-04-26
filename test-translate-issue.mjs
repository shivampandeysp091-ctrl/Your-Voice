
async function run() {
  const apiKey = 'sk_shkuqcqf_Mg5UBMUC3wNBic85PcjKN032';

  const testTranslation = async (inputStr, target) => {
    const r = await fetch('https://api.sarvam.ai/translate', {
      method: 'POST',
      headers: {
        'api-subscription-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: inputStr,
        source_language_code: target === 'hi-IN' ? 'en-IN' : 'hi-IN',
        target_language_code: target, 
        speaker_gender: 'Female',
        mode: 'classic-colloquial',
        model: 'mayura:v1',
        enable_preprocessing: true,
      })
    });
    
    if (r.ok) {
      const data = await r.json();
      console.log(`[hi-IN -> ${target}] Input: "${inputStr}"  => Output:`, data.translated_text);
    } else {
      console.log("Error:", await r.text());
    }
  };

  await testTranslation("kaha ho", "mr-IN");
  await testTranslation("I am hungry", "en-IN");
}

run();
