const{expect}=require('@playwright/test');
const { serviceName, category, option1Name, itemName, basePrice, inclusions, exclusions} = require('../dataInputs/servicesdata');
class ServicesPage{
    constructor(page){
        this.page=page; 
        this.servicesMenu=page.getByText('Services');

        // Services Page UI Elements
        this.serviceListHeadingUI=page.getByRole('heading', { name: ' Services List ' });
        this.serviceCalendarFilterUI=page.getByText('Last 6 months');
        this.serviceSearchInputUI=page.getByPlaceholder('Search...');
        this.servicedateStartFilterUI=page.getByPlaceholder('Select date start');   
        this.servicedateEndFilterUI=page.getByPlaceholder('Select date end');
        this.serviceImportUI=page.getByRole('button', { name: 'Import' });
        this.serviceExportUI=page.getByRole('main').getByRole('button', { name: 'Export' });
        
        
        //Add Service Button
        this.addServiceButton=page.getByRole('button', { name: 'Add Service' });
        //Save Service Button
        this.saveServiceButton=page.getByRole('button', { name: ' Save Service ' });
        // Update Services Page Elements
        this.filterPage=page.getByRole('combobox').first();

        //Services icon
        this.lastTstServiceUpdate=page.locator('tr:nth-child(7) > td > .flex > .transition-all.font-medium.inline-flex.justify-center.text-gray-500.hover\\:text-gray-800.p-1\\.5.rounded-md.dark\\:text-orange-500.hover\\:underline.hover\\:scale-110.cursor-pointer.ng-star-inserted');
        this.secondlastTstServiceUpdate=page.locator('tr:nth-child(6) > td > .flex > .transition-all.font-medium.inline-flex.justify-center.text-gray-500.hover\\:text-gray-800.p-1\\.5.rounded-md.dark\\:text-orange-500.hover\\:underline.hover\\:scale-110.cursor-pointer.ng-star-inserted');
        //Sercice Form Fields
        this.serviceNameField=page.getByRole('textbox', { name: 'Service Name' });
        this.categoryField=page.getByRole('textbox', { name: 'Category' });

        //Add Options
        this.addOptionButton=page.getByRole('button', { name: 'Add Option' })
        //Remove Options
        this.removeOptionButton=page.getByRole('button', { name: 'Remove Option' });
        //Options Fields
        this.option1NameField=page.getByPlaceholder('e.g. Cleaning, Installation');
        
        //Add Items
        this.AddItemButton=page.getByRole('button', { name: '+ Add Item' });
        //Remove Items
        this.RemoveItemButton=page.getByRole('button', { name: 'Remove Item' });

        //Items
        this.itemNameField=page.getByPlaceholder('e.g. Window, Split Type');
        this.selectUnit_Item=page.getByRole('combobox').first();
        this.basePriceField=page.locator('app-input').filter({ hasText: 'Base Price' }).getByPlaceholder('0.00');
        this.inclusionsField=page.getByRole('textbox', { name: 'One inclusion per line' });
        this.exclusionsField=page.getByRole('textbox', { name: 'One exclusion per line' });

        this.updateServiceButton=page.getByRole('button', { name: ' Update Service ' });

        

    }


                
    async gotoServicesMenu(){
        await this.servicesMenu.click();
    }
    async addService(){
        await this.addServiceButton.click();
        await this.serviceNameField.fill(serviceName);
        await this.categoryField.fill(category);
        await this.saveServiceButton.click();

        
    }
    async verifyServicesUI(){
        await expect(this.serviceListHeadingUI).toBeVisible();
        await expect(this.serviceCalendarFilterUI).toBeVisible();
        await expect(this.serviceSearchInputUI).toBeVisible();
        await expect(this.servicedateStartFilterUI).toBeVisible();
        await expect(this.servicedateEndFilterUI).toBeVisible();
        await expect(this.serviceImportUI).toBeVisible();
        await expect(this.serviceExportUI).toBeVisible();
    }
    async updateandverifyServiceNotOptionsItems(){
        await this.filterPage.selectOption('20');
        await this.secondlastTstServiceUpdate.click();  
        await  this.serviceNameField.fill(serviceName);
        await this.categoryField.fill(category);
        await this.RemoveItemButton.click();
        await this.removeOptionButton.click();
        await this.updateServiceButton.click();
        //verify UI after update
        await this.secondlastTstServiceUpdate.click();  
        await expect(this.serviceNameField).toHaveValue(serviceName);
        await expect(this.categoryField).toHaveValue(category);
        await expect(this.option1NameField).toBeEmpty();
        await expect(this.itemNameField).toBeEmpty();
      
    }
    async ProceedtoUpdateService(){
        await this.filterPage.selectOption('20');
        await this.lastTstServiceUpdate.click();
        await this.serviceNameField.fill(serviceName);
        await this.categoryField.fill(category);
        await this.option1NameField.fill(option1Name);
        await this.itemNameField.fill(itemName);
        await this.selectUnit_Item.selectOption('per hour');
        await this.basePriceField.fill(basePrice);
        await this.inclusionsField.fill(inclusions);
        await this.exclusionsField.fill(exclusions);
        await this.updateServiceButton.click();
    }
    async verifyServiceUpdate(){
        await this.filterPage.selectOption('20');
        await this.lastTstServiceUpdate.click();
        await expect(this.serviceNameField).toHaveValue(serviceName);
        await expect(this.categoryField).toHaveValue(category);
        await expect(this.option1NameField).toHaveValue(option1Name);
        await expect(this.itemNameField).toHaveValue(itemName);
        await expect(this.basePriceField).toHaveValue(basePrice);
        await expect(this.inclusionsField).toHaveValue(inclusions);
        await expect(this.exclusionsField).toHaveValue(exclusions);
    }
}
module.exports={ServicesPage};