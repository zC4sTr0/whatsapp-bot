import { config as load_dotenv_file } from "dotenv";
import { WhatsAppClient } from "./Client/WhatsAppClient";

load_dotenv_file();

WhatsAppClient.createWhatsAppInstance(true);
