# CoinSprint

CoinSprint is a fair-launch token launchpad for ARC. `LaunchpadFactory` deploys EIP-1167 clones of `MemecoinBondingCurve`; each clone mints the fixed supply to itself, sells tokens against a USDC-denominated constant-product curve, and can graduate a portion of the supply and real USDC to a verified V2-style DEX router. `TokenMetadataRegistry` stores optional HTTPS-only image and social metadata separately from the money-handling contracts.

> **Important:** This repository is still unaudited. The changes in this handoff improve build reproducibility, network validation, input validation, indexing behavior, and local test coverage; they do not replace an independent smart-contract audit, economic review, operational controls, or legal review before real funds are accepted.

## Current ARC status and scope

The official ARC documentation currently describes Arc Testnet as chain ID `5042002`, with the EVM targeting the Osaka hard fork, USDC as the native gas asset, and the ERC-20 USDC interface using six decimals.[1] The official contract-address page lists the Testnet USDC interface as `0x3600000000000000000000000000000000000000` and states that Mainnet addresses are not yet available.[2]

Accordingly, this project treats **September 16, 2026 as the launch target supplied by the project owner, not as an independently verified Mainnet availability guarantee**. Do not deploy the Testnet factory or router configuration to Mainnet. The deployment script includes an explicit `arc-mainnet` mode, but it refuses to proceed until an official Mainnet RPC, chain ID, USDC address, and verified DEX router are supplied.

## What changed in this production patch

| Area | Change | Operational effect |
| --- | --- | --- |
| Build | Pinned `solc` to `0.8.24`, pinned dependencies, enabled the IR pipeline, and committed the lockfile. | Reproducible builds no longer depend on a floating compiler range. |
| EVM compatibility | Replaced `ReentrancyGuardTransient` with OpenZeppelin’s storage-based `ReentrancyGuard` and compile for Paris-compatible bytecode. | Removes the unnecessary EIP-1153/Cancun dependency from the contracts. |
| Contract validation | Added on-chain bounds for name, symbol, USDC decimals, virtual-reserve overflow, and factory parameters. | Invalid or unusable launches fail before funds can be traded. |
| Metadata security | The registry and UI accept HTTPS URLs only. | Reduces executable-scheme and ambiguous-link risks. |
| Deployment | Added chain-ID, bytecode, USDC-decimal, router-interface, private-key, and Mainnet-config checks. | Wrong-network or guessed-address deployments fail before gas is spent. |
| Frontend configuration | Added generated `frontend/config.js` support and a deployment-block field. | Public deployments can ship with verified addresses instead of manual copy/paste. |
| Frontend indexing | Added chunked log reads, bounded scans, and block timestamps for real 24-hour buy volume. | Avoids block-zero queries and corrects the former misleading trending label. |
| Transactions | Added strict decimal parsing and gas estimation with a 25% buffer. | Malformed input is rejected and hardcoded gas limits are removed. |
| Repository hygiene | Added `.gitignore`, `.env.example`, vendored browser bundles, Vercel headers, and regression tests. | Secrets and generated artifacts are less likely to leak into the repository. |

The static frontend is intentionally still a simple application, not a high-volume indexer. The current UI caps the market display at the most recent 60 launches and clearly states that older tokens require a production indexer. Before a public launch with material activity, add an indexed backend or subgraph and make it the authoritative source for markets, activity, timestamps, and pagination.

## Requirements

Use Node.js 18 or newer, npm, a deployer wallet funded with ARC Testnet USDC for gas and application tests, and a DEX router whose address and ABI have been verified from the DEX’s official ARC deployment documentation. Do not use a browser wallet private key in `.env`, and do not deploy `contracts/test/Mocks.sol` outside a local Hardhat node.

## Deterministic installation and build

```bash
git clone https://github.com/rajaryan90/CoinSprint.git
cd CoinSprint
npm ci
npm run compile
```

