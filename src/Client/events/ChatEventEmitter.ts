/**
 * Class ChatEventEmitter
 * Responsável por abstrair e tomar decisões baseadas em eventos de chat (contato, conversa, etc.)
 */

import { Client } from "whatsapp-web.js";

class ChatEventEmitter {
    private client: Client;

    constructor(session_client: Client) {
        this.client = session_client;
    }

    }

}

export { ChatEventEmitter };