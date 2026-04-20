export function parseRoastResponse(rawText) {
  let cleaned = rawText.trim();
  cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
  cleaned = cleaned.replace(/^```\s*/i, '').replace(/```\s*$/i, '');

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        parsed = JSON.parse(match[0]);
      } catch (e2) {
        console.error("PARSE_FAILED on extracted match. Raw text was:", rawText);
        throw new Error("PARSE_FAILED");
      }
    } else {
      console.error("NO_JSON_FOUND. Raw text was:", rawText);
      throw new Error("NO_JSON_FOUND");
    }
  }

  const required = ['overallScore', 'grades', 'roasts', 'redeeming', 'verdict', 'roastTitle'];
  for (const field of required) {
    if (parsed[field] === undefined) throw new Error(`MISSING_FIELD:${field}`);
  }

  parsed.overallScore = Math.max(0, Math.min(100, Math.round(Number(parsed.overallScore))));

  if (!Array.isArray(parsed.grades) || parsed.grades.length !== 5) {
    throw new Error("INVALID_GRADES");
  }

  if (!Array.isArray(parsed.roasts) || parsed.roasts.length < 3) {
    throw new Error("INVALID_ROASTS");
  }

  parsed.grades = parsed.grades.map(g => ({
    ...g,
    score: Math.max(0, Math.min(100, Math.round(Number(g.score)))),
  }));

  parsed.roasts = parsed.roasts.slice(0, 5).map((r, i) => ({
    ...r,
    id: i + 1,
    severity: ['nuclear','high','medium'].includes(r.severity) ? r.severity : 'medium',
  }));

  return parsed;
}
