/* Open-when letters, client-side.
   Letters published in data/letters-data.js are the base set. Letters you write, edit or delete
   on the page are remembered in this browser only (localStorage) and layered on top. */
(function () {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const KEY = 'vd_letters_overlay_v1';
  const SEED = (window.LETTERS_SEED || []).map(l => Object.assign({}, l));

  /* ---------- storage ---------- */
  function loadOverlay() {
    try { const o = JSON.parse(localStorage.getItem(KEY)); if (o && typeof o === 'object') return { added: o.added || [], edited: o.edited || {}, deleted: o.deleted || [] }; } catch (e) {}
    return { added: [], edited: {}, deleted: [] };
  }
  function saveOverlay() {
    try { localStorage.setItem(KEY, JSON.stringify(overlay)); }
    catch (e) { alert("This browser won't let the site remember letters (private window?). Your change will be lost when you leave the page."); }
  }
  const overlay = loadOverlay();

  function allLetters() {
    const list = SEED.filter(l => !overlay.deleted.includes(String(l.id)))
      .map(l => Object.assign({}, l, overlay.edited[String(l.id)] || {}));
    overlay.added.forEach(l => { if (!overlay.deleted.includes(String(l.id))) list.push(Object.assign({}, l, overlay.edited[String(l.id)] || {})); });
    // same order as before: by unlock date (none first), then creation order
    return list.map((l, i) => [l, i]).sort((a, b) => {
      const da = a[0].unlock_date || '', db = b[0].unlock_date || '';
      return da < db ? -1 : da > db ? 1 : a[1] - b[1];
    }).map(x => x[0]);
  }

  /* ---------- helpers ---------- */
  const pad = n => String(n).padStart(2, '0');
  const now = new Date();
  const today = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const niceDate = iso => { const [y, m, d] = iso.split('-').map(Number); return d + ' ' + MONTHS[m - 1] + ' ' + y; };
  const isLocked = l => !!l.unlock_date && l.unlock_date > today;
  const DEFAULT_LOCK = 'Not yet, impatient human.';
  function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  /* ---------- render ---------- */
  const grid = $('#ltGrid'), read = $('#ltRead'), sheet = $('#ltSheet'), confirmBox = $('#ltConfirm'), form = $('#ltForm');
  const search = $('#ltSearch'), count = $('#ltCount'), none = $('#ltNoMatch');

  function render() {
    const letters = allLetters();
    grid.textContent = '';
    if (!letters.length) {
      grid.appendChild(el('p', 'lt-empty-all', 'No letters yet. Use the button above to write the first one ♡'));
    }
    letters.forEach(l => {
      const locked = isLocked(l);
      const card = el('article', 'lt-env' + (locked ? ' is-locked' : ''));
      card.tabIndex = 0; card.setAttribute('role', 'button');
      const d = card.dataset;
      d.id = String(l.id); d.locked = locked ? '1' : '0';
      d.title = l.title; d.trigger = l.trigger; d.emoji = l.emoji; d.unlock = l.unlock_date || ''; d.lockmsg = l.locked_message || '';
      d.content = locked ? '' : l.content;      // locked letters stay sealed in the page
      card.appendChild(el('i', 'lt-flap'));
      card.appendChild(el('span', 'lt-seal', locked ? '🔒' : (l.emoji || '💌')));
      const acts = el('div', 'lt-actions');
      [['edit', '✎', 'Edit letter', 'edit'], ['delete', '🗑', 'Delete letter', 'delete']].forEach(([act, ico, label, title]) => {
        const b = el('button', 'lt-act', ico); b.type = 'button'; b.dataset.act = act; b.title = title; b.setAttribute('aria-label', label); acts.appendChild(b);
      });
      card.appendChild(acts);
      const text = el('div', 'lt-text');
      text.appendChild(el('b', null, l.title));
      if (locked) {
        text.appendChild(el('span', null, l.locked_message || DEFAULT_LOCK));
        text.appendChild(el('em', null, 'opens ' + niceDate(l.unlock_date)));
      } else text.appendChild(el('span', null, l.trigger));
      card.appendChild(text);
      grid.appendChild(card);
    });
    applyFilter();
  }

  function applyFilter() {
    const q = search.value.trim().toLowerCase(); let n = 0;
    const cards = $$('.lt-env');
    cards.forEach(c => {
      const hit = !q || (c.dataset.title + ' ' + c.dataset.trigger).toLowerCase().includes(q);
      c.hidden = !hit; if (hit) n++;
    });
    count.textContent = n + ' little envelope' + (n === 1 ? '' : 's');
    none.hidden = n > 0 || !cards.length;
  }
  search.addEventListener('input', applyFilter);

  /* ---------- modals ---------- */
  const openM = m => { m.classList.add('show'); m.setAttribute('aria-hidden', 'false'); document.body.classList.add('lt-lock'); };
  const closeM = m => { m.classList.remove('show'); m.setAttribute('aria-hidden', 'true'); if (!$('.lt-modal.show')) document.body.classList.remove('lt-lock'); };
  $$('.lt-modal').forEach(m => m.addEventListener('click', e => { if (e.target === m || e.target.closest('[data-lt-close]')) closeM(m); }));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') $$('.lt-modal.show').forEach(closeM); });

  function openLetter(card) {
    if (card.dataset.locked === '1') { card.classList.remove('nope'); void card.offsetWidth; card.classList.add('nope'); return; }
    $('#ltReadEmoji').textContent = card.dataset.emoji || '💌';
    $('#ltReadTrigger').textContent = card.dataset.trigger || '';
    $('#ltReadTitle').textContent = card.dataset.title;
    $('#ltReadBody').textContent = card.dataset.content;
    openM(read);
  }

  let editingId = null, deletingId = null;
  function openSheet(card) {
    const f = form.elements, editing = !!card;
    editingId = editing ? card.dataset.id : null;
    $('#ltSheetKicker').textContent = editing ? 'fix up this envelope' : 'make another little envelope';
    $('#ltSheetTitle').innerHTML = editing ? 'edit this <em>letter.</em>' : 'write a <em>letter.</em>';
    $('#ltSave').textContent = editing ? 'save changes ♡' : 'seal this letter ♡';
    f.title.value = editing ? card.dataset.title : '';
    f.emoji.value = editing ? (card.dataset.emoji || '💌') : '💌';
    f.trigger.value = editing ? card.dataset.trigger : '';
    f.unlock_date.value = editing ? card.dataset.unlock : '';
    f.locked_message.value = editing ? card.dataset.lockmsg : DEFAULT_LOCK;
    f.content.value = editing ? card.dataset.content : '';
    const lockedEdit = editing && card.dataset.locked === '1';
    f.content.required = !lockedEdit;
    f.content.placeholder = lockedEdit ? '(hidden until it unlocks. Leave blank to keep the current letter)' : 'Write anything. A story, a reminder, something silly, something she needs to hear...';
    openM(sheet);
    setTimeout(() => f.title.focus(), 120);
  }

  $('#ltNew').addEventListener('click', () => openSheet(null));
  grid.addEventListener('click', e => {
    const b = e.target.closest('.lt-act');
    const card = e.target.closest('.lt-env');
    if (!card) return;
    if (!b) { openLetter(card); return; }
    e.stopPropagation();
    if (b.dataset.act === 'edit') openSheet(card);
    else { deletingId = card.dataset.id; $('#ltConfirmName').textContent = '“' + card.dataset.title + '”'; openM(confirmBox); }
  });
  grid.addEventListener('keydown', e => {
    const card = e.target.closest('.lt-env');
    if ((e.key === 'Enter' || e.key === ' ') && card && e.target === card) { e.preventDefault(); openLetter(card); }
  });

  /* ---------- create / edit / delete (what the Django views used to do) ---------- */
  const fields = f => ({
    title: (f.title.value || 'A little letter').trim().slice(0, 200),
    trigger: (f.trigger.value || 'open when you need me').trim().slice(0, 200),
    emoji: (f.emoji.value || '💌').trim().slice(0, 20),
    unlock_date: f.unlock_date.value || null,
    locked_message: (f.locked_message.value || DEFAULT_LOCK).trim().slice(0, 300)
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const f = form.elements, data = fields(f), content = f.content.value.trim();
    if (editingId == null) {
      if (!content) return;
      overlay.added.push(Object.assign({ id: 'local-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), content }, data));
    } else {
      const patch = Object.assign({}, overlay.edited[editingId] || {}, data);
      if (content) patch.content = content;       // blank = keep the existing text
      overlay.edited[editingId] = patch;
    }
    saveOverlay(); closeM(sheet); render();
  });

  $('#ltDelForm').addEventListener('submit', e => {
    e.preventDefault();
    if (deletingId != null) {
      const id = String(deletingId);
      overlay.added = overlay.added.filter(l => String(l.id) !== id);
      delete overlay.edited[id];
      if (SEED.some(l => String(l.id) === id) && !overlay.deleted.includes(id)) overlay.deleted.push(id);
    }
    deletingId = null; saveOverlay(); closeM(confirmBox); render();
  });

  render();
})();
