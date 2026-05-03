import axios from "axios";

const API_URL = "http://localhost:8081/categories";

let editingCategoryId = null;
let categoriesEventsInitialized = false;

// Función para activar la vista de categorías (se llama desde app.js)
export function activateCategoriesView() {
  const title = document.querySelector(".title");
  const searchInput = document.getElementById("search");
  const pagination = document.getElementById("pagination");
  const addCategoryBtn = document.getElementById("add-category-btn");
  const addDeveloperBtn = document.getElementById("add-developer-btn");
  const formSection = document.getElementById("category-form-section");
  const filterSelect = document.getElementById("filter");
  const loginSection = document.getElementById("login-section");

  title.textContent = "Categorías";
  searchInput.classList.add("hidden");
  filterSelect.classList.add("hidden");
  pagination.classList.remove("hidden");
  addCategoryBtn.classList.remove("hidden");
  addDeveloperBtn.classList.add("hidden");
  formSection.classList.add("hidden");
  loginSection.classList.add("hidden");

  initializeCategoriesEvents();
  loadCategories();
}

// Función para inicializar los eventos de la vista de categorías (para evitar duplicar addEventListener)
function initializeCategoriesEvents() {
  if (categoriesEventsInitialized) {
    return;
  }

  const addCategoryBtn = document.getElementById("add-category-btn");
  const categoryForm = document.getElementById("category-form");
  const cancelFormBtn = document.getElementById("cancel-form");

  addCategoryBtn.addEventListener("click", openAddCategoryForm);
  categoryForm.addEventListener("submit", saveCategory);
  cancelFormBtn.addEventListener("click", closeCategoryForm);

  categoriesEventsInitialized = true;
}

// Función para cargar las categorías desde el backend utilizando axios y la variable API_URL declarada al inicio 
async function loadCategories() {
  const itemsContainer = document.getElementById("items");
  
  try {
    const response = await axios.get(API_URL);
    const categories = response.data;
    renderCategories(categories);
  } catch (error) {
    console.error("Error al cargar categorías:", error);
    itemsContainer.innerHTML = "<p>Error al cargar categorías</p>";
  }
}

// Función para renderizar las tarjetas de las categorías y poder editar o eliminar cada una de ellas
function renderCategories(categories) {
  const itemsContainer = document.getElementById("items");
  itemsContainer.innerHTML = "";

  if (categories.length === 0) {
    itemsContainer.innerHTML = "<p>No hay categorías registradas.</p>";
    return;
  }

  categories.forEach(function (category) {
    const card = document.createElement("article");
    card.classList.add("card");

    card.innerHTML = `
      <div class="content">
        <h2>${category.name}</h2>
        <p>${category.description}</p>
        <div class="form-actions">
          <button class="btn btn-outline edit-category-btn">Editar</button>
          <button class="btn btn-solid delete-category-btn">Eliminar</button>
        </div>
      </div>
    `;

    const editBtn = card.querySelector(".edit-category-btn");
    const deleteBtn = card.querySelector(".delete-category-btn");

    editBtn.addEventListener("click", function () {
      openEditCategoryForm(category);
    });

    deleteBtn.addEventListener("click", function () {
      deleteCategory(category.id);
    });

    itemsContainer.appendChild(card);
  });
}

// Función para abrir el formulario de añadir categoría que oculta el listado de las tarjetas de categorías y la paginación
function openAddCategoryForm() {
  const formTitle = document.getElementById("form-title");
  const formSection = document.getElementById("category-form-section");
  const categoryForm = document.getElementById("category-form");
  const nameInput = document.getElementById("category-name");
  const descriptionInput = document.getElementById("category-description");
  const itemsContainer = document.getElementById("items");
  const pagination = document.getElementById("pagination");

  editingCategoryId = null;
  formTitle.textContent = "Nueva categoría";
  categoryForm.reset();
  nameInput.value = "";
  descriptionInput.value = "";

  itemsContainer.classList.add("hidden");
  pagination.classList.add("hidden");
  formSection.classList.remove("hidden");
}

// Abre el formulario para editar la categoría seleccionada, oculatando el listado de categorías y la paginación
function openEditCategoryForm(category) {
  const formTitle = document.getElementById("form-title");
  const formSection = document.getElementById("category-form-section");
  const nameInput = document.getElementById("category-name");
  const descriptionInput = document.getElementById("category-description");
  const itemsContainer = document.getElementById("items");
  const pagination = document.getElementById("pagination");

  editingCategoryId = category.id;
  formTitle.textContent = "Editar categoría";
  nameInput.value = category.name;
  descriptionInput.value = category.description;

  itemsContainer.classList.add("hidden");
  pagination.classList.add("hidden");
  formSection.classList.remove("hidden");
}

// Función para cerrar (cancelar) el formulario de añadir/editar categoría y mostrar el listado de categorías y la paginación
function closeCategoryForm() {
  const formSection = document.getElementById("category-form-section");
  const categoryForm = document.getElementById("category-form");
  const itemsContainer = document.getElementById("items");
  const pagination = document.getElementById("pagination");

  editingCategoryId = null;
  categoryForm.reset();
  formSection.classList.add("hidden");
  itemsContainer.classList.remove("hidden");
  pagination.classList.remove("hidden");
}

// Función para guardar o actualizar una categoría
async function saveCategory(event) {
  event.preventDefault();

  const nameInput = document.getElementById("category-name");
  const descriptionInput = document.getElementById("category-description");

  const name = nameInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!name || !description) {
    alert("Nombre y descripción son obligatorios");
    return;
  }

  const categoryData = {
    name: name,
    description: description,
  };

  try {
    if (editingCategoryId === null) {
      await axios.post(API_URL, categoryData);
    } else {
      await axios.put(`${API_URL}/${editingCategoryId}`, categoryData);
    }

    closeCategoryForm();
    loadCategories();
  } catch (error) {
    console.error("Error al guardar categoría:", error);
    alert("No se pudo guardar la categoría");
  }
}

// Función para eliminar una categoría, mostrando un mensaje de confirmación antes de realizar la acción
async function deleteCategory(id) {
  const confirmed = confirm("¿Seguro que quieres eliminar esta categoría?");

  if (!confirmed) {
    return;
  }

  try {
    await axios.delete(`${API_URL}/${id}`);
    loadCategories();
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    alert("No se pudo eliminar la categoría");
  }
}
