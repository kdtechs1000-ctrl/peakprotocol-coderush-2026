const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

function json(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json').send(JSON.stringify(body));
}

function parseJson(text) {
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error('Translation provider returned invalid JSON');
  return JSON.parse(match[0]);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: { code: 'METHOD_NOT_ALLOWED', message: 'Use POST.' } });
  }

  let body = {};
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  } catch {
    return json(res, 400, {
      error: { code: 'INVALID_JSON', message: 'Request body must be valid JSON.' }
    });
  }

  const { language, texts } = body;
  if (!['en', 'np'].includes(language) || !Array.isArray(texts) || texts.length === 0 || texts.length > 40) {
    return json(res, 422, {
      error: {
        code: 'VALIDATION_ERROR',
        message: 'language must be en or np and texts must contain 1 to 40 items.'
      }
    });
  }

  if (texts.some((text) => typeof text !== 'string' || text.length > 500)) {
    return json(res, 422, {
      error: { code: 'VALIDATION_ERROR', message: 'Each text must be a string of 500 characters or fewer.' }
    });
  }

  if (language === 'en') {
    return json(res, 200, { data: texts.map((source) => ({ source, translated: source })) });
  }

  if (!GEMINI_API_KEY) {
    return json(res, 503, {
      error: { code: 'TRANSLATION_UNAVAILABLE', message: 'Translation provider is not configured.' }
    });
  }

  const prompt = `Translate each emergency response text from English to natural, concise Nepali.\nPreserve numbers, units, place names, URLs, and proper nouns. Return ONLY a JSON array of objects with source and translated fields, in the same order.\nTexts:\n${JSON.stringify(texts)}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, responseMimeType: 'application/json' }
        })
      }
    );

    if (!response.ok) {
      return json(res, 502, { error: { code: 'TRANSLATION_PROVIDER_ERROR', message: 'Translation provider request failed.' } });
    }

    const payload = await response.json();
    const candidateText = payload?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const translated = parseJson(candidateText);
    if (!Array.isArray(translated) || translated.length !== texts.length) throw new Error('Invalid translation count');

    const data = translated.map((item, index) => ({
      source: texts[index],
      translated: typeof item?.translated === 'string' && item.translated.trim()
        ? item.translated.trim()
        : texts[index]
    }));

    return json(res, 200, { data });
  } catch (error) {
    console.error('Translation API error:', error.message);
    return json(res, 502, { error: { code: 'TRANSLATION_PROVIDER_ERROR', message: 'Translation response was invalid.' } });
  }
}
