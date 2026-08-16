import fs from "fs";

const publicConfig = {
  chainId: process.env.COINSPRINT_CHAIN_ID || "5042002",
  chainName: process.env.COINSPRINT_CHAIN_NAME || "Arc Testnet",
  rpcUrl: process.env.COINSPRINT_RPC_URL || "https://rpc.testnet.arc.io",
  explorerUrl: process.env.COINSPRINT_EXPLORER_URL || "https://testnet.arcscan.app",
  usdcAddress: process.env.COINSPRINT_USDC_ADDRESS || "0x3600000000000000000000000000000000000000",
  factoryAddress: process.env.COINSPRINT_FACTORY_ADDRESS || "",
  metadataRegistryAddress: process.env.COINSPRINT_METADATA_REGISTRY_ADDRESS || "",
  deploymentBlock: process.env.COINSPRINT_DEPLOYMENT_BLOCK || "",
};

for (const [key, value] of Object.entries(publicConfig)) {
  if (typeof value !== "string") throw new Error(`Invalid public config value for ${key}`);
}

if (process.env.VERCEL === "1") {
  if (!/^0x[a-fA-F0-9]{40}$/.test(publicConfig.factoryAddress)) {
    throw new Error("COINSPRINT_FACTORY_ADDRESS must be set to the deployed factory address in Vercel Environment Variables.");
  }
  if (!/^\d+$/.test(publicConfig.deploymentBlock)) {
    throw new Error("COINSPRINT_DEPLOYMENT_BLOCK must be set to the factory deployment block in Vercel Environment Variables.");
  }
}

fs.writeFileSync(
  "frontend/config.js",
  `window.COINSPRINT_CONFIG = ${JSON.stringify(publicConfig, null, 2)};\n`
);
console.log(`Wrote frontend/config.js for ${publicConfig.chainName} (${publicConfig.chainId}).`);
if (!publicConfig.factoryAddress) {
  console.warn("COINSPRINT_FACTORY_ADDRESS is empty; the UI will remain read-only until a deployed factory address is configured.");
}
