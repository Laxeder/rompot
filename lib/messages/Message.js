"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const Status_1 = require("../models/Status");
const User_1 = require("../models/User");
const Bot_1 = require("../models/Bot");
class Message {
    constructor(chat, text, mention, id) {
        this._bot = new Bot_1.Bot();
        this.timestamp = Date.now();
        this.user = new User_1.User("");
        this.mentions = [];
        this.text = text;
        this.chat = chat;
        if (mention)
            this.mention = mention;
        if (id)
            this.id = id;
    }
    //! ***** Bot Functions *****
    /**
     * * Define o bot que executa essa mensagem
     * @param bot
     */
    setBot(bot) {
        var _a, _b;
        this._bot = bot;
        (_a = this.chat) === null || _a === void 0 ? void 0 : _a.setBot(this._bot);
        (_b = this.user) === null || _b === void 0 ? void 0 : _b.setBot(this._bot);
    }
    /**
     * * Retorna o bot que executa essa mensagem
     * @returns
     */
    getBot() {
        return this._bot;
    }
    /**
     * * Responde uma mensagem
     * @param message
     * @param mention
     */
    reply(message, mention = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(message instanceof Message))
                message = new Message(this.chat, `${message}`);
            if (mention)
                message.setMention(this);
            message.setChat(this.chat);
            return this._bot.send(message);
        });
    }
    /**
     * * Marca como visualizada a mensagem
     * @returns
     */
    read() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._bot.send(new Status_1.Status("reading", this.chat, this));
        });
    }
    //! ***************************
    /**
     * * Define a sala de bate-papo
     * @param chat
     */
    setChat(chat) {
        this.chat = chat;
    }
    /**
     * * Define o texto da mensagem
     * @param text
     * @returns
     */
    setText(text) {
        this.text = text;
    }
    /**
     * * Menciona uma mensagem
     * @param mention
     * @returns
     */
    setMention(mention) {
        this.mention = mention;
    }
    /**
     * * Define se a mensagem ?? nova
     * @param isOld
     */
    setIsOld(isOld) {
        this.isOld = isOld;
    }
    /**
     * * Define o ID da mensagem
     * @param id
     */
    setId(id) {
        this.id = id;
    }
    /**
     * * Define o usu??rio
     * @param user
     */
    setUser(user) {
        this.user = user;
    }
    /**
     * * Define se a mensagem foi enviada pelo bot
     * @param fromMe
     */
    setFromMe(fromMe) {
        this.fromMe = fromMe;
    }
    /**
     * * Define as men????es feitas nas mensagens
     * @param mentions
     */
    setMentions(mentions) {
        this.mentions = mentions;
    }
    setTimestamp(timestamp) {
        this.timestamp = timestamp;
    }
    /**
     * * Adiciona um numero a lista de mencionados
     * @param id
     */
    addMentions(id) {
        if (typeof id == "string") {
            this.mentions.push(id);
            return;
        }
        this.mentions.push(...id);
    }
    /**
     * * Obter a sala de bate-papo da mensagem
     * @returns
     */
    getChat() {
        return this.chat;
    }
    /**
     * * Obter o texto da mensagem
     * @returns
     */
    getText() {
        return this.text;
    }
    /**
     * * Obter a men????o da mensagem
     * @returns
     */
    getMention() {
        return this.mention;
    }
    /**
     * * Retorna se a mensagem ?? nova
     * @returns
     */
    getIsOld() {
        return this.isOld;
    }
    /**
     * * Retorna o ID da mensagem
     * @returns
     */
    getId() {
        return this.id;
    }
    /**
     * * Retorna o usu??rio
     * @returns
     */
    getUser() {
        return this.user;
    }
    /**
     * * retorna se foi enviada pelo pr??prioI bot
     * @returns
     */
    getFromMe() {
        return this.fromMe || false;
    }
    /**
     * * Define uma mensagem n??o refactorada
     * @param originalMessage
     */
    setOriginalMessage(originalMessage) {
        this._originalMessage = originalMessage;
    }
    /**
     * * Retorna a mensagem n??o refatorada
     * @returns
     */
    getOriginalMessage() {
        return this._originalMessage;
    }
    //? O Baileys (WhatsApp) precisa da men????o original para mencionar uma mensagem
    /**
     * * Define uma men????o n??o refactorada
     * @param originalMention
     */
    setOriginalMention(originalMention) {
        this._originalMention = originalMention;
    }
    /**
     * * Retorna a men????o n??o refatorada
     * @returns
     */
    getOriginalMention() {
        return this._originalMention;
    }
}
exports.Message = Message;
//# sourceMappingURL=Message.js.map