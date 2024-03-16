const{test} = require('../support')

const data = require('../support/fixture/movies.json')

const {executeSQL} = require('../support/database')


test.only('deve cadastrar um novo filme', async ({page}) =>{

    //importante estar logado
    const movie = data.create
    await executeSQL(`DELETE From movies WHERE title = '${movie.title}';`)

    await page.login.visit()
    await page.login.submit('admin@zombieplus.com', 'pwd123')
    await page.movies.isLoggedIn()

    await page.movies.create(movie.title, movie.overview, movie.company, movie.release_year)

    await page.toast.containText('Cadastro realizado com sucesso!')

})