import { activateCategoriesView } from "./categories.js";
import { activateDevelopersView } from "./developers.js";

document.addEventListener("DOMContentLoaded", function () {
  const categoriesBtn = document.getElementById("categories");
  const developersBtn = document.getElementById("developers");

  categoriesBtn.addEventListener("click", function (event) {
    event.preventDefault();
    activateCategoriesView();
  });

  developersBtn.addEventListener("click", function (event) {
    event.preventDefault();
    activateDevelopersView();
  });
});