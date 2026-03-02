/**
 * Generate a procedural convolution reverb impulse response buffer.
 * Uses exponentially-decaying filtered noise — no audio files needed.
 */
export function createReverbIR(
  ctx: AudioContext,
  options?: {
    duration?: number;
    decay?: number;
    density?: number;
    highDamping?: number;
  },
): AudioBuffer {
  const { duration = 1.5, decay = 2.0, density = 0.8, highDamping = 5000 } = options ?? {};

  const sampleRate = ctx.sampleRate;
  const length = Math.floor(sampleRate * duration);
  const buffer = ctx.createBuffer(2, length, sampleRate);

  const lpCoeff = 1 - Math.exp((-2 * Math.PI * highDamping) / sampleRate);

  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    let prev = 0;

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-decay * t);

      // Sparse early reflections, denser late reflections
      const threshold = 1 - density * (1 - envelope);
      const raw = Math.random() < threshold ? 0 : Math.random() * 2 - 1;

      // One-pole lowpass for high-frequency damping over time
      prev += lpCoeff * (raw * envelope - prev);
      data[i] = prev;
    }
  }

  return buffer;
}

/**
 * Create a ConvolverNode with a procedural reverb IR.
 * Returns input/output gain nodes for routing.
 */
export function createReverbSend(
  ctx: AudioContext,
  options?: {
    wetLevel?: number;
    dryLevel?: number;
    irOptions?: Parameters<typeof createReverbIR>[1];
  },
): { input: GainNode; output: GainNode } {
  const { wetLevel = 0.25, dryLevel = 0.85, irOptions } = options ?? {};

  const input = ctx.createGain();
  const output = ctx.createGain();

  const dry = ctx.createGain();
  dry.gain.value = dryLevel;

  const wet = ctx.createGain();
  wet.gain.value = wetLevel;

  const convolver = ctx.createConvolver();
  convolver.buffer = createReverbIR(ctx, irOptions);

  input.connect(dry);
  input.connect(convolver);
  convolver.connect(wet);
  dry.connect(output);
  wet.connect(output);

  return { input, output };
}
