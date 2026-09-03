import wt from "./discrete-wavelets/src/wt";
import type {Wavelet, WaveletBasis} from "./discrete-wavelets/src/wavelets/wavelets";
export * from "./wasmlets/src/functional";
export * from "./entropy/index";
import { add, assertValidFilters, dot, createArray, assertValidCoeffs, assertValidApproxDetail, mulScalar, padElement, padWidths, waveletFromScalingNumbers } from "./discrete-wavelets/src/helpers";

export * as WasmletLib from './wasmlet';

import createModule from "./wasmlets/src/wasm/wavelib";
import { init, waverec, wavedec, loadWasmlet } from "./wasmlets/src/index";
import type { Wasmlet, Mode } from "./wasmlets/src/types/types";
import {Entropy} from "./entropy/index";

import { type WasmOptions } from "./wasmlets/src/wasm/wavelib";
export type { WasmOptions, Wavelet, Mode };
export {
  init, waverec, wavedec, loadWasmlet, createModule, Wasmlet, Entropy, wt, WaveletBasis,
  /* Helpers */
  add,
  assertValidFilters,
  dot,
  createArray,
  assertValidCoeffs,
  assertValidApproxDetail,
  mulScalar,
  padElement,
  padWidths,
  waveletFromScalingNumbers
};

export interface WaveletLib {
  wt: typeof wt;
  Wavelet: Wavelet;
  Entropy: Entropy;
  dwt: typeof wt.dwt;
  idwt: typeof wt.idwt;
  energy: typeof wt.energy;
  maxLevel: typeof wt.maxLevel;
  inverseTransform: typeof wt.idwt;
  wtwaverec: typeof wt.wavedec;
  wtwavedec: typeof wt.waverec;
  add: typeof add;
  assertValidFilters: typeof assertValidFilters;
  dot: typeof dot;
  createArray: typeof createArray;
  assertValidCoeffs: typeof assertValidCoeffs;
  assertValidApproxDetail: typeof assertValidApproxDetail;
  mulScalar: typeof mulScalar;
  padElement: typeof padElement;
  padWidths: typeof padWidths;
  waveletFromScalingNumbers: typeof waveletFromScalingNumbers;
}

export interface WasmletLib {
  wasmModule: typeof createModule;
  Wasmlet: Wasmlet;
  Entropy: Entropy;
  wavedec: typeof wavedec;
  waverec: typeof waverec;
  init: typeof init;
  loadWasmlet: typeof loadWasmlet;
}

export default wt;
