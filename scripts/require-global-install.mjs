const globalInstall = process.env.npm_config_global === "true";

if (!globalInstall) {
  console.error("@colony2/c2 only supports global installation.");
  console.error("Use: npm install -g @colony2/c2");
  process.exit(1);
}
