"use strict";

var fs = require("fs");
var { execSync } = require("child_process");

let version = JSON.parse(fs.readFileSync("plugin/manifest.json", "utf-8")).version;
let isDraft = process.argv.includes("draft");
let isPrerelease = process.argv.includes("pre");
let commitHash = execSync("git rev-parse --short HEAD").toString().trim();
let commitLongHash = execSync("git rev-parse HEAD").toString().trim();
let nameVersion = isPrerelease ? `${version}.pre-${commitHash}` : version;
let branch = execSync("git rev-parse --abbrev-ref HEAD");
let masterCommitHash = execSync("git rev-parse origin/master").toString().trim();

if (!isPrerelease) {
    if (branch != "master") {
        throw new Error("Can not make a full release: not on master branch");
    }
    if (commitLongHash != masterCommitHash) {
        throw new Error("Can not make a full release: master is not pushed to remote");
    }
}

execSync("npm run lint");

let chromeName = `./eslint/WebToEpub${version}.zip`;
let firefoxName = `./eslint/WebToEpub${version}.xpi`;
let chromeCopyName = `./eslint/WebToEpub.chrome.${nameVersion}.zip`
let firefoxCopyName = `./eslint/WebToEpub.firefox.${nameVersion}.zip`;

fs.copyFileSync(chromeName, chromeCopyName);
// make firefox version a zip for user to unzip, because unsigned xpis can't be installed
fs.copyFileSync(firefoxName, firefoxCopyName);

let command = `
	gh release create
	${version}${isPrerelease ? ".pre-" + commitHash : ""}
	--title ${version}${isPrerelease ? ".pre-" + commitHash : ""}
	${chromeCopyName}
	${firefoxCopyName}
	--target ${isPrerelease ? commitLongHash : "master"}
	--notes ""
	${isPrerelease ? "--prerelease" : ""}
	${isDraft ? "--draft" : ""}
`.replace(/\n\t?/g, " ").trim();


console.log(command)
execSync(command, {stdio: "inherit"});