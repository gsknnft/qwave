# @gsknnft/qwave
[![NPM Version](https://img.shields.io/npm/v/@gsknnft/qwave.svg?style=flat-square)](https://www.npmjs.com/package/@gsknnft/qwave)
[![NPM Downloads](https://img.shields.io/npm/dw/@gsknnft/qwave.svg?style=flat-square)](https://www.npmjs.com/package/@gsknnft/qwave)
[![License](https://img.shields.io/npm/l/@gsknnft/qwave.svg?style=flat-square)](https://www.npmjs.com/package/@gsknnft/qwave)
[![Socket Badge](https://badge.socket.dev/npm/package/@gsknnft/qwave/1.0.0)](https://socket.dev/npm/package/@gsknnft/qwave)

Wave/spectral toolkit for SigilNet & VeraOS workloads. `qwave` exposes a single package surface over:

- `wasmlets` (WASM-backed wave primitives)
- `discrete-wavelets` (DWT utilities)
- top-level convenience exports for app/runtime integration

This is an integration package: it consolidates upstream wavelet tooling behind one stable API and adds SigilNet-specific utility exports.

## Install

```bash
pnpm add @gsknnft/qwave
```

## Usage

```ts
import * as qwave from "@gsknnft/qwave";
```

Subpath imports:

```ts
import * as wasmlets from "@gsknnft/qwave/wasmlets";
import * as dw from "@gsknnft/qwave/discrete-wavelets";
```

## Build

```bash
pnpm --filter @gsknnft/qwave build
```

## Test

```bash
pnpm --filter @gsknnft/qwave test
```

## Package Scope

- Deterministic wave/spectral utilities
- Shared signal-processing substrate for higher layers (`mse`, `coherence`, demo surfaces)
- No governance/control-plane policy logic

## Provenance

- `discrete-wavelets` and `wasmlets` are upstream projects wrapped/re-exported through this package.
- `wavelib` is used underneath the wasm layer.
- See `THIRD_PARTY_NOTICES.md` for attribution and license details.

## Compatibility

- Node.js `>=20`
- pnpm `>=10`

## Notes

- This package is part of a larger monorepo; release cadence is incremental and strategic.
- Public API should be treated as semver-governed from each tagged release forward.
