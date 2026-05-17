const{expect}=require('@playwright/test');
class LoginPage{
    constructor(page){
        this.page=page;
        this.loginUrl=process.env.BaseURL;
        this.usenameCreds=process.env.user_Name;
        this.passwordCreds=process.env.passWord;
        this.usernameInput=page.getByPlaceholder('Email');
        this.passwordInput=page.getByPlaceholder('Password');
        this.submitButton=page.getByRole('button', { name: 'Log In' });
        this.welcomeMsg=page.getByRole('heading', { name: ' Welcome Back, Admin!' });
        this.qouteMsg=page.getByText('"Servana is your go-to app for booking trusted cleaners, from quick touch-ups to deep cleans."');
        this.forgotPassword=page.getByText(' Forgot password? ');
    }
    async goto(){
        await this.page.goto(this.loginUrl, { timeout: 60000 });
    }
     async login(){
        await this.usernameInput.fill(this.usenameCreds);
        await this.passwordInput.fill(this.passwordCreds);
        await this.submitButton.click();    
    }
    async verifyLoginUI(){
        await expect(this.usernameInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
        await expect(this.submitButton).toBeVisible();
        await expect(this.welcomeMsg).toBeVisible();
        await expect(this.qouteMsg).toBeVisible();
        await expect(this.forgotPassword).toBeVisible();
    }
    async proceedToLogin(){
        await this.goto();
        await this.login();
    }
}
    module.exports={LoginPage};
