// deckbuilder/modals.js — All modal / overlay logic
// Requires: state (window.state), db.js, globals: toast, $, openZoom, sortMainCards, isProxy

(function () {
  'use strict';

  const $ = id => document.getElementById(id);
  const getState = () => window.state;
  const _dt = key => (window.i18n && window.i18n.t(key)) || key;
  const _fmt = (key, ...args) => _dt(key).replace(/%(\d+)/g, (_, i) => args[+i-1] ?? '');

  // ── Unified IO modal (Export | Share | Import) ──────────────────────────────

  let _shareUrl = '';

  function openIoModal(tab) {
    switchIoTab(tab || 'export');
    const m = $('io-modal');
    if (m) m.classList.add('open');
  }

  function closeIoModal() {
    const m = $('io-modal');
    if (m) m.classList.remove('open');
  }

  function switchIoTab(tab) {
    document.querySelectorAll('.io-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    document.querySelectorAll('.io-pane').forEach(p => p.classList.toggle('active', p.dataset.pane === tab));
  }

  // ── Export ──────────────────────────────────────────────────────────────────

  function openExport() {
    const state = getState();
    const proxyMode = window._proxyMode;
    const allCards = [state.mc, ...state.main, ...state.scene, ...(state.story || [])].filter(Boolean);
    if (!proxyMode && allCards.some(c => isProxy(c))) {
      toast('❌ เด็คมีการ์ด Proxy กรุณาเปิด Proxy Mode', 'err'); return;
    }
    const name = ($('deck-name') || {}).value || 'My Deck';
    let txt = `=== ${name} ===\n`;
    if (state.mc) txt += `\n[Main Character]\n${state.mc.name} (${state.mc.id})\n`;
    if (state.main.length) {
      txt += `\n[Main Deck — ${state.main.reduce((s, c) => s + c.qty, 0)}/50 cards]\n`;
      sortMainCards(state.main).forEach(c => txt += `${c.qty}x ${c.name} (${c.id})\n`);
    }
    if (state.scene.length) {
      txt += `\n[Scene Deck]\n`;
      state.scene.forEach(c => txt += `${c.qty}x ${c.name} (${c.id})\n`);
    }
    if ((state.story || []).some(Boolean)) {
      txt += `\n[Story Deck]\n`;
      (state.story || []).forEach((c, i) => {
        if (c) txt += `Tier ${['I', 'II', 'III', 'IV'][i]}: ${c.name} (${c.id})\n`;
      });
    }
    const ta = $('export-text');
    if (ta) ta.value = txt;
    openIoModal('export');
  }

  function closeExport() { closeIoModal(); }

  function copyExport() {
    const ta = $('export-text');
    if (!ta) return;
    navigator.clipboard.writeText(ta.value).catch(() => {
      ta.select(); document.execCommand('copy');
    });
    toast('📋 Copied', 'ok');
  }

  function downloadExportTxt() {
    const ta = $('export-text');
    if (!ta) return;
    const a = document.createElement('a');
    a.href = 'data:text/plain,' + encodeURIComponent(ta.value);
    a.download = (($('deck-name') || {}).value || 'deck') + '_list.txt';
    a.click();
  }

  // ── Share ───────────────────────────────────────────────────────────────────

  async function openShareModal() {
    const state = getState();
    const deckName = (($('deck-name') || {}).value || 'My Deck').trim();
    if (!state.mc && !state.main.length && !state.scene.length) {
      toast('⚠ เด็คว่างเปล่า — เพิ่มการ์ดก่อนแชร์', 'warn'); return;
    }

    toast('🔗 กำลังสร้างลิงก์...', 'ok');

    const deckData = { mc: state.mc, main: state.main, scene: state.scene, story: state.story };
    try {
      const resp = await fetch('/api/decks/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deck: deckData, name: deckName, imageUrl: null }),
      });
      if (!resp.ok) throw new Error(await resp.text());
      const json = await resp.json();
      _shareUrl = json.url;
    } catch (e) {
      toast('❌ แชร์ไม่สำเร็จ: ' + e.message, 'err');
      return;
    }

    const urlText = $('share-url-text');
    if (urlText) urlText.textContent = _shareUrl;

    const xBtn = $('share-x-btn');
    if (xBtn) {
      const text = `เช็คเด็ค MLP TCG ของฉันได้เลย! 🐴✨ #MLPTCG #DreamTCG`;
      xBtn.onclick = () => window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(_shareUrl)}`,
        '_blank'
      );
    }
    const fbBtn = $('share-fb-btn');
    if (fbBtn) fbBtn.onclick = () => window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(_shareUrl)}`,
      '_blank'
    );

    openIoModal('share');
  }

  function closeShareModal() { closeIoModal(); }

  function copyShareUrl() {
    if (!_shareUrl) return;
    navigator.clipboard.writeText(_shareUrl)
      .then(() => toast('📋 คัดลอกลิงก์แล้ว', 'ok'))
      .catch(() => {
        const inp = document.createElement('input');
        inp.value = _shareUrl;
        document.body.appendChild(inp);
        inp.select(); document.execCommand('copy'); inp.remove();
        toast('📋 คัดลอกลิงก์แล้ว', 'ok');
      });
  }

  // ── Import ──────────────────────────────────────────────────────────────────

  function importFromClipboard() {
    const ta = $('import-clipboard-text');
    if (ta) ta.value = '';
    openIoModal('import');
    setTimeout(() => { if (ta) ta.focus(); }, 120);
  }

  function closeImportClipboard() { closeIoModal(); }

  function confirmImportClipboard() {
    const ta = $('import-clipboard-text');
    const text = ta ? ta.value : '';
    if (!text.trim()) { toast('⚠ ไม่มีข้อความให้ import', 'warn'); return; }
    if (typeof _parseAndLoadDeckText === 'function') _parseAndLoadDeckText(text);
    closeIoModal();
  }

  // ── Fan Playtest ─────────────────────────────────────────────────────────────

  let _fanPool   = [];   // full shuffled deck
  let _fanHand   = [];   // cards currently in hand
  let _fanDeck   = [];   // remaining draw pile
  let _fanDiscard = [];  // discarded cards

  function _shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function testDraw() {
    const state = getState();
    const pool = [];
    (state.main || []).forEach(entry => {
      for (let i = 0; i < (entry.qty || 1); i++) pool.push(entry);
    });

    _fanPool    = _shuffle([...pool]);
    _fanDeck    = [..._fanPool];
    _fanHand    = _fanDeck.splice(0, Math.min(5, _fanDeck.length));
    _fanDiscard = [];

    _renderFan();

    const overlay = $('fan-draw-modal');
    if (overlay) overlay.classList.add('open');
  }

  function closeTestDraw() {
    const overlay = $('fan-draw-modal');
    if (overlay) overlay.classList.remove('open');
  }

  function fanDraw() {
    if (!_fanDeck.length) { toast('🃏 ไพ่หมดแล้ว!', 'warn'); return; }
    _fanHand.push(_fanDeck.shift());
    _renderFan();
  }

  function fanMulligan() {
    _fanDiscard.push(..._fanHand);
    _fanHand = [];
    // Reshuffle discard into deck then draw 5
    _fanDeck = _shuffle([..._fanDeck, ..._fanDiscard]);
    _fanDiscard = [];
    _fanHand = _fanDeck.splice(0, Math.min(5, _fanDeck.length));
    _renderFan();
    toast('🔀 Mulligan!', 'ok');
  }

  function fanDiscard() {
    if (!_fanHand.length) return;
    _fanDiscard.push(_fanHand.pop());
    _renderFan();
  }

  function _renderFan() {
    const stage = $('fan-stage');
    const counter = $('fan-counter');
    if (!stage) return;

    // Update pile counter
    if (counter) counter.textContent = _fmt('deck.modal.fanLeft', _fanDeck.length, _fanDiscard.length);

    // Clear and rebuild fan
    stage.innerHTML = '';
    const n = _fanHand.length;
    if (n === 0) {
      stage.innerHTML = `<div style="color:rgba(255,255,255,.5);font-size:0.85rem;margin:auto;">${_dt('deck.modal.noHand')}</div>`;
      return;
    }

    const maxAngle = Math.min(30, n * 5);
    const step = n > 1 ? (maxAngle * 2) / (n - 1) : 0;

    _fanHand.forEach((entry, i) => {
      const angle = n > 1 ? -maxAngle + step * i : 0;
      const card = entry;
      const isStory = card.type === 'Story';
      const w = isStory ? 80 : 64;
      const ar = isStory ? '5/3' : '5/7';

      const wrap = document.createElement('div');
      wrap.className = 'fan-card';
      wrap.style.cssText = `
        width:${w}px;
        transform:rotate(${angle}deg);
        --fan-base-rot:${angle}deg;
      `;
      wrap.title = `${card.name} (${card.id})`;
      wrap.onclick = () => { closeTestDraw(); openZoom(card, _fanHand, 'testdraw'); };

      const imgWrap = document.createElement('div');
      imgWrap.style.cssText = `
        width:${w}px; aspect-ratio:${ar};
        border-radius:8px; overflow:hidden;
        background:var(--surface2);
        box-shadow:0 6px 20px rgba(0,0,0,.6);
      `;

      const img = document.createElement('img');
      const imgId = card.id.replace('※', '');
      img.src = `../cards/${imgId}.jpg`;
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
      img.onerror = () => {
        img.style.display = 'none';
        imgWrap.style.cssText += 'display:flex;align-items:center;justify-content:center;font-size:1.5rem;';
        imgWrap.textContent = '🃏';
      };

      imgWrap.appendChild(img);

      const lbl = document.createElement('div');
      lbl.style.cssText = 'font-size:0.5rem;color:rgba(255,255,255,.7);text-align:center;margin-top:3px;line-height:1.2;';
      lbl.textContent = card.name;

      wrap.appendChild(imgWrap);
      wrap.appendChild(lbl);
      stage.appendChild(wrap);
    });
  }

  // Keyboard shortcuts for fan modal
  document.addEventListener('keydown', e => {
    const overlay = $('fan-draw-modal');
    if (!overlay || !overlay.classList.contains('open')) return;
    if (e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); fanDraw(); }
    if (e.key === 'r' || e.key === 'R') fanMulligan();
    if (e.key === 'Escape') closeTestDraw();
  });

  // Expose all on window
  Object.assign(window, {
    // io modal
    openIoModal, closeIoModal, switchIoTab,
    // export
    openExport, closeExport, copyExport, downloadExportTxt,
    // share
    openShareModal, closeShareModal, copyShareUrl,
    // import
    importFromClipboard, closeImportClipboard, confirmImportClipboard,
    // playtest fan
    testDraw, closeTestDraw, fanDraw, fanMulligan, fanDiscard,
  });
})();
