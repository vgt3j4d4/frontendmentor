const fs = require("fs");
const join = require("path").join;
const platform = require("os").platform;
const cp = require("child_process");
const npmCmd = platform().startsWith("win") ? "npm.cmd" : "npm";
const copyFiles = require("copyfiles");
const handlebars = require("handlebars");
const chalk = require("chalk");

const log = console.log;
const CHALLENGES_PATH = "../challenges";

let challengeFilePath,
  challengesFilePaths = [],
  challengeNames = [],
  challengeUrls = [];

fs.readdirSync(CHALLENGES_PATH, { withFileTypes: true }).forEach((folder) => {
  if (!folder.isDirectory()) return;

  challengeFilePath = join(CHALLENGES_PATH, folder.name);
  // Ensure path has package.json
  if (!fs.existsSync(join(challengeFilePath, "package.json"))) return;

  challengesFilePaths.push(challengeFilePath);
  challengeNames.push(folder.name);
});

if (challengeNames.length === 0) {
  log(chalk.red("No challenges found"));
  return;
}

log(chalk.cyan("==========================="));
log(chalk.cyan("Building all challenges ..."));
log(chalk.cyan("==========================="));
challengesFilePaths.map((challengeFolder) => {
  log(chalk.green(`  Running 'npm run dist' on ${challengeFolder}`));
  cp.spawn(npmCmd, ["run", "dist"], {
    env: process.env,
    cwd: challengeFolder,
    stdio: "inherit",
  });
});
log("");

log(chalk.cyan("======================"));
log(chalk.cyan("Copying challenges ..."));
log(chalk.cyan("======================"));
challengesFilePaths.map((challengeFolder, index) => {
  let sourceFolder = join(challengeFolder, "dist", "/**/*");
  log(chalk.green(`  Copying files from ${sourceFolder} to ${__dirname}`));
  copyFiles(
    [sourceFolder, join(__dirname, challengeNames[index])],
    { all: true, up: 4 },
    () => {}
  );
});
log("");

challengeNames.map((name) => {
  const label = name
    .replace(/\-/g, " ")
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
  challengeUrls.push({ url: name, label });
});

log(chalk.cyan("========================="));
log(chalk.cyan("Generating index.html ..."));
log(chalk.cyan("========================="));
const indexTemplate = fs.readFileSync(
  join(__dirname, "index.template.html"),
  "utf8"
);
handlebars.parse(indexTemplate);
const indexHtmlContent = handlebars.compile(indexTemplate)({
  challengeUrls,
});
fs.writeFileSync(join(__dirname, "index.html"), indexHtmlContent);
