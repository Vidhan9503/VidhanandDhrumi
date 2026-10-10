/* Our Scrapbook: builds the book, turns the pages, scatters the stickers.
   Edit CONFIG to change GIFs / stickers / captions. */
(() => {
  // ───────────────────────── CONFIG ─────────────────────────
  const CONFIG = {
    // GIFs shown as little polaroids on pages that have spare room.
    // Giphy IDs (the part after /gifs/...- or /embed/). Add as many as you like.
    gifPolaroids: [
      'ctYTdedVEHMm7RtSPJ', 'Tga4sDdqQGONpPeNsS', 'IMsYsbxpYRbSpMysqA', 'nmoa5PhT4A7spH7CIj',
      'QTCSUv7EL1rXyBx8Mc', 'Bc4oup2pdP5iKFAYiF', 'KztT2c4u8mYYUiMKdJ', 's6Ru4Jpl7EJkjyjq75',
      'ewginQ7Ny9BXSElV0m', 'iUYkb29OtCeOgsnhnI', 'g9wyTh6aWsCGzu4NgY', 'Ztx4jkpPl6umQ'
    ],
    gifCaptions: ['us, probably', 'me when I see you', 'evidence', 'mood', 'this one is you', 'us at 2am',
                  'a normal tuesday', 'zero notes', 'accurate', 'obsessed', 'caught on camera', 'no thoughts, just you'],
    
    // Your own GIFs, page by page. Key = page number.
    // Value = Giphy link, Giphy ID, or a list. Use { id, caption, x, y, w, rot } for control
    // (x/y/w in cqw; x counts from the spine side).  [] = no GIF on that page.
    pageGifs: {
      // 3: 'https://giphy.com/gifs/cat-love-KztT2c4u8mYYUiMKdJ',
      // 5: [{ id: 'ctYTdedVEHMm7RtSPJ', caption: 'our first trip' }, 'IMsYsbxpYRbSpMysqA'],
      // 9: [],
    },

    // Transparent animated stickers (search "stickers" on Giphy). Leave [] until you have some.
    randomGifs: true,   // pages not listed above still get a random GIF when there's room


    stickerGifs: [],
    chips: ['♡ ours', 'keep this one', 'so us', 'core memory', 'good day', 'yes, this one', 'soft launch', 'main character'],
    turnMs: 1400
  };
  // ──────────────────────────────────────────────────────────

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = matchMedia('(max-width: 760px)');

  const book = $('#sbBook'), leavesEl = $('#sbLeaves'), stage = $('#sbStage'), src = $('#sbSource');
  const coverLeaf = $('#sbCoverLeaf');
  if (!book || !src) return;
  if (reduced) book.style.setProperty('--dur', '.01s');
  else book.style.setProperty('--dur', CONFIG.turnMs + 'ms');
  const DUR = reduced ? 20 : CONFIG.turnMs;

  /* ---------- tiny helpers ---------- */
  function rng(seed) {
    return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  const pick = (arr, r) => arr[Math.floor(r() * arr.length)];
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const gifId = s => { const m = String(s).match(/giphy\.com\/(?:gifs|stickers|embed|media)\/(?:[\w-]*-)?([A-Za-z0-9]{8,})(?:[\/?#.]|$)/i); return m ? m[1] : s; };
  const gifUrl = s => { s = String(s).trim(); 
    const id = gifId(s); return (/^https?:/i.test(s) && id === s) ? s : `https://media.giphy.com/media/${id}/giphy.gif`; };

  /* ---------- sticker kits per paper ---------- */
  const KITS = {
    1: ['🌸', '💗', '🎀', '✨', '🍓', '💌', '🧸'],
    2: ['☕', '🍪', '📖', '🕊️', '🌼', '✉️', '🪴'],
    3: ['⭐', '🌻', '🐝', '🍋', '☀️', '🧇', '🎈'],
    4: ['☁️', '🦋', '🌊', '🫧', '🐬', '💙', '⛅'],
    5: ['🔮', '🦄', '💜', '🌙', '🪻', '🎧', '✨'],
    6: ['🌿', '🍀', '🐸', '🍃', '🌱', '🍵', '🐛'],
    7: ['🍑', '🧡', '🍦', '🎞️', '📷', '🌷', '🦊'],
    8: ['🌌', '⭐', '🦢', '🪐', '🕯️', '💫', '🫶']
  };
  // [side (o = outer edge, i = inner), distance from that edge (cqw), top (cqw)]
  const SLOTS = [['o', 5, 3], ['o', 12, 17], ['o', 1, 57], ['o', 2, 91], ['o', 6, 105]];
  const ANIMS = ['sbFloat', 'sbWig', 'sbPulse', 'sbFloat'];

  function decorate(page, face) {
    const decos = $('.sb-decos', page);
    if (!decos) return;
    const num = parseInt(page.dataset.page || '0', 10) || (face === 'end' ? 99 : 7);
    const theme = parseInt((page.className.match(/th-(\d)/) || [0, 1])[1], 10) || 1;
    const r = rng(num * 7919 + 13);
    const kit = KITS[theme] || KITS[1];
    SLOTS.forEach(([side, s, y], k) => {
      const useGif = CONFIG.stickerGifs.length && r() < .45 && (k === 0 || k === 3);
      const b = el('button', `sb-deco ${side}`);
      b.type = 'button'; b.setAttribute('aria-label', 'sticker');
      b.style.setProperty('--s', s + 'cqw');
      b.style.setProperty('--y', (y + (r() * 3 - 1.5)).toFixed(1) + 'cqw');
      b.style.setProperty('--r', ((r() * 40 - 20) | 0) + 'deg');
      b.style.setProperty('--dd', (3 + r() * 3).toFixed(1) + 's');
      b.style.setProperty('--dl', (-r() * 4).toFixed(1) + 's');
      b.style.setProperty('--anim', pick(ANIMS, r));
      if (useGif) {
        const im = el('img'); im.alt = ''; im.draggable = false; im.dataset.src = gifUrl(pick(CONFIG.stickerGifs, r));
        im.style.setProperty('--gs', (14 + r() * 6) + 'cqw'); b.appendChild(im);
      } else {
        b.style.setProperty('--fs', (7 + r() * 3.6).toFixed(1) + 'cqw');
        b.textContent = pick(kit, r);
      }
      b.dataset.nopage = '1';
      decos.appendChild(b);
    });
    // one text chip tucked against the note
    const chip = el('button', 'sb-deco chip i sb-chip', pick(CONFIG.chips, r));
    chip.type = 'button';
    chip.style.setProperty('--s', (8 + r() * 5).toFixed(1) + 'cqw');
    chip.style.setProperty('--y', '107.5cqw');
    chip.style.setProperty('--r', ((r() * 10 - 5) | 0) + 'deg');
    chip.dataset.nopage = '1';
    decos.appendChild(chip);
  }

  /* ---------- extras that fill empty space (GIF polaroids, "add a photo") ---------- */
  // [width, x from spine, y, tilt] for the Nth GIF, by how many photos the page has
  const GIF_SLOTS = {
    0: [[44, 48, 24, 3], [30, 8, 58, -3]],
    1: [[32, 58, 40, 4], [26, 6, 56, -4]],
    2: [[24, 8, 53, -4]],
    3: [[24, 72, 52, 3]],
    4: [[22, 39, 30, 2]]
  };

  function addExtras(page) {
    const n = parseInt(page.dataset.n || '0', 10);
    const num = parseInt(page.dataset.page || '0', 10) || 5;
    const wrap = $('.sb-photos', page);
    if (!wrap) return;
    const r = rng(num * 104729 + 3);
    if (n === 0) {
      const add = el('button', 'sb-photo sb-addp ex-add', '<span class="sb-tape"></span><div class="sb-img"><span>＋</span><b>your photo here</b><small>tap to stick one in</small></div><figcaption></figcaption>');
      add.type = 'button'; add.dataset.addpage = num; add.dataset.nopage = '1';
      wrap.appendChild(add);
    }
    const mine = CONFIG.pageGifs[num];
    let list = [];
    if (mine !== undefined) list = [].concat(mine);
    else if (CONFIG.randomGifs && CONFIG.gifPolaroids.length && n <= 1) list = [pick(CONFIG.gifPolaroids, r)];
    list.forEach((g, k) => {
      g = typeof g === 'string' ? { id: g } : g;
      const slot = (GIF_SLOTS[Math.min(n, 4)] || [])[k] || [24, 38, 30, 0];
      const f = el('figure', 'sb-photo sb-gifp ex-gif');
      f.style.setProperty('--w', (g.w ?? slot[0]) + 'cqw');
      f.style.setProperty('--x', (g.x ?? slot[1]) + 'cqw');
      f.style.setProperty('--y', (g.y ?? slot[2]) + 'cqw');
      f.style.setProperty('--b', (g.rot ?? slot[3]) + 'deg');
      f.dataset.nopage = '1';
      f.innerHTML = '<span class="sb-tape"></span><div class="sb-img"><img alt="" draggable="false"></div><figcaption></figcaption>';
      $('img', f).dataset.src = gifUrl(g.id);
      $('figcaption', f).textContent = g.caption ?? pick(CONFIG.gifCaptions, r);
      wrap.appendChild(f);
    });
    if (n === 2 && CONFIG.stickerGifs.length) {
      const g = el('div', 'sb-gifs ex-stk'); g.dataset.nopage = '1';
      const im = el('img'); im.alt = ''; im.draggable = false; im.dataset.src = gifUrl(pick(CONFIG.stickerGifs, r));
      g.appendChild(im); wrap.appendChild(g);
    }
  }
  /* ---------- special pages ---------- */
  function blankPage(kind) {
    const a = el('article', 'sb-page th-1 sb-end-page');
    a.dataset.page = '';
    const body = {
      start: '<h2>page one is waiting</h2><p>the first memory goes right here ♡</p><button class="sb-endbtn" type="button" data-addpage="1" data-nopage="1">＋ add a memory</button>',
      end: '<h2>want more<br>pages? ♡</h2><p>the book can grow forever.</p><button class="sb-endbtn" type="button" data-addpage="new" data-nopage="1">＋ add a new page</button>',
      blank: '<p style="font-size:14cqw">♡</p>'
    }[kind];
    a.innerHTML = '<div class="sb-paper"></div><div class="sb-end-in">' + body + '</div><footer class="sb-foot"><span>to be continued</span><b class="sb-pageno">∞</b></footer><div class="sb-decos"></div>';
    return a;
  }

  /* ---------- assemble the leaves ---------- */
  const pages = $$('.sb-page', src);
  const N = pages.length;
  const L = Math.floor(N / 2) + 1;
  const leaves = [coverLeaf];
  

  function makeFace(page, right) {
    const face = el('div', 'sb-face ' + (right ? 'sb-front' : 'sb-back'));
    page.classList.add(right ? 'sb-right' : 'sb-left');
    face.appendChild(page);
    face.appendChild(el('i', 'sb-curl'));
    if (page.dataset.n != null) addExtras(page);
    decorate(page);
    return face;
  }
  for (let j = 0; j < L; j++) {
    const leaf = el('div', 'sb-leaf');
    const front = pages[2 * j] || blankPage(N === 0 ? 'start' : 'end');
    const back = pages[2 * j + 1] || blankPage(pages[2 * j] ? 'end' : 'blank');
    leaf.appendChild(makeFace(front, true));
    leaf.appendChild(makeFace(back, false));
    leavesEl.appendChild(leaf);
    leaves.push(leaf);
  }
  const total = leaves.length;            // cover + L leaves
  const MAXF = L + 1;                      // everything turned
  src.remove();

  // cover: your cover.jpg first, otherwise the first real photo (never a GIF), otherwise the ♡
  const ph = $('#sbCoverPhoto');
  function showCover(url, onFail) {
    const probe = new Image();
    probe.onload = () => { ph.textContent = ''; ph.style.backgroundImage = `url("${url}")`; };
    if (onFail) probe.onerror = onFail;
    probe.src = url;
  }
  
  function firstPhotoCover() {
    const real = $('.sb-photo:not(.sb-gifp) .sb-img img', leavesEl);
    if (real) showCover(real.getAttribute('src') || real.dataset.src);
  }
  if (ph && ph.dataset.cover) showCover(ph.dataset.cover, firstPhotoCover);
  else if (ph) firstPhotoCover();

  /* ---------- state ---------- */
  let f = 0;            // how many leaves have been turned (cover counts as 1)
  let side = 'R';       // phone only: which half of the open book is on screen
  let lockUntil = 0;
  const locked = () => performance.now() < lockUntil;

  const progress = $('#sbProgress'), jump = $('#sbJump');
  const prevBtns = [$('#sbPrev'), $('#sbPrev2')], nextBtns = [$('#sbNext'), $('#sbNext2')];

  function zFor(i) { return leaves[i].classList.contains('is-flipped') ? i : total - i; }
  function layoutZ() { leaves.forEach((lf, i) => { if (!lf.classList.contains('turning')) lf.style.zIndex = zFor(i); }); }

  /* page numbers for the two faces on screen */
  function visiblePages() {
    if (f === 0) return { left: 0, right: 0 };
    const left = f >= 2 ? 2 * f - 2 : 0, right = 2 * f - 1;
    return { left: left <= N ? left : 0, right: right <= N ? right : 0 };
  }

  function whoosh() {
    if (!soundOn || reduced) return;
    try {
      const ctx = whoosh.ctx || (whoosh.ctx = new (window.AudioContext || window.webkitAudioContext)());
      const len = ctx.sampleRate * .6, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const s = ctx.createBufferSource(); s.buffer = buf;
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = .8;
      bp.frequency.setValueAtTime(500, ctx.currentTime); bp.frequency.exponentialRampToValueAtTime(3200, ctx.currentTime + .5);
      const g = ctx.createGain(); g.gain.setValueAtTime(.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(.16, ctx.currentTime + .15); g.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + .6);
      s.connect(bp); bp.connect(g); g.connect(ctx.destination); s.start();
    } catch (e) {}
  }

  function hydrate() {
    // load images for the spread on screen plus a little either side
    for (let i = Math.max(0, f - 3); i <= Math.min(total - 1, f + 2); i++) {
      $$('img[data-src]', leaves[i]).forEach(im => {
        im.src = im.dataset.src; delete im.dataset.src;
        im.addEventListener('error', () => { const p = im.closest('.sb-gifp, .sb-gifs, .sb-deco'); if (p) p.remove(); });
      });
    }
  }

  function updateUI(instant) {
    const state = f === 0 ? 'closed' : f === MAXF ? 'ended' : 'open';
    book.dataset.state = state;
    let shift;
    if (mobile.matches) shift = side === 'R' ? '-25%' : '25%';
    else shift = f === 0 ? '-25%' : f === MAXF ? '25%' : '0%';
    book.style.setProperty('--shift', shift);
    if (f !== 0) { book.style.setProperty('--tx', '0deg'); book.style.setProperty('--ty', '0deg'); }
    book.style.setProperty('--fl', (f / MAXF * 1.2).toFixed(3));
    book.style.setProperty('--rem', ((MAXF - f) / MAXF * 1.2).toFixed(3));

    const vp = visiblePages();
    let label;
    if (f === 0) label = 'cover';
    else if (f === MAXF) label = 'the end ♡';
    else if (mobile.matches) { const p = side === 'L' ? vp.left : vp.right; label = p ? `page ${p} / ${N}` : 'page ♡'; }
    else if (vp.left && vp.right) label = `pages ${vp.left}–${vp.right} / ${N}`;
    else label = `page ${vp.left || vp.right} / ${N}`;
    progress.textContent = label;

    const atStart = f === 0 && side === 'R';
    const atEnd = f === MAXF && (!mobile.matches || side === 'R');
    prevBtns.forEach(b => b.disabled = atStart);
    nextBtns.forEach(b => b.disabled = atEnd);
    const cur = mobile.matches ? (side === 'L' ? vp.left : vp.right) : (vp.right || vp.left);
    if (cur) jump.value = String(cur); else jump.value = '';
    hydrate();
  }

  function turnLeaf(i, toFlipped) {
    const lf = leaves[i];
    lf.classList.add('turning');
    lf.style.zIndex = 900;
    lf.classList.toggle('is-flipped', toFlipped);
    whoosh();
    setTimeout(() => { lf.classList.remove('turning'); lf.style.zIndex = zFor(i); }, DUR + 60);
  }

  function setF(newF, newSide, instant) {
    newF = Math.max(0, Math.min(MAXF, newF));
    const dir = newF > f ? 1 : -1;
    const idx = [];
    for (let i = f; i !== newF; i += dir) idx.push(dir > 0 ? i : i - 1);
    if (instant) { idx.forEach(i => leaves[i].classList.toggle('is-flipped', dir > 0)); layoutZ(); }
    else {
      const step = Math.min(170, 900 / Math.max(1, idx.length));
      idx.forEach((li, k) => setTimeout(() => turnLeaf(li, dir > 0), k * step));
      lockUntil = performance.now() + 650 + idx.length * step * .5;
    }
    f = newF;
    side = newSide || (f === 0 ? 'R' : side);
    updateUI();
  }

  function next() {
    if (locked()) return;
    if (mobile.matches) {
      if (f >= 1 && side === 'L') { side = 'R'; lockUntil = performance.now() + 450; return updateUI(); }
      if (f < MAXF) return setF(f + 1, f + 1 >= 2 ? 'L' : 'R');
      return;
    }
    if (f < MAXF) setF(f + 1);
  }
  function prev() {
    if (locked()) return;
    if (mobile.matches) {
      if (f >= 2 && side === 'R') { side = 'L'; lockUntil = performance.now() + 450; return updateUI(); }
      if (f >= 1) return setF(f - 1, 'R');
      return;
    }
    if (f > 0) setF(f - 1);
  }
  function goToPage(p, instant) {
    p = Math.max(1, Math.min(N, p));
    setF(Math.floor(p / 2) + 1, p % 2 === 0 ? 'L' : 'R', instant);
  }

  /* ---------- input ---------- */
  prevBtns.forEach(b => b.addEventListener('click', prev));
  nextBtns.forEach(b => b.addEventListener('click', next));
  document.addEventListener('keydown', e => {
    if (e.target.closest && e.target.closest('input,textarea,select')) return;
    if (e.key === 'Escape') { closeLight(); closeModal(); }
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  leavesEl.addEventListener('click', e => {
    const ph = e.target.closest('.sb-photo:not(.sb-gifp):not(.sb-addp)');
    if (ph) { openLight(ph); return; }
    const add = e.target.closest('[data-addpage]');
    if (add) { const v = add.dataset.addpage; openModal(v === 'new' ? N + 1 : v ? parseInt(v, 10) : null); return; }
    const deco = e.target.closest('.sb-deco');
    if (deco) { popDeco(deco, e); return; }
    if (e.target.closest('[data-nopage]')) return;
    const face = e.target.closest('.sb-face');
    if (!face) return;
    if (face.id === 'sbCover') { if (f === 0) setF(1, 'R'); return; }
    if (face.classList.contains('sb-endpaper')) { prev(); return; }
    face.classList.contains('sb-front') ? next() : prev();
  });
  $('#sbCover').addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (f === 0) setF(1, 'R'); } });
  leavesEl.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.sb-photo:not(.sb-gifp):not(.sb-addp)')) { e.preventDefault(); openLight(e.target); }
  });

  // swipe
  let sx = null, sy = null;
  stage.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  stage.addEventListener('touchend', e => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) dx < 0 ? next() : prev();
    sx = sy = null;
  }, { passive: true });

  // the closed book leans toward the cursor
  if (!reduced) stage.addEventListener('pointermove', e => {
    if (f !== 0 || mobile.matches || e.pointerType === 'touch') return;
    const r = stage.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - .5, ny = (e.clientY - r.top) / r.height - .5;
    book.style.setProperty('--ty', (nx * 9).toFixed(1) + 'deg');
    book.style.setProperty('--tx', (-ny * 7).toFixed(1) + 'deg');
  });
  stage.addEventListener('pointerleave', () => { if (f === 0) { book.style.setProperty('--ty', '0deg'); book.style.setProperty('--tx', '0deg'); } });
  mobile.addEventListener('change', () => { side = f === 0 ? 'R' : 'L'; updateUI(); });

  /* ---------- fun ---------- */
  const fx = el('div', 'sb-fx'); document.body.appendChild(fx);
  function burst(x, y, n = 8, pool = ['♡', '✦', '💖', '✨', '🌸']) {
    if (reduced) n = 3;
    for (let i = 0; i < n; i++) {
      const s = el('span', 'sb-bit', pick(pool, Math.random));
      const a = Math.random() * Math.PI * 2, d = 40 + Math.random() * 90;
      s.style.left = x + 'px'; s.style.top = y + 'px'; s.style.fontSize = (14 + Math.random() * 14) + 'px';
      s.style.setProperty('--dx', Math.cos(a) * d + 'px'); s.style.setProperty('--dy', Math.sin(a) * d - 30 + 'px');
      s.style.setProperty('--r', (Math.random() * 120 - 60) + 'deg');
      fx.appendChild(s); setTimeout(() => s.remove(), 1200);
    }
  }
  function popDeco(d, e) {
    d.classList.remove('pop'); void d.offsetWidth; d.classList.add('pop');
    setTimeout(() => d.classList.remove('pop'), 600);
    burst(e.clientX, e.clientY, 7);
  }

  /* ---------- lightbox ---------- */
  const light = $('#sbLight'), lightImg = $('#sbLightImg'), lightCap = $('#sbLightCap');
  function openLight(fig) {
    const im = $('img', fig); if (!im) return;
    lightImg.src = im.currentSrc || im.src; lightImg.alt = im.alt;
    lightCap.textContent = ($('figcaption', fig) || {}).textContent || '';
    light.classList.add('show'); light.setAttribute('aria-hidden', 'false');
  }
  function closeLight() { light.classList.remove('show'); light.setAttribute('aria-hidden', 'true'); }
  light.addEventListener('click', closeLight);

  /* ---------- sound toggle ---------- */
  let soundOn = false;
  try { soundOn = localStorage.getItem('sbSound') === '1'; } catch (e) {}
  const soundBtn = $('#sbSound');
  function paintSound() { soundBtn.textContent = soundOn ? '🔊' : '🔈'; soundBtn.setAttribute('aria-pressed', String(soundOn)); }
  soundBtn.addEventListener('click', () => { soundOn = !soundOn; try { localStorage.setItem('sbSound', soundOn ? '1' : '0'); } catch (e) {} paintSound(); if (soundOn) whoosh(); });
  paintSound();

  /* ---------- jump menu ---------- */
  (function buildJump() {
    $$('.sb-page[data-page]', leavesEl).forEach(p => {
      const n = parseInt(p.dataset.page, 10); if (!n) return;
      if ($(`option[value="${n}"]`, jump)) return;
      const o = el('option'); o.value = n; o.textContent = `${n} · ${p.dataset.title || 'page'}`; jump.appendChild(o);
    });
    const opts = $$('option', jump).slice(1).sort((a, b) => a.value - b.value);
    opts.forEach(o => jump.appendChild(o));
    jump.addEventListener('change', () => { if (jump.value) goToPage(parseInt(jump.value, 10)); });
  })();

  /* ---------- add-memory modal (unchanged behaviour) ---------- */
  const modal = $('#memoryModal'), photoInput = $('#memoryPhotos'), captionFields = $('#photoCaptionFields');
  const pageInput = $('input[name="page_number"]');
  function openModal(pageNum) {
    if (pageInput) {
      let p = pageNum;
      if (!p) { const vp = visiblePages(); p = mobile.matches ? (side === 'L' ? vp.left : vp.right) : (vp.right || vp.left); }
      pageInput.max = N + 1;
      pageInput.value = Math.max(1, Math.min(N + 1, p || N + 1));
    }
    modal.classList.add('show'); modal.setAttribute('aria-hidden', 'false'); document.body.classList.add('modal-open');
    setTimeout(() => { const t = modal.querySelector('input[name="title"]'); if (t) t.focus(); }, 100);
  }
  function closeModal() { modal.classList.remove('show'); modal.setAttribute('aria-hidden', 'true'); document.body.classList.remove('modal-open'); }
  $('#openMemoryModal').addEventListener('click', () => openModal(null));
  $$('[data-close-modal]').forEach(b => b.addEventListener('click', closeModal));
  photoInput.addEventListener('change', () => {
    const files = [...photoInput.files].slice(0, 4);
    const dt = new DataTransfer(); files.forEach(file => dt.items.add(file)); photoInput.files = dt.files;
    captionFields.innerHTML = files.map((file, i) => `<label class="caption-line"><span>${i + 1}. ${file.name.replace(/[<>&"]/g, '')}</span><input name="caption_${i + 1}" maxlength="240" placeholder="little caption…"><input class="sticker-mini" name="sticker_${i + 1}" maxlength="10" placeholder="♡"></label>`).join('');
  });

  let resizeTimer;
  addEventListener('resize', () => {
    book.classList.add('no-anim');
    document.documentElement.classList.add('sb-resizing');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document.documentElement.classList.remove('sb-resizing');
      requestAnimationFrame(() => book.classList.remove('no-anim'));
    }, 250);
  });

  /* ---------- start ---------- */
  book.classList.add('no-anim');
  layoutZ();
  const wanted = parseInt(new URLSearchParams(location.search).get('page') || '', 10);
  if (wanted > 0 && N) goToPage(wanted, true); else updateUI();
  requestAnimationFrame(() => requestAnimationFrame(() => book.classList.remove('no-anim')));
})();