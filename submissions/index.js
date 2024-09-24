const fs = require("fs");
const join = require("path").join;
const platform = require("os").platform;
const cp = require("child_process");
const npmCmd = platform().startsWith("win") ? "npm.cmd" : "npm";
const copyFiles = require("copyfiles");
const handlebars = require("handlebars");
const chalk = require("chalk");
const CleanCSS = require("clean-css");

const log = console.log;
const CHALLENGES_PATH = "../challenges";

let challengeFilePath,
  challengesFilePaths = [],
  challengeNames = [],
  challengeUrls = [];

function extractLabelAndUrl(name) {
  const label = name
    .replace(/\-/g, " ")
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
  return { label, url: name };
}

function buildAllChallenges() {
  log(chalk.cyan("======================="));
  log(chalk.cyan("Building all challenges"));
  log(chalk.cyan("======================="));
  challengesFilePaths.map((challengeFolder) => {
    log(chalk.green(`  Running 'npm run dist' on ${challengeFolder}`));
    cp.spawn(npmCmd, ["run", "dist"], {
      env: process.env,
      cwd: challengeFolder,
      stdio: "inherit",
    });
  });
}

function removePreviousChallenges() {
  log(chalk.cyan("============================"));
  log(chalk.cyan("Removing previous challenges"));
  log(chalk.cyan("============================"));
  challengeNames.map((name) => {
    let folder = join(__dirname, name);
    log(chalk.green(`  Removing ${folder}`));
    try {
      fs.rmSync(folder, { recursive: true, force: true });
    } catch (error) {
      log(chalk.red(`  Error removing ${folder}`));
    }
  });
}

function copyChallenges(callback) {
  log(chalk.cyan("=================="));
  log(chalk.cyan("Copying challenges"));
  log(chalk.cyan("=================="));
  const promises = challengesFilePaths.map((challengeFolder, index) => {
    return new Promise((resolve) => {
      let sourceFolder = join(challengeFolder, "dist");
      log(chalk.green(`  Copying files FROM ${sourceFolder} TO ${__dirname}`));
      copyFiles(
        [join(sourceFolder, "/**/*"), join(__dirname, challengeNames[index])],
        { all: true, up: 4 },
        resolve
      );
    });
  });
  Promise.all(promises).then(callback);
}

function minimizeCss() {
  log(chalk.cyan("=================="));
  log(chalk.cyan("Minimize CSS files"));
  log(chalk.cyan("=================="));
  challengeNames.map((name) => {
    let cssFolder = join(__dirname, name, "css");
    fs.readdirSync(cssFolder, {
      withFileTypes: true,
    }).forEach((file) => {
      if (!file.isFile() || !file.name.endsWith(".css")) return;

      let sourceFile = join(cssFolder, file.name);
      let destinationFile = join(
        cssFolder,
        file.name.replace(".css", ".min.css")
      );
      log(chalk.green(`  Minifying ${sourceFile}`));
      fs.writeFileSync(
        destinationFile,
        new CleanCSS().minify(fs.readFileSync(sourceFile, "utf8")).styles
      );
      fs.unlinkSync(sourceFile);
      // fs.unlinkSync(sourceFile + ".map"); // remove source map
      fs.renameSync(destinationFile, sourceFile);
    });
  });
}

function generateIndex() {
  log(chalk.cyan("====================="));
  log(chalk.cyan("Generating index.html"));
  log(chalk.cyan("====================="));
  const indexTemplate = fs.readFileSync(
    join(__dirname, "index.template.html"),
    "utf8"
  );
  handlebars.parse(indexTemplate);
  const indexHtmlContent = handlebars.compile(indexTemplate)({ challengeUrls });
  fs.writeFileSync(join(__dirname, "index.html"), indexHtmlContent);
  log(chalk.green("Done!"));
}

(function main() {
  fs.readdirSync(CHALLENGES_PATH, { withFileTypes: true }).forEach((folder) => {
    if (!folder.isDirectory()) return;

    challengeFilePath = join(CHALLENGES_PATH, folder.name);
    // Ensure path has package.json
    if (!fs.existsSync(join(challengeFilePath, "package.json"))) return;

    challengesFilePaths.push(challengeFilePath);
    challengeNames.push(folder.name);
    challengeUrls.push(extractLabelAndUrl(folder.name));
  });

  if (challengeNames.length === 0) {
    log(chalk.red("No challenges found"));
    return;
  }

  buildAllChallenges();
  removePreviousChallenges();
  copyChallenges(() => {
    minimizeCss();
    generateIndex();
  });
})();
