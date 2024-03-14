/**
 * Class WhatsAppClientEventService
 * Responsável por abstrair e tomar decisões baseadas em eventos de chat (contato, conversa, etc.)
 * Cada WhatsAppClient possui o seu EventService, que é responsável por responder eventos desse client em específico
 */

import WAWebJS, { Client } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { ChatManager } from "../Managers/ChatManager";
import { ChatClient } from "../Managers/ChatClient";

class WhatsAppClientEventService {
  private client: Client;
  private conversationListManager: ChatManager;

  /**
   * Evento de mensagem   *
   */
  private async chatMessageHandler(msg: WAWebJS.Message) {
    const sender_contact: WAWebJS.Contact = await msg.getContact();
    const chat_instance: WAWebJS.Chat = await msg.getChat();

    const chat: ChatClient | undefined =
      this.conversationListManager.getOrCreateChat(
        sender_contact,
        chat_instance,
      );

    if (!chat) {
      console.log("Chat não encontrado");
      return;
    }

    chat.answer(msg);
  }

  private qrCodeHandler(qrCode: string) {
    console.log("Gerando QRCode...");
    qrcode.generate(qrCode, { small: true });
  }

  private statusHandler() {
    console.log("Client is Ready!");
  }

  constructor(session_client: Client, conversationManager: ChatManager) {
    if (!session_client) {
      throw new Error("session_client está nulo");
    }

    if (!conversationManager) {
      throw new Error("conversationManager nulo");
    }
    this.client = session_client;
    this.conversationListManager = conversationManager;

    //utilizar arrow notation aqui é importante por causa da forma que o js herda o contexto.
    //Caso não seja usado arrow notation, é necessário ajustar o this com bind.
    session_client.on("message", (msg) => this.chatMessageHandler(msg));
    session_client.on("ready", () => this.statusHandler);
    session_client.on("qr", (qr) => this.qrCodeHandler(qr));
  }
}

export { WhatsAppClientEventService };
