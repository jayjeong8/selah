import { createWarmthShaper } from "./warmth";

interface MasterBusOptions {
  warmth?: number;
  threshold?: number;
  knee?: number;
  ratio?: number;
  attack?: number;
  release?: number;
  makeupGain?: number;
}

/**
 * Create a master bus chain: WaveShaper → DynamicsCompressor → MakeupGain → destination.
 * Returns the input GainNode that all sounds should connect to.
 */
export function createMasterBus(ctx: AudioContext, options?: MasterBusOptions): GainNode {
  const {
    warmth = 1.15,
    threshold = -18,
    knee = 12,
    ratio = 4,
    attack = 0.003,
    release = 0.15,
    makeupGain = 1.4,
  } = options ?? {};

  const input = ctx.createGain();
  input.gain.value = 1;

  const shaper = createWarmthShaper(ctx, warmth);

  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = threshold;
  compressor.knee.value = knee;
  compressor.ratio.value = ratio;
  compressor.attack.value = attack;
  compressor.release.value = release;

  const makeup = ctx.createGain();
  makeup.gain.value = makeupGain;

  input.connect(shaper);
  shaper.connect(compressor);
  compressor.connect(makeup);
  makeup.connect(ctx.destination);

  return input;
}
