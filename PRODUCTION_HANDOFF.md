# CoinSprint Production Handoff

**Prepared:** August 16, 2026  
**Repository:** `rajaryan90/CoinSprint`  
**Scope:** ARC Testnet launchpad hardening and Mainnet migration preparation

## Executive assessment

The original project is a promising reference implementation, but it was not production-ready when audited. The live Vercel site loaded successfully yet opened with no configured factory and required users to paste deployment addresses manually. The repository also failed its own compile step with the floating Solidity dependency range, used an outdated ARC RPC hostname, relied on Cancun-only transient-storage reentrancy protection despite ARC documenting an Osaka execution baseline, scanned logs from block zero, and labeled lifetime buy volume as “Trending (24h volume).”

The supplied patch resolves the reproducible build, configuration, frontend, indexing, metadata, and test-harness issues described below. It does **not** make the unaudited financial contracts safe for mainnet funds. A third-party security audit, economic review, verified DEX deployment, and controlled Testnet acceptance test remain mandatory release gates.

## Changes applied

| Component | Applied change | Why it matters |
| --- | --- | --- |
| `scripts/compile.mjs` | Pinned compiler workflow, enabled the IR pipeline, and targeted Paris-compatible bytecode. | Fixes the original “Stack too deep” build failure and removes unnecessary Cancun dependence. |
| `contracts/MemecoinBondingCurve.sol` | Replaced `ReentrancyGuardTransient` with storage-based `ReentrancyGuard`; added name/symbol bounds, invariant overflow guard, and supported-decimal validation. | Aligns with ARC’s documented Osaka baseline and rejects malformed or unusable launches on-chain. |
| `contracts/LaunchpadFactory.sol` | Added constructor-time reserve and threshold validation. | Invalid factory defaults fail before a broken factory can be deployed. |
| `contracts/TokenMetadataRegistry.sol` | Added HTTPS-only URL validation. | Prevents executable or ambiguous schemes from being stored as official token metadata. |
| `scripts/deploy.mjs` | Added explicit `arc-mainnet` mode, chain and bytecode checks, USDC decimal checks, router ABI probe, private-key fail-fast behavior, and `deploymentBlock` output. | Reduces wrong-network, wrong-token, guessed-router, and incomplete-configuration deployment risk. |
| `frontend/index.html` and `frontend/app.js` | Added generated public config, chain enforcement, factory/USDC consistency checks, bounded chunked log reads, timestamp-based 24-hour volume, input validation, safe HTTPS links, and estimate-based gas limits. | Fixes the live onboarding problem, avoids block-zero RPC scans, corrects analytics, and improves transaction reliability. |
| `frontend/vendor/` | Vendored pinned ethers and Chart.js browser bundles. | Removes runtime dependence on mutable CDN JavaScript responses. |
| `vercel.json` and `netlify.toml` | Added build commands and security headers. | Makes static hosting reproduce the public configuration and apply baseline browser protections. |
| Tests and repository files | Added a lockfile, `.env.example`, `.gitignore`, six-decimal USDC coverage, HTTPS metadata coverage, and graduation-retry coverage. | Makes setup reproducible and covers ARC-specific and previously untested failure paths. |

## Verification completed

The patched repository passed the following checks in a clean-install environment:

| Check | Result |
| --- | --- |
| `npm ci` | Passed. |
| `npm run build` | Passed; Solidity artifacts and public frontend config generated. |
| `node --check frontend/app.js` | Passed. |
| `python3 -m json.tool package.json` | Passed. |
| `python3 -m json.tool vercel.json` | Passed. |
| `git diff --check` | Passed. |
| `npm test` against Hardhat | Passed. |
| Six-decimal USDC regression | Passed. |
| Non-HTTPS metadata rejection | Passed. |
| Router failure followed by permissionless graduation retry | Passed. |
| Missing Testnet private-key fail-fast | Passed. |
| Locked Mainnet configuration fail-fast | Passed. |

The repository was not pushed to GitHub, and the Vercel deployment was not modified. The attached patched archive is a local release candidate for your review and commit/deploy process.

## ARC facts used by the patch

ARC’s official network documentation currently lists Testnet chain ID `5042002`, USDC as the gas token, and the EVM targeting the Osaka hard fork.[1] ARC’s current RPC reference lists Circle’s primary Testnet HTTP endpoint as `https://rpc.testnet.arc.io`; the original repository used the stale `https://rpc.testnet.arc.network` hostname.[2] ARC’s official contract-address page lists the Testnet ERC-20 USDC interface as `0x3600000000000000000000000000000000000000` with six decimals and states that Mainnet addresses are not yet available.[3]

> “The values on this page apply to the Arc Testnet. Mainnet endpoints and parameters are published separately when available.” — ARC RPC documentation.[2]

For this reason, September 16, 2026 is recorded as the project’s target date, not as a currently verified ARC Mainnet availability date. Do not place a Mainnet deployment behind a date-based assumption.

## Exact Testnet release procedure

First review the patched code and install with the lockfile:

