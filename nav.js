/* ============================================================
   MLP TCG — Shared Navigation Bar  (v2 — with Dark Mode)
   Usage: <script src="./nav.js"></script>  (use relative path)

   Dark mode works via:
   1. <html class="dark"> toggled by this script
   2. Pages opt-in by defining CSS vars under :root and html.dark
   3. Preference saved to localStorage key "mlp-theme"
   ============================================================ */

(function () {
  // ── Supabase CDN: inject async, init client on load ──────
  (function _loadSupabase() {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    s.onload = _initSupabase;
    document.head.appendChild(s);
  })();

  function _initSupabase() {
    // Replace these placeholders with your real Supabase project values.
    // On Vercel: set SUPABASE_URL and SUPABASE_ANON_KEY env vars, then
    // serve nav.js through an edge function that substitutes them, OR
    // just hardcode the public anon key here (it is safe to expose).
    const SUPABASE_URL = 'https://rljgoglmdqqzzuoozsfs.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsamdvZ2xtZHFxenp1b296c2ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MjE4NjEsImV4cCI6MjA5MDk5Nzg2MX0.zuXAGh_C7dhOdMvN8Y64jOi6ZjvrnvIe6rd5sSo_yU0';
    if (SUPABASE_URL === 'SUPABASE_URL_PLACEHOLDER') return; // not configured yet

    try {
      window._supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    } catch (e) { console.warn('Supabase init failed:', e); return; }

    window._supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        localStorage.setItem('dreamtcg-session', JSON.stringify(session));
        _updateAuthUI(session.user);
        if (event === 'SIGNED_IN' && typeof window._onFirstLogin === 'function') {
          setTimeout(() => window._onFirstLogin(), 500);
        }
        // Only trigger cloud sync on explicit login or initial session restore, not on token refresh
        if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && typeof window._onAuthReady === 'function') {
          setTimeout(() => window._onAuthReady(session), 800);
        }
      } else {
        localStorage.removeItem('dreamtcg-session');
        _updateAuthUI(null);
      }
    });

    // Restore session from previous visit
    window._supabase.auth.getSession().then(({ data: { session } }) => {
      _updateAuthUI(session ? session.user : null);
      // INITIAL_SESSION from onAuthStateChange already covers restored sessions;
      // only call here when onAuthStateChange won't fire (some edge cases)
      if (session && typeof window._onAuthReady === 'function') {
        setTimeout(() => window._onAuthReady(session), 800);
      }
    });
  }

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
    { key: 'nav.home',        icon: '🏠', href: BASE + '/',            match: [BASE + '/', BASE + '/index.html', BASE] },
    { key: 'nav.cards',       icon: '🃏', href: BASE + '/library/',     match: [BASE + '/library/', BASE + '/library/index.html'] },
    { key: 'nav.deckbuilder', icon: '🗂️', href: BASE + '/deckbuilder/', match: [BASE + '/deckbuilder/', BASE + '/deckbuilder/index.html'] },
    // { key: 'nav.battlesim', icon: '⚔️', href: BASE + '/battlesim/',  match: [BASE + '/battlesim/', BASE + '/battlesim/index.html'] },  // temporarily disabled
    { key: 'nav.rules',       icon: '📋', href: BASE + '/#rules',       match: [] },
  ];

  const SITE_TITLE = 'DreamTCG';
  const SITE_LOGO  = '🦄';
  const LS_KEY     = 'mlp-theme';
  const LS_LANG    = 'mlp-lang';

  /* ── i18n DICTIONARY ────────────────────────────────────── */
  const _DICT = {
    en: {
      'nav.home':         'Home',
      'nav.cards':        'Cards',
      'nav.deckbuilder':  'Deck Builder',
      'nav.rules':        'Rules',
      'auth.login':       '🔑 Login',
      'auth.logout':      '🚪 Logout',
      'auth.title':       '🦄 Sign In',
      'auth.subtitle':    'Sync your decks to the cloud',
      'auth.tabLogin':    'Sign In',
      'auth.tabSignup':   'Sign Up',
      'auth.email':       'Email',
      'auth.password':    'Password',
      'auth.submitLogin': 'Sign In',
      'auth.submitSignup':'Sign Up',
      'auth.or':          'or',
      'auth.loginGoogle': 'Sign in with Google',
      'auth.loginX':      'Sign in with X',
      'auth.cancel':      'Cancel',
      'auth.privacyPre':  'By signing in you accept our',
      'auth.privacyLink': 'Privacy Policy',
      'auth.privacyPost': '— your data will not be used for commercial purposes',
      'auth.errorEmpty':  'Please enter email and password',
      'auth.notReady':    'Auth system not ready, please wait',
      'auth.loginFailed': 'Sign in failed:\n',
      'auth.signupOk':    'Check your email to confirm sign-up',
      'banner.text':      'Login to sync your decks online →',
      'banner.close':     'Close',
      'theme.toLight':    'Switch to Light Mode',
      'theme.toDark':     'Switch to Dark Mode',
      'lang.switchTo':    'TH',
      'nav.burger':       'Menu',
    },
    th: {
      'nav.home':         'หน้าหลัก',
      'nav.cards':        'การ์ด',
      'nav.deckbuilder':  'จัดเด็ค',
      'nav.rules':        'วิธีเล่น',
      'auth.login':       '🔑 เข้าสู่ระบบ',
      'auth.logout':      '🚪 ออกจากระบบ',
      'auth.title':       '🦄 เข้าสู่ระบบ',
      'auth.subtitle':    'ซิงก์เด็คของคุณไว้บน cloud',
      'auth.tabLogin':    'เข้าสู่ระบบ',
      'auth.tabSignup':   'สมัครสมาชิก',
      'auth.email':       'อีเมล',
      'auth.password':    'รหัสผ่าน',
      'auth.submitLogin': 'เข้าสู่ระบบ',
      'auth.submitSignup':'สมัครสมาชิก',
      'auth.or':          'หรือ',
      'auth.loginGoogle': 'เข้าสู่ระบบด้วย Google',
      'auth.loginX':      'เข้าสู่ระบบด้วย X',
      'auth.cancel':      'ยกเลิก',
      'auth.privacyPre':  'การเข้าสู่ระบบถือว่าคุณยอมรับ',
      'auth.privacyLink': 'Privacy Policy',
      'auth.privacyPost': 'ของเรา — ข้อมูลของคุณจะไม่ถูกนำไปใช้เพื่อผลประโยชน์เชิงพาณิชย์ใดๆ',
      'auth.errorEmpty':  'กรุณากรอกอีเมลและรหัสผ่าน',
      'auth.notReady':    'ระบบ Auth ยังไม่พร้อม กรุณารอสักครู่',
      'auth.loginFailed': 'เข้าสู่ระบบไม่สำเร็จ:\n',
      'auth.signupOk':    'กรุณาตรวจสอบอีเมลเพื่อยืนยันการสมัคร',
      'banner.text':      'ล็อกอินเพื่อซิงก์เด็คของคุณไว้ออนไลน์ →',
      'banner.close':     'ปิด',
      'theme.toLight':    'เปลี่ยนเป็น Light Mode',
      'theme.toDark':     'เปลี่ยนเป็น Dark Mode',
      'lang.switchTo':    'EN',
      'nav.burger':       'เมนู',
    }
  };

  let _lang = localStorage.getItem(LS_LANG) || 'en';

  function t(key) {
    return (_DICT[_lang] && _DICT[_lang][key]) || (_DICT.en && _DICT.en[key]) || key;
  }

  function setLang(lang) {
    if (lang !== 'en' && lang !== 'th') return;
    _lang = lang;
    localStorage.setItem(LS_LANG, lang);
    _rebuildNavStrings();
    window.dispatchEvent(new CustomEvent('mlp-lang-change', { detail: { lang } }));
  }

  /* ── Expose i18n globally so pages can use it ─────────── */
  window.i18n = {
    get lang() { return _lang; },
    t,
    setLang,
  };

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
      position: fixed; top: 0; left: 0; right: 0; z-index: 499;
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

    /* ── Feedback button ── */
    #mlp-feedback-btn {
      display: flex; align-items: center; justify-content: center;
      width: 36px; height: 36px;
      background: rgba(255,255,255,0.12);
      border: 1.5px solid rgba(255,255,255,0.25);
      border-radius: 10px; font-size: 1.05rem; text-decoration: none;
      transition: background 0.2s, transform 0.2s, border-color 0.2s;
      flex-shrink: 0; color: #fff; line-height: 1;
    }
    #mlp-feedback-btn:hover { background: rgba(255,255,255,0.22); transform: scale(1.1); border-color: rgba(255,255,255,0.45); }
    #mlp-feedback-btn:active { transform: scale(0.92); }
    html.dark #mlp-feedback-btn { background: rgba(255,255,255,0.10); border-color: rgba(255,255,255,0.20); }
    html.dark #mlp-feedback-btn:hover { background: rgba(255,255,255,0.20); }
    @media (max-width: 640px) { #mlp-feedback-btn { width: 30px; height: 30px; font-size: 0.9rem; border-radius: 8px; } }

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

    /* ── Language toggle ── */
    #mlp-lang-btn {
      display: flex; align-items: center; justify-content: center;
      width: 36px; height: 36px;
      background: rgba(255,255,255,0.12);
      border: 1.5px solid rgba(255,255,255,0.25);
      border-radius: 10px; cursor: pointer; font-size: 0.72rem; font-weight: 800;
      transition: background 0.2s, transform 0.2s, border-color 0.2s;
      flex-shrink: 0; color: #fff; letter-spacing: 0.5px;
    }
    #mlp-lang-btn:hover { background: rgba(255,255,255,0.22); transform: scale(1.08); border-color: rgba(255,255,255,0.45); }
    #mlp-lang-btn:active { transform: scale(0.9); }
    @media (max-width: 640px) { #mlp-lang-btn { width: 30px; height: 30px; font-size: 0.68rem; border-radius: 8px; } }

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

    /* ── Auth UI ── */
    #mlp-auth-wrap { display:flex; align-items:center; }

    /* ── User account bar (same drawer pattern as hamburger menu) ── */
    #mlp-user-drawer { flex-direction:row; align-items:center; justify-content:space-between; padding:8px 20px; gap:12px; }
    #mlp-user-drawer .mlp-user-name { color:rgba(255,255,255,0.85); font-size:0.82rem; font-weight:700; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; display:flex; align-items:center; gap:8px; }
    #mlp-user-drawer .mlp-user-actions { display:flex; align-items:center; gap:8px; flex-shrink:0; }
    #mlp-user-logout {
      background:rgba(248,113,113,0.15); border:1.5px solid rgba(248,113,113,0.4);
      color:#fca5a5; border-radius:8px; padding:5px 14px;
      font-size:0.75rem; font-weight:700; font-family:'Nunito','Prompt',sans-serif;
      cursor:pointer; white-space:nowrap;
      transition:background 0.2s, border-color 0.2s;
    }
    #mlp-user-logout:hover { background:rgba(248,113,113,0.28); border-color:rgba(248,113,113,0.65); }

    #mlp-login-btn {
      display:flex; align-items:center; gap:5px;
      background:rgba(255,255,255,0.15); border:1.5px solid rgba(255,255,255,0.3);
      color:#fff; border-radius:9px; padding:5px 11px;
      font-size:0.75rem; font-weight:700; font-family:'Nunito','Prompt',sans-serif;
      cursor:pointer; white-space:nowrap; flex-shrink:0;
      transition:background 0.2s, border-color 0.2s;
    }
    #mlp-login-btn:hover { background:rgba(255,255,255,0.25); border-color:rgba(255,255,255,0.5); }
    @media (max-width:640px) { #mlp-login-btn { padding:3px 8px; font-size:0.68rem; } }

    #mlp-user-btn {
      display:flex; align-items:center; gap:6px;
      background:rgba(255,255,255,0.12); border:1.5px solid rgba(255,255,255,0.25);
      color:#fff; border-radius:9px; padding:4px 9px 4px 4px;
      font-size:0.75rem; font-weight:700; font-family:'Nunito','Prompt',sans-serif;
      cursor:pointer; white-space:nowrap; transition:background 0.2s;
    }
    #mlp-user-btn:hover { background:rgba(255,255,255,0.22); }
    .mlp-avatar {
      width:28px; height:28px; border-radius:50%;
      background:linear-gradient(135deg,#a855f7,#ec4899);
      display:flex; align-items:center; justify-content:center;
      font-size:0.72rem; font-weight:900; color:#fff;
      overflow:hidden; flex-shrink:0;
    }
    .mlp-avatar img { width:100%; height:100%; object-fit:cover; }

    /* ── Login modal ── */
    #mlp-login-modal {
      display:none; position:fixed; inset:0; z-index:700;
      background:rgba(0,0,0,0.78); align-items:center; justify-content:center;
      padding:20px;
    }
    #mlp-login-modal.open { display:flex; }
    #mlp-login-box {
      background:var(--bg-card,#1a0f35); border:1px solid var(--border,#3a2560);
      border-radius:16px; padding:24px 20px; width:100%; max-width:340px;
      box-shadow:0 16px 48px rgba(0,0,0,0.7);
    }
    .mlp-login-title {
      font-family:'Fredoka One',cursive; font-size:1.2rem;
      color:var(--text,#f0e8ff); text-align:center; margin-bottom:6px;
    }
    .mlp-login-sub {
      font-size:0.72rem; color:var(--text-muted,#9b8bbf);
      text-align:center; margin-bottom:18px;
    }
    .mlp-oauth-btn {
      display:flex; align-items:center; gap:10px;
      width:100%; padding:10px 14px; margin-bottom:8px;
      border-radius:10px; border:1.5px solid var(--border,#3a2560);
      background:var(--bg-surface,#221545); color:var(--text,#f0e8ff);
      font-size:0.82rem; font-weight:700; font-family:'Nunito','Prompt',sans-serif;
      cursor:pointer; transition:background 0.2s, border-color 0.2s;
    }
    .mlp-oauth-btn:hover { background:rgba(255,255,255,0.06); border-color:var(--accent,#a855f7); }
    .mlp-oauth-icon { font-size:1.1rem; line-height:1; flex-shrink:0; }
    .mlp-login-cancel {
      display:block; width:100%; padding:8px; margin-top:4px;
      border:none; background:none; color:var(--text-muted,#9b8bbf);
      font-size:0.75rem; font-family:'Nunito','Prompt',sans-serif;
      cursor:pointer; text-align:center; border-radius:8px;
    }
    .mlp-login-cancel:hover { background:rgba(255,255,255,0.05); color:var(--text,#f0e8ff); }
    .mlp-tab-row {
      display:flex; gap:0; margin-bottom:16px;
      border-bottom:1.5px solid var(--border,#3a2560);
    }
    .mlp-tab {
      flex:1; padding:8px 0; border:none; background:none;
      color:var(--text-muted,#9b8bbf); font-size:0.8rem; font-weight:700;
      font-family:'Nunito','Prompt',sans-serif; cursor:pointer;
      border-bottom:2.5px solid transparent; margin-bottom:-1.5px;
      transition:color 0.15s, border-color 0.15s;
    }
    .mlp-tab.active { color:var(--accent,#a855f7); border-bottom-color:var(--accent,#a855f7); }
    .mlp-login-input {
      display:block; width:100%; padding:9px 12px; margin-bottom:8px;
      border-radius:9px; border:1.5px solid var(--border,#3a2560);
      background:var(--bg-surface,#221545); color:var(--text,#f0e8ff);
      font-size:0.82rem; font-family:'Nunito','Prompt',sans-serif;
      outline:none; box-sizing:border-box; transition:border-color 0.2s;
    }
    .mlp-login-input:focus { border-color:var(--accent,#a855f7); }
    .mlp-login-input::placeholder { color:var(--text-muted,#9b8bbf); }
    .mlp-login-submit {
      display:block; width:100%; padding:10px; margin-bottom:6px;
      border-radius:9px; border:none;
      background:var(--accent,#a855f7); color:#fff;
      font-size:0.85rem; font-weight:700; font-family:'Nunito','Prompt',sans-serif;
      cursor:pointer; transition:opacity 0.2s;
    }
    .mlp-login-submit:hover { opacity:0.88; }
    .mlp-login-submit:disabled { opacity:0.5; cursor:default; }
    .mlp-login-error {
      font-size:0.72rem; color:#f87171; text-align:center;
      margin-bottom:6px; min-height:1em;
    }
    .mlp-login-divider {
      display:flex; align-items:center; gap:8px;
      margin:10px 0; color:var(--text-muted,#9b8bbf); font-size:0.7rem;
    }
    .mlp-login-divider::before, .mlp-login-divider::after {
      content:''; flex:1; height:1px; background:var(--border,#3a2560);
    }

    /* ── Sync banner ── */
    #mlp-sync-banner {
      position:fixed; top:var(--nav-h,56px); left:0; right:0; z-index:490;
      background:linear-gradient(90deg,#4a0fa8,#6b21c8,#4a0fa8);
      color:rgba(255,255,255,0.92); font-size:0.75rem; font-weight:700;
      font-family:'Nunito','Prompt',sans-serif;
      display:flex; align-items:center; justify-content:center; gap:10px;
      padding:7px 16px; cursor:pointer;
      box-shadow:0 2px 12px rgba(0,0,0,0.3);
    }
    #mlp-sync-banner:hover { background:linear-gradient(90deg,#5b1fa8,#7c2fd4,#5b1fa8); }
    #mlp-banner-close {
      background:none; border:none; color:rgba(255,255,255,0.7);
      font-size:1rem; cursor:pointer; padding:0 2px; line-height:1; flex-shrink:0;
    }
    #mlp-banner-close:hover { color:#fff; }
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
      btn.title = t('theme.toLight');
      if (label) label.textContent = 'Light';
    } else {
      btn.textContent = '🌙';
      btn.title = t('theme.toDark');
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
      return `<a class="mlp-nav-link${active}" href="${l.href}" data-i18n-key="${l.key}"><span class="mlp-nav-icon">${l.icon}</span><span class="mlp-nav-text">${t(l.key)}</span></a>`;
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
            <div id="mlp-auth-wrap"></div>
            <a id="mlp-feedback-btn" href="https://m.me/Kiettisak.v" target="_blank" rel="noopener" aria-label="Feedback" title="Feedback">💬</a>
            <button id="mlp-lang-btn" aria-label="Toggle language">${t('lang.switchTo')}</button>
            <span class="mlp-theme-label" id="mlp-theme-label"></span>
            <button id="mlp-theme-btn" aria-label="Toggle dark mode"></button>
          </div>
          <button class="mlp-nav-burger" id="mlp-burger" aria-label="${t('nav.burger')}">☰</button>
        </div>
        <div class="mlp-nav-drawer" id="mlp-user-drawer"></div>
        <div class="mlp-nav-drawer" id="mlp-drawer">
          ${buildLinks(NAV_LINKS)}
        </div>
      </nav>`;
  }

  /* ── i18n REBUILD ───────────────────────────────────────── */
  function _rebuildNavStrings() {
    // Nav links (desktop + mobile drawer)
    document.querySelectorAll('.mlp-nav-link[data-i18n-key]').forEach(el => {
      const key = el.dataset.i18nKey;
      const textSpan = el.querySelector('.mlp-nav-text');
      if (textSpan) textSpan.textContent = t(key);
    });
    // Lang toggle button (shows the language you'll switch TO)
    const lb = document.getElementById('mlp-lang-btn');
    if (lb) lb.textContent = t('lang.switchTo');
    // Theme button tooltip
    updateBtn();
    // Login / logout buttons
    const loginBtn = document.getElementById('mlp-login-btn');
    if (loginBtn) loginBtn.innerHTML = t('auth.login');
    const logoutBtn = document.getElementById('mlp-user-logout');
    if (logoutBtn) logoutBtn.innerHTML = t('auth.logout');
    // Sync banner — update text node and close button title
    const banner = document.getElementById('mlp-sync-banner');
    if (banner) {
      const closeBtn = document.getElementById('mlp-banner-close');
      const textNode = [...banner.childNodes].find(n => n.nodeType === 3);
      if (textNode) textNode.textContent = t('banner.text') + '\n      ';
      if (closeBtn) closeBtn.title = t('banner.close');
    }
    // Login modal strings
    _refreshLoginModalStrings();
    // Burger aria-label
    const burger = document.getElementById('mlp-burger');
    if (burger) burger.setAttribute('aria-label', t('nav.burger'));
  }

  function _refreshLoginModalStrings() {
    const title     = document.querySelector('.mlp-login-title');
    const sub       = document.querySelector('.mlp-login-sub');
    const tabLogin  = document.getElementById('mlp-tab-login');
    const tabSignup = document.getElementById('mlp-tab-signup');
    const submitBtn = document.getElementById('mlp-submit-btn');
    const emailIn   = document.getElementById('mlp-email-input');
    const pwIn      = document.getElementById('mlp-pw-input');
    const cancelBtn = document.querySelector('.mlp-login-cancel');
    const divider   = document.querySelector('.mlp-login-divider');
    if (title)    title.textContent       = t('auth.title');
    if (sub)      sub.textContent         = t('auth.subtitle');
    if (tabLogin) tabLogin.textContent    = t('auth.tabLogin');
    if (tabSignup)tabSignup.textContent   = t('auth.tabSignup');
    if (submitBtn) {
      const isSignup = tabSignup?.classList.contains('active');
      submitBtn.textContent = t(isSignup ? 'auth.submitSignup' : 'auth.submitLogin');
    }
    if (emailIn)  emailIn.placeholder     = t('auth.email');
    if (pwIn)     pwIn.placeholder        = t('auth.password');
    if (cancelBtn)cancelBtn.textContent   = t('auth.cancel');
    if (divider)  divider.textContent     = t('auth.or');
    // OAuth button text nodes (buttons have data-oauth-key attribute)
    document.querySelectorAll('.mlp-oauth-btn[data-oauth-key]').forEach(btn => {
      const key = btn.dataset.oauthKey;
      const textNode = [...btn.childNodes].find(n => n.nodeType === 3 && n.textContent.trim());
      if (textNode) textNode.textContent = '\n          ' + t(key) + '\n        ';
    });
    // Privacy disclaimer
    const privDiv = document.querySelector('#mlp-login-box > div[style*="margin-top:12px"]');
    if (privDiv) {
      privDiv.innerHTML = `${t('auth.privacyPre')}
          <a href="/privacy/" target="_blank" style="color:var(--purple,#a78bfa);text-decoration:underline;">${t('auth.privacyLink')}</a>
          ${t('auth.privacyPost')}`;
    }
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

    document.getElementById('mlp-lang-btn')
      ?.addEventListener('click', () => setLang(_lang === 'en' ? 'th' : 'en'));

    const burger = document.getElementById('mlp-burger');
    const drawer = document.getElementById('mlp-drawer');
    burger?.addEventListener('click', () => {
      drawer.classList.toggle('open');
      burger.textContent = drawer.classList.contains('open') ? '✕' : '☰';
    });

    // User account bar — same toggle pattern as burger/drawer
    document.getElementById('mlp-auth-wrap').addEventListener('click', e => {
      if (e.target.closest('#mlp-user-btn')) {
        const ud = document.getElementById('mlp-user-drawer');
        if (ud) {
          ud.classList.toggle('open');
          _syncNavHBanner();
        }
      }
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

    // Inject login modal into body
    _injectLoginModal();

    // Inject sync banner (only when logged out, dismissible per session)
    _injectSyncBanner();

    // Render initial auth state from cached session while Supabase loads
    const _cached = localStorage.getItem('dreamtcg-session');
    if (_cached) {
      try { _updateAuthUI(JSON.parse(_cached).user); } catch(e) {}
    } else {
      _updateAuthUI(null);
    }

  }

  /* ── AUTH UI ─────────────────────────────────────────── */
  function _updateAuthUI(user) {
    const wrap   = document.getElementById('mlp-auth-wrap');
    if (!wrap) return;
    const banner = document.getElementById('mlp-sync-banner');
    const ud     = document.getElementById('mlp-user-drawer');

    if (!user) {
      // Logged out: show login button, hide & clear account bar
      wrap.innerHTML = `<button id="mlp-login-btn">${t('auth.login')}</button>`;
      wrap.querySelector('#mlp-login-btn').addEventListener('click', _openLoginModal);
      if (ud) { ud.classList.remove('open'); ud.innerHTML = ''; }
      if (banner && !sessionStorage.getItem('mlp-banner-dismissed')) {
        banner.style.display = '';
      }
      _syncNavHBanner();
    } else {
      // Logged in: show avatar button and populate account bar
      const name    = (user.user_metadata?.full_name || user.user_metadata?.name || user.email || 'User').slice(0, 24);
      const avatar  = user.user_metadata?.avatar_url || '';
      const initial = name.charAt(0).toUpperCase();
      const avatarHTML = avatar
        ? `<img src="${avatar}" alt="${initial}" onerror="this.style.display='none';this.parentNode.textContent='${initial}'">`
        : initial;

      wrap.innerHTML = `<button id="mlp-user-btn"><span class="mlp-avatar">${avatarHTML}</span><span style="font-size:0.6rem;opacity:0.7;margin-left:4px;">▼</span></button>`;

      if (ud) {
        ud.innerHTML = `
          <div class="mlp-user-name">
            <span class="mlp-avatar" style="width:24px;height:24px;font-size:0.65rem;">${avatarHTML}</span>
            👤 ${name}
          </div>
          <div class="mlp-user-actions">
            <button id="mlp-user-logout">${t('auth.logout')}</button>
          </div>`;
        ud.querySelector('#mlp-user-logout').addEventListener('click', () => {
          ud.classList.remove('open');
          _syncNavHBanner();
          _logOut();
        });
      }

      if (banner) banner.style.display = 'none';
      _syncNavHBanner();
    }
  }

  function _openLoginModal() {
    const m = document.getElementById('mlp-login-modal');
    if (m) m.classList.add('open');
  }

  function _closeLoginModal() {
    const m = document.getElementById('mlp-login-modal');
    if (m) m.classList.remove('open');
  }

  function _loginWith(provider) {
    const sb = window._supabase;
    if (!sb) { alert(t('auth.notReady')); return; }
    _closeLoginModal();
    sb.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin + window.location.pathname }
    }).then(({ error }) => {
      if (error) {
        console.error('[auth] signInWithOAuth error:', error);
        alert(t('auth.loginFailed') + error.message + '\n\n(ตรวจสอบว่าเปิดใช้งาน ' + provider + ' provider ใน Supabase Dashboard แล้ว)');
      }
    });
  }

  function _toggleAuthTab(mode) {
    const loginTab = document.getElementById('mlp-tab-login');
    const signupTab = document.getElementById('mlp-tab-signup');
    const submitBtn = document.getElementById('mlp-submit-btn');
    const pwInput = document.getElementById('mlp-pw-input');
    const errDiv = document.getElementById('mlp-auth-error');
    if (!loginTab) return;
    if (mode === 'signup') {
      loginTab.classList.remove('active');
      signupTab.classList.add('active');
      submitBtn.textContent = t('auth.submitSignup');
      pwInput.autocomplete = 'new-password';
    } else {
      signupTab.classList.remove('active');
      loginTab.classList.add('active');
      submitBtn.textContent = t('auth.submitLogin');
      pwInput.autocomplete = 'current-password';
    }
    if (errDiv) errDiv.textContent = '';
  }

  function _submitEmailAuth() {
    const sb = window._supabase;
    if (!sb) { alert(t('auth.notReady')); return; }
    const email = (document.getElementById('mlp-email-input') || {}).value || '';
    const password = (document.getElementById('mlp-pw-input') || {}).value || '';
    const errDiv = document.getElementById('mlp-auth-error');
    const submitBtn = document.getElementById('mlp-submit-btn');
    const isSignup = document.getElementById('mlp-tab-signup').classList.contains('active');

    if (!email || !password) {
      if (errDiv) errDiv.textContent = t('auth.errorEmpty');
      return;
    }
    if (errDiv) errDiv.textContent = '';
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = '...'; }

    const done = (err, msg) => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = isSignup ? t('auth.submitSignup') : t('auth.submitLogin');
      }
      if (err && errDiv) errDiv.textContent = err;
      if (msg && errDiv) { errDiv.style.color = '#4ade80'; errDiv.textContent = msg; }
    };

    if (isSignup) {
      sb.auth.signUp({ email, password }).then(({ data, error }) => {
        if (error) { done(error.message); return; }
        if (data.session) {
          _closeLoginModal();
        } else {
          done(null, t('auth.signupOk'));
        }
      });
    } else {
      sb.auth.signInWithPassword({ email, password }).then(({ error }) => {
        if (error) { done(error.message); return; }
        _closeLoginModal();
      });
    }
  }

  function _logOut() {
    const sb = window._supabase;
    if (sb) sb.auth.signOut();
    localStorage.removeItem('dreamtcg-session');
    if (typeof window._onLogout === 'function') window._onLogout();
    _updateAuthUI(null);
  }

  function _injectLoginModal() {
    if (document.getElementById('mlp-login-modal')) return;
    const el = document.createElement('div');
    el.id = 'mlp-login-modal';
    el.onclick = e => { if (e.target === el) _closeLoginModal(); };
    el.innerHTML = `
      <div id="mlp-login-box">
        <div class="mlp-login-title">${t('auth.title')}</div>
        <div class="mlp-login-sub">${t('auth.subtitle')}</div>
        <div class="mlp-tab-row">
          <button class="mlp-tab active" id="mlp-tab-login" onclick="_toggleAuthTab('login')">${t('auth.tabLogin')}</button>
          <button class="mlp-tab" id="mlp-tab-signup" onclick="_toggleAuthTab('signup')">${t('auth.tabSignup')}</button>
        </div>
        <input id="mlp-email-input" class="mlp-login-input" type="email" placeholder="${t('auth.email')}" autocomplete="email" />
        <input id="mlp-pw-input" class="mlp-login-input" type="password" placeholder="${t('auth.password')}" autocomplete="current-password" />
        <button id="mlp-submit-btn" class="mlp-login-submit" onclick="_submitEmailAuth()">${t('auth.submitLogin')}</button>
        <div id="mlp-auth-error" class="mlp-login-error"></div>
        <div class="mlp-login-divider">${t('auth.or')}</div>
        <button class="mlp-oauth-btn" onclick="_loginWith('google')" data-oauth-key="auth.loginGoogle">
          <span class="mlp-oauth-icon"><svg width="18" height="18" viewBox="0 0 24 24" style="display:block"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg></span>
          ${t('auth.loginGoogle')}
        </button>
        <button class="mlp-oauth-btn" onclick="_loginWith('twitter')" data-oauth-key="auth.loginX">
          <span class="mlp-oauth-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="display:block"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.622 5.905-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></span>
          ${t('auth.loginX')}
        </button>
        <button class="mlp-login-cancel" onclick="_closeLoginModal()">${t('auth.cancel')}</button>
        <div style="margin-top:12px;font-size:0.58rem;color:var(--dim,#6b5a9a);text-align:center;line-height:1.5;">
          ${t('auth.privacyPre')}
          <a href="/privacy/" target="_blank" style="color:var(--purple,#a78bfa);text-decoration:underline;">${t('auth.privacyLink')}</a>
          ${t('auth.privacyPost')}
        </div>
      </div>`;
    document.body.appendChild(el);
  }

  function _injectSyncBanner() {
    if (document.getElementById('mlp-sync-banner')) return;
    if (sessionStorage.getItem('mlp-banner-dismissed')) return;
    const el = document.createElement('div');
    el.id = 'mlp-sync-banner';
    el.style.display = 'none'; // shown by _updateAuthUI when logged out
    el.onclick = _openLoginModal;
    el.innerHTML = `${t('banner.text')}
      <button id="mlp-banner-close" onclick="_dismissBanner(event)" title="${t('banner.close')}">✕</button>`;
    // Insert after nav
    const nav = document.getElementById('mlp-nav');
    if (nav && nav.nextSibling) {
      document.body.insertBefore(el, nav.nextSibling);
    } else {
      document.body.appendChild(el);
    }
    _syncNavHBanner();
  }

  function _dismissBanner(e) {
    if (e) e.stopPropagation();
    sessionStorage.setItem('mlp-banner-dismissed', '1');
    const el = document.getElementById('mlp-sync-banner');
    if (el) el.style.display = 'none';
    _syncNavHBanner();
  }

  // Adjust body padding-top to account for banner height
  function _syncNavHBanner() {
    requestAnimationFrame(() => {
      const nav    = document.getElementById('mlp-nav');
      const banner = document.getElementById('mlp-sync-banner');
      if (!nav) return;
      const navH    = nav.getBoundingClientRect().height;
      const bannerH = (banner && banner.style.display !== 'none')
        ? banner.getBoundingClientRect().height : 0;
      document.documentElement.style.setProperty('--nav-h', (navH + bannerH) + 'px');
    });
  }

  // Expose auth helpers so inline onclick attrs work
  window._openLoginModal  = _openLoginModal;
  window._closeLoginModal = _closeLoginModal;
  window._loginWith       = _loginWith;
  window._logOut          = _logOut;
  window._dismissBanner   = _dismissBanner;
  window._toggleAuthTab   = _toggleAuthTab;
  window._submitEmailAuth = _submitEmailAuth;
  // Expose setLang for external callers (pages can call window.i18n.setLang directly)
  window._setLang         = setLang;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

})();
