const { Telegraf } = require('telegraf');
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();
const db = require('./firebase/config');
const { doc, getDoc, setDoc } = require ('firebase/firestore');

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_API,
});
const openai = new OpenAIApi(configuration);
const bot = new Telegraf(process.env.TEST_BOT_TOKEN);


bot.command('start', (ctx) => {
    ctx.reply('Hey fella! How can I help you?');
  });
  
bot.on('text', async (ctx) => {
    // console.log(ctx.message.text);
     if (ctx.message.text.includes(`@rmfella_bot`) || ctx.message.text.includes(`bot`)) {
        // Retrieve the conversation history for this user from Firestore
        const userId = ctx.from.id;
        const conversationRef = doc(db, "conversations", userId.toString());
        const conversationDoc = await getDoc(conversationRef);
        let conversation = conversationDoc.data().conversation;
        if (!conversation) {
          conversation = [];
        } 
        
        conversation.push(ctx.message.text);
        
        console.log(conversation);
        // Add the current message to the conversation history
        
        // Update the conversation history in Firestore
        setDoc(conversationRef, { conversation: conversation}, { merge: true });

        try {
          // Use OpenAI to generate a response
          const response = await openai.createCompletion({
              model: 'text-davinci-003',
              prompt: conversation.join('\n') + '\n' + ctx.message.text,
              temperature: 0.3,
              max_tokens: 300,
              presence_penalty: -0.2,
          });
          ctx.reply(response.data.choices[0].text);
        } catch (error) {
            console.error(error);
            ctx.reply('Sorry, something went wrong. Please try again later.');
        }
    }
});
  
bot.launch();