# Exact deployment walkthrough: Vercel + ARC Testnet

> **Risk notice:** This walkthrough uses ARC Testnet funds and a wallet private key for deployment. It is not financial advice, and the patched contracts remain unaudited. Use a dedicated Testnet deployer wallet only; never use a wallet that holds valuable assets or expose its private key in GitHub, Vercel, chat, or browser code.

## Part 1 — Apply and verify the patched release

Download `CoinSprint-production-patch.zip` and extract it over a fresh clone or into a new branch of your repository. The archive contains the patched contracts, deployment scripts, frontend, vendored browser libraries, lockfile, README, and production handoff. It intentionally excludes `node_modules`, generated deployment manifests, `frontend/config.js`, and secrets.

From the repository root, run:

```bash
npm ci
npm test
npm run build
```

All three commands must succeed before deployment. The integration suite should report checks for six-decimal USDC, HTTPS metadata, graduation retry after router failure, market assembly, holdings, trending, and search.

Commit and push the patched release to GitHub from a branch you control:

```bash
git checkout -b deploy/arc-testnet
# Copy the patched archive contents into this working tree if needed.
git status
git add .
git commit -m "Prepare CoinSprint ARC Testnet release"
git push -u origin deploy/arc-testnet
```

Do not commit `.env`, `compile-output.json`, `deployed-addresses.*.json`, or `frontend/config.js`. The repository’s `.gitignore` is configured to exclude them.

## Part 2 — Prepare ARC Testnet deployment inputs

ARC’s official documentation currently lists Testnet chain ID `5042002`, Circle’s primary Testnet RPC as `https://rpc.testnet.arc.io`, Testnet explorer as `https://testnet.arcscan.app`, and the Testnet ERC-20 USDC interface as `0x3600000000000000000000000000000000000000` with six decimals.[1] [2] [3]

Create a dedicated deployment wallet, export its private key only into a local protected environment, and fund it with ARC Testnet USDC from the official faucet or your approved Testnet funding path. Do not use your production wallet.

Copy the environment template:

```bash
cp .env.example .env
```

Edit `.env` with the following minimum values:

```dotenv
NETWORK=arc-testnet
PRIVATE_KEY=0xYOUR_DEDICATED_TESTNET_DEPLOYER_PRIVATE_KEY
RPC_URL=https://rpc.testnet.arc.io
ROUTER_ADDRESS=0xVERIFIED_ARC_TESTNET_DEX_ROUTER

PLATFORM_FEE_RECIPIENT=0x0000000000000000000000000000000000000000
PLATFORM_FEE_BPS=0
MAX_WALLET_BPS=200
INITIAL_VIRTUAL_USDC=3000
GRADUATION_THRESHOLD=1000
```

The router address is the one value this project deliberately does not guess. Obtain it from the selected DEX’s official ARC Testnet deployment documentation. It must implement `factory()` and the V2-style `addLiquidity(address,address,uint256,uint256,uint256,uint256,address,uint256)` interface used by the contract. Do not proceed with a router copied from an unverified social-media post or a different network.

Protect the environment file locally:

```bash
chmod 600 .env
```

## Part 3 — Deploy the contracts to ARC Testnet

Run the deployment script from the repository root:

```bash
npm run deploy:arc-testnet
```

The script will compile the contracts, verify the RPC-reported chain ID, require `PRIVATE_KEY`, verify the USDC contract has bytecode and supported decimals, verify the router has bytecode, call `router.factory()`, verify the returned factory has bytecode, deploy `LaunchpadFactory`, deploy `TokenMetadataRegistry`, and write `deployed-addresses.arc-testnet.json`.

If the script fails, do not bypass the check. Read the final `DEPLOY ERROR` line. Common causes are a missing private key, insufficient Testnet USDC, stale RPC endpoint, wrong chain ID, no code at the router address, or a router that does not expose the expected interface.

Immediately copy the deployment manifest into a private release record. It contains public addresses, not secrets:

```bash
cat deployed-addresses.arc-testnet.json
```

Record these values exactly:

| Manifest field | Used for |
| --- | --- |
| `launchpadFactory` | Frontend factory address. |
| `metadataRegistry` | Frontend metadata registry address. |
| `usdc` | Frontend USDC address; should match ARC’s official Testnet value. |
| `deploymentBlock` | Frontend bounded event-log starting block. |
| `chainId` | Must be `5042002`. |
| `rpc` | The RPC used by the deployment. |
| `router` | The verified DEX router used by graduation. |

Before moving to Vercel, independently inspect the factory with an explorer or RPC tool and confirm that `factory.usdc()` equals the manifest’s `usdc`, and that the factory has deployed bytecode.

## Part 4 — Create the Vercel project

In Vercel, choose **Add New → Project**, import the GitHub repository containing the patched release, and select the branch you want to deploy. Use the repository root as the project root. Do not set `frontend/` as the project root because the build script is located at the repository root.

The included `vercel.json` already specifies the static output directory and the frontend build command. If the Vercel dashboard displays overrides, use these values:

| Vercel setting | Value |
| --- | --- |
| Framework preset | `Other` or automatic detection. |
| Root directory | Repository root. |
| Build command | `npm run build:frontend` |
| Output directory | `frontend` |
| Install command | `npm ci` or Vercel’s default npm install command. |
| Node.js version | Node 18 or newer; Node 22 is recommended for parity with local validation. |

