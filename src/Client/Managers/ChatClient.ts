/**
 * ChatClient Class
 * Abstrai a ideia de uma conversa específica.
 * Responsável por gerir uma única conversa e seu estado
 */

import WAWebJS from "whatsapp-web.js";

class ChatClient {
  private contact: WAWebJS.Contact;
  private conversation: WAWebJS.Chat;

  constructor(contact: WAWebJS.Contact, conversation: WAWebJS.Chat) {
    this.contact = contact;
    this.conversation = conversation;
  }

  public getContact(): WAWebJS.Contact {
    return this.contact;
  }

  public getConversation(): WAWebJS.Chat {
    return this.conversation;
  }

  public answer(message: WAWebJS.Message) {
    this.conversation.sendMessage("recebi uma mensagem de: " + message.from);
  }
}

export { ChatClient };
