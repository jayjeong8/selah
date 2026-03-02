"use client";

import { useCallback, useRef } from "react";
import { applyADSR } from "../../_shared-audio/adsr";
import { playBell, playMicroBell } from "../../_shared-audio/bell";
import { createMasterBus } from "../../_shared-audio/master-bus";
import { createReverbIR } from "../../_shared-audio/reverb";

export type SoundType = "correct" | "error" | "verse-done" | "chapter-done";

/** Per-sound reverb send configuration */
const REVERB_CONFIG: Record<SoundType, { dry: number; reverbSend: number }> = {
  correct: { dry: 0.85, reverbSend: 0.12 },
  error: { dry: 1.0, reverbSend: 0.0 },
  "verse-done": { dry: 0.7, reverbSend: 0.4 },
  "chapter-done": { dry: 0.65, reverbSend: 0.45 },
};

/** Shared noise buffer for quill-scratch transients */
let sharedNoiseBuffer: AudioBuffer | null = null;

function getNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (!sharedNoiseBuffer || sharedNoiseBuffer.sampleRate !== ctx.sampleRate) {
    const length = Math.floor(ctx.sampleRate * 0.05); // 50ms (extended for improved scratch)
    sharedNoiseBuffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = sharedNoiseBuffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  }
  return sharedNoiseBuffer;
}

interface AudioRouting {
  ctx: AudioContext;
  bus: GainNode;
  convolver: ConvolverNode;
}

export function useKeySound() {
  const routingRef = useRef<AudioRouting | null>(null);
  const enabledRef = useRef(true);

  const ensureCtx = useCallback((): AudioRouting | null => {
    if (!routingRef.current) {
      try {
        const ctx = new AudioContext();

        const bus = createMasterBus(ctx, {
          warmth: 1.4,
          threshold: -20,
          ratio: 2.5,
          attack: 0.001,
          release: 0.25,
          makeupGain: 1.15,
        });

        // Cathedral reverb convolver → master bus
        const convolver = ctx.createConvolver();
        convolver.buffer = createReverbIR(ctx, {
          duration: 3.5,
          decay: 3.0,
          density: 0.85,
          highDamping: 5500,
          predelay: 0.02,
        });
        convolver.connect(bus);

        routingRef.current = { ctx, bus, convolver };
      } catch {
        return null;
      }
    }
    const { ctx } = routingRef.current;
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    return routingRef.current;
  }, []);

  const play = useCallback(
    (type: SoundType) => {
      if (!enabledRef.current) return;
      const routing = ensureCtx();
      if (!routing) return;

      const { ctx, bus, convolver } = routing;
      const config = REVERB_CONFIG[type];
      const now = ctx.currentTime;
      const jitter = 1 + (Math.random() - 0.5) * 0.04;

      // Per-sound dry/reverb routing
      const dryGain = ctx.createGain();
      dryGain.gain.value = config.dry;
      dryGain.connect(bus);

      let dest: AudioNode = dryGain;

      if (config.reverbSend > 0) {
        const reverbGain = ctx.createGain();
        reverbGain.gain.value = config.reverbSend;
        reverbGain.connect(convolver);

        // Merge node: sound → merge → [dry, reverb]
        const merge = ctx.createGain();
        merge.connect(dryGain);
        merge.connect(reverbGain);
        dest = merge;
      }

      switch (type) {
        case "correct":
          playCorrect(ctx, dest, now, jitter);
          break;
        case "error":
          playError(ctx, dest, now, jitter);
          break;
        case "verse-done":
          playVerseDone(ctx, dest, now, jitter);
          break;
        case "chapter-done":
          playChapterDone(ctx, dest, now, jitter);
          break;
      }
    },
    [ensureCtx],
  );

  const setEnabled = useCallback((enabled: boolean) => {
    enabledRef.current = enabled;
  }, []);

  const init = useCallback(() => {
    ensureCtx();
  }, [ensureCtx]);

  return { play, setEnabled, init };
}

/** D major pentatonic pitch pool — random selection reduces typing fatigue */
const CORRECT_PITCH_POOL = [
  493, // B4
  554, // C#5
  587, // D5
  740, // F#5
  880, // A5
];

/**
 * Correct keystroke — sanctus bell (제대 종) across the scriptorium
 * Micro-bell with 4 Rayleigh partials + quill scratch on parchment.
 */
