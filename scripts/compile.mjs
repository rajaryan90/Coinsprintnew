// Compiles every contract with solc directly (not through a framework's
// own artifact pipeline) and writes a single standard-JSON-shaped
// compile-output.json at the repo root.
//
// This exact shape — output.contracts[sourceFile][contractName] — is what
// scripts/deploy.mjs and test/test-market-integration.mjs already expect
// (see their `artifact(file, name)` helper). Keeping compilation as its
// own explicit step, instead of hiding it inside a framework, means both
// of those scripts stay framework-agnostic and easy to read end to end.
//
// Run: npm run compile

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import solc from "solc";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// Every local contract is listed explicitly and provided directly in
// `sources` below, so solc never has to resolve a relative "./X.sol"
// import on its own — only the @openzeppelin/* imports need resolving
// off disk via the `findImport` callback.
const SOURCE_FILES = [
  "contracts/LaunchpadFactory.sol",
  "contracts/MemecoinBondingCurve.sol",
  "contracts/TokenMetadataRegistry.sol",
  "contracts/test/Mocks.sol",
];

const sources = {};
for (const relPath of SOURCE_FILES) {
  sources[relPath] = { content: fs.readFileSync(path.join(ROOT, relPath), "utf8") };
}

function findImport(importPath) {
  if (importPath.startsWith("@openzeppelin/")) {
    try {
      return { contents: fs.readFileSync(path.join(ROOT, "node_modules", importPath), "utf8") };
    } catch {
      return { error: `Could not resolve ${importPath} — did you run "npm install"?` };
    }
  }
  return { error: `File not found: ${importPath}` };
}

const input = {
  language: "Solidity",
  sources,
  settings: {
    optimizer: { enabled: true, runs: 200 },
    // The factory initializer call plus OpenZeppelin's ERC-20 initialization
    // can exceed the legacy Solidity stack allocator. The IR pipeline is
    // deterministic with the pinned compiler and avoids that build failure.
    viaIR: true,
    // The contracts do not require Osaka- or Cancun-only opcodes, so target
    // Paris for broad compatibility with ARC's Osaka execution baseline.
    evmVersion: "paris",
    outputSelection: {
      "*": { "*": ["abi", "evm.bytecode.object", "evm.deployedBytecode.object"] },
    },
  },
};

console.log(`Compiling with solc ${solc.version()}...`);

// solc-js has shipped two callback signatures across wrapper versions:
// modern releases expect { import: callback }, while some Windows installs
// expose the legacy function callback. Try the modern form first and fall
// back only when the wrapper explicitly rejects that callback shape.
function compileWithImportCallback() {
  const serialized = JSON.stringify(input);
  try {
    return solc.compile(serialized, { import: findImport });
  } catch (error) {
    const message = String(error?.message || error);
    if (!message.toLowerCase().includes("invalid callback")) throw error;
    return solc.compile(serialized, findImport);
  }
}

const output = JSON.parse(compileWithImportCallback());

let hasError = false;
for (const err of output.errors || []) {
  if (err.severity === "error") {
    hasError = true;
    console.error(err.formattedMessage);
  } else {
    console.warn(err.formattedMessage);
  }
}
if (hasError) {
  console.error("\nCompilation failed — see errors above.");
  process.exit(1);
}

fs.writeFileSync(path.join(ROOT, "compile-output.json"), JSON.stringify(output));
console.log("\nWrote compile-output.json:");
for (const file of Object.keys(output.contracts)) {
  for (const name of Object.keys(output.contracts[file])) {
    console.log(`  ${file}:${name}`);
  }
}
