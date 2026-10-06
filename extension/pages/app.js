import {ready, isSite} from '../lib/core.js';
import {units, syllabus} from '../lib/units.js';
const $=id=>document.getElementById(id);
let allQuestions=false;
let state={bank:[],selected:[],pendingCodes:[],sessions:[],sources:{}}, filtered=[], tabId=null, connected=false, active=null, renderKey='', mode='bank', lastTabId=null;
const node=(tag,text='',cls='')=>{const n=document.createElement(tag);n.textContent=text;if(cls)n.className=cls;return n;};
const notice=text=>$('notice').textContent=text;
const run=fn=>async event=>{try{await fn(event);}catch(e){notice(e.message);}};
async function api(type,data={}) {const r=await chrome.runtime.sendMessage({type,tabId,...data});if(!r?.ok)throw new Error(r?.error||'擴充功能未回應。');return r.data;}
async function page(type,data={}) {if(!connected)throw new Error('請切換到台大玻片系統分頁，並重新整理網站。');const r=await chrome.tabs.sendMessage(tabId,{type,...data});if(!r?.ok)throw new Error(r?.error||'原站尚未回應。');return r.data;}
function tab(name){mode=name;for(const n of ['bank','exam','history']){$(`${n}View`).hidden=n!==name;$(`${n}Tab`).classList.toggle('active',n===name);}}
async function refresh() {
  const [current]=await chrome.tabs.query({active:true,currentWindow:true});
  tabId=current?.id;connected=isSite(current?.url);
  state=await api('GET');active=state.sessions.find(s=>s.tabId===tabId&&s.status==='active')||null;
  $('bankTab').disabled=!!active;
  renderBank();renderHistory();
  if(lastTabId!==tabId){renderKey='';tab(active?'exam':'bank');lastTabId=tabId;}
  if(active)await renderQuestion();else{$('question').replaceChildren(node('p','請先加入題目。','muted'));renderKey='';}
}
function renderBank(){
  const source=state.sources[tabId];
  $('openSite').hidden=connected;$('sync').disabled=!connected;$('showAll').hidden=!connected||!source?.total||source.found>=source.total;
  $('syncTitle').textContent=!connected?'請開啟玻片清單':source?.status==='login'?'請先在原站登入':source?.found?`已讀 ${source.found}${source.total>=source.found?` / ${source.total}`:''} 題`:'未讀到玻片';
  $('syncDetail').textContent=connected && source && !source.found && source.status!=='login'?'請重新整理原站後再試。':'';
  $('total').textContent=state.selected.length;
  $('clearSelection').disabled=!!active||!(state.selected.length||state.pendingCodes.length||(state.unitIds||[]).length);
  $('units').replaceChildren();
  for(const unit of units){
    const label=node('label','','check'),input=document.createElement('input');
    input.type='checkbox';input.checked=(state.unitIds||[]).includes(unit.id);
    input.onchange=run(async()=>{const ids=new Set(state.unitIds||[]);input.checked?ids.add(unit.id):ids.delete(unit.id);state=await api('UNIT_CHOICES',{ids:[...ids]});renderBank();});
    label.append(input,node('span',unit.name),node('span',String(unit.codes.length),'badge'));$('units').append(label);
  }
  $('addUnits').disabled=$('replaceUnits').disabled=!(state.unitIds||[]).length;
  filtered=state.bank.filter(s=>state.selected.includes(s.id)).filter(s=>`${s.code} ${s.organ} ${s.diagnosis}`.toLowerCase().includes($('search').value.trim().toLowerCase()));
  $('rows').replaceChildren();
  for(const slide of filtered){
    const row=node('div','','slide'),check=document.createElement('input');check.type='checkbox';check.checked=state.selected.includes(slide.id);check.setAttribute('aria-label',`選取 ${slide.code}`);
    check.onchange=run(async()=>{const ids=new Set(state.selected);check.checked?ids.add(slide.id):ids.delete(slide.id);state=await api('SELECT',{ids:[...ids]});renderBank();});
    const ref=syllabus[slide.code]||{},useSyllabus=Boolean(ref.organ&&ref.diagnosis&&slide.answerOrigin!=='manual');
    const organ=useSyllabus?ref.organ:(slide.organ||ref.organ||'待確認 Organ');
    const diagnosis=useSyllabus?ref.diagnosis:(slide.diagnosis||ref.diagnosis||'待確認 Diagnosis');
    const content=node('div','','content'),heading=node('div',slide.code,'code');content.append(heading,node('p',diagnosis,'diagnosis'),node('span',organ,'small muted'));
    const edit=node('button',ready(slide)?'檢查答案':'補上答案','text edit');edit.onclick=()=>editSlide(slide);content.append(node('br'),edit);row.append(check,content);$('rows').append(row);
  }
  $('empty').hidden=state.selected.length>0;
  const pending=state.pendingCodes.filter(c=>!state.bank.some(s=>s.code===c));
  $('pending').textContent=pending.length?`尚未讀到：${pending.join('、')}`:'';
  const selected=state.bank.filter(s=>state.selected.includes(s.id)), valid=selected.filter(ready).length;
  $('selectionSummary').textContent=`已選 ${selected.length} 題 · ${valid} 題可作答${selected.length>valid?` · ${selected.length-valid} 題需補答案`:''}`;
  $('count').max=valid;if(allQuestions||valid&&Number($('count').value)>valid)$('count').value=valid;
  $('allQuestions').disabled=!valid||!!active;
  $('allQuestions').setAttribute('aria-pressed',String(allQuestions));
  $('start').disabled=!connected||!valid||!!active;
  $('selectAll').checked=filtered.length>0&&filtered.every(s=>state.selected.includes(s.id));$('selectAll').indeterminate=filtered.some(s=>state.selected.includes(s.id))&&!$('selectAll').checked;
}
function editSlide(slide={}){
  const ref=syllabus[slide.code]||{};
  const useSyllabus=Boolean(ref.organ&&ref.diagnosis&&slide.answerOrigin!=='manual');
  $('editForm').reset();$('editError').textContent='';$('editTitle').textContent=slide.code?`${slide.code} · 答案`:'新增玻片';
  for(const [id,key]of Object.entries({editCode:'code',editURL:'viewerUrl',source:'sourceAnswerText'}))$(id).value=slide[key]||ref[key]||'';
  $('editOrgan').value=(useSyllabus?ref.organ:(slide.organ||ref.organ))||'';
  $('editDiagnosis').value=(useSyllabus?ref.diagnosis:(slide.diagnosis||ref.diagnosis))||'';
  $('editURL').readOnly=!!slide.id;
  $('organAliases').value=((useSyllabus?ref.organAliases:(slide.organAliases?.length?slide.organAliases:ref.organAliases))||[]).join('\n');
  $('diagnosisAliases').value=((useSyllabus?ref.diagnosisAliases:(slide.diagnosisAliases?.length?slide.diagnosisAliases:ref.diagnosisAliases))||[]).join('\n');
  $('confirmed').checked=slide.confirmed!==undefined?!!slide.confirmed:Boolean(ref.organ&&ref.diagnosis);
  $('editor').showModal();
}
$('new').onclick=()=>editSlide();$('closeEditor').onclick=()=>$('editor').close();
$('editForm').onsubmit=async event=>{event.preventDefault();try{state=await api('SAVE_SLIDE',{slide:{code:$('editCode').value,viewerUrl:$('editURL').value,organ:$('editOrgan').value,diagnosis:$('editDiagnosis').value,sourceAnswerText:$('source').value,confirmed:$('confirmed').checked,organAliases:$('organAliases').value.split('\n').filter(s=>s.trim()),diagnosisAliases:$('diagnosisAliases').value.split('\n').filter(s=>s.trim())}});$('editor').close();renderBank();}catch(e){$('editError').textContent=e.message;}};
$('search').oninput=renderBank;
$('clearSelection').onclick=run(async()=>{state=await api('CLEAR_SELECTION');$('search').value='';$('codes').value='';renderBank();notice('已清除所有選取，可以重新選題。');});
$('selectAll').onchange=run(async()=>{const ids=new Set(state.selected);for(const s of filtered)$('selectAll').checked?ids.add(s.id):ids.delete(s.id);state=await api('SELECT',{ids:[...ids]});renderBank();});
async function codes(replace){state=await api('SELECT_CODES',{text:$('codes').value,replace});renderBank();notice('');if(connected)await page('SCAN').catch(()=>{});await refresh();}
$('addCodes').onclick=run(()=>codes(false));$('replaceCodes').onclick=run(()=>codes(true));
async function selectUnits(replace){state=await api('SELECT_UNITS',{replace});$('search').value='';renderBank();notice('');}
$('addUnits').onclick=run(()=>selectUnits(false));$('replaceUnits').onclick=run(()=>selectUnits(true));
$('sync').onclick=run(async()=>{$('sync').disabled=true;notice('正在讀取網站與分頁表格資料…');try{await page('SCAN');notice('');}finally{await refresh();}});
$('showAll').onclick=run(async()=>{await page('SHOW_ALL');notice('已切換原站 All，載入完成後會自動同步。');});
$('openSite').onclick=()=>chrome.tabs.create({url:'https://microteaching.ntu.edu.tw/'});
$('allQuestions').onclick=()=>{allQuestions=true;renderBank();};
$('count').oninput=()=>{allQuestions=false;$('allQuestions').setAttribute('aria-pressed','false');};
$('start').onclick=run(async()=>{$('start').disabled=true;try{await api('START',{ids:state.selected,count:Number($('count').value)});tab('exam');renderKey='';await refresh();}finally{$('start').disabled=!!active;}});
for(const name of ['bank','exam','history'])$(`${name}Tab`).onclick=()=>tab(name);
const grades={correct:'答對',partial:'部分答對',incorrect:'答錯'};
async function renderQuestion(){
  const session=active;if(!session)return;
  const attempt=session.attempts[session.index],key=`${session.id}:${session.index}:${attempt.state}:${attempt.selfGrade||''}`;
  if(key===renderKey)return;
  let q;try{q=await api('VIEW',{sessionId:session.id});}catch(e){$('question').replaceChildren(node('h2',`第 ${session.index+1} 題`,'question-title'),node('p',e.message,'small muted'));const retry=node('button','重新開啟本題','secondary');retry.onclick=run(async()=>{await api('RESUME',{id:session.id});renderKey='';});$('question').append(retry);return;}
  if(!active||active.id!==session.id||active.index!==q.index)return;
  renderKey=key;const box=$('question');box.replaceChildren();
  box.append(node('h2',`第 ${q.index+1} / ${q.total} 題`,'question-title'));
  const progress=document.createElement('progress');progress.max=q.total;progress.value=q.index;progress.setAttribute('aria-label','答題進度');box.append(progress);
  const status=node('p','','small muted');box.append(status);
  const checkZoom=async()=>{
    if(!status.isConnected){clearInterval(zoomTimer);return;}
    try{const info=await page('PAGE_STATUS');status.textContent=info?.examMode&&info.examZoom!=='ready'?'考試模式：縮圖已隱藏，4 倍限制尚未確認。':'';}catch{}
  };
  const zoomTimer=setInterval(checkZoom,1500);checkZoom();
  const form=node('form','','answer'),inputs={};
  for(const name of ['organ','diagnosis']){const input=document.createElement('input');input.id=`answer-${name}`;input.name=name;input.required=true;input.maxLength=1000;input.autocomplete='off';input.value=q.attempt.draft[name];input.disabled=q.attempt.state==='revealed';const label=node('label',name==='organ'?'Organ':'Diagnosis');label.htmlFor=input.id;form.append(label,input);inputs[name]=input;}
  const error=node('p','','error');error.setAttribute('role','alert');const submit=node('button','提交答案','primary wide');submit.type='submit';submit.hidden=q.attempt.state==='revealed';form.append(submit,error);box.append(form);
  const sessionTab=tabId, payload={sessionId:session.id,index:q.index,tabId:sessionTab};let busy=false,drafts=Promise.resolve();
  const answer=()=>({organ:inputs.organ.value,diagnosis:inputs.diagnosis.value});
  form.addEventListener('input',()=>{const value=answer();drafts=drafts.then(()=>api('DRAFT',{...payload,answer:value})).catch(e=>{error.textContent=`草稿未儲存：${e.message}`;});});
  form.onsubmit=async event=>{event.preventDefault();if(busy)return;busy=true;submit.disabled=true;try{await drafts;await api('SUBMIT',{...payload,answer:answer()});await page('REVEAL',{revealed:true}).catch(()=>{});renderKey='';await refresh();}catch(e){error.textContent=e.message;busy=false;submit.disabled=false;}};
  if(q.attempt.state==='revealed'){
    const ref=syllabus[q.slide.code]||{},useSyllabus=Boolean(ref.organ&&ref.diagnosis&&q.slide.answerOrigin!=='manual');
    const organ=useSyllabus?ref.organ:(q.slide.organ||ref.organ),diagnosis=useSyllabus?ref.diagnosis:(q.slide.diagnosis||ref.diagnosis);
    const result=node('div','','result'),g=q.attempt.selfGrade||q.attempt.result.grade;
    result.append(node('strong',`${grades[g]}${q.attempt.selfGrade?'（自評）':''}`,g),node('p',`Organ：${organ} ${q.attempt.result.organ?'（符合）':'（未符合）'}`),node('p',`Diagnosis：${diagnosis} ${q.attempt.result.diagnosis?'（符合）':'（未符合）'}`));
    const source=node('details');source.append(node('summary','網站原文'),node('p',q.slide.sourceAnswerText));result.append(source);
    const buttons=node('div','','row grade-buttons');for(const[g,label]of Object.entries(grades)){const b=node('button',label,q.attempt.selfGrade===g?'selected':'');b.onclick=run(async()=>{if(busy)return;busy=true;try{await api('GRADE',{...payload,grade:g});renderKey='';await refresh();}finally{busy=false;}});buttons.append(b);}result.append(buttons);
    const next=node('button',q.index+1===q.total?'完成練習 →':'下一題 →','primary wide');next.onclick=run(async()=>{if(busy)return;busy=true;next.disabled=true;try{const r=await api('NEXT',payload);renderKey='';if(r.completed)tab('history');await refresh();}catch(e){busy=false;next.disabled=false;throw e;}});result.append(next);box.append(result);
  }
  const examLabel=node('label','','check'),exam=document.createElement('input');exam.type='checkbox';exam.checked=q.examMode!==false;
  exam.onchange=run(async()=>{exam.disabled=true;try{await api('EXAM_MODE',{...payload,enabled:exam.checked});}catch(e){exam.checked=!exam.checked;throw e;}finally{exam.disabled=false;}});
  examLabel.append(exam,document.createTextNode('考試模式（隱藏文字提示、縮圖、最低 4 倍）'));box.append(examLabel);
  const retry=node('button','重新開啟本題','text');retry.onclick=run(async()=>{await drafts;await api('RESUME',{id:session.id});renderKey='';});
  const end=node('button','結束這輪','text');end.onclick=run(async()=>{await drafts;await api('END',payload);tab('bank');renderKey='';await refresh();});box.append(retry,end);
}
function renderHistory(){
  $('history').replaceChildren();
  const hasSessions=state.sessions.length>0;
  $('clear').disabled=!hasSessions;
  $('export').disabled=!hasSessions;
  if(!hasSessions){$('history').append(node('p','還沒有練習紀錄。','muted'));return;}
  for(const s of [...state.sessions].reverse()){
    const completed=s.attempts.filter(a=>a.state==='revealed'),correct=completed.filter(a=>(a.selfGrade||a.result.grade)==='correct').length,card=node('section','','history-card');
    card.append(node('strong',`${new Date(s.createdAt).toLocaleString('zh-TW')} · ${s.status==='active'?'進行中':s.status==='ended'?'已結束':'已完成'}`),node('p',`已答 ${completed.length} / ${s.slides.length} · 答對 ${correct} 題`));
    const wrong=s.slides.filter((slide,i)=>s.attempts[i].state==='revealed'&&(s.attempts[i].selfGrade||s.attempts[i].result.grade)!=='correct').map(s=>s.id);
    const button=node('button',s.status==='active'?'在目前分頁繼續':'錯題重練','secondary');button.disabled=!connected||!!active&&active.id!==s.id||s.status!=='active'&&!wrong.length;
    button.onclick=run(async()=>{if(s.status==='active')await api('RESUME',{id:s.id});else await api('START',{ids:wrong,count:wrong.length});renderKey='';tab('exam');await refresh();});card.append(button);
    if(s.status!=='active'){const details=node('details');details.append(node('summary','查看逐題答案'));s.slides.forEach((slide,i)=>{const a=s.attempts[i];if(a.state!=='revealed')return;const g=a.selfGrade||a.result.grade,row=node('div','','attempt');const ref=syllabus[slide.code]||{},useSyllabus=Boolean(ref.organ&&ref.diagnosis&&slide.answerOrigin!=='manual'),organ=useSyllabus?ref.organ:(slide.organ||ref.organ),diagnosis=useSyllabus?ref.diagnosis:(slide.diagnosis||ref.diagnosis);row.append(node('strong',`${slide.code} · ${grades[g]}`,g),node('p',`你的答案：${a.draft.organ} / ${a.draft.diagnosis}`),node('p',`標準答案：${organ} / ${diagnosis}`));details.append(row);});card.append(details);}$('history').append(card);
  }
}
$('export').onclick=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify({schemaVersion:2,sessions:state.sessions},null,2)],{type:'application/json'}));const a=node('a');a.href=url;a.download='slide-practice-history.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
$('clear').onclick=()=>{if(!state.sessions.length)return;$('clearDialog').showModal();};
$('cancelClear').onclick=()=>$('clearDialog').close();
$('closeClearDialog').onclick=()=>$('clearDialog').close();
$('clearForm').onsubmit=run(async event=>{event.preventDefault();state=await api('CLEAR_HISTORY');$('clearDialog').close();renderHistory();notice('已清除所有練習紀錄。');});
let refreshing=false,pendingRefresh=false;
async function scheduledRefresh(){if(refreshing){pendingRefresh=true;return;}refreshing=true;try{await refresh();}catch(e){notice(e.message);}finally{refreshing=false;if(pendingRefresh){pendingRefresh=false;setTimeout(scheduledRefresh,50);}}}
chrome.storage.onChanged.addListener((changes,area)=>{if(area==='local'&&changes.slidePracticeV1)scheduledRefresh();});
chrome.tabs.onActivated.addListener(scheduledRefresh);chrome.tabs.onUpdated.addListener((id,info)=>{if(id===tabId&&info.status==='complete')scheduledRefresh();});
window.addEventListener('focus',scheduledRefresh);scheduledRefresh();
