(() => {
  const sessionId = new URL(location.href).searchParams.get('ntuExam');
  const isViewer = /\/GestaltViewer\/?$/i.test(location.pathname);
  const channel = 'ntu-slide-practice-tables-v2';
  let lastSignature = '', scanning = null, badge, currentDiagnostics = {};
  let examMode = isViewer && !!sessionId, hideHints = examMode, revealed = false;
  function applyExamMode() {
    if (!isViewer || !document.documentElement) return;
    document.documentElement.toggleAttribute('data-ntu-exam-mode', examMode);
  }
  function applyAnnotationMask() {
    if (!isViewer || !document.documentElement) return;
    const hide = Boolean(sessionId && examMode !== false && !revealed);
    document.documentElement.toggleAttribute('data-ntu-hide-annotations', hide);
  }
  applyExamMode();
  applyAnnotationMask();
  maskHints();
  let selected = new Set();
  const additions = new Map();
  function setIcon(button, added) {
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');
    const path=document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('d',added?'M5 12l4 4L19 6':'M12 5v14M5 12h14');
    svg.append(path);button.replaceChildren(svg);
  }
  function updateButtons() {
    for (const [link, entry] of additions) {
      if (!link.isConnected) { entry.host.remove(); additions.delete(link); continue; }
      const added=selected.has(entry.id);
      setIcon(entry.button,added);
      entry.button.setAttribute('aria-label', `${added?'移除':'加入'} ${entry.code}`);
      entry.button.setAttribute('aria-pressed',String(added));
      entry.button.title=added?'已加入，點擊移除':'加入列表';
    }
  }
  function addButtons(slides) {
    for (const link of document.querySelectorAll('table a[href]')) {
      const id=NtuScanner.urls(link.getAttribute('href'),location.href).find(id=>slides.has(id));
      if (!id) continue;
      if (additions.get(link)?.id===id) continue;
      additions.get(link)?.host.remove();
      const host=document.createElement('span');host.dataset.ntuAdd='';
      const shadow=host.attachShadow({mode:'open'}),style=document.createElement('style'),button=document.createElement('button');
      style.textContent=':host{display:block;flex:0 0 32px;width:32px;height:32px}button{display:flex;align-items:center;justify-content:center;box-sizing:border-box;width:32px;height:32px;padding:6px;border:1px solid #d2e3fc;border-radius:50%;background:white;color:#1967d2;cursor:pointer}svg{display:block;width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}button[aria-pressed=true]{background:#e8f0fe}button:disabled{opacity:.5}button:focus-visible{outline:3px solid #a8c7fa;outline-offset:2px}';
      button.type='button';button.onclick=async event=>{
        event.preventDefault();event.stopPropagation();button.disabled=true;
        try { const checked=!selected.has(id);await api('SELECT_ONE',{id,checked});checked?selected.add(id):selected.delete(id);updateButtons(); }
        catch(e){button.textContent='!';button.title=e.message;}
        finally{button.disabled=false;}
      };
      shadow.append(style,button);
      let wrapper=link.closest('[data-ntu-slide-actions]');
      if(!wrapper){wrapper=document.createElement('span');wrapper.dataset.ntuSlideActions='';link.before(wrapper);wrapper.append(link);}
      wrapper.append(host);additions.set(link,{host,button,id,code:slides.get(id).code});
    }
    updateButtons();
  }
  chrome.storage?.onChanged?.addListener?.((changes,area)=>{
    if(area==='local' && changes.slidePracticeV1?.newValue){
      selected=new Set(changes.slidePracticeV1.newValue.selected||[]);
      updateButtons();
      if (isViewer && sessionId) {
        const session = (changes.slidePracticeV1.newValue.sessions || []).find(s => s.id === sessionId && s.status === 'active');
        if (session) {
          const attempt = session.attempts?.[session.index];
          if (attempt?.state === 'revealed' && !revealed) {
            revealed = true;
            applyAnnotationMask();
          }
        }
      }
    }
  });
  const api = async (type, data = {}) => {
    const result = await chrome.runtime.sendMessage({type, sessionId, ...data});
    if (!result?.ok) throw new Error(result?.error || '請重新整理網站，載入新版擴充功能。');
    return result.data;
  };
  function tableData() {
    return new Promise(resolve => {
      const requestId = crypto.randomUUID();
      const finish = data => { clearTimeout(timer); window.removeEventListener('message', listener); resolve(data); };
      const listener = event => {
        if (event.source === window && event.origin === location.origin && event.data?.channel === channel && event.data.requestId === requestId) finish(event.data);
      };
      const timer = setTimeout(() => finish({tables:[]}), 1200);
      window.addEventListener('message', listener);
      window.postMessage({channel:`${channel}-request`, requestId}, location.origin);
    });
  }
  function maskHints() {
    if (!isViewer) return;
    document.documentElement.toggleAttribute('data-ntu-exam', hideHints);
    if (!hideHints) return;
    document.title='玻片練習';
    // Target textual hints only. Do not hide the page or the original viewer controls.
    for (const n of document.querySelectorAll('span, label, p, h1, h2, h3, td, div, img')) {
      if (n.closest('#ntu-practice-launcher, .openseadragon-canvas, .openseadragon-container')) continue;
      const leaf = n.childElementCount === 0;
      if ((leaf && /\b(?:ScanID|Diagnosis|Finding|Organ)\s*[:：]|\bPA\d{4,}\b/i.test(n.textContent || '')) ||
          (n.tagName==='IMG' && /macro|slide.?label/i.test(`${n.alt} ${n.title}`))) n.dataset.ntuAnswerHint='';
    }
  }
  async function performScan() {
    if (isViewer) return {viewer:true};
    const dom = NtuScanner.scan(document, location.href), bridge = await tableData();
    const slides = new Map(dom.slides.map(s => [s.viewerUrl,s]));
    for (const slide of NtuScanner.scanTables(bridge.tables, location.href)) {
      if (!slides.has(slide.viewerUrl) || slide.confirmed) slides.set(slide.viewerUrl,slide);
    }
    const tables=(bridge.tables || []).filter(t => t.rows?.length);
    const totals=tables.map(t=>Number(t.total)).filter(n=>n>0);
    const info=[...document.querySelectorAll('.dataTables_info, .dt-info')].map(n=>n.textContent).join(' ');
    const infoTotal=info.match(/\bof\s+([\d,]+)\s+entries/i)?.[1]?.replace(/,/g,'');
    const candidateTotal=totals.length ? Math.max(...totals) : Number(infoTotal)||null;
    const total=candidateTotal>=slides.size ? candidateTotal : null;
    const found=slides.size;
    const login=!!document.querySelector('input[type=password]');
    currentDiagnostics={found,total,tables:tables.length,rowsWithCodes:dom.rowsWithCodes,
      status:login?'login':!found?'unrecognized':total && found>=total?'complete':'partial',
      note:bridge.error || (tables.some(t=>t.serverSide)?'網站使用伺服器分頁；尚未載入的頁面不在目前資料中。':'')};
    const signature=JSON.stringify({slides:[...slides.values()],diagnostics:currentDiagnostics});
    if (signature!==lastSignature) {
      const result=await api('COLLECT',{slides:[...slides.values()],diagnostics:currentDiagnostics});
      selected=new Set(result.selected);lastSignature=signature;
    }
    addButtons(slides);
    if (badge) badge.textContent = found ? `已讀 ${found}${total ? ` / ${total}` : ''}` : '';
    return currentDiagnostics;
  }
  function scan() {
    if (!scanning) scanning=performScan().finally(()=>scanning=null);
    return scanning;
  }
  chrome.runtime.onMessage.addListener((m, sender, reply) => {
    if (sender.id!==chrome.runtime.id) return;
    if (m.type==='SCAN') { lastSignature='';scan().then(data=>reply({ok:true,data}),e=>reply({ok:false,error:e.message}));return true; }
    if (m.type==='PAGE_STATUS') {
      const canvas=document.querySelector('.openseadragon-canvas canvas, .openseadragon-canvas img, canvas');
      const rect=canvas?.getBoundingClientRect();
      reply({ok:true,data:{url:location.href,isViewer,examMode,revealed,annotationsHidden:document.documentElement?.hasAttribute('data-ntu-hide-annotations')||false,examZoom:document.documentElement?.dataset.ntuExamZoom||'pending',viewerPresent:!!rect && rect.width>0 && rect.height>0,diagnostics:currentDiagnostics}});return;
    }
    if (m.type==='EXAM_MODE') {
      examMode=!!m.enabled;
      hideHints=examMode;
      if (m.revealed !== undefined) revealed = !!m.revealed;
      applyExamMode();
      maskHints();
      applyAnnotationMask();
      reply({ok:true});
    }
    if (m.type==='REVEAL') {
      revealed = m.revealed !== false;
      applyAnnotationMask();
      reply({ok:true});
    }
    if (m.type==='UNMASK') {
      examMode=false;
      hideHints=false;
      revealed=true;
      applyExamMode();
      maskHints();
      applyAnnotationMask();
      reply?.({ok:true});
    }
    if (m.type==='MASK') { hideHints=!!m.hidden;maskHints();reply({ok:true}); }
    if (m.type==='SHOW_ALL') {
      const select=[...document.querySelectorAll('select')].find(s=>[...s.options].some(o=>o.value==='-1') && (s.closest('.dataTables_length, .dt-length') || /length/i.test(s.name)));
      if (!select) {reply({ok:false,error:'目前找不到網站的 All 選項，請切換清單頁或使用原站分頁。'});return;}
      select.value='-1';select.dispatchEvent(new Event('change',{bubbles:true}));reply({ok:true});
    }
  });
  function start() {
    // A small launcher is available even if the page parser has not recognized a table.
    const host=document.createElement('div');host.id='ntu-practice-launcher';
    const shadow=host.attachShadow({mode:'open'}), style=document.createElement('style');
    style.textContent=':host{position:fixed;bottom:18px;right:18px;z-index:2147483647}button{font:13px -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;border:1.5px solid #d2e3fc;border-radius:50%;background:#fff;color:#1967d2;padding:0;width:48px;height:48px;box-shadow:0 3px 14px #0002;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .16s ease,box-shadow .16s ease,width .2s ease,border-radius .2s ease,padding .2s ease;user-select:none;box-sizing:border-box}button:hover{transform:scale(1.08);box-shadow:0 6px 20px #0003}button:active{transform:scale(.96)}button.has-text{width:auto;min-width:48px;height:44px;border-radius:24px;padding:4px 14px 4px 8px;gap:6px}.logo{width:38px;height:38px;object-fit:contain;display:block;flex-shrink:0;pointer-events:none}button.has-text .logo{width:30px;height:30px}.label{font-weight:500;white-space:nowrap}.label[hidden]{display:none!important}';
    badge=document.createElement('button');badge.title='臺大玻片跑臺機';badge.setAttribute('aria-label','臺大玻片跑臺機');
    const logoImg=document.createElement('img');logoImg.className='logo';logoImg.alt='臺大玻片跑臺機';
    const iconUrl=(typeof chrome!=='undefined'&&chrome.runtime?.getURL)?chrome.runtime.getURL('icons/icon-128.png'):'';
    if(iconUrl)logoImg.src=iconUrl;
    const badgeText=document.createElement('span');badgeText.className='label';badgeText.hidden=true;
    badge.append(logoImg,badgeText);
    const setBadgeText=text=>{
      const isDefault=!text||text==='刷題側欄';
      badgeText.textContent=isDefault?'':text;
      badgeText.hidden=isDefault;
      badge.title=isDefault?'臺大玻片跑臺機':`臺大玻片跑臺機 (${text})`;
      if(isDefault)badge.classList.remove('has-text');else badge.classList.add('has-text');
    };
    Object.defineProperty(badge,'textContent',{get(){return badgeText.textContent;},set(v){setBadgeText(v);},configurable:true});
    badge.onclick=()=>api('OPEN').catch(()=>{badge.textContent='請點工具列圖示';});
    shadow.append(style,badge);document.body.append(host);
    if(isViewer && sessionId)api('VIEW').then(q=>{
      examMode=q.examMode!==false;
      hideHints=examMode;
      revealed=q.attempt?.state==='revealed';
      applyExamMode();
      maskHints();
      applyAnnotationMask();
    }).catch(()=>{
      examMode=false;
      applyExamMode();
      hideHints=false;
      revealed=true;
      maskHints();
      applyAnnotationMask();
    });
    if(!isViewer)scan().catch(e=>{badge.textContent='讀取失敗 · 點此開啟側欄';console.warn(e.message);});
    let scheduled;
    const observer=new MutationObserver(records=>{
      if(records.every(r=>r.target===host || host.contains(r.target)))return;
      clearTimeout(scheduled);scheduled=setTimeout(()=>{if(isViewer){maskHints();applyAnnotationMask();}else scan().catch(()=>{});},600);
    });
    observer.observe(document.body,{childList:true,subtree:true,characterData:true});
    // Retry delayed DataTables initialization, including its detached rows.
    const retry=setTimeout(()=>{if(!isViewer)scan().catch(()=>{});},2500);
    const timer=setInterval(()=>{if(!document.hidden&&!isViewer)scan().catch(()=>{});},8000);
    window.addEventListener('pagehide',()=>{observer.disconnect();clearInterval(timer);clearTimeout(retry);clearTimeout(scheduled);},{once:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
