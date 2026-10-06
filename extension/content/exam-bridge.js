(() => {
  if (!/\/GestaltViewer\/?$/i.test(location.pathname)) return;
  const attached = new Map();
  const enabled = () => document.documentElement?.hasAttribute('data-ntu-exam-mode');
  const positive = value => Number.isFinite(Number(value)) && Number(value) > 0 ? Number(value) : null;
  function minimum(viewer) {
    const viewport = viewer.viewport;
    // EBMViewer/OSD getZoomSlider: image zoom = slider / 20,
    // displayed power = slider * 2. Thus 4x is exactly image zoom 0.1.
    // #amount is rounded, clamped to 2x, and updated 800ms later: never calibrate from it.
    if (viewer === window.Pviewer && viewport.imageToViewportZoom) {
      return viewport.imageToViewportZoom(4 / 40);
    }
    // Optical power is not OpenSeadragon's viewport zoom. Convert image scale
    // using the slide's native objective power whenever it is available.
    const source = viewer.world?.getItemAt(0)?.source || viewer.source;
    for (const object of [source, source?.metadata, viewer, window]) {
      for (const key of ['objectivePower', 'ObjectivePower', 'AppMag', 'appMag', 'scanMagnification', 'ScanMagnification']) {
        const power = positive(object?.[key]);
        if (power && viewport.imageToViewportZoom) return viewport.imageToViewportZoom(4 / power);
      }
    }
    // Some deployments expose only the current optical power in their UI.
    // Use current (rendered) zoom so animation targets do not skew calibration.
    for (const element of document.querySelectorAll('[id*="magnification" i], [id*="zoom" i], [id*="倍率"], [class*="magnification" i]')) {
      if (element.children.length || element.matches('button, a, option, input, select')) continue;
      const match = element.textContent.trim().match(/^(?:(?:magnification|zoom|倍率)\s*[:：]?\s*)?(\d+(?:\.\d+)?)\s*[x×倍]$/i);
      const power = positive(match?.[1]);
      if (power) return viewport.getZoom(true) * 4 / power;
    }
    return null;
  }
  function attach(viewer) {
    if (!viewer?.viewport?.zoomTo || !viewer.viewport.getMinZoom || !viewer.addHandler || attached.has(viewer)) return;
    const viewport = viewer.viewport;
    const original = {zoomTo:viewport.zoomTo, getMinZoom:viewport.getMinZoom};
    const state = {floor:null, imageFloor:null, enforcing:false};
    const floor = () => enabled() ? state.floor : null;
    viewport.getMinZoom = function(...args) {
      return Math.max(original.getMinZoom.apply(this,args), floor() || 0);
    };
    viewport.zoomTo = function(zoom,...args) {
      return original.zoomTo.call(this, Math.max(zoom, floor() || 0), ...args);
    };
    const constrain = () => {
      if (!enabled()) {state.floor=null;state.imageFloor=null;return;}
      if (state.enforcing) return;
      if (state.imageFloor && viewport.imageToViewportZoom) state.floor=positive(viewport.imageToViewportZoom(state.imageFloor));
      if (!state.floor) {
        state.floor=positive(minimum(viewer));
        if (state.floor && viewport.viewportToImageZoom) state.imageFloor=positive(viewport.viewportToImageZoom(state.floor));
      }
      if (!state.floor) {document.documentElement.dataset.ntuExamZoom='unavailable';return;}
      document.documentElement.dataset.ntuExamZoom='ready';
      if (viewport.getZoom() < state.floor || viewport.getZoom(true) < state.floor) {
        state.enforcing=true;
        try {original.zoomTo.call(viewport,state.floor,undefined,true);} finally {state.enforcing=false;}
      }
    };
    const recalibrate = () => {state.floor=null;state.imageFloor=null;constrain();};
    for (const event of ['zoom','animation','update-viewport']) viewer.addHandler(event,constrain);
    viewer.addHandler('open',recalibrate);
    viewer.addHandler('resize',()=>{if (!state.imageFloor) state.floor=null;constrain();});
    attached.set(viewer,{constrain,recalibrate});
    constrain();
  }
  function discover() {
    // Pviewer is used by NTU's older OSD, which does not expose world.
    attach(window.Pviewer);
    // Viewer instances are page-world objects, inaccessible to isolated scripts.
    for (const key of Object.keys(window)) {
      const descriptor=Object.getOwnPropertyDescriptor(window,key);
      if (!descriptor || !('value' in descriptor)) continue;
      const value=descriptor.value;
      try {if (value?.viewport?.getZoom && value?.addHandler) attach(value);} catch { /* Cross-origin frames are not viewer objects. */ }
    }
    for (const state of attached.values()) state.constrain();
  }
  let previous=!!enabled();
  const observer=new MutationObserver(()=>{
    const next=!!enabled();if(next===previous)return;previous=next;
    for (const state of attached.values()) state.recalibrate();
    if(next)discover();else delete document.documentElement.dataset.ntuExamZoom;
  });
  function start(){
    observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-ntu-exam-mode']});
    discover();
  }
  if(document.documentElement)start();else document.addEventListener('DOMContentLoaded',start,{once:true});
  const timer=setInterval(discover,500);
  window.addEventListener('pagehide',()=>{clearInterval(timer);observer.disconnect();},{once:true});
})();
