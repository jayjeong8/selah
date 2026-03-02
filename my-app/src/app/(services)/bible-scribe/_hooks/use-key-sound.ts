"use client";

import { useCallback, useRef } from "react";
import { applyADSR } from "../../_shared-audio/adsr";
import { createMasterBus } from "../../_shared-audio/master-bus";
import { createReverbSend } from "../../_shared-audio/reverb";

export type SoundType = "correct" | "error" | "verse-done" | "chapter-done";

/** Shared noise buffer for quill-scratch transients */
let sharedNoiseBuffer: AudioBuffer | null = null;

function getNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (!sharedNoiseBuffer || sharedNoiseBuffer.sampleRate !== ctx.sampleRate) {
    const length = Math.floor(ctx.sampleRate * 0.03); // 30ms
    sharedNoiseBuffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = sharedNoiseBuffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  }
  return sharedNoiseBuffer;
}

export function useKeySound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const busRef = useRef<GainNode | null>(null);
  const reverbRef = useRef<{ input: GainNode; output: GainNode } | null>(null);
  const enabledRef = useRef(true);

  const ensureCtx = useCallback((): AudioContext | null => {
    if (!ctxRef.current) {
      try {
        const ctx = new AudioContext();
        ctxRef.current = ctx;

        const bus = createMasterBus(ctx, {
          warmth: 1.03,
          threshold: -24,
          ratio: 1.8,
          makeupGain: 1.15,
        });
        busRef.current = bus;

        // Cathedral reverb — spacious, long tail
        const reverb = createReverbSend(ctx, {
          wetLevel: 0.28,
          dryLevel: 0.8,
          irOptions: { duration: 1.8, decay: 4.5, density: 0.85 },
        });
        reverb.output.connect(bus);
        reverbRef.current = reverb;
      } catch {
        return null;
      }
    }
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    return ctx;
  }, []);

  const play = useCallback(
    (type: SoundType) => {
      if (!enabledRef.current) return;
      const ctx = ensureCtx();
      const bus = busRef.current;
      const reverb = reverbRef.current;
      if (!ctx || !bus) return;

      const now = ctx.currentTime;
      const jitter = 1 + (Math.random() - 0.5) * 0.04;

      switch (type) {
        case "correct":
          playCorrect(ctx, reverb?.input ?? bus, now, jitter);
          break;
        case "error":
          playError(ctx, bus, now, jitter);
          break;
        case "verse-done":
          playVerseDone(ctx, reverb?.input ?? bus, now, jitter);
          break;
        case "chapter-done":
          playChapterDone(ctx, reverb?.input ?? bus, now, jitter);
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

/**
 * Correct keystroke — quill-on-parchment chime
 * Warm bell tone with subtle inharmonic partials + faint quill scratch.
 */
function playCorrect(ctx: AudioContext, dest: AudioNode, now: number, jitter: number) {
  const baseFreq = 493 * jitter; // B4, warm and clear

  // Fundamental — soft sine bell
  const osc1 = ctx.createOscillator();
  osc1.type = "sine";
  osc1.frequency.value = baseFreq;
  const g1 = ctx.createGain();
  applyADSR(g1, now, {
    attack: 0.004,
    decay: 0.1,
    sustain: 0.1,
    release: 0.2,
    peak: 0.11,
  });
  osc1.connect(g1);
  g1.connect(dest);
  osc1.start(now);
  osc1.stop(now + 0.35);

  // Minor third partial (~1.183x) — bell shimmer
  const osc2 = ctx.createOscillator();
  osc2.type = "sine";
  osc2.frequency.value = baseFreq * 1.183;
  const g2 = ctx.createGain();
  applyADSR(g2, now, {
    attack: 0.004,
    decay: 0.07,
    sustain: 0.06,
    release: 0.15,
    peak: 0.035,
  });
  osc2.connect(g2);
  g2.connect(dest);
  osc2.start(now);
  osc2.stop(now + 0.28);

  // Quill scratch — very faint bandpassed noise
  const noise = ctx.createBufferSource();
  noise.buffer = getNoiseBuffer(ctx);
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 3500;
  bp.Q.value = 2.0;
  const gn = ctx.createGain();
  gn.gain.setValueAtTime(0.025, now);
  gn.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
  noise.connect(bp);
  bp.connect(gn);
  gn.connect(dest);
  noise.start(now);
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
 * Verse done — monastery bell
 * Rich bell tone with inharmonic partials characteristic of cast bronze bells.
 * Long sustain and cathedral reverb tail.
 */
function playVerseDone(ctx: AudioContext, dest: AudioNode, now: number, jitter: number) {
  const fundamental = 349 * jitter; // F4 — solemn and warm

  // Bell partials (slightly inharmonic, as real bells are)
  const partials = [
    { ratio: 1.0, type: "sine" as const, peak: 0.13, decay: 0.15, release: 0.6 },
    { ratio: 2.0, type: "sine" as const, peak: 0.06, decay: 0.1, release: 0.45 },
    { ratio: 2.09, type: "sine" as const, peak: 0.04, decay: 0.08, release: 0.35 }, // minor third above octave — bell character
    { ratio: 3.0, type: "sine" as const, peak: 0.025, decay: 0.07, release: 0.3 }, // twelfth
    { ratio: 4.16, type: "sine" as const, peak: 0.012, decay: 0.05, release: 0.2 }, // high shimmer
  ];

  for (const p of partials) {
    const osc = ctx.createOscillator();
    osc.type = p.type;
    osc.frequency.value = fundamental * p.ratio;
    const g = ctx.createGain();
    applyADSR(g, now, {
      attack: 0.003,
      decay: p.decay,
      sustain: 0.25,
      release: p.release,
      peak: p.peak,
    });
    osc.connect(g);
    g.connect(dest);
    osc.start(now);
    osc.stop(now + p.decay + 0.25 + p.release + 0.1);
  }
}

/**
 * Chapter done — vespers bells (만과기도 종)
 * Slow ascending open-fifth intervals with bell-like overtones.
 * Medieval monastic tone: D4 → G4 → A4 → D5.
 */
function playChapterDone(ctx: AudioContext, dest: AudioNode, now: number, jitter: number) {
  const notes = [294, 392, 440, 587]; // D4 G4 A4 D5 — open fifths, medieval
  const spacing = 0.35; // Wide spacing between notes

  for (let i = 0; i < notes.length; i++) {
    const freq = notes[i] * jitter;
    const t = now + i * spacing;

    // Fundamental bell tone
    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.value = freq;
    const g1 = ctx.createGain();
    applyADSR(g1, t, {
      attack: 0.008,
      decay: 0.2,
      sustain: 0.3,
      release: 0.65,
      peak: 0.12,
    });
    osc1.connect(g1);
    g1.connect(dest);
    osc1.start(t);
    osc1.stop(t + 1.0);

    // Inharmonic bell partial (minor third above octave, ~2.09x)
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = freq * 2.09;
    const g2 = ctx.createGain();
    applyADSR(g2, t, {
      attack: 0.008,
      decay: 0.12,
      sustain: 0.15,
      release: 0.4,
      peak: 0.03,
    });
    osc2.connect(g2);
    g2.connect(dest);
    osc2.start(t);
    osc2.stop(t + 0.7);

    // Fifth harmonic (quiet, adds brightness)
    const osc3 = ctx.createOscillator();
    osc3.type = "sine";
    osc3.frequency.value = freq * 3.0;
    const g3 = ctx.createGain();
    applyADSR(g3, t, {
      attack: 0.008,
      decay: 0.08,
      sustain: 0.1,
      release: 0.3,
      peak: 0.015,
    });
    osc3.connect(g3);
    g3.connect(dest);
    osc3.start(t);
    osc3.stop(t + 0.55);
  }
}
