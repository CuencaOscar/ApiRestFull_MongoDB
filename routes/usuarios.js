const express = require('express')
const bcrypt = require('bcrypt')
const Usuario = require('../models/usuario_model')
const Joi = require('@hapi/joi')
const ruta = express.Router()

// Validacion mediante hapi/joi
const schema = Joi.object({
  nombre: Joi.string()
    .min(3)
    .max(10)
    .required(),

  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{3,30}$/),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})




// Metodo Get -- Leer Data
ruta.get('/', (request, response) => {
  let resultado = listarUsuariosActivos()
  resultado.then(usuarios => {
    response.json(usuarios)
  }).catch(err => {
    response.status(400).json({
      error: err
    })
  })
})

// Metodo Post -- Ingresar Data
ruta.post('/', (request, response) => {
  let body = request.body
  Usuario.findOne({email: body.email}, (err, user) => {
    if (err){
      return response.status(400).json({error: 'Server error'})
    }
    if (user){
      //Usuario existe
      return response.status(400).json({
        msj: 'El usuario ya existe'
      })
    }
  })
  const { value, error } = schema.validate({ nombre: body.nombre, email: body.email })
  if (!error) {
    let resultado = crearUsuario(body)

    resultado.then(user => {
      response.json({
        nombre: user.nombre,
        email: user.email
      })
    }).catch(err => {
      response.status(400).json({
        error: err
      })
    })
  } else {
    response.status(400).json({
      error: error
    })
  }
})

// Metodo Put -- Actualizar Data
ruta.put('/:email', (request, response) => {
  const { value, error } = schema.validate({ nombre: request.body.nombre })

  if (!error) {
    let resultado = actualizarUsuario(request.params.email, request.body)
    resultado.then(valor => {
      response.json({
        nombre: valor.nombre,
        email: valor.email
      })
    }).catch(err => {
      response.status(400).json({
        error: err
      })
    })
  } else {
    response.status(400).json({
      error: error
    })
  }
})

// Metodo Delete -- Eliminar Data
ruta.delete('/:email', (request, response) => {
  let resultado = desactivarUsuario(request.params.email)
  resultado.then(valor => {
    response.json({
      nombre: valor.nombre,
      email: valor.email
    })
  }).catch(err => {
    response.status(400).json({
      error: err
    })
  })
})

async function crearUsuario(body) {
  let usuario = new Usuario({
    email: body.email,
    nombre: body.nombre,
    password: bcrypt.hashSync(body.password, 10)
  })
  return await usuario.save()
}

async function listarUsuariosActivos() {
  let usuarios = await Usuario.find({ "estado": true })
    .select({ nombre: 1, email: 1 })
  return usuarios
}

async function actualizarUsuario(email, body) {
  let usuario = await Usuario.findOneAndUpdate({ "email": email }, {
    $set: {
      nombre: body.nombre,
      password: body.password
    }
  }, { new: true })
  return usuario
}

async function desactivarUsuario(email) {
  let usuario = await Usuario.findOneAndUpdate({ "email": email }, {
    $set: {
      estado: false
    }
  }, { new: true })
  return usuario
}

module.exports = ruta