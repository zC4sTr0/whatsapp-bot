require('dotenv').config()

import qrcode from 'qrcode-terminal';
import WAWebJS, { Client, LocalAuth } from 'whatsapp-web.js';
import OpenAI from "openai";
import { ChatCompletionStream } from "openai/lib/ChatCompletionStream";

const client: Client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { 
        headless: true
    }
});

let global_state_user = 0;
let dia = "";
let mes = "";
let hora = "";
let minuto = "";

const configuration = {
    apiKey: process.env.OPENAI_API_KEY,
};
const openai = new OpenAI(configuration);

client.on('qr', (qr:string) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', msg => messageWorker(msg));

function isNumberOnAllowedList(number:string):boolean{
    const list_of_numbers = process.env.ALLOWED_NUMBER_LIST;
    if (!list_of_numbers) {
        console.log("Lista de números permitidos não foi configurada!");
        return false;
    }

    const allowed_numbers:string[] = list_of_numbers.split(',').map((number) => number.trim());
    if (allowed_numbers.includes(number)) {
        return true;
    }

    return false;
}

async function messageWorker(msg:WAWebJS.Message) {    
    const contact:WAWebJS.Contact = await msg.getContact();
    const contact_number = contact.number;
    const message_received = msg.body;

    if (!message_received || message_received.length === 0) {
        return;
    } 

    if (isNumberOnAllowedList(contact_number) === false) {
        console.log("Mensagem de " + contact_number +" recebida não é aceitada, ignorando...");
        return;
    }

    console.log('Mensagem recebida:', message_received);
    if (global_state_user===0){
        msg.reply("Olá! Bem-vindo ao sistema de marcação do Barbergram! Deseja agendar um horário? Digite 'sim' ou 'não'.");
        global_state_user=1;//aguardando resposta do usuário para agendar horário
    }

    if (global_state_user===1){

        if (message_received.toLowerCase()==="sim") {
            msg.reply("Excelente! Escreva a data que deseja agendar o horário no formato dia/mes. Exemplo: 01/03");
            global_state_user=2;//aguardando resposta do usuário para agendar horário
        }

        if ((message_received.toLowerCase()==="não") || (message_received.toLowerCase()==="nao")) {
            msg.reply("Tudo bem. Caso mude de ideia, estarei por aqui. Até mais!");
            global_state_user=0;//aguardando resposta do usuário para agendar horário
        }
    }

    if (global_state_user===2) {

        //use regex to check if the date is in the format dd/mm
        if (message_received.match(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])$/)==null) {
            msg.reply("Data inválida! Por favor, informe a data no formato dia/mes. Exemplo: 01/03");
            return;
        }
        
        let dia_splitado = message_received.split("/")[0];
        let mes_splitado = message_received.split("/")[1];

        if (Array.isArray(message_received.split("/"))===false || message_received.split("/").length!==2) {
            msg.reply("Data inválida! Por favor, informe a data no formato dia/mes. Exemplo: 01/03");
            return;
        }

        if (message_received.split("/")[0] === "" || message_received.split("/")[1] === "") {
            msg.reply("Data inválida! Por favor, informe a data no formato dia/mes. Exemplo: 01/03");
            return;
        }

        if (message_received.split("/")[0] == undefined || message_received.split("/")[1] === undefined) {
            msg.reply("Data inválida! Por favor, informe a data no formato dia/mes. Exemplo: 01/03");
            return;
        }
        if (dia_splitado ===undefined || mes_splitado ===undefined) {
            msg.reply("Data inválida! Por favor, informe a data no formato dia/mes. Exemplo: 01/03");
            return;
        } 

        dia = dia_splitado;
        mes = mes_splitado;

        msg.reply("Certo. Você deseja agendar para a data "+dia+"/"+mes+".");

        msg.reply("Nesta data, temos os seguintes horários disponíveis: 10:00, 11:00, 14:00 e 15:00. Qual destes horários você prefere?");
        msg.reply("Por favor, me informe apenas o horário que deseja agendar no formato HH:MM. Exemplo: 10:00");
        global_state_user=3;
    }

    if (global_state_user === 3) {

        // Use regex to check if the time is in the format HH:MM
        if (message_received.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)==null) {
            msg.reply("Horário inválido! Por favor, informe o horário no formato HH:MM. Exemplo: 10:00");
            return;
        }
        
        let hora_splitada = message_received.split(":")[0];
        let minuto_splitado = message_received.split(":")[1];
    
        if (Array.isArray(message_received.split(":"))===false || message_received.split(":").length!==2) {
            msg.reply("Horário inválido! Por favor, informe o horário no formato HH:MM. Exemplo: 10:00");
            return;
        }
    
        if (message_received.split(":")[0] === "" || message_received.split(":")[1] === "") {
            msg.reply("Horário inválido! Por favor, informe o horário no formato HH:MM. Exemplo: 10:00");
            return;
        }
    
        if (message_received.split(":")[0] == undefined || message_received.split(":")[1] === undefined) {
            msg.reply("Horário inválido! Por favor, informe o horário no formato HH:MM. Exemplo: 10:00");
            return;
        }
        if (hora_splitada ===undefined || minuto_splitado ===undefined) {
            msg.reply("Horário inválido! Por favor, informe o horário no formato HH:MM. Exemplo: 10:00");
            return;
        } 
    
        hora = hora_splitada;
        minuto = minuto_splitado;
    
        msg.reply("Certo. Você deseja agendar para o horário "+hora+":"+minuto+".");
        msg.reply("Por favor, me informe o seu nome completo.");

        global_state_user=4;
    }
    
    if (global_state_user === 4) {
        let nome = message_received;
        msg.reply("Agendado! Horário agendado para "+nome+" no dia "+dia+"/"+mes+" às "+hora+":"+minuto+".");
        msg.reply("Até mais!");
        global_state_user=0;
    }
    


    if (false) {
        console.log('Enviando mensagem pro chatGPT:', message_received);
        getOpenAIResponse(message_received).then((response) => {
            const answer_bot = response.choices[0]?.message?.content;
            console.log("Resposta do bot: ", answer_bot);
            if (answer_bot) {
                msg.reply(answer_bot);
            }
        });
    }
}

async function getOpenAIResponse(msg:string) {
    const stream:ChatCompletionStream = openai.beta.chat.completions.stream({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: msg }],
        stream: true,
    });

    stream.on('content', (delta:string) => {
        process.stdout.write(delta);
    });

    stream.on('error', (error) => {
        console.error(error);
    });

    const chatCompletion:OpenAI.Chat.Completions.ChatCompletion = await stream.finalChatCompletion();
    return chatCompletion;
}

client.initialize();