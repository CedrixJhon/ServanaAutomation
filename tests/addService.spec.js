const { time } = require('node:console');
const { test } = require('../fixtures/baseTest');
const { timeout } = require('../playwright.config');


//Known issue: After clicking save service button, the page frezzes
test('Add Service', async ({gotologin,gotoServicesMenu }) => {
    await gotoServicesMenu.addService({timeout: 60000}); 
    
     
  });