// ai-config.js — Adjustable AI difficulty parameters
// Loaded as a plain <script> before the main game script.
// All values are tunable without touching game engine code.

const AI_CONFIG = {
  // Fraction of top-scored candidates to pick from randomly (0 = always best, 1 = full random).
  randomness: 0.2,

  // Reserved for future aggression/risk weighting — unused in v1.
  riskTolerance: 0.3,

  // Minimum power deficit required before AI uses inspo boost.
  // 1 = use boost any time it would help; higher values make AI more conservative.
  useInspoThreshold: 1
};
