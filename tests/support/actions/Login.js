const { expect } = require('@playwright/test')

export class Login {

    constructor(page) {
        this.page = page
    }

    async do(email, password, username){
        await this.visit()
        await this.submit(email, password)
        await this.isLoggedIn(username)
    }

    async visit() {
        await this.page.goto('/admin/login')

        const loginFrom = this.page.locator('.login-form')
        await expect(loginFrom).toBeVisible()
    }

    async submit(email, password) {
        await this.page.getByPlaceholder('E-mail').fill(email)
        await this.page.getByPlaceholder('Senha').fill(password)

        //await this.page.locator('//button[text()="Entrar"]').click()
        await this.page.getByText('Entrar').click()
    }

    async alertHaveText(text) {
        const alert = this.page.locator('span[class$=alert]')
        await expect(alert).toHaveText(text)
    }

    async isLoggedIn(username) {
        // const logoutLink = this.page.locator('a[href="/logout"]')
        // await expect(logoutLink).toBeVisible()
       const loggedUser = this.page.locator('.logged-user')
       await expect(loggedUser).toHaveText(`Olá, ${username}`)
    }

}