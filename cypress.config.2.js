const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/results',
    overwrite: false,
    html: false,
    json: true,
  },
  projectId: "agvymk",
  env: {
    userEmail: 'olha.k+2@gmail.com',
    userPassword: 'Qwerty123'
  },
  e2e: {
    baseUrl: "https://qauto2.forstudy.space",
    watchForFileChanges: false,
    specPattern: "cypress/e2e/**/cars_hw21.1/*.{cy,spec,test}.{js,jsx,ts,tsx}",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  defaultCommandTimeout: 7000,
  defaultBrowser: "chrome",
  viewportWidth: 1280,
  viewportHeight: 1080,
  screenshotsFolder: "cypress/screenshots",
  videosFolder: "cypress/videos"
});
