#!/usr/bin/env node

const program = require("commander");
const colors = require("colors");
const download = require("download-git-repo");
const pjson = require("../package.json");
const fs = require("fs");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const CLI_NAME = pjson.name;
const CLI_NAME = pjson.name;
const CLI_VERSION = pjson.version;
const GIT_BARE_PROJECT = "Tyler-Churchill/gqli-bare-project";
const GIT_FULL_PROJECT = "Tyler-Churchill/gqli-starter-project";

let log = txt => {
  console.log(colors.green(txt));
};

let error = err => {
  console.log(colors.red(err));
};

let warn = txt => {
  console.log(colors.yellow(txt));
};

let trap = txt => {
  console.log(colors.trap(txt));
};

let installDependencies = async () => {
  log("Installing project dependencies... (this can take a few moments)");
  const { stdout, stderr } = await exec("npm install");
  log(stdout);
  error(stderr);
};

let startDev = async () => {
  const { stdout, stderr } = await exec("npm start");
  log(stdout);
  error(stderr);
};

/** commands */
program
  .version(`${CLI_NAME} v ${CLI_VERSION}`)
  .description("Easily begin creating your Node/GraphQL server");

/** create new project */
program
  .command("create <project_name> [project_path]")
  .description("creates project with given name")
  .option(
    "-s, --setup_mode [mode]",
    "Which setup mode to use. 'blank' for bare bones project"
  )
  .action((project_name, project_path, options) => {
    let mode = options.setup_mode || "starter";
    let path = project_path || `./${project_name}`;

    (welcome = () => {
      console.log(
        colors.green.bgWhite.bold.underline(`${CLI_NAME} -v ${CLI_VERSION}`)
      );
      log("Creating project...");
    })();

    if (mode == "blank") {
      log("Downloading bare project...");
      download(GIT_BARE_PROJECT, path, function(err) {
        err ? error(err) : success();
      });
    } else {
      download(GIT_FULL_PROJECT, path, function(err) {
        log("Downloading starter project...");
        err ? error(err) : success();
      });
    }
    let success = () => {
      console.log(colors.rainbow(`Project: ${project_name} created!\n`));
      warn(
        `cd into ${path} and type 'gqli run' to start the project locally\n`
      );
    };
  });

program
  .command("create-model")
  .description("generates a new model")
  .option(
    "-m, --mode [mode]",
    "Blank for both server/client, s for just server, c for just client"
  )
  .action(options => {
    let mode = options.mode || "both";
  });

/** runs project */
program
  .command("run")
  .description("runs " + CLI_NAME + " project in current directory")
  .option(
    "-m, --mode [mode]",
    "Blank for both server/client, s for just server, c for just client"
  )
  .action(options => {
    let mode = options.mode || "both";
    installDependencies()
      .then(() => {
        startDev()
          .then(() => {
            console.log("done");
          })
          .catch(err => {
            error("Error, are you in your project directory?");
          });
      })
      .catch(err => {
        error("Error, are you in your project directory?");
      });
  });

program.parse(process.argv);
