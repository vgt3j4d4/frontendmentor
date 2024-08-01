const fs = require("fs");
const join = require("path").join;
const platform = require("os").platform;
const cp = require("child_process");
const npmCmd = platform().startsWith("win") ? "npm.cmd" : "npm";
const challengesPath = "../challenges";
const copyFiles = require("copyfiles");

const indexHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8'>
  <meta http-equiv='X-UA-Compatible' content='IE=edge'>
  <title>Frontend Mentor Challenges</title>
  <meta name='viewport' content='width=device-width, initial-scale=1'>
</head>
<body>
  <h1>Frontend Mentor Challenges</h1>
  <ul>{{placeholder}}</ul>
</body>
</html>`;

let filePath,
  generatedDistFolderPath,
  urls = [];
console.log("Building all challenges...");
fs.readdirSync(challengesPath, { withFileTypes: true }).forEach((file) => {
  if (file.isDirectory()) {
    filePath = join("../challenges", file.name);
    // Ensure path has package.json
    if (fs.existsSync(join(filePath, "package.json"))) {
      console.log("Running 'npm run dist' on " + file.name);
      cp.spawn(npmCmd, ["run", "dist"], {
        env: process.env,
        cwd: filePath,
        stdio: "inherit",
      });
    }
    generatedDistFolderPath = join(filePath, "dist", "/**/*");
    console.log(
      "Copying files from " + generatedDistFolderPath + " to " + __dirname
    );
    copyFiles(
      [generatedDistFolderPath, join(__dirname, file.name)],
      { all: true, up: 4 },
      () => {
        console.log("Files copied successfully");
      }
    );
    urls.push(file.name);
  }
  if (urls.length > 0) {
    links = [];
    urls.map((url) => {
      const label = url
        .replace(/\-/g, " ")
        .split(" ")
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(" ");
      links.push(`<li><a href="/${url}">${label}</a></li>`);
    });
    const indexHtmlContent = indexHtml.replace(
      "{{placeholder}}",
      links.join("")
    );
    fs.writeFileSync(join(__dirname, "index.html"), indexHtmlContent);
  }
});
