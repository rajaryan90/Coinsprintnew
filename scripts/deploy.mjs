// CoinSprint deployment script.
//
// LOCAL (default) deploys test-only USDC/DEX mocks and the real launchpad.
// ARC TESTNET uses the official ERC-20 USDC interface and a router address
// that you have independently verified from the DEX's own documentation.
// ARC MAINNET is intentionally opt-in and refuses to run until every network
// value is explicitly supplied through environment variables.

import "dotenv/config";
import { ethers } from "ethers";
import fs from "fs";

const NETWORK = process.env.NETWORK || "local";

const NETWORKS = {
  local: { rpc: "http://127.0.0.1:8545", chainId: 31337n, usdc: null },
  "arc-testnet": {
    rpc: "https://rpc.testnet.arc.io",
    chainId: 5042002n,
    usdc: "0x3600000000000000000000000000000000000000",
  },
  "arc-mainnet": {
    rpc: process.env.ARC_MAINNET_RPC_URL || "",
    chainId: process.env.ARC_MAINNET_CHAIN_ID ? BigInt(process.env.ARC_MAINNET_CHAIN_ID) : null,
    usdc: process.env.ARC_MAINNET_USDC_ADDRESS || null,
  },
};

const net = NETWORKS[NETWORK];
if (!net) {
  console.error(`Unknown NETWORK "${NETWORK}". Valid: ${Object.keys(NETWORKS).join(", ")}`);
  process.exit(1);
}

const RPC = process.env.RPC_URL || net.rpc;
const platformFeeRecipient = process.env.PLATFORM_FEE_RECIPIENT || ethers.ZeroAddress;
const platformFeeBps = BigInt(process.env.PLATFORM_FEE_BPS || "0");
const maxWalletBps = BigInt(process.env.MAX_WALLET_BPS ?? "200");

const compiled = JSON.parse(fs.readFileSync("compile-output.json", "utf8"));
function artifact(file, name) {
  const c = compiled.contracts[file]?.[name];
  if (!c) throw new Error(`Missing compiled artifact ${file}:${name}; run npm run compile`);
  return { abi: c.abi, bytecode: "0x" + c.evm.bytecode.object };
}

const MockUSDC = artifact("contracts/test/Mocks.sol", "MockUSDC");
const MockFactoryArt = artifact("contracts/test/Mocks.sol", "MockFactory");
const MockRouterArt = artifact("contracts/test/Mocks.sol", "MockRouter");
const LaunchpadFactoryArt = artifact("contracts/LaunchpadFactory.sol", "LaunchpadFactory");
const RegistryArt = artifact("contracts/TokenMetadataRegistry.sol", "TokenMetadataRegistry");

const USDC_DECIMALS_ABI = ["function decimals() view returns (uint8)"];
const ROUTER_PROBE_ABI = [
  "function factory() view returns (address)",
  "function addLiquidity(address,address,uint256,uint256,uint256,uint256,address,uint256) returns (uint256,uint256,uint256)",
];

function assertAddress(value, label) {
  if (!ethers.isAddress(value) || value === ethers.ZeroAddress) {
    throw new Error(`${label} must be a non-zero EVM address`);
  }
}

async function assertContract(provider, address, label) {
  assertAddress(address, label);
  const code = await provider.getCode(address);
  if (code === "0x") throw new Error(`${label} has no deployed bytecode at ${address}`);
}

