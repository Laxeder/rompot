import { MessageUpsertType, proto, WAMessage, WAMessageContent } from "@adiwajshing/baileys";
import { WhatsAppBot } from "./WhatsAppBot";
import { Message } from "../messages/Message";
export declare class WhatsAppConvertMessage {
    private _type?;
    private _message;
    private _convertedMessage;
    private _user;
    private _chat;
    private _mention?;
    private _wa;
    constructor(wa: WhatsAppBot, message: WAMessage, type?: MessageUpsertType);
    /**
     * * Define a mensagem a ser convertida
     * @param message
     * @param type
     */
    set(message?: WAMessage, type?: MessageUpsertType): void;
    /**
     * * Retorna a mensagem convertida
     */
    get(): Promise<Message>;
    /**
     * * Converte a mensagem
     * @param message
     * @param type
     */
    convertMessage(message: WAMessage, type?: MessageUpsertType): Promise<void>;
    /**
     * * Converte o conteudo da mensagem
     * @param messageContent
     * @returns
     */
    convertContentMessage(messageContent: WAMessageContent | undefined | null): Promise<void>;
    /**
     * * Converte o contexto da mensagem
     * @param context
     * @returns
     */
    convertContextMessage(context: proto.ContextInfo): Promise<void>;
    /**
     * * Converte mensagem de localização
     * @param content
     */
    convertLocationMessage(content: any): void;
    /**
     * * Converte mensagem com contatos
     * @param content
     */
    convertContactMessage(content: any): void;
    /**
     * * Converte mensagem de midia
     * @param content
     * @param contentType
     */
    convertMediaMessage(content: any, contentType: keyof proto.IMessage): void;
    /**
     * * Converte uma mensagem de botão
     * @param content
     * @returns
     */
    convertButtonMessage(content: WAMessageContent): void;
    /**
     * * Converte uma mensagem de lista
     * @param content
     * @returns
     */
    convertListMessage(content: WAMessageContent): void;
    convertReactionMessage(content: any): void;
}
