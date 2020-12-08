#!/usr/bin/env node

const clear = require("clear");
const figlet = require("figlet");
const cowsay = require("cowsay");
const files = require("../lib/files.js");
const program = require("commander");
const {
  getQuestions,
  getConfigQuestions,
  displaySuggestions,
} = require("../lib/inquirer.js");
const simpleGit = require("simple-git");
const git = simpleGit();
const { jsonReader } = require("../lib/funcs/jsonReader.js");
const version = require("../package.json");
const chalk = require("chalk");
const { exec } = require("child_process");
const fs = require("fs");

clear();

program
  .command("start")
  .alias("s")
  .action(function () {
    // displays Gitg0 on start
    if (files.directoryExists(".git")) {
      console.log(
        figlet.textSync("Gitg0", {
          horizontalLayout: "default",
          verticalLayout: "default",
        }),
        "\n"
      );
      getQuestions();
    } else {
      // checks if the directory is a git based repo or not
      console.log(
        cowsay.say({
          text: "Not a git repository!",
          T: "U ",
        })
      );
      process.exit();
    }
  });

program
  .command("config")
  .alias("c")
  .action(function () {
    // displays Gitg0 on start
    if (files.directoryExists(".git")) {
      console.log(
        figlet.textSync("Gitg0", {
          horizontalLayout: "default",
          verticalLayout: "default",
        }),
        "\n"
      );
      fs.stat("./.gitgo", function (err, stat) {
        if (err == null) {
          // asks task based questions
          getConfigQuestions();
        } else if (err.code === "ENOENT") {
          // file does not exist
          var conf = {
            current_issue: {
              number: "",
              labels: [""],
              title: "",
            },
            commit_guidelines: [""],
            custom_guidelines: false,
            selected_commit_type: "",
            emojis: {
              initial_commit: "tada",
              feature: "sparkles",
              ui: "art",
              code_quality: "package",
              performance: "racehorse",
              security: "lock",
              config: "wrench",
              accessibility: "wheelchair",
              dev_tools: "rocket",
              docs: "pencil",
              release: "gem",
              bug_fix: "bug",
              crash: "boom",
              cleanup: "fire",
              wip: "construction",
            },
            existing_branches: [],
            current_branch: [""],
            current_commit_message: "",
            use_emojis: false,
            commit_config: false,
          };
          fs.writeFile("./.gitgo", JSON.stringify(conf, null, 2), (err) => {
            if (err) console.log("Error writing file:", err);
          });
          getConfigQuestions();
        } else {
          console.log("Some other error: ", err.code);
        }
      });
    } else {
      // checks if the directory is a git based repo or not
      console.log(
        cowsay.say({
          text: "Not a git repository!",
          T: "U ",
        })
      );
      process.exit();
    }
  });

program
  .command("display")
  .alias("d")
  .action(function () {
    // displays Gitg0 on start
    if (files.directoryExists(".git")) {
      console.log(
        figlet.textSync("Gitg0", {
          horizontalLayout: "default",
          verticalLayout: "default",
        }),
        "\n"
      );
      // asks task based questions
      displaySuggestions();
    } else {
      // checks if the directory is a git based repo or not
      console.log(
        cowsay.say({
          text: "Not a git repository!",
          T: "U ",
        })
      );
      process.exit();
    }
  });

program
  .command("checkout")
  .alias("cout")
  .action(function () {
    // displays Gitg0 on start
    if (files.directoryExists(".git")) {
      console.log(
        figlet.textSync("Gitg0", {
          horizontalLayout: "default",
          verticalLayout: "default",
        }),
        "\n"
      );
      jsonReader("./.gitgo", (err, conf) => {
        if (err) {
          console.log("Error reading file:", err);
          return;
        }
        bName = conf.current_branch;
        git.checkoutLocalBranch(bName);
        console.log("Checked out to new branch: " + bName);
      });
    } else {
      // checks if the directory is a git based repo or not
      console.log(
        cowsay.say({
          text: "Not a git repository!",
          T: "U ",
        })
      );
      process.exit();
    }
  });

