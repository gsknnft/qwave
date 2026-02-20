Perfect. While that runs, use this release note draft:

**`@gsknnft/qwave v1.0.0` - Unified Wavelet + WASM Toolkit**

`@gsknnft/qwave@1.0.0` is now live on npm.
This release publishes a consolidated wave/spectral package that wraps and stabilizes the `discrete-wavelets` and `wasmlets` lanes behind one top-level API.

## Highlights

- Unified package surface for:
  - discrete DWT utilities
  - wasm-backed wavelet functions
  - top-level entropy/signal helpers
- Clean subpath exports:
  - `@gsknnft/qwave/wasmlets`
  - `@gsknnft/qwave/discrete-wavelets`
- Hardened package contract:
  - explicit publish allowlist (`files`)
  - deterministic tarball contents
  - release-safe metadata and scripts
- Third-party attribution added:
  - `THIRD_PARTY_NOTICES.md` included in package

## Package status

- npm:
  - `latest: 1.0.0`
- Verified:
  - typecheck/build/test in release lane
  - pack output reviewed
  - docs and runbook aligned

## Install

```bash
pnpm add @gsknnft/qwave
```

## Quick use

```ts
import * as qwave from "@gsknnft/qwave";
import * as wasmlets from "@gsknnft/qwave/wasmlets";
import * as dw from "@gsknnft/qwave/discrete-wavelets";
```

If your build/test passes, next step is publish + tag.
