const { test } = require('../fixtures/baseTest');
const { DashboardPage } = require('../pages/dashboard');
const { LoginPage } = require('../pages/loginPage');
const ExcelReader = require('../utils/excelReader');

// LINE 3: Import the LoginPage POM we built in Step 05


const reader = new ExcelReader('./dataInputs/loginTestData.xlsx');

const testData = reader.getTestData();

test.describe('Login — Data-Driven Tests', () => {

     testData.forEach((row) => {
        const testTitle = `[${row.TC_ID}] Login: ${row.Username || '(empty)'} / ****** — Expected: ${row.ExpectedResult}`;
        test(testTitle, async ({ page }) => {
             test.info().annotations.push(
        { type: 'TC_ID',          description: row.TC_ID },
        { type: 'Username',        description: row.Username || '(empty)' },
        { type: 'Password',        description: row.Password || '(empty)' },
        { type: 'ExpectedResult',  description: row.ExpectedResult }
      );
        const dashboardPage = new DashboardPage(page);
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.loginforMultipleUsers(row.Username, row.Password);
        
        if (row.ExpectedResult.trim() === 'Success') {
          await page.waitForURL('https://servana-web.netlify.app/portal/dashboard', { timeout: 10000 });  
            dashboardPage.gotoDashboard();
            dashboardPage.verifyDashboardUI();

        // ASSERTION 3: Dashboard heading should be visible (confirms we're on the right page)
        // Adjust 'dashboardHeading' locator in loginPage.js to match your app
        

      } else if (row.ExpectedResult.trim() === 'Failed') {
        
        loginPage.verifyLoginFailed();
    

        // OPTIONAL ASSERTION 4: Check for specific error text
        // Only use this if your app shows consistent error messages
        // await expect(loginPage.errorMessage).toContainText('Invalid credentials');

      } else {

        // SAFETY NET: If ExpectedResult has an unexpected value (typo in Excel),
        // throw an error IMMEDIATELY with the TC_ID so you can find the problem row
        throw new Error(
          `[${row.TC_ID}] Invalid ExpectedResult: "${row.ExpectedResult}". Must be 'Success' or 'Failed'`
        );
      }

    }); // end of test()

  }); // end of forEach()

}); // end of test.describe()
