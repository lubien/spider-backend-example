const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

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

router.get('/users', (ctx, next) => {
    ctx.body = Object.values(users)
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
    users[id] = novoUsuario
    ctx.body = users[id]
    ctx.status = 201
})

router.get('/outro', (ctx, next) => {
    ctx.body = 'Estou em outro'
})

app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(3000)