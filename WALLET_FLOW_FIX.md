# Wallet and Vercel configuration fix

The deployed page had two independent issues. First, the original code assumed one global `window.ethereum` provider, which made the experience appear limited to whichever wallet injected that object first. Second, the Vercel build generated a blank `frontend/config.js` when `COINSPRINT_FACTORY_ADDRESS` and `COINSPRINT_DEPLOYMENT_BLOCK` were missing, so the page correctly refused to load the market.

The patched release now discovers wallets through **EIP-6963** and falls back to legacy EIP-1193 injection. Wallets that advertise EIP-6963, including modern MetaMask, Rabby, Coinbase Wallet, Brave Wallet, Trust Wallet, OKX Wallet, and other compatible providers, can appear in the wallet selector without hard-coding vendor names. A selected provider is used for account access, ARC Testnet switching, transactions, account events, and chain events.

This is still browser-provider support, not WalletConnect. A wallet that does not inject an EIP-1193 provider into the current browser, such as many ordinary mobile-wallet sessions, requires a WalletConnect/Reown integration and project ID. That is a separate connector integration and should not be simulated by adding a wallet name to the UI.

## Vercel configuration guard

The Vercel build now fails early with a precise error if either the factory address or deployment block is missing. This prevents publishing a blank read-only site. Configure these Production environment variables before redeploying:

```text
COINSPRINT_CHAIN_ID=5042002
COINSPRINT_CHAIN_NAME=Arc Testnet
COINSPRINT_RPC_URL=https://rpc.testnet.arc.io
COINSPRINT_EXPLORER_URL=https://testnet.arcscan.app
COINSPRINT_USDC_ADDRESS=0x3600000000000000000000000000000000000000
COINSPRINT_FACTORY_ADDRESS=<deployed factory address>
COINSPRINT_METADATA_REGISTRY_ADDRESS=<deployed registry address or blank>
COINSPRINT_DEPLOYMENT_BLOCK=<factory deployment block as decimal integer>
```

Use the values from `deployed-addresses.arc-testnet.json`. The factory address must be a 40-hex-character address, and the deployment block must be decimal, such as `150`.

## Deploy the fix

From a complete local clone of `rajaryan90/Coinsprintnew`, run:

```bash
npm ci
npm run build:frontend
node --check frontend/app.js
git add frontend/index.html frontend/app.js scripts/build-frontend-config.mjs WALLET_FLOW_FIX.md
git commit -m "Support multiple browser wallets and require Vercel deployment config"
git push origin main
```

After pushing, open the new Vercel deployment. The build must succeed; if it fails with `COINSPRINT_FACTORY_ADDRESS must be set`, add the variables above under **Vercel Project Settings → Environment Variables → Production**, then redeploy. Do not upload `node_modules`.

## Test wallet discovery

Install two EIP-6963-compatible browser wallets, reload the site, and confirm that the wallet selector appears with both providers. Choose one provider and click **Connect Wallet**. The site should request account access from the selected provider, request ARC Testnet switching or adding when necessary, and then load the market after the configured factory is validated.

Reload the page and confirm that the previously approved provider/account reconnects using `eth_accounts` without opening a new account prompt. Change accounts or chains in the selected wallet and verify the UI updates without a forced page reload.

For a non-injected mobile wallet, use its in-app browser if it exposes an EIP-1193 provider. Otherwise, add a dedicated WalletConnect/Reown integration before claiming support for that wallet.

## Preview verification

The local browser preview rendered the new hero card, three quick-stat tiles, responsive settings surface, wallet provider selector, and configuration-status message. The provider selector deduplicated the detected providers to Rabby Wallet, OKX Wallet, MetaMask, Phantom, and Backpack rather than showing Backpack three times.
