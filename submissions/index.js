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

Handlebars.registerHelper("inc", function (value, _options) {
  return parseInt(value) + 1;
});

function build(challengeLocations) {
  challengeLocations.map((location) => {
    log(Chalk.green(`  Running 'npm run dist' on ${location}`));
    cp.execSync(`npm run dist`, {
      cwd: location,
      env: process.env,
    });
  });
}

function removePrevious(challenges) {
  challenges.map((name) => {
    let folder = join(__dirname, name);
    log(Chalk.green(`  Removing ${folder}`));
    try {
      fs.rmSync(folder, { recursive: true, force: true });
    } catch (error) {
      log(Chalk.red(`  Error removing ${folder}`));
    }
  });
}

function copy(challenges, challengeLocations) {
  challengeLocations.map((location, index) => {
    const sourceFolder = join(location, "dist");
    const targetFolder = join(__dirname, challenges[index]);
    log(Chalk.green(`  Copying files FROM ${sourceFolder} TO ${targetFolder}`));
    fs.cpSync(sourceFolder, targetFolder, { recursive: true, force: true });
  });
}

function minimizeCss(challenges) {
  challenges.map((name) => {
    let cssFolder = join(__dirname, name, "css");
    if (!fs.existsSync(cssFolder) || !fs.statSync(cssFolder).isDirectory()) {
      log(Chalk.red(`  Error: CSS folder not found for ${cssFolder}`));
      return;
    }

    fs.readdirSync(cssFolder, {
      withFileTypes: true,
    }).forEach((file) => {
      if (!file.isFile() || !file.name.endsWith(".css")) return;

      let cssFile = join(cssFolder, file.name);
      let minifiedFile = join(cssFolder, file.name.replace(".css", ".min.css"));
      log(Chalk.green(`  Minifying ${cssFile}`));
      fs.writeFileSync(
        minifiedFile,
        new CleanCSS().minify(fs.readFileSync(cssFile, "utf8")).styles
      );
      fs.renameSync(minifiedFile, cssFile);
    });
  });
}

function uglifyJS(challenges) {
  challenges.map((name) => {
    let jsFolder = join(__dirname, name, "js");
    if (!fs.existsSync(jsFolder) || !fs.statSync(jsFolder).isDirectory()) {
      return;
    }

    fs.readdirSync(jsFolder, {
      withFileTypes: true,
    }).forEach((file) => {
      if (!file.isFile() || !file.name.endsWith(".js")) return;
      let jsFile = join(jsFolder, file.name);
      log(Chalk.green(`  Uglifying ${jsFile}`));
      fs.writeFileSync(
        jsFile,
        UglifyJS.minify(fs.readFileSync(jsFile, "utf8"), UGLIFY_OPTIONS).code,
        "utf8"
      );
    });
  });
}

function generateHtml({ urls }) {
  const indexTemplate = fs.readFileSync(
    join(__dirname, "index.template.html"),
    "utf8"
  );
  Handlebars.parse(indexTemplate);
  const content = Handlebars.compile(indexTemplate)({ urls });
  fs.writeFileSync(join(__dirname, "index.html"), content);
  log(Chalk.green("Done"));
}

function updateReadMe(urls) {
  const readMeTemplate = fs.readFileSync(
    join(PARENT_PATH, "README.template.md"),
    "utf8"
  );
  Handlebars.parse(readMeTemplate);
  const content = Handlebars.compile(readMeTemplate)({ urls });
  fs.writeFileSync(join(PARENT_PATH, "README.md"), content);
  log(Chalk.green("Done"));
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
    urls.push({
      label: folder.name
        .replace(/\-/g, " ")
        .split(" ")
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(" "),
      url: folder.name,
    });
  });

  if (challenges.length === 0) {
    log(Chalk.red("No challenges found"));
    return;
  }

  log(Chalk.cyan("==================="));
  log(Chalk.cyan("Building challenges"));
  log(Chalk.cyan("==================="));
  build(challengeLocations);

  log(Chalk.cyan("============================"));
  log(Chalk.cyan("Removing previous challenges"));
  log(Chalk.cyan("============================"));
  removePrevious(challenges);

  log(Chalk.cyan("=================="));
  log(Chalk.cyan("Copying challenges"));
  log(Chalk.cyan("=================="));
  copy(challenges, challengeLocations);

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
  generateHtml({ urls });

  // log(Chalk.cyan("====================="));
  // log(Chalk.cyan("Update README.md file"));
  // log(Chalk.cyan("====================="));
  // updateReadMe(urls);
})();
