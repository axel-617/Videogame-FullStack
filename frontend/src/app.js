import axios from 'axios';

console.log('Iniciando el frontend...');

axios.get('http://localhost:8081/videogames/')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error:', error);
  });