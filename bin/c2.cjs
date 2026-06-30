#!/usr/bin/env node
const { spawnSync } = require("child_process");
const { existsSync, readFileSync } = require("fs");
const path = require("path");

const packagePath = path.resolve(__dirname, "..", "package.json");
const pkg = JSON.parse(readFileSync(packagePath, "utf8"));
const tools = pkg.colony2?.tools ?? {};
const toolCommands = Object.keys(tools).map((name) => name.split("/").pop());

function printHelp() {
  console.log(`Usage: c2 <command>

Commands:
  install       Install or update the bundled Colony 2 tools globally
  versions      Show bundled tool versions
  help          Show this help

Bundled tools:
  ${toolCommands.join(", ")}

You can also run a bundled tool through c2, for example:
  c2 shai --help`);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    ...options
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  process.exit(result.status ?? 1);
}

function localBin(command) {
  const names = process.platform === "win32" ? [`${command}.cmd`, command] : [command];
  let current = process.cwd();

  while (true) {
    for (const name of names) {
      const candidate = path.join(current, "node_modules", ".bin", name);
      if (existsSync(candidate)) {
        return candidate;
      }
    }

    const parent = path.dirname(current);
    if (parent === current) {
      return command;
    }
    current = parent;
  }
}

const [command, ...args] = process.argv.slice(2);

if (!command || command === "help" || command === "--help" || command === "-h") {
  printHelp();
  process.exit(0);
}

if (command === "versions") {
  for (const [tool, version] of Object.entries(tools)) {
    console.log(`${tool}@${version}`);
  }
  process.exit(0);
}

if (command === "install") {
  run(process.execPath, [path.resolve(__dirname, "..", "scripts", "install-tools.mjs")], {
    env: {
      ...process.env,
      C2_INSTALL_TOOLS: "1"
    }
  });
}

if (toolCommands.includes(command)) {
  run(localBin(command), args);
}

console.error(`Unknown command: ${command}`);
printHelp();
process.exit(1);
