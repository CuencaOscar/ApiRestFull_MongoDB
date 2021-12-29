const express = require('express')
const config = require('config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Usuario = require('../models/usuario_model')
const ruta = express.Router()

ruta.post('/', (request, response) => {
  Usuario.findOne({ email: request.body.email })
    .then(datos => {
      if (datos) {
        const passwordValido = bcrypt.compareSync(request.body.password, datos.password)
        if (!passwordValido) {
          return response.status(400).json({error: 'ok', msj: 'Usuario o contrasena incorrecta'})
        }
        const jwToken = jwt.sign({
          data: {_id: datos._id, nombre: datos.nombre, email: datos.email}
        }, config.get('configToken.SEED'), {expiresIn: config.get('configToken.expiration')})
        // jwt.sign({_id: datos._id, nombre: datos.nombre, email: datos.email}, 'password')
        response.json({
          usuario: {
            _id: datos._id,
            nomre: datos.nombre,
            email: datos.email
          },
          toke: jwToken
        })
      } else {
        response.status(400).json({
          error: 'ok',
          msj: 'Usuario o contrasena incorrecta.'
        })
      }
    })
    .catch(err => {
      response.status(400).json({
        error: 'ok',
        msj: 'Error en el servicio' + err
      })
    })
})

module.exports = ruta