const { Telegraf } = require('telegraf');
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();
const db = require('./firebase/config');
const { doc, getDoc, setDoc } = require('firebase/firestore');

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_API,
});
const openai = new OpenAIApi(configuration);
const bot = new Telegraf(process.env.BOT_TOKEN);


bot.command('start', (ctx) => {
  ctx.reply('Hey fella! How can I help you?');
});

bot.on('text', async (ctx) => {
  if (ctx.message.chat.type === 'private') {
    // The message was sent in a private chat
    const userId = ctx.from.id;
    const conversationRef = doc(db, "conversations", userId.toString());
    const conversationDoc = await getDoc(conversationRef);
    let conversation
    if (conversationDoc.data() === undefined) {
      conversation = [];
    } else {
      conversation = conversationDoc.data().conversation;
    }
    conversation.push(ctx.message.text);
    setDoc(conversationRef, { conversation: conversation }, { merge: true });
    try {
      const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: conversation.join('\n') + '\n' + ctx.message.text,
        temperature: 0.3,
        max_tokens: 250,
        presence_penalty: -0.2,
      });
      ctx.reply(response.data.choices[0].text);
    } catch (error) {
      console.error(error);
      ctx.reply('Sorry, something went wrong. Please try again later.');
    }
  } else {
    // The message was sent in a group or a supergroup
    if (ctx.message.text.includes(`@rmfella_bot`)) {
      const userId = ctx.from.id;
      const conversationRef = doc(db, "conversations", userId.toString());
      const conversationDoc = await getDoc(conversationRef);
      let conversation
      if (conversationDoc.data() === undefined) {
        conversation = [];
      } else {
        conversation = conversationDoc.data().conversation;
      }
      conversation.push(ctx.message.text.substring(13));
      setDoc(conversationRef, { conversation: conversation }, { merge: true });
      try {
        const response = await openai.createCompletion({
          model: 'text-davinci-003',
          prompt: conversation.join('\n') + '\n' + ctx.message.text.substring(13),
          temperature: 0.3,
          max_tokens: 200,
          presence_penalty: -0.2,
        });
        ctx.reply(response.data.choices[0].text);
      } catch (error) {
        console.error(error);
        ctx.reply('Sorry, something went wrong. Please try again later.');
      }
    }
  }



});

bot.launch();