`npm run compile` writes the ignored `compile-output.json` artifact consumed by the deployment and test scripts. `npm run build` compiles the contracts and generates the public frontend manifest. The manifest contains only public network and contract addresses; it must never contain `PRIVATE_KEY` or any other secret.

## Local test procedure

Start the local JSON-RPC node in one terminal and execute the integration suite in another terminal:

```bash
npm run node
```

```bash
npm test
```

The suite covers launch and market assembly, metadata reads, search and holdings behavior, six-decimal ARC-style USDC normalization, and rejection of non-HTTPS metadata. For a local deployment manifest, run `npm run deploy:local`; the generated `deployed-addresses.local.json` includes the factory deployment block used by the bounded frontend log scans.

## ARC Testnet deployment

Create a private environment file from the template and fill only the values that you have independently verified:

```bash
cp .env.example .env
```

Set `NETWORK=arc-testnet`, `PRIVATE_KEY`, and `ROUTER_ADDRESS`. The script uses ARC’s official Testnet RPC and Testnet USDC address, checks that the RPC reports chain ID `5042002`, verifies that the USDC contract has bytecode and six decimals, probes the router’s `factory()` method, and verifies that the router factory has code before deploying.

```bash
npm run deploy:arc-testnet
```

Record the resulting `deployed-addresses.arc-testnet.json` in a secure release artifact or a separate deployment-record repository. It contains public addresses and the factory deployment block, but it is generated and ignored by this repository by default. Never commit `.env` or any private key.

The `ROUTER_ADDRESS` value is deliberately not guessed. A wrong router can prevent graduation or route liquidity into an unintended contract. A verified router must implement the exact `factory()` and `addLiquidity(...)` interface used by `MemecoinBondingCurve`, and the chosen DEX’s behavior, token ordering, pair creation, minimum amounts, deadlines, and LP-token semantics must be tested against ARC Testnet before any public launch.

## Frontend build and Vercel deployment

The Vercel configuration publishes the `frontend/` directory, runs `npm run build:frontend`, and applies basic security headers. Configure the following Vercel **Environment Variables** for the Production environment:

| Variable | Required value |
| --- | --- |
| `COINSPRINT_CHAIN_ID` | `5042002` for ARC Testnet. |
| `COINSPRINT_CHAIN_NAME` | `Arc Testnet`. |
| `COINSPRINT_RPC_URL` | `https://rpc.testnet.arc.io`, or an approved production RPC endpoint. |
| `COINSPRINT_EXPLORER_URL` | `https://testnet.arcscan.app`. |
| `COINSPRINT_USDC_ADDRESS` | `0x3600000000000000000000000000000000000000`. |
| `COINSPRINT_FACTORY_ADDRESS` | The factory address from `deployed-addresses.arc-testnet.json`. |
| `COINSPRINT_METADATA_REGISTRY_ADDRESS` | The registry address from the same manifest, or blank. |
| `COINSPRINT_DEPLOYMENT_BLOCK` | The `deploymentBlock` value from the manifest. |

Connect the repository to Vercel with the included `vercel.json`, or deploy from the command line after installing the Vercel CLI:

```bash
npm run build:frontend
npx vercel --prod
```

If you use the Vercel dashboard, set the project root to the repository root and leave the output directory as configured by `vercel.json`. The build output must contain `frontend/config.js` and the `frontend/vendor/` bundles. After deployment, verify that the site opens with the correct factory already filled in, displays the expected network, and does not require users to paste deployment addresses manually.

Netlify can publish the same `frontend/` directory, but its build command must also run `npm run build:frontend` with the same public variables. Any alternative static host must serve `frontend/config.js`, `frontend/vendor/ethers.umd.min.js`, and `frontend/vendor/chart.umd.js` from the same origin as `frontend/index.html`.

## Testnet acceptance checklist

