const Telegraf = require('telegraf');
require('dotenv').config();

const OPENAI_API_KEY = process.env.OPEN_AI_API;
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command('start', (ctx) => {
  ctx.reply('Welcome to my chat bot! How can I help you today?');
});

bot.on('text', async (ctx) => {
  if (ctx.message.text.startsWith('RM bot')) {
    const response = await fetch(`https://api.openai.com/v1/text-davinci/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        'model': 'text-davinci-002',
        'prompt': ctx.message.text.substring(7)
      })
    });
    const data = await response.json();
    ctx.reply(data.choices[0].text);
  }
});

bot.launch();