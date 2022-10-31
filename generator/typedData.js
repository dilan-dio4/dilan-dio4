var { readFileSync } = require('fs');

/** @type {import("./typedData").Readme} */
const typedData = JSON.parse(readFileSync('../readme-data.json'));
module.exports = typedData;