# fido-vc-wallet-ui

> Next.js 16 / React 19 user-facing wallet UI for the FIDO4VC protocol.
> Part of the [FIDO4VC project](https://fido4vc.github.io).

## What it does

The wallet UI is the user-facing surface for the FIDO-VC flows:

- **Account & DID management.** Sign in, list DIDs, register a new FIDO key — which is then converted to JWK, bound to a `did:jwk`, and stored against the user's wallet account.
- **Receive credentials.** Paste an OpenID4VCI offer URL, select the DID to receive on, complete a FIDO authentication ceremony; the wallet stores the resulting Verifiable Credential.
- **Present credentials.** Paste an OpenID4VP presentation-request URL, pick which credential to present, complete a FIDO authentication ceremony; the signed Verifiable Presentation is submitted to the verifier.

The UI talks to two backends:

| Backend | Used for | Configured via |
|---|---|---|
| `fido-vc-middleware` | All FIDO ceremonies and the bridge to walt.id | `NEXT_PUBLIC_BACKEND_URL` |
| walt.id Wallet API | Wallet account, DID list, credential storage | `NEXT_PUBLIC_WALLET_API_URL` |

All cryptographic operations happen *server-side* (middleware + walt.id) or *device-side* (the user's FIDO authenticator via WebAuthn). The UI itself does no crypto — it uses `@simplewebauthn/browser` to invoke the platform WebAuthn API.

## Prerequisites

- **Node.js ≥ 18**
- A running [fido-vc-middleware](https://github.com/fido4vc/fido-vc-middleware) instance (default `http://localhost:8080`)
- A running [walt.id Wallet API](https://github.com/fido4vc/waltid-identity) (default `http://localhost:7001`)
- A modern browser with WebAuthn support (effectively every modern desktop/mobile browser)

## Install

```bash
git clone https://github.com/fido4vc/fido-vc-wallet-ui
cd fido-vc-wallet-ui
npm install
```

## Configure

Copy `.env` (or create one) at the project root:

```bash
# walt.id Wallet API
NEXT_PUBLIC_WALLET_API_URL=http://localhost:7001

# fido-vc-middleware
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

Both env vars are prefixed `NEXT_PUBLIC_` so they're exposed to the browser at build time. Don't put secrets here — only public URLs.

## Run

```bash
# development with hot reload
npm run dev

# production build + serve
npm run build && npm start
```

The UI is served on port `3000` by default. Open <http://localhost:3000>.

## Routes

| Route | Purpose |
|---|---|
| `/login`, `/register` | Account auth (via walt.id Wallet API) |
| `/did` | DID list, "Add Key" (FIDO registration flow) |
| `/credentials` | Credential list, "Receive" and "Present" actions |

## Docker

A `Dockerfile` is provided. The recommended deployment uses the multi-service `docker-compose.yml` in the [waltid-identity fork](https://github.com/fido4vc/waltid-identity) under `waltid-applications/fido-vc-app/`, which starts the UI alongside the middleware, sidecar, and database.

## Related projects

Part of the [FIDO4VC project](https://github.com/fido4vc):

- [fido-vc-middleware](https://github.com/fido4vc/fido-vc-middleware) — the FIDO ceremony orchestrator this UI talks to.
- [fido-vc-cryptosuite-ts](https://github.com/fido4vc/fido-vc-cryptosuite-ts) — the underlying cryptosuite (used by the middleware, not by this UI directly).
- [waltid-identity fork](https://github.com/fido4vc/waltid-identity) — walt.id with FIDO4VC integration.

## License

Licensed under the [Apache License 2.0](./LICENSE).
