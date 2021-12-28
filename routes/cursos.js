const express = require('express')
const ruta = express.Router()

ruta.get('/', (request, response) => {
    response.json('Listo el GET de cursos.')
})

module.exports = ruta