```bash
git clone https://github.com/rajaryan90/CoinSprint.git
cd CoinSprint
npm ci
npm test
```

Next create a protected deployment environment:

```bash
cp .env.example .env
```

Set `NETWORK=arc-testnet`, a dedicated deployment `PRIVATE_KEY`, and a `ROUTER_ADDRESS` obtained from the selected DEX’s official ARC Testnet deployment documentation. Do not guess the router. Run:

```bash
npm run deploy:arc-testnet
```

The script checks the RPC-reported chain ID, USDC contract code and decimals, router code, and router `factory()` response before deploying `LaunchpadFactory` and `TokenMetadataRegistry`. Save the resulting `deployed-addresses.arc-testnet.json` in the release record. In particular, preserve `deploymentBlock` for the frontend.

For Vercel, set the following Production environment variables and redeploy:

| Variable | Testnet value |
| --- | --- |
| `COINSPRINT_CHAIN_ID` | `5042002` |
| `COINSPRINT_CHAIN_NAME` | `Arc Testnet` |
| `COINSPRINT_RPC_URL` | `https://rpc.testnet.arc.io` |
| `COINSPRINT_EXPLORER_URL` | `https://testnet.arcscan.app` |
| `COINSPRINT_USDC_ADDRESS` | `0x3600000000000000000000000000000000000000` |
| `COINSPRINT_FACTORY_ADDRESS` | Deployed factory address |
| `COINSPRINT_METADATA_REGISTRY_ADDRESS` | Deployed registry address, or blank |
| `COINSPRINT_DEPLOYMENT_BLOCK` | `deploymentBlock` from the deployment manifest |

Vercel should use the repository root, the included `vercel.json`, and the generated `frontend/` output. After deployment, confirm that `frontend/config.js` contains the expected public addresses, the site opens with the factory already filled in, and the wallet-add flow displays chain ID `5042002` and `https://rpc.testnet.arc.io`.

## Acceptance test before public use

Use two independent test wallets. Confirm network enforcement, factory/USDC address matching, six-decimal USDC formatting, token launch, HTTPS metadata, approval, buy, sell, refresh, activity history, chart rendering, 24-hour trending behavior, and the wrong-network error state. Exercise invalid numeric input, slippage above 50%, insufficient allowance, wrong factory address, blank registry address, and a rejected wallet transaction.

Test graduation separately with the exact DEX router. Confirm that the router creates the expected pair, adds the intended token and USDC amounts, returns LP tokens to the curve, and that the LP tokens are sent to the burn address. Force the router to revert in a controlled Testnet environment and confirm that the triggering buy succeeds, the token remains ungraduated, and a later `graduate()` call succeeds after the router recovers.

## Mainnet go/no-go gates

A Mainnet deployment must be a new deployment. Do not repoint an existing Testnet factory, and do not imply that Testnet tokens can be upgraded by changing frontend configuration. The factory and each curve clone are intentionally immutable in their financial parameters.

| Gate | Must be completed before Mainnet deployment |
| --- | --- |
| Official network data | ARC publishes official Mainnet chain ID, RPC, explorer, EVM baseline, and contract addresses. |
| Stablecoin verification | Mainnet USDC address is official and `decimals()` is verified from the live contract. |
| DEX verification | Mainnet router, factory, pair, minimum amounts, deadline behavior, and LP semantics are documented and tested. |
| Smart-contract security | Independent audit and economic review are complete, with findings resolved or explicitly accepted. |
| Frontend security | Signing flow, CSP, metadata policy, RPC failover, phishing UX, and error handling are reviewed. |
| Operations | Signer custody, release approvals, monitoring, incident communications, source verification, and immutable deployment records are in place. |

Only after these gates pass should you set `ARC_MAINNET_RPC_URL`, `ARC_MAINNET_CHAIN_ID`, `ARC_MAINNET_USDC_ADDRESS`, and the verified `ROUTER_ADDRESS`, then run:

```bash
npm run deploy:arc-mainnet
```

The script intentionally refuses to run with missing Mainnet values. Build a separate Mainnet frontend release with Mainnet public variables; do not reuse a Testnet `config.js`.

## Remaining production limitations

The static frontend still reads per-token state directly from RPC and caps the visible market at the most recent 60 launches. That is acceptable for a controlled Testnet beta but not for a high-volume public launch. Before material activity, implement an indexed backend or subgraph with pagination, RPC failover, cached timestamps, monitoring, and reconciliation against on-chain events.

The contracts remain unaudited, and no deployment can honestly be described as “production safe” until the financial logic and graduation integration have been independently reviewed. Because the deployed contracts have no owner, pause, or upgrade path, a post-deployment bug requires a new factory and a new release rather than an administrative patch.

## References

[1]: https://docs.arc.io/arc-chain "Arc Network — official network details"

[2]: https://docs.arc.io/arc/references/rpc-endpoints "Arc Docs — official RPC endpoints"

[3]: https://docs.arc.io/arc/references/contract-addresses "Arc Docs — official Testnet contract addresses"

[4]: https://docs.arc.io/arc/references/evm-differences "Arc Docs — official EVM differences"
