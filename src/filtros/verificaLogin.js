const conexao = require('../conexao')
const jwt = require('jsonwebtoken')
const secretkey = require('../jwt_secret')

const verificaLogin = async (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization) {
    return res.status(404).json('Token nao informado.')
  }

  try {
    const token = authorization.replace('Bearer', '').trim()

    const { id } = jwt.verify(token, secretkey)

    const queryVerificaID = 'select * from usuarios where id = $1'
    const { rows, rowCount } = await conexao.query(queryVerificaID, [id])

    if (rowCount === 0) {
      return res.status(404).json('O usuario não foi encontrado')
    }

    const { senha, ...usuario } = rows[0]

    req.usuario = usuario

    console.log(usuario)

    next()
  } catch (error) {
    return res.status(400).json(error.message)
  }
}

module.exports = verificaLogin
