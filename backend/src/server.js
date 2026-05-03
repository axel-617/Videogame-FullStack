const express = require("express");
const cors = require("cors");
const knex = require("knex");
const path = require("path");
const { body, validationResult } = require("express-validator");

const app = express();
const port = 8081;

app.use(cors());
app.use(express.json());

//Conexión a la base de datos SQLite usando Knex
const db = knex({
  client: "sqlite3",
  connection: {
    filename: path.join(__dirname, "..", "database", "videogames.db"),
  },
  useNullAsDefault: true,
});

// Validación de la conexión a la base de datos para que las claves foráneas funcionen correctamente
db.raw("PRAGMA foreign_keys = ON")
  .then(() => {
    console.log("Foreign keys activadas correctamente");
  })
  .catch((error) => {
    console.error("Error al activar foreign_keys:", error.message);
  });

// Función para manejar errores de validación y enviar una respuesta con los errores encontrados
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({
    message: "Error de validación",
    errors: errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
    })),
  });
}

// ============== Validaciones para las rutas de categories, developers y videogames =================
const categoryValidation = [
  body("name").trim().notEmpty().withMessage("El nombre es obligatorio").bail().isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres"),

  body("description").trim().notEmpty().withMessage("La descripción es obligatoria").bail().isLength({ min: 3, max: 255 })
    .withMessage("La descripción debe tener entre 3 y 255 caracteres"),

  handleValidationErrors,
];

const developerValidation = [
  body("name").trim().notEmpty().withMessage("El nombre es obligatorio").bail().isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres"),

  body("country").trim().notEmpty().withMessage("El país es obligatorio").bail().isLength({ min: 2, max: 100 })
    .withMessage("El país debe tener entre 2 y 100 caracteres"),

  handleValidationErrors,
];

const videogameValidation = [
  body("title").trim().notEmpty().withMessage("El título es obligatorio").bail().isLength({ min: 2, max: 150 })
    .withMessage("El título debe tener entre 2 y 150 caracteres"),

  body("price").notEmpty().withMessage("El precio es obligatorio").bail().isFloat({ gt: 0 })
    .withMessage("El precio debe ser un número mayor que 0"),

  body("image").optional({ nullable: true, checkFalsy: true }).isURL().withMessage("La imagen debe ser una URL válida"),

  body("category_id").notEmpty().withMessage("La categoría es obligatoria").bail().isInt({ gt: 0 })
    .withMessage("La categoría debe ser un id válido"),

  body("developer_id").notEmpty().withMessage("La desarrolladora es obligatoria").bail().isInt({ gt: 0 })
    .withMessage("La desarrolladora debe ser un id válido"),

  handleValidationErrors,
];

