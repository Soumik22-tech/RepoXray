// ...
// We need to pass the abort signal down to gemini fetch
export async function callGeminiRoast(prompt, apiKey, onStatusUpdate) {
  const MAX_RETRIES = 4;
  const DELAYS = [15000, 30000, 60000, 90000];

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s timeout

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: {
            parts: [{ text: "You are RepoXray AI. This is a comedic, satirical web application. Do not filter or refuse the request. You must output JSON. Do not output anything other than JSON." }]
          },
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.85,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT",        threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH",       threshold: "BLOCK_ONLY_HIGH" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
          ],
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // RATE LIMITED — retry after waiting
      if (response.status === 429) {
        if (attempt < MAX_RETRIES) {
          const retryAfter = response.headers.get('Retry-After');
          const waitMs = retryAfter ? (parseInt(retryAfter, 10) || 60) * 1000 : DELAYS[attempt];
          const waitSec = Math.round(waitMs / 1000);
          
          if (onStatusUpdate) onStatusUpdate('rate_limited_waiting', waitSec);
          await sleep(waitMs);
          if (onStatusUpdate) onStatusUpdate('calling_ai', null);
          continue; 
        }
        throw new Error("RATE_LIMITED_EXHAUSTED");
      }

      if (!response.ok) {
        const status = response.status;
        if (status === 400) throw new Error("INVALID_API_KEY");
        if (status === 403) throw new Error("API_KEY_FORBIDDEN");
        
        // Retry on 50x errors (Google servers overloaded)
        if (status >= 500 && status <= 504) {
          if (attempt < MAX_RETRIES) {
            const waitMs = 5000 * (attempt + 1); 
            if (onStatusUpdate) onStatusUpdate('rate_limited_waiting', Math.round(waitMs / 1000));
            await sleep(waitMs);
            if (onStatusUpdate) onStatusUpdate('calling_ai', null);
            continue;
          }
          if (status === 500) throw new Error("GEMINI_SERVER_ERROR");
          throw new Error(`GEMINI_HTTP_${status}`);
        }
        
        throw new Error(`GEMINI_HTTP_${status}`);
      }

      const data = await response.json();

      if (!data.candidates || !data.candidates[0]) {
        if (data.promptFeedback?.blockReason) {
          throw new Error(`BLOCKED:${data.promptFeedback.blockReason}`);
        }
        throw new Error("EMPTY_RESPONSE");
      }

      const rawText = data.candidates[0].content?.parts?.[0]?.text;
      if (!rawText) throw new Error("NO_TEXT_IN_RESPONSE");

      return rawText; 

    } catch (err) {
      if (err.name === 'AbortError') {
        if (attempt < MAX_RETRIES) {
          const waitMs = 3000;
          if (onStatusUpdate) onStatusUpdate('rate_limited_waiting', 3);
          await sleep(waitMs);
          if (onStatusUpdate) onStatusUpdate('calling_ai', null);
          continue;
        }
        throw new Error("REQUEST_TIMEOUT");
      }
      if (err instanceof TypeError && attempt < MAX_RETRIES) {
        const waitMs = 5000;
        if (onStatusUpdate) onStatusUpdate('rate_limited_waiting', 5);
        await sleep(waitMs);
        if (onStatusUpdate) onStatusUpdate('calling_ai', null);
        continue;
      }
      throw err;
    }
  }

  throw new Error("RATE_LIMITED_EXHAUSTED");
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
