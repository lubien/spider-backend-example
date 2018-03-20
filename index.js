const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({ users: [] })
  .write()

const app = new Koa()
app.use(bodyParser())

const router = new Router()

let proximoId = 3
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
    const id = ctx.params.id
    if (users[id]) {
        ctx.body = users[ctx.params.id]
    } else {
        ctx.body = 'Not found'
        ctx.status = 404
    }
})

router.post('/users', (ctx, next) => {
    const novoUsuario = ctx.request.body
    const id = proximoId++
    
    ctx.body = db.get('users')
        // insere nos dados do usuário o ID dele
        .push(Object.assign(novoUsuario, { id: id }))
        // Escreve no banco. Isto retorna uma lista, logo pegamos o
        // elemento de índice 0, o recém criado
        .write()[0]
    ctx.status = 201
})

router.put('/users/:id', (ctx, next) => {
    const id = ctx.params.id
    if (users[id]) {
        const novosDados = ctx.request.body
        const usuario = users[id]
        Object.assign(usuario, novosDados)
        ctx.body = usuario
    } else {
        ctx.body = 'Not found'
        ctx.status = 404
    }
})

router.delete('/users/:id', (ctx, next) => {
    const id = ctx.params.id
    if (users[id]) {
        users[id] = undefined
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