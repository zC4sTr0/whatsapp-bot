/**
 * Class ChatService
 * Responsável por abstrair e tomar decisões baseadas em eventos de chat (contato, conversa, etc.)
 */

import WAWebJS, { Client } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { ChatManager } from "../Managers/ChatManager";
import { ChatClient } from "../Managers/ChatClient";

class ChatService {
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
    this.chatMessageHandler = this.chatMessageHandler.bind(this);
    session_client.on("message", this.chatMessageHandler);
    session_client.on("ready", this.statusHandler);
    session_client.on("qr", this.qrCodeHandler);
  }
}

export { ChatService };
