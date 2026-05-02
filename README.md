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
- CORS
- Nodemon

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

## Puesta en marcha

### 1. Clonar el repositorio

```bash
git clone https://github.com/axel-617/Videogame-FullStack.git
```

### 2. Instalar y ejecutar el backend

```bash
cd backend
npm install
npm run dev
```

El backend se iniciará en:

```bash
http://localhost:8081
```

### 3. Instalar y ejecutar el frontend

Abrir una segunda terminal con split terminal y ejecutar:

```bash
cd frontend
npm install
npm start
```

El frontend se ejecutará mediante Parcel en un entorno de desarrollo local.

## Estado actual

Proyecto está en fase inicial de desarrollo. Actualmente se ha preparado la estructura base del proyecto, la configuración inicial del backend y del frontend, y el modelo de datos en SQLite.

## Autor

Alejandro Reoyo 