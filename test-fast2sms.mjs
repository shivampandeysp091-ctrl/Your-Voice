
async function test() {
  const message = `🚨 URGENT: Test User needs immediate help! Location unavailable — Sent via YourVoice app`;
  const contactPhone = "9999999999"; // placeholder, fast2sms will just return failure if number is invalid, but structure might be ok OR we should test with user's number. Actually we can just hit the API and see the response schema. Wait, if fast2sms fails, it gives detailed error texts. let's see.

  const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
    method: 'POST',
    headers: {
      'authorization': 'LytPnU28e3pBIDNM0KWQZaTRVkqbv69YoOhEsl7z4SmgrFwdHfP3TOwj2SuDfN1goRaI6b8ziCAL7kQJ',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      route: 'v3',
      sender_id: 'TXTIND',
      message: message,
      language: 'english',
      flash: 0,
      numbers: contactPhone
    })
  });

  const data = await response.text();
  console.log("Status:", response.status);
  console.log("Data:", data);
}

test();
