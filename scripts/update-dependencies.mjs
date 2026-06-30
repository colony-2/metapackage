import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const dependencies = [
  "@colony2/c2j",
  "@colony2/c2m",
  "@colony2/c2r",
  "@colony2/jobdb",
  "@colony2/shai"
];

function latestVersion(packageName) {
  return execFileSync("npm", ["view", packageName, "version"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"]
  }).trim();
}

const packageJsonPath = new URL("../package.json", import.meta.url);
const pkg = JSON.parse(readFileSync(packageJsonPath, "utf8"));
const nextDependencies = {};

let changed = false;
for (const dependency of dependencies) {
  const version = latestVersion(dependency);
  nextDependencies[dependency] = version;

  if (pkg.dependencies?.[dependency] !== version) {
    changed = true;
    console.log(`${dependency}: ${pkg.dependencies?.[dependency] ?? "(missing)"} -> ${version}`);
  } else {
    console.log(`${dependency}: ${version}`);
  }
}

pkg.dependencies = nextDependencies;

if (changed) {
  writeFileSync(packageJsonPath, `${JSON.stringify(pkg, null, 2)}\n`);
} else {
  console.log("All dependency versions are current.");
}
