const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "agvymk",
  e2e: {
    baseUrl: "https://qauto.forstudy.space",
    watchForFileChanges: false,
    specPattern: "cypress/e2e/**/*.{cy,spec,test}.{js,jsx,ts,tsx}",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  defaultCommandTimeout: 7000,
  defaultBrowser: "chrome",
  viewportWidth: 1280,
  viewportHeight: 720,
  screenshotsFolder: "cypress/screenshots",
  videosFolder: "cypress/videos"
});
