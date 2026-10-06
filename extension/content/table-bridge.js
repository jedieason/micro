(() => {
  // Read-only bridge: DataTables can retain rows which do not exist in the visible DOM.
  const channel = 'ntu-slide-practice-tables-v2';
  function snapshot(requestId) {
    const tables = [];
    try {
      const jq = window.jQuery;
      if (jq?.fn?.dataTable) for (const table of document.querySelectorAll('table')) {
        if (!jq.fn.dataTable.isDataTable(table)) continue;
        const api = jq(table).DataTable(), info = api.page.info();
        const headers = api.columns().header().toArray().map(h => h.textContent || '');
        const rows = api.rows().indexes().toArray().slice(0, 10000).map(index => {
          const node = api.row(index).node();
          if (node) return {html: node.outerHTML};
          return {cells: headers.map((_, column) => {
            const value = api.cell(index, column).render('display');
            return value == null ? '' : typeof value === 'object' ? value.outerHTML || '' : String(value);
          })};
        });
        tables.push({headers, rows, total: info.recordsTotal, displayed: info.recordsDisplay, serverSide: !!info.serverSide});
      }
      window.postMessage({channel, requestId, tables}, location.origin);
    } catch (e) { window.postMessage({channel, requestId, tables, error: '表格資料介面無法讀取'}, location.origin); }
  }
  window.addEventListener('message', event => {
    if (event.source === window && event.origin === location.origin && event.data?.channel === `${channel}-request`) snapshot(event.data.requestId);
  });
})();
