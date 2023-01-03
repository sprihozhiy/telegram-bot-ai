// const axios = require('axios');

const apiKey = '';

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: apiKey,
});
const openai = new OpenAIApi(configuration);

async function resP(){
    const completion = await openai.createCompletion({
        model: "text-davinci-002",
        prompt: "Hello world",
      });
      console.log(completion.data.choices[0].text);
}
resP();