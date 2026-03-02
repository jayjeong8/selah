/**
 * ADSR envelope parameters.
 * All times in seconds. Sustain is a gain level (0-1).
 */
export interface ADSRParams {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  peak?: number;
  /** Total hold time before release. If omitted, release starts at attack+decay. */
  duration?: number;
}

/**
 * Apply an ADSR envelope to a GainNode. Returns the time the envelope ends.
 */
export function applyADSR(gain: GainNode, startTime: number, params: ADSRParams): number {
  const { attack, decay, sustain, release, peak = 1.0, duration } = params;
  const g = gain.gain;

  // Start near zero (not 0, to allow exponentialRamp)
  g.setValueAtTime(0.001, startTime);
  g.linearRampToValueAtTime(peak, startTime + attack);
  g.linearRampToValueAtTime(Math.max(sustain * peak, 0.001), startTime + attack + decay);

  const releaseStart = duration ? startTime + duration : startTime + attack + decay;

  g.setValueAtTime(Math.max(sustain * peak, 0.001), releaseStart);
  g.exponentialRampToValueAtTime(0.001, releaseStart + release);

  return releaseStart + release;
}
