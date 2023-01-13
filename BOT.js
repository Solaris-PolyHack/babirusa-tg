require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TGTOKEN, {polling: true});

module.exports = bot;