async function main() {
  if (NETWORK === "arc-mainnet" && (!RPC || !net.chainId || !net.usdc)) {
    throw new Error(
      "ARC MAINNET deployment is locked until ARC_MAINNET_RPC_URL, ARC_MAINNET_CHAIN_ID, " +
      "ARC_MAINNET_USDC_ADDRESS, and ROUTER_ADDRESS are explicitly set from official ARC/DEX documentation."
    );
  }
  if (NETWORK !== "local" && !process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY is required for non-local deployments; never use a browser wallet key or commit it to the repository.");
  }
  if (platformFeeBps > 100n) throw new Error(`PLATFORM_FEE_BPS=${platformFeeBps} exceeds the fixed 100 bps total trade fee.`);
  if (platformFeeBps > 0n && platformFeeRecipient === ethers.ZeroAddress) throw new Error("PLATFORM_FEE_BPS requires PLATFORM_FEE_RECIPIENT.");
  if (maxWalletBps > 10_000n) throw new Error(`MAX_WALLET_BPS=${maxWalletBps} exceeds 100%.`);

  const routerAddress = NETWORK === "local" ? null : process.env.ROUTER_ADDRESS;
  if (NETWORK !== "local") assertAddress(routerAddress, "ROUTER_ADDRESS");

  const provider = new ethers.JsonRpcProvider(RPC);
  const actualNetwork = await provider.getNetwork();
  if (net.chainId === null || actualNetwork.chainId !== net.chainId) {
    throw new Error(`RPC chain mismatch: expected ${net.chainId ?? "an explicit configured chain"}, got ${actualNetwork.chainId}.`);
  }

  const deployer = process.env.PRIVATE_KEY
    ? new ethers.Wallet(process.env.PRIVATE_KEY, provider)
    : await provider.getSigner(0);
  const deployerAddress = await deployer.getAddress();

  console.log(`Network:   ${NETWORK} (${RPC})`);
  console.log(`Chain ID:  ${actualNetwork.chainId}`);
  console.log(`Deployer:  ${deployerAddress}`);
  console.log(`Platform fee: ${platformFeeBps} bps -> ${platformFeeRecipient}`);
  console.log(`Max wallet (anti-whale, pre-graduation): ${maxWalletBps} bps of total supply${maxWalletBps === 0n ? " (DISABLED)" : ""}\n`);

  let usdcAddress;
  let dexFactoryAddress;
  let finalRouterAddress = routerAddress;
  let usdcDecimalsForNetwork;

  if (NETWORK === "local") {
    console.log("Deploying test-only MockUSDC + MockFactory + MockRouter...");
    const usdc = await (await new ethers.ContractFactory(MockUSDC.abi, MockUSDC.bytecode, deployer).deploy()).waitForDeployment();
    const dexFactory = await (await new ethers.ContractFactory(MockFactoryArt.abi, MockFactoryArt.bytecode, deployer).deploy()).waitForDeployment();
    const router = await (await new ethers.ContractFactory(MockRouterArt.abi, MockRouterArt.bytecode, deployer).deploy(await dexFactory.getAddress())).waitForDeployment();
    usdcAddress = await usdc.getAddress();
    finalRouterAddress = await router.getAddress();
    dexFactoryAddress = await dexFactory.getAddress();
    usdcDecimalsForNetwork = Number(await usdc.decimals());
  } else {
    usdcAddress = net.usdc;
    await assertContract(provider, usdcAddress, "USDC");
    await assertContract(provider, finalRouterAddress, "ROUTER_ADDRESS");
    const usdc = new ethers.Contract(usdcAddress, USDC_DECIMALS_ABI, provider);
    usdcDecimalsForNetwork = Number(await usdc.decimals());
    if (!Number.isInteger(usdcDecimalsForNetwork) || usdcDecimalsForNetwork <= 0 || usdcDecimalsForNetwork > 18) {
      throw new Error(`USDC decimals=${usdcDecimalsForNetwork} is unsupported; expected an integer from 1 through 18.`);
    }
    const router = new ethers.Contract(finalRouterAddress, ROUTER_PROBE_ABI, provider);
    dexFactoryAddress = await router.factory();
    await assertContract(provider, dexFactoryAddress, "router.factory()");
    console.log(`Using verified USDC interface: ${usdcAddress} (${usdcDecimalsForNetwork} decimals)`);
    console.log(`Using router: ${finalRouterAddress}`);
    console.log(`Using router factory: ${dexFactoryAddress}`);
  }

  const initialVirtualUsdc = ethers.parseUnits(process.env.INITIAL_VIRTUAL_USDC || "3000", usdcDecimalsForNetwork);
  const graduationThreshold = ethers.parseUnits(process.env.GRADUATION_THRESHOLD || "1000", usdcDecimalsForNetwork);
  if (initialVirtualUsdc === 0n || graduationThreshold === 0n) throw new Error("INITIAL_VIRTUAL_USDC and GRADUATION_THRESHOLD must be positive.");

  console.log("\nDeploying LaunchpadFactory...");
  const launchpad = await (
    await new ethers.ContractFactory(LaunchpadFactoryArt.abi, LaunchpadFactoryArt.bytecode, deployer).deploy(
      usdcAddress,
      finalRouterAddress,
      initialVirtualUsdc,
      graduationThreshold,
      platformFeeRecipient,
      platformFeeBps,
      maxWalletBps
    )
  ).waitForDeployment();
  const launchpadDeploymentTx = launchpad.deploymentTransaction();
  const launchpadReceipt = launchpadDeploymentTx ? await launchpadDeploymentTx.wait() : null;

  console.log("Deploying TokenMetadataRegistry...");
  const registry = await (await new ethers.ContractFactory(RegistryArt.abi, RegistryArt.bytecode, deployer).deploy()).waitForDeployment();

  const addresses = {
    network: NETWORK,
    rpc: RPC,
    chainId: actualNetwork.chainId.toString(),
    deploymentBlock: launchpadReceipt?.blockNumber ?? null,
    deployer: deployerAddress,
    usdc: usdcAddress,
    usdcDecimals: usdcDecimalsForNetwork,
    router: finalRouterAddress,
    dexFactory: dexFactoryAddress,
    launchpadFactory: await launchpad.getAddress(),
    metadataRegistry: await registry.getAddress(),
    initialVirtualUsdc: initialVirtualUsdc.toString(),
    graduationThreshold: graduationThreshold.toString(),
    platformFeeRecipient,
    platformFeeBps: platformFeeBps.toString(),
    maxWalletBps: maxWalletBps.toString(),
  };

  fs.writeFileSync(`deployed-addresses.${NETWORK}.json`, JSON.stringify(addresses, null, 2) + "\n");

  console.log("\nDeployed. Public addresses:");
  console.log(`  Factory address:  ${addresses.launchpadFactory}`);
  console.log(`  USDC address:     ${addresses.usdc}`);
  console.log(`  Registry address: ${addresses.metadataRegistry}`);
  console.log(`  Chain ID:         ${addresses.chainId}`);
  console.log(`  RPC URL:          ${addresses.rpc}`);
  console.log(`\nFull details written to deployed-addresses.${NETWORK}.json`);
}

main().catch((e) => {
  console.error("DEPLOY ERROR:", e.shortMessage || e.message || e);
  process.exitCode = 1;
});
