const express = require('express');
const cors = require('cors');
const knex = require('knex');
const path = require('path');
 
const app = express();
const port = 8081;

app.use(cors());
app.use(express.json());

//Conexión a la base de datos SQLite usando Knex
const db = knex({
    client: 'sqlite3',
    connection: {
        filename: path.join(__dirname, '..', 'database', 'videogames.db')
    },
    useNullAsDefault: true
});

// ==============CRUD de categories=================
// GET
// Listar todas las categorías
app.get('/categories', async (req, res) => {
    try {
        const categories = await db('categories').select('*');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Buscar una categoría por ID
app.get('/categories/:id', async (req, res) => {
  try {
    const category = await db('categories').where({ id: req.params.id }).first();

    if (!category) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST
// Crear una nueva categoría
app.post('/categories', async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: 'Name y description son campos obligatorios' });
    }

    const [id] = await db('categories').insert({ name, description });

    res.status(201).json({ id, name, description });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT
// Actualizar/modificar una categoría existente
app.put('/categories/:id', async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: 'Name y description son campos obligatorios' });
    }

    const updatedRows = await db('categories').where({ id: req.params.id }).update({ name, description });

    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    const updatedCategory = await db('categories').where({ id: req.params.id }).first();

    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE
// Eliminar una categoría por ID
app.delete('/categories/:id', async (req, res) => {
  try {
    const deletedRows = await db('categories').where({ id: req.params.id }).del();

    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Puerto de escucha del servidor
app.listen(port, () => {
    console.log(`Iniciando el backend en el puerto ${port}`);
});