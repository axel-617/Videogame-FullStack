# Videogame Fullstack

Aplicación web full stack para la gestión de videojuegos mediante una API REST desarrollada en Node.js y una base de datos SQLite, con un frontend en HTML, CSS y JavaScript.

## Descripción del proyecto

Este proyecto consiste en una aplicación web dividida en dos partes:

- Un **backend** desarrollado con **Node.js**, **Express** y **SQLite**.
- Un **frontend** desarrollado con **HTML**, **CSS** y **JavaScript**, servido en desarrollo con **Parcel**.

La aplicación permitirá gestionar información relacionada con videojuegos siguiendo operaciones CRUD completas sobre 3 distintas entidades del modelo de datos (videojuegos, categorías y desarrolladoras).

## Tecnologías utilizadas

### Backend
- Node.js
- Express
- SQLite
- Knex
- CORS
- Nodemon
- Express-validator

### Frontend
- HTML
- CSS
- JavaScript
- Parcel
- Axios

## Modelo de datos inicial

La base de datos está organizada en las siguientes entidades:

- **categories**: id, name, description
- **developers**: id, name, country
- **videogames**: id, title, price, image, category_id, developer_id

La entidad `videogames` se relaciona con `categories` y `developers` mediante claves foráneas.

## Requisitos previos

Antes de ejecutar el proyecto, es necesario tener instalados:

- Node.js
- npm

## Puesta en marcha

### 1. Clonar el repositorio

```bash
git clone https://github.com/axel-617/Videogame-FullStack.git
```

### 2. Inicializar el backend

```bash
cd backend
npm install
npm run dev
```

El backend se iniciará en:

```bash
http://localhost:8081
```

### 3. Inicializar el frontend

Abre una segunda terminal y ejecuta:

```bash
cd frontend
npm install
npm start
```

El frontend se ejecutará mediante Parcel en un entorno de desarrollo local.

## Documentación de la API

En la carpeta `/backend/docs` encontrarás un fichero `Videogames-API.json` que contiene la colección de todas las peticiones de ejemplo para probar la API. Puede importarse en **Hoppscotch** o en **Postman**.

## Autor

Alejandro Reoyo 