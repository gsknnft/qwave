const module = await import("@gsknnft/qwave/entropy");

if (typeof module.Entropy?.measureSpectrumHann !== "function") {
  throw new Error("@gsknnft/qwave/entropy did not expose Entropy.measureSpectrumHann");
}

const value = module.Entropy.measureSpectrumHann(new Float64Array([0, 1, 0, -1, 0, 1, 0, -1]));
if (!Number.isFinite(value)) {
  throw new Error("@gsknnft/qwave/entropy smoke result was not finite");
}

console.log("qwave entropy node import ok");
