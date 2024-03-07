import { config as load_dotenv_file } from "dotenv";
import { ChatCompletionStream } from "openai/lib/ChatCompletionStream";
import qrcode from "qrcode-terminal";
import OpenAI from "openai";
import WAWebJS, { Client, LocalAuth } from "whatsapp-web.js";

load_dotenv_file();

const configuration = {
  apiKey: process.env.OPENAI_API_KEY,
};
const openai = new OpenAI(configuration);

const client: Client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: false,
  },
});

client.on("qr", (qr: string) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", (msg) => messageWorker(msg));

function isNumberOnAllowedList(number: string): boolean {
  const list_of_numbers = process.env.ALLOWED_NUMBER_LIST;
  if (!list_of_numbers) {
    console.log("Lista de números permitidos não foi  configurada!");
    return false;
  }

  const allowed_numbers: string[] = list_of_numbers
    .split(",")
    .map((number) => number.trim());
  if (allowed_numbers.includes(number)) {
    return true;
  }

  return false;
}

async function getOpenAIResponse(msg: string) {
  const stream: ChatCompletionStream = openai.beta.chat.completions.stream({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: msg }],
    stream: true,
  });

  stream.on("content", (delta: string) => {
    process.stdout.write(delta);
  });

  stream.on("error", (error) => {
    console.error(error);
  });

  const chatCompletion: OpenAI.Chat.Completions.ChatCompletion =
    await stream.finalChatCompletion();
  return chatCompletion;
}

async function messageWorker(msg: WAWebJS.Message) {
  const contact: WAWebJS.Contact = await msg.getContact();
  const contact_number = contact.number;
  const message_received = msg.body;

  if (!message_received || message_received.length === 0) {
    return;
  }

  if (isNumberOnAllowedList(contact_number) === false) {
    console.log(
      "Mensagem de " +
        contact_number +
        " recebida não é aceitada, ignorando...",
    );
    return;
  }

  console.log("Mensagem recebida:", message_received);

  console.log("Enviando mensagem pro chatGPT:", message_received);
  getOpenAIResponse(message_received).then((response) => {
    const answer_bot = response.choices[0]?.message?.content;
    console.log("Resposta do bot: ", answer_bot);
    if (answer_bot) {
      msg.reply(answer_bot);
    }
  });
}

client.initialize();
