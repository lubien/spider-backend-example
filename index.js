const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({ users: [], proximoId: 1 })
  .write()

const app = new Koa()
app.use(bodyParser())

const router = new Router()

const users = {
    1: { username: 'lubien' },
    2: { username: 'leochrisis' },
}

router.get('/', (ctx, next) => {
    ctx.body = 'Hello World'
})

// CRUD (Create Read Update Delete)

router.get('/users', (ctx, next) => {
    ctx.body = db.get('users')
})

router.get('/users/:id', (ctx, next) => {
    // É importante converter para número se não, vocês nunca vão achar
    // o usuário no banco uma vez que o que vem do URL é uma string.
    const id = Number(ctx.params.id)
    const user = db.get('users').find({ id: id }).value()

    if (user) {
        ctx.body = user
    } else {
        ctx.body = 'Not found'
        ctx.status = 404
    }
})

router.post('/users', (ctx, next) => {
    const novoUsuario = ctx.request.body
    const id = db.get('proximoId').value() // pega o proximoId do DB
    db.update('proximoId', atual => atual + 1).write() // aumenta o proximoId
    db.get('users')
        // insere nos dados do usuário o ID dele
        .push(Object.assign(novoUsuario, { id: id }))
        // Escreve no banco. Isto retorna uma lista, logo pegamos o
        // elemento de índice 0, o recém criado
        .write()

    // encontra o usuário recém inserido
    ctx.body = db.get('users').find({ id: id }).value()
    ctx.status = 201
})

router.put('/users/:id', (ctx, next) => {
    // É importante converter para número se não, vocês nunca vão achar
    // o usuário no banco uma vez que o que vem do URL é uma string.
    const id = Number(ctx.params.id)
    const user = db.get('users').find({ id: id }).value()
    
    if (user) {
        const novosDados = ctx.request.body

        ctx.body = db.get('users')
            .find({ id: id })
            // injeta os novos dados
            .assign(novosDados)
            .write()
    } else {
        ctx.body = 'Not found'
        ctx.status = 404
    }
})

router.delete('/users/:id', (ctx, next) => {
    // É importante converter para número se não, vocês nunca vão achar
    // o usuário no banco uma vez que o que vem do URL é uma string.
    const id = Number(ctx.params.id)
    const user = db.get('users').find({ id: id }).value()
    
    if (user) {
        db.get('users')
            .remove({ id: id })
            .write()
        ctx.body = ''
        ctx.status = 204
    } else {
        ctx.body = 'Not found'
        ctx.status = 404
    }
})

app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(3000)