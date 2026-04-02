// ai-eval.js — Pure scoring and evaluation logic for AI decisions.
// Loaded as a plain <script> before the main game script.
// References globals (effInsp, AI_CONFIG, G) resolved at call-time — safe to load early.

// ---------------------------------------------------------------------------
// Inspo target validation
// ---------------------------------------------------------------------------

/**
 * Check whether a scene card is allowed to boost a specific character.
 * If the scene has no inspoTarget restriction, any character is valid.
 *
 * @param {object} scene     — Scene card object (may have .inspoTarget array)
 * @param {object} character — Character card object (.name)
 * @returns {boolean}
 */
function canInspoTarget(scene, character) {
  if (!scene.inspoTarget) return true;
  return scene.inspoTarget.includes(character.name);
}

// ---------------------------------------------------------------------------
// Card & slot scoring
// ---------------------------------------------------------------------------

/**
 * Score a card in isolation.
 * Rewards high power; adds a small efficiency bonus for low-cost cards
 * when harmony is plentiful (preserving future options).
 *
 * @param {object} card — Character card object (.power, .cost)
 * @param {object} G    — Global game state
 * @returns {number}
 */
function scoreCard(card, G) {
  const harmony = G.oSceneArea?.length ?? G.oSceneCount ?? 0;
  const costSlack = harmony - (card.cost || 0);
  // Base score is power; slight bonus for spending less than available harmony
  return (card.power || 0) + costSlack * 0.1;
}

/**
 * Score placing a specific card into a specific slot.
 * Winning matchups earn a strong bonus; losing matchups are penalised;
 * uncontested slots score below winning fights to encourage aggression.
 *
 * Uses base enemy power (not boosted) for pre-contact slot evaluation —
 * the AI doesn't know yet if the player will boost.
 *
 * @param {object} card    — Character card being evaluated
 * @param {number} slotIdx — Slot index (0–2)
 * @param {object} G       — Global game state
 * @returns {number}
 */
function scoreSlot(card, slotIdx, G) {
  const enemy = G.pAdv[slotIdx];
  if (!enemy) {
    // No opponent present — safe slot, but less valuable than a winning fight
    return (card.power || 0) * 0.8;
  }
  const diff = (card.power || 0) - (enemy.power || 0);
  if (diff > 0) return diff + 5;   // winning trade: strongly prefer
  if (diff === 0) return -1;        // tie: slight penalty (both retire)
  return diff - 3;                  // losing trade: heavily penalise
}

// ---------------------------------------------------------------------------
// Inspo boost decision
// ---------------------------------------------------------------------------

/**
 * Decide whether the AI should spend inspo scenes to change a losing outcome.
 * The AI only boosts when:
 *   1. The bot is currently behind (need > 0)
 *   2. Available scenes are enough to cover the deficit
 *   3. The deficit meets the configured threshold (avoids burning scenes for 1-pip gains when threshold > 1)
 *
 * NOTE: effInsp() is defined in index.html; safe to call here at runtime.
 *
 * @param {object} botChar            — Bot's character in this slot
 * @param {object} playerChar         — Player's character in this slot
 * @param {number} availableSceneCount — Number of eligible, unflipped inspo scenes
 * @returns {boolean}
 */
function shouldUseInspo(botChar, playerChar, availableSceneCount) {
  const botPower    = (botChar.power || 0) + (botChar._boosted || 0);
  const playerPower = effInsp(playerChar, true); // effInsp defined in index.html
  const need        = playerPower - botPower;
  return need > 0
    && need <= availableSceneCount
    && need >= AI_CONFIG.useInspoThreshold;
}
