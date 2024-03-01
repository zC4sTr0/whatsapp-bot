const qrcode = require('qrcode-terminal');
const axios = require('axios');

require('dotenv').config()

const { Client } = require('whatsapp-web.js');
const client = new Client();

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', msg => {
    if (msg.body.substring(0, 1) === '!') {
        console.log("Recebida mensagem no zap: ", msg.body);
        if (msg.body === 'ping') {
            msg.reply('pong');
        } else {
            msg.body = msg.body.substring(1);
            console.log('Enviando mensagem pro chatGPT:', msg.body);
            getOpenAIResponse(msg.body).then((response) => {
                console.log("Resposta do bot: ", response);
                msg.reply(response);
            });
        }
    }
});

const headers = {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
};

const axiosInstance = axios.create({
    baseURL: 'https://api.openai.com',
    timeout: 120000,
    headers: headers
});

const getOpenAIResponse = async (msg:string) => {
    try {
        const body = {
            "model": "gpt-4-0125-preview",
            "prompt": msg,
            "max_tokens": 4096,
            "temperature": 1
        }
        const bot_answer = await axiosInstance.post('/v1/assistants', { body });
        return bot_answer.data.choices[0].text;
    } catch (error) {
        console.error(error);
    }
};


// client.initialize();
getOpenAIResponse('asdasdasd');