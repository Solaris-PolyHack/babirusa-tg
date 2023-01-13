const axios = require('axios');

const bot = require('../BOT');

let current_input = 1;

let user = {
  tg_id: '',
  name: '',
  surname: '',
  class: ''
};

start_kb = [
  [  
    {
      text: 'Регистрация 🗝️',
      callback_data: 'reg'
    },
  ]
];

accept_kb = [
  [
    {
      text: 'Подтвердить 👌',
      callback_data: 'accept_reg'
    },
  ]
]

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Привет 👋 \n Это Babirusa Bot, он поможет тебе с входом в систему Babirusa! ", {
    reply_markup: {
      inline_keyboard: start_kb,
    }
  });
});
  
bot.on('callback_query', query => {
  switch (query.data) {
    case 'reg':
      bot.sendMessage(query.message.chat.id, 'Чтобы зарегистрироваться, надо указать немного информации о себе. Сначала, введи своё имя:');
      user.tg_id = query.from.id;
      bot.onText(/^[?!,.а-яА-ЯёЁ0-9\s]+$/, (msg) => {
        if (current_input == 1) {
          user.name = msg.text;
          bot.sendMessage(msg.chat.id, `Твоё имя: ${user.name}. Теперь, введи свою фамилию:`);
          current_input = 2;
        } else if (current_input == 2) {
          user.surname = msg.text;
          bot.sendMessage(msg.chat.id, `Твоя фамилия: ${user.surname}. Теперь, введи свой класс:`);
          current_input = 3;
        } else if (current_input == 3) {
          user.class = msg.text;
          bot.sendMessage(msg.chat.id, `Твой класс: ${user.class}.`);
          bot.sendMessage(msg.chat.id, `Ещё раз проверь данные о себе и нажми на кнопку: \n Имя: ${user.name} \n Фамилия: ${user.surname} \n Класс: ${user.class}`, {
            reply_markup: {
              inline_keyboard: accept_kb,
            }
          });
          current_input = 4;
        };
      });
      break;
    
    case 'accept_reg':
      if (current_input == 4) {
        bot.sendMessage(query.message.chat.id, 'Спасибо за регистрацию! 😊 Для того, чтобы зайти в Babirusa, пришлите код с экрана.');
        axios.post('http://10.66.66.33:2107/reg', user)
        .then(res => console.log(res.data))
        .catch(err => console.log(err));
      };
      break;
  
    default:
      bot.sendMessage(query.message.chat.id, 'Произошла ошибка, попробуйте еще раз!')
      break;
  }
});