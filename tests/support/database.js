const { Pool } = require('pg')

const DbConfig = {
    user: 'fmkjnbkb',
    host: 'batyr.db.elephantsql.com',
    databse: 'fmkjnbkb',
    password: 'TqgcJC3boOaBvtQ51CHS51-z-OhEVEuG',
    port: '5432'
}

export async function executeSQL(sqlScript) {

    try {
        const pool = new Pool(DbConfig)
        const client = await pool.connect()

        const result = await client.query(sqlScript)

        console.log(result.rows)
    } catch (error) {
        console.log('Erro ao executar SQL' + error)
    }


}