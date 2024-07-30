var fs = require("fs");
var join = require("path").join;
var platform = require("os").platform;
var cp = require("child_process");
var npmCmd = platform().startsWith("win") ? "npm.cmd" : "npm";

fs.readdirSync(__dirname, { withFileTypes: true }).forEach(function (file) {
  if (file.isDirectory()) {
    var modPath = join(__dirname, file.name);
    // ensure path has package.json
    if (fs.existsSync(join(modPath, "package.json"))) {
      cp.spawn(npmCmd, ["run", "dist"], {
        env: process.env,
        cwd: modPath,
        stdio: "inherit",
      });
    }
  }
});
