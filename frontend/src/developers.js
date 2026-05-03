import axios from "axios";

const API_URL = "http://localhost:8081/developers";

let isLoggedIn = false;
let editingDeveloperId = null;
let developersEventsInitialized = false;
let pendingAction = null;

// Función para activar la vista de desarrolladoras (se llama desde app.js)
export function activateDevelopersView() {
  const title = document.querySelector(".title");
  const filtersSection = document.querySelector(".filters");
  const itemsContainer = document.getElementById("items");
  const pagination = document.getElementById("pagination");

  const addDeveloperBtn = document.getElementById("add-developer-btn");
  const addCategoryBtn = document.getElementById("add-category-btn");
  const addVideogameBtn = document.getElementById("add-videogame-btn");

  const developerFormSection = document.getElementById("developer-form-section");
  const categoryFormSection = document.getElementById("category-form-section");
  const videogameFormSection = document.getElementById("videogame-form-section");
  const loginSection = document.getElementById("login-section");

  title.textContent = "Desarrolladoras";

  filtersSection.classList.add("hidden");

  addDeveloperBtn.classList.remove("hidden");
  addCategoryBtn.classList.add("hidden");
  addVideogameBtn.classList.add("hidden");

  developerFormSection.classList.add("hidden");
  categoryFormSection.classList.add("hidden");
  videogameFormSection.classList.add("hidden");
  loginSection.classList.add("hidden");

  pagination.classList.remove("hidden");
  itemsContainer.classList.remove("hidden");

  initializeDevelopersEvents();
  loadDevelopers();
}

// Función para inicializar los eventos de la vista de desarrolladoras (para evitar duplicar addEventListener)
function initializeDevelopersEvents() {
  if (developersEventsInitialized) {
    return;
  }

  const addDeveloperBtn = document.getElementById("add-developer-btn");
  const developerForm = document.getElementById("developer-form");
  const cancelDeveloperFormBtn = document.getElementById("cancel-developer-form");
  const cancelLoginBtn = document.getElementById("cancel-login");

  addDeveloperBtn.addEventListener("click", function () {
    protectAction(function () {
      openAddDeveloperForm();
    });
  });

  developerForm.addEventListener("submit", saveDeveloper);
  cancelDeveloperFormBtn.addEventListener("click", closeDeveloperForm);
  cancelLoginBtn.addEventListener("click", closeLoginScreen);

  developersEventsInitialized = true;
}

// Función para cargar las desarrolladoras desde el backend utilizando axios y la variable API_URL declarada al inicio
async function loadDevelopers() {
  const itemsContainer = document.getElementById("items");

  try {
    const response = await axios.get(API_URL);
    renderDevelopers(response.data);
  } catch (error) {
    console.error("Error al cargar desarrolladoras:", error);
    itemsContainer.innerHTML = "<p>Error al cargar desarrolladoras</p>";
  }
}

// Función para renderizar las tarjetas de las desarrolladoras y poder editar o eliminar cada una de ellas (tras el login)
function renderDevelopers(developers) {
  const itemsContainer = document.getElementById("items");
  itemsContainer.innerHTML = "";

  if (developers.length === 0) {
    itemsContainer.innerHTML = "<p>No hay desarrolladoras registradas.</p>";
    return;
  }

  developers.forEach(function (dev) {
    const card = document.createElement("article");
    card.classList.add("card");

    card.innerHTML = `
      <div class="content">
        <h2>${dev.name}</h2>
        <p>País: ${dev.country}</p>
        <div class="form-actions">
          <button class="btn btn-outline edit-dev">Editar</button>
          <button class="btn btn-solid delete-dev">Eliminar</button>
        </div>
      </div>
    `;

    const editBtn = card.querySelector(".edit-dev");
    const deleteBtn = card.querySelector(".delete-dev");

    editBtn.addEventListener("click", function () {
      protectAction(function () {
        openEditDeveloperForm(dev);
      });
    });

    deleteBtn.addEventListener("click", function () {
      protectAction(function () {
        deleteDeveloper(dev.id);
      });
    });

    itemsContainer.appendChild(card);
  });
}

// Función para proteger las acciones de editar, añadir o eliminar desarrolladoras
function protectAction(callback) {
  if (isLoggedIn) {
    callback();
  } else {
    pendingAction = callback;
    showLoginScreen();
  }
}

