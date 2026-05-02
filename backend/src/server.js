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

// ==============CRUD de developers=================
// GET
// Listar todas las desarrolladoras
app.get('/developers', async (req, res) => {
    try {
        const developers = await db('developers').select('*');
        res.json(developers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Buscar una desarrolladora por ID
app.get('/developers/:id', async (req, res) => {
  try {
    const developer = await db('developers').where({ id: req.params.id }).first();

    if (!developer) {
      return res.status(404).json({ error: 'Desarrolladora no encontrada' });
    }

    res.json(developer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST
// Crear una nueva desarrolladora
app.post('/developers', async (req, res) => {
  try {
    const { name, country } = req.body;

    if (!name || !country) {
      return res.status(400).json({ error: 'Name y country son campos obligatorios' });
    }

    const [id] = await db('developers').insert({ name, country });

    res.status(201).json({ id, name, country });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT
// Actualizar/modificar una desarrolladora existente
app.put('/developers/:id', async (req, res) => {
  try {
    const { name, country } = req.body;

    if (!name || !country) {
      return res.status(400).json({ error: 'Name y country son campos obligatorios' });
    }

    const updatedRows = await db('developers').where({ id: req.params.id }).update({ name, country });

    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Desarrolladora no encontrada' });
    }

    const updatedDeveloper = await db('developers').where({ id: req.params.id }).first();

    res.json(updatedDeveloper);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE
// Eliminar una desarrolladora por ID
app.delete('/developers/:id', async (req, res) => {
  try {
    const deletedRows = await db('developers').where({ id: req.params.id }).del();

    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Desarrolladora no encontrada' });
    }

    res.json({ message: 'Desarrolladora eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==============CRUD de videogames=================
// GET
// Listar todos los videojuegos
app.get('/videogames', async (req, res) => {
    try {
        const videogames = await db('videogames').select('*');
        res.json(videogames);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Buscar un videojuego por ID
app.get('/videogames/:id', async (req, res) => {
  try {
    const videogame = await db('videogames').where({ id: req.params.id }).first();

    if (!videogame) {
      return res.status(404).json({ error: 'Videojuego no encontrado' });
    }

    res.json(videogame);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST
// Crear un nuevo videojuego
app.post('/videogames', async (req, res) => {
  try {
    const { title, price, image, category_id, developer_id } = req.body;

    if (!title || price === undefined || !category_id || !developer_id) {
      return res.status(400).json({ error: 'title, price, category_id y developer_id son campos obligatorios' });
    }

    const [id] = await db('videogames').insert({ title, price, image, category_id, developer_id });

    res.status(201).json({ id, title, price, image, category_id, developer_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT
// Actualizar/modificar un videojuego existente
app.put('/videogames/:id', async (req, res) => {
  try {
    const { title, price, image, category_id, developer_id } = req.body;

    if (!title || price === undefined || !category_id || !developer_id) {
      return res.status(400).json({ error: 'title, price, category_id y developer_id son campos obligatorios' });
    }

    const updatedRows = await db('videogames').where({ id: req.params.id }).update({ title, price, image, category_id, developer_id });

    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Videojuego no encontrado' });
    }

    const updatedVideogame = await db('videogames').where({ id: req.params.id }).first();

    res.json(updatedVideogame);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE
// Eliminar un videojuego por ID
app.delete('/videogames/:id', async (req, res) => {
  try {
    const deletedRows = await db('videogames').where({ id: req.params.id }).del();

    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Videojuego no encontrado' });
    }

    res.json({ message: 'Videojuego eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Puerto de escucha del servidor
app.listen(port, () => {
    console.log(`Iniciando el backend en el puerto ${port}`);
});