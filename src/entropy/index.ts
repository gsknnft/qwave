// Minimal placeholder for entropy utilities referenced across SigilNet.
// packages/QWave/entropy.ts

import { randomBytes } from "crypto";
import { applyHannWindow } from "./windows";
import { FFT, computeFFT } from "@gsknnft/fft-ts";
import wt from "../discrete-wavelets/src/wt";

export class EntropyLite {

  static seed(length: number): Uint8Array {
    const buf = new Uint8Array(length);
    for (let i = 0; i < length; i++) buf[i] = (Math.random() * 256) | 0;
    return buf;
  }

  static measureSpectrumWithWindow(values: Float64Array): number {
    // Placeholder metric: normalized variance.
    if (values.length === 0) return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / values.length;
    const varNorm = variance / (mean*mean + 1e-6);
    return Math.min(varNorm, 1);
  }

  static delta(current: number, previous: number): number {
    return current - previous;
  }

  static negentropicIndex(coherence: number, entropy: number): number {
    const safeEntropy = Math.max(entropy, 1e-6);
    return coherence / safeEntropy;
  }
}


export class Entropy {
  static negentropicIndex(coherence: number, H: number) {
    return coherence / (H + 1e-9);
  }

  /**
   * Generate a local entropy seed.
   */
  static seed(length: number = 256): Uint8Array {
    return randomBytes(length);
  }

  /**
   * Shannon entropy of a byte array, normalized [0,1].
   */
  static measureBytes(data: Uint8Array): number {
    const freq: Record<number, number> = {};
    for (const byte of data) freq[byte] = (freq[byte] || 0) + 1;
    const len = data.length;
    let entropy = 0;
    for (const count of Object.values(freq)) {
      const p = count / len;
      entropy -= p * Math.log2(p);
    }
    return entropy / 8; // normalize (max 8 bits per symbol)
  }

  /**
   * Spectral entropy: measure entropy of FFT magnitudes.
   */
  static measureSpectrum(signal: Float64Array): number {
    const fft = new FFT(signal);
    const spectrum = fft.createComplexArray();
    fft.realTransform(spectrum, signal); // forward transform (out !== data)

    const mags = new Float64Array(spectrum.length / 2);
    for (let i = 0, j = 0; i < spectrum.length; i += 2, j++) {
      mags[j] = Math.hypot(spectrum[i], spectrum[i + 1]);
    }

    const sum = mags.reduce((a, b) => a + b, 0);
    if (sum === 0) return 0;

    let entropy = 0;
    for (const m of mags) {
      const p = m / sum;
      if (p > 0) entropy -= p * Math.log2(p);
    }
    return entropy / Math.log2(mags.length); // normalize [0,1]
  }


  static fullSpectrum(signal: Float64Array): Float64Array {
    const reconstructed = Float64Array.from(
      wt.waverec([Array.from(signal).flat()], "haar"),
    );
    const fft = new FFT(reconstructed);
    const spectrum = fft.createComplexArray();
    fft.realTransform(spectrum, reconstructed);

    const mags = new Float64Array(spectrum.length / 2);
    for (let i = 0, j = 0; i < spectrum.length; i += 2, j++) {
      mags[j] = Math.hypot(spectrum[i], spectrum[i + 1]);
    }
    return mags;
  }

  /**
   * Compute normalized Shannon entropy of a byte array.
   * Returns a value between 0 (no entropy) and 1 (max entropy).
   */
  static measure(data: Uint8Array): number {
    const freq: Record<number, number> = {};
    for (const byte of data) {
      freq[byte] = (freq[byte] || 0) + 1;
    }
    const len = data.length;
    let entropy = 0;
    for (const count of Object.values(freq)) {
      const p = count / len;
      entropy -= p * Math.log2(p);
    }
    // Normalize by maximum possible entropy (8 bits per symbol)
    return entropy / 8;
  }

  /**
   * Compute entropy delta between two signals.
   */
  static delta(a: number, b: number): number {
    return Math.abs(a - b);
  }

  /**
   * Calculate Shannon entropy of a signal
   */
  static entropy(signal: number[]): number {
    const hist: Record<string, number> = {};

    // Create histogram
    signal.forEach((val) => {
      const bin = Math.floor(val * 100).toString();
      hist[bin] = (hist[bin] || 0) + 1;
    });

    // Calculate probabilities
    const total = signal.length;
    const probs = Object.values(hist).map((count) => count / total);

    // Shannon entropy: H = -Σ p(x) log2(p(x))
    return -probs.reduce((sum, p) => sum + (p > 0 ? p * Math.log2(p) : 0), 0);
  }

