/**
 * ChatManager Class
 * Responsável por abstrair a ideia da lista de conversas.
 * Cada instância de WhatsAppClient pode ter apenas um ChatManager com suas respectivas conversas.
 */

class ChatManager {
  private chatList: Map<string, ChatClient>;

  constructor() {}

  public getOrCreateChat();
}
