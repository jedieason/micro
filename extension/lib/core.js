export const ORIGIN = 'https://microteaching.ntu.edu.tw';
export function isSite(value) {
  try { return [ORIGIN, 'http://microteaching.ntu.edu.tw:9002'].includes(new URL(value).origin); } catch { return false; }
}
export function viewerURL(value) {
  const url = new URL(value, ORIGIN);
  if (!isSite(url.href) || !/\/GestaltViewer\/?$/i.test(url.pathname) || !url.searchParams.get('wlGUID')) throw new Error('請貼上原站含 wlGUID 的完整 GestaltViewer 連結。');
  url.searchParams.delete('ntuExam');
  url.hash = '';
  return url.href;
}
export function code(value) {
  const match = String(value).trim().toUpperCase().match(/^([A-Z]+)(\d+)$/);
  if (!match) throw new Error(`代號格式不正確：${value}`);
  return match[1] + match[2].padStart(4, '0');
}
export function parseCodes(text) {
  const codes = [], invalid = [];
  for (const token of text.trim().split(/[\s,，;；]+/).filter(Boolean)) {
    const range = token.toUpperCase().match(/^([A-Z]+)(\d+)[–—-]([A-Z]+)?(\d+)$/);
    try {
      if (!range) codes.push(code(token));
      else {
        const [, prefix, start, endPrefix, end] = range;
        const a = Number(start), b = Number(end);
        if ((endPrefix && endPrefix !== prefix) || b < a || b - a > 1000) throw new Error();
        for (let i = a; i <= b; i++) codes.push(code(prefix + i));
      }
    } catch { invalid.push(token); }
  }
  return {codes: [...new Set(codes)], duplicates: codes.length - new Set(codes).size, invalid};
}
export function normalize(value) { return String(value).normalize('NFKC').trim().toLowerCase().replace(/\s+/g, ' '); }
export function matches(value, expected, aliases = []) {
  return !!normalize(value) && [expected, ...aliases].some(answer => normalize(answer) === normalize(value));
}
export function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; }
  return result;
}
export function ready(slide) { return !!(slide.organ?.trim() && slide.diagnosis?.trim() && slide.confirmed); }
export function grade(answer, slide) {
  const organ = matches(answer.organ, slide.organ, slide.organAliases);
  const diagnosis = matches(answer.diagnosis, slide.diagnosis, slide.diagnosisAliases);
  return {organ, diagnosis, grade: organ && diagnosis ? 'correct' : organ || diagnosis ? 'partial' : 'incorrect'};
}
export function cleanSlide(input) {
  const url = viewerURL(input.viewerUrl);
  const text = key => String(input[key] || '').trim().slice(0, 10000);
  return {id: url, code: code(input.code), viewerUrl: url, organ: text('organ'), diagnosis: text('diagnosis'),
    description: text('description'),
    organAliases: Array.isArray(input.organAliases) ? input.organAliases.map(String).slice(0,100) : [],
    diagnosisAliases: Array.isArray(input.diagnosisAliases) ? input.diagnosisAliases.map(String).slice(0,100) : [],
    sourceAnswerText: text('sourceAnswerText'), answerOrigin: ['site-columns','finding-pattern','syllabus'].includes(input.answerOrigin) ? input.answerOrigin : 'manual', confirmed: input.confirmed === true, indexedAt: new Date().toISOString()};
}

// Unit/code selection is one question per code, even if the bank retains older
// viewer links. Preserve all bank records and session snapshots for review.
export function reconcileCodeSelection(state) {
  const pending = new Set(state.pendingCodes || []), candidates = new Map();
  for (const slide of state.bank) {
    if (!pending.has(slide.code)) continue;
    const old = candidates.get(slide.code);
    const rank = s => Number(ready(s)) * 2 + Number(s.answerOrigin === 'manual');
    if (!old || rank(slide) > rank(old) || rank(slide) === rank(old) && (slide.indexedAt || '') >= (old.indexedAt || '')) candidates.set(slide.code, slide);
  }
  const byId = new Map(state.bank.map(s => [s.id,s]));
  return [...new Set([...state.selected.filter(id => !pending.has(byId.get(id)?.code)), ...[...candidates.values()].map(s => s.id)])];
}