program
  .command("commit")
  .alias("cmt")
  .action(function () {
    // displays Gitg0 on start
    if (files.directoryExists(".git")) {
      console.log(
        figlet.textSync("Gitg0", {
          horizontalLayout: "default",
          verticalLayout: "default",
        }),
        "\n"
      );
      jsonReader("./.gitgo", (err, conf) => {
        if (err) {
          console.log("Error reading file:", err);
          return;
        }
        cMsg = conf.current_commit_message;
        if (conf.commit_config) {
          conf.commit_config = false;
          conf.current_commit_message = "";
          conf.current_branch = [""];
          conf.existing_branches = [""];
          conf.selected_commit_type = "";
          conf.current_issue.number = "";
          conf.current_issue.labels = [""];
          conf.current_issue.title = "";
          fs.writeFile("./.gitgo", JSON.stringify(conf, null, 2), (err) => {
            if (err) console.log("Error writing file:", err);
          });
          setTimeout(function () {
            exec("git add ./.gitgo", (error, stdout, stderr) => {
              if (error) {
                console.log(`error: ${error.message}`);
                return;
              }
              if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
              }
            });
            git.commit(cMsg);
            console.log(
              "Files have be commited!\nRecent commit message: " + cMsg
            );
          }, 1000);
        } else {
          exec("git reset -- ./.gitgo", (error, stdout, stderr) => {
            if (error) {
              console.log(`error: ${error.message}`);
              return;
            }
            if (stderr) {
              console.log(`stderr: ${stderr}`);
              return;
            }
          });
          git.commit(cMsg);
          console.log(
            "Files have be commited!\nRecent commit message: " + cMsg
          );
        }
      });
    } else {
      // checks if the directory is a git based repo or not
      console.log(
        cowsay.say({
          text: "Not a git repository!",
          T: "U ",
        })
      );
      process.exit();
    }
  });

program
  .command("version")
  .alias("v")
  .action(function () {
    // displays Gitg0 on start
    console.log(
      figlet.textSync("Gitg0", {
        horizontalLayout: "default",
        verticalLayout: "default",
      }),
      "\n"
    );
    console.log("v" + version.version + "-stable");
  });

program
  .command("whoami")
  .alias("w")
  .action(function () {
    // displays Gitg0 on start
    console.log(
      figlet.textSync("Gitg0", {
        horizontalLayout: "default",
        verticalLayout: "default",
      }),
      "\n"
    );
    console.log(
      `You just need to know 7 simple commands you and then you're ${chalk.bold.cyan(
        "gtg"
      )} : ${chalk.magenta("Good to Go")}`
    );
    console.log(chalk.green("\ngtg config:\n"));
    console.log(
      "Use this to set up your project's gitgo configuration. You will be asked certain questions regarding your commit and emoji preferences.\n"
    );
    console.log(chalk.green("\ngtg version:\n"));
    console.log(
      "Use this to check the version of your installed gitg0 package."
    );
    console.log(chalk.green("\ngtg whoami:\n"));
    console.log("I mean,,, you just used me.");
    console.log(chalk.green("\ngtg start:\n"));
    console.log(
      "Use this before you you start working on a new issue so that we can suggest the branch names and commit messages automatically.\n"
    );
    console.log(chalk.green("\ngtg display:\n"));
    console.log(
      `Use this to view the suggested branch name and commit title. You can also edit the suggested text based on your preference. This command should be run after ${chalk.yellow(
        "gtg start"
      )}.\n`
    );
    console.log(chalk.green("\ngtg checkout:\n"));
    console.log(
      `This is a replacement for ${chalk.yellow(
        "git checkout -b"
      )} and will simply checkout with gitgo's suggested branch name.\n`
    );
    console.log(chalk.green("\ngtg checkout:\n"));
    console.log(
      `This is a replacement for ${chalk.yellow(
        "git checkout -m"
      )} and will commit your files once added with gitgo's suggested commit message.\n`
    );
  });

program.parse(process.argv);
