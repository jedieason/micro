import {cleanSlide, grade, ready, shuffle, parseCodes, viewerURL, isSite, reconcileCodeSelection} from './lib/core.js';
import {units, unitCodes, syllabus} from './lib/units.js';
const KEY = 'slidePracticeV1';
const initial = () => ({schemaVersion: 2, bank: [], selected: [], pendingCodes: [], unitIds: [], sessions: [], sources: {}});
function lookupSyllabus(code) {
  if (!code) return null;
  const normalized = String(code).trim().toUpperCase().replace(/^([A-Z]+)0*(\d+)$/, (_, p, n) => p + n.padStart(4, '0'));
  return syllabus[normalized] || syllabus[code] || null;
}
async function read() {
  const state={...initial(), ...(await chrome.storage.local.get(KEY))[KEY]};
  let changed = false;
  for (const slide of state.bank) {
    const ref = lookupSyllabus(slide.code);
    if (ref && ref.organ && ref.diagnosis && slide.answerOrigin !== 'manual') {
      const origOrgan = slide.organ;
      const origDiagnosis = slide.diagnosis;
      const origConfirmed = slide.confirmed;
      const origOrigin = slide.answerOrigin;
      const origOrganAliases = JSON.stringify(slide.organAliases || []);
      const origDiagnosisAliases = JSON.stringify(slide.diagnosisAliases || []);
      slide.organ = ref.organ;
      slide.diagnosis = ref.diagnosis;
      slide.organAliases = ref.organAliases || [];
      slide.diagnosisAliases = ref.diagnosisAliases || [];
      slide.confirmed = true;
      slide.answerOrigin = 'syllabus';
      if (origOrgan !== slide.organ || origDiagnosis !== slide.diagnosis || origConfirmed !== slide.confirmed || origOrigin !== slide.answerOrigin || origOrganAliases !== JSON.stringify(slide.organAliases) || origDiagnosisAliases !== JSON.stringify(slide.diagnosisAliases)) {
        changed = true;
      }
    } else if (ref && (!slide.organ || !slide.diagnosis || !slide.confirmed)) {
      slide.organ = slide.organ || ref.organ;
      slide.diagnosis = slide.diagnosis || ref.diagnosis;
      slide.organAliases = (slide.organAliases && slide.organAliases.length) ? slide.organAliases : (ref.organAliases || []);
      slide.diagnosisAliases = (slide.diagnosisAliases && slide.diagnosisAliases.length) ? slide.diagnosisAliases : (ref.diagnosisAliases || []);
      slide.confirmed = true;
      if (!slide.answerOrigin || slide.answerOrigin === 'unparsed') slide.answerOrigin = 'syllabus';
      changed = true;
    }
  }
  for (const s of state.sessions || []) {
    for (const slide of s.slides || []) {
      const ref = lookupSyllabus(slide.code);
      if (ref && ref.organ && ref.diagnosis && slide.answerOrigin !== 'manual') {
        slide.organ = ref.organ;
        slide.diagnosis = ref.diagnosis;
        slide.organAliases = ref.organAliases || [];
        slide.diagnosisAliases = ref.diagnosisAliases || [];
        slide.confirmed = true;
        slide.answerOrigin = 'syllabus';
      }
    }
  }
  const selected=reconcileCodeSelection(state);
  if (changed || JSON.stringify(selected)!==JSON.stringify(state.selected)) {state.selected=selected;await write(state);}
  return state;
}
async function write(state) { state.schemaVersion = 2; await chrome.storage.local.set({[KEY]: state}); }
chrome.sidePanel.setPanelBehavior({openPanelOnActionClick: true}).catch(console.error);
let queue = Promise.resolve();
chrome.runtime.onMessage.addListener((message, sender, reply) => {
  // Preserve the user gesture required by sidePanel.open: no storage awaits before it.
  if (message.type === 'OPEN' && sender.id === chrome.runtime.id && sender.tab && isSite(sender.url)) {
    chrome.sidePanel.open({tabId: sender.tab.id}).then(() => reply({ok: true}), e => reply({ok:false,error:e.message})); return true;
  }
  const task = queue.then(() => handle(message, sender)); queue = task.catch(() => {});
  task.then(data => reply({ok: true, data}), error => reply({ok: false, error: error.message})); return true;
});
async function activeSite(tabId) {
  const tab = await chrome.tabs.get(tabId);
  if (!isSite(tab.url)) throw new Error('請先切換到台大玻片清單或檢視器分頁。');
  if (!tab.active) throw new Error('目前已切換分頁，請在要練習的台大分頁重試。');
  return tab;
}
async function handle(m, sender) {
  if (sender.id !== chrome.runtime.id) throw new Error('無效來源。');
  const panel = sender.url?.startsWith(chrome.runtime.getURL('pages/'));
  const site = sender.tab && isSite(sender.url);
  const state = await read();
  if (m.type === 'COLLECT' && site) {
    let count = 0;
    for (const input of (m.slides || []).slice(0, 10000)) {
      try {
        const slideCode = (String(input.code || '').trim().toUpperCase().match(/^([A-Z]+)(\d+)$/) || [])[0] ?
          String(input.code).trim().toUpperCase().replace(/^([A-Z]+)0*(\d+)$/, (_, p, n) => p + n.padStart(4, '0')) : input.code;
        const ref = lookupSyllabus(slideCode);
        const parsed = ['site-columns', 'finding-pattern'].includes(input.answerOrigin);
        const hasSiteAnswer = parsed && !!input.organ && !!input.diagnosis;
        const isManual = input.answerOrigin === 'manual';

        let organ, diagnosis, organAliases, diagnosisAliases, confirmed, answerOrigin;
        if (isManual) {
          organ = input.organ || '';
          diagnosis = input.diagnosis || '';
          organAliases = input.organAliases || [];
          diagnosisAliases = input.diagnosisAliases || [];
          confirmed = input.confirmed === true;
          answerOrigin = 'manual';
        } else if (ref && ref.organ && ref.diagnosis) {
          organ = ref.organ;
          diagnosis = ref.diagnosis;
          organAliases = ref.organAliases || [];
          diagnosisAliases = ref.diagnosisAliases || [];
          confirmed = true;
          answerOrigin = 'syllabus';
        } else {
          organ = input.organ || '';
          diagnosis = input.diagnosis || '';
          organAliases = input.organAliases || [];
          diagnosisAliases = input.diagnosisAliases || [];
          confirmed = hasSiteAnswer || input.confirmed === true;
          answerOrigin = hasSiteAnswer ? input.answerOrigin : (input.answerOrigin || 'unparsed');
        }

        const slide = cleanSlide({
          ...input,
          organ,
          diagnosis,
          organAliases,
          diagnosisAliases,
          confirmed,
          answerOrigin
        });
        const old = state.bank.find(s => s.id === slide.id);
        if (!old) { state.bank.push(slide); count++; }
        else if (old.answerOrigin !== 'manual') {
          if (slide.answerOrigin === 'syllabus' || slide.confirmed || !old.confirmed || ((!old.organ || !old.diagnosis) && (slide.organ && slide.diagnosis))) {
            Object.assign(old, slide);
          }
        }
      } catch { /* Unsupported rows stay outside the bank. */ }
    }
    state.selected=reconcileCodeSelection(state);
    const diag = m.diagnostics || {};
    state.sources[sender.tab.id] = {url:sender.url, at:new Date().toISOString(), found:Number(diag.found)||0,
      total:Number(diag.total)||null, status:String(diag.status||'partial').slice(0,40), note:String(diag.note||'').slice(0,500),
      rowsWithCodes:Number(diag.rowsWithCodes)||0, tables:Number(diag.tables)||0};
    await write(state); return {count,total:state.bank.length,selected:state.selected};
  }
  if (m.type === 'SELECT_ONE' && site) {
    if (!state.bank.some(s => s.id === m.id)) throw new Error('正在讀取此玻片，請稍後再試。');
    state.selected = state.selected.filter(id => id !== m.id); if (m.checked) state.selected.push(m.id);
    if (!m.checked) state.pendingCodes = state.pendingCodes.filter(c => c !== state.bank.find(s => s.id === m.id).code);
    await write(state); return true;
  }
  if (panel) {
    if (m.type === 'GET') return state;
    if (m.type === 'SAVE_SLIDE') {
      const slide = cleanSlide({...m.slide, answerOrigin:'manual'}), at = state.bank.findIndex(s => s.id === slide.id);
      if (at < 0) state.bank.push(slide); else state.bank[at] = slide;
      await write(state); return state;
    }
    if (m.type === 'CLEAR_SELECTION') {
      state.selected=[];state.pendingCodes=[];state.unitIds=[];
      await write(state);return state;
    }
    if (m.type === 'SELECT') {
      state.selected = [...new Set(m.ids)].filter(id => state.bank.some(s => s.id === id));
      state.pendingCodes = state.pendingCodes.filter(c => !state.bank.some(s => s.code === c && !state.selected.includes(s.id)));
      await write(state); return state;
    }
    if (m.type === 'UNIT_CHOICES') {
      state.unitIds=units.filter(u=>m.ids.includes(u.id)).map(u=>u.id);
      await write(state);return state;
    }
    if (m.type === 'SELECT_CODES' || m.type === 'SELECT_UNITS') {
      const parsed = parseCodes(m.type==='SELECT_UNITS'?unitCodes(state.unitIds).join(' '):m.text);
      if (parsed.invalid.length || !parsed.codes.length) throw new Error(`請檢查代號格式：${parsed.invalid.join('、') || '尚未輸入代號'}`);
      state.pendingCodes = [...new Set([...(m.replace ? [] : state.pendingCodes), ...parsed.codes])];
      if (m.replace) state.selected=[];
      state.selected=reconcileCodeSelection(state); await write(state); return state;
    }
    if (m.type === 'CLEAR_HISTORY') {
      for (const s of state.sessions) {
        if (s.status === 'active') {
          chrome.tabs.sendMessage(s.tabId, {type: 'UNMASK'}).catch(() => {});
        }
      }
      state.sessions = [];
      await write(state);
      return state;
    }
    if (m.type === 'START') {
      await activeSite(m.tabId);
      if (state.sessions.some(s => s.tabId === m.tabId && s.status === 'active')) throw new Error('此分頁已有練習，請先繼續或結束該輪。');
      const pool = state.bank.filter(s => m.ids.includes(s.id) && ready(s)), count = Number(m.count);
      if (!Number.isInteger(count) || count < 1 || count > pool.length) throw new Error('題數超出有完整答案的選題數量。');
      const session = {id:crypto.randomUUID(),tabId:m.tabId,slides:shuffle(pool).slice(0,count),index:0,
        attempts:Array.from({length:count},()=>({draft:{organ:'',diagnosis:''},state:'answering'})),status:'active',createdAt:new Date().toISOString()};
      state.sessions.push(session); await write(state); await navigate(session); return {id:session.id};
    }
    if (m.type === 'RESUME') {
      const s = state.sessions.find(s => s.id === m.id && s.status === 'active');
      if (!s) throw new Error('找不到進行中的練習。');
      await activeSite(m.tabId);
      if (state.sessions.some(other => other.id !== s.id && other.tabId === m.tabId && other.status === 'active')) throw new Error('目前分頁已有另一輪練習。');
      s.tabId=m.tabId; await write(state); await navigate(s); return true;
    }
    if (m.type === 'END') {
      const s=state.sessions.find(s=>s.id===m.sessionId && s.tabId===m.tabId && s.status==='active');
      if (!s) throw new Error('找不到此輪練習。');
      s.status='ended';await write(state);await chrome.tabs.sendMessage(s.tabId,{type:'UNMASK'}).catch(()=>{});return true;
    }
  }
  if (!site && !panel) throw new Error('不支援的操作。');
  const tabId = site ? sender.tab.id : m.tabId;
  const session = state.sessions.find(s => s.id === m.sessionId && s.tabId === tabId && s.status === 'active');
  const slide = session.slides[session.index], attempt = session.attempts[session.index];
  const ref = lookupSyllabus(slide.code);
  if (ref && ref.organ && ref.diagnosis && slide.answerOrigin !== 'manual') {
    slide.organ = ref.organ;
    slide.diagnosis = ref.diagnosis;
    slide.organAliases = ref.organAliases || [];
    slide.diagnosisAliases = ref.diagnosisAliases || [];
    slide.confirmed = true;
    slide.answerOrigin = 'syllabus';
  }
  const url = site ? sender.url : (await activeSite(tabId)).url;
  if (viewerURL(url) !== slide.viewerUrl) throw new Error('正在切換玻片，請等原站載入完成；若未成功，按「重新開啟本題」。');
  if (m.type === 'VIEW') return publicQuestion(session);
  if (m.type === 'EXAM_MODE' && panel) {
    session.examMode=!!m.enabled;await write(state);
    await chrome.tabs.sendMessage(tabId,{type:'EXAM_MODE',enabled:session.examMode,revealed:attempt.state==='revealed'});
    return publicQuestion(session);
  }
  if (m.index !== session.index) throw new Error('題目已切換，請重新載入側欄。');
  if (m.type === 'DRAFT' || m.type === 'SUBMIT') {
    if (attempt.state === 'answering') {
      const draft = {organ:String(m.answer.organ||'').slice(0,1000),diagnosis:String(m.answer.diagnosis||'').slice(0,1000)};
      if (m.type === 'SUBMIT') {
        if (!draft.organ.trim() || !draft.diagnosis.trim()) throw new Error('請填寫 Organ 與 Diagnosis。');
        attempt.result=grade(draft,slide);attempt.state='revealed';attempt.submittedAt=new Date().toISOString();
        await chrome.tabs.sendMessage(tabId,{type:'REVEAL',revealed:true}).catch(()=>{});
      }
      attempt.draft=draft;await write(state);
    }
    return publicQuestion(session);
  }
  if (m.type === 'GRADE') {
    if (attempt.state !== 'revealed' || !['correct','partial','incorrect'].includes(m.grade)) throw new Error('請先提交答案。');
    attempt.selfGrade=m.grade;await write(state);return publicQuestion(session);
  }
  if (m.type === 'NEXT') {
    if (attempt.state !== 'revealed') throw new Error('請先提交答案。');
    session.index++;
    if (session.index === session.slides.length) {session.status='completed';session.completedAt=new Date().toISOString();}
    await write(state);
    if (session.status === 'active') await navigate(session);
    else await chrome.tabs.sendMessage(session.tabId,{type:'UNMASK'}).catch(()=>{});
    return {completed:session.status==='completed'};
  }
  throw new Error('不支援的操作。');
}
async function navigate(s) {
  const u=new URL(s.slides[s.index].viewerUrl);u.searchParams.set('ntuExam',s.id);
  await chrome.tabs.update(s.tabId,{url:u.href,active:true});
}
function publicQuestion(s) { const attempt=s.attempts[s.index];return {examMode:s.examMode!==false,index:s.index,total:s.slides.length,attempt,...(attempt.state==='revealed'?{slide:s.slides[s.index]}:{})}; }
