(function () {
  "use strict";

  const FACTORY_ABI = [{"inputs":[{"internalType":"address","name":"usdc_","type":"address"},{"internalType":"address","name":"router_","type":"address"},{"internalType":"uint256","name":"defaultInitialVirtualUsdc_","type":"uint256"},{"internalType":"uint256","name":"defaultGraduationThreshold_","type":"uint256"},{"internalType":"address","name":"platformFeeRecipient_","type":"address"},{"internalType":"uint256","name":"platformFeeBps_","type":"uint256"},{"internalType":"uint256","name":"defaultMaxWalletBps_","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"FailedDeployment","type":"error"},{"inputs":[{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"InsufficientBalance","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":true,"internalType":"address","name":"creator","type":"address"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"string","name":"symbol","type":"string"}],"name":"TokenLaunched","type":"event"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allTokens","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"allTokensLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"}],"name":"createToken","outputs":[{"internalType":"address","name":"token","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"defaultGraduationThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"defaultInitialVirtualUsdc","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"defaultMaxWalletBps","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"implementation","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"platformFeeBps","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"platformFeeRecipient","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"router","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"usdc","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}];

  const CURVE_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"inputs":[],"name":"InvalidInitialization","type":"error"},{"inputs":[],"name":"NotInitializing","type":"error"},{"inputs":[],"name":"ReentrancyGuardReentrantCall","type":"error"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"SafeERC20FailedOperation","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"usdcIn","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"tokensOut","type":"uint256"}],"name":"Buy","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"pair","type":"address"},{"indexed":false,"internalType":"uint256","name":"usdcToLiquidity","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"tokensToLiquidity","type":"uint256"}],"name":"Graduated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint64","name":"version","type":"uint64"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"seller","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokensIn","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"usdcOut","type":"uint256"}],"name":"Sell","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"BURN_ADDRESS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"CURVE_SUPPLY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"LIQUIDITY_SUPPLY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TOTAL_SUPPLY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TRADE_FEE_BPS","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"usdcIn","type":"uint256"},{"internalType":"uint256","name":"minTokensOut","type":"uint256"}],"name":"buy","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"creator","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"currentPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"graduate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"graduated","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"graduationThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"},{"internalType":"address","name":"usdc_","type":"address"},{"internalType":"address","name":"router_","type":"address"},{"internalType":"address","name":"creator_","type":"address"},{"internalType":"uint256","name":"initialVirtualUsdc_","type":"uint256"},{"internalType":"uint256","name":"graduationThreshold_","type":"uint256"},{"internalType":"address","name":"platformFeeRecipient_","type":"address"},{"internalType":"uint256","name":"platformFeeBps_","type":"uint256"},{"internalType":"uint256","name":"maxWalletBps_","type":"uint256"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"k","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxWalletBps","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"platformFeeBps","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"platformFeeRecipient","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"realUsdcReserve","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"router","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokensIn","type":"uint256"},{"internalType":"uint256","name":"minUsdcOut","type":"uint256"}],"name":"sell","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"usdc","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"usdcDecimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"virtualTokenReserve","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"virtualUsdcReserve","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];

  const REGISTRY_ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":true,"internalType":"address","name":"creator","type":"address"}],"name":"MetadataUpdated","type":"event"},{"inputs":[],"name":"MAX_DESCRIPTION_LENGTH","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_URL_LENGTH","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"getMetadata","outputs":[{"components":[{"internalType":"string","name":"imageUrl","type":"string"},{"internalType":"string","name":"twitter","type":"string"},{"internalType":"string","name":"telegram","type":"string"},{"internalType":"string","name":"website","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"bool","name":"isSet","type":"bool"}],"internalType":"struct TokenMetadataRegistry.Metadata","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"metadata","outputs":[{"internalType":"string","name":"imageUrl","type":"string"},{"internalType":"string","name":"twitter","type":"string"},{"internalType":"string","name":"telegram","type":"string"},{"internalType":"string","name":"website","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"bool","name":"isSet","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"string","name":"imageUrl","type":"string"},{"internalType":"string","name":"twitter","type":"string"},{"internalType":"string","name":"telegram","type":"string"},{"internalType":"string","name":"website","type":"string"},{"internalType":"string","name":"description","type":"string"}],"name":"setMetadata","outputs":[],"stateMutability":"nonpayable","type":"function"}];

  const ERC20_MIN_ABI = [
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function balanceOf(address) view returns (uint256)",
    "function allowance(address,address) view returns (uint256)",
    "function approve(address,uint256) returns (bool)"
  ];

  const BURN_ADDRESS = "0x000000000000000000000000000000000000dEaD";
  const PUBLIC_CONFIG = {
    chainId: "5042002",
    chainName: "Arc Testnet",
    rpcUrl: "https://rpc.testnet.arc.io",
    explorerUrl: "https://testnet.arcscan.app",
    usdcAddress: "0x3600000000000000000000000000000000000000",
    factoryAddress: "",
    metadataRegistryAddress: "",
    deploymentBlock: "",
    ...(window.COINSPRINT_CONFIG || {}),
  };

  // ---------------- state ----------------
  const state = {
    provider: null,
    signer: null,
    address: null,
    chainId: null,
    expectedChainId: null,
    factory: null,
    usdc: null,
    registry: null,
    usdcDecimals: 18,
    tokens: [],          // [{address, name, symbol, price, raised, threshold, graduated}]
    selected: null,       // address of selected token
    selectedCurve: null,  // ethers contract for selected token
    selectedListener: null,
    chart: null,
    deploymentBlock: null,
    blockTimestampCache: new Map(),
    blockTimestampInFlight: new Map(),
    readProvider: null,
    marketLoadPromise: null,
    walletProvider: null,
    walletProviders: [],
    selectedWalletId: "",
    walletEventsBound: false,
    walletEventsProvider: null,
    walletDiscoveryBound: false,
    walletDiscoveryPromise: null,
    connecting: false,
  };

  // ---------------- utils ----------------
  const $ = (id) => document.getElementById(id);

  function short(addr) {
    return addr ? addr.slice(0, 6) + "…" + addr.slice(-4) : "";
  }

  function fmtNumber(n, maxDp = 4) {
    if (n === null || n === undefined || Number.isNaN(n)) return "—";
    if (n === 0) return "0";
    const abs = Math.abs(n);
    if (abs >= 1) return n.toLocaleString(undefined, { maximumFractionDigits: maxDp });
    const exp = Math.floor(Math.log10(abs));
    const dp = Math.min(18, Math.max(maxDp, -exp + 2));
    return n.toFixed(dp).replace(/0+$/, "").replace(/\.$/, "");
  }

  function bigToNumber(big, decimals) {
    return Number(ethers.formatUnits(big, decimals));
  }

  function banner(el, kind, msg) {
    el.className = "banner show " + kind;
    el.textContent = msg;
  }
  function clearBanner(el) {
    el.className = "banner";
    el.textContent = "";
  }

  function updateProtocolTerminal() {
    const tokenCount = Number.isSafeInteger(state.marketTotalCount) ? state.marketTotalCount : state.tokens.length;
    const indexedRaise = state.tokens.reduce((sum, token) => sum + (Number(token.raised) || 0), 0);
    const countLabel = String(tokenCount).padStart(2, "0");
    if ($("heroTokenCount")) $("heroTokenCount").textContent = countLabel;
    if ($("heroFactoryRaise")) $("heroFactoryRaise").textContent = fmtNumber(indexedRaise, 0);
    if ($("heroTerminalStatus")) $("heroTerminalStatus").textContent = "market configuration verified";
    if ($("heroTerminalIndex")) $("heroTerminalIndex").textContent = `${countLabel} token${tokenCount === 1 ? "" : "s"} indexed from allTokens()`;
    if ($("heroTerminalNote")) $("heroTerminalNote").textContent = state.marketTruncated ? "latest market window loaded" : "full token index in view";
  }

  // Mirrors MemecoinBondingCurve.buy()/sell() exactly, in BigInt, so the
  // UI can quote before sending — including the exact same truncating
  // integer division Solidity uses. Never approximate this with floats.
  function simulateBuy(usdcIn, vUsdc, vToken, k, feeBps) {
    const fee = (usdcIn * feeBps) / 10000n;
    const usdcInAfterFee = usdcIn - fee;
    const newVUsdc = vUsdc + usdcInAfterFee;
    const newVToken = k / newVUsdc;
    const tokensOut = vToken - newVToken;
    return { tokensOut, fee };
  }
  function simulateSell(tokensIn, vUsdc, vToken, k, feeBps) {
    const newVToken = vToken + tokensIn;
    const newVUsdc = k / newVToken;
    const usdcOutBeforeFee = vUsdc - newVUsdc;
    const fee = (usdcOutBeforeFee * feeBps) / 10000n;
    const usdcOut = usdcOutBeforeFee - fee;
    return { usdcOut, fee };
  }

  function slippageBps(pctStr) {
    const pct = Number(pctStr);
    if (!Number.isFinite(pct) || pct < 0 || pct > 50) throw new Error("slippage must be between 0 and 50 percent");
    return BigInt(Math.round(pct * 100));
  }

  function applySlippage(amount, pctStr) {
    const bps = slippageBps(pctStr);
    return (amount * (10000n - bps)) / 10000n;
  }

  function parsePositiveUnits(raw, decimals, label) {
    const normalized = String(raw ?? "").trim().replace(/,/g, "");
    if (!/^\d+(?:\.\d+)?$/.test(normalized)) throw new Error(`${label} must be a plain decimal number`);
    const amount = ethers.parseUnits(normalized, decimals);
    if (amount <= 0n) throw new Error(`${label} must be greater than zero`);
    return amount;
  }

  async function bufferedGasLimit(contract, method, args) {
    const estimate = await contract[method].estimateGas(...args);
    return (estimate * 125n) / 100n;
  }

  function walletDisplayName(info, fallback = "Browser wallet") {
    return String(info?.name || fallback).trim() || fallback;
  }

  function rememberWalletProvider(info, provider) {
    if (!provider) return;
    const normalizedInfo = info || { name: "Browser wallet" };
    const key = String(normalizedInfo.rdns || normalizedInfo.name || "injected").trim().toLowerCase();
    const existing = state.walletProviders.find((entry) => entry.key === key);
    if (existing) {
      // Some extensions announce the same wallet through multiple provider
      // objects. Keep one user-facing option per wallet identity.
      if (existing.info.name === "Browser wallet" && normalizedInfo.name) existing.info = normalizedInfo;
      if (!existing.provider?.request && provider.request) existing.provider = provider;
      renderWalletOptions();
      return;
    }
    const id = key || `injected-${state.walletProviders.length + 1}`;
    state.walletProviders.push({ id, key, info: normalizedInfo, provider });
    if (!state.selectedWalletId) state.selectedWalletId = id;
    renderWalletOptions();
  }

  function renderWalletOptions() {
    const select = $("walletSelect");
    if (!select) return;
    select.innerHTML = "";
    for (const entry of state.walletProviders) {
      const option = document.createElement("option");
      option.value = entry.id;
      option.textContent = walletDisplayName(entry.info);
      select.appendChild(option);
    }
    select.value = state.selectedWalletId;
    select.hidden = Boolean(state.address) || state.walletProviders.length < 2;
  }

  function selectedWalletEntry() {
    return state.walletProviders.find((entry) => entry.id === state.selectedWalletId) || state.walletProviders[0] || null;
  }

  async function discoverWallets() {
    if (state.walletDiscoveryPromise) return state.walletDiscoveryPromise;
    state.walletDiscoveryPromise = (async () => {
      if (!state.walletDiscoveryBound) {
        state.walletDiscoveryBound = true;
        window.addEventListener("eip6963:announceProvider", (event) => {
          rememberWalletProvider(event.detail?.info, event.detail?.provider);
        });
        window.dispatchEvent(new Event("eip6963:requestProvider"));
      }
      // Give installed extensions time to announce. Only use the legacy
      // global if no EIP-6963 wallet announced, avoiding duplicate entries.
      await new Promise((resolve) => window.setTimeout(resolve, 250));
      if (!state.walletProviders.length && window.ethereum) {
        rememberWalletProvider({ name: "Browser wallet", rdns: "legacy.injected" }, window.ethereum);
      }
      return state.walletProviders;
    })();
    return state.walletDiscoveryPromise;
  }

  async function findConnectedWallet() {
    await discoverWallets();
    for (const entry of state.walletProviders) {
      try {
        const accounts = await entry.provider.request({ method: "eth_accounts" });
        if (accounts?.length) {
          state.selectedWalletId = entry.id;
          state.walletProvider = entry.provider;
          renderWalletOptions();
          return entry.provider;
        }
      } catch { /* one provider may be unavailable; continue to the next */ }
    }
    return null;
  }

  async function chooseWalletProvider({ requireAccount = false } = {}) {
    await discoverWallets();
    let entry = selectedWalletEntry();
    if (requireAccount && state.walletProviders.length > 1 && !entry) return null;
    if (!entry && window.ethereum) {
      rememberWalletProvider({ uuid: "legacy-injected", name: "Browser wallet", rdns: "legacy.injected" }, window.ethereum);
      entry = selectedWalletEntry();
    }
    if (!entry) return null;
    state.selectedWalletId = entry.id;
    state.walletProvider = entry.provider;
    renderWalletOptions();
    return entry.provider;
  }

  function expectedChainId() {
    const chainId = BigInt(String(PUBLIC_CONFIG.chainId));
    if (chainId <= 0n) throw new Error("Invalid public chain configuration.");
    return chainId;
  }

  function onExpectedChain() {
    return state.chainId !== null && state.chainId === state.expectedChainId;
  }

  function requireExpectedChain() {
    if (!onExpectedChain()) {
      banner($("networkBanner"), "error", `WRONG NETWORK — switch your wallet to ${PUBLIC_CONFIG.chainName} (chain ${PUBLIC_CONFIG.chainId}) before reading or signing.`);
      return false;
    }
    return true;
  }

  function chainIdHex() {
    return "0x" + expectedChainId().toString(16);
  }

  function walletErrorMessage(error) {
    return error?.shortMessage || error?.data?.message || error?.message || String(error);
  }

  async function switchOrAddArcNetwork() {
    const provider = state.walletProvider || await chooseWalletProvider();
    if (!provider) throw new Error("No compatible browser wallet provider was detected.");
    const targetChainId = chainIdHex();
    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: targetChainId }],
      });
    } catch (error) {
      const errorCode = Number(error?.code);
      if (errorCode !== 4902) throw error;
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: targetChainId,
          chainName: PUBLIC_CONFIG.chainName,
          nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
          rpcUrls: [PUBLIC_CONFIG.rpcUrl],
          blockExplorerUrls: [PUBLIC_CONFIG.explorerUrl],
        }],
      });
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: targetChainId }],
      });
    }
  }

  async function ensureArcNetwork() {
    const provider = state.walletProvider || await chooseWalletProvider();
    if (!provider) throw new Error("No compatible browser wallet provider was detected.");
    const currentChainId = await provider.request({ method: "eth_chainId" });
    if (String(currentChainId).toLowerCase() === chainIdHex().toLowerCase()) return;
    banner($("globalBanner"), "info", "Requesting wallet approval to switch to " + PUBLIC_CONFIG.chainName + "…");
    await switchOrAddArcNetwork();
  }

  function updateWalletUi() {
    const expected = onExpectedChain();
    const connected = Boolean(state.address);
    const entry = selectedWalletEntry();
    $("netDot").className = expected && connected ? "dot live" : (connected ? "dot warn" : "dot off");
    $("netLabel").textContent = connected
      ? short(state.address) + " · " + (expected ? PUBLIC_CONFIG.chainName : ("chain " + state.chainId.toString()))
      : "no wallet";
    $("connectBtn").textContent = connected ? short(state.address) : "Connect Wallet";
    $("connectBtn").disabled = false;
    $("walletSummaryName").textContent = connected ? walletDisplayName(entry?.info) : "Wallet not connected";
    $("walletSummaryAddress").textContent = connected ? state.address : "Connect a wallet to continue";
    $("walletSummaryNetwork").textContent = connected
      ? (expected ? PUBLIC_CONFIG.chainName : "Wrong network — switch required")
      : PUBLIC_CONFIG.chainName;
    if (!connected) closeWalletMenu();
    renderWalletOptions();
    if (expected || !connected) {
      clearBanner($("networkBanner"));
    } else if (state.chainId !== null) {
      banner($("networkBanner"), "error", "WRONG NETWORK — switch your wallet to " + PUBLIC_CONFIG.chainName + " (chain " + PUBLIC_CONFIG.chainId + ") before reading or signing.");
    }
  }

  function closeWalletMenu() {
    const popover = $("walletPopover");
    if (popover) {
      popover.hidden = true;
      $("connectBtn").setAttribute("aria-expanded", "false");
    }
  }

  function toggleWalletMenu() {
    if (!state.address) {
      connectWallet();
      return;
    }
    const popover = $("walletPopover");
    const open = popover.hidden;
    popover.hidden = !open;
    $("connectBtn").setAttribute("aria-expanded", String(open));
  }

  async function disconnectWallet() {
    closeWalletMenu();
    sessionStorage.setItem("coinsprint-disconnected", "1");
    const provider = state.walletProvider;
    // wallet_revokePermissions is optional and unsupported by many wallets;
    // the app-local session is cleared regardless of provider support.
    try {
      await provider?.request({ method: "wallet_revokePermissions", params: [{ eth_accounts: {} }] });
    } catch { /* disconnect remains valid at the site level */ }
    resetWalletSession();
    banner($("globalBanner"), "success", "Disconnected from CoinSprint. Click Connect Wallet to connect again.");
  }

  function showWalletSwitcher() {
    closeWalletMenu();
    const select = $("walletSelect");
    if (state.walletProviders.length > 1) {
      select.hidden = false;
      select.focus();
    } else {
      banner($("globalBanner"), "info", "No second wallet provider was detected. Install another EIP-6963-compatible wallet, then reload.");
    }
  }

  function bindWalletEvents() {
    const provider = state.walletProvider;
    if (!provider?.on) return;
    if (state.walletEventsProvider === provider && state.walletEventsBound) return;
    state.walletEventsBound = true;
    state.walletEventsProvider = provider;
    provider.on("accountsChanged", () => {
      window.setTimeout(() => restoreWalletSession({ autoSwitch: false }), 0);
    });
    provider.on("chainChanged", () => {
      window.setTimeout(() => restoreWalletSession({ autoSwitch: true }), 0);
    });
  }

  function resetWalletSession() {
    state.signer = null;
    state.address = null;
    state.chainId = null;
    state.expectedChainId = expectedChainId();
    state.factory = null;
    state.usdc = null;
    state.registry = null;
    state.tokens = [];
    $("marketBody").innerHTML = '<div class="empty">NO WALLET CONNECTED</div>';
    updateWalletUi();
  }

  // ---------------- wallet / config ----------------
  async function connectWallet({ requestAccess = true, switchNetwork = true } = {}) {
    if (state.connecting) return false;
    state.connecting = true;
    try {
      if (requestAccess) sessionStorage.removeItem("coinsprint-disconnected");
      const provider = requestAccess ? await chooseWalletProvider({ requireAccount: true }) : (state.walletProvider || await findConnectedWallet());
      if (!provider) {
        banner($("globalBanner"), "error", "NO COMPATIBLE WALLET FOUND — install or unlock an EIP-6963-compatible wallet, or choose a detected wallet above.");
        return false;
      }
      state.walletProvider = provider;
      state.provider = new ethers.BrowserProvider(provider);
      if (requestAccess) {
        await state.provider.send("eth_requestAccounts", []);
      } else {
        const accounts = await provider.request({ method: "eth_accounts" });
        if (!accounts?.length) {
          resetWalletSession();
          return false;
        }
      }
      bindWalletEvents();
      if (switchNetwork) await ensureArcNetwork();
      state.provider = new ethers.BrowserProvider(provider);
      state.signer = await state.provider.getSigner();
      state.address = await state.signer.getAddress();
      const net = await state.provider.getNetwork();
      state.chainId = net.chainId;
      state.expectedChainId = expectedChainId();
      updateWalletUi();
      if (!onExpectedChain()) return false;
      clearBanner($("globalBanner"));
      await applyConfig();
      return true;
    } catch (e) {
      const code = Number(e?.code);
      if (code === 4001) {
        banner($("globalBanner"), "error", "WALLET REQUEST REJECTED — approve the account and network requests to continue.");
      } else {
        banner($("globalBanner"), "error", "CONNECTION FAILED: " + walletErrorMessage(e));
      }
      updateWalletUi();
      return false;
    } finally {
      state.connecting = false;
    }
  }

  async function restoreWalletSession({ autoSwitch = true } = {}) {
    if (sessionStorage.getItem("coinsprint-disconnected") === "1") {
      resetWalletSession();
      return false;
    }
    try {
      const provider = state.walletProvider || await findConnectedWallet();
      if (!provider) {
        resetWalletSession();
        return false;
      }
      state.walletProvider = provider;
      return await connectWallet({ requestAccess: false, switchNetwork: autoSwitch });
    } catch {
      return false;
    }
  }

  async function addArcNetwork() {
    try {
      const provider = state.walletProvider || await chooseWalletProvider({ requireAccount: true });
      if (!provider) throw new Error("Choose a wallet before adding ARC Testnet.");
      state.walletProvider = provider;
      await switchOrAddArcNetwork();
      await restoreWalletSession({ autoSwitch: false });
      banner($("globalBanner"), "success", PUBLIC_CONFIG.chainName + " is ready in your wallet.");
    } catch (e) {
      banner($("globalBanner"), "error", "COULD NOT ADD OR SWITCH NETWORK: " + walletErrorMessage(e));
    }
  }

  function updateConfigStatus() {
    const factory = $("cfgFactory").value.trim();
    const usdc = $("cfgUsdc").value.trim();
    const block = $("cfgDeploymentBlock").value.trim();
    const ready = ethers.isAddress(factory) && ethers.isAddress(usdc) && /^\d+$/.test(block);
    const status = $("configStatus");
    status.className = "config-status " + (ready ? "ready" : "missing");
    status.textContent = ready
      ? "Deployment config ready — the market can load after wallet connection."
      : "Deployment config incomplete — set COINSPRINT_FACTORY_ADDRESS and COINSPRINT_DEPLOYMENT_BLOCK in Vercel, or enter the factory address, USDC address, and deployment block above.";
  }

  function fillArcUsdc() {
    $("cfgUsdc").value = "0x3600000000000000000000000000000000000000";
    updateConfigStatus();
  }

  async function applyConfig() {
    const factoryAddr = $("cfgFactory").value.trim();
    const usdcAddr = $("cfgUsdc").value.trim();

    if (!state.signer) {
      banner($("globalBanner"), "info", "Connect a wallet first.");
      return;
    }
    if (!requireExpectedChain()) return;
    if (!ethers.isAddress(factoryAddr) || !ethers.isAddress(usdcAddr)) {
      banner($("globalBanner"), "error", "FACTORY AND USDC ADDRESSES MUST BOTH BE SET to valid addresses before the market can load. Run deploy.mjs and paste its output above, or enter Arc's real addresses once confirmed.");
      return;
    }

    try {
      if (await state.provider.getCode(factoryAddr) === "0x") throw new Error("the configured factory address has no contract code on this chain");
      state.factory = new ethers.Contract(factoryAddr, FACTORY_ABI, state.signer);
      state.usdc = new ethers.Contract(usdcAddr, ERC20_MIN_ABI, state.signer);
      const factoryUsdc = await state.factory.usdc();
      if (factoryUsdc.toLowerCase() !== usdcAddr.toLowerCase()) throw new Error("the configured factory points at a different USDC address");
      state.usdcDecimals = Number(await state.usdc.decimals());
      if (!Number.isInteger(state.usdcDecimals) || state.usdcDecimals <= 0 || state.usdcDecimals > 18) throw new Error("unsupported USDC decimals");

      const deploymentBlockRaw = $("cfgDeploymentBlock").value.trim() || String(PUBLIC_CONFIG.deploymentBlock || "");
      if (!/^\d+$/.test(deploymentBlockRaw)) throw new Error("factory deployment block must be a non-negative integer");
      state.deploymentBlock = Number(deploymentBlockRaw);
      if (!Number.isSafeInteger(state.deploymentBlock)) throw new Error("factory deployment block is too large");

      const registryAddr = $("cfgRegistry").value.trim();
      state.registry = (registryAddr && ethers.isAddress(registryAddr))
        ? new ethers.Contract(registryAddr, REGISTRY_ABI, state.signer)
        : null;
      // Keep metadata inputs visible even when the optional registry is not
      // configured. The user should never lose launch metadata fields just
      // because the separate registry address is temporarily blank.
      $("launchImageRow").style.display = "flex";
      $("launchSocialsRow").style.display = "flex";
      $("launchImageRow").title = state.registry ? "Optional token metadata" : "Metadata registry is not configured; add its address above to save these fields on-chain.";
      $("launchSocialsRow").title = state.registry ? "Optional social links" : "Metadata registry is not configured; add its address above to save these fields on-chain.";

      const [fee, threshold, initialVirtual, platformBps, platformRecipient, maxWalletBps] = await Promise.all([
        (async () => { const c = new ethers.Contract(await state.factory.implementation(), CURVE_ABI, state.provider); return c.TRADE_FEE_BPS(); })(),
        state.factory.defaultGraduationThreshold(),
        state.factory.defaultInitialVirtualUsdc(),
        state.factory.platformFeeBps(),
        state.factory.platformFeeRecipient(),
        state.factory.defaultMaxWalletBps(),
      ]);
      const totalPct = Number(fee) / 100;
      const platformPct = Number(platformBps) / 100;
      const creatorPct = totalPct - platformPct;
      $("dfFee").textContent = totalPct.toString() + "% per trade, total";
      $("dfCreatorFee").textContent = creatorPct.toString() + "%";
      $("dfPlatformFee").textContent = platformBps > 0n ? (platformPct.toString() + "% (" + short(platformRecipient) + ")") : "0% (none set)";
      $("dfThreshold").textContent = fmtNumber(bigToNumber(threshold, state.usdcDecimals)) + " USDC raised";
      const maxWalletPct = Number(maxWalletBps) / 100;
      $("dfMaxWallet").textContent = maxWalletBps > 0n ? (maxWalletPct.toString() + "% of supply, pre-graduation") : "disabled";
      $("secWhaleStatus").textContent = maxWalletBps > 0n
        ? (maxWalletPct.toString() + "% max per wallet, enforced on-chain")
        : "disabled for this factory";
      $("secWhaleStatus").parentElement.previousElementSibling.className = maxWalletBps > 0n ? "mark" : "mark warn";
      void initialVirtual;

      $("launchBtn").disabled = false;
      $("launchBtn").textContent = "Launch Token";
      clearBanner($("globalBanner"));
      $("settingsPanel").removeAttribute("open");

      await loadMarket();
    } catch (e) {
      banner($("globalBanner"), "error", "COULD NOT READ FROM THOSE ADDRESSES: " + (e.shortMessage || e.message || String(e)) + " — check the factory address is really a LaunchpadFactory and the network matches your wallet.");
    }
  }

  // ---------------- market ----------------
  const MARKET_LOAD_LIMIT = 60;
  // ARC RPC providers commonly rate-limit eth_getLogs. Keep ranges small,
  // retry transient responses, and never launch multiple market scans at once.
  const LOG_CHUNK_SIZE = 2_000;
  const RPC_RETRY_LIMIT = 4;
  const READ_CONCURRENCY = 3;

  function sleep(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function readProvider() {
    if (!state.readProvider) {
      const request = new ethers.FetchRequest(PUBLIC_CONFIG.rpcUrl);
      request.timeout = 12_000;
      state.readProvider = new ethers.JsonRpcProvider(
        request,
        Number(PUBLIC_CONFIG.chainId),
        { staticNetwork: true }
      );
    }
    return state.readProvider;
  }

  function rpcErrorText(error) {
    return String(error?.shortMessage || error?.reason || error?.message || error || "RPC request failed");
  }

  function isRetryableRpcError(error) {
    const text = rpcErrorText(error).toLowerCase();
    const code = Number(error?.code ?? error?.info?.error?.code);
    return code === -32005 || /429|rate limit|rate limited|coalesce|timeout|temporarily unavailable|server error|502|503|504|fetch failed/.test(text);
  }

  async function withTimeout(operation, timeoutMs, label) {
    let timer;
    try {
      return await Promise.race([
        Promise.resolve().then(operation),
        new Promise((_, reject) => {
          timer = window.setTimeout(() => reject(new Error(`${label || "RPC request"} timed out`)), timeoutMs);
        }),
      ]);
    } finally {
      if (timer) window.clearTimeout(timer);
    }
  }

  async function withRpcRetry(operation, label) {
    let lastError;
    for (let attempt = 0; attempt < RPC_RETRY_LIMIT; attempt += 1) {
      try {
        return await withTimeout(operation, 12_000, label);
      } catch (error) {
        lastError = error;
        if (!isRetryableRpcError(error) || attempt === RPC_RETRY_LIMIT - 1) throw error;
        await sleep(350 * (2 ** attempt) + Math.floor(Math.random() * 180));
      }
    }
    throw lastError || new Error(`${label || "RPC request"} failed`);
  }

  async function mapWithConcurrency(items, limit, mapper) {
    const results = new Array(items.length);
    let cursor = 0;
    async function worker() {
      while (true) {
        const index = cursor++;
        if (index >= items.length) return;
        results[index] = await mapper(items[index], index);
      }
    }
    await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
    return results;
  }

  async function queryFilterChunked(contract, filter, fromBlock, toBlock) {
    if (fromBlock > toBlock) return [];
    const events = [];

    async function queryRange(start, end, depth = 0) {
      try {
        return await withRpcRetry(
          () => contract.queryFilter(filter, start, end),
          "eth_getLogs"
        );
      } catch (error) {
        // Do not recursively split rate-limit/timeouts: that would multiply
        // requests and keep the UI stuck. Splitting is only for range-size
        // or provider log-result limits.
        const text = rpcErrorText(error).toLowerCase();
        const rateLimited = /429|rate limit|rate limited|coalesce|timeout|temporarily unavailable|502|503|504/.test(text);
        if (rateLimited || start >= end || depth >= 6) throw error;
        const middle = Math.floor((start + end) / 2);
        const left = await queryRange(start, middle, depth + 1);
        const right = await queryRange(middle + 1, end, depth + 1);
        return [...left, ...right];
      }
    }

    for (let start = fromBlock; start <= toBlock; start += LOG_CHUNK_SIZE) {
      const end = Math.min(toBlock, start + LOG_CHUNK_SIZE - 1);
      events.push(...await queryRange(start, end));
      // Give a public RPC tier a small recovery window between log requests.
      if (end < toBlock) await sleep(60);
    }
    return events;
  }

  async function blockTimestamp(blockNumber) {
    if (state.blockTimestampCache.has(blockNumber)) return state.blockTimestampCache.get(blockNumber);
    if (state.blockTimestampInFlight.has(blockNumber)) return state.blockTimestampInFlight.get(blockNumber);
    const request = withRpcRetry(
      () => readProvider().getBlock(blockNumber),
      "eth_getBlockByNumber"
    ).then((block) => {
      const timestamp = block ? Number(block.timestamp) : 0;
      state.blockTimestampCache.set(blockNumber, timestamp);
      return timestamp;
    }).finally(() => state.blockTimestampInFlight.delete(blockNumber));
    state.blockTimestampInFlight.set(blockNumber, request);
    return request;
  }

  function friendlyRpcError(error) {
    const text = rpcErrorText(error);
    if (isRetryableRpcError(error)) {
      return "ARC RPC is rate-limiting log reads. Wait a few seconds and click Refresh again, or configure a dedicated RPC endpoint.";
    }
    return text;
  }

  async function loadMarket() {
    if (!state.factory) return;
    if (state.marketLoadPromise) return state.marketLoadPromise;

    const hadExistingMarket = state.tokens.length > 0;
    if (!hadExistingMarket) $("marketBody").innerHTML = '<div class="empty">Loading market…</div>';

    state.marketLoadPromise = (async () => {
      try {
        if (!Number.isInteger(state.deploymentBlock) || state.deploymentBlock < 0) {
          throw new Error("Factory deployment block is required for bounded log scans.");
        }
        const provider = readProvider();
        const factoryAddress = await state.factory.getAddress();
        const factoryReader = new ethers.Contract(factoryAddress, FACTORY_ABI, provider);
        const latestBlock = await withRpcRetry(() => provider.getBlockNumber(), "eth_blockNumber");
        const latest = await withRpcRetry(() => provider.getBlock(latestBlock), "eth_getBlockByNumber");
        // Use the factory's indexed token list for the market instead of
        // scanning TokenLaunched logs. This is substantially cheaper on ARC
        // public RPC and makes newly launched tokens appear after refresh.
        const totalRaw = await withRpcRetry(
          () => factoryReader.allTokensLength(),
          "eth_call allTokensLength"
        );
        const total = Number(totalRaw);
        if (!Number.isSafeInteger(total) || total < 0) throw new Error("Factory returned an invalid token count.");
        const firstIndex = Math.max(0, total - MARKET_LOAD_LIMIT);
        const indexes = Array.from({ length: total - firstIndex }, (_, offset) => firstIndex + offset);
        const addresses = await mapWithConcurrency(
          indexes,
          READ_CONCURRENCY,
          (index) => withRpcRetry(() => factoryReader.allTokens(index), "eth_call allTokens")
        );
        const recentEvents = addresses.map((address, offset) => ({
          args: { token: address },
          // The factory array index provides stable newest-first ordering.
          blockNumber: firstIndex + offset,
        }));
        const cutoff = (latest ? Number(latest.timestamp) : Math.floor(Date.now() / 1000)) - 86_400;
        state.marketTruncated = firstIndex > 0;
        state.marketTotalCount = total;
        const registryReader = state.registry
          ? new ethers.Contract(await state.registry.getAddress(), REGISTRY_ABI, provider)
          : null;

        const tokens = (await mapWithConcurrency(recentEvents, READ_CONCURRENCY, async (ev) => {
          try {
            const addr = ev.args.token;
            const curve = new ethers.Contract(addr, CURVE_ABI, provider);
            const read = (operation, label) => withRpcRetry(operation, label);
            const calls = [
              read(() => curve.currentPrice(), "eth_call currentPrice"),
              read(() => curve.realUsdcReserve(), "eth_call realUsdcReserve"),
              read(() => curve.graduationThreshold(), "eth_call graduationThreshold"),
              read(() => curve.graduated(), "eth_call graduated"),
              read(() => curve.name(), "eth_call name"),
              read(() => curve.symbol(), "eth_call symbol"),
              state.address ? read(() => curve.balanceOf(state.address), "eth_call balanceOf") : Promise.resolve(0n),
              // Activity and 24-hour volume are loaded on the detail page.
              // Avoid per-token eth_getLogs scans during the main refresh.
              Promise.resolve([]),
            ];
            const [price, raised, threshold, graduated, name, symbol, myBalance, buyEvents] = await Promise.all(calls);
            const buyTimestamps = await mapWithConcurrency(
              buyEvents,
              READ_CONCURRENCY,
              (event) => blockTimestamp(event.blockNumber)
            );
            const volume = buyEvents.reduce(
              (sum, event, index) => buyTimestamps[index] >= cutoff ? sum + event.args.usdcIn : sum,
              0n
            );

            let imageUrl = "";
            if (registryReader) {
              try {
                const meta = await withRpcRetry(() => registryReader.getMetadata(addr), "eth_call metadata");
                if (meta.isSet) imageUrl = safeHttpsUrl(meta.imageUrl);
              } catch { /* metadata failures never block the market list */ }
            }

            return {
              address: addr, name, symbol,
              price: bigToNumber(price, 18),
              raised: bigToNumber(raised, state.usdcDecimals),
              threshold: bigToNumber(threshold, state.usdcDecimals),
              graduated,
              myBalance,
              volume: bigToNumber(volume, state.usdcDecimals),
              imageUrl,
              block: ev.blockNumber,
            };
          } catch (error) {
            // A single malformed/temporarily unavailable clone should not
            // erase every other token from the market.
            console.warn("Skipping token during market refresh", ev.args?.token, error);
            return null;
          }
        })).filter(Boolean);

        state.tokens = tokens.reverse();
        updateProtocolTerminal();
        $("marketControls").style.display = "flex";
        renderMarket();
        clearBanner($("globalBanner"));
      } catch (error) {
        const message = friendlyRpcError(error);
        if (hadExistingMarket) {
          renderMarket();
          banner($("globalBanner"), "info", "Market refresh failed; showing the last successful data. " + message);
        } else {
          $("marketBody").innerHTML = '<div class="empty"><div class="big">COULD NOT LOAD MARKET</div>' + escapeHtml(message) + '</div>';
        }
      } finally {
        state.marketLoadPromise = null;
      }
    })();

    return state.marketLoadPromise;
  }

  function renderMarket() {
    if (state.tokens.length === 0) {
      $("marketBody").innerHTML = '<div class="empty"><div class="big">NO TOKENS LAUNCHED YET</div>Be the first — launch one on the left.</div>';
      return;
    }

    const query = ($("marketSearch").value || "").trim().toLowerCase();
    const sortMode = $("marketSort").value;
    const mineOnly = $("marketMineOnly").checked;

    let list = state.tokens.filter((t) => {
      if (mineOnly && t.myBalance === 0n) return false;
      if (query && !t.name.toLowerCase().includes(query) && !t.symbol.toLowerCase().includes(query)) return false;
      return true;
    });

    if (sortMode === "trending") list = [...list].sort((a, b) => b.volume - a.volume);
    else if (sortMode === "price") list = [...list].sort((a, b) => b.price - a.price);
    else if (sortMode === "raise") list = [...list].sort((a, b) => (b.threshold > 0 ? b.raised / b.threshold : 0) - (a.threshold > 0 ? a.raised / a.threshold : 0));
    else list = [...list].sort((a, b) => b.block - a.block); // newest

    if (list.length === 0) {
      $("marketBody").innerHTML = '<div class="empty"><div class="big">NO MATCHES</div>Try a different search or turn off "My holdings only."</div>';
      return;
    }

    let rows = list.map((t) => {
      const pct = t.threshold > 0 ? Math.min(100, (t.raised / t.threshold) * 100) : 0;
      const sel = t.address === state.selected ? " selected" : "";
      const thumb = t.imageUrl
        ? `<img class="token-thumb" src="${escapeHtml(t.imageUrl)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" /><div class="token-thumb-placeholder" style="display:none;">${escapeHtml(t.symbol.slice(0, 2))}</div>`
        : `<div class="token-thumb-placeholder">${escapeHtml(t.symbol.slice(0, 2))}</div>`;
      return `<tr class="${sel.trim()}" data-addr="${t.address}">
        <td><div class="ticker-cell-row">${thumb}<div class="ticker-cell"><span class="sym">${escapeHtml(t.symbol)}</span><span class="nm">${escapeHtml(t.name)}</span></div></div></td>
        <td>${fmtNumber(t.price, 6)}</td>
        <td><div class="mini-gauge${t.graduated ? " live" : ""}"><i style="width:${pct}%"></i></div></td>
        <td>${t.graduated ? '<span class="tag live">LIVE ON DEX</span>' : '<span class="tag raising">RAISING</span>'}</td>
      </tr>`;
    }).join("");

    const truncNote = state.marketTruncated
      ? `<div class="quote" style="padding:8px 18px;">Showing the ${MARKET_LOAD_LIMIT} most recent of ${state.marketTotalCount} tokens. Older tokens require a production indexer; search only covers the loaded window.</div>`
      : "";

    $("marketBody").innerHTML = `<table class="market">
      <thead><tr><th>Ticker</th><th>Price (USDC)</th><th>Raise</th><th>Status</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>${truncNote}`;

    $("marketBody").querySelectorAll("tr[data-addr]").forEach((row) => {
      row.addEventListener("click", () => selectToken(row.getAttribute("data-addr")));
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function safeHttpsUrl(value) {
    try {
      const url = new URL(String(value));
      return url.protocol === "https:" ? url.href : "";
    } catch {
      return "";
    }
  }

  // ---------------- launch ----------------
  async function handleLaunch() {
    const name = $("lName").value.trim();
    const symbol = $("lSymbol").value.trim().toUpperCase();
    if (!name || !symbol) {
      banner($("globalBanner"), "error", "NAME AND SYMBOL ARE BOTH REQUIRED.");
      return;
    }
    $("launchBtn").disabled = true;
    $("launchBtn").textContent = "Confirm in wallet…";
    try {
      if (!requireExpectedChain()) throw new Error("switch to the configured network before launching");
      const gasLimit = await bufferedGasLimit(state.factory, "createToken", [name, symbol]);
      const tx = await state.factory.createToken(name, symbol, { gasLimit });
      $("launchBtn").textContent = "Launching…";
      const receipt = await tx.wait();
      const ev = receipt.logs.map((l) => { try { return state.factory.interface.parseLog(l); } catch { return null; } }).find((e) => e && e.name === "TokenLaunched");
      banner($("globalBanner"), "success", "LAUNCHED " + symbol + " AT " + (ev ? ev.args.token : "?") + " — 100% fair launch, nothing pre-mined.");

      // Metadata is a separate transaction on purpose: if it fails for
      // any reason, the token launch itself — which already succeeded —
      // must never be reported as failed alongside it.
      if (ev) {
        const imageUrl = $("lImage").value.trim();
        const twitter = $("lTwitter").value.trim();
        const telegram = $("lTelegram").value.trim();
        const website = $("lWebsite").value.trim();
        if ((imageUrl || twitter || telegram || website) && !state.registry) {
          banner($("globalBanner"), "info", "Token launched successfully. Add the Metadata Registry address in Network & Contract Config to save the image and social links on-chain.");
        }
        if (state.registry && (imageUrl || twitter || telegram || website)) {
          try {
            $("launchBtn").textContent = "Setting metadata…";
            await (await state.registry.setMetadata(ev.args.token, imageUrl, twitter, telegram, website, "")).wait();
          } catch (metaErr) {
            banner($("globalBanner"), "info", "Token launched successfully, but setting its image/socials failed: " + (metaErr.shortMessage || metaErr.message || String(metaErr)) + " — you can retry later, the token itself is unaffected.");
          }
        }
      }

      $("lName").value = "";
      $("lSymbol").value = "";
      $("lImage").value = "";
      $("lTwitter").value = "";
      $("lTelegram").value = "";
      $("lWebsite").value = "";
      await loadMarket();
      if (ev) selectToken(ev.args.token);
    } catch (e) {
      banner($("globalBanner"), "error", "LAUNCH FAILED: " + (e.shortMessage || e.message || String(e)));
    } finally {
      $("launchBtn").disabled = false;
      $("launchBtn").textContent = "Launch Token";
    }
  }

  // ---------------- token detail ----------------
  async function selectToken(addr) {
    state.selected = addr;
    state.selectedCurve = new ethers.Contract(addr, CURVE_ABI, state.signer);
    if (state.selectedListener) {
      try { state.selectedListener.removeAllListeners(); } catch (_) {}
    }
    state.selectedListener = state.selectedCurve;

    $("detailSection").style.display = "block";
    $("logBody").innerHTML = '<div class="empty" style="padding:24px;">Loading activity…</div>';
    renderMarket();
    try {
      await refreshDetail();
    } catch (error) {
      banner($("detailBanner"), "error", "COULD NOT LOAD TOKEN DETAILS: " + friendlyRpcError(error));
    }
    await loadLog(addr);

    state.selectedCurve.on("Buy", () => { refreshDetail(); loadLog(addr); loadMarket(); });
    state.selectedCurve.on("Sell", () => { refreshDetail(); loadLog(addr); loadMarket(); });
    state.selectedCurve.on("Graduated", () => { refreshDetail(); loadLog(addr); loadMarket(); });

    $("detailSection").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  async function refreshDetail() {
    const c = state.selectedCurve;
    if (!c) return;
    const [name, symbol, price, raised, threshold, graduated, vUsdc, vToken, k, feeBps, balance, creatorAddr, platformBps, platformRecipient] = await Promise.all([
      c.name(), c.symbol(), c.currentPrice(), c.realUsdcReserve(), c.graduationThreshold(), c.graduated(),
      c.virtualUsdcReserve(), c.virtualTokenReserve(), c.k(), c.TRADE_FEE_BPS(),
      c.balanceOf(state.address), c.creator(), c.platformFeeBps(), c.platformFeeRecipient(),
    ]);

    $("detailHeading").textContent = symbol + " detail";
    $("dSym").textContent = symbol;
    $("dName").textContent = name;
    $("dPrice").textContent = fmtNumber(bigToNumber(price, 18), 8);

    const dImage = $("dImage");
    const dSocials = $("dSocials");
    dImage.style.display = "none";
    dSocials.style.display = "none";
    dSocials.innerHTML = "";
    if (state.registry) {
      try {
        const meta = await state.registry.getMetadata(await c.getAddress());
        if (meta.isSet && meta.imageUrl) {
          const imageUrl = safeHttpsUrl(meta.imageUrl);
          if (imageUrl) {
            dImage.src = imageUrl;
            dImage.onerror = () => { dImage.style.display = "none"; };
            dImage.style.display = "block";
          }
        }
        if (meta.isSet && (meta.twitter || meta.telegram || meta.website)) {
          const linkDefs = [["X / Twitter", meta.twitter], ["Telegram", meta.telegram], ["Website", meta.website]];
          for (const [label, url] of linkDefs) {
            const safeUrl = safeHttpsUrl(url);
            if (!safeUrl) continue;
            const a = document.createElement("a"); // built as a real element, not string-concatenated HTML — no injection surface regardless of what the creator put in the URL
            a.href = safeUrl;
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            a.textContent = label;
            a.style.color = "var(--phosphor)";
            dSocials.appendChild(a);
          }
          dSocials.style.display = "flex";
        }
      } catch { /* metadata read failures never block the rest of the detail view */ }
    }

    const totalPct = Number(feeBps) / 100;
    const platformPct = Number(platformBps) / 100;
    const creatorPct = totalPct - platformPct;
    const feeNote = platformBps > 0n
      ? `${totalPct}% fee/trade — ${creatorPct}% to creator (${short(creatorAddr)}), ${platformPct}% to platform (${short(platformRecipient)})`
      : `${totalPct}% fee/trade — 100% to creator (${short(creatorAddr)})`;
    $("dFeeNote").textContent = feeNote;

    const raisedNum = bigToNumber(raised, state.usdcDecimals);
    const thresholdNum = bigToNumber(threshold, state.usdcDecimals);
    const pct = thresholdNum > 0 ? Math.min(100, (raisedNum / thresholdNum) * 100) : 0;

    $("gFill").style.width = pct + "%";
    $("gFill").className = "gauge-fill" + (graduated ? " live" : "");
    $("gStatus").textContent = graduated ? "LIVE ON DEX" : "RAISING";
    $("gStatus").className = "status" + (graduated ? " live" : "");
    $("gRaised").textContent = fmtNumber(raisedNum);
    $("gThreshold").textContent = fmtNumber(thresholdNum);
    $("gPct").textContent = pct.toFixed(1) + "%";

    state.detailCache = { vUsdc, vToken, k, feeBps, graduated, tokenBalance: balance };

    const buyBtn = $("buyBtn"), sellBtn = $("sellBtn");
    if (graduated) {
      buyBtn.disabled = true; buyBtn.textContent = "Trading moved to DEX pool";
      sellBtn.disabled = true; sellBtn.textContent = "Trading moved to DEX pool";
      banner($("detailBanner"), "info", "This token graduated — liquidity is on the DEX pool now, permanently locked (LP burned). Trade it there instead.");
    } else {
      buyBtn.disabled = false; buyBtn.textContent = "Buy";
      sellBtn.disabled = false; sellBtn.textContent = "Sell";
      clearBanner($("detailBanner"));
    }

    updateBuyQuote();
    updateSellQuote();
  }

  function updateBuyQuote() {
    const raw = $("buyAmount").value.trim();
    const q = $("buyQuote");
    if (!state.detailCache || !raw || Number.isNaN(Number(raw)) || Number(raw) <= 0) {
      q.textContent = "Enter an amount to see estimated tokens received.";
      return;
    }
    try {
      const usdcIn = ethers.parseUnits(raw, state.usdcDecimals);
      const { tokensOut, fee } = simulateBuy(usdcIn, state.detailCache.vUsdc, state.detailCache.vToken, state.detailCache.k, state.detailCache.feeBps);
      const min = applySlippage(tokensOut, $("buySlippage").value);
      q.innerHTML = `Estimated: <b>${fmtNumber(bigToNumber(tokensOut, 18))}</b> tokens
        &nbsp;·&nbsp; fee: ${fmtNumber(bigToNumber(fee, state.usdcDecimals), 4)} USDC
        &nbsp;·&nbsp; min received: <b>${fmtNumber(bigToNumber(min, 18))}</b>`;
    } catch (e) {
      q.textContent = "Invalid amount.";
    }
  }

  function updateSellQuote() {
    const raw = $("sellAmount").value.trim();
    const q = $("sellQuote");
    if (!state.detailCache || !raw || Number.isNaN(Number(raw)) || Number(raw) <= 0) {
      q.textContent = "Enter an amount to see estimated USDC received.";
      return;
    }
    try {
      const tokensIn = ethers.parseUnits(raw, 18);
      const { usdcOut, fee } = simulateSell(tokensIn, state.detailCache.vUsdc, state.detailCache.vToken, state.detailCache.k, state.detailCache.feeBps);
      const min = applySlippage(usdcOut, $("sellSlippage").value);
      q.innerHTML = `Estimated: <b>${fmtNumber(bigToNumber(usdcOut, state.usdcDecimals))}</b> USDC
        &nbsp;·&nbsp; fee: ${fmtNumber(bigToNumber(fee, state.usdcDecimals), 4)} USDC
        &nbsp;·&nbsp; min received: <b>${fmtNumber(bigToNumber(min, state.usdcDecimals))}</b>`;
    } catch (e) {
      q.textContent = "Invalid amount.";
    }
  }

  async function handleBuy() {
    const buyBtn = $("buyBtn");
    buyBtn.disabled = true;
    try {
      if (!requireExpectedChain()) throw new Error("switch to the configured network before buying");
      const usdcIn = parsePositiveUnits($("buyAmount").value.trim(), state.usdcDecimals, "USDC amount");
      const { tokensOut } = simulateBuy(usdcIn, state.detailCache.vUsdc, state.detailCache.vToken, state.detailCache.k, state.detailCache.feeBps);
      const minTokensOut = applySlippage(tokensOut, $("buySlippage").value);
      const allowance = await state.usdc.allowance(state.address, state.selected);
      if (allowance < usdcIn) {
        buyBtn.textContent = "Approving USDC…";
        const approveGas = await state.usdc.approve.estimateGas(state.selected, ethers.MaxUint256);
        const approveTx = await state.usdc.approve(state.selected, ethers.MaxUint256, { gasLimit: (approveGas * 125n) / 100n });
        await approveTx.wait();
      }
      buyBtn.textContent = "Confirm in wallet…";
      const gasLimit = await bufferedGasLimit(state.selectedCurve, "buy", [usdcIn, minTokensOut]);
      const tx = await state.selectedCurve.buy(usdcIn, minTokensOut, { gasLimit });
      buyBtn.textContent = "Buying…";
      await tx.wait();
      banner($("detailBanner"), "success", "BOUGHT — you received at least " + fmtNumber(bigToNumber(minTokensOut, 18)) + " tokens.");
      $("buyAmount").value = "";
      await refreshDetail();
    } catch (e) {
      banner($("detailBanner"), "error", "BUY FAILED: " + (e.shortMessage || e.reason || e.message || String(e)));
    } finally {
      buyBtn.disabled = false;
      buyBtn.textContent = "Buy";
    }
  }

  async function handleSell() {
    const sellBtn = $("sellBtn");
    sellBtn.disabled = true;
    try {
      if (!requireExpectedChain()) throw new Error("switch to the configured network before selling");
      const tokensIn = parsePositiveUnits($("sellAmount").value.trim(), 18, "token amount");
      const { usdcOut } = simulateSell(tokensIn, state.detailCache.vUsdc, state.detailCache.vToken, state.detailCache.k, state.detailCache.feeBps);
      const minUsdcOut = applySlippage(usdcOut, $("sellSlippage").value);
      // No approval is needed: sell() moves the caller's own balance directly.
      sellBtn.textContent = "Confirm in wallet…";
      const gasLimit = await bufferedGasLimit(state.selectedCurve, "sell", [tokensIn, minUsdcOut]);
      const tx = await state.selectedCurve.sell(tokensIn, minUsdcOut, { gasLimit });
      sellBtn.textContent = "Selling…";
      await tx.wait();
      banner($("detailBanner"), "success", "SOLD — you received at least " + fmtNumber(bigToNumber(minUsdcOut, state.usdcDecimals)) + " USDC.");
      $("sellAmount").value = "";
      await refreshDetail();
    } catch (e) {
      banner($("detailBanner"), "error", "SELL FAILED: " + (e.shortMessage || e.reason || e.message || String(e)));
    } finally {
      sellBtn.disabled = false;
      sellBtn.textContent = "Sell";
    }
  }

  // ---------------- activity log ----------------
  // ---------------- price chart ----------------
  function renderPriceChart(trades) {
    const box = $("chartEmpty");
    if (trades.length === 0) {
      box.style.display = "flex";
      $("chartMeta").textContent = "—";
      if (state.chart) { state.chart.destroy(); state.chart = null; }
      return;
    }
    box.style.display = "none";

    const labels = trades.map((t) => "#" + t.block);
    const prices = trades.map((t) => t.price);
    const pointColors = trades.map((t) => t.side === "buy" ? "#5EEAD4" : "#C6554A");

    const first = prices[0], last = prices[prices.length - 1];
    const change = first > 0 ? ((last - first) / first) * 100 : 0;
    $("chartMeta").textContent = `${trades.length} trade${trades.length === 1 ? "" : "s"} · ${change >= 0 ? "+" : ""}${change.toFixed(1)}% since first trade`;

    const ctx = $("priceChart").getContext("2d");
    const data = {
      labels,
      datasets: [{
        data: prices,
        borderColor: "#5EEAD4",
        backgroundColor: "rgba(94,234,212,0.08)",
        borderWidth: 1.5,
        pointRadius: 2,
        pointBackgroundColor: pointColors,
        pointBorderWidth: 0,
        tension: 0.15,
        fill: true,
      }],
    };
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 200 },
      plugins: { legend: { display: false }, tooltip: {
        backgroundColor: "#10151D", borderColor: "#1B222C", borderWidth: 1,
        titleColor: "#6B7480", bodyColor: "#E8E6DF", titleFont: { family: "JetBrains Mono", size: 10 }, bodyFont: { family: "JetBrains Mono", size: 11 },
        callbacks: { label: (c) => fmtNumber(c.parsed.y, 8) + " USDC" },
      } },
      scales: {
        x: { grid: { color: "#1B222C" }, ticks: { color: "#454E5A", font: { family: "JetBrains Mono", size: 9 }, maxTicksLimit: 6 } },
        y: { grid: { color: "#1B222C" }, ticks: { color: "#454E5A", font: { family: "JetBrains Mono", size: 9 }, callback: (v) => fmtNumber(v, 6) } },
      },
    };

    if (state.chart) {
      state.chart.data = data;
      state.chart.options = options;
      state.chart.update();
    } else {
      state.chart = new Chart(ctx, { type: "line", data, options });
    }
  }

  // ---------------- manipulation heuristic ----------------
  // Deliberately simple and stated plainly rather than dressed up: looks
  // at the recent trade window, finds the local peak price, and flags
  // when the latest price has fallen a lot from that peak with sell
  // pressure behind it. This is a heuristic on public trade data, not a
  // surveillance system — it can't see wallets acting in coordination,
  // only price/volume shape. False positives (real volatility) and false
  // negatives (slow, patient dumps) are both expected. Treat it as a
  // prompt to go look, not a verdict.
  function updateManipulationAlert(trades) {
    const el = $("manipAlert");
    const WINDOW = 15;
    const recent = trades.slice(-WINDOW);
    if (recent.length < 4) { el.className = "alert-badge"; return; }

    let peak = 0, peakIdx = 0;
    recent.forEach((t, i) => { if (t.price > peak) { peak = t.price; peakIdx = i; } });
    const latest = recent[recent.length - 1];
    const drawdown = peak > 0 ? ((peak - latest.price) / peak) * 100 : 0;
    const sellsSincePeak = recent.slice(peakIdx + 1).filter((t) => t.side === "sell").length;

    if (drawdown >= 30 && sellsSincePeak >= 2) {
      $("manipAlertText").textContent =
        `Price is down ${drawdown.toFixed(0)}% from a recent local high, with ${sellsSincePeak} sells since — could be normal volatility or could be a dump in progress. Simple heuristic on public trades, not a verdict — check the chart and recent activity yourself.`;
      el.className = "alert-badge show";
    } else {
      el.className = "alert-badge";
    }
  }

  async function loadLog(addr) {
    try {
      const provider = readProvider();
      const curve = new ethers.Contract(addr, CURVE_ABI, provider);
      if (!Number.isInteger(state.deploymentBlock) || state.deploymentBlock < 0) {
        throw new Error("Factory deployment block is required for bounded log scans.");
      }
      const latestBlock = await withRpcRetry(() => provider.getBlockNumber(), "eth_blockNumber");
      let warning = "";
      const readEvents = async (filter, label) => {
        try {
          const result = await queryFilterChunked(curve, filter, state.deploymentBlock, latestBlock);
          await sleep(100);
          return result;
        } catch (error) {
          warning = friendlyRpcError(error);
          console.warn(`Could not load ${label} events`, error);
          return [];
        }
      };

      // Keep the three event scans sequential. Parallel eth_getLogs calls
      // are what commonly trigger public ARC RPC HTTP 429 responses.
      const buys = await readEvents(curve.filters.Buy(), "buy");
      const sells = await readEvents(curve.filters.Sell(), "sell");
      const grads = await readEvents(curve.filters.Graduated(), "graduation");
      const entries = [
        ...buys.map((e) => ({ kind: "buy", block: e.blockNumber, idx: e.index, args: e.args, text: short(e.args.buyer) + " bought " + fmtNumber(bigToNumber(e.args.tokensOut, 18)) + " for " + fmtNumber(bigToNumber(e.args.usdcIn, state.usdcDecimals)) + " USDC" })),
        ...sells.map((e) => ({ kind: "sell", block: e.blockNumber, idx: e.index, args: e.args, text: short(e.args.seller) + " sold " + fmtNumber(bigToNumber(e.args.tokensIn, 18)) + " for " + fmtNumber(bigToNumber(e.args.usdcOut, state.usdcDecimals)) + " USDC" })),
        ...grads.map((e) => ({ kind: "grad", block: e.blockNumber, idx: e.index, text: "graduated — LP burned, pair " + short(e.args.pair) })),
      ].sort((a, b) => (b.block - a.block) || (b.idx - a.idx)).slice(0, 25);

      const notice = warning ? `<div class="empty" style="padding:12px 24px;color:var(--amber);">Some activity reads were rate-limited; showing what was available. ${escapeHtml(warning)}</div>` : "";
      if (entries.length === 0) {
        $("logBody").innerHTML = notice || '<div class="empty" style="padding:24px;">No activity yet on this token.</div>';
      } else {
        $("logBody").innerHTML = notice + entries.map((e) =>
          `<div class="log-line"><span>#${e.block}</span><span class="kind ${e.kind}">${e.kind.toUpperCase()}</span><span class="detail-text">${escapeHtml(e.text)}</span></div>`
        ).join("");
      }

      // Chronological (oldest first) trade list with an implied price
      // per trade, for the chart and the manipulation heuristic. This is
      // a display-only reconstruction and never moves funds.
      const trades = [...buys.map((e) => ({ block: e.blockNumber, idx: e.index, side: "buy",
          price: bigToNumber(e.args.usdcIn, state.usdcDecimals) / (bigToNumber(e.args.tokensOut, 18) || 1),
          usdcSize: bigToNumber(e.args.usdcIn, state.usdcDecimals) })),
        ...sells.map((e) => ({ block: e.blockNumber, idx: e.index, side: "sell",
          price: bigToNumber(e.args.usdcOut, state.usdcDecimals) / (bigToNumber(e.args.tokensIn, 18) || 1),
          usdcSize: bigToNumber(e.args.usdcOut, state.usdcDecimals) }))]
        .sort((a, b) => (a.block - b.block) || (a.idx - b.idx));

      renderPriceChart(trades);
      updateManipulationAlert(trades);
    } catch (error) {
      $("logBody").innerHTML = '<div class="empty" style="padding:24px;">Could not load activity: ' + escapeHtml(friendlyRpcError(error)) + '</div>';
    }
  }

  // ---------------- max buttons ----------------
  async function setMaxBuy() {
    if (!state.usdc || !state.address) return;
    const bal = await state.usdc.balanceOf(state.address);
    $("buyAmount").value = ethers.formatUnits(bal, state.usdcDecimals);
    updateBuyQuote();
  }
  function setMaxSell() {
    if (!state.detailCache) return;
    $("sellAmount").value = ethers.formatUnits(state.detailCache.tokenBalance, 18);
    updateSellQuote();
  }

  // ---------------- wire up ----------------
  $("cfgFactory").value = PUBLIC_CONFIG.factoryAddress || "";
  $("cfgUsdc").value = PUBLIC_CONFIG.usdcAddress || "";
  $("cfgRegistry").value = PUBLIC_CONFIG.metadataRegistryAddress || "";
  $("cfgDeploymentBlock").value = PUBLIC_CONFIG.deploymentBlock || "";
  ["cfgFactory", "cfgUsdc", "cfgDeploymentBlock"].forEach((id) => $(id).addEventListener("input", updateConfigStatus));
  updateConfigStatus();

  $("walletSelect").addEventListener("change", (event) => {
    state.selectedWalletId = event.target.value;
    state.walletProvider = selectedWalletEntry()?.provider || null;
    resetWalletSession();
    banner($("globalBanner"), "info", "Wallet selected. Click Connect Wallet to approve this provider.");
  });
  $("connectBtn").addEventListener("click", toggleWalletMenu);
  $("disconnectBtn").addEventListener("click", disconnectWallet);
  $("switchWalletBtn").addEventListener("click", showWalletSwitcher);
  document.addEventListener("click", (event) => {
    if (!$("walletMenu").contains(event.target)) closeWalletMenu();
  });
  $("applyCfgBtn").addEventListener("click", applyConfig);
  $("addArcNetworkBtn").addEventListener("click", addArcNetwork);
  $("fillArcUsdcBtn").addEventListener("click", fillArcUsdc);
  $("refreshBtn").addEventListener("click", loadMarket);
  $("marketSearch").addEventListener("input", renderMarket);
  $("marketSort").addEventListener("change", renderMarket);
  $("marketMineOnly").addEventListener("change", renderMarket);
  $("launchBtn").addEventListener("click", handleLaunch);
  $("closeDetailBtn").addEventListener("click", () => { $("detailSection").style.display = "none"; state.selected = null; renderMarket(); });
  $("buyBtn").addEventListener("click", handleBuy);
  $("sellBtn").addEventListener("click", handleSell);
  $("buyAmount").addEventListener("input", updateBuyQuote);
  $("sellAmount").addEventListener("input", updateSellQuote);
  $("buySlippage").addEventListener("input", updateBuyQuote);
  $("sellSlippage").addEventListener("input", updateSellQuote);
  $("buyMaxBtn").addEventListener("click", setMaxBuy);
  $("sellMaxBtn").addEventListener("click", setMaxSell);
  $("cfgSlippage").addEventListener("input", (e) => { $("buySlippage").value = e.target.value; $("sellSlippage").value = e.target.value; });

  // Discover EIP-6963 and legacy providers, then restore a previously
  // approved wallet session without prompting. If the wallet is on another
  // chain, connectWallet() requests the ARC Testnet switch/add flow.
  discoverWallets().then(() => restoreWalletSession({ autoSwitch: true }));

})();
