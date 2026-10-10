/* Birthday gate: love quiz, runaway "No" button, GIF pop-ups, emoji effects.
   Edit CONFIG below to change questions, texts and GIFs. */
(() => {
  // ───────────────────────── CONFIG ─────────────────────────
  const CONFIG = {
    // Paste a Giphy ID (e.g. "KztT2c4u8mYYUiMKdJ"), a giphy embed URL,
    // or a direct image URL (.gif/.webp). Leave '' to show the emoji fallback.
    gifs: {
      yay: 'ctYTdedVEHMm7RtSPJ',
      sad: 'Tga4sDdqQGONpPeNsS',
      shy: 'IMsYsbxpYRbSpMysqA',
      dramatic: 'Ztx4jkpPl6umQ',
      wrong: 'Bc4oup2pdP5iKFAYiF',
      win: 'nmoa5PhT4A7spH7CIj',
      cheeky: 'QTCSUv7EL1rXyBx8Mc'
    },
    fallback: { yay: '🥳', sad: '🥺', shy: '🙈', dramatic: '🎭', wrong: '🙅‍♀️', win: '💖', cheeky: '😏' },

    puzzle: { image: '/static/relationship/img/puzzle.jpg', size: 4 },

    questions: [
        { type: 'choice', q: 'first, important question: how cute am I?', options: [
          { t: 'adorable', gif: 'shy', say: 'correct. you know things ♡' },
          { t: 'very, obviously', gif: 'cheeky', say: 'good. keep going.' },
          { t: 'cutest in the world', gif: 'yay', say: 'you may proceed.' } ] },
        { type: 'choice', q: 'how much do you miss me?', options: [
          { t: 'a little', gif: 'sad', say: 'a LITTLE?? we will discuss this.' },
          { t: 'a lot', gif: 'shy', say: 'aww ♡' },
          { t: 'unreasonably much', gif: 'yay', say: 'same. embarrassingly same.' } ] },
        { type: 'meter', q: 'rate your birthday excitement' },
        { type: 'puzzle', q: 'oops, our picture fell apart. fix it?' },
        { type: 'runaway', q: 'last one… do you love me?', yes: 'yes ♡', no: 'no' }
      ],

    noLabels: ['no', 'are you sure?', 'think again', 'wrong button', 'nice try', 'too slow', 'hehe', "can't catch me", 'stop it', 'last chance', '…fine'],
    noSays: ['hmm?', 'that button is broken.', 'it ran away, sorry.', 'you can try again.', 'the Yes button is getting bigger.', 'ok that was close.', 'it really doesn\'t want to be clicked.'],
    dodgeGifs: ['sad', 'dramatic', 'cheeky'],
    maxDodges: 12
  };
  // ──────────────────────────────────────────────────────────

  const FALLBACK_ART = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#ffdfe6'/><stop offset='1' stop-color='#fff0ad'/></linearGradient></defs><rect width='300' height='300' fill='url(#g)'/><path d='M150 225C60 160 65 80 118 80c20 0 32 13 32 25 0-12 12-25 32-25 53 0 58 80-32 145z' fill='#d98e9c'/><text x='150' y='275' font-size='38' text-anchor='middle' fill='#8d4d62' font-family='Georgia,serif' font-style='italic'>us</text></svg>");

  function squareCrop(img) {
    const s = Math.min(img.naturalWidth, img.naturalHeight), c = document.createElement('canvas');
    c.width = c.height = 600;
    c.getContext('2d').drawImage(img, (img.naturalWidth - s) / 2, (img.naturalHeight - s) / 2, s, s, 0, 0, 600, 600);
    return c.toDataURL('image/jpeg', .85);
  }
  const $ = (s, r = document) => r.querySelector(s);
  const quiz = $('#loveQuiz');
  if (!quiz) return;
  const form = $('.gate-form');
  const gated = !!form;               // password still needed
  const showQuestions = document.querySelector('#websiteGate')?.dataset.showQuestions !== 'false';
  const divider = $('.gate-divider');
  const card = $('.gate-card');
  const msg = $('#gateMessage');
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const KEY = 'loveQuizDone';

  const store = {
    get() { try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return false; } },
    set() { try { sessionStorage.setItem(KEY, '1'); } catch (e) {} }
  };

  // effect layers
  const fx = document.createElement('div'); fx.className = 'fx-layer'; document.body.appendChild(fx);
  const toast = document.createElement('div'); toast.className = 'gif-toast'; toast.setAttribute('aria-live', 'polite');
  document.body.appendChild(toast);
  toast.addEventListener('click', () => toast.classList.remove('show'));

  const center = el => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };

  function burst(x, y, n = 14, pool = ['♡', '✦', '✿', '💖', '✨']) {
    if (calm) n = Math.min(n, 3);
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      s.className = 'fx-bit';
      s.textContent = pool[(Math.random() * pool.length) | 0];
      const a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 120;
      s.style.left = x + 'px'; s.style.top = y + 'px';
      s.style.fontSize = (15 + Math.random() * 16) + 'px';
      s.style.setProperty('--dx', Math.cos(a) * d + 'px');
      s.style.setProperty('--dy', Math.sin(a) * d - 40 + 'px');
      s.style.setProperty('--r', (Math.random() * 120 - 60) + 'deg');
      fx.appendChild(s);
      setTimeout(() => s.remove(), 1200);
    }
  }

  function rain(n = 44) {
    if (calm) n = 8;
    const pool = ['💖', '🎉', '✨', '♡', '🎂', '🌸', '🥳', '💌'];
    for (let i = 0; i < n; i++) {
      setTimeout(() => {
        const s = document.createElement('span');
        s.className = 'fx-fall';
        s.textContent = pool[(Math.random() * pool.length) | 0];
        s.style.left = Math.random() * 100 + 'vw';
        s.style.fontSize = (18 + Math.random() * 22) + 'px';
        s.style.animationDuration = (2.2 + Math.random() * 2) + 's';
        fx.appendChild(s);
        setTimeout(() => s.remove(), 4500);
      }, i * 45);
    }
  }

  let toastTimer;
  function showGif(key, caption, ms = 2600) {
    const src = (CONFIG.gifs[key] || '').trim();
    toast.textContent = '';
    const media = document.createElement('div'); media.className = 'toast-media';
    if (src) {
      let el;
      if (/^https?:\/\/.+\.(gif|webp|png|jpe?g)(\?.*)?$/i.test(src)) {
        el = document.createElement('img'); el.src = src; el.alt = '';
      } else {
        el = document.createElement('iframe');
        el.src = /^https?:/i.test(src) ? src : 'https://giphy.com/embed/' + src;
        el.setAttribute('frameborder', '0'); el.title = 'reaction';
      }
      media.appendChild(el);
    } else {
      const e = document.createElement('span'); e.className = 'toast-emoji';
      e.textContent = CONFIG.fallback[key] || '💖'; media.appendChild(e);
    }
    const say = document.createElement('p'); say.className = 'toast-say'; say.textContent = caption || '';
    toast.append(media, say);
    toast.classList.remove('show'); void toast.offsetWidth; toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), ms);
  }

  // ── ambient delight: cursor trail + tap sparkles ──
  if (!calm && matchMedia('(pointer:fine)').matches) {
    let last = 0;
    addEventListener('pointermove', e => {
      const t = performance.now(); if (t - last < 70) return; last = t;
      const s = document.createElement('span');
      s.className = 'fx-trail'; s.textContent = ['♡', '✦', '✿'][(Math.random() * 3) | 0];
      s.style.left = e.clientX + 'px'; s.style.top = e.clientY + 'px';
      s.style.fontSize = (11 + Math.random() * 9) + 'px';
      fx.appendChild(s); setTimeout(() => s.remove(), 900);
    }, { passive: true });
  }
  addEventListener('pointerdown', e => {
    const big = e.target.closest && e.target.closest('.gate-gif');
    burst(e.clientX, e.clientY, big ? 12 : 5, big ? ['💖', '♡', '✨'] : ['♡', '✦']);
  }, { passive: true });

  // ── quiz engine ──
  const pipsEl = $('#quizPips'), qEl = $('#quizQ'), arena = $('#quizArena'), hint = $('#quizHint');
  const total = showQuestions ? CONFIG.questions.length : 0;
  let step = 0, cleanup = null;

  function drawPips() {
    pipsEl.textContent = '';
    for (let i = 0; i < total; i++) {
      const p = document.createElement('i');
      if (i < step) p.className = 'done'; else if (i === step) p.className = 'now';
      pipsEl.appendChild(p);
    }
  }

  function mk(cls, text) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = cls; b.textContent = text; return b;
  }

  function render() {
    if (cleanup) { cleanup(); cleanup = null; }
    const q = CONFIG.questions[step];
    drawPips();
    qEl.textContent = q.q;
    hint.textContent = '';
    arena.textContent = '';
    arena.classList.toggle('runaway', q.type === 'runaway');
    if (q.type === 'choice') renderChoice(q);
    else if (q.type === 'meter') renderMeter(q);
    else if (q.type === 'puzzle') renderPuzzle(q);
    else renderRunaway(q);
  }

  function next() { step++; if (step >= total) finish(false); else render(); }

  function renderChoice(q) {
    const btns = q.options.map(o => {
      const b = mk('quiz-opt', o.t);
      b.addEventListener('click', () => {
        const [x, y] = center(b);
        burst(x, y, 9);
        showGif(o.gif, o.say);
        hint.textContent = o.say;
        btns.forEach(k => k.disabled = true);
        setTimeout(next, 1500);
      });
      arena.appendChild(b); return b;
    });
  }

  function renderMeter() {
    const wrap = document.createElement('div'); wrap.className = 'meter';
    const heart = document.createElement('div'); heart.className = 'meter-heart'; heart.textContent = '♡';
    const big = document.createElement('div'); big.className = 'meter-big'; big.textContent = '0%';
    const range = document.createElement('input');
    range.type = 'range'; range.min = 0; range.max = 100; range.value = 0;
    range.className = 'meter-range'; range.setAttribute('aria-label', 'birthday excitement');
    wrap.append(heart, big, range); arena.appendChild(wrap);
    hint.textContent = 'drag the slider ♡';
    const pct = v => v <= 50 ? v * 2 : Math.round(100 * Math.pow(10, (v - 50) / 50 * 4));
    let done = false;
    range.addEventListener('input', () => {
      if (done) return;
      const v = +range.value;
      big.textContent = pct(v).toLocaleString('en-US') + '%';
      range.style.setProperty('--fill', v + '%');
      heart.style.setProperty('--hs', (1 + v / 100 * .5).toFixed(2));
      if (v >= 100) {
        done = true; range.disabled = true; heart.textContent = '💖'; heart.classList.add('beat');
        const [x, y] = center(heart); burst(x, y, 20);
        showGif('yay', 'correct. obviously ♡');
        hint.textContent = 'acceptable. proceed.';
        setTimeout(next, 1900);
      } else {
        hint.textContent = v < 25 ? '…are you even awake?' : v < 50 ? "keep going, it's your birthday" : v < 75 ? '100% is where normal people stop.' : 'almost. further.';
      }
    });
  }

  function renderPuzzle() {
    const N = CONFIG.puzzle.size || 3;
    const wrap = document.createElement('div'); wrap.className = 'puzzle';
    const frame = document.createElement('div'); frame.className = 'puzzle-frame';
    const board = document.createElement('div'); board.className = 'puzzle-board';
    const ghost = document.createElement('div'); ghost.className = 'puzzle-peekimg';
    const peek = mk('puzzle-peek', 'peek ♡');
    frame.style.setProperty('--n', N);
    frame.style.setProperty('--img', `url("${FALLBACK_ART}")`);
    frame.append(board, ghost); wrap.append(frame, peek); arena.appendChild(wrap);
    hint.textContent = 'tap two pieces to swap them';

    if (CONFIG.puzzle.image) {
      const im = new Image();
      im.onload = () => {
        let src = im.src; try { src = squareCrop(im); } catch (e) {}
        frame.style.setProperty('--img', `url("${src}")`);
      };
      im.src = CONFIG.puzzle.image;     // if it fails to load, the placeholder stays
    }

    const order = [...Array(N * N).keys()];
    const solved = () => order.every((id, i) => id === i);
    do {
      for (let i = order.length - 1; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0; [order[i], order[j]] = [order[j], order[i]];
      }
    } while (solved());

    let sel = -1, locked = false;
    function draw() {
      board.textContent = '';
      order.forEach((id, pos) => {
        const t = document.createElement('button');
        t.type = 'button'; t.className = 'p-tile' + (pos === sel ? ' sel' : '');
        t.style.backgroundPosition = `${(id % N) * 100 / (N - 1)}% ${Math.floor(id / N) * 100 / (N - 1)}%`;
        t.setAttribute('aria-label', 'puzzle piece ' + (pos + 1));
        t.addEventListener('click', () => tap(pos));
        board.appendChild(t);
      });
    }
    function tap(pos) {
      if (locked) return;
      if (sel < 0) sel = pos;
      else if (sel === pos) sel = -1;
      else { [order[sel], order[pos]] = [order[pos], order[sel]]; sel = -1; }
      draw();
      if (solved()) {
        locked = true; board.classList.add('done'); peek.remove();
        const [x, y] = center(frame); burst(x, y, 22);
        showGif('yay', "that's us ♡");
        hint.textContent = 'there we are. together again ♡';
        setTimeout(next, 2200);
      }
    }
    peek.addEventListener('click', () => {
      frame.classList.add('peeking'); setTimeout(() => frame.classList.remove('peeking'), 1400);
    });
    draw();
  }

  function renderRunaway(q) {
    const yes = mk('love-yes', q.yes), no = mk('love-no', q.no);
    arena.append(yes, no);
    let dodges = 0, roaming = false, gaveUp = false, lastFlee = 0, px = innerWidth / 2, py = innerHeight / 2;

    function win() {
      const [x, y] = center(yes);
      burst(x, y, 22); rain();
      showGif('win', 'I KNEW IT ♡', 3200);
      hint.textContent = 'correct. obviously.';
      yes.disabled = true; no.remove();
      if (cleanup) { cleanup(); cleanup = null; }
      setTimeout(() => finish(false), 2100);
    }

    function flee(cx, cy) {
      if (gaveUp) return;
      const now = performance.now(); if (now - lastFlee < 200) return; lastFlee = now;
      if (cx != null) { px = cx; py = cy; }
      if (!roaming) {
        const r = no.getBoundingClientRect();
        document.body.appendChild(no);
        no.classList.add('roaming');
        no.style.left = r.left + 'px'; no.style.top = r.top + 'px';
        roaming = true; void no.offsetWidth;
      }
      dodges++;
      const w = no.offsetWidth, h = no.offsetHeight, m = 14;
      let best = null, bd = -1;
      for (let i = 0; i < 16; i++) {
        const x = m + Math.random() * Math.max(1, innerWidth - w - 2 * m);
        const y = m + Math.random() * Math.max(1, innerHeight - h - 2 * m);
        const d = Math.hypot(x + w / 2 - px, y + h / 2 - py);
        if (d > bd) { bd = d; best = { x, y }; }
      }
      no.style.left = best.x + 'px'; no.style.top = best.y + 'px';
      setTimeout(() => burst(best.x + w / 2, best.y + h / 2, 5, ['✦', '!', '💨']), 200);
      no.style.setProperty('--s', Math.max(.72, 1 - dodges * .03));
      no.textContent = CONFIG.noLabels[Math.min(dodges, CONFIG.noLabels.length - 1)];
      yes.style.setProperty('--g', Math.min(1 + dodges * .11, 1.85));
      hint.textContent = CONFIG.noSays[(Math.random() * CONFIG.noSays.length) | 0];
      if (dodges % 4 === 0) {
        const k = CONFIG.dodgeGifs[((dodges / 4) - 1) % CONFIG.dodgeGifs.length];
        showGif(k, dodges >= 8 ? 'it\'s over, just say yes' : 'you can\'t press it ♡', 2200);
      }
      if (dodges >= CONFIG.maxDodges) giveUp();
    }

    function giveUp() {
      gaveUp = true;
      no.classList.remove('roaming'); no.removeAttribute('style');
      arena.appendChild(no);
      no.textContent = 'ok fine… yes ♡'; no.classList.add('gave-up');
      hint.textContent = 'you win. you also lose. ♡';
      showGif('dramatic', 'finally.', 2400);
    }

    const chase = e => {
      px = e.clientX; py = e.clientY;
      if (!roaming || gaveUp) return;
      const [cx, cy] = center(no);
      if (Math.hypot(cx - e.clientX, cy - e.clientY) < 95) flee(e.clientX, e.clientY);
    };
    addEventListener('pointermove', chase, { passive: true });
    cleanup = () => { removeEventListener('pointermove', chase); if (no.parentNode === document.body) no.remove(); };

    no.addEventListener('pointerenter', e => flee(e.clientX, e.clientY));
    no.addEventListener('pointerdown', e => { if (!gaveUp) { e.preventDefault(); flee(e.clientX, e.clientY); } });
    no.addEventListener('focus', () => { if (!gaveUp) { const [x, y] = center(no); flee(x, y + 80); } });
    no.addEventListener('click', e => { if (gaveUp) win(); else { e.preventDefault(); flee(e.clientX, e.clientY); } });
    yes.addEventListener('click', win);
  }

  function finish(silent) {
    if (cleanup) { cleanup(); cleanup = null; }
    step = total; drawPips();
    quiz.classList.add('is-done');
    arena.textContent = ''; arena.classList.remove('runaway'); hint.textContent = '';
    if (gated) {
      qEl.textContent = '✓ love confirmed · now the little number ♡';
      store.set();
      [divider, form].forEach(el => { if (el) { el.classList.remove('step-locked'); if (!silent) el.classList.add('step-reveal'); } });
    } else {
      qEl.textContent = 'good. now we just wait together ♡';
      const again = mk('quiz-opt', 'play again ↺');
      again.addEventListener('click', () => { quiz.classList.remove('is-done'); step = 0; render(); });
      arena.appendChild(again);
    }
  }

  // ── start ──
  if (!showQuestions) {
    quiz.classList.add('is-disabled');
  } else {
    if (gated) [divider, form].forEach(el => el && el.classList.add('step-locked'));
    if (gated && store.get()) finish(true); else render();
  }

  // wrong password → funny reaction
  if (msg && msg.dataset.wrong === '1') {
    card.classList.add('shake');
    setTimeout(() => showGif('wrong', 'nope. try again ♡', 2800), 350);
    setTimeout(() => card.classList.remove('shake'), 700);
  }
})();