function playCorrect(ctx: AudioContext, dest: AudioNode, now: number, jitter: number) {
  // Random pitch from D major pentatonic pool
  const baseFreq =
    CORRECT_PITCH_POOL[Math.floor(Math.random() * CORRECT_PITCH_POOL.length)] * jitter;

  // Micro-bell: 4 partials, minimal strike, ~180ms
  playMicroBell(ctx, dest, now, {
    fundamental: baseFreq,
    amplitude: 0.11,
    duration: 0.18,
  });

  // Quill scratch — bandpassed noise, 40ms, delayed 3ms after bell onset
  const scratchStart = now + 0.003;
  const noise = ctx.createBufferSource();
  noise.buffer = getNoiseBuffer(ctx);
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 3500;
  bp.Q.value = 1.2;
  const gn = ctx.createGain();
  gn.gain.setValueAtTime(0.025, scratchStart);
  gn.gain.exponentialRampToValueAtTime(0.001, scratchStart + 0.04);
  noise.connect(bp);
  bp.connect(gn);
  gn.connect(dest);
  noise.start(scratchStart);
}

/**
 * Error keystroke — gentle wooden thud
 * Very soft low-frequency feedback, barely perceptible.
 */
function playError(ctx: AudioContext, dest: AudioNode, now: number, jitter: number) {
  // Soft triangle thud with pitch drop
  const osc = ctx.createOscillator();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(160 * jitter, now);
  osc.frequency.exponentialRampToValueAtTime(120 * jitter, now + 0.1);
  const g = ctx.createGain();
  applyADSR(g, now, {
    attack: 0.006,
    decay: 0.04,
    sustain: 0.15,
    release: 0.08,
    peak: 0.055,
  });
  osc.connect(g);
  g.connect(dest);
  osc.start(now);
  osc.stop(now + 0.15);

  // Faint low-band noise for wooden texture
  const noise = ctx.createBufferSource();
  noise.buffer = getNoiseBuffer(ctx);
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 600;
  const gn = ctx.createGain();
  gn.gain.setValueAtTime(0.03, now);
  gn.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
  noise.connect(lp);
  lp.connect(gn);
  gn.connect(dest);
  noise.start(now);
}

/**
 * Verse done — large cast bronze monastery bell
 * 10 Rayleigh partials + 2 beating pairs + strike transient.
 * Total dry duration ~4s, with reverb tail ~6-7s.
 */
function playVerseDone(ctx: AudioContext, dest: AudioNode, now: number, jitter: number) {
  playBell(ctx, dest, now, {
    fundamental: 349 * jitter, // F4 — solemn and warm
    amplitude: 0.13,
    duration: 4.0,
    strikeIntensity: 1.0,
  });
}

/**
 * Chapter done — vespers bells (만과기도 종)
 * 4 tower bells ring in sequence: D4 → G4 → A4 → D5
 * 900ms spacing, stereo separation, ghost resonance at the end.
 * Total perceived duration ~8-9s with reverb.
 */
function playChapterDone(ctx: AudioContext, dest: AudioNode, now: number, jitter: number) {
  const bells = [
    { freq: 294, duration: 5.0, pan: -0.15, amp: 0.1 }, // D4
    { freq: 392, duration: 4.5, pan: 0.1, amp: 0.11 }, // G4
    { freq: 440, duration: 4.0, pan: -0.05, amp: 0.12 }, // A4
    { freq: 587, duration: 3.5, pan: 0.15, amp: 0.13 }, // D5
  ];
  const spacing = 0.9;

  for (let i = 0; i < bells.length; i++) {
    const bell = bells[i];
    const t = now + i * spacing;

    playBell(ctx, dest, t, {
      fundamental: bell.freq * jitter,
      amplitude: bell.amp,
      duration: bell.duration,
      strikeIntensity: 1.0,
      pan: bell.pan,
    });
  }

  // Ghost D3 — tower resonance, 1.5s after last bell
  const ghostTime = now + bells.length * spacing + 1.5;
  playBell(ctx, dest, ghostTime, {
    fundamental: 147 * jitter, // D3
    amplitude: 0.03,
    duration: 3.0,
    strikeIntensity: 0,
  });
}
