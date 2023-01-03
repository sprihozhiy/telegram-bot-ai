const { Telegraf } = require('telegraf');
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_API,
});
const openai = new OpenAIApi(configuration);
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command('start', (ctx) => {
    ctx.reply('Hey fella! How can I help you?');
  });
  
bot.on('text', async (ctx) => {
    if (ctx.message.mention) {
        try {
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: ctx.message.text,
            temperature: 0.5,
            max_tokens: 150
        });
        // console.log(response.data);
        ctx.reply(response.data.choices[0].text);
        } catch (error) {
            console.error(error);
            ctx.reply('Sorry, something went wrong. Please try again later.');
        }
    }
});
  
bot.launch();