Do not place `PRIVATE_KEY`, `ROUTER_ADDRESS`, or any deployment-only secret into Vercel. The deployed frontend needs only public addresses and network metadata.

## Part 5 — Add Vercel Production environment variables

Open **Project Settings → Environment Variables** and add the following variables for the **Production** environment. Add them to Preview as well if you want preview deployments to point to the same Testnet contracts.

```dotenv
COINSPRINT_CHAIN_ID=5042002
COINSPRINT_CHAIN_NAME=Arc Testnet
COINSPRINT_RPC_URL=https://rpc.testnet.arc.io
COINSPRINT_EXPLORER_URL=https://testnet.arcscan.app
COINSPRINT_USDC_ADDRESS=0x3600000000000000000000000000000000000000
COINSPRINT_FACTORY_ADDRESS=0xYOUR_DEPLOYED_LAUNCHPAD_FACTORY
COINSPRINT_METADATA_REGISTRY_ADDRESS=0xYOUR_DEPLOYED_METADATA_REGISTRY
COINSPRINT_DEPLOYMENT_BLOCK=YOUR_FACTORY_DEPLOYMENT_BLOCK
```

Use the exact values from `deployed-addresses.arc-testnet.json` for the three deployment-specific variables. `COINSPRINT_DEPLOYMENT_BLOCK` must be a decimal integer, such as `150`; do not use hexadecimal notation.

If you choose an alternate approved RPC provider instead of Circle’s primary RPC, set `COINSPRINT_RPC_URL` to that HTTPS endpoint and update `vercel.json` so its Content Security Policy `connect-src` allowlist includes the provider hostname. Otherwise the browser will correctly block the alternate RPC.

Save the environment variables and trigger a new Production deployment. Vercel only injects changed environment variables into a new build; refreshing an old deployment is not sufficient.

## Part 6 — Verify the Vercel build before using the UI

Open the Vercel deployment URL and inspect the page source or browser Network panel. Confirm that these same-origin assets return HTTP 200:

```text
/config.js
/app.js
/vendor/ethers.umd.min.js
/vendor/chart.umd.js
```

Open `/config.js` directly in the browser and verify that it contains the intended Testnet chain, factory, registry, USDC address, and deployment block. It must not contain a private key.

The page should now show the factory address prefilled. It should no longer require the user to paste deployment addresses manually. The page should show the ARC Testnet network controls, and the **Add Arc Testnet to wallet** button should use `https://rpc.testnet.arc.io`.

## Part 7 — Connect a wallet and verify the wrong-network guard

Install or open a compatible EVM wallet with the dedicated Testnet account. First try connecting while the wallet is on the wrong network. The UI should show a wrong-network error and should not load the market or enable trading.

Click **Add Arc Testnet to wallet**, approve the wallet’s network-add request, switch to ARC Testnet, and click **Connect Wallet** again. The wallet should report chain ID `5042002`. The interface should then read the factory, verify its configured USDC address, read six USDC decimals, and load the market.

If the page still shows “NO WALLET CONNECTED,” check the browser console for a blocked RPC request, verify that Vercel redeployed after environment variables were added, and open `/config.js` to confirm the values are present.

## Part 8 — Controlled Testnet acceptance test

Use small Testnet amounts and two independent Testnet wallets. Complete these checks in order:

| Test | Expected result |
| --- | --- |
| Wallet on wrong chain | UI refuses reads and transactions. |
| Factory and USDC mismatch | Configuration fails with a clear error. |
| Launch with valid name/symbol | Wallet prompts, transaction confirms, and a token appears. |
| Launch with invalid or empty fields | UI refuses the request before signing. |
| Set HTTPS metadata | Metadata transaction succeeds and image/social links display. |
| Set non-HTTPS metadata | Contract rejects the transaction. |
| Buy with USDC | UI shows quote, allowance approval if needed, and buy confirmation. |
| Sell tokens | UI shows quote and sell confirmation without an unnecessary approval. |
| Invalid amount or slippage over 50% | UI rejects input without submitting a transaction. |
| Refresh page | Token state and activity reload from the bounded event range. |
| Trending sort | It uses buys inside the latest 24-hour window, not lifetime volume. |
| Router failure | Triggering buy succeeds but token remains ungraduated. |
| Router recovery | Permissionless `graduate()` succeeds and LP is burned. |

For each successful transaction, open the transaction in `https://testnet.arcscan.app` and record the transaction hash in the release test record. Confirm the event data, sender, token address, USDC amounts, and resulting balances.

## Part 9 — Final release checklist

Before inviting external Testnet users, verify that the deployment manifest, Vercel deployment URL, Git commit SHA, factory address, registry address, router address, deployment block, and acceptance-test transaction hashes are recorded together. Keep the Testnet private key out of the repository and Vercel.

Do not call this Mainnet-ready solely because Testnet tests pass. ARC’s official documentation currently states that Mainnet parameters are published separately when available, and the official contract-address page currently lists Testnet addresses while stating that Mainnet addresses are not yet available.[2] [3] The later Mainnet process must use `npm run deploy:arc-mainnet` with newly verified Mainnet RPC, chain ID, USDC, and DEX router values, plus an independent smart-contract audit and economic review.

## References

[1]: https://docs.arc.io/arc-chain "Arc Network — official network details"

[2]: https://docs.arc.io/arc/references/rpc-endpoints "Arc Docs — official RPC endpoints"

[3]: https://docs.arc.io/arc/references/contract-addresses "Arc Docs — official Testnet contract addresses"
