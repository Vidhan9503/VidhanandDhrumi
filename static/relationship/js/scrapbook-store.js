/* Scrapbook data layer, client-side.
   1. Builds the <article> pages from data/scrapbook-data.js (this used to be the Django template loop).
   2. Layers on anything added through "Add Memory" on this device (kept in IndexedDB, photos included).
   3. Handles the Add Memory form (this used to be the add_scrapbook_memory view).
   4. Then loads scrapbook-book.js, which turns the pages into the book. */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const SEED = window.SCRAPBOOK_PAGES || [];
  const PHOTO_TILTS = [-2.5, 1.7, -1.2, 2.2];
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const niceDate = iso => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || ''); return m ? (+m[3]) + ' ' + MONTHS[+m[2] - 1] + ' ' + m[1] : ''; };
  function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  /* ---------- IndexedDB (photos are too big for localStorage) ---------- */
  const DB = 'vd-scrapbook', STORE = 'kv', OKEY = 'overlay';
  let memoryOnly = null;      // fallback if the browser blocks IndexedDB
  function openDb() {
    return new Promise((res, rej) => {
      try {
        const rq = indexedDB.open(DB, 1);
        rq.onupgradeneeded = () => rq.result.createObjectStore(STORE);
        rq.onsuccess = () => res(rq.result);
        rq.onerror = () => rej(rq.error);
      } catch (e) { rej(e); }
    });
  }
  async function loadOverlay() {
    try {
      const db = await openDb();
      return await new Promise(res => {
        const rq = db.transaction(STORE).objectStore(STORE).get(OKEY);
        rq.onsuccess = () => res(rq.result || { pages: {}, photos: [] });
        rq.onerror = () => res({ pages: {}, photos: [] });
      });
    } catch (e) { return { pages: {}, photos: [] }; }
  }
  async function saveOverlay(o) {
    const db = await openDb();
    await new Promise((res, rej) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(o, OKEY);
      tx.oncomplete = res; tx.onerror = () => rej(tx.error); tx.onabort = () => rej(tx.error);
    });
  }

  /* ---------- merge seed + overlay ---------- */
  function merge(overlay) {
    const map = new Map();
    SEED.forEach(p => map.set(p.page, Object.assign({}, p, { photos: p.photos.map(x => Object.assign({}, x)) })));
    Object.keys(overlay.pages).sort((a, b) => a - b).forEach(k => {
      const n = +k, o = overlay.pages[k];
      let p = map.get(n);
      if (!p) { p = { page: n, title: 'A new page', subtitle: '', date: null, note: '', paper: 'cream', doodle: '♡', photos: [] }; map.set(n, p); }
      ['title', 'subtitle', 'note', 'date'].forEach(f => { if (o[f]) p[f] = o[f]; });
    });
    overlay.photos.forEach(ph => { const p = map.get(ph.page); if (p) p.photos.push({ slot: ph.slot, src: ph.data, caption: ph.caption, sticker: ph.sticker, rotation: ph.rotation }); });
    return [...map.values()].sort((a, b) => a.page - b.page).map(p => { p.photos.sort((a, b) => a.slot - b.slot); return p; });
  }

  /* ---------- build the page elements ---------- */
  function buildPage(p) {
    const photos = p.photos.slice(0, 4);
    const a = el('article', 'sb-page th-' + (((p.page - 1) % 8) + 1) + ' n-' + p.photos.length);
    a.dataset.page = p.page; a.dataset.n = p.photos.length; a.dataset.title = p.title;
    a.appendChild(el('div', 'sb-paper'));
    const head = el('header', 'sb-head');
    head.appendChild(el('p', 'sb-date', p.date ? niceDate(p.date) : 'a day worth keeping'));
    head.appendChild(el('h2', 'sb-title', p.title));
    if (p.subtitle) head.appendChild(el('p', 'sb-sub', p.subtitle));
    head.appendChild(el('i', 'sb-squig'));
    a.appendChild(head);
    const wrap = el('div', 'sb-photos');
    photos.forEach((ph, i) => {
      const fig = el('figure', 'sb-photo ph-' + (i + 1));
      fig.style.setProperty('--rot', (ph.rotation || 0) + 'deg');
      fig.tabIndex = 0; fig.setAttribute('role', 'button');
      fig.setAttribute('aria-label', 'Look closer: ' + (ph.caption || p.title));
      fig.appendChild(el('span', 'sb-tape'));
      const box = el('div', 'sb-img');
      const img = document.createElement('img');
      img.src = /^data:/.test(ph.src) ? ph.src : encodeURI(ph.src);
      img.alt = ph.caption || p.title; img.loading = 'lazy'; img.draggable = false;
      // photo file not uploaded yet → soft placeholder instead of a broken-image icon
      img.addEventListener('error', () => fig.classList.add('img-missing'));
      box.appendChild(img); fig.appendChild(box);
      if (ph.sticker) fig.appendChild(el('span', 'sb-pstick', ph.sticker));
      fig.appendChild(el('figcaption', null, ph.caption || ''));
      wrap.appendChild(fig);
    });
    a.appendChild(wrap);
    const note = el('div', 'sb-note' + (p.note ? '' : ' is-empty'));
    note.appendChild(el('p', null, p.note ? '“' + p.note + '”' : 'write a tiny thought here someday…'));
    a.appendChild(note);
    const foot = el('footer', 'sb-foot');
    foot.appendChild(el('span', null, 'made with too much love'));
    foot.appendChild(el('b', 'sb-pageno', String(p.page)));
    a.appendChild(foot);
    a.appendChild(el('div', 'sb-decos'));
    return a;
  }

  function loadScript(src) {
    return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.body.appendChild(s); });
  }

  /* ---------- photo handling ---------- */
  function shrink(file) {
    return new Promise((res, rej) => {
      const url = URL.createObjectURL(file), img = new Image();
      img.onload = () => {
        const max = 1600, k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
        const c = document.createElement('canvas');
        c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url); res(c.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('unreadable image')); };
      img.src = url;
    });
  }

  (async function init() {
    const overlay = await loadOverlay();
    let pages = merge(overlay);
    const src = $('#sbSource');
    pages.forEach(p => src.appendChild(buildPage(p)));

    const S = window.SITE || {};
    const nm = S.name || 'Us';
    ['#sbNames', '#sbName2'].forEach(s => { const e = $(s); if (e) e.textContent = nm; });
    const next = (pages.length ? pages[pages.length - 1].page : 0) + 1;
    const nn = $('#sbNextNum'); if (nn) nn.textContent = next;
    const pi = $('input[name="page_number"]'); if (pi) { pi.max = next; pi.value = next; }

    // Cover photo: static/relationship/img/cover.jpg is picked up by the book script via data-cover.
    await loadScript('static/relationship/js/scrapbook-book.js?v=1');

    /* ---------- Add Memory form ---------- */
    const form = $('#memoryForm');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = $('.save-memory', form); const label = btn.innerHTML; btn.disabled = true; btn.textContent = 'sticking it in…';
      try {
        const fd = new FormData(form);
        const last = pages.length ? pages[pages.length - 1].page : 0;
        let pn = parseInt(fd.get('page_number'), 10); if (Number.isNaN(pn)) pn = last + 1;
        pn = Math.max(1, Math.min(last + 1, pn));    // an existing page, or exactly one past the end

        const title = String(fd.get('title') || '').trim().slice(0, 200);
        const entry = overlay.pages[pn] || (overlay.pages[pn] = {});
        if (title) entry.title = title; else if (!pages.some(p => p.page === pn) && !entry.title) entry.title = 'A new page';
        const subtitle = String(fd.get('subtitle') || '').trim().slice(0, 300); if (subtitle) entry.subtitle = subtitle;
        const note = String(fd.get('note') || '').trim(); if (note) entry.note = note;
        const date = String(fd.get('date') || ''); if (date) entry.date = date;

        const page = pages.find(p => p.page === pn);
        const used = new Set(page ? page.photos.map(p => p.slot) : []);
        const free = [1, 2, 3, 4].filter(s => !used.has(s));
        const files = [...($('#memoryPhotos').files || [])].slice(0, 4);
        for (let i = 0; i < Math.min(files.length, free.length); i++) {
          let data;
          try { data = await shrink(files[i]); } catch (err) { alert('Could not read "' + files[i].name + '" as an image, skipping it.'); continue; }
          overlay.photos.push({
            page: pn, slot: free[i], data,
            caption: String(fd.get('caption_' + (i + 1)) || '').trim().slice(0, 240),
            sticker: String(fd.get('sticker_' + (i + 1)) || '').trim().slice(0, 30),
            rotation: PHOTO_TILTS[free[i] - 1]
          });
        }
        await saveOverlay(overlay);
        location.href = 'scrapbook.html?page=' + pn;
      } catch (err) {
        console.error(err);
        alert("This browser won't let the site save memories here (private window or blocked storage?). Nothing was saved.");
        btn.disabled = false; btn.innerHTML = label;
      }
    });
  })();
})();
