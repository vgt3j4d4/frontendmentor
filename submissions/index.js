const fs = require("fs");
const join = require("path").join;
const platform = require("os").platform;
const cp = require("child_process");
const npmCmd = platform().startsWith("win") ? "npm.cmd" : "npm";
const challengesPath = "../challenges";
const copyFiles = require("copyfiles");
const handlebars = require("handlebars");

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
    challengeUrls = [];
    urls.map((url) => {
      const label = url
        .replace(/\-/g, " ")
        .split(" ")
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(" ");
      challengeUrls.push({ url, label });
    });

    console.log("Generating index.html");
    const indexTemplate = fs.readFileSync(
      join(__dirname, "index.template.html"),
      "utf8"
    );
    handlebars.parse(indexTemplate);
    const indexHtmlContent = handlebars.compile(indexTemplate)({
      challengeUrls,
    });
    fs.writeFileSync(join(__dirname, "index.html"), indexHtmlContent);

    console.log("All challenges built successfully");
  }
});
