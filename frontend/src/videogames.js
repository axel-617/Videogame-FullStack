import axios from "axios";

const API_URL = "http://localhost:8081/videogames";
const CAT_URL = "http://localhost:8081/categories";
const DEV_URL = "http://localhost:8081/developers";
const FILTER_URL = "http://localhost:8081/videogames/filter";

let editingVideogameId = null;
let videogamesEventsInitialized = false;

export function activateVideogamesView() {
  const title = document.querySelector(".title");
  const filtersSection = document.querySelector(".filters");
  const itemsContainer = document.getElementById("items");
  const pagination = document.getElementById("pagination");

  const addVideogameBtn = document.getElementById("add-videogame-btn");
  const addCategoryBtn = document.getElementById("add-category-btn");
  const addDeveloperBtn = document.getElementById("add-developer-btn");

  const videogameFormSection = document.getElementById("videogame-form-section");
  const categoryFormSection = document.getElementById("category-form-section");
  const developerFormSection = document.getElementById("developer-form-section");
  const loginSection = document.getElementById("login-section");

  title.textContent = "Videojuegos";

  filtersSection.classList.remove("hidden");

  addVideogameBtn.classList.remove("hidden");
  addCategoryBtn.classList.add("hidden");
  addDeveloperBtn.classList.add("hidden");

  videogameFormSection.classList.add("hidden");
  categoryFormSection.classList.add("hidden");
  developerFormSection.classList.add("hidden");
  loginSection.classList.add("hidden");

  pagination.classList.remove("hidden");
  itemsContainer.classList.remove("hidden");

  initializeVideogamesEvents();
  loadFilterOptions();
  loadFormSelects();
  loadVideogames();
}

async function loadVideogames(filters = {}) {
  const itemsContainer = document.getElementById("items");

  try {
    const url = Object.keys(filters).length > 0 ? FILTER_URL : API_URL;

    const [videogamesResponse, categoriesResponse, developersResponse] = await Promise.all([
      axios.get(url, { params: filters }),
      axios.get(CAT_URL),
      axios.get(DEV_URL)
    ]);

    const videogames = videogamesResponse.data;
    const categories = categoriesResponse.data;
    const developers = developersResponse.data;

    const categoriesMap = {};
    const developersMap = {};

    categories.forEach(function (category) {
      categoriesMap[category.id] = category.name;
    });

    developers.forEach(function (developer) {
      developersMap[developer.id] = developer.name;
    });

    renderVideogames(videogames, categoriesMap, developersMap);
  } catch (error) {
    console.error("Error al cargar videojuegos:", error);
    itemsContainer.innerHTML = "<p>Error al cargar videojuegos</p>";
  }
}

function renderVideogames(videogames, categoriesMap, developersMap) {
  const itemsContainer = document.getElementById("items");
  itemsContainer.innerHTML = "";

  if (videogames.length === 0) {
    itemsContainer.innerHTML = "<p>No hay videojuegos encontrados.</p>";
    return;
  }

  videogames.forEach(function (game) {
    const card = document.createElement("article");
    card.classList.add("card");

    const categoryName = categoriesMap[game.category_id] || "Sin categoría";
    const developerName = developersMap[game.developer_id] || "Sin desarrolladora";

    card.innerHTML = `
      ${game.image ? `<img src="${game.image}" alt="${game.title}">` : ""}
      <div class="content">
        <h2>${game.title}</h2>
        <p>Precio: ${game.price}€</p>
        <p>Categoría: <span>${categoryName}</span></p>
        <p>Desarrolladora: <span>${developerName}</span></p>
        <div class="form-actions">
          <button class="btn btn-outline edit-game-btn">Editar</button>
          <button class="btn btn-solid delete-game-btn">Eliminar</button>
        </div>
      </div>
    `;

    const editBtn = card.querySelector(".edit-game-btn");
    const deleteBtn = card.querySelector(".delete-game-btn");

    editBtn.addEventListener("click", function () {
      openEditVideogameForm(game);
    });

    deleteBtn.addEventListener("click", function () {
      deleteVideogame(game.id);
    });

    itemsContainer.appendChild(card);
  });
}

function initializeVideogamesEvents() {
  if (videogamesEventsInitialized) {
    return;
  }

  const addVideogameBtn = document.getElementById("add-videogame-btn");
  const videogameForm = document.getElementById("videogame-form");
  const cancelVideogameFormBtn = document.getElementById("cancel-videogame-form");
  const searchInput = document.getElementById("search");
  const categoryFilter = document.getElementById("category-filter");
  const developerFilter = document.getElementById("developer-filter");

  addVideogameBtn.addEventListener("click", openAddVideogameForm);
  videogameForm.addEventListener("submit", saveVideogame);
  cancelVideogameFormBtn.addEventListener("click", closeVideogameForm);

  searchInput.addEventListener("input", applyVideogameFilters);
  categoryFilter.addEventListener("change", applyVideogameFilters);
  developerFilter.addEventListener("change", applyVideogameFilters);

  videogamesEventsInitialized = true;
}

