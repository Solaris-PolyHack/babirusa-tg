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
      text: 'Войти/регистрация 🔑',
      callback_data: 'login'
    },
  ]
];

accept_kb = [
  [
    {
      text: 'Подтвердить 👌',
      callback_data: 'accept_reg'
    },
  ],
  [  
    {
      text: 'Изменить ✏️',
      callback_data: 'change'
    },
  ]
]

code_kb = [
  [
    {
      text: 'Ввести код 🕓',
      callback_data: 'code'
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

    case 'login':
      current_input = 1;
      bot.sendMessage(query.message.chat.id, 'Проверяем ваш аккаунт, секунду...');
      axios.get(`http://10.66.66.33:2107/log_tg?tg_id=${query.from.id}`)
      .then(res => {
        if (res.data.status === 'ok') {
          bot.sendMessage(query.message.chat.id, 'Вы вошли в систему! 👍 Для того, чтобы зайти в Babirusa, пришлите код с экрана.', {
            reply_markup: {
              inline_keyboard: code_kb,
            }
          });
        } else {
          bot.sendMessage(query.message.chat.id, 'Чтобы зарегистрироваться, надо указать немного информации о себе. Сначала, введи своё имя:');
          user.tg_id = query.from.id;
          bot.onText(/^[?!,.а-яА-ЯёЁ0-9\s]+$/, msg => {
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
              bot.clearTextListeners();
            };
          });
        }
      })
      .catch(err => {
        console.log(err);
        bot.sendMessage(query.message.chat.id, 'Что-то пошло не так, попробуйте заново! 😢', {
          reply_markup: {
            inline_keyboard: start_kb,
          }
        });
      });
      break;

    case 'change':
      current_input = 1;
      bot.sendMessage(query.message.chat.id, 'Проверяем ваш аккаунт, секунду...');
      axios.get(`http://10.66.66.33:2107/log_tg?tg_id=${query.from.id}`)
      .then(res => {
        if (res.data.status === 'ok') {
          bot.sendMessage(query.message.chat.id, 'Вы вошли в систему! 👍 Для того, чтобы зайти в Babirusa, пришлите код с экрана.', {
            reply_markup: {
              inline_keyboard: code_kb,
            }
          });
        } else {
          bot.sendMessage(query.message.chat.id, 'Чтобы зарегистрироваться, надо указать немного информации о себе. Сначала, введи своё имя:');
          user.tg_id = query.from.id;
          bot.onText(/^[?!,.а-яА-ЯёЁ0-9\s]+$/, msg => {
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
              bot.clearTextListeners();
            };
          });
        }
      })
      .catch(err => {
        console.log(err);
        bot.sendMessage(query.message.chat.id, 'Что-то пошло не так, попробуйте заново! 😢', {
          reply_markup: {
            inline_keyboard: start_kb,
          }
        });
      });
      break;
    
    case 'accept_reg':
      if (current_input == 4) {
        bot.sendMessage(query.message.chat.id, 'Спасибо за регистрацию! 😊 Для того, чтобы зайти в Babirusa, пришлите код с экрана.', {
          reply_markup: {
            inline_keyboard: code_kb,
          }
        });
        axios.post('http://10.66.66.33:2107/reg_tg', user)
        .catch(err => {
          console.log(err);
          bot.sendMessage(query.message.chat.id, 'Что-то пошло не так, попробуйте заново! 😢', {
            reply_markup: {
              inline_keyboard: start_kb,
            }
          });
        });
      };
      break;

    case 'code':
      bot.sendMessage(query.message.chat.id, 'Отправь шестизначный код с сайта https://babirusa.skifry.ru')
      bot.onText(/[0-9]/, msg => {
        if (msg.text.length === 6) {
          bot.sendMessage(msg.chat.id, 'Код проверяется...');
          axios.post('http://10.66.66.33:2107/code_check', {
            code: msg.text,
            tg_id: msg.from.id
          }).then(res => {
            if (res.data === 'ok') {
              bot.sendMessage(msg.chat.id, 'Вы успешно вошли! Проверьте страницу с кодом, но не обновляйте её.', {
                reply_markup: {
                  inline_keyboard: code_kb,
                }
              });
            } else {
              bot.sendMessage(msg.chat.id, 'Произошла ошибка при обработке, попробуйте еще раз.', {
                reply_markup: {
                  inline_keyboard: code_kb,
                }
              });
            }
          }).catch(err => {
            console.log(err);
            bot.sendMessage(msg.chat.id, 'Произошла ошибка на стороне сервера, попробуйте еще раз.', {
              reply_markup: {
                inline_keyboard: code_kb,
              }
            });
          });
        } else {
          bot.sendMessage(msg.chat.id, 'Чтобы войти, надо прислать шестизначный код с экрана.');
        };
      });
      break;
  
    default:
      bot.sendMessage(query.message.chat.id, 'Произошла ошибка, попробуйте еще раз!');
      break;
  };
});