Before inviting external users, perform a controlled acceptance test with at least two independent wallets. Confirm that the wallet switches to chain ID `5042002`, that the factory reports the configured USDC address, that USDC decimals are six, and that the UI refuses to operate on a wrong chain.

Launch a token, set HTTPS metadata, buy with a small amount, sell a portion, refresh the page, and verify the resulting balances and event activity in the official explorer. Test invalid decimal input, slippage bounds, insufficient allowance, a rejected transaction, a wrong factory address, and an empty registry address. Verify that a large market does not cause the UI to issue a block-zero query and that the “Trending (24h volume)” ranking changes only when trades fall inside the latest 24-hour window.

For graduation, use a dedicated testnet factory and a DEX router test plan. Confirm pair creation, the actual amounts added, LP-token receipt, LP burn, the post-graduation state, and behavior when the router reverts. The contract must not brick future buys when a graduation attempt fails; graduation should be retried only after the router-side cause has been diagnosed.

## Mainnet migration runbook

Do not treat a date on a project schedule as proof that a network or DEX is live. Before the September 16, 2026 target, obtain and archive official ARC Mainnet documentation that confirms the chain ID, RPC, explorer, USDC interface, EVM baseline, gas rules, and deployed contract addresses. Obtain independent DEX documentation that confirms the exact router, factory, pair, and LP-token behavior on Mainnet.

Create a new Mainnet deployment rather than changing an existing factory. The factory’s parameters are immutable by design, and tokens already launched on Testnet cannot be “migrated” by changing a frontend variable. Complete the following gates in order:

| Gate | Required evidence |
| --- | --- |
| Network | Official ARC Mainnet chain ID, RPC, explorer, and contract-address page. |
| Token | Official Mainnet USDC address and a live `decimals()` result matching the intended application units. |
| EVM | Successful deployment and buy/sell tests against the actual ARC Mainnet RPC or an official Mainnet fork/test environment. |
| DEX | Official router and factory addresses, successful pair creation, add-liquidity semantics, and LP-burn verification. |
| Security | Independent audit of the contracts, economic model, frontend signing flow, and deployment process; all findings resolved or explicitly accepted. |
| Operations | Release owner, signer controls, monitoring, incident communication, verified source publication, and a tested rollback or shutdown communication plan. |

Only after every gate passes should you populate `ARC_MAINNET_RPC_URL`, `ARC_MAINNET_CHAIN_ID`, and `ARC_MAINNET_USDC_ADDRESS` in a protected deployment environment, set `NETWORK=arc-mainnet`, set the verified `ROUTER_ADDRESS`, and run:

```bash
npm run deploy:arc-mainnet
```

The dedicated command prevents an environment variable from being accidentally overridden by the Testnet script and keeps the two release paths visibly separate. Before publishing the Mainnet frontend, replace the Testnet public variables with the official Mainnet values and deploy a new Vercel Production release. Do not point a Mainnet UI at a Testnet factory or vice versa.

## Known limitations and follow-up work

The contracts have no owner, pause, mint, or upgrade path after deployment, which limits administrative rug vectors but also means a deployed bug cannot be patched in place. The bonding curve and graduation mechanism remain unaudited and should not be marketed as safe merely because the UI displays a security scorecard.

The static frontend still reads per-token state directly from an RPC and only loads a bounded recent window. A production launchpad should add an indexed service with pagination, server-side rate limits, cached block timestamps, RPC failover, monitoring, and a clear data-reconciliation policy. It should also verify contract source and publish immutable release records for every factory and registry.

## References

[1]: https://docs.arc.io/arc-chain "Arc Network — official network details"

[2]: https://docs.arc.io/arc/references/contract-addresses "Arc Docs — official Testnet contract addresses"

[3]: https://docs.arc.io/arc/references/evm-differences "Arc Docs — official EVM differences and USDC interface behavior"

[4]: https://docs.arc.io/arc/references/rpc-endpoints "Arc Docs — official RPC endpoints"
