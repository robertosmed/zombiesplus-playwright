
const { test, expect } = require('../support')
const { faker } = require('@faker-js/faker')
const { executeSQL } = require('../support/database')

test.beforeAll(async () => {
  await executeSQL(`DELETE from leads`)
})


test('deve cadastrar um lead na fila de espera', async ({ page }) => {

  const leadName = faker.person.fullName()
  const leadEmail = faker.internet.email()

  await page.leads.visit()
  await page.leads.openModal()
  await page.leads.submitForm(leadName, leadEmail)

  const message = 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato.'

  await page.popup.haveText(message)

});

test('não deve cadastrar quando email já existe', async ({ page, request }) => {

  const leadName = faker.person.fullName()
  const leadEmail = faker.internet.email()

  const newLead = await request.post('http://localhost:3333/leads', {
    data: {
      name: leadEmail,
      email: leadEmail
    }
  })

  expect(newLead.ok()).toBeTruthy()

  await page.leads.visit()
  await page.leads.openModal()
  await page.leads.submitForm(leadName, leadEmail)

  const message = 'Verificamos que o endereço de e-mail fornecido já consta em nossa lista de espera. Isso significa que você está um passo mais perto de aproveitar nossos serviços.'

  await page.popup.haveText(message)

});


test('não deve cadastrar com email incorreto', async ({ page }) => {


  await page.leads.visit()
  await page.leads.openModal()
  await page.leads.submitForm('Roberto Medeiros', 'robertosm.com.br')

  await page.leads.alertHaveText('Email incorreto')

});

test('não deve cadastrar quando nome não é preenchido', async ({ page }) => {


  await page.leads.visit()
  await page.leads.openModal()
  await page.leads.submitForm('', 'robertosm08@gmail.com')
  await page.leads.alertHaveText('Campo obrigatório')

});

test('não deve cadastrar quando o email não é preenchido', async ({ page }) => {

  await page.leads.visit()
  await page.leads.openModal()
  await page.leads.submitForm('Roberto Medeiros', '')

  await page.leads.alertHaveText('Campo obrigatório')

});


test('não deve cadastrar quando nenhum campo é preenchido', async ({ page }) => {

  await page.leads.visit()
  await page.leads.openModal()
  await page.leads.submitForm('', '')

  await page.leads.alertHaveText(['Campo obrigatório', 'Campo obrigatório'])

});





