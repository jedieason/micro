/* Runs in the isolated content-script world; also imported by DOM fixture tests. */
(() => {
  const clean = value => String(value ?? '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
  const key = value => clean(value).toLowerCase().replace(/[\s_：:.-]/g, '');
  const code = text => {
    const m = clean(text).match(/\b(PA)\s*0*(\d+)\b/i) || clean(text).match(/^([A-Z]{2,8})0*(\d+)$/i);
    return m ? m[1].toUpperCase() + m[2].padStart(4, '0') : '';
  };
  function urls(value, base) {
    const result = [];
    const text = String(value || '').replace(/&amp;/g, '&').replace(/\\\//g, '/').replace(/\\u0026/gi, '&');
    // Accept literal URLs in href, data attributes or window.open/location handlers; never execute handlers.
    for (const match of text.matchAll(/(?:https?:\/\/|\/|\.\.?\/)?[^\s'"`<>()[\]{}=]*GestaltViewer\?[^\s'"`<>()[\]{}]*/gi)) {
      try {
        const u = new URL(match[0], base);
        if (!['https://microteaching.ntu.edu.tw', 'http://microteaching.ntu.edu.tw:9002'].includes(u.origin) || !/\/GestaltViewer\/?$/i.test(u.pathname) || !u.searchParams.get('wlGUID')) continue;
        u.searchParams.delete('ntuExam'); u.hash = ''; result.push(u.href);
      } catch { /* Not a URL. */ }
    }
    return [...new Set(result)];
  }
  function field(headers, cells, names) {
    const index = headers.findIndex(h => names.includes(key(h)));
    return index >= 0 ? clean(cells[index]) : '';
  }
  function findingAnswers(value) {
    // The supplied HTML includes multiple diagnoses, infant ages and unknown ages.
    // Parse the explicit age/sex and organ suffix; keep all preceding diagnoses.
    const parts = clean(value).split(/[;；]/).map(clean);
    return parts.length >= 3 && /^(?:\d+(?:\.\d+)?\s*[ymdw]?\s*[MF]|GA\d+(?:\+\d+)?[MF]|\?{1,2})$/i.test(parts.at(-2)) && parts[0] && parts.at(-1) && !/^\?+$/.test(parts.at(-1))
      ? {diagnosis:parts.slice(0,-2).join('; '),organ:parts.at(-1),confirmed:true,answerOrigin:'finding-pattern'} : null;
  }
  function slideFromRow(row, headers, base, context = null) {
    const cells = [...row.querySelectorAll(':scope > td, :scope > th')].map(c => clean(c.textContent));
    const text = clean(row.textContent);
    const slideCode = code(field(headers, cells, ['scanid', 'slideid', 'code', '玻片代號', '編號'])) || code(text) || context?.code;
    if (!slideCode) return [];
    const organ = field(headers, cells, ['organ', '器官']) || text.match(/(?:^|\s)Organ\s*[:：]\s*(.+?)(?=\s+(?:Diagnosis|ScanID)\s*[:：]|$)/i)?.[1] || '';
    const diagnosis = field(headers, cells, ['diagnosis', 'diagnoses', '診斷', '病理診斷']) || text.match(/(?:^|\s)Diagnosis\s*[:：]\s*(.+?)(?=\s+(?:Organ|ScanID)\s*[:：]|$)/i)?.[1] || '';
    const finding = field(headers, cells, ['finding', 'findings', '病理發現']);
    const parsed = findingAnswers(finding) || cells.map(findingAnswers).find(Boolean) ||
      (finding && !/[;；]/.test(finding) ? {diagnosis:finding,organ:'',confirmed:false,answerOrigin:'unparsed'} : null);
    return urls(row.outerHTML + (context?.html || ''), base).map(viewerUrl => ({code: slideCode, viewerUrl, organ, diagnosis,
      confirmed: !!(organ && diagnosis), answerOrigin: organ && diagnosis ? 'site-columns' : 'unparsed',
      ...(!(organ && diagnosis) && parsed ? parsed : {}), sourceAnswerText: cells.length ? cells.join('\n') : text}));
  }
  function scan(doc, base) {
    const slides = new Map(); let rowsWithCodes = 0;
    const put = items => items.forEach(s => { const old = slides.get(s.viewerUrl); if (!old || (!old.confirmed && s.confirmed)) slides.set(s.viewerUrl, s); });
    for (const table of doc.querySelectorAll('table')) {
      const headers = [...table.querySelectorAll('thead tr:last-child th, thead tr:last-child td')].map(h => h.textContent);
      const fallback = headers.length ? headers : [...(table.querySelector('tr')?.querySelectorAll('th') || [])].map(h => h.textContent);
      let previous = null;
      for (const row of table.querySelectorAll('tr')) {
        const rowCode = code(row.textContent);
        if (rowCode) rowsWithCodes++;
        put(slideFromRow(row, fallback, base, rowCode ? null : previous));
        previous = rowCode ? {code:rowCode,html:row.outerHTML} : null;
      }
    }
    for (const link of doc.querySelectorAll('a[href], [onclick], [ondblclick], [data-url], [data-href]')) {
      if (link.closest('table') || !urls(link.outerHTML, base).length) continue;
      let row = link;
      for (let depth = 0; depth < 4 && row; depth++, row = row.parentElement) {
        if (row === doc.body) break;
        const candidates = slideFromRow(row, [], base);
        // Do not attach one card's code to links belonging to other cards.
        if (candidates.length && new Set(urls(row.outerHTML, base)).size === 1) { put(candidates); rowsWithCodes++; break; }
      }
    }
    return {slides: [...slides.values()], rowsWithCodes};
  }
  function scanTables(tables, base, Parser = DOMParser) {
    const slides = new Map();
    for (const table of (tables || []).slice(0, 30)) {
      let previous = null;
      for (const row of (table.rows || []).slice(0, 10000)) {
        const doc = new Parser().parseFromString('<table><tbody></tbody></table>', 'text/html');
        let tr;
        if (row.html) {
          const parsed = new Parser().parseFromString(`<table><tbody>${row.html}</tbody></table>`, 'text/html');
          tr = parsed.querySelector('tr');
        } else {
          tr = doc.createElement('tr');
          for (const value of row.cells || []) { const td = doc.createElement('td'); td.innerHTML = String(value ?? ''); tr.append(td); }
        }
        if (tr) {
          const rowCode = code(tr.textContent);
          for (const slide of slideFromRow(tr, table.headers || [], base, rowCode ? null : previous)) {
            const old = slides.get(slide.viewerUrl);
            if (!old || (!old.confirmed && slide.confirmed)) slides.set(slide.viewerUrl, slide);
          }
          previous = rowCode ? {code:rowCode,html:tr.outerHTML} : null;
        }
      }
    }
    return [...slides.values()];
  }
  globalThis.NtuScanner = {scan, scanTables, urls, findingAnswers};
})();
