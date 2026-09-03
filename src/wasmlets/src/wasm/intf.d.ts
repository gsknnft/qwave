// TypeScript bindings for emscripten-generated code.  Automatically generated at compile time.
declare namespace RuntimeExports {
    function stringToUTF8(str: any, outPtr: any, maxBytesToWrite: any): any;
    /**
     * @param {number} ptr
     * @param {string} type
     */
    function getValue(ptr: number, type?: string): any;
    /**
     * Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the
     * emscripten HEAP, returns a copy of that string as a Javascript String object.
     *
     * @param {number} ptr
     * @param {number=} maxBytesToRead - An optional length that specifies the
     *   maximum number of bytes to read. You can omit this parameter to scan the
     *   string until the first 0 byte. If maxBytesToRead is passed, and the string
     *   at [ptr, ptr+maxBytesToReadr[ contains a null byte in the middle, then the
     *   string will cut short at that byte index.
     * @param {boolean=} ignoreNul - If true, the function will not stop on a NUL character.
     * @return {string}
     */
    function UTF8ToString(ptr: number, maxBytesToRead?: number | undefined, ignoreNul?: boolean | undefined): string;
    function lengthBytesUTF8(str: any): number;
}
interface WasmModule {
  _wt_outlength(_0: number): number;
  _wt_output(_0: number): number;
  _wt_lenlength(_0: number): number;
  _wt_length(_0: number): number;
  _wave_filtlength(_0: number): number;
  _set_wt_output(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _malloc(_0: number): number;
  _free(_0: number): void;
  _wave_init(_0: number): number;
  _wt_init(_0: number, _1: number, _2: number, _3: number): number;
  _dwt(_0: number, _1: number): void;
  _idwt(_0: number, _1: number): void;
  _setDWTExtension(_0: number, _1: number): void;
  _setWTConv(_0: number, _1: number): void;
  _wt_summary(_0: number): void;
  _wave_free(_0: number): void;
  _wt_free(_0: number): void;
}

export type MainModule = WasmModule & typeof RuntimeExports;
export default function MainModuleFactory (options?: unknown): Promise<MainModule>;
