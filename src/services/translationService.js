export async function translateTexts(language, texts) {
  const uniqueTexts = [...new Set(texts.filter((text) => typeof text === 'string' && text.trim()))];
  if (!uniqueTexts.length) return {};

  const batches = [];
  for (let index = 0; index < uniqueTexts.length; index += 40) {
    batches.push(uniqueTexts.slice(index, index + 40));
  }

  const translatedBatches = await Promise.all(batches.map(async (batch) => {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language, texts: batch })
    });

    if (!response.ok) {
      throw new Error(`Translation API failed with HTTP ${response.status}`);
    }

    const payload = await response.json();
    if (!Array.isArray(payload.data)) throw new Error('Translation API returned invalid data');
    return payload.data;
  }));

  return Object.fromEntries(translatedBatches.flat().map(({ source, translated }) => [source, translated]));
}