// Función para mostrar el formulario de login si el usuario no ha iniciado sesión, y ejecutar la acción tras el login exitoso
function showLoginScreen() {
  const developerFormSection = document.getElementById("developer-form-section");
  const categoryFormSection = document.getElementById("category-form-section");
  const loginSection = document.getElementById("login-section");
  const itemsContainer = document.getElementById("items");
  const pagination = document.getElementById("pagination");
  const loginForm = document.getElementById("login-form");

  developerFormSection.classList.add("hidden");
  categoryFormSection.classList.add("hidden");
  loginSection.classList.remove("hidden");
  itemsContainer.classList.add("hidden");
  pagination.classList.add("hidden");

  loginForm.onsubmit = function (e) {
    e.preventDefault();

    const user = document.getElementById("login-username").value.trim();
    const pass = document.getElementById("login-password").value.trim();

    if (user === "admin" && pass === "1234") {
      isLoggedIn = true;
      loginSection.classList.add("hidden");
      loginForm.reset();
      itemsContainer.classList.remove("hidden");
      pagination.classList.remove("hidden");

      if (pendingAction) {
        pendingAction();
        pendingAction = null;
      }
    } else {
      alert("Credenciales incorrectas");
    }
  };
}

// Función para cerrar (cancelar) el formulario de login y mostrar el listado de desarrolladoras
function closeLoginScreen() {
  const loginSection = document.getElementById("login-section");
  const loginForm = document.getElementById("login-form");
  const itemsContainer = document.getElementById("items");
  const pagination = document.getElementById("pagination");

  pendingAction = null;
  loginForm.reset();
  loginSection.classList.add("hidden");
  itemsContainer.classList.remove("hidden");
  pagination.classList.remove("hidden");
}

// Abrir el formulario para crear una nueva desarrolladora (ocultando el listado de desarrolladoras y la paginación)
function openAddDeveloperForm() {
  const developerFormSection = document.getElementById("developer-form-section");
  const developerFormTitle = document.getElementById("developer-form-title");
  const developerForm = document.getElementById("developer-form");
  const itemsContainer = document.getElementById("items");
  const pagination = document.getElementById("pagination");
  const loginSection = document.getElementById("login-section");

  editingDeveloperId = null;
  developerFormTitle.textContent = "Nueva desarrolladora";
  developerForm.reset();

  loginSection.classList.add("hidden");
  itemsContainer.classList.add("hidden");
  pagination.classList.add("hidden");
  developerFormSection.classList.remove("hidden");
}

// Abrir el formulario para editar la desarrolladora seleccionada
function openEditDeveloperForm(dev) {
  const developerFormSection = document.getElementById("developer-form-section");
  const developerFormTitle = document.getElementById("developer-form-title");
  const developerName = document.getElementById("developer-name");
  const developerCountry = document.getElementById("developer-country");
  const itemsContainer = document.getElementById("items");
  const pagination = document.getElementById("pagination");
  const loginSection = document.getElementById("login-section");

  editingDeveloperId = dev.id;
  developerFormTitle.textContent = "Editar desarrolladora";
  developerName.value = dev.name;
  developerCountry.value = dev.country;

  loginSection.classList.add("hidden");
  itemsContainer.classList.add("hidden");
  pagination.classList.add("hidden");
  developerFormSection.classList.remove("hidden");
}

// Cerrar el formulario de añadir/editar desarrolladora y mostrar el listado de desarrolladoras y la paginación
function closeDeveloperForm() {
  const developerFormSection = document.getElementById("developer-form-section");
  const developerForm = document.getElementById("developer-form");
  const itemsContainer = document.getElementById("items");
  const pagination = document.getElementById("pagination");

  editingDeveloperId = null;
  developerForm.reset();
  developerFormSection.classList.add("hidden");
  itemsContainer.classList.remove("hidden");
  pagination.classList.remove("hidden");
}

// Guardar o actualizar una desarrolladora
async function saveDeveloper(event) {
  event.preventDefault();

  const developerName = document.getElementById("developer-name");
  const developerCountry = document.getElementById("developer-country");

  const name = developerName.value.trim();
  const country = developerCountry.value.trim();

  if (!name || !country) {
    alert("Nombre y país son obligatorios");
    return;
  }

  const developerData = {
    name: name,
    country: country,
  };

  try {
    if (editingDeveloperId === null) {
      await axios.post(API_URL, developerData);
    } else {
      await axios.put(`${API_URL}/${editingDeveloperId}`, developerData);
    }

    closeDeveloperForm();
    loadDevelopers();
  } catch (error) {
    console.error("Error al guardar desarrolladora:", error);
    alert("No se pudo guardar la desarrolladora");
  }
}

// Eliminar una desarrolladora
async function deleteDeveloper(id) {
  const confirmed = confirm("¿Seguro que quieres eliminar esta desarrolladora?");

  if (!confirmed) {
    return;
  }

  try {
    await axios.delete(`${API_URL}/${id}`);
    loadDevelopers();
  } catch (error) {
    console.error("Error al eliminar desarrolladora:", error);
    alert("No se pudo eliminar la desarrolladora");
  }
}