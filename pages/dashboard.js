const{test,expect}=require('@playwright/test');

class DashboardPage{
    constructor(page){
        this.page=page;
        this.dashboardMenu= page.locator('a').filter({ hasText: 'Dashboard' });
        this.dashboardHeadingUI=page.getByRole('heading', { name: 'Dashboard' });
        this.calendarFilterUI=page.getByRole('button', { name: 'Last 6 months' });
        this.exportBTNUI=page.getByRole('button', { name: 'Export' });
        this.searchInputUI=page.getByRole('textbox', { name: 'Search...' });
        this.totalUsersUI=page.getByText('Total Users');
        this.totalJobOrdersUI=page.getByText('Total Job Orders');
        this.totalEarningsUI=page.getByText('Total Earnings (Servana)');
        this.customersOverviewUI=page.getByRole('heading', { name: 'Customers Overview' });
        this.workersOverviewUI=page.getByRole('heading', { name: 'Workers Overview' }); 
    }

    async gotoDashboard(){
        await this.dashboardMenu.click();
    }

    async verifyDashboardUI(){
        await expect(this.dashboardHeadingUI).toBeVisible();
        await expect(this.calendarFilterUI).toBeVisible();
        await expect(this.exportBTNUI).toBeVisible();
        await expect(this.searchInputUI).toBeVisible();
        await expect(this.totalUsersUI).toBeVisible();
        await expect(this.totalJobOrdersUI).toBeVisible();
        await expect(this.totalEarningsUI).toBeVisible();
        await expect(this.customersOverviewUI).toBeVisible();
        await expect(this.workersOverviewUI).toBeVisible();

        
    }

}
module.exports={DashboardPage};