  static measureSpectrumHann(samples: Float64Array): number {
    const N = samples.length;
    if (N <= 2) return 0;
    const windowed = applyHannWindow(samples, false) as Float64Array;
    const complex = computeFFT(windowed);
    if (!complex || !Array.isArray(complex) || complex.length === 0) return 0;
    const magnitude: number[] = [];
    for (let i = 0; i < complex.length; i++) {
      const c = complex[i];
      let real = 0,
        imag = 0;
      if (typeof c === "object" && c !== null) {
        if (typeof c.real === "number" && typeof c.imag === "number") {
          real = c.real;
          imag = c.imag;
        } else if (Array.isArray(c) && c.length === 2) {
          real = Number(c[0]);
          imag = Number(c[1]);
        }
      }
      magnitude.push(Math.sqrt(real * real + imag * imag));
    }
    const sumMag = magnitude.reduce((a, b) => a + b, 0);
    if (sumMag === 0) return 0;
    const probs = magnitude.map((m) => m / sumMag);
    const entropy = -probs.reduce(
      (sum, p) => sum + (p > 0 ? p * Math.log2(p) : 0),
      0
    );
    return entropy / Math.log2(magnitude.length);
  }

  static entropyVelocity(
    current: number,
    prev: number,
    deltaT: number
  ): number {
    return (current - prev) / (deltaT || 1e-6); // ΔH/Δt—damping term
  }

  static crossEntropy(p: number[], q: number[]): number {
    return -p.reduce((sum, pi, i) => sum + pi * Math.log2(q[i] || 1e-10), 0);
  }

  static smooth(value: number, history: number[], window = 10): number {
    history.push(value);
    if (history.length > window) history.shift();
    return history.reduce((a, b) => a + b, 0) / history.length;
  }


  static measureSpectrumWithWindow(samples: Float64Array): number {
    const N = samples.length;
    if (N <= 2) return 0;
    const mean = samples.reduce((a,b)=>a+b,0)/N;
    const variance = samples.reduce((acc,v)=>acc+(v-mean)**2,0)/N;
    const varNorm = variance / (mean*mean + 1e-6);
    const jensen = this.jensenShannonDivergence(
      Array.from(samples, v => v / (mean + 1e-6)),
      Array(N).fill(1 / N)
    );
    const score = Math.min(0.5 * varNorm + 0.5 * jensen, 1);
    const windowed = applyHannWindow(samples, false) as Float64Array;
    return this.measureSpectrum(windowed);
  }

  static jensenShannonDivergence(p: number[], q: number[]): number {
    const m = p.map((pi, i) => (pi + q[i]) / 2);
    return (this.crossEntropy(p, m) + this.crossEntropy(q, m)) / 2; // Distance for peer resonance
  }

  static totalEntropy(buf: Uint8Array, alpha = 0.6): number {
    const H_bytes = this.measureBytes(buf);
    const samples = Float64Array.from(buf);

    const H_spectrum = this.measureSpectrumWithWindow(samples);

    return alpha * H_bytes + (1 - alpha) * H_spectrum; // Tunable fusion
  }
}

/*


// Usage in Runtime (e.g., ModeController)
const buf = crypto.randomBytes(256); // Sample
const H_total = Entropy2.totalEntropy(buf, 0.6); // Fused
const velocity = Entropy2.entropyVelocity(H_total, prevH, deltaT); // For damping

// Peer Comparison
const dist = Entropy2.jensenShannonDivergence(peer1Mags, peer2Mags); // Resonance distance < threshold → align
if (dist < 0.1) transitionTo(FieldBehaviorMode.MORPHIC_RELAY);

---# 💡 Explanation

The **state machine** and the **mode controller**, & Formal **Entropy class** that can be
dropped in as a canonical source of entropy metrics and seeds.

## 🧩 What the Entropy class should do

Think of it as the **metabolic sensor** for SigilNet:

- **Seeding**: Generate local entropy seeds (cryptographically strong, reproducible if needed).
- **Measurement**: Calculate entropy of a signal, buffer, or peer telemetry (Shannon entropy, variance, etc.).
- **Delta tracking**: Compare local vs. peer entropy to drive reconciliation.
- **Normalization**: Map entropy values into the `[0,1]` range for thresholds (`ENTROPY_TO_RELAY`, `ENTROPY_SPIKE_FOR_IMMUNE`).

---

## 🧠 How it plugs into your ModeController

- **GENESIS**: `Entropy.seed(512)` seeds the local field.
- **RECONCILIATION**: `Entropy.delta(local, peer)` drives phase tuning.
- **MORPHIC_RELAY**: Monitor `Entropy.measure(signal)` to ensure coherence.
- **IMMUNE_RESPONSE**: Triggered when `Entropy.measure(peer)` spikes above threshold.

---

## 🚦 Next step

You don’t need to overbuild it yet. Start with `seed()` and `measure()`. As you fold in QWave metrics, you can extend it with:
- Sliding-window entropy
- Spectral entropy (FFT-based)
- Cross-entropy between peer signals

---

👉 Do you want me to sketch a **QWave-aware Entropy class** that integrates directly with your FFT pipeline (so entropy is measured in the frequency domain as well as byte-level)? That would align perfectly with your signal-driven architecture.
 */
