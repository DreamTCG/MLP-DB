// ai-core.js — Main AI orchestration functions.
// Loaded as a plain <script> before the main game script.
// Depends on: AI_CONFIG (ai-config.js), canInspoTarget/scoreCard/scoreSlot/shouldUseInspo (ai-eval.js).
// References globals (G, effInsp, log, renderScene) resolved at call-time.

// ---------------------------------------------------------------------------
// Contact phase — Inspo boost
// ---------------------------------------------------------------------------

/**
 * Apply the minimum number of inspo boosts needed for the bot to win (or tie → win).
 * Called from the wrapper aiUseInspo(slotIdx) in index.html, which preserves the
 * existing call-site signature used by resolveContact().
 *
 * @param {object} G       — Global game state
 * @param {number} slotIdx — Contact slot index (0–2)
 */
function coreAiUseInspo(G, slotIdx) {
  const o = G.oAdv[slotIdx]; // bot's character
  const p = G.pAdv[slotIdx]; // player's character
  if (!o || !p) return;

  // Eligible scenes: unflipped, have inspo ability, and may target this character
  const scenes = (G.oSceneArea || []).filter(s =>
    !s._flipped &&
    s.ability?.toLowerCase().includes('inspo') &&
    canInspoTarget(s, o)
  );
  if (!scenes.length) return;

  // Gate: only act when it changes the outcome and meets threshold
  if (!shouldUseInspo(o, p, scenes.length)) return;

  // Calculate exact number of boosts needed (minimum to flip outcome)
  const botPower    = (o.power || 0) + (o._boosted || 0);
  const playerPower = effInsp(p, true); // effInsp defined in index.html
  const need        = playerPower - botPower;

  for (let i = 0; i < need; i++) {
    scenes[i]._flipped  = true;
    o._boosted           = (o._boosted || 0) + 1;
    log(`🤖 Inspo Boost: ${scenes[i].name} → ${o.name} +1 Insp`, 'act');
  }
  renderScene(); // refresh scene area to show flip state
}

// ---------------------------------------------------------------------------
// Main phase — Card play
// ---------------------------------------------------------------------------

/**
 * Select and play the best character card from the bot's hand.
 * Called from the wrapper aiSim() in index.html.
 *
 * Multi-play support: if G.oBotHarmony is set (initialized by doStart before the loop),
 * uses that as the remaining harmony budget and deducts card cost on each play.
 * Returns true if a card was placed, false if nothing could be played.
 *
 * Algorithm:
 *   1. Filter playable characters (cost ≤ remaining harmony, slot empty)
 *   2. Score every (card, slot) combination using scoreCard + scoreSlot
 *   3. Sort by score descending
 *   4. Pick randomly from the top 1–3 candidates (controlled by AI_CONFIG.randomness)
 *
 * @param {object} G — Global game state
 * @returns {boolean} true if a card was placed this call
 */
function runAI(G) {
  // Use per-turn harmony budget if set (enables multi-card play), else scene count
  const harmony = (G.oBotHarmony !== undefined)
    ? G.oBotHarmony
    : (G.oSceneArea?.length ?? G.oSceneCount ?? 0);

  const playable = [...G.oMainDeck].filter(x =>
    x.type === 'Character' && (x.cost || 0) <= harmony
  );
  if (!playable.length) return false;

  // Build and score all valid (card, slot) combinations
  const candidates = [];
  playable.forEach(card => {
    [0, 1, 2].forEach(slot => {
      if (G.oAdv[slot] !== null) return; // slot already occupied
      const score = scoreCard(card, G) + scoreSlot(card, slot, G);
      candidates.push({ card, slot, score });
    });
  });
  if (!candidates.length) return false;

  // Sort best → worst
  candidates.sort((a, b) => b.score - a.score);

  // Randomness pool: top 1–3 entries (scales with AI_CONFIG.randomness)
  const poolSize = Math.max(1, Math.min(3, Math.ceil(candidates.length * AI_CONFIG.randomness) + 1));
  const pool     = candidates.slice(0, poolSize);
  const best     = pool[Math.floor(Math.random() * pool.length)];

  const { card, slot } = best;
  G.oAdv[slot] = { ...card, _tapped: false, _boosted: 0, _item: null };
  G.oMainDeck.splice(G.oMainDeck.indexOf(card), 1);

  // Deduct cost from per-turn budget
  if (G.oBotHarmony !== undefined) G.oBotHarmony -= (card.cost || 0);

  log(`🤖 Bot plays ${card.name} → Slot${slot + 1}`);
  return true;
}
