import * as dotenv from 'dotenv'
dotenv.config()
var cors = require('cors')
import { StreamChat } from 'stream-chat'
import express from 'express'

import { routes } from './routes'
import { tryCatch } from './utils/try-catch'
import { errorMiddleware } from './middlewares/error-middleware'
import { dbConnector } from './db-connector'
import { purchaseController } from './controllers/purchase-controller'
import { statsController } from './controllers/stats-controller'

const app = express()
const port = 3000

const url = process.env.MONGODB_URL

app.use(
  cors({
    origin: '*',
  })
)

// get body from request
app.use(express.json())
app.use(errorMiddleware)

app.put(
  routes.purchase.update,
  tryCatch(async (req, res) => {
    const purchase = req.body
    const { id } = req.params

    const user = await purchaseController.update({ id, ...purchase })
    return res.json(user)
  })
)

app.patch(
  routes.purchase.status.edit,
  tryCatch(async (req, res) => {
    const { status } = req.body
    const { id } = req.params

    const user = await purchaseController.updateStatus({
      id,
      status,
    })
    return res.json(user)
  })
)

app.patch(
  routes.purchase.partialUpdate,
  tryCatch(async (req, res) => {
    const data = req.body
    const { id } = req.params

    const user = await purchaseController.partialUpdate({
      id,
      ...data,
    })
    return res.json(user)
  })
)

app.get(
  routes.purchase.depositBack,
  tryCatch(async (req, res) => {
    const {} = req.body
    const { id } = req.params

    const user = await purchaseController.partialUpdate({
      id,
      deposit: {
        returned: true,
      } as any,
    })
    return res.json(user)
  })
)

app.get(
  routes.purchase.fakeFeeBack,
  tryCatch(async (req, res) => {
    const {} = req.body
    const { id } = req.params

    const user = await purchaseController.partialUpdate({
      id,
      fakeFee: {
        returned: true,
      } as any,
    })
    return res.json(user)
  })
)

app.get(
  routes.purchase.commissionBack,
  tryCatch(async (req, res) => {
    const {} = req.body
    const { id } = req.params

    const user = await purchaseController.partialUpdate({
      id,
      commission: {
        returned: true,
      } as any,
    })
    return res.json(user)
  })
)

app.post(
  routes.purchase.create,
  tryCatch(async (req, res) => {
    const data = req.body

    const purchase = await purchaseController.create(data)
    return res.json(purchase)
  })
)

app.get(
  routes.purchase.list,
  tryCatch(async (_, res) => {
    const purchase = await purchaseController.getList()
    return res.json(purchase)
  })
)

app.get(
  routes.purchase.get,
  tryCatch(async (req, res) => {
    const { id } = req.params
    const purchase = await purchaseController.get(id)
    return res.json(purchase)
  })
)

app.delete(
  routes.purchase.delete,
  tryCatch(async (req, res) => {
    const { id } = req.params
    const purchase = await purchaseController.delete(id)
    return res.json(purchase)
  })
)

// STATS
app.get(
  routes.stats.get,
  tryCatch(async (_, res) => {
    const stats = await statsController.getStats()
    return res.json(stats)
  })
)

app.post(
  routes.auth.login,
  tryCatch(async (req, res) => {
    const data = req.body

    if (!data.id) {
      return res.json({
        token: '',
        error: 'not found id',
      })
    }

    const serverClient = StreamChat.getInstance(api_key, api_secret)
    await serverClient.upsertUser({
      id: data.id,
      role: 'admin',
    })
    const token = serverClient.createToken(data.id)

    return res.json({
      token,
    })
  })
)

const api_key = process.env.CHAT_API_KEY
const api_secret = process.env.CHAT_API_SECRET

app.listen(port, async () => {
  // if (url) {
  //  await dbConnector.connect(url)
  // }
  console.log('server started')

  const client = new StreamChat(api_key, { allowServerSideConnect: true })

  const serverClient = StreamChat.getInstance(api_key, api_secret)
  const token = serverClient.createToken('admin')

  client.connectUser({ id: 'admin' }, token)

  const channel = client.channel('messaging', 'ai_assistant')

  await channel.watch()

  channel.on('message.new', (event) => {
    if (event.message.text.includes('help')) {
      channel.sendMessage({
        text: 'Hepl is coming',
      })
    }
  })

  console.log('connected')
})
