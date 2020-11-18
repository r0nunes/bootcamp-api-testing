/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */


const selectTests = require('cypress-select-tests')

const pickTests = (filename, foundTests, cypressConfig) => {

  let foundedTests = []

  cypressConfig.env.grep.forEach(grepName => {
   let testNames = foundTests.filter(fullTestName => fullTestName.join(' ').includes(grepName))
    if (testNames) {
      foundedTests.push(...testNames)
    }
  })

  return foundedTests;
}

module.exports = (on, config) => {
  on('file:preprocessor', selectTests(config, pickTests))
}