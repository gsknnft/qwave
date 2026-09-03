import { describe, expect, it } from "vitest";
import { Entropy } from "./index";

const uniform4 = [0.25, 0.25, 0.25, 0.25];
const peaked4 = [0.7, 0.1, 0.1, 0.1];

/**
 * Regression tests for the divergence family.
 *
 * These exist because `jensenShannonDivergence` shipped inverted in 1.0.0: it
 * averaged cross-entropies to the mixture rather than KL divergences to it, so
 * identical distributions scored HIGHER than different ones. Every property below
 * failed before the fix, and the first one is the whole bug in a single line.
 */
describe("jensenShannonDivergence", () => {
  it("is ZERO for identical distributions", () => {
    // Previously returned 2.0 for this input -- exactly H(p).
    expect(Entropy.jensenShannonDivergence(uniform4, uniform4)).toBeCloseTo(0, 12);
    expect(Entropy.jensenShannonDivergence(peaked4, peaked4)).toBeCloseTo(0, 12);
  });

  it("ranks different distributions above identical ones", () => {
    // The inversion. Previously: identical 2.0 vs different 1.83.
    const same = Entropy.jensenShannonDivergence(uniform4, uniform4);
    const different = Entropy.jensenShannonDivergence(uniform4, peaked4);
    expect(different).toBeGreaterThan(same);
  });

  it("is symmetric", () => {
    expect(Entropy.jensenShannonDivergence(uniform4, peaked4)).toBeCloseTo(
      Entropy.jensenShannonDivergence(peaked4, uniform4),
      12,
    );
  });

  it("is bounded to 1 bit and reaches it only for disjoint support", () => {
    expect(Entropy.jensenShannonDivergence([1, 0], [0, 1])).toBeCloseTo(1, 10);
    expect(Entropy.jensenShannonDivergence(uniform4, peaked4)).toBeLessThan(1);
    expect(Entropy.jensenShannonDivergence(uniform4, peaked4)).toBeGreaterThan(0);
  });

  it("normalizes its inputs, so scale does not change the answer", () => {
    // Callers pass raw magnitude vectors. JSD is defined on distributions, and
    // the old implementation did not normalize.
    const counts = [2, 6, 8, 4];
    const scaled = counts.map((c) => c * 37);
    expect(Entropy.jensenShannonDivergence(counts, uniform4)).toBeCloseTo(
      Entropy.jensenShannonDivergence(scaled, uniform4),
      12,
    );
  });

  it("grows monotonically as a distribution moves away", () => {
    const near = Entropy.jensenShannonDivergence([0.3, 0.25, 0.25, 0.2], uniform4);
    const far = Entropy.jensenShannonDivergence([0.9, 0.04, 0.03, 0.03], uniform4);
    expect(near).toBeLessThan(far);
  });

  it("handles zero and empty vectors without producing NaN", () => {
    expect(Entropy.jensenShannonDivergence([], [])).toBe(0);
    expect(Entropy.jensenShannonDivergence([0, 0], [0, 0])).toBe(0);
    expect(Number.isFinite(Entropy.jensenShannonDivergence([1, 0, 0], uniform4))).toBe(true);
  });

  it("does not discard mass when vector lengths differ", () => {
    // Missing trailing bins mean zero mass in the legacy number-returning API.
    // The previous Math.min implementation silently removed q's last bin and
    // could turn genuinely different vectors into an identical comparison.
    expect(Entropy.jensenShannonDivergence([1], [1, 1])).toBeGreaterThan(0);
    expect(Entropy.jensenShannonDivergence([1], [0, 1])).toBeCloseTo(1, 10);
  });
});

describe("crossEntropy", () => {
  it("returns H(P) when P equals Q, which is why it is not a distance", () => {
    // The property that made the old JSD wrong, kept as documentation.
    const shannon = -uniform4.reduce((s, p) => s + p * Math.log2(p), 0);
    expect(Entropy.crossEntropy(uniform4, uniform4)).toBeCloseTo(shannon, 10);
    expect(Entropy.crossEntropy(uniform4, uniform4)).toBeCloseTo(2, 10);
  });

  it("exceeds H(P) when Q differs", () => {
    // H(P,Q) = H(P) + KL(P||Q) >= H(P), with equality only when P = Q.
    const shannon = -uniform4.reduce((s, p) => s + p * Math.log2(p), 0);
    expect(Entropy.crossEntropy(uniform4, peaked4)).toBeGreaterThan(shannon);
  });

  it("skips zero-probability terms rather than producing NaN", () => {
    expect(Number.isFinite(Entropy.crossEntropy([0.5, 0.5, 0], uniform4.slice(0, 3)))).toBe(true);
  });
});

describe("measureSpectrumWithWindow", () => {
  it("still returns the windowed spectral entropy after the dead code removal", () => {
    // The removed block computed a variance, a JSD and a combined score, then
    // discarded all three. Behaviour must be unchanged; only the cost differs.
    const samples = Float64Array.from({ length: 256 }, (_, i) => Math.sin(i / 8));
    const withWindow = Entropy.measureSpectrumWithWindow(samples);
    expect(Number.isFinite(withWindow)).toBe(true);
    expect(withWindow).toBeGreaterThanOrEqual(0);
  });

  it("returns 0 for a signal too short to analyse", () => {
    expect(Entropy.measureSpectrumWithWindow(Float64Array.from([1, 2]))).toBe(0);
  });

  it("scores noise above a pure tone", () => {
    const tone = Float64Array.from({ length: 512 }, (_, i) => Math.sin(i / 4));
    let seed = 7;
    const noise = Float64Array.from({ length: 512 }, () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff - 0.5;
    });
    expect(Entropy.measureSpectrumWithWindow(noise)).toBeGreaterThan(
      Entropy.measureSpectrumWithWindow(tone),
    );
  });
});
