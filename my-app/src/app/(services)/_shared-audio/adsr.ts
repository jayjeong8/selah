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

/**
 * Bell double-decay envelope parameters.
 * Models the two-phase decay of a struck bell:
 *   gain(t) = strikeAmp × exp(-t/strikeDecay) + ringAmp × exp(-t/ringDecay)
 */
export interface BellDecayParams {
  strikeAmp: number;
  strikeDecay: number;
  ringAmp: number;
  ringDecay: number;
  duration: number;
}

/**
 * Apply a bell double-decay envelope to a GainNode using setValueCurveAtTime.
 * Pre-computes the curve at 200 samples/sec for CPU efficiency.
 * Returns the time the envelope ends.
 */
export function applyBellDecay(gain: GainNode, startTime: number, params: BellDecayParams): number {
  const { strikeAmp, strikeDecay, ringAmp, ringDecay, duration } = params;
  const samplesPerSec = 200;
  const numSamples = Math.max(Math.floor(duration * samplesPerSec), 2);
  const curve = new Float32Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    const t = (i / numSamples) * duration;
    curve[i] = strikeAmp * Math.exp(-t / strikeDecay) + ringAmp * Math.exp(-t / ringDecay);
  }
  // Ensure final sample is near-zero to avoid clicks
  curve[numSamples - 1] = Math.max(curve[numSamples - 1], 0.0001);

  gain.gain.setValueAtTime(curve[0], startTime);
  gain.gain.setValueCurveAtTime(curve, startTime, duration);

  return startTime + duration;
}
