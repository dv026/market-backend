import * as dotenv from 'dotenv';
dotenv.config();
var cors = require('cors');
const socket = require('socket.io');

import express from 'express';

import { routes } from './routes';
import { tryCatch } from './utils/try-catch';
import { errorMiddleware } from './middlewares/error-middleware';
import { requestController } from './controllers/request-controller';
import { dbConnector } from './db-connector';
const TelegramApi = require('node-telegram-bot-api');

const app = express();
const port = 3000;

const telegramToken = process.env.TELEGRAM_TOKEN;
const url = process.env.MONGODB_URL;

const bot = new TelegramApi(telegramToken, { polling: true });
// const server = require('http').createServer(app);
// const io = require('socket.io')(server);
// to allow every origin to connect
app.use(
  cors({
    origin: 'localhost:5173'
  })
);
// get body from request
app.use(express.json());
app.use(errorMiddleware);

app.get(
  routes.request.get,
  tryCatch(async (req, res) => {
    return res.json('success');
  })
);

app.post(
  routes.request.create,
  tryCatch(async (req, res) => {
    const { name } = req.body;
    const { id } = req.params;

    const user = await requestController.update({
      id,
      name
    });
    return res.json(user);
  })
);

const server = app.listen(port, async () => {
  if (url) {
    await dbConnector.connect(url);
  }
  console.log('server started');
});

const io = socket(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  socket.on('new_message', (data) => {
    console.log('emit');
    io.emit('new_message_server', 'I got your message - ' + data.message);
  });
});

bot.setMyCommands([{ command: '/pay', description: 'Оплата' }]);

bot.on('message', async (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;

  try {
    if (text === '/pay') {
      // await UserModel.create({chatId})
      await bot.sendSticker(
        chatId,
        'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp'
      );
      // bot.sendGame(chatId, 'gamedaspokdaposkdpaskp');
      return bot.sendMessage(chatId, 'Choose game', {
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Game 1', callback_data: 'game_1' },
              { text: 'Game 2', callback_data: 'game_2' }
            ]
          ]
        }
      });
    }
    return bot.sendMessage(chatId, 'Че за хуйня?');
  } catch (e) {
    return bot.sendMessage(chatId, 'ошибка');
  }
});

bot.on('callback_query', async (msg) => {
  const data = msg.data;
  const chatId = msg.message.chat.id;
  io.emit('notification_new_request', data);
  return bot.sendMessage(chatId, data);
});
