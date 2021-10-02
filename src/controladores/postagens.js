const conexao = require('../conexao')
const secretkey = require('../jwt_secret')
const jwt = require('jsonwebtoken')

const listarPostagens = async (req, res) => {
  try {
    const queryTodasPostagens = 'select * from postagens'
    const postagens = await conexao.query(queryTodasPostagens)

    return res.status(200).json(postagens.rows)
  } catch (error) {
    res.status(400).json(error.message)
  }
}

const listarPostagensUsuario = async (req, res) => {
  const { usuario } = req

  try {
    const queryTodasPostagensUsuario =
      'select * from postagens where usuario_id = $1'
    const postagens = await conexao.query(queryTodasPostagensUsuario, [
      usuario.id,
    ])

    return res.status(200).json(postagens.rows)
  } catch (error) {
    res.status(400).json(error.message)
  }
}

const cadastrarPostagem = async (req, res) => {
  const { texto } = req.body

  const { usuario } = req

  if (!texto) {
    return res.status(404).json('O campo texto é obrigatório')
  }

  try {
    const queryPostagem =
      'insert into postagens (usuario_id, texto) values ($1, $2)'
    const postagem = await conexao.query(queryPostagem, [usuario.id, texto])

    if (postagem.rowCount === 0) {
      return res.status(400).json('Não foi possivel cadastrar a postagem.')
    }
    return res.status(200).json('Postagem cadastrada com sucesso.')
  } catch (error) {
    res.status(400).json(error.message)
  }
}

const atualizarPostagem = async (req, res) => {
  const { texto } = req.body
  const { id: idPostagem } = req.params
  const { usuario } = req

  if (!texto) {
    return res.status(404).json('O campo texto é obrigatório')
  }

  try {
    const queryPostagemExistente =
      'select * from postagens where id = $1 and usuario_id = $2'

    const postagemExistente = await conexao.query(queryPostagemExistente, [
      idPostagem,
      usuario.id,
    ])

    if (postagemExistente.rowCount === 0) {
      return res.status(404).json('A postagem nao foi encontrada')
    }

    const queryPostagem =
      'update postagens set texto = $1 where id = $2 and usuario_id = $3'
    const postagem = await conexao.query(queryPostagem, [
      texto,
      idPostagem,
      usuario.id,
    ])

    if (postagem.rowCount === 0) {
      return res.status(400).json('Não foi possivel atualizar a postagem.')
    }
    return res.status(200).json('Postagem atualizada com sucesso.')
  } catch (error) {
    res.status(400).json(error.message)
  }
}

const excluirPostagem = async (req, res) => {
  const { id } = req.params

  const { usuario } = req

  try {
    const queryPostagemExistente =
      'select * from postagens where id = $1 and usuario_id = $2'

    const postagemExistente = await conexao.query(queryPostagemExistente, [
      id,
      usuario.id,
    ])

    if (postagemExistente.rowCount === 0) {
      return res.status(404).json('A postagem nao foi encontrada')
    }

    const {
      rowCount,
    } = await conexao.query('delete from postagens where id = $1', [id])
    if (rowCount === 0) {
      return res.status(404).json('Não foi possivel excluir a postagem')
    }

    return res.status(200).json('Postagem excluida com sucesso.')
  } catch (error) {
    res.status(400).json(error.message)
  }
}

module.exports = {
  cadastrarPostagem,
  atualizarPostagem,
  excluirPostagem,
  listarPostagens,
  listarPostagensUsuario,
}
