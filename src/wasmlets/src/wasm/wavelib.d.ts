// Hand-written types for the wavelib module

import type { RuntimeExports } from "./intf";

// Newtype trick to create distinct types for different kinds of pointers
declare const brand: unique symbol;
type Brand<T, U> = T & {
  [brand]: U;
};

type ptr = Brand<number, "raw pointer">;
type cstr = Brand<number, "null-terminated char pointer">;
type wave_object = Brand<number, "wave_set pointer">;
type wt_object = Brand<number, "wt_set pointer">;

export type Pointers = {
  ptr: ptr;
  cstr: cstr;
  wave_object: wave_object;
  wt_object: wt_object;
}

// based on the output in `intf.d.ts`, but manually made more helpful
interface WasmModule {
  _wt_lenlength(wt: wt_object): number;
  _wt_length(wt: wt_object): ptr;
  _wt_outlength(wt: wt_object): number;
  _wt_output(wt: wt_object): ptr;
  _set_wt_output(wt: wt_object, output: ptr, outlength: number, lengths: ptr, lenlength: number): void;
  _set_wt_output(wt: wt_object, output: ptr, outlength: number): void;
  _wave_filtlength(wave: wave_object): number;
  _wave_init(wname: cstr): wave_object;
  _wt_init(wave: wave_object, method: cstr, siglength: number, j: number): wt_object;
  _dwt(wt: wt_object, input: ptr): void;
  _idwt(wt: wt_object, dwtop: ptr): void;
  _setDWTExtension(wt: wt_object, extension: cstr): void;
  _setWTConv(wt: wt_object, cmethod: cstr): void;
  _wave_free(obj: wave_object): void;
  _wt_summary(obj: wt_object): void;
  _wt_free(obj: wt_object): void;
  _malloc(n_bytes: number): ptr;
  _free(ptr: ptr | cstr): void;
}

// Minimal subset of the Emscripten runtime objects we actually use in functional.ts
interface EmscriptenMemory {
  HEAP8: Int8Array;
  HEAP16: Int16Array;
  HEAP32: Int32Array;
  HEAPU8: Uint8Array;
  HEAPU16: Uint16Array;
  HEAPU32: Uint32Array;
  HEAPF32: Float32Array;
  HEAPF64: Float64Array;
  lengthBytesUTF8(str: string): number;
}

// Use the generated interface plus the runtime exports and heap views.
// We refer to the generated type indirectly so regenerated intf.d.ts can overwrite safely.
type IntfMainModule = import("./intf").MainModule;
export type MainModule = WasmModule & IntfMainModule & EmscriptenMemory;

export type WasmOptions = {
  print?: (msg: string) => void;
  printErr?: (msg: string) => void;
  wasmBinary?: ArrayBuffer;
}

export default function createModule(options?: WasmOptions): Promise<MainModule>;
