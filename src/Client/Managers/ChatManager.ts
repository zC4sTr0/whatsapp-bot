/**
 * ChatManager Class
 * Responsável por abstrair a ideia da lista de conversas. Possui uma lista de chats
 * Cada instância de WhatsAppClient pode ter apenas um ChatManager com suas respectivas conversas.
 * Cada ChatService utiliza esta abstração para emitir as mensagens e tomar decisão baseado em cada chat específico
 */

import WAWebJS from "whatsapp-web.js";
import { ChatClient } from "./ChatClient";

class ChatManager {
  private chatList: Map<string, ChatClient> = new Map();

  constructor() {}

  public getOrCreateChat(
    contact: WAWebJS.Contact,
    conversation: WAWebJS.Chat,
  ): ChatClient | undefined {
    let chatInstance = this.chatList.get(contact.number);
    if (!chatInstance) {
      chatInstance = new ChatClient(contact, conversation);
      this.chatList.set(contact.number, chatInstance);
    }
    return chatInstance;
  }
}

export { ChatManager };