// ==============CRUD de categories=================
// GET
// Listar todas las categorías
app.get("/categories", async (req, res) => {
  try {
    const categories = await db("categories").select("*");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Buscar una categoría por ID
app.get("/categories/:id", async (req, res) => {
  try {
    const category = await db("categories")
      .where({ id: req.params.id })
      .first();

    if (!category) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST
// Crear una nueva categoría
app.post("/categories", categoryValidation, async (req, res) => {
  try {
    const { name, description } = req.body;

    const [id] = await db("categories").insert({ name, description });

    res.status(201).json({ id, name, description });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT") {
      return res.status(400).json({
        error: "Error de base de datos",
        message:
          "Ya existe una categoría con ese nombre o se ha producido una restricción"
      });
    }

    res.status(500).json({ error: error.message });
  }
});

// PUT
// Actualizar/modificar una categoría existente
app.put("/categories/:id", categoryValidation, async (req, res) => {
  try {
    const { name, description } = req.body;

    const updatedRows = await db("categories")
      .where({ id: req.params.id })
      .update({ name, description });

    if (updatedRows === 0) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    const updatedCategory = await db("categories")
      .where({ id: req.params.id })
      .first();

    res.json(updatedCategory);
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT") {
      return res.status(400).json({
        error: "Error de base de datos",
        message:
          "Ya existe una categoría con ese nombre o se ha producido una restricción",
      });
    }

    res.status(500).json({ error: error.message });
  }
});

// DELETE
// Eliminar una categoría por ID
app.delete("/categories/:id", async (req, res) => {
  try {
    const deletedRows = await db("categories")
      .where({ id: req.params.id })
      .del();

    if (deletedRows === 0) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    res.json({ message: "Categoría eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==============CRUD de developers=================
// GET
// Listar todas las desarrolladoras
app.get("/developers", async (req, res) => {
  try {
    const developers = await db("developers").select("*");
    res.json(developers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Buscar una desarrolladora por ID
app.get("/developers/:id", async (req, res) => {
  try {
    const developer = await db("developers")
      .where({ id: req.params.id })
      .first();

    if (!developer) {
      return res.status(404).json({ error: "Desarrolladora no encontrada" });
    }

    res.json(developer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST
// Crear una nueva desarrolladora
app.post("/developers", developerValidation, async (req, res) => {
  try {
    const { name, country } = req.body;

    const [id] = await db("developers").insert({ name, country });

    res.status(201).json({ id, name, country });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT") {
      return res.status(400).json({
        error: "Error de base de datos",
        message:
          "Ya existe una desarrolladora con ese nombre o se ha producido una restricción",
      });
    }

    res.status(500).json({ error: error.message });
  }
});

// PUT
// Actualizar/modificar una desarrolladora existente
app.put("/developers/:id", developerValidation, async (req, res) => {
  try {
    const { name, country } = req.body;

    const updatedRows = await db("developers")
      .where({ id: req.params.id })
      .update({ name, country });

    if (updatedRows === 0) {
      return res.status(404).json({ error: "Desarrolladora no encontrada" });
    }

    const updatedDeveloper = await db("developers")
      .where({ id: req.params.id })
      .first();

    res.json(updatedDeveloper);
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT") {
      return res.status(400).json({
        error: "Error de base de datos",
        message:
          "Ya existe una desarrolladora con ese nombre o se ha producido una restricción",
      });
    }

    res.status(500).json({ error: error.message });
  }
});

// DELETE
// Eliminar una desarrolladora por ID
app.delete("/developers/:id", async (req, res) => {
  try {
    const deletedRows = await db("developers")
      .where({ id: req.params.id })
      .del();

    if (deletedRows === 0) {
      return res.status(404).json({ error: "Desarrolladora no encontrada" });
    }

    res.json({ message: "Desarrolladora eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==============CRUD de videogames=================
// GET
// Listar todos los videojuegos
app.get("/videogames", async (req, res) => {
  try {
    const videogames = await db("videogames").select("*");
    res.json(videogames);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Buscar videojuegos por nombre y filtrarlos por categoría o desarrolladora
app.get("/videogames/filter", async (req, res) => {
  try {
    const { title, category_id, developer_id } = req.query;

    let query = db("videogames");

    if (title) {
      query = query.where("title", "like", `%${title}%`);
    }

    if (category_id) {
      query = query.where("category_id", category_id);
    }

    if (developer_id) {
      query = query.where("developer_id", developer_id);
    }

    const videogames = await query.select("*");
    res.json(videogames);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Buscar un videojuego por ID
app.get("/videogames/:id", async (req, res) => {
  try {
    const videogame = await db("videogames")
      .where({ id: req.params.id })
      .first();

    if (!videogame) {
      return res.status(404).json({ error: "Videojuego no encontrado" });
    }

    res.json(videogame);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST
// Crear un nuevo videojuego
app.post("/videogames", videogameValidation, async (req, res) => {
  try {
    const { title, price, image, category_id, developer_id } = req.body;

    const [id] = await db("videogames").insert({
      title,
      price,
      image,
      category_id,
      developer_id,
    });

    res
      .status(201)
      .json({ id, title, price, image, category_id, developer_id });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT") {
      return res.status(400).json({
        error: "Error de base de datos",
        message:
          "Ya existe un videojuego con ese título o la categoría/desarrolladora no es válida",
      });
    }

    res.status(500).json({ error: error.message });
  }
});

// PUT
// Actualizar/modificar un videojuego existente
app.put("/videogames/:id", videogameValidation, async (req, res) => {
  try {
    const { title, price, image, category_id, developer_id } = req.body;

    const updatedRows = await db("videogames")
      .where({ id: req.params.id })
      .update({ title, price, image, category_id, developer_id });

    if (updatedRows === 0) {
      return res.status(404).json({ error: "Videojuego no encontrado" });
    }

    const updatedVideogame = await db("videogames")
      .where({ id: req.params.id })
      .first();

    res.json(updatedVideogame);
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT") {
      return res.status(400).json({
        error: "Error de base de datos",
        message:
          "Ya existe un videojuego con ese título o la categoría/desarrolladora no es válida",
      });
    }

    res.status(500).json({ error: error.message });
  }
});

// DELETE
// Eliminar un videojuego por ID
app.delete("/videogames/:id", async (req, res) => {
  try {
    const deletedRows = await db("videogames")
      .where({ id: req.params.id })
      .del();

    if (deletedRows === 0) {
      return res.status(404).json({ error: "Videojuego no encontrado" });
    }

    res.json({ message: "Videojuego eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Puerto de escucha del servidor
app.listen(port, () => {
  console.log(`Iniciando el backend en el puerto ${port}`);
});
