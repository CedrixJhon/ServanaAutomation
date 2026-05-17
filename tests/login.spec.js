const { test } = require('../fixtures/baseTest');
  // individual test — always async, destructure { page }
  test('Verify Login', async ({loginPage }) => {
    await loginPage.goto();
    await loginPage.verifyLoginUI();
    await loginPage.login();
   
  });
  test('Verify Dashboard UI', async ({gotologin,dasboardPage }) => {
    
    await dasboardPage.gotoDashboard();
    await dasboardPage.verifyDashboardUI();
   
  });

  test('Verify Services UI', async ({gotologin,gotoServicesMenu }) => {
    await gotoServicesMenu.verifyServicesUI();
   
  });
  test('Verify Update Services', async ({gotologin,gotoServicesMenu }) => {
   
    await gotoServicesMenu.ProceedtoUpdateService();
    await gotoServicesMenu.verifyServiceUpdate();
   
  });


