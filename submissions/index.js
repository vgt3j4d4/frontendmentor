const fs = require("fs");
const path = require("path");
const join = path.join;
const cp = require("child_process");
const Handlebars = require("handlebars");
const Chalk = require("chalk");
const CleanCSS = require("clean-css");
const UglifyJS = require("uglify-js");

const log = console.log;
const CHALLENGES_PATH = "../challenges";
const UGLIFY_OPTIONS = {
  toplevel: true,
  output: {
    beautify: false,
    preamble: "/* uglified */",
  },
};
const PARENT_PATH = path.resolve(__dirname, "..");
const SELF_BUILDING_CHALLENGES = ["tip-calculator-app"];

Handlebars.registerHelper("inc", function (value, _options) {
  return parseInt(value) + 1;
});

function logInfo(message) {
  log(Chalk.green(message));
}

function logError(message) {
  log(Chalk.red(message));
}

function logWarning(message) {
  log(Chalk.yellow(message));
}

function build(challenges) {
  challenges.map(({ path }) => {
    log(Chalk.green(`  Running 'npm run dist' on ${path}`));
    cp.execSync(`npm run dist`, {
      cwd: path,
      env: process.env,
    });
  });
}

function removePrevious(challenges) {
  challenges.map(({ name }) => {
    let folder = join(__dirname, name);
    logInfo(`  Removing ${folder}`);
    try {
      fs.rmSync(folder, { recursive: true, force: true });
    } catch (error) {
      logError(`  Error removing ${folder}`);
    }
  });
}

function copy(challenges) {
  challenges.map(({ path, name }) => {
    const sourceFolder = join(path, "dist");
    const targetFolder = join(__dirname, name);
    logInfo(`  Copying files FROM ${sourceFolder} TO ${targetFolder}`);
    fs.cpSync(sourceFolder, targetFolder, { recursive: true, force: true });
  });
}

function minimizeCss(challenges) {
  challenges.map(({ name }) => {
    let cssFolder = join(__dirname, name, "css");
    if (!fs.existsSync(cssFolder) || !fs.statSync(cssFolder).isDirectory()) {
      logWarning(`  Skipping CSS minification for ${name}`);
      return;
    }

    fs.readdirSync(cssFolder, {
      withFileTypes: true,
    }).forEach((file) => {
      if (!file.isFile() || !file.name.endsWith(".css")) return;

      let cssFile = join(cssFolder, file.name);
      let minifiedFile = join(cssFolder, file.name.replace(".css", ".min.css"));
      logInfo(`  Minifying ${cssFile}`);
      fs.writeFileSync(
        minifiedFile,
        new CleanCSS().minify(fs.readFileSync(cssFile, "utf8")).styles
      );
      fs.renameSync(minifiedFile, cssFile);
    });
  });
}

function uglifyJS(challenges) {
  challenges.map(({ name }) => {
    let jsFolder = join(__dirname, name, "js");
    if (!fs.existsSync(jsFolder) || !fs.statSync(jsFolder).isDirectory()) {
      return;
    }

    fs.readdirSync(jsFolder, {
      withFileTypes: true,
    }).forEach((file) => {
      if (!file.isFile() || !file.name.endsWith(".js")) return;
      let jsFile = join(jsFolder, file.name);
      logInfo(`  Uglifying ${jsFile}`);
      fs.writeFileSync(
        jsFile,
        UglifyJS.minify(fs.readFileSync(jsFile, "utf8"), UGLIFY_OPTIONS).code,
        "utf8"
      );
    });
  });
}

function generateHtml(challenges) {
  const urls = challenges.map(({ name, url }) => {
    return {
      label: name,
      url: url,
    };
  });
  const indexTemplate = fs.readFileSync(
    join(__dirname, "index.template.html"),
    "utf8"
  );
  Handlebars.parse(indexTemplate);
  const content = Handlebars.compile(indexTemplate)({ urls });
  fs.writeFileSync(join(__dirname, "index.html"), content);
  logInfo("Done");
}

function updateReadMe(challenges) {
  const urls = challenges.map(({ name, url }) => {
    return {
      label: name,
      url: url,
    };
  });
  const readMeTemplate = fs.readFileSync(
    join(PARENT_PATH, "README.template.md"),
    "utf8"
  );
  Handlebars.parse(readMeTemplate);
  const content = Handlebars.compile(readMeTemplate)({ urls });
  fs.writeFileSync(join(PARENT_PATH, "README.md"), content);
  logInfo("Done");
}

(function main() {
  const challenges = [];

  fs.readdirSync(CHALLENGES_PATH, { withFileTypes: true }).forEach((folder) => {
    if (!folder.isDirectory()) return;

    let path = join(CHALLENGES_PATH, folder.name);
    // Ensure path has package.json
    if (!fs.existsSync(join(path, "package.json"))) return;
    // Skip self-building challenges
    if (SELF_BUILDING_CHALLENGES.includes(folder.name)) return;

    challenges.push({
      path: path,
      name: folder.name
        .replace(/\-/g, " ")
        .split(" ")
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(" "),
      url: folder.name,
    });
  });

  if (challenges.length === 0) {
    logError("No challenges found");
    return;
  }

  log(Chalk.cyan("==================="));
  log(Chalk.cyan("Building challenges"));
  log(Chalk.cyan("==================="));
  build(challenges);

  log(Chalk.cyan("============================"));
  log(Chalk.cyan("Removing previous challenges"));
  log(Chalk.cyan("============================"));
  removePrevious(challenges);

  log(Chalk.cyan("=================="));
  log(Chalk.cyan("Copying challenges"));
  log(Chalk.cyan("=================="));
  copy(challenges);

  log(Chalk.cyan("=================="));
  log(Chalk.cyan("Minimize CSS files"));
  log(Chalk.cyan("=================="));
  minimizeCss(challenges);

  log(Chalk.cyan("=================="));
  log(Chalk.cyan("Uglify JS files"));
  log(Chalk.cyan("=================="));
  uglifyJS(challenges);

  log(Chalk.cyan("====================="));
  log(Chalk.cyan("Generating index.html"));
  log(Chalk.cyan("====================="));
  generateHtml(challenges);

  log(Chalk.cyan("====================="));
  log(Chalk.cyan("Update README.md file"));
  log(Chalk.cyan("====================="));
  updateReadMe(challenges);
})();