async function loadFormSelects() {
  const categorySelect = document.getElementById("videogame-category");
  const developerSelect = document.getElementById("videogame-developer");

  try {
    const [categoriesResponse, developersResponse] = await Promise.all([
      axios.get(CAT_URL),
      axios.get(DEV_URL)
    ]);

    categorySelect.innerHTML = `<option value="">Selecciona una categoría</option>`;
    developerSelect.innerHTML = `<option value="">Selecciona una desarrolladora</option>`;

    categoriesResponse.data.forEach(function (category) {
      categorySelect.innerHTML += `<option value="${category.id}">${category.name}</option>`;
    });

    developersResponse.data.forEach(function (developer) {
      developerSelect.innerHTML += `<option value="${developer.id}">${developer.name}</option>`;
    });
  } catch (error) {
    console.error("Error al cargar categorías o desarrolladoras:", error);
  }
}

async function loadFilterOptions() {
  const categoryFilter = document.getElementById("category-filter");
  const developerFilter = document.getElementById("developer-filter");

  try {
    const [categoriesResponse, developersResponse] = await Promise.all([
      axios.get(CAT_URL),
      axios.get(DEV_URL)
    ]);

    categoryFilter.innerHTML = `<option value="">Filtrar por categoría</option>`;
    developerFilter.innerHTML = `<option value="">Filtrar por desarrolladora</option>`;

    categoriesResponse.data.forEach(function (category) {
      categoryFilter.innerHTML += `<option value="${category.id}">${category.name}</option>`;
    });

    developersResponse.data.forEach(function (developer) {
      developerFilter.innerHTML += `<option value="${developer.id}">${developer.name}</option>`;
    });
  } catch (error) {
    console.error("Error al cargar filtros:", error);
  }
}

function applyVideogameFilters() {
  const searchValue = document.getElementById("search").value.trim();
  const categoryValue = document.getElementById("category-filter").value;
  const developerValue = document.getElementById("developer-filter").value;

  const params = {};

  if (searchValue) {
    params.title = searchValue;
  }

  if (categoryValue) {
    params.category_id = categoryValue;
  }

  if (developerValue) {
    params.developer_id = developerValue;
  }

  loadVideogames(params);
}

function openAddVideogameForm() {
  const videogameFormTitle = document.getElementById("videogame-form-title");
  const videogameFormSection = document.getElementById("videogame-form-section");
  const videogameForm = document.getElementById("videogame-form");
  const itemsContainer = document.getElementById("items");
  const pagination = document.getElementById("pagination");

  editingVideogameId = null;
  videogameFormTitle.textContent = "Nuevo videojuego";
  videogameForm.reset();

  itemsContainer.classList.add("hidden");
  pagination.classList.add("hidden");
  videogameFormSection.classList.remove("hidden");
}

function openEditVideogameForm(game) {
  const videogameFormTitle = document.getElementById("videogame-form-title");
  const videogameFormSection = document.getElementById("videogame-form-section");
  const itemsContainer = document.getElementById("items");
  const pagination = document.getElementById("pagination");

  editingVideogameId = game.id;
  videogameFormTitle.textContent = "Editar videojuego";

  document.getElementById("videogame-title").value = game.title;
  document.getElementById("videogame-price").value = game.price;
  document.getElementById("videogame-image").value = game.image;
  document.getElementById("videogame-category").value = game.category_id;
  document.getElementById("videogame-developer").value = game.developer_id;

  itemsContainer.classList.add("hidden");
  pagination.classList.add("hidden");
  videogameFormSection.classList.remove("hidden");
}

function closeVideogameForm() {
  const videogameFormSection = document.getElementById("videogame-form-section");
  const videogameForm = document.getElementById("videogame-form");
  const itemsContainer = document.getElementById("items");
  const pagination = document.getElementById("pagination");

  editingVideogameId = null;
  videogameForm.reset();
  videogameFormSection.classList.add("hidden");
  itemsContainer.classList.remove("hidden");
  pagination.classList.remove("hidden");
}

async function saveVideogame(event) {
  event.preventDefault();

  const title = document.getElementById("videogame-title").value.trim();
  const price = document.getElementById("videogame-price").value.trim();
  const image = document.getElementById("videogame-image").value.trim();
  const category_id = document.getElementById("videogame-category").value;
  const developer_id = document.getElementById("videogame-developer").value;

  if (!title || !price || !category_id || !developer_id) {
    alert("Los campos título, precio, categoría y desarrolladora son obligatorios");
    return;
  }

  const videogameData = {
    title,
    price: parseFloat(price),
    image: image || null,
    category_id: parseInt(category_id),
    developer_id: parseInt(developer_id)
  };

  try {
    if (editingVideogameId === null) {
      await axios.post(API_URL, videogameData);
    } else {
      await axios.put(`${API_URL}/${editingVideogameId}`, videogameData);
    }

    closeVideogameForm();
    loadVideogames();
  } catch (error) {
    console.error("Error al guardar videojuego:", error);
    alert("No se pudo guardar el videojuego");
  }
}

async function deleteVideogame(id) {
  const confirmed = confirm("¿Seguro que quieres eliminar este videojuego?");

  if (!confirmed) {
    return;
  }

  try {
    await axios.delete(`${API_URL}/${id}`);
    loadVideogames();
  } catch (error) {
    console.error("Error al eliminar videojuego:", error);
    alert("No se pudo eliminar el videojuego");
  }
}