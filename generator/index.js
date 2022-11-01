var { readFileSync, writeFileSync } = require('fs');
/** @type {import("./typedData").Readme} */
const typedData = require('./typedData');

// https://github.com/alexandresanlim/Badges4-README.md-Profile#-languages-

const MAX_DESCRIPTION_LENGTH = 100;

function formatDescription(description) {
    if (description) {
        if (description.length > MAX_DESCRIPTION_LENGTH) {
            return description.substr(0, MAX_DESCRIPTION_LENGTH - 1) + "\u2026";
        } else {
            return description;
        }
    } else {
        return "_No description provided_"
    }
}

const hashSafe = (hashUnsafe) => hashUnsafe.replaceAll(" ", "-").replaceAll("/", "").replaceAll(".", "").toLowerCase();

function joinLinkArray(stringArr) {
    let str = "";
    for (const _currStr of stringArr) {
        str += `[${_currStr}](#${hashSafe(_currStr)}), `
    }
    return str.slice(0, -2);
}

function inlineLinkUl(objArr) {
    let str = "<div>";
    for (const { name, href } of objArr) {
        str += `<a href="${href}" target="_blank"><sup>${name}</sup></a><br />`;
    }
    str += "</div>"
    return str;
}

async function main() {
    const rawHeader = readFileSync('../header.md');
    const rawFooter = readFileSync('../footer.md');

    /** @type {Record<string, import("./typedData").ProjectsEntity[]>} */
    const tagsToProject = {};

    let finalMdString = rawHeader + "\n\n";

    // Header tags
    finalMdString += `<div align='center'>\n\n`;
    for (const { badge, name, link } of typedData.tags) {
        if (link) {
            finalMdString += `[![GitHub badge ${name}](${badge})](${hashSafe(link)})\n`
        } else {
            finalMdString += `![GitHub badge ${name}](${badge})\n`
        }
    }
    finalMdString += `\n\n</div>\n`;

    finalMdString += `
## Table of Contents

* [Skills](#Skills)
* [Projects](#Projects)
* [Bonus](#bonus)
* [Index](#Index)
* [Contact](#contact)

`

    // Skills
    finalMdString += "## Skills\n\n";
    finalMdString += "**Frameworks 🏗️**\n\n";
    for (const _currFramework of typedData.expertise.frameworks) {
        finalMdString += `* ${_currFramework} ([_Index_](#${hashSafe(_currFramework)}))\n`;
    }

    finalMdString += "\n**Languages 🔡**\n\n";
    for (const _currLanguage of typedData.expertise.languages) {
        finalMdString += `* ${_currLanguage} ([_Index_](#${hashSafe(_currLanguage)}))\n`;
    }

    finalMdString += "\n**Databases 📊**\n\n";
    for (const _currDatabase of typedData.expertise.databases) {
        finalMdString += `* ${_currDatabase} ([_Index_](#${hashSafe(_currDatabase)}))\n`;
    }

    finalMdString += "\n**AWS 🌩️**\n\n";
    for (const _currAWS of typedData.expertise.AWS) {
        finalMdString += `* ${_currAWS} ([_Index_](#${hashSafe(_currAWS)}))\n`;
    }

    // Projects
    finalMdString += "## Projects\n\n### Technical products that I have built\n";
    finalMdString += `Name | Description | Technologies | Links\n--- | --- | :---: | :---:`;

    for (const _currProj of typedData.projects) {
        const { description, links, line, name, tags } = _currProj;
        for (const tag of tags) {
            if (tagsToProject[tag]) {
                tagsToProject[tag].push(_currProj);
            } else {
                tagsToProject[tag] = [_currProj];
            }
        }
        finalMdString += `\n **<h5>${name}</h5>** | ${formatDescription(description)}${line ? ` _${line}_` : ""} | <sup> ${joinLinkArray(tags)} </sup> | ${inlineLinkUl(links)}`;
    }

    // Bonus
    finalMdString += "\n\n## Bonus\n\n### Miscellaneous projects I've built\n\n";
    finalMdString += `Name | Description | Technologies | Links\n--- | --- | :---: | :---:`;

    for (const _currBonus of typedData.bonus) {
        const { description, links, line, name, tags } = _currBonus;
        for (const tag of tags) {
            if (tagsToProject[tag]) {
                tagsToProject[tag].push(_currBonus);
            } else {
                tagsToProject[tag] = [_currBonus];
            }
        }
        finalMdString += `\n **<h5>${name}</h5>** | ${formatDescription(description)}${line ? `\n> ${line}` : ""} | <sup> ${joinLinkArray(tags)} </sup> | ${inlineLinkUl(links)}`;
    }

    // Index
    finalMdString += "\n\n## Index\n\n### Reference of language/frameworks to relevant projects\n";
    for (const [tag, projects] of Object.entries(tagsToProject)) {
        finalMdString += `<details><summary>\n\n#### **${tag}**\n\n</summary>\n\n`;
        for (const _currProj of projects) {
            finalMdString += `* [${_currProj.name}](#${hashSafe(_currProj.name)})\n`
        }
        finalMdString += `\n\n</details>`;
    }

    // Contact
    finalMdString += "\n\n";
    finalMdString += rawFooter;

    writeFileSync("README-dev.md", finalMdString);
}

main();