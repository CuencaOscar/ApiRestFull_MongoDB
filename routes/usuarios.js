const express = require('express')
const Usuario = require('../models/usuario_model')
const ruta = express.Router()

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
    let resultado = crearUsuario(body)

    resultado.then(user => {
        response.json({
            valor: user
        })
    }).catch( err => {
        response.status(400).json({
            error: err
        })
    })
})

// Metodo Put -- Actualizar Data
ruta.put('/:email', (request, response) => {
    let resultado = actualizarUsuario(request.params.email, request.body)
    resultado.then(valor => {
        response.json({
            valor: valor
        })
    }).catch(err => {
        response.status(400).json({
            error: err
        })
    })
})

// Metodo Delete -- Eliminar Data
ruta.delete('/:email', (request, response) => {
    let resultado = desactivarUsuario(request.params.email)
    resultado.then(valor => {
        response.json({
            valor: valor
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
        password: body.password
    })
    return await usuario.save()
}

async function listarUsuariosActivos() {
    let usuarios = await Usuario.find({"estado": true})
    return usuarios
}

async function actualizarUsuario(email, body) {
    let usuario = await Usuario.findOneAndUpdate(email, {
        $set: {
            nombre: body.nombre,
            password: body.password
        }
    }, {new: true})
    return usuario
}

async function desactivarUsuario(email) {
    let usuario = await Usuario.findOneAndUpdate(email, {
        $set: {
            estado: false
        }
    }, {new: true})
    return usuario
}

module.exports = ruta