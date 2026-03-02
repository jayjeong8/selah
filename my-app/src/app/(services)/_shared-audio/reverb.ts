/**
 * Generate a procedural convolution reverb impulse response buffer.
 * Two-stage IR: discrete early reflections (stone wall simulation)
 * followed by frequency-dependent diffuse tail with stereo decorrelation.
 */
export function createReverbIR(
  ctx: AudioContext,
  options?: {
    duration?: number;
    decay?: number;
    density?: number;
    highDamping?: number;
    predelay?: number;
  },
): AudioBuffer {
  const {
    duration = 3.5,
    decay = 3.0,
    density = 0.85,
    highDamping = 5500,
    predelay = 0.02,
  } = options ?? {};

  const sampleRate = ctx.sampleRate;
  const length = Math.floor(sampleRate * (duration + predelay));
  const buffer = ctx.createBuffer(2, length, sampleRate);

  // --- Stage 1: Discrete early reflections (0–80ms after predelay) ---
  const earlyDelaysMs = [12, 23, 37, 48, 59, 67, 74, 80];
  const predelaySamples = Math.floor(predelay * sampleRate);

  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);

    // Stereo decorrelation: L/R offset 1–3ms
    const stereoOffsetMs = ch === 0 ? 0 : 1.5 + Math.random() * 1.5;

    // Stage 1: Early reflections
    for (let r = 0; r < earlyDelaysMs.length; r++) {
      const delayMs = earlyDelaysMs[r] + stereoOffsetMs;
      const delaySample = predelaySamples + Math.floor((delayMs / 1000) * sampleRate);
      if (delaySample >= length) continue;

      // Amplitude decreases with distance, add randomness
      const amplitude = (0.7 - r * 0.06) * (0.9 + Math.random() * 0.2);
      // High-frequency rolloff increases with distance
      const lpFreq = highDamping * (1 - r * 0.08);

      // Write a short filtered burst at the reflection point
      const burstLen = Math.min(Math.floor(sampleRate * 0.003), length - delaySample);
      for (let i = 0; i < burstLen; i++) {
        const raw = (Math.random() * 2 - 1) * amplitude;
        // Simple one-pole LP per reflection
        const coeff = 1 - Math.exp((-2 * Math.PI * lpFreq) / sampleRate);
        data[delaySample + i] =
          i === 0
            ? raw * coeff
            : data[delaySample + i - 1] + coeff * (raw - data[delaySample + i - 1]);
      }
    }

    // --- Stage 2: Frequency-dependent diffuse tail (80ms+ after predelay) ---
    const tailStart = predelaySamples + Math.floor(0.08 * sampleRate);
    const highDecay = 5.5; // High frequencies decay faster (stone absorbs highs)
    const lowDecay = decay; // ~3.0 for low frequencies
    const lpCoeff = 1 - Math.exp((-2 * Math.PI * highDamping) / sampleRate);

    let prev = 0;
    for (let i = tailStart; i < length; i++) {
      const t = (i - predelaySamples) / sampleRate;

      // Dual-decay envelope: slow low-freq decay + fast high-freq decay
      const lowEnvelope = Math.exp(-lowDecay * t);
      const highEnvelope = Math.exp(-highDecay * t);
      // Blend: full-band amplitude follows low envelope, LP filter tracks high envelope
      const envelope = lowEnvelope;

      // Sparse→dense transition
      const threshold = 1 - density * (1 - highEnvelope);
      const raw = Math.random() < threshold ? 0 : (Math.random() * 2 - 1) * envelope;

      // Time-varying LP: cutoff drops as high envelope decays
      const dynamicLpCoeff = lpCoeff * (0.3 + 0.7 * (highEnvelope / lowEnvelope));
      prev += dynamicLpCoeff * (raw - prev);
      data[i] += prev;
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
