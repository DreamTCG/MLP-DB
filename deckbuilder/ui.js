// deckbuilder/ui.js — Analysis panel rendering + Vibe Read
// Extracted from inline script. Relies on globals: state, $, COLOR_HEX, COLOR_ICON
// Must load after the main inline script block (it's added via <script src="ui.js"> at end of body).

(function () {
  'use strict';

  // ── Vibe archetypes (ported from Playboard design, adapted to MLP card structure) ──
  const VIBE_ARCHETYPES = [
    { key:'rush',    name:'The Rush',       tag:'aggressive tempo',
      match: s => s.avgCost <= 2.0 && s.chars >= 8,
      desc: 'Low curve, fast bodies. You want the game to end before turn 6.' },
    { key:'control', name:'The Watchmaker', tag:'control & timing',
      match: s => s.avgCost >= 4.0,
      desc: 'Big plays and late swings. Patience is your whole strategy.' },
    { key:'rainbow', name:'The Prism',      tag:'every color',
      match: s => Object.keys(s.charNameDist).length > 4 || Object.keys(s.charRaceDist).length > 3,
      desc: 'Many ponies, many faces. No one expects every angle you cover.' },
    { key:'mono',    name:'The Purist',     tag:'mono-pony loyalty',
      match: s => Object.values(s.charNameDist).some(v => v > 15),
      desc: 'One pony, all-in. Maximum synergy with a single iconic character.' },
    { key:'events',  name:'The Conjurer',   tag:'event-heavy toolkit',
      match: s => (s.typeDist['Event'] || 0) > 11,
      desc: "Tricks for every occasion. Your opponent never knows what's coming." },
    { key:'dresser', name:'The Dresser',    tag:'adorn-item specialist',
      match: s => s.adorns > 7,
      desc: 'Fashion is power. Your ponies arrive fully equipped.' },
    { key:'scenes',  name:'The Architect',  tag:'scene-builder',
      match: s => (s.typeDist['Scene'] || 0) >= 6,
      desc: 'Control the board state. Every Scene you play shifts the math.' },
    { key:'balanced',name:'The Strategist', tag:'balanced curve',
      match: s => s.total >= 10 && s.avgCost >= 2.5 && s.avgCost <= 3.5,
      desc: "A sensible deck. You've thought about the midgame." },
    { key:'empty',   name:'Blank Slate',    tag:'fresh start',
      match: s => s.total === 0,
      desc: 'Untouched. Start by picking a Main Character.' },
  ];

  function readVibe(s) {
    for (const a of VIBE_ARCHETYPES) if (a.match(s)) return a;
    return VIBE_ARCHETYPES[VIBE_ARCHETYPES.length - 1];
  }

  function vibeCard(vibe) {
    return `<div class="vibe-card" style="animation:pb-spin-pop .4s cubic-bezier(.34,1.56,.64,1)">
      <div style="font-size:0.58rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;opacity:.75">Deck Vibe</div>
      <div class="vibe-name">${vibe.name}</div>
      <div class="vibe-tag">${vibe.tag}</div>
      <div class="vibe-desc">${vibe.desc}</div>
    </div>`;
  }

  function tile(label, value) {
    return `<div class="stat-tile">
      <div class="stat-tile-val">${value}</div>
      <div class="stat-tile-lbl">${label}</div>
    </div>`;
  }

  function statTiles(total, chars, avgCost, avgPower) {
    return `<div class="stat-tiles">
      ${tile('Cards', total)
      }${tile('Chars', chars)
      }${tile('Avg Cost', typeof avgCost === 'number' ? avgCost.toFixed(1) : avgCost)
      }${tile('Avg Pwr', typeof avgPower === 'number' && !isNaN(avgPower) ? avgPower.toFixed(1) : '—')}
    </div>`;
  }

  // ── Collapsible analysis card wrapper ──
  const _aCollapsed = {};
  function toggleACard(key) {
    _aCollapsed[key] = !_aCollapsed[key];
    const body = document.getElementById(`ac-body-${key}`);
    const btn  = document.getElementById(`ac-btn-${key}`);
    if (body) body.style.display = _aCollapsed[key] ? 'none' : '';
    if (btn)  btn.textContent    = _aCollapsed[key] ? '▶' : '▼';
  }

  function acWrap(key, title, content) {
    const col = _aCollapsed[key] || false;
    return `<div class="analysis-card">
      <div class="analysis-title" onclick="toggleACard('${key}')">
        <span>${title}</span><span class="toggle" id="ac-btn-${key}">${col ? '▶' : '▼'}</span>
      </div>
      <div id="ac-body-${key}" style="${col ? 'display:none' : ''}">
        ${content}
      </div>
    </div>`;
  }

  function summaryCard(total, avgCost, avgPower) {
    const pct  = Math.round((total / 50) * 100);
    const fill = total >= 50 ? 'var(--green)' : total > 30 ? 'var(--gold)' : 'var(--purple)';
    return acWrap('summary', '📋 Deck Summary', `
      <div class="stat-row"><span class="stat-label">Main Deck cards</span><span class="stat-val" style="color:${fill}">${total}/50</span></div>
      <div style="height:4px;background:var(--border2);border-radius:3px;margin:4px 0 8px"><div style="height:100%;width:${pct}%;background:${fill};border-radius:3px"></div></div>
      <div class="stat-row"><span class="stat-label">Avg Cost</span><span class="stat-val">${avgCost}</span></div>
      <div class="stat-row"><span class="stat-label">Avg Power</span><span class="stat-val">${avgPower}</span></div>`);
  }

  function barChart(title, dist, colors, _s, lastLabel) {
    const id   = 'bc-' + title.replace(/\s+/g, '');
    const keys = Object.keys(dist).map(Number).sort((a, b) => a - b);
    const max  = Math.max(...Object.values(dist), 1);
    const BAR_H = 64;
    const bars = keys.map(k => {
      const v = dist[k], h = Math.max(2, Math.round((v / max) * BAR_H));
      const col = colors[Math.min(k, colors.length - 1)] || colors[0];
      const lbl = (k === 8 && lastLabel) ? lastLabel : k;
      return `<div style="display:flex;flex-direction:column;align-items:center;flex:1;min-width:0">
        <div style="font-size:0.55rem;color:var(--muted);margin-bottom:1px">${v}</div>
        <div style="width:100%;height:${h}px;background:${col};border-radius:2px 2px 0 0;transition:height .35s cubic-bezier(.34,1.56,.64,1)"></div>
        <div style="font-size:0.55rem;color:var(--muted);margin-top:1px">${lbl}</div>
      </div>`;
    }).join('');
    return acWrap(id, title, `<div style="display:flex;align-items:flex-end;gap:2px;padding-top:4px">${bars}</div>`);
  }

  function horizBar(title, items, total, colorMap) {
    const rows = items.map(({ label, val }) => {
      const pct = Math.round((val / total) * 100);
      const col = colorMap[label] || '#9ca3af';
      return `<div class="stat-row" style="gap:5px">
        <span class="stat-label" style="width:32px;flex-shrink:0">${label}</span>
        <div style="flex:1;height:8px;background:var(--border2);border-radius:4px;overflow:hidden">
          <div style="height:100%;width:${pct}%;background:${col};border-radius:4px"></div>
        </div>
        <span class="stat-val" style="width:20px;text-align:right;font-size:0.67rem">${val}</span>
      </div>`;
    }).join('');
    return acWrap('hz-' + title.replace(/\s+/g, ''), title, rows);
  }

  function donutChart(title, dist, colorMap) {
    const entries = Object.entries(dist);
    const total   = entries.reduce((s, [, v]) => s + v, 0);
    if (!total) return '';
    const CX = 55, CY = 55, R = 38, r = 20;
    let angle = -Math.PI / 2, slices = '';
    entries.forEach(([label, val]) => {
      const a  = (val / total) * 2 * Math.PI;
      const x1 = CX + R * Math.cos(angle), y1 = CY + R * Math.sin(angle);
      const x2 = CX + R * Math.cos(angle + a), y2 = CY + R * Math.sin(angle + a);
      const x3 = CX + r * Math.cos(angle + a), y3 = CY + r * Math.sin(angle + a);
      const x4 = CX + r * Math.cos(angle), y4 = CY + r * Math.sin(angle);
      const lg = a > Math.PI ? 1 : 0;
      const col = colorMap[label] || '#9ca3af';
      slices += `<path d="M${x1},${y1} A${R},${R},0,${lg},1,${x2},${y2} L${x3},${y3} A${r},${r},0,${lg},0,${x4},${y4}Z" fill="${col}"/>`;
      angle += a;
    });
    const legend = entries.map(([label, val]) => {
      const col = colorMap[label] || '#9ca3af';
      const pct = Math.round((val / total) * 100);
      return `<div style="display:flex;align-items:center;gap:4px;margin-bottom:3px">
        <div style="width:8px;height:8px;border-radius:2px;background:${col};flex-shrink:0"></div>
        <span style="font-size:0.62rem;color:var(--muted)">${label}</span>
        <span style="font-size:0.62rem;color:var(--text);margin-left:auto">${val} (${pct}%)</span>
      </div>`;
    }).join('');
    return acWrap('donut-' + title.replace(/\s+/g, ''), title,
      `<div style="display:flex;gap:8px;align-items:center;padding-top:4px">
        <svg width="110" height="110" viewBox="0 0 110 110" style="flex-shrink:0">${slices}</svg>
        <div style="flex:1">${legend}</div>
      </div>`);
  }

  function colorChart(title, dist) {
    const total = Object.values(dist).reduce((a, b) => a + b, 0);
    const COLOR_HEX = window.COLOR_HEX || {};
    const COLOR_ICON = window.COLOR_ICON || {};
    const rows = Object.entries(dist).sort((a, b) => b[1] - a[1]).map(([label, val]) => {
      const col  = COLOR_HEX[label] || '#9ca3af';
      const icon = COLOR_ICON[label] || '●';
      const pct  = Math.round((val / total) * 100);
      return `<div class="stat-row" style="gap:5px">
        <span style="font-size:0.85rem">${icon}</span>
        <span class="stat-label" style="width:50px;flex-shrink:0">${label}</span>
        <div style="flex:1;height:8px;background:var(--border2);border-radius:4px;overflow:hidden">
          <div style="height:100%;width:${pct}%;background:${col};border-radius:4px"></div>
        </div>
        <span class="stat-val" style="width:20px;text-align:right;font-size:0.67rem">${val}</span>
      </div>`;
    }).join('');
    return acWrap('color-' + title.replace(/\s+/g, ''), title, rows);
  }

  function rarityColors() {
    return {
      CR:'#a78bfa', GR:'#fbbf24', SR:'#34d399', U:'#60a5fa', C:'#9ca3af',
      RR:'#f472b6', ER:'#38bdf8', SPR:'#fb923c',
      '※CR':'#d4a0ff', '※GR':'#ffe066', '※SR':'#6effc2',
      '※RR':'#ff9de2', '※ER':'#7ee8ff', '※SPR':'#ffc57a',
    };
  }
  function typeColors() {
    return { Character:'#a78bfa', Event:'#fb923c', Item:'#34d399', Scene:'#38bdf8', 'Main Character':'#ec4899', Story:'#f59e0b' };
  }
  function raceColors() {
    return { Unicorn:'#a78bfa', Pegasus:'#38bdf8', 'Earth Pony':'#f97316', Alicorn:'#fbbf24' };
  }

  function subtypeNameChart(title, items, total) {
    const rows = items.slice(0, 10).map(({ label, val }) =>
      `<div class="stat-row" style="gap:5px">
        <span class="stat-label" style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${label}</span>
        <span class="stat-val" style="font-size:0.67rem">${val}</span>
      </div>`
    ).join('');
    return acWrap('sub-' + title.replace(/\s+/g, ''), title,
      rows + (items.length > 10 ? `<div style="font-size:0.6rem;color:var(--dim);margin-top:4px">+${items.length - 10} more</div>` : ''));
  }

  function renderAnalysis() {
    const state   = window.state;
    const cards   = state.main;
    const total   = cards.reduce((s, c) => s + c.qty, 0);
    const targets = ['analysis-content-d', 'analysis-content-m'];

    if (!total) {
      targets.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '<div class="empty-zone"><div class="ei">📊</div><p>Add cards to Main Deck to see stats</p></div>';
      });
      return;
    }

    const flat = [];
    cards.forEach(c => { for (let i = 0; i < c.qty; i++) flat.push(c); });

    const costs    = flat.map(c => c.cost ?? 0);
    const avgCost  = costs.reduce((a, b) => a + b, 0) / costs.length;

    const flatPower = flat.filter(c => c.type !== 'Event' && c.type !== 'Item' && c.type !== 'Scene' && c.type !== 'Story');
    const powers    = flatPower.map(c => c.power ?? 0);
    const avgPower  = powers.length ? powers.reduce((a, b) => a + b, 0) / powers.length : NaN;

    const costDist = {}, powerDist = {}, typeDist = {}, rarityDist = {}, colorDist = {};
    flat.forEach(c => {
      const ck = Math.min(c.cost ?? 0, 7);
      costDist[ck]         = (costDist[ck]         || 0) + 1;
      typeDist[c.type]     = (typeDist[c.type]     || 0) + 1;
      rarityDist[c.rarity || '?'] = (rarityDist[c.rarity || '?'] || 0) + 1;
      colorDist[c.color   || '?'] = (colorDist[c.color   || '?'] || 0) + 1;
    });
    flatPower.forEach(c => {
      const pk = Math.min(c.power ?? 0, 8);
      powerDist[pk] = (powerDist[pk] || 0) + 1;
    });

    const RACES = new Set(['Earth Pony', 'Pegasus', 'Unicorn', 'Alicorn']);
    const raceDist = {}, nameDist = {};
    flat.forEach(c => {
      (c.subtype || []).forEach(s => {
        if (RACES.has(s)) raceDist[s] = (raceDist[s] || 0) + 1;
        else nameDist[s] = (nameDist[s] || 0) + 1;
      });
    });

    // Character-only name/race counts for Purist / Prism vibe checks
    const charFlat = flat.filter(c => c.type === 'Character');
    const charNameDist = {}, charRaceDist = {};
    charFlat.forEach(c => {
      (c.subtype || []).forEach(s => {
        if (RACES.has(s)) charRaceDist[s] = (charRaceDist[s] || 0) + 1;
        else charNameDist[s] = (charNameDist[s] || 0) + 1;
      });
    });

    // Adorn item count for The Dresser vibe check
    const adorns = flat.filter(c => c.type === 'Item' && (c.subtype || []).includes('Adorn')).length;

    const rarityOrder = ['CR','GR','SR','U','C','RR','ER','SPR','※CR','※GR','※SR','※RR','※ER','※SPR'];
    const raceItems   = Object.entries(raceDist).sort((a, b) => b[1] - a[1]).map(([label, val]) => ({ label, val }));
    const nameItems   = Object.entries(nameDist).sort((a, b) => b[1] - a[1]).map(([label, val]) => ({ label, val }));

    // Vibe read
    const vibeStats = { total, chars: flatPower.length, avgCost, typeDist, charNameDist, charRaceDist, adorns };
    const vibe = readVibe(vibeStats);

    const html = `
      ${vibeCard(vibe)}
      ${statTiles(total, flatPower.length, avgCost, avgPower)}
      ${summaryCard(total, avgCost.toFixed(2), !isNaN(avgPower) ? avgPower.toFixed(2) : '—')}
      ${barChart('Cost Curve', costDist, ['#7c3aed','#8b5cf6','#a78bfa','#c4b5fd','#818cf8','#6366f1','#4f46e5','#3730a3'], true, '7+')}
      ${barChart('Power Distribution', powerDist, ['#ec4899','#f472b6','#f9a8d4','#fbbf24','#fb923c','#f87171','#ef4444','#dc2626','#b91c1c'], false, '8+')}
      ${horizBar('Rarity Breakdown', rarityOrder.filter(r => rarityDist[r]).map(r => ({ label: r, val: rarityDist[r] })), total, rarityColors())}
      ${donutChart('Card Type', typeDist, typeColors())}
      ${raceItems.length ? horizBar('Pony Race', raceItems, flat.length, raceColors()) : ''}
      ${nameItems.length ? subtypeNameChart('Character Tags', nameItems, flat.length) : ''}
    `;

    targets.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    });
  }

  // Expose all on window so inline scripts can call them
  Object.assign(window, {
    readVibe, vibeCard, statTiles, tile,
    toggleACard, acWrap, summaryCard,
    barChart, horizBar, donutChart, colorChart,
    rarityColors, typeColors, raceColors, subtypeNameChart,
    renderAnalysis,
    VIBE_ARCHETYPES,
  });
})();
