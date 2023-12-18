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
import { RequestModel } from './models/request-model';
import { GameModel } from './models/game-model';
import { UserModel } from './models/user-model';
import { purchaseController } from './controllers/purchase-controller';
import { statsController } from './controllers/stats-controller';
import { FeeModel } from './models/purchase-model';
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
    // origin: 'localhost:5173'
    origin: '*'
  })
);
// get body from request
app.use(express.json());
app.use(errorMiddleware);

// app.get(
//   routes.request.get,
//   tryCatch(async (req, res) => {
//     return res.json('success');
//   })
// );

// app.post(
//   routes.request.create,
//   tryCatch(async (req, res) => {
//     const { name } = req.body;
//     const { id } = req.params;

//     const user = await requestController.update({
//       id,
//       name
//     });
//     return res.json(user);
//   })
// );

app.put(
  routes.purchase.update,
  tryCatch(async (req, res) => {
    const purchase = req.body;
    const { id } = req.params;

    console.log('purchase', purchase);
    const user = await purchaseController.update({ id, ...purchase });
    return res.json(user);
  })
);

app.patch(
  routes.purchase.status.edit,
  tryCatch(async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    const user = await purchaseController.updateStatus({
      id,
      status
    });
    return res.json(user);
  })
);

app.patch(
  routes.purchase.partialUpdate,
  tryCatch(async (req, res) => {
    const data = req.body;
    const { id } = req.params;

    const user = await purchaseController.partialUpdate({
      id,
      ...data
    });
    return res.json(user);
  })
);

app.get(
  routes.purchase.depositBack,
  tryCatch(async (req, res) => {
    const {} = req.body;
    const { id } = req.params;

    const user = await purchaseController.partialUpdate({
      id,
      deposit: {
        returned: true
      } as any
    });
    return res.json(user);
  })
);

app.get(
  routes.purchase.fakeFeeBack,
  tryCatch(async (req, res) => {
    const {} = req.body;
    const { id } = req.params;

    const user = await purchaseController.partialUpdate({
      id,
      fakeFee: {
        returned: true
      } as any
    });
    return res.json(user);
  })
);

app.get(
  routes.purchase.commissionBack,
  tryCatch(async (req, res) => {
    const {} = req.body;
    const { id } = req.params;

    const user = await purchaseController.partialUpdate({
      id,
      commission: {
        returned: true
      } as any
    });
    return res.json(user);
  })
);

app.post(
  routes.purchase.create,
  tryCatch(async (req, res) => {
    const data = req.body;

    const purchase = await purchaseController.create(data);
    return res.json(purchase);
  })
);

app.get(
  routes.purchase.list,
  tryCatch(async (req, res) => {
    const purchase = await purchaseController.getList();
    return res.json(purchase);
  })
);

app.get(
  routes.purchase.get,
  tryCatch(async (req, res) => {
    const { id } = req.params;
    const purchase = await purchaseController.get(id);
    return res.json(purchase);
  })
);

app.delete(
  routes.purchase.delete,
  tryCatch(async (req, res) => {
    const { id } = req.params;
    const purchase = await purchaseController.delete(id);
    return res.json(purchase);
  })
);

// STATS
app.get(
  routes.stats.get,
  tryCatch(async (req, res) => {
    const stats = await statsController.getStats();
    return res.json(stats);
  })
);

const server = app.listen(port, async () => {
  if (url) {
    await dbConnector.connect(url);
  }
  console.log('server started');
});

// const io = socket(server, {
//   cors: {
//     origin: '*',
//     methods: ['GET', 'POST']
//   }
// });

// io.on('connection', (socket) => {
//   // socket.on('new_message', (data) => {
//   //   console.log('emit');
//   //   io.emit('new_message_server', 'I got your message - ' + data.message);
//   // });
// });

const request: RequestModel = {} as RequestModel;
request.game = {} as GameModel;
request.user = {} as UserModel;

bot.setMyCommands([
  { command: '/pay', description: 'Оплата' },
  { command: '/info', description: 'Информация о пользователе' }
]);

bot.on('message', async (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;

  try {
    if (text === '/info') {
      return bot.sendMessage(chatId, JSON.stringify(request));
    }
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
              {
                text: 'Game 1',
                callback_data: JSON.stringify({ type: 'choose_game', message: 'game_1' })
              },
              {
                text: 'Game 2',
                callback_data: JSON.stringify({ type: 'choose_game', message: 'game_2' })
              }
            ]
          ]
        }
      });
    }
    // return bot.sendMessage(chatId, 'Че за хуйня?');
  } catch (e) {
    return bot.sendMessage(chatId, 'ошибка');
  }
});

bot.on('callback_query', async (response) => {
  const message = JSON.parse(response.data).message;
  const type = JSON.parse(response.data).type;
  const chatId = response.message.chat.id;

  // console.log('data123', JSON.parse(response.data));

  switch (type) {
    case 'choose_game':
      request.game.name = message;
      bot.sendMessage(chatId, 'Введите account id').then(() => {
        bot.once('message', (msg) => {
          request.game.acoountId = msg.text;
          bot.sendMessage(chatId, 'Сколько денешек?').then(() => {
            bot.once('message', (msg) => {
              request.amount = msg.text;
              request.user.languageCode = msg.from.language_code;
              request.user.name = msg.from.first_name;
              request.user.username = msg.from.username;
              request.user.telegramId = msg.from.id;
              console.log('i got msg', request);

              requestController.create(request);
            });
          });
        });
      });

      break;
    default:
      bot.sendMessage(chatId, 'Что-то пошло не так, свяжитесь с менеджером');
  }
});
