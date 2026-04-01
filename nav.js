/* ============================================================
   MLP TCG — Shared Navigation Bar  (v2 — with Dark Mode)
   Usage: <script src="./nav.js"></script>  (use relative path)

   Dark mode works via:
   1. <html class="dark"> toggled by this script
   2. Pages opt-in by defining CSS vars under :root and html.dark
   3. Preference saved to localStorage key "mlp-theme"
   ============================================================ */

(function () {
  // Detect base path from this script's own URL so absolute links work
  // on both root deployments (/) and subdirectory deployments (/MLP-DB/).
  const _scriptSrc = document.currentScript?.src || '';
  const BASE = _scriptSrc
    ? new URL(_scriptSrc).pathname.replace(/\/nav\.js(\?.*)?$/, '')
    : '';
  // BASE = ''        on root deployment  → links become '/library/' etc.
  // BASE = '/MLP-DB' on subdirectory     → links become '/MLP-DB/library/' etc.

  /* ── CONFIG ────────────────────────────────────────────── */
  const NAV_LINKS = [
    { label: 'หน้าหลัก',  icon: '🏠', href: BASE + '/',               match: [BASE + '/', BASE + '/index.html', BASE] },
    { label: 'การ์ด',      icon: '🃏', href: BASE + '/library/',        match: [BASE + '/library/', BASE + '/library/index.html'] },
    { label: 'จัดเด็ค',    icon: '🗂️', href: BASE + '/deckbuilder/',    match: [BASE + '/deckbuilder/', BASE + '/deckbuilder/index.html'] },
    // { label: 'ทดสอบเด็ค', icon: '⚔️', href: BASE + '/battlesim/',   match: [BASE + '/battlesim/', BASE + '/battlesim/index.html'] },  // temporarily disabled
    { label: 'วิธีเล่น',   icon: '📋', href: BASE + '/#rules',          match: [] },
  ];

  const SITE_TITLE = 'DreamTCG';
  const SITE_LOGO  = '🦄';
  const LS_KEY     = 'mlp-theme';

  /* ── APPLY THEME EARLY (prevents flash-of-wrong-theme) ── */
  (function applyEarly() {
    const saved = localStorage.getItem(LS_KEY);
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  })();

  /* ── STYLES ─────────────────────────────────────────────── */
  const css = `
    #mlp-nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 9999;
      background: linear-gradient(90deg, #3a0d6e 0%, #5b1fa8 50%, #3a0d6e 100%);
      box-shadow: 0 2px 20px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.08) inset;
      font-family: 'Nunito', 'Prompt', sans-serif;
    }
    #mlp-nav * { box-sizing: border-box; }

    .mlp-nav-inner {
      max-width: 1100px; margin: 0 auto; padding: 0 20px;
      height: 56px; display: flex; align-items: center; gap: 4px;
    }

    .mlp-nav-logo {
      display: flex; align-items: center; gap: 8px;
      text-decoration: none; color: #fff; font-weight: 900;
      padding: 6px 12px 6px 6px; border-radius: 10px;
      transition: background 0.2s; margin-right: 6px; flex-shrink: 0;
    }
    .mlp-nav-logo:hover { background: rgba(255,255,255,0.1); }
    .mlp-nav-logo-icon { font-size: 1.6rem; line-height: 1; }
    .mlp-nav-logo-text { font-family: 'Fredoka One', cursive; font-size: 1.1rem; }

    .mlp-nav-div { width:1px; height:28px; background:rgba(255,255,255,0.15); margin:0 6px; flex-shrink:0; }

    .mlp-nav-links { display: flex; align-items: center; gap: 2px; flex: 1; }

    .mlp-nav-link {
      display: flex; align-items: center; gap: 6px;
      text-decoration: none; color: rgba(255,255,255,0.75);
      font-size: 0.875rem; font-weight: 700;
      padding: 7px 13px; border-radius: 10px;
      transition: background 0.18s, color 0.18s, transform 0.15s;
      white-space: nowrap; position: relative;
    }
    .mlp-nav-link:hover { background: rgba(255,255,255,0.12); color:#fff; transform:translateY(-1px); }
    .mlp-nav-link.active { background: rgba(255,255,255,0.18); color:#fff; }
    .mlp-nav-link.active::after {
      content:''; position:absolute; bottom:2px; left:50%; transform:translateX(-50%);
      width:20px; height:3px; background:#ffd84d; border-radius:2px;
    }
    .mlp-nav-icon { font-size:1rem; line-height:1; }

    .mlp-nav-right { display:flex; align-items:center; gap:8px; margin-left:auto; flex-shrink:0; }

    /* ── Dark mode toggle ── */
    #mlp-theme-btn {
      display: flex; align-items: center; justify-content: center;
      width: 36px; height: 36px;
      background: rgba(255,255,255,0.12);
      border: 1.5px solid rgba(255,255,255,0.25);
      border-radius: 10px; cursor: pointer; font-size: 1.05rem;
      transition: background 0.2s, transform 0.25s, border-color 0.2s;
      flex-shrink: 0; color: #fff;
    }
    #mlp-theme-btn:hover { background: rgba(255,255,255,0.22); transform: rotate(15deg) scale(1.1); }
    #mlp-theme-btn:active { transform: scale(0.9); }

    .mlp-theme-label {
      font-size: 0.72rem; font-weight: 700; color: rgba(255,255,255,0.55);
      letter-spacing: 0.5px;
    }
    @media (max-width: 520px) { .mlp-theme-label { display:none; } }

    .mlp-nav-burger {
      display:none; background:none; border:none; color:#fff;
      font-size:1.5rem; cursor:pointer; padding:4px 8px; border-radius:8px;
      transition:background 0.2s;
    }
    .mlp-nav-burger:hover { background:rgba(255,255,255,0.12); }

    .mlp-nav-drawer {
      display:none; flex-direction:column; background:#3a0d6e;
      border-top:1px solid rgba(255,255,255,0.08);
      padding:8px 16px 14px; gap:2px;
    }
    .mlp-nav-drawer.open { display:flex; }
    .mlp-nav-drawer .mlp-nav-link { font-size:0.95rem; padding:10px 14px; }

    @media (max-width: 640px) {
      :root { --nav-h: 44px; }
      .mlp-nav-links { display:none; }
      .mlp-nav-burger { display:block; }
      .mlp-nav-inner { height: 44px; padding: 0 12px; gap: 2px; }
      .mlp-nav-logo { padding: 4px 8px 4px 4px; gap: 5px; margin-right: 2px; }
      .mlp-nav-logo-icon { font-size: 1.2rem; }
      .mlp-nav-logo-text { font-size: 0.9rem; }
      .mlp-nav-div { display: none; }
      #mlp-theme-btn { width: 30px; height: 30px; font-size: 0.9rem; border-radius: 8px; }
      .mlp-nav-burger { font-size: 1.2rem; padding: 2px 6px; }
    }

    /* ════════════════════════════════════════════════════════
       GLOBAL THEME CSS VARIABLES
       Include these in your page's CSS to get dark mode free:
         background: var(--bg);
         color: var(--text);
         etc.
       ════════════════════════════════════════════════════════ */
    :root {
      --nav-h: 56px;   /* height of #mlp-nav — use in pages for layout offsets */
      --bg:          #f8f5ff;
      --bg-card:     #ffffff;
      --bg-surface:  #f0ebff;
      --text:        #1a0a2e;
      --text-muted:  #6b5a8a;
      --border:      #e0d5f5;
      --accent:      #7b2ff7;
      --accent-2:    #ff6eb4;
      --shadow:      rgba(123,47,247,0.12);
    }
    html.dark {
      --bg:          #0f0920;
      --bg-card:     #1a0f35;
      --bg-surface:  #221545;
      --text:        #f0e8ff;
      --text-muted:  #9b8bbf;
      --border:      #3a2560;
      --accent:      #a855f7;
      --accent-2:    #f472b6;
      --shadow:      rgba(0,0,0,0.5);
    }

    /* Push page content below the fixed nav — works on ALL pages automatically */
    body { padding-top: var(--nav-h, 56px); }

    /* Smooth theme transition — exclude elements that shouldn't animate */
    body { transition: background-color 0.25s ease, color 0.25s ease; }
    img, svg, canvas, video, .mlp-nav-icon, .pony-emoji, .star, .sp { transition: none !important; }
  `;

  /* ── DARK MODE HELPERS ───────────────────────────────────── */
  function isDark() {
    return document.documentElement.classList.contains('dark');
  }

  function setTheme(dark) {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem(LS_KEY, dark ? 'dark' : 'light');
    updateBtn();
    // Dispatch event so pages can react if needed
    window.dispatchEvent(new CustomEvent('mlp-theme-change', { detail: { dark } }));
  }

  function updateBtn() {
    const btn   = document.getElementById('mlp-theme-btn');
    const label = document.getElementById('mlp-theme-label');
    if (!btn) return;
    if (isDark()) {
      btn.textContent = '☀️';
      btn.title = 'เปลี่ยนเป็น Light Mode';
      if (label) label.textContent = 'Light';
    } else {
      btn.textContent = '🌙';
      btn.title = 'เปลี่ยนเป็น Dark Mode';
      if (label) label.textContent = 'Dark';
    }
  }

  /* ── BUILD HELPERS ───────────────────────────────────────── */
  function isActive(link) {
    const path = location.pathname;
    if (link.match && link.match.some(m => path === m)) return true;
    const hrefPath = link.href.split('?')[0];
    if (hrefPath !== BASE + '/' && hrefPath !== BASE && path.startsWith(hrefPath)) return true;
    return false;
  }

  function buildLinks(links) {
    return links.map(l => {
      const active = isActive(l) ? ' active' : '';
      return `<a class="mlp-nav-link${active}" href="${l.href}">
        <span class="mlp-nav-icon">${l.icon}</span>${l.label}
      </a>`;
    }).join('');
  }

  function buildNav() {
    return `
      <nav id="mlp-nav">
        <div class="mlp-nav-inner">
          <a class="mlp-nav-logo" href="${BASE}/">
            <span class="mlp-nav-logo-icon">${SITE_LOGO}</span>
            <span class="mlp-nav-logo-text">${SITE_TITLE}</span>
          </a>
          <div class="mlp-nav-div"></div>
          <div class="mlp-nav-links">${buildLinks(NAV_LINKS)}</div>
          <div class="mlp-nav-right">
            <span class="mlp-theme-label" id="mlp-theme-label"></span>
            <button id="mlp-theme-btn" aria-label="Toggle dark mode"></button>
          </div>
          <button class="mlp-nav-burger" id="mlp-burger" aria-label="เมนู">☰</button>
        </div>
        <div class="mlp-nav-drawer" id="mlp-drawer">
          ${buildLinks(NAV_LINKS)}
        </div>
      </nav>`;
  }

  /* ── INJECT ──────────────────────────────────────────────── */
  function inject() {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    const wrapper = document.createElement('div');
    wrapper.innerHTML = buildNav();
    document.body.insertBefore(wrapper.firstElementChild, document.body.firstChild);

    updateBtn();

    document.getElementById('mlp-theme-btn')
      ?.addEventListener('click', () => setTheme(!isDark()));

    const burger = document.getElementById('mlp-burger');
    const drawer = document.getElementById('mlp-drawer');
    burger?.addEventListener('click', () => {
      drawer.classList.toggle('open');
      burger.textContent = drawer.classList.contains('open') ? '✕' : '☰';
    });

    // Dynamically sync --nav-h to the actual rendered nav height so all
    // calc(100dvh - var(--nav-h)) layouts are pixel-perfect on every device.
    function _syncNavH() {
      const nav = document.getElementById('mlp-nav');
      if (!nav) return;
      const h = nav.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--nav-h', h + 'px');
    }
    _syncNavH();
    window.addEventListener('resize', _syncNavH);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

})();
