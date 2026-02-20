# Third-Party Notices

`@gsknnft/qwave` redistributes and wraps functionality from upstream projects.

## Included/Derived Components

1. `discrete-wavelets`

- Upstream: https://github.com/Symmetronic/discrete-wavelets
- License: MIT
- Notes: This package re-exports and wraps DWT utilities.

2. `wasmlets`

- Upstream: https://github.com/flatironinstitute/wasmlets
- License: BSD-3-Clause
- Notes: This package re-exports and wraps WASM wavelet bindings.

3. `wavelib` (vendored through `wasmlets`)

- Upstream: https://github.com/rafat/wavelib
- License: BSD-3-Clause
- Notes: Native wavelet implementation used by the WASM layer.

## Attribution and License Compliance

- The project-level license for `@gsknnft/qwave` is MIT.
- Upstream components retain their original licenses.
- Redistribution conditions from BSD-3-Clause components apply to binary/source redistributions where required.
