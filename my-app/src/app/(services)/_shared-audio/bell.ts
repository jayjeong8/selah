import { applyBellDecay } from "./adsr";

/** Rayleigh partial definition for a European church bell */
interface BellPartial {
  name: string;
  ratio: number;
  amplitude: number;
  /** Decay rate multiplier relative to base decay */
  decayMul: number;
  /** Optional beating pair: slightly detuned second oscillator */
  beatingOffset?: number;
  /** Stereo pan position (-1 to 1) */
  pan?: number;
}

const FULL_PARTIALS: BellPartial[] = [
  { name: "Hum", ratio: 0.5, amplitude: 0.6, decayMul: 0.7, pan: -0.1 },
  { name: "Prime", ratio: 1.0, amplitude: 1.0, decayMul: 1.0 },
  {
    name: "MinorThird",
    ratio: 1.183,
    amplitude: 0.5,
    decayMul: 1.3,
    beatingOffset: 0.003,
  },
  { name: "Fifth", ratio: 1.506, amplitude: 0.25, decayMul: 1.8 },
  {
    name: "Octave",
    ratio: 2.0,
    amplitude: 0.35,
    decayMul: 2.0,
    beatingOffset: 0.003,
    pan: 0.1,
  },
  { name: "UpperThird", ratio: 2.514, amplitude: 0.12, decayMul: 2.5 },
  { name: "UpperFifth", ratio: 3.011, amplitude: 0.06, decayMul: 3.0 },
  { name: "UpperOctave", ratio: 4.0, amplitude: 0.03, decayMul: 3.5 },
];

const MICRO_PARTIALS: BellPartial[] = [
  { name: "Prime", ratio: 1.0, amplitude: 1.0, decayMul: 1.0 },
  { name: "MinorThird", ratio: 1.183, amplitude: 0.5, decayMul: 1.3 },
  { name: "Fifth", ratio: 1.506, amplitude: 0.25, decayMul: 1.8 },
  { name: "Octave", ratio: 2.0, amplitude: 0.35, decayMul: 2.0 },
];

interface PlayBellOptions {
  fundamental: number;
  amplitude?: number;
  duration?: number;
  /** Strike transient intensity (0-1) */
  strikeIntensity?: number;
  pan?: number;
}

/** Shared noise buffer for strike transients */
let strikeNoiseBuffer: AudioBuffer | null = null;

function getStrikeNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (!strikeNoiseBuffer || strikeNoiseBuffer.sampleRate !== ctx.sampleRate) {
    const length = Math.floor(ctx.sampleRate * 0.01); // 10ms
    strikeNoiseBuffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = strikeNoiseBuffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  }
  return strikeNoiseBuffer;
}

/**
 * Play a full church bell with Rayleigh partials, beating, and strike transient.
 * Used for verse-done and chapter-done sounds.
 */
