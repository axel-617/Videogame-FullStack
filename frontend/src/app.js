import { activateCategoriesView } from './categories.js';

document.addEventListener('DOMContentLoaded', function () {
  const categoriesBtn = document.getElementById('categories');

  categoriesBtn.addEventListener('click', function (event) {
    event.preventDefault();
    activateCategoriesView();
  });
});