const { test, expect } = require('../support')

const data = require('../support/fixture/tvshows.json')

const { executeSQL } = require('../support/database')

test.beforeAll(async () => {
    await executeSQL(`DELETE from tvshows`)
})


test('deve cadastrar uma nova série', async ({ page }) => {
    //importante estar logado
    const serie = data.create

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.series.create(serie)
    await page.popup.haveText(`A série '${serie.title}' foi adicionada ao catálogo.`)

})

test('deve poder remover uma série', async ({ page, request }) => {
    const serie = data.to_remove
    await request.api.postSerie(serie)

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    //td[text()="A Noite dos Mortos-Vivos"]/..//button
    await page.series.remove(serie.title)
    await page.popup.haveText('Série removida com sucesso.')

})

test('não deve cadastrar quando título é duplicado', async ({ page, request }) => {
    //importante estar logado
    const serie = data.duplicate
    await request.api.postSerie(serie)

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.series.create(serie)
    await page.popup.haveText(`O título '${serie.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`)

})

test('não deve cadastrar quando os campos obrigatorios não são preenchidos', async ({ page }) => {

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')

    await page.series.goForm()
    await page.series.submit()

    await page.series.alertHaveText([
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório (apenas números)'
    ])
})

test('deve realizar busca pelo termo the', async ({ page, request }) => {
    const series = data.search

    series.data.forEach(async (s) => {
        await request.api.postSerie(s)
    })

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.series.search(series.input)

    await page.series.tableHave(series.outputs)

})