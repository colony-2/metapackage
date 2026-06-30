import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const packageJsonPath = new URL("../package.json", import.meta.url);
const pkg = JSON.parse(readFileSync(packageJsonPath, "utf8"));
const tools = pkg.colony2?.tools ?? {};
const specs = Object.entries(tools).map(([name, version]) => `${name}@${version}`);

const forceInstall = process.env.C2_INSTALL_TOOLS === "1";
const globalLifecycle = process.env.npm_config_global === "true";

if (!forceInstall && !globalLifecycle) {
  console.log("@colony2/c2 tool installation is skipped for non-global installs.");
  process.exit(0);
}

if (specs.length === 0) {
  console.log("No Colony 2 tools are configured.");
  process.exit(0);
}

function npmPrefix() {
  if (process.env.npm_config_prefix) {
    return process.env.npm_config_prefix;
  }

  return execFileSync("npm", ["prefix", "-g"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"]
  }).trim();
}

const prefix = npmPrefix();

console.log(`Installing Colony 2 tools into ${prefix}`);
for (const spec of specs) {
  console.log(`  ${spec}`);
}

execFileSync("npm", ["install", "-g", "--prefix", prefix, ...specs], {
  stdio: "inherit"
});
