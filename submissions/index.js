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

function extractLabelAndUrl(name) {
  const label = name
    .replace(/\-/g, " ")
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
  return { label, url: name };
}

function build(challengeLocations) {
  log(chalk.cyan("==================="));
  log(chalk.cyan("Building challenges"));
  log(chalk.cyan("==================="));
  challengeLocations.map((location) => {
    log(chalk.green(`  Running 'npm run dist' on ${location}`));
    cp.spawn(npmCmd, ["run", "dist"], {
      env: process.env,
      cwd: location,
      stdio: "inherit",
    });
  });
}

function removePrevious(challenges) {
  log(chalk.cyan("============================"));
  log(chalk.cyan("Removing previous challenges"));
  log(chalk.cyan("============================"));
  challenges.map((name) => {
    let folder = join(__dirname, name);
    log(chalk.green(`  Removing ${folder}`));
    try {
      fs.rmSync(folder, { recursive: true, force: true });
    } catch (error) {
      log(chalk.red(`  Error removing ${folder}`));
    }
  });
}

function copy(challenges, challengeLocations, callbackFn) {
  log(chalk.cyan("=================="));
  log(chalk.cyan("Copying challenges"));
  log(chalk.cyan("=================="));
  const promises = challengeLocations.map((location, index) => {
    return new Promise((resolve) => {
      let sourceFolder = join(location, "dist");
      log(chalk.green(`  Copying files FROM ${sourceFolder} TO ${__dirname}`));
      copyFiles(
        [join(sourceFolder, "/**/*"), join(__dirname, challenges[index])],
        { all: true, up: 4 },
        resolve
      );
    });
  });
  Promise.all(promises).then(callbackFn);
}

function minimizeCss(challenges) {
  log(chalk.cyan("=================="));
  log(chalk.cyan("Minimize CSS files"));
  log(chalk.cyan("=================="));
  challenges.map((name) => {
    let cssFolder = join(__dirname, name, "css");
    if (!fs.existsSync(cssFolder) || !fs.statSync(cssFolder).isDirectory()) {
      log(chalk.red(`  Error: CSS folder not found for ${cssFolder}`));
      return;
    }

    fs.readdirSync(cssFolder, {
      withFileTypes: true,
    }).forEach((file) => {
      if (!file.isFile() || !file.name.endsWith(".css")) return;

      let cssFile = join(cssFolder, file.name);
      let minifiedFile = join(cssFolder, file.name.replace(".css", ".min.css"));
      log(chalk.green(`  Minifying ${cssFile}`));
      fs.writeFileSync(
        minifiedFile,
        new CleanCSS().minify(fs.readFileSync(cssFile, "utf8")).styles
      );
      fs.renameSync(minifiedFile, cssFile);
    });
  });
}

function generateHtml({ urls }) {
  log(chalk.cyan("====================="));
  log(chalk.cyan("Generating index.html"));
  log(chalk.cyan("====================="));
  const indexTemplate = fs.readFileSync(
    join(__dirname, "index.template.html"),
    "utf8"
  );
  handlebars.parse(indexTemplate);
  const content = handlebars.compile(indexTemplate)({ urls });
  fs.writeFileSync(join(__dirname, "index.html"), content);
  log(chalk.green("Done!"));
}

(function main() {
  const challengeLocations = [],
    challenges = [],
    urls = [];

  fs.readdirSync(CHALLENGES_PATH, { withFileTypes: true }).forEach((folder) => {
    if (!folder.isDirectory()) return;

    let path = join(CHALLENGES_PATH, folder.name);
    // Ensure path has package.json
    if (!fs.existsSync(join(path, "package.json"))) return;

    challengeLocations.push(path);
    challenges.push(folder.name);
    urls.push(extractLabelAndUrl(folder.name));
  });

  if (challenges.length === 0) {
    log(chalk.red("No challenges found"));
    return;
  }

  build(challengeLocations);
  removePrevious(challenges);
  copy(challenges, challengeLocations, () => {
    minimizeCss(challenges);
    generateHtml({ urls });
  });
})();
