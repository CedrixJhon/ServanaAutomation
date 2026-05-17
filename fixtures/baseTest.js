// fixtures/index.js
const { test: base, expect } = require('@playwright/test');
const { LoginPage }     = require('../pages/loginPage');
const { DashboardPage } = require('../pages/dashboard');
const { ServicesPage }  = require('../pages/services');

const test = base.extend({

  // Fixture: loginPage — auto page object injection
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);

    await use(loginPage);
  },
  gotologin: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.proceedToLogin();
    await use(loginPage);
  },
  dasboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);

    await use(dashboardPage);
  },
  servicesPage: async ({ page }, use) => {
    const servicesPage = new ServicesPage(page);
    await use(servicesPage);
  },

  gotoServicesMenu: async ({ page }, use) => {    
    const servicesPage = new ServicesPage(page);
    await servicesPage.gotoServicesMenu();
    await use(servicesPage);
  },

 

});

// Export test and expect so tests require from one place
module.exports = { test, expect };