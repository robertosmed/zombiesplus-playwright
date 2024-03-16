
const { test, expect } = require('@playwright/test')
const { faker } = require('@faker-js/faker')
const {LandingPage} = require('../pages/LandingPage')
const {Toast} = require('../pages/Components')

let landingPage
let toast

test.beforeEach(async({page})=>{
  landingPage = new LandingPage(page)
  toast = new Toast(page)
})


test('deve cadastrar um lead na fila de espera', async ({ page }) => {

  const leadName = faker.person.fullName()
  const leadEmail = faker.internet.email()
  
  await page.landing.visit()
  await page.landing.openModal()
  await page.landing.submitForm(leadName, leadEmail)

  const message = 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!'

  await page.toast.containText(message)
 
});

test('não deve cadastrar quando email já existe', async ({ page, request }) => {

  const leadName = faker.person.fullName()
  const leadEmail = faker.internet.email()

  const newLead = await request.post('http://localhost:3333/leads', {
    data:{
      name: leadEmail,
      email: leadEmail
    }
  })

  expect(newLead.ok()).toBeTruthy()
  
  await page.landing.visit()
  await page.landing.openModal()
  await page.landing.submitForm(leadName, leadEmail)

  const message = 'O endereço de e-mail fornecido já está registrado em nossa fila de espera.'

  await page.toast.containText(message)
 
});


test('não deve cadastrar com email incorreto', async ({ page }) => {
  
  
  await page.landing.visit()
  await page.landing.openModal()
  await page.landing.submitForm('Roberto Medeiros', 'robertosm.com.br')

  await page.landing.alertHaveText('Email incorreto')

});

test('não deve cadastrar quando nome não é preenchido', async ({ page }) => {
  
  
  await page.landing.visit()
  await page.landing.openModal()
  await page.landing.submitForm('', 'robertosm08@gmail.com')
  await page.landing.alertHaveText('Campo obrigatório')

});

test('não deve cadastrar quando o email não é preenchido', async ({ page }) => {
  
  await page.landing.visit()
  await page.landing.openModal()
  await page.landing.submitForm('Roberto Medeiros', '')

  await page.landing.alertHaveText('Campo obrigatório')

});


test('não deve cadastrar quando nenhum campo é preenchido', async ({ page }) => {
  
  await page.landing.visit()
  await page.landing.openModal()
  await page.landing.submitForm('', '')

  await page.landing.alertHaveText(['Campo obrigatório','Campo obrigatório'])

});





