var fs = require("fs");
var join = require("path").join;
var platform = require("os").platform;
var cp = require("child_process");
var npmCmd = platform().startsWith("win") ? "npm.cmd" : "npm";
var challengesPath = join(__dirname, "../challenges");

console.log("Building all challenges...");
fs.readdirSync(challengesPath, { withFileTypes: true }).forEach((file) => {
  if (file.isDirectory()) {
    var filePath = join(challengesPath, file.name);
    // Ensure path has package.json
    if (fs.existsSync(join(filePath, "package.json"))) {
      console.log("Running 'npm run dist' on " + file.name);
      cp.spawn(npmCmd, ["run", "dist"], {
        env: process.env,
        cwd: filePath,
        stdio: "inherit",
      });
    }
  }
});
