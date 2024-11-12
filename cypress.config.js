const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportHeight: 1080,
  viewportWidth:  1920,
  video: false,
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },
  env: {
  username: 'elzatlebron@gmail.com',
  password: 'elzatlebron',
  apiUrl: 'https://conduit-api.bondaracademy.com'
  
  },

  retries: {
    runMode: 0,
    openMode: 0
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },

    baseUrl: 'https://conduit.bondaracademy.com/',
    specPattern: 'cypress/e2e/**/*.spec.{js,jsx,ts,tsx}'
    
  },
});
