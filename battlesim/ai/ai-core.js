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
 * Improvements over the original aiUseInspo():
 *   - Respects scene.inspoTarget restrictions via canInspoTarget()
 *   - Uses shouldUseInspo() to gate the decision through AI_CONFIG.useInspoThreshold
 *   - Accepts explicit G parameter (no implicit global read at definition time)
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
}

// ---------------------------------------------------------------------------
// Main phase — Card play
// ---------------------------------------------------------------------------

/**
 * Select and play the best character card from the bot's hand.
 * Called from the wrapper aiSim() in index.html.
 *
 * Algorithm:
 *   1. Filter playable characters (cost ≤ current harmony, slot empty)
 *   2. Score every (card, slot) combination using scoreCard + scoreSlot
 *   3. Sort by score descending
 *   4. Pick randomly from the top 1–3 candidates (controlled by AI_CONFIG.randomness)
 *      — prevents perfectly deterministic play without sacrificing strategy
 *
 * Improvements over the original aiSim():
 *   - Evaluates ALL (card, slot) combinations instead of just best card per slot
 *   - Slot scoring rewards winning matchups and penalises losing ones
 *   - Slight randomness keeps gameplay varied
 *
 * @param {object} G — Global game state
 */
function runAI(G) {
  const harmony  = G.oSceneArea?.length ?? G.oSceneCount ?? 0;
  const playable = [...G.oMainDeck].filter(x =>
    x.type === 'Character' && (x.cost || 0) <= harmony
  );
  if (!playable.length) return;

  // Build and score all valid (card, slot) combinations
  const candidates = [];
  playable.forEach(card => {
    [0, 1, 2].forEach(slot => {
      if (G.oAdv[slot] !== null) return; // slot already occupied
      const score = scoreCard(card, G) + scoreSlot(card, slot, G);
      candidates.push({ card, slot, score });
    });
  });
  if (!candidates.length) return;

  // Sort best → worst
  candidates.sort((a, b) => b.score - a.score);

  // Randomness pool: top 1–3 entries (scales with AI_CONFIG.randomness)
  const poolSize = Math.max(1, Math.min(3, Math.ceil(candidates.length * AI_CONFIG.randomness) + 1));
  const pool     = candidates.slice(0, poolSize);
  const best     = pool[Math.floor(Math.random() * pool.length)];

  const { card, slot } = best;
  G.oAdv[slot] = { ...card, _tapped: false, _boosted: 0, _item: null };
  G.oMainDeck.splice(G.oMainDeck.indexOf(card), 1);
  log(`🤖 Bot plays ${card.name} → Slot${slot + 1}`);
}
