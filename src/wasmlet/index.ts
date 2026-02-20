import { WasmOptions } from "../wasmlets/src/wasm/wavelib";
import { Wasmlet, init, Mode, wavedec, waverec } from "../wasmlets/src/index";

export interface WasmletInt {
    fft: (...data: Float64Array<ArrayBufferLike>[]) => {
        re: Float64Array;
        im: Float64Array;
    };
    morlet: (data: Float32Array<ArrayBufferLike>) => {
        coeffs: Float64Array[];
        freqs: Float32Array;
        wavelet: Float64Array<ArrayBufferLike>;
    };
    dwt: (data: Float64Array<ArrayBufferLike>, wavelet: Wasmlet) => Float64Array[];
}

export async function wasmlet(): Promise<WasmletInt> {
  const wasm = await loadWasmlet();
  return {
    fft: wasm.fft,
    morlet: wasm.morletCWT,
    dwt: wasm.dwt,
  };
}


export interface WasmletsBridge {
    initialize?: (options?: WasmOptions) => Promise<void>;
    dwt: (data: Float64Array, wavelet: Wasmlet, mode?: Mode, level?: number) => Float64Array[];
    idwt: (coeffs: Float64Array[], wavelet: Wasmlet, mode?: Mode) => Float64Array;
    fft: (data: Float64Array) => { re: Float64Array; im: Float64Array };
    morletCWT: (data: Float32Array | Float64Array) => { coeffs: Float64Array[]; freqs: Float32Array, wavelet: Float64Array };
}


export async function loadWasmlet(): Promise<WasmletsBridge> {
  // Initialize WASM runtime once
  await init();

  // Expose a uniform interface for QWaveAdapter
  return {
    dwt: (data: Float64Array, wavelet: Wasmlet, mode?: Mode, level?: number) =>
      wavedec(data, wavelet, mode, level),
    idwt: (coeffs: Float64Array[], wavelet: Wasmlet, mode?: Mode) =>
      waverec(coeffs, wavelet, mode),
    fft: (data: Float64Array) => {
      const n = data.length;
      const re = new Float64Array(n);
      const im = new Float64Array(n);
      // small pure JS FFT fallback (optional)
      for (let k = 0; k < n; k++) {
        for (let t = 0; t < n; t++) {
          const angle = (2 * Math.PI * t * k) / n;
          re[k] += data[t] * Math.cos(angle);
          im[k] -= data[t] * Math.sin(angle);
        }
      }
      return { re, im };
    },
    morletCWT: (data: Float32Array | Float64Array) => {
      if ( data instanceof Float32Array) {
         data = new Float64Array(data);
      }
      const coeffs = wavedec(data, "db4", "sym", 3);
      const wavelet = waverec(coeffs, 'db4', 'sym')
      return { coeffs, freqs: new Float32Array(coeffs.length), wavelet };
    },
  };
}
