import { Client, LocalAuth } from "whatsapp-web.js";
import { ChatService } from "./events/ChatService";
import { ChatManager } from "./Managers/ChatManager";

/**
 * Class WhatsAppClient
 * Utilizada para inicialização do client principal do bot.
 * Caso haja necessidade de inicializar mais de um client no futuro, será criado um manager para gerenciá-las.
 */
class WhatsAppClient {
  private static instance: WhatsAppClient;
  private static session_client: Client;
  private static eventEmitter: ChatService;

  constructor(sessionClient: Client, chatEventManager: ChatService) {
    sessionClient.initialize();
    WhatsAppClient.session_client = sessionClient;
    WhatsAppClient.eventEmitter = chatEventManager;
  }

  /** cria uma instance do client do whatsApp
   * este é o ponto onde se deve adicionar coisas como tipo de autenticação, salvar login, proxy cadastrado, etc.
   */
  public static createWhatsAppInstance(show_navigator: boolean) {
    //singleton para criar apenas uma instância por hora
    if (!this.instance) {
      const WhatsAppSessionClient: Client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
          headless: !show_navigator,
        },
      });
      const manager: ChatManager = new ChatManager();

      this.instance = new WhatsAppClient(
        WhatsAppSessionClient,
        new ChatService(WhatsAppSessionClient, manager),
      );
    } else {
      throw new Error("Já existe uma instância do WhatsAppClient");
    }
  }
}

export { WhatsAppClient };
