const express = require('express')
const login = require('./controladores/login')
const usuarios = require('./controladores/usuarios')
const postagens = require('./controladores/postagens')
const verificaLogin = require('./filtros/verificaLogin')

const rotas = express()
//usuarios

rotas.post('/usuarios', usuarios.cadastrarUsuario)

//login

rotas.post('/login', login.login)

//feed principal

rotas.get('/', postagens.listarPostagens)

//postagens

rotas.use(verificaLogin)

rotas.get('/postagens', postagens.listarPostagensUsuario)
rotas.post('/postagens', postagens.cadastrarPostagem)
rotas.patch('/postagens/:id', postagens.atualizarPostagem)
rotas.delete('/postagens/:id', postagens.excluirPostagem)

module.exports = rotas
