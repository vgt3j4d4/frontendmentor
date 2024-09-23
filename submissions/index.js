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
  generatedDistFolderPath,
  challengeNames = [];

log(chalk.cyan("======================="));
log(chalk.cyan("Building all challenges"));
log(chalk.cyan("======================="));
fs.readdirSync(CHALLENGES_PATH, { withFileTypes: true }).forEach((folder) => {
  if (!folder.isDirectory()) return;

  challengeFilePath = join("../challenges", folder.name);
  if (!fs.existsSync(join(challengeFilePath, "package.json"))) return; // Ensure path has package.json

  log(chalk.green("Running 'npm run dist' on " + folder.name));
  cp.spawn(npmCmd, ["run", "dist"], {
    env: process.env,
    cwd: challengeFilePath,
    stdio: "inherit",
  });
  challengeDistFolder = join(challengeFilePath, "dist", "/**/*");

  log("  Copying files from " + challengeDistFolder + " to " + __dirname);
  copyFiles(
    [challengeDistFolder, join(__dirname, folder.name)],
    { all: true, up: 4 },
    () => {}
  );
  log("");

  challengeNames.push(folder.name);
});

if (challengeNames.length > 0) {
  challengeUrls = [];
  challengeNames.map((name) => {
    const label = name
      .replace(/\-/g, " ")
      .split(" ")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");
    challengeUrls.push({ url: name, label });
  });

  log("");
  log(chalk.cyan("======================="));
  log(chalk.cyan("Generating index.html"));
  log(chalk.cyan("======================="));
  const indexTemplate = fs.readFileSync(
    join(__dirname, "index.template.html"),
    "utf8"
  );
  handlebars.parse(indexTemplate);
  const indexHtmlContent = handlebars.compile(indexTemplate)({
    challengeUrls,
  });
  fs.writeFileSync(join(__dirname, "index.html"), indexHtmlContent);
}