export function playBell(
  ctx: AudioContext,
  dest: AudioNode,
  startTime: number,
  options: PlayBellOptions,
): void {
  const {
    fundamental,
    amplitude = 0.13,
    duration = 4.0,
    strikeIntensity = 1.0,
    pan = 0,
  } = options;

  const baseStrikeDecay = 0.015;
  const baseRingDecay = duration * 0.35;

  // --- Strike transient ---
  if (strikeIntensity > 0) {
    // 1) Bandpass noise burst (clapper impact) — 3ms
    const noise = ctx.createBufferSource();
    noise.buffer = getStrikeNoiseBuffer(ctx);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = fundamental * 3;
    bp.Q.value = 1.5;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(amplitude * 0.8 * strikeIntensity, startTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.003);
    noise.connect(bp);
    bp.connect(noiseGain);
    noiseGain.connect(dest);
    noise.start(startTime);

    // 2) Frequency sweep (bell body initial vibration) — 5ms
    const sweepOsc = ctx.createOscillator();
    sweepOsc.type = "sine";
    sweepOsc.frequency.setValueAtTime(fundamental * 2, startTime);
    sweepOsc.frequency.exponentialRampToValueAtTime(fundamental, startTime + 0.005);
    const sweepGain = ctx.createGain();
    sweepGain.gain.setValueAtTime(amplitude * 0.5 * strikeIntensity, startTime);
    sweepGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.008);
    sweepOsc.connect(sweepGain);
    sweepGain.connect(dest);
    sweepOsc.start(startTime);
    sweepOsc.stop(startTime + 0.01);
  }

  // --- Partials with bell decay ---
  for (const partial of FULL_PARTIALS) {
    const freq = fundamental * partial.ratio;
    const partialAmp = amplitude * partial.amplitude;
    const ringDecay = baseRingDecay / partial.decayMul;

    createBellPartial(ctx, dest, startTime, {
      frequency: freq,
      amplitude: partialAmp,
      strikeDecay: baseStrikeDecay,
      ringDecay,
      duration,
      pan: (partial.pan ?? 0) + pan,
    });

    // Beating pair: slightly detuned second oscillator
    if (partial.beatingOffset) {
      const beatingFreq = fundamental * (partial.ratio + partial.beatingOffset);
      createBellPartial(ctx, dest, startTime, {
        frequency: beatingFreq,
        amplitude: partialAmp * 0.7,
        strikeDecay: baseStrikeDecay,
        ringDecay: ringDecay * 0.95,
        duration,
        pan: -((partial.pan ?? 0) + pan),
      });
    }
  }
}

/**
 * Play a lightweight micro-bell for keystroke feedback.
 * 4 partials, no beating, minimal strike.
 */
export function playMicroBell(
  ctx: AudioContext,
  dest: AudioNode,
  startTime: number,
  options: Omit<PlayBellOptions, "strikeIntensity">,
): void {
  const { fundamental, amplitude = 0.11, duration = 0.18, pan = 0 } = options;

  const baseStrikeDecay = 0.008;
  const baseRingDecay = duration * 0.4;

  // Minimal strike: very short frequency sweep only
  const sweepOsc = ctx.createOscillator();
  sweepOsc.type = "sine";
  sweepOsc.frequency.setValueAtTime(fundamental * 1.5, startTime);
  sweepOsc.frequency.exponentialRampToValueAtTime(fundamental, startTime + 0.003);
  const sweepGain = ctx.createGain();
  sweepGain.gain.setValueAtTime(amplitude * 0.3, startTime);
  sweepGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.005);
  sweepOsc.connect(sweepGain);
  sweepGain.connect(dest);
  sweepOsc.start(startTime);
  sweepOsc.stop(startTime + 0.006);

  for (const partial of MICRO_PARTIALS) {
    const freq = fundamental * partial.ratio;
    const partialAmp = amplitude * partial.amplitude;
    const ringDecay = baseRingDecay / partial.decayMul;

    createBellPartial(ctx, dest, startTime, {
      frequency: freq,
      amplitude: partialAmp,
      strikeDecay: baseStrikeDecay,
      ringDecay,
      duration,
      pan,
    });
  }
}

interface PartialOptions {
  frequency: number;
  amplitude: number;
  strikeDecay: number;
  ringDecay: number;
  duration: number;
  pan: number;
}

function createBellPartial(
  ctx: AudioContext,
  dest: AudioNode,
  startTime: number,
  opts: PartialOptions,
): void {
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = opts.frequency;

  const gain = ctx.createGain();

  applyBellDecay(gain, startTime, {
    strikeAmp: opts.amplitude * 0.4,
    strikeDecay: opts.strikeDecay,
    ringAmp: opts.amplitude * 0.6,
    ringDecay: opts.ringDecay,
    duration: opts.duration,
  });

  // Stereo panning per partial
  if (opts.pan !== 0 && typeof StereoPannerNode !== "undefined") {
    const panner = ctx.createStereoPanner();
    panner.pan.value = Math.max(-1, Math.min(1, opts.pan));
    osc.connect(gain);
    gain.connect(panner);
    panner.connect(dest);
  } else {
    osc.connect(gain);
    gain.connect(dest);
  }

  osc.start(startTime);
  osc.stop(startTime + opts.duration + 0.05);
}
