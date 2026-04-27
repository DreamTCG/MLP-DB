/**
 * MLP-DB — Master Translation Dictionary
 * ═══════════════════════════════════════════════════════════════
 *
 * Single source of truth for all UI strings across all pages.
 * Loaded before nav.js on every page:
 *   <script src="/i18n/translations.js"></script>
 *   <script src="/nav.js"></script>
 *
 * TO ADD A NEW LANGUAGE:
 *   1. Copy the entire `en` block, rename to your lang code, translate values.
 *   2. Add the lang code to nav.js setLang() validation list.
 *
 * ── AUDIT KEY ──────────────────────────────────────────────────
 *   ✅  translate  — User-facing label; a translation is meaningful here
 *   ⚠️  review    — Translation provided but debatable; game terminology /
 *                   proper noun that players may prefer in English
 *   ❌  same      — Keep identical in all languages (symbols, codes,
 *                   brand names, language-selector labels).
 *                   Keys marked ❌ same are OMITTED from language blocks
 *                   other than `en` — the t() fallback serves them.
 *
 * Strings with `/* html *\/` comment use innerHTML (contain <b>, <br>).
 * ═══════════════════════════════════════════════════════════════
 */

(function () {
  window.MLP_I18N = {

    // ─────────────────────────────────────────────────────────
    // ENGLISH
    // ─────────────────────────────────────────────────────────
    en: {

      // ── SHARED / COMMON (library + deckbuilder) ─────────────
      'common.search':        'Search cards...',               // ✅ translate
      'common.filterType':    'Type',                          // ❌ same — kept EN in TH (audit decision)
      'common.filterRarity':  'Rarity',                        // ❌ same
      'common.filterSet':     'Set',                           // ❌ same
      'common.filterRace':    'Race',                          // ❌ same

      // ── NAV BAR (nav.js) ────────────────────────────────────
      'nav.home':         'Home',                              // ✅ translate
      'nav.cards':        'Cards',                             // ✅ translate
      'nav.deckbuilder':  'Deck Builder',                      // ✅ translate
      'nav.rules':        'Rules',                             // ✅ translate
      'nav.wishlist':     'Wishlist',                          // ✅ translate
      'nav.burger':       'Menu',                              // ✅ translate

      // ── LANGUAGE TOGGLE (nav.js) ────────────────────────────
      // Shows the language you will switch TO (opposite of current).
      'lang.switchTo':    'TH',                                // special — differs per lang block; kept manually

      // ── THEME TOGGLE TOOLTIPS (nav.js) ──────────────────────
      'theme.toLight':    'Switch to Light Mode',              // ✅ translate
      'theme.toDark':     'Switch to Dark Mode',               // ✅ translate

      // ── PROXY / FEEDBACK BUTTON (nav.js) ────────────────────
      'nav.proxyOn':      'Proxy Mode ON — click to disable',  // ✅ translate
      'nav.proxyOff':     'Proxy Mode OFF — click to enable',  // ✅ translate
      'nav.proxyBanner':  '⚠️ Proxy Mode: showing unreleased cards — data may not be final', // ✅ translate
      'nav.feedback':     'Send feedback',                     // ✅ translate

      // ── AUTH MODAL (nav.js) ──────────────────────────────────
      'auth.login':       '🔑 Login',                         // ✅ translate
      'auth.logout':      '🚪 Logout',                        // ✅ translate
      'auth.title':       '🦄 Sign In',                       // ✅ translate
      'auth.subtitle':    'Sync your decks to the cloud',     // ✅ translate
      'auth.tabLogin':    'Sign In',                           // ✅ translate
      'auth.tabSignup':   'Sign Up',                           // ✅ translate
      'auth.email':       'Email',                             // ✅ translate
      'auth.password':    'Password',                          // ✅ translate
      'auth.submitLogin': 'Sign In',                           // ✅ translate
      'auth.submitSignup':'Sign Up',                           // ✅ translate
      'auth.or':          'or',                                // ✅ translate
      'auth.loginGoogle': 'Sign in with Google',               // ✅ translate
      'auth.loginX':      'Sign in with X',                    // ✅ translate
      'auth.cancel':      'Cancel',                            // ✅ translate
      'auth.privacyPre':  'By signing in you accept our',     // ✅ translate
      'auth.privacyLink': 'Privacy Policy',                    // ❌ same — legal term kept EN; omitted from TH
      'auth.privacyPost': '— your data will not be used for commercial purposes', // ✅ translate

      // ── AUTH MESSAGES (nav.js) ──────────────────────────────
      'auth.errorEmpty':  'Please enter email and password',   // ✅ translate
      'auth.notReady':    'Auth system not ready, please wait', // ✅ translate
      'auth.loginFailed': 'Sign in failed:\n',                 // ✅ translate
      'auth.signupOk':    'Check your email to confirm sign-up', // ✅ translate

      // ── SYNC BANNER (nav.js) ────────────────────────────────
      'banner.text':      'Login to sync your decks online →', // ✅ translate
      'banner.close':     'Close',                             // ✅ translate


      // ── HOME PAGE (index.html) ──────────────────────────────

      // Nav cards
      'home.deckTitle':    'Deck Builder',                     // ✅ translate
      'home.deckDesc':     'Browse cards, build decks<br>and export lists', // ✅ translate  /* html */
      'home.libraryTitle': 'Card Library',                     // ✅ translate
      'home.libraryDesc':  'Browse all latest cards<br>EN / TH included', // ✅ translate  /* html */
      'home.rulesTitle':   'How to Play',                      // ✅ translate
      'home.rulesDesc':    'Official rules summary<br>in English', // ✅ translate  /* html */

      // Rules panel
      'home.rulesHeading': '📋 Quick Rules Reference',         // ✅ translate
      'rule.objective':    '<b style="color:var(--green)">🎯 Objective</b><br>Reach Story Stage IV first, or force opponent to draw from an empty deck', // ✅ translate  /* html */
      'rule.deck':         '<b style="color:var(--blue)">🃏 Deck</b><br>Main 50 + Scene 15 + Story 4 + Main Character 1', // ⚠️ review — card counts are universal  /* html */
      'rule.turn':         '<b style="color:var(--yellow)">⚡ Turn</b><br>Start → Main → Contact → End, alternating each turn', // ⚠️ review — phase names are game terms  /* html */
      'rule.inspo':        '<b style="color:var(--pink)">💫 Inspo Boost</b><br>Tap a Scene card during Contact to boost Power', // ⚠️ review — game mechanics  /* html */
      'rule.story':        '<b style="color:var(--orange)">🗺️ Story Zone</b><br>Block opponent\'s Story progression with face-down Plans', // ⚠️ review — game mechanics  /* html */
      'rule.contact':      '<b style="color:var(--purple)">🏃 Contact</b><br>Skip first 2 turns — losing side retires their character', // ⚠️ review — game mechanics  /* html */
      'home.rulesNote':    'Full rules: see the official KAYOU rulebook', // ✅ translate

      // Footer
      'home.footer':       'Fan-made tool · Not affiliated with Hasbro / KAYOU officially', // ✅ translate


      // ── CARD LIBRARY (library/index.html) ───────────────────

      'lib.topbarTitle':   '📚 MLP Card Library',              // ✅ translate
      'lib.sortDesc':      '↓',                                // ❌ same — symbol only
      'lib.sortAsc':       '↑',                                // ❌ same — symbol only
      'lib.altAll':        'All',                              // ❌ same — kept EN (audit decision)
      'lib.altNo':         'No ※',                             // ❌ same — kept EN
      'lib.altOnly':       '※ Only',                           // ❌ same — kept EN
      'lib.noCards':       'No cards found',                   // ✅ translate
      'lib.loading':       'Loading cards...',                 // ✅ translate
      'lib.clickDetail':   'Click a card to see details',      // ✅ translate
      'lib.cards':         'cards',                            // ✅ translate  (suffix: "320 cards")


      // ── DECK BUILDER (deckbuilder/index.html) ───────────────

      // Panel / section titles
      'deck.library':      '📚 Library',                       // ✅ translate
      'deck.analysis':     '📊 Analysis',                      // ✅ translate

      // Inputs
      'deck.deckName':     'Deck name...',                     // ✅ translate  (placeholder)

      // Import bar
      'deck.importData':   '⚙️ Import / Data',                 // ✅ translate
      'deck.importActions':'⚙️ Import / Actions',              // ✅ translate

      // Zone labels
      'deck.mainChar':     '⭐ Main Character',                 // ⚠️ review — game zone name
      'deck.mainDeck':     '🃏 Main Deck',                      // ⚠️ review — game zone name
      'deck.sceneDeck':    '🎭 Scene Deck',                     // ⚠️ review — game zone name
      'deck.storyDeck':    '📖 Story Deck',                     // ⚠️ review — game zone name

      // Zone empty states
      'deck.emptyMC':      'Click to add Main Character',      // ✅ translate
      'deck.emptyMain':    'Add cards from Library',           // ✅ translate
      'deck.emptyScene':   'Add Scene cards from Library',     // ✅ translate
      'deck.mcEmpty':      'Empty',                            // ✅ translate  (MC chip when no MC selected)

      // Mobile nav tabs
      'deck.navLib':       'Library',                          // ✅ translate
      'deck.navDeck':      'Deck',                             // ✅ translate
      'deck.navAnalysis':  'Analysis',                         // ✅ translate

      // Analysis panel toggle
      'deck.analysis.show': '📊 Show',                         // ✅ translate
      'deck.analysis.hide': '📊 Hide',                         // ✅ translate

      // ── DECK BUILDER TOASTS / CONFIRMS (deckbuilder/index.html) ─
      // %1, %2 … are positional placeholders replaced by _fmt()

      // Deck management
      'deck.toast.deckSaved':       '💾 Deck saved',                         // ✅ translate
      'deck.toast.deckLoaded':      '📂 Deck loaded',                        // ✅ translate
      'deck.toast.loadFailed':      '❌ Load failed',                         // ✅ translate
      'deck.toast.cleared':         '🗑 Deck cleared',                        // ✅ translate
      'deck.toast.clearConfirm':    'Clear entire deck?',                     // ✅ translate
      'deck.toast.newDeck':         '✨ New deck created',                    // ✅ translate
      'deck.toast.dupName':         '⚠ Duplicate deck name',                 // ✅ translate
      'deck.toast.dupDeckName':     '⚠ Deck with that name already exists',  // ✅ translate
      'deck.toast.renamed':         '✏️ Renamed',                             // ✅ translate
      'deck.toast.deleted':         '🗑️ Deck deleted',                        // ✅ translate
      'deck.toast.deckFull':        'Deck limit reached (10) — delete a deck first', // ✅ translate
      'deck.toast.loggedOut':       '🔓 Logged out — local decks cleared',   // ✅ translate
      'deck.toast.saveFailed':      '❌ Could not save',                      // ✅ translate
      'deck.toast.noMCSelected':    '❌ Please select a Main Character first', // ✅ translate

      // Card adding
      'deck.toast.alreadyMC':       '⚠ Already have a Main Character',       // ✅ translate
      'deck.toast.maxCopies':       '⚠ Max 4 copies (base + alt combined)',  // ✅ translate
      'deck.toast.storyFull':       '⚠ Story slots already filled',          // ✅ translate
      'deck.toast.noMCInLib':       'No Main Character cards in library',     // ✅ translate
      'deck.toast.addMCFirst':      'Add a Main Character from Library',      // ✅ translate

      // Import / export / snapshot
      'deck.toast.invalidJson':     '❌ Invalid JSON file',                   // ✅ translate
      'deck.toast.imgImported':     '🖼 Images imported',                     // ✅ translate
      'deck.toast.zipImported':     '📦 ZIP imported',                        // ✅ translate
      'deck.toast.zipError':        '❌ ZIP error',                           // ✅ translate
      'deck.toast.buildSnapshot':   '📸 Building snapshot…',                  // ✅ translate
      'deck.toast.snapshotFail':    '❌ Snapshot failed',                     // ✅ translate
      'deck.toast.githubFail':      '⚠ Could not load from GitHub — import JSON manually', // ✅ translate
      'deck.toast.loadCards':       '⏳ Loading cards…',                      // ✅ translate (same intent as lib.loading)

      // Wishlist
      'deck.toast.noDeckToSend':    'Nothing in deck to send',                // ✅ translate
      'deck.toast.openWishlist':    '⭐ Opening Wishlist…',                   // ✅ translate
      'deck.toast.wishlistFail':    'Failed to send to Wishlist',             // ✅ translate

      // Cloud sync
      'deck.toast.cloudFail':       '☁️ Cloud save failed — check your connection', // ✅ translate
      'deck.toast.sharedNotFound':  '⚠ Shared deck not found',               // ✅ translate
      'deck.toast.sharedLoadFail':  '❌ Deck load failed',                    // ✅ translate

      // Dynamic toasts — use _fmt(key, ...args); %1/%2 replaced positionally
      'deck.toast.cardsLoaded':     '📚 %1 cards loaded',                     // ✅ translate
      'deck.toast.storyAdded':      '📖 %1 — %2 tier(s) added',              // ✅ translate
      'deck.toast.proxyExcluded':   '⚠️ %1 Proxy card(s) excluded from Wishlist', // ✅ translate
      'deck.toast.snapshotSaved':   '✅ Snapshot saved — %1×%2 px',           // ✅ translate
      'deck.toast.importedEntries': '📋 Imported %1 entries',                 // ✅ translate
      'deck.toast.importedSkipped': '📋 Imported %1 entries (%2 not found)',  // ✅ translate
      'deck.toast.cloudImportOk':   '☁️ Imported %1 decks',                  // ✅ translate
      'deck.toast.cloudImportFail': '⚠ %1 decks failed to import (limit 10?)', // ✅ translate
      'deck.toast.cloudSynced':     '☁️ Loaded %1 deck(s) from cloud',       // ✅ translate
      'deck.toast.cloudSyncFail':   '☁️ Cloud load failed: %1',              // ✅ translate
      'deck.toast.sharedLoaded':    '📥 Shared deck loaded: %1',             // ✅ translate
      'deck.toast.importOk':        '✅ Deck imported: %1',                   // ✅ translate

      // Shared deck banner
      'deck.toast.sharedView':      '📥 Viewing shared deck: %1',            // ✅ translate
      'deck.toast.sharedImport':    '📥 Import this deck',                    // ✅ translate

      // ── DECK BUILDER MODALS ──────────────────────────────────
      'deck.modal.fanLeft':   '🃏 %1 left · %2 discarded',                   // ✅ translate
      'deck.modal.noHand':    'No cards in hand',                             // ✅ translate

      // ── CARD LIBRARY TOASTS ───────────────────────────────────
      'lib.toast.loadFail':   '⚠ Could not load cards',                      // ✅ translate


      // ── BATTLE SIMULATOR (battlesim/index.html) ─────────────

      // Setup screen
      'sim.loadDeck':      'LOAD YOUR DECK',                   // ✅ translate
      'sim.yourDeck':      'YOUR DECK',                        // ✅ translate
      'sim.botDeck':       'BOT DECK 🤖',                      // ⚠️ review — "Bot" is a technical term
      'sim.uploadJson':    '📂 Upload JSON',                    // ⚠️ review — "JSON" is a technical term
      'sim.uploadJsonP':   'Drop JSON file or click to select',       // ✅ translate
      'sim.uploadBot':     '📂 Upload JSON (Bot)',              // ⚠️ review
      'sim.uploadBotP':    'Drop JSON file or click to select (Bot)', // ✅ translate
      'sim.noDeck':        'No deck selected',                 // ✅ translate
      'sim.startGame':     'Start Game',                       // ✅ translate

      // Phase names — game mechanic terms; kept EN in both languages (❌ same)
      'sim.startPhase':    'START PHASE',                      // ❌ same
      'sim.mainPhase':     'MAIN PHASE',                       // ❌ same
      'sim.contactPhase':  'CONTACT PHASE',                    // ❌ same
      'sim.endPhase':      'END PHASE',                        // ❌ same

      // Phase transition button labels — also ❌ same
      'sim.toMain':        'Main Phase →',                     // ❌ same
      'sim.toContact':     'Contact Phase →',                  // ❌ same
      'sim.toEnd':         'End Phase →',                      // ❌ same

      // Top bar game buttons
      'sim.tapScene':      'Tap Scene +1✦',                    // ❌ same — kept EN (audit decision)
      'sim.back':          '✕',                                // ❌ same — symbol

      // Mobile tab buttons
      'sim.hand':          'Hand',                             // ⚠️ review — card-game term
      'sim.actions':       'Actions',                          // ✅ translate
      'sim.log':           'Log',                              // ❌ same — kept EN (audit decision)
      'sim.oppTab':        'OPP',                              // ⚠️ review — abbreviation

      // Game zone labels
      'sim.oppDeck':       'OPP Deck',                         // ⚠️ review
      'sim.oppScene':      'OPP Scene',                        // ⚠️ review
      'sim.oppSceneArea':  'OPP Scene Area',                   // ⚠️ review
      'sim.oppRetire':     'OPP Retire',                       // ⚠️ review — "Retire" is a game term
      'sim.oppMC':         'OPP MC',                           // ⚠️ review — "MC" abbreviation
      'sim.oppStoryArea':  '🤖 OPP Story Area',                // ⚠️ review
      'sim.advArea':       '⚔️ Adventure Area',                // ⚠️ review — game zone name
      'sim.you':           'YOU',                              // ✅ translate
      'sim.opp':           'OPP',                              // ⚠️ review — abbreviation
      'sim.mainChar':      'Main Char',                        // ⚠️ review — game term
      'sim.storyArea':     'Story Area',                       // ⚠️ review — game zone name
      'sim.retirement':    'Retirement',                       // ✅ translate — zone name (translated in TH)
      'sim.sceneDeck':     'Scene Deck',                       // ⚠️ review — game zone name
      'sim.sceneArea':     'Scene Area',                       // ⚠️ review — game zone name
      'sim.mainDeck':      'Main Deck',                        // ⚠️ review — game zone name

      // ── BATTLE SIMULATOR CONFIRMS ────────────────────────────
      'sim.toast.backConfirm': 'Go back to Deck Builder?\n(loaded deck will be reset)', // ✅ translate
    },


    // ─────────────────────────────────────────────────────────
    // THAI  (ภาษาไทย)
    //
    // Keys omitted here fall back to the `en` value via t().
    // Keys marked ❌ same in the EN block are intentionally absent.
    // ─────────────────────────────────────────────────────────
    th: {

      // ── SHARED / COMMON ──────────────────────────────────────
      'common.search':        'ค้นหาการ์ด...',
      // common.filterType / filterRarity / filterSet / filterRace — ❌ same (kept EN)

      // ── NAV BAR ─────────────────────────────────────────────
      'nav.home':         'หน้าหลัก',
      'nav.cards':        'การ์ด',
      'nav.deckbuilder':  'จัดเด็ค',
      'nav.rules':        'วิธีเล่น',
      'nav.wishlist':     'วิชลิสต์',
      'nav.burger':       'เมนู',

      // ── LANGUAGE TOGGLE ─────────────────────────────────────
      'lang.switchTo':    'EN',

      // ── THEME TOGGLE TOOLTIPS ────────────────────────────────
      'theme.toLight':    'เปลี่ยนเป็น Light Mode',
      'theme.toDark':     'เปลี่ยนเป็น Dark Mode',

      // ── PROXY / FEEDBACK BUTTON ──────────────────────────────
      'nav.proxyOn':      'Proxy Mode เปิดอยู่ — คลิกเพื่อปิด',
      'nav.proxyOff':     'Proxy Mode ปิดอยู่ — คลิกเพื่อเปิด',
      'nav.proxyBanner':  '⚠️ Proxy Mode: แสดงการ์ดที่ยังไม่ Official Release ข้อมูลที่แสดงอาจยังไม่ถูกต้องทั้งหมด',
      'nav.feedback':     'ส่งข้อเสนอแนะ',

      // ── AUTH MODAL ───────────────────────────────────────────
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
      // auth.privacyLink — ❌ same (Privacy Policy kept EN)
      'auth.privacyPost': 'ของเรา — ข้อมูลของคุณจะไม่ถูกนำไปใช้เพื่อผลประโยชน์เชิงพาณิชย์ใดๆ',

      // ── AUTH MESSAGES ────────────────────────────────────────
      'auth.errorEmpty':  'กรุณากรอกอีเมลและรหัสผ่าน',
      'auth.notReady':    'ระบบ Auth ยังไม่พร้อม กรุณารอสักครู่',
      'auth.loginFailed': 'เข้าสู่ระบบไม่สำเร็จ:\n',
      'auth.signupOk':    'กรุณาตรวจสอบอีเมลเพื่อยืนยันการสมัคร',

      // ── SYNC BANNER ──────────────────────────────────────────
      'banner.text':      'ล็อกอินเพื่อซิงก์เด็คของคุณไว้ออนไลน์ →',
      'banner.close':     'ปิด',


      // ── HOME PAGE ────────────────────────────────────────────

      'home.deckTitle':    'จัดเด็ค',
      'home.deckDesc':     'เลือกการ์ด สร้างเด็ค<br>และ export รายการ',           /* html */
      'home.libraryTitle': 'ดูการ์ดทั้งหมด',
      'home.libraryDesc':  'ค้นหาการ์ดทุกใบ<br>EN / TH ครบ',                     /* html */
      'home.rulesTitle':   'วิธีเล่น',
      'home.rulesDesc':    'กฎกติกาอย่างเป็นทางการ<br>ฉบับภาษาไทย',             /* html */

      'home.rulesHeading': '📋 กฎสำคัญแบบย่อ',
      'rule.objective':    '<b style="color:var(--green)">🎯 เป้าหมาย</b><br>ดำเนินเนื้อเรื่องถึง Stage IV ก่อน หรือให้คู่ต่อสู้จั่วไม่ได้',  /* html */
      'rule.deck':         '<b style="color:var(--blue)">🃏 เด็ค</b><br>เด็คหลัก 50 ใบ + ฉาก 15 ใบ + เนื้อเรื่อง 4 ใบ + ตัวละครหลัก 1 ใบ', /* html */
      'rule.turn':         '<b style="color:var(--yellow)">⚡ เทิร์น</b><br>Start → Main → Contact → End ทำซ้ำสลับกัน',                       /* html */
      'rule.inspo':        '<b style="color:var(--pink)">💫 Inspo Boost</b><br>คว่ำการ์ดฉากระหว่าง Contact เพื่อบูสค่าพลัง',                 /* html */
      'rule.story':        '<b style="color:var(--orange)">🗺️ Story Zone</b><br>แผนการปิดกั้นการดำเนินเนื้อเรื่องของศัตรู',                  /* html */
      'rule.contact':      '<b style="color:var(--purple)">🏃 Contact</b><br>ข้ามใน 2 เทิร์นแรก — ฝ่ายที่พลังน้อยออกจากสนาม',              /* html */
      'home.rulesNote':    'กฎฉบับเต็ม: ดูใน rulebook ของ KAYOU',
      'home.footer':       'Fan-made tool · ไม่มีความเกี่ยวข้องกับ Hasbro / KAYOU อย่างเป็นทางการ',


      // ── CARD LIBRARY ─────────────────────────────────────────

      'lib.topbarTitle':   '📚 คลังการ์ด MLP',
      // lib.sortDesc / sortAsc — ❌ same (↓ / ↑ symbols)
      // lib.altAll / altNo / altOnly — ❌ same (kept EN: audit decision)
      'lib.noCards':       'ไม่พบการ์ด',
      'lib.loading':       'กำลังโหลดการ์ด...',
      'lib.clickDetail':   'คลิกการ์ดเพื่อดูรายละเอียด',
      'lib.cards':         'ใบ',


      // ── DECK BUILDER ─────────────────────────────────────────

      'deck.library':      '📚 คลังการ์ด',
      'deck.analysis':     '📊 วิเคราะห์',
      'deck.deckName':     'ชื่อเด็ค...',
      'deck.importData':   '⚙️ นำเข้า / ข้อมูล',
      'deck.importActions':'⚙️ นำเข้า / การดำเนินการ',
      'deck.mainChar':     '⭐ การ์ดหลัก',
      'deck.mainDeck':     '🃏 เด็คหลัก',
      'deck.sceneDeck':    '🎭 เด็คฉาก',
      'deck.storyDeck':    '📖 เด็คเรื่องราว',
      // deck.filterType / filterRarity / filterSet / filterRace — ❌ same (moved to common.*, kept EN)
      'deck.emptyMC':      'คลิกเพื่อเพิ่มการ์ดหลัก',
      'deck.emptyMain':    'เพิ่มการ์ดจากคลัง',
      'deck.emptyScene':   'เพิ่มการ์ดฉากจากคลัง',
      'deck.mcEmpty':      'ว่าง',
      'deck.navLib':       'คลัง',
      'deck.navDeck':      'เด็ค',
      'deck.navAnalysis':  'วิเคราะห์',

      // Analysis panel toggle
      'deck.analysis.show': '📊 แสดง',
      'deck.analysis.hide': '📊 ซ่อน',

      // ── DECK BUILDER TOASTS / CONFIRMS ───────────────────────

      // Deck management
      'deck.toast.deckSaved':       '💾 บันทึกเด็คแล้ว',
      'deck.toast.deckLoaded':      '📂 โหลดเด็คแล้ว',
      'deck.toast.loadFailed':      '❌ โหลดไม่สำเร็จ',
      'deck.toast.cleared':         '🗑 ล้างเด็คแล้ว',
      'deck.toast.clearConfirm':    'ล้างเด็คทั้งหมดใช่หรือไม่?',
      'deck.toast.newDeck':         '✨ สร้างเด็คใหม่',
      'deck.toast.dupName':         '⚠ ชื่อเด็คซ้ำ',
      'deck.toast.dupDeckName':     '⚠ มีเด็คชื่อนี้อยู่แล้ว',
      'deck.toast.renamed':         '✏️ เปลี่ยนชื่อแล้ว',
      'deck.toast.deleted':         '🗑️ ลบเด็คแล้ว',
      'deck.toast.deckFull':        'ครบ 10 เด็คแล้ว กรุณาลบเด็คก่อน',
      'deck.toast.loggedOut':       '🔓 ออกจากระบบแล้ว — ล้างเด็คในเครื่องแล้ว',
      'deck.toast.saveFailed':      '❌ ไม่สามารถบันทึกได้',
      'deck.toast.noMCSelected':    '❌ กรุณาเลือก Main Character ก่อน',

      // Card adding
      'deck.toast.alreadyMC':       '⚠ มีการ์ดหลักอยู่แล้ว',
      'deck.toast.maxCopies':       '⚠ มีได้สูงสุด 4 ใบ (รวม alt)',
      'deck.toast.storyFull':       '⚠ Slot เรื่องราวเต็มแล้ว',
      'deck.toast.noMCInLib':       'ไม่มีการ์ดหลักในคลัง',
      'deck.toast.addMCFirst':      'เพิ่มการ์ดหลักจากคลัง',

      // Import / export / snapshot
      'deck.toast.invalidJson':     '❌ ไฟล์ JSON ไม่ถูกต้อง',
      'deck.toast.imgImported':     '🖼 นำเข้าภาพแล้ว',
      'deck.toast.zipImported':     '📦 นำเข้า ZIP แล้ว',
      'deck.toast.zipError':        '❌ ข้อผิดพลาด ZIP',
      'deck.toast.buildSnapshot':   '📸 กำลังสร้าง snapshot…',
      'deck.toast.snapshotFail':    '❌ Snapshot ไม่สำเร็จ',
      'deck.toast.githubFail':      '⚠ โหลดจาก GitHub ไม่สำเร็จ — import JSON เอง',
      'deck.toast.loadCards':       '⏳ กำลังโหลดการ์ด…',

      // Wishlist
      'deck.toast.noDeckToSend':    'ไม่มีการ์ดในเด็ค',
      'deck.toast.openWishlist':    '⭐ เปิด Wishlist…',
      'deck.toast.wishlistFail':    'ส่งไปยัง Wishlist ไม่สำเร็จ',

      // Cloud sync
      'deck.toast.cloudFail':       '☁️ บันทึก cloud ไม่สำเร็จ — ตรวจสอบการเชื่อมต่อ',
      'deck.toast.sharedNotFound':  '⚠ ไม่พบเด็คที่แชร์',
      'deck.toast.sharedLoadFail':  '❌ โหลดเด็คไม่สำเร็จ',

      // Dynamic toasts
      'deck.toast.cardsLoaded':     '📚 โหลดการ์ด %1 ใบแล้ว',
      'deck.toast.storyAdded':      '📖 %1 — เพิ่ม %2 tier แล้ว',
      'deck.toast.proxyExcluded':   '⚠️ ไม่รวมการ์ด Proxy %1 ใบใน Wishlist',
      'deck.toast.snapshotSaved':   '✅ บันทึก Snapshot แล้ว — %1×%2 px',
      'deck.toast.importedEntries': '📋 import %1 รายการแล้ว',
      'deck.toast.importedSkipped': '📋 import %1 รายการ (ไม่พบ %2 รายการ)',
      'deck.toast.cloudImportOk':   '☁️ นำเข้า %1 เด็คสำเร็จ',
      'deck.toast.cloudImportFail': '⚠ นำเข้า %1 เด็คไม่สำเร็จ (ครบ 10?)',
      'deck.toast.cloudSynced':     '☁️ โหลดเด็คจาก cloud %1 เด็ค',
      'deck.toast.cloudSyncFail':   '☁️ โหลดจาก cloud ไม่สำเร็จ: %1',
      'deck.toast.sharedLoaded':    '📥 โหลดเด็คที่แชร์แล้ว: %1',
      'deck.toast.importOk':        '✅ Import เด็คสำเร็จ: %1',

      // Shared deck banner
      'deck.toast.sharedView':      '📥 กำลังดูเด็คที่แชร์มา: %1',
      'deck.toast.sharedImport':    '📥 Import เด็คนี้',

      // ── DECK BUILDER MODALS ──────────────────────────────────
      'deck.modal.fanLeft':   '🃏 เหลือ %1 ใบ · ทิ้งแล้ว %2 ใบ',
      'deck.modal.noHand':    'ไม่มีการ์ดในมือ',

      // ── CARD LIBRARY TOASTS ───────────────────────────────────
      'lib.toast.loadFail':   '⚠ โหลดการ์ดไม่สำเร็จ',


      // ── BATTLE SIMULATOR ─────────────────────────────────────

      'sim.loadDeck':      'โหลดเด็คของคุณ',
      'sim.yourDeck':      'เด็คของคุณ',
      'sim.botDeck':       'เด็ค Bot 🤖',
      'sim.uploadJson':    '📂 อัปโหลด JSON',
      'sim.uploadJsonP':   'วางไฟล์ JSON หรือคลิกเพื่อเลือก',
      'sim.uploadBot':     '📂 อัปโหลด JSON (Bot)',
      'sim.uploadBotP':    'วางไฟล์ JSON หรือคลิกเพื่อเลือก (Bot)',
      'sim.noDeck':        'ยังไม่ได้เลือกเด็ค',
      'sim.startGame':     'เริ่มเกม',

      // sim.startPhase / mainPhase / contactPhase / endPhase — ❌ same
      // sim.toMain / toContact / toEnd — ❌ same
      // sim.back (✕) — ❌ same
      // sim.tapScene — ❌ same (kept EN: audit decision)
      // sim.log — ❌ same (kept EN: audit decision)

      'sim.hand':          'มือ',
      'sim.actions':       'การกระทำ',
      'sim.oppTab':        'ฝ่ายตรงข้าม',

      'sim.oppDeck':       'เด็ค OPP',
      'sim.oppScene':      'ฉาก OPP',
      'sim.oppSceneArea':  'โซนฉาก OPP',
      'sim.oppRetire':     'Retire OPP',
      'sim.oppMC':         'การ์ดหลัก OPP',
      'sim.oppStoryArea':  '🤖 โซนเรื่องราว OPP',
      'sim.advArea':       '⚔️ โซนผจญภัย',
      'sim.you':           'เรา',
      'sim.opp':           'ฝ่ายตรงข้าม',
      'sim.mainChar':      'การ์ดหลัก',
      'sim.storyArea':     'โซนเรื่องราว',
      'sim.retirement':    'โซนพักผ่อน',
      'sim.sceneDeck':     'เด็คฉาก',
      'sim.sceneArea':     'โซนฉาก',
      'sim.mainDeck':      'เด็คหลัก',

      // ── BATTLE SIMULATOR CONFIRMS ────────────────────────────
      'sim.toast.backConfirm': 'กลับไปยัง Deck Builder ใช่ไหม?\n(เด็คที่โหลดไว้จะถูกรีเซ็ต)',
    },
  };
})();
