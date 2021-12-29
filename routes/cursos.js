const express = require('express')
const Curso = require('../models/curso_model')
const ruta = express.Router()

ruta.get('/', (request, response) => {
    let resultado = listarCursosActivos()
    resultado.then(curso => {
        response.json(curso)
    }).catch(err => {
        response.status(400).json({
            error: err
        })
    })
})

ruta.post('/', (request, response) => {
    let resultado = crearCurso(request.body)
    resultado.then(curso => {
        response.json({
            curso: curso
        })
    }).catch(error => {
        response.status(400).json({
            error: error
        })
    })
})

ruta.put('/:id', (request, response) => {
    let resultado = actualizarCurso(request.params.id, request.body)
    resultado.then(curso => {
        response.json({
            curso: curso
        })
    }).catch(err => {
        response.status(400).json(err)
    })
})

ruta.delete('/:id', (request, response) => {
    let resultado = desactivarCurso(request.params.id)
    resultado.then(curso => {
        response.json({
            curso: curso
        })
    }).catch(err => {
        response.status(400).json(err)
    })
})

async function listarCursosActivos() {
    let cursos = await Curso.find({ "estado": true })
    return cursos
  }

async function crearCurso(body) {
    let curso = new Curso({
        titulo: body.titulo,
        descripcion: body.descripcion
    })
    return await curso.save()
}

async function actualizarCurso(id, body) {
    let curso = await Curso.findByIdAndUpdate(id, {
        $set: {
            titulo: body.titulo,
            descripcion: body.descripcion
        }
    })
    return await curso.save()
}

async function desactivarCurso(id) {
    let curso = await Curso.findByIdAndUpdate(id, {
      $set: {
        estado: false
      }
    }, { new: true })
    return curso
  }

module.exports = ruta