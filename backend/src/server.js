const express = require('express');
const cors = require('cors');
const knex = require('knex');
 
const app = express();
const port = 8081;

app.use(cors());
app.use(express.json());

const db = knex({
    client: 'sqlite3',
    connection: {
        filename: '../database/videogames.db'
    },
    useNullAsDefault: true
});
 
app.get('/videogames', async (req, res) => {
    const videogames = await db('videogames').select('*');
    res.json(videogames);
});
  
app.listen(port, () => {
    console.log(`Iniciando el backend en el puerto ${port}`);
});