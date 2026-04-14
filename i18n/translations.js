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
 *                   brand names, language-selector labels)
 *
 * Strings marked ⚠️ review currently have Thai translations but you may
 * want to revert them to the EN value (just copy the EN string into TH).
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

      // ── NAV BAR (nav.js) ────────────────────────────────────
      'nav.home':         'Home',                           // ✅ translate
      'nav.cards':        'Cards',                          // ✅ translate
      'nav.deckbuilder':  'Deck Builder',                   // ✅ translate
      'nav.rules':        'Rules',                          // ✅ translate
      'nav.burger':       'Menu',                           // ✅ translate

      // ── LANGUAGE TOGGLE (nav.js) ────────────────────────────
      // Shows the language you will switch TO (opposite of current).
      'lang.switchTo':    'TH',                             // ❌ same — language code

      // ── THEME TOGGLE TOOLTIPS (nav.js) ──────────────────────
      'theme.toLight':    'Switch to Light Mode',           // ✅ translate
      'theme.toDark':     'Switch to Dark Mode',            // ✅ translate

      // ── AUTH MODAL (nav.js) ──────────────────────────────────
      'auth.login':       '🔑 Login',                      // ✅ translate
      'auth.logout':      '🚪 Logout',                     // ✅ translate
      'auth.title':       '🦄 Sign In',                    // ✅ translate
      'auth.subtitle':    'Sync your decks to the cloud',  // ✅ translate
      'auth.tabLogin':    'Sign In',                        // ✅ translate
      'auth.tabSignup':   'Sign Up',                        // ✅ translate
      'auth.email':       'Email',                          // ✅ translate
      'auth.password':    'Password',                       // ✅ translate
      'auth.submitLogin': 'Sign In',                        // ✅ translate
      'auth.submitSignup':'Sign Up',                        // ✅ translate
      'auth.or':          'or',                             // ✅ translate
      'auth.loginGoogle': 'Sign in with Google',            // ✅ translate
      'auth.loginX':      'Sign in with X',                 // ✅ translate
      'auth.cancel':      'Cancel',                         // ✅ translate
      'auth.privacyPre':  'By signing in you accept our',  // ✅ translate
      'auth.privacyLink': 'Privacy Policy',                 // ⚠️ review — legal term often kept in EN
      'auth.privacyPost': '— your data will not be used for commercial purposes', // ✅ translate

      // ── AUTH MESSAGES (nav.js) ──────────────────────────────
      'auth.errorEmpty':  'Please enter email and password', // ✅ translate
      'auth.notReady':    'Auth system not ready, please wait', // ✅ translate
      'auth.loginFailed': 'Sign in failed:\n',               // ✅ translate
      'auth.signupOk':    'Check your email to confirm sign-up', // ✅ translate

      // ── SYNC BANNER (nav.js) ────────────────────────────────
      'banner.text':      'Login to sync your decks online →', // ✅ translate
      'banner.close':     'Close',                             // ✅ translate


      // ── HOME PAGE (index.html) ──────────────────────────────

      // Nav cards
      'home.deckTitle':    'Deck Builder',                  // ✅ translate
      'home.deckDesc':     'Browse cards, build decks<br>and export lists', // ✅ translate  /* html */
      'home.libraryTitle': 'Card Library',                  // ✅ translate
      'home.libraryDesc':  'Browse all latest cards<br>EN / TH included', // ✅ translate  /* html */
      'home.rulesTitle':   'How to Play',                   // ✅ translate
      'home.rulesDesc':    'Official rules summary<br>in English', // ✅ translate  /* html */

      // Rules panel
      'home.rulesHeading': '📋 Quick Rules Reference',      // ✅ translate
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

      'lib.topbarTitle':   '📚 MLP Card Library',           // ✅ translate
      'lib.search':        'Search cards...',               // ✅ translate  (placeholder)
      'lib.filterType':    'Type',                          // ✅ translate
      'lib.filterRarity':  'Rarity',                        // ✅ translate
      'lib.filterSet':     'Set',                           // ✅ translate
      'lib.filterRace':    'Race',                          // ✅ translate
      'lib.sortDesc':      '↓ Sort',                        // ✅ translate
      'lib.sortAsc':       '↑ Sort',                        // ✅ translate
      'lib.altAll':        'All',                         // ⚠️ review — ※ is alt-art symbol; label may be fine in EN
      'lib.altNo':         'No ※',                          // ⚠️ review
      'lib.altOnly':       '※ Only',                        // ⚠️ review
      'lib.noCards':       'No cards found',                // ✅ translate
      'lib.loading':       'Loading cards...',              // ✅ translate
      'lib.clickDetail':   'Click a card to see details',   // ✅ translate
      'lib.cards':         'cards',                         // ✅ translate  (suffix: "320 cards")


      // ── DECK BUILDER (deckbuilder/index.html) ───────────────

      // Panel / section titles
      'deck.library':      '📚 Library',                    // ✅ translate
      'deck.analysis':     '📊 Analysis',                   // ✅ translate

      // Inputs
      'deck.search':       'Search cards...',               // ✅ translate  (placeholder)
      'deck.deckName':     'Deck name...',                  // ✅ translate  (placeholder)

      // Import bar
      'deck.importData':   '⚙️ Import / Data',              // ✅ translate
      'deck.importActions':'⚙️ Import / Actions',           // ✅ translate

      // Zone labels
      'deck.mainChar':     '⭐ Main Character',              // ⚠️ review — game zone name
      'deck.mainDeck':     '🃏 Main Deck',                   // ⚠️ review — game zone name
      'deck.sceneDeck':    '🎭 Scene Deck',                  // ⚠️ review — game zone name
      'deck.storyDeck':    '📖 Story Deck',                  // ⚠️ review — game zone name

      // Filter dropdowns
      'deck.filterType':   'Type',                          // ✅ translate
      'deck.filterRarity': 'Rarity',                        // ✅ translate
      'deck.filterSet':    'Set',                           // ✅ translate
      'deck.filterRace':   'Race',                          // ✅ translate

      // Zone empty states
      'deck.emptyMC':      'Click to add Main Character',   // ✅ translate
      'deck.emptyMain':    'Add cards from Library',        // ✅ translate
      'deck.emptyScene':   'Add Scene cards from Library',  // ✅ translate
      'deck.mcEmpty':      'Empty',                         // ✅ translate  (MC chip when no MC selected)

      // Mobile nav tabs
      'deck.navLib':       'Library',                       // ✅ translate
      'deck.navDeck':      'Deck',                          // ✅ translate
      'deck.navAnalysis':  'Analysis',                      // ✅ translate


      // ── BATTLE SIMULATOR (battlesim/index.html) ─────────────

      // Setup screen
      'sim.loadDeck':      'LOAD YOUR DECK',                // ✅ translate
      'sim.yourDeck':      'YOUR DECK',                     // ✅ translate
      'sim.botDeck':       'BOT DECK 🤖',                   // ⚠️ review — "Bot" is a technical term
      'sim.uploadJson':    '📂 Upload JSON',                 // ⚠️ review — "JSON" is a technical term
      'sim.uploadJsonP':   'Drop JSON file or click to select',   // ✅ translate
      'sim.uploadBot':     '📂 Upload JSON (Bot)',           // ⚠️ review
      'sim.uploadBotP':    'Drop JSON file or click to select (Bot)', // ✅ translate
      'sim.noDeck':        'No deck selected',              // ✅ translate
      'sim.startGame':     'Start Game',                    // ✅ translate

      // Phase names — shown in the phase badge during gameplay
      'sim.startPhase':    'START PHASE',                   // ⚠️ review — game mechanic name; many games keep EN
      'sim.mainPhase':     'MAIN PHASE',                    // ⚠️ review
      'sim.contactPhase':  'CONTACT PHASE',                 // ⚠️ review
      'sim.endPhase':      'END PHASE',                     // ⚠️ review

      // Phase transition button labels
      'sim.toMain':        'Main Phase →',                  // ⚠️ review
      'sim.toContact':     'Contact Phase →',               // ⚠️ review
      'sim.toEnd':         'End Phase →',                   // ⚠️ review

      // Top bar game buttons
      'sim.tapScene':      'Tap Scene +1✦',                 // ⚠️ review — "Tap" is a card-game action term
      'sim.back':          '✕',                             // ❌ same — symbol

      // Mobile tab buttons
      'sim.hand':          'Hand',                          // ⚠️ review — card-game term
      'sim.actions':       'Actions',                       // ✅ translate
      'sim.log':           'Log',                           // ✅ translate
      'sim.oppTab':        'OPP',                           // ⚠️ review — abbreviation; players may prefer EN

      // Game zone labels
      'sim.oppDeck':       'OPP Deck',                      // ⚠️ review — "OPP" abbreviation
      'sim.oppScene':      'OPP Scene',                     // ⚠️ review
      'sim.oppSceneArea':  'OPP Scene Area',                // ⚠️ review
      'sim.oppRetire':     'OPP Retire',                    // ⚠️ review — "Retire" is a game term
      'sim.oppMC':         'OPP MC',                        // ⚠️ review — "MC" is an abbreviation
      'sim.oppStoryArea':  '🤖 OPP Story Area',             // ⚠️ review
      'sim.advArea':       '⚔️ Adventure Area',             // ⚠️ review — game zone name
      'sim.you':           'YOU',                           // ✅ translate
      'sim.opp':           'OPP',                           // ⚠️ review — abbreviation
      'sim.mainChar':      'Main Char',                     // ⚠️ review — game term
      'sim.storyArea':     'Story Area',                    // ⚠️ review — game zone name
      'sim.retirement':    'Retirement',                    // ⚠️ review — game zone name
      'sim.sceneDeck':     'Scene Deck',                    // ⚠️ review — game zone name
      'sim.sceneArea':     'Scene Area',                    // ⚠️ review — game zone name
      'sim.mainDeck':      'Main Deck',                     // ⚠️ review — game zone name
    },


    // ─────────────────────────────────────────────────────────
    // THAI  (ภาษาไทย)
    // ─────────────────────────────────────────────────────────
    th: {

      // ── NAV BAR ─────────────────────────────────────────────
      'nav.home':         'หน้าหลัก',
      'nav.cards':        'การ์ด',
      'nav.deckbuilder':  'จัดเด็ค',
      'nav.rules':        'วิธีเล่น',
      'nav.burger':       'เมนู',

      // ── LANGUAGE TOGGLE ─────────────────────────────────────
      'lang.switchTo':    'EN',                             // ❌ same — language code

      // ── THEME TOGGLE TOOLTIPS ────────────────────────────────
      'theme.toLight':    'เปลี่ยนเป็น Light Mode',
      'theme.toDark':     'เปลี่ยนเป็น Dark Mode',

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
      'auth.privacyLink': 'Privacy Policy',                 // ⚠️ review — kept EN (legal term)
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
      'home.deckDesc':     'เลือกการ์ด สร้างเด็ค<br>และ export รายการ',        /* html */
      'home.libraryTitle': 'ดูการ์ดทั้งหมด',
      'home.libraryDesc':  'ค้นหาการ์ดทุกใบ<br>EN / TH ครบ',                /* html */
      'home.rulesTitle':   'วิธีเล่น',
      'home.rulesDesc':    'กฎกติกาอย่างเป็นทางการ<br>ฉบับภาษาไทย',           /* html */

      'home.rulesHeading': '📋 กฎสำคัญแบบย่อ',
      'rule.objective':    '<b style="color:var(--green)">🎯 เป้าหมาย</b><br>ดำเนินเนื้อเรื่องถึง Stage IV ก่อน หรือให้คู่ต่อสู้จั่วไม่ได้',  /* html */
      'rule.deck':         '<b style="color:var(--blue)">🃏 เด็ค</b><br>เด็คหลัก 50 ใบ + ฉาก 15 ใบ + เนื้อเรื่อง 4 ใบ + ตัวละครหลัก 1 ใบ', /* html */
      'rule.turn':         '<b style="color:var(--yellow)">⚡ เทิร์น</b><br>Start → Main → Contact → End ทำซ้ำสลับกัน',                       /* html */
      'rule.inspo':        '<b style="color:var(--pink)">💫 Inspo Boost</b><br>คว่ำการ์ดฉากระหว่าง Contact เพื่อบูสค่าพลัง',                 /* html */
      'rule.story':        '<b style="color:var(--orange)">🗺️ Story Zone</b><br>แผนการปิดกั้นการดำเนินเนื้อเรื่องของศัตรู',                   /* html */
      'rule.contact':      '<b style="color:var(--purple)">🏃 Contact</b><br>ข้ามใน 2 เทิร์นแรก — ฝ่ายที่พลังน้อยออกจากสนาม',               /* html */
      'home.rulesNote':    'กฎฉบับเต็ม: ดูใน rulebook ของ KAYOU',
      'home.footer':       'Fan-made tool · ไม่มีความเกี่ยวข้องกับ Hasbro / KAYOU อย่างเป็นทางการ',


      // ── CARD LIBRARY ─────────────────────────────────────────

      'lib.topbarTitle':   '📚 คลังการ์ด MLP',
      'lib.search':        'ค้นหาการ์ด...',
      'lib.filterType':    'Type',
      'lib.filterRarity':  'Rarity',
      'lib.filterSet':     'Set',
      'lib.filterRace':    'Race',
      'lib.sortDesc':      '↓ เรียง',
      'lib.sortAsc':       '↑ เรียง',
      'lib.altAll':        'All',
      'lib.altNo':         'No ※',
      'lib.altOnly':       '※ Only',
      'lib.noCards':       'ไม่พบการ์ด',
      'lib.loading':       'กำลังโหลดการ์ด...',
      'lib.clickDetail':   'คลิกการ์ดเพื่อดูรายละเอียด',
      'lib.cards':         'ใบ',


      // ── DECK BUILDER ─────────────────────────────────────────

      'deck.library':      '📚 คลังการ์ด',
      'deck.analysis':     '📊 วิเคราะห์',
      'deck.search':       'ค้นหาการ์ด...',
      'deck.deckName':     'ชื่อเด็ค...',
      'deck.importData':   '⚙️ นำเข้า / ข้อมูล',
      'deck.importActions':'⚙️ นำเข้า / การดำเนินการ',
      'deck.mainChar':     '⭐ การ์ดหลัก',
      'deck.mainDeck':     '🃏 เด็คหลัก',
      'deck.sceneDeck':    '🎭 เด็คฉาก',
      'deck.storyDeck':    '📖 เด็คเรื่องราว',
      'deck.filterType':   'Type',
      'deck.filterRarity': 'Rarity',
      'deck.filterSet':    'Set',
      'deck.filterRace':   'Race',
      'deck.emptyMC':      'คลิกเพื่อเพิ่มการ์ดหลัก',
      'deck.emptyMain':    'เพิ่มการ์ดจากคลัง',
      'deck.emptyScene':   'เพิ่มการ์ดฉากจากคลัง',
      'deck.mcEmpty':      'ว่าง',
      'deck.navLib':       'คลัง',
      'deck.navDeck':      'เด็ค',
      'deck.navAnalysis':  'วิเคราะห์',


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

      // Phase names — currently translated but consider keeping EN (⚠️ review)
      'sim.startPhase':    'START PHASE',                   // ⚠️ review — same as EN intentionally?
      'sim.mainPhase':     'MAIN PHASE',                    // ⚠️ review
      'sim.contactPhase':  'CONTACT PHASE',                 // ⚠️ review
      'sim.endPhase':      'END PHASE',                     // ⚠️ review
      'sim.toMain':        'Main Phase →',                  // ⚠️ review
      'sim.toContact':     'Contact Phase →',               // ⚠️ review
      'sim.toEnd':         'End Phase →',                   // ⚠️ review

      'sim.tapScene':      'แตะฉาก +1✦',
      'sim.back':          '✕',                             // ❌ same — symbol

      'sim.hand':          'มือ',
      'sim.actions':       'การกระทำ',
      'sim.log':           'บันทึก',
      'sim.oppTab':        'ฝ่ายตรงข้าม',

      'sim.oppDeck':       'เด็ค OPP',
      'sim.oppScene':      'ฉาก OPP',
      'sim.oppSceneArea':  'พื้นที่ฉาก OPP',
      'sim.oppRetire':     'Retire OPP',                    // ⚠️ review — "Retire" kept EN
      'sim.oppMC':         'การ์ดหลัก OPP',
      'sim.oppStoryArea':  '🤖 พื้นที่เรื่องราว OPP',
      'sim.advArea':       '⚔️ พื้นที่ผจญภัย',
      'sim.you':           'เรา',
      'sim.opp':           'ฝ่ายตรงข้าม',
      'sim.mainChar':      'การ์ดหลัก',
      'sim.storyArea':     'พื้นที่เรื่องราว',
      'sim.retirement':    'Retirement',                    // ⚠️ review — game term kept EN
      'sim.sceneDeck':     'เด็คฉาก',
      'sim.sceneArea':     'พื้นที่ฉาก',
      'sim.mainDeck':      'เด็คหลัก',
    },
  };
})();
