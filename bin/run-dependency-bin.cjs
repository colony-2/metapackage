const { spawn } = require("child_process");
const { existsSync } = require("fs");
const path = require("path");

function resolveDependencyBin(packageName, binPath) {
  const candidates = [];

  try {
    candidates.push(require.resolve(`${packageName}/${binPath}`));
  } catch (_error) {
    // Some packages may restrict subpath resolution through exports.
  }

  try {
    candidates.push(path.join(path.dirname(require.resolve(`${packageName}/package.json`)), binPath));
  } catch (_error) {
    // Fall back to the normal nested dependency layout below.
  }

  candidates.push(path.resolve(__dirname, "..", "node_modules", ...packageName.split("/"), binPath));

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(`Unable to find ${packageName}/${binPath}`);
}

module.exports = function runDependencyBin(packageName, binPath) {
  let script;
  try {
    script = resolveDependencyBin(packageName, binPath);
  } catch (error) {
    console.error(error.message);
    console.error("Try reinstalling @colony2/c2.");
    process.exit(1);
  }

  const child = spawn(process.execPath, [script, ...process.argv.slice(2)], {
    stdio: "inherit"
  });

  child.on("error", (error) => {
    console.error(error.message);
    process.exit(1);
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    process.exit(code ?? 1);
  });
};
