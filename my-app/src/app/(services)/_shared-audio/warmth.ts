/**
 * Create a WaveShaperNode for subtle warmth/saturation.
 * Uses a soft-clipping tanh transfer function.
 */
export function createWarmthShaper(ctx: AudioContext, amount = 1.2): WaveShaperNode {
  const shaper = ctx.createWaveShaper();
  const samples = 8192;
  const curve = new Float32Array(samples);

  for (let i = 0; i < samples; i++) {
    const x = (i * 2) / samples - 1;
    curve[i] = Math.tanh(x * amount);
  }

  shaper.curve = curve;
  shaper.oversample = "2x";
  return shaper;
}
