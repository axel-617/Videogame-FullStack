import { activateCategoriesView } from "./categories.js";
import { activateDevelopersView } from "./developers.js";
import { activateVideogamesView } from "./videogames.js";

document.addEventListener("DOMContentLoaded", function () {
  const videogamesBtn = document.getElementById("videogames");
  const categoriesBtn = document.getElementById("categories");
  const developersBtn = document.getElementById("developers");

  activateVideogamesView();

  videogamesBtn.addEventListener("click", function (event) {
    event.preventDefault();
    activateVideogamesView();
  });

  categoriesBtn.addEventListener("click", function (event) {
    event.preventDefault();
    activateCategoriesView();
  });

  developersBtn.addEventListener("click", function (event) {
    event.preventDefault();
    activateDevelopersView();
  });
});