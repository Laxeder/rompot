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
exports.Command = void 0;
const Message_1 = require("../messages/Message");
const Chat_1 = require("./Chat");
const Bot_1 = require("./Bot");
class Command {
    constructor(name, description, permissions, category, executeCallback, replyCallback) {
        this._bot = new Bot_1.Bot();
        this._executeCallback = () => { };
        this._replyCallback = () => { };
        this._update = () => { };
        this.permissions = [];
        this.category = [];
        this.description = "";
        this.allowed = true;
        this.names = [];
        this.setName(name);
        this.setDescription(description || "");
        this.setExecute(executeCallback || function () { });
        this.setReply(replyCallback || function () { });
        this.setPermission(permissions || []);
        this.setCategory(category || []);
    }
    /**
     * * Define o bot que executa o comando
     * @param bot
     */
    setBot(bot) {
        this._bot = bot;
    }
    /**
     * * Retorna o bot que executa o comando
     * @returns
     */
    getBot() {
        return this._bot;
    }
    /**
     * * Define uma função que lê atualizações do comando
     * @param update funcão que receberá a atualização
     */
    setUpdate(update) {
        this._update = update;
    }
    /**
     * * Executa o comando
     * @param message
     * @param args
     */
    execute(message, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._send || !this._bot) {
                return this._executeCallback(message, ...args);
            }
            this._send.chat = message.chat;
            return this._bot.send(this._send);
        });
    }
    /**
     * * Executa a resposta do comando
     * @param args
     */
    reply(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._replyCallback(...args);
        });
    }
    /**
     * * Define a função do comando
     * @param executeCallback
     */
    setExecute(executeCallback) {
        this._executeCallback = executeCallback;
    }
    /**
     * * Define uma resposta ao comando
     * @param replyCallback
     */
    setReply(replyCallback) {
        this._replyCallback = replyCallback;
    }
    setSend(message) {
        if (typeof message == "string")
            return (this._send = new Message_1.Message(new Chat_1.Chat(""), message));
        this._send = message;
    }
    /**
     * * Define um prefixo geral
     * @param prefix
     */
    setPrefix(prefix) {
        this.prefix = prefix;
        this._update();
    }
    /**
     * * Define o nome do comando
     * @param name
     */
    setName(name) {
        if (typeof name == "string")
            return this.names.push(name);
        this.names = name;
    }
    /**
     * * Define a descrição do comando
     * @param description
     */
    setDescription(description) {
        this.description = description;
    }
    /**
     * * Define se está permitido
     * @param allowed
     */
    setAllowed(allowed) {
        this.allowed = allowed;
    }
    /**
     * * Define a permissão do comando
     * @param permissions
     */
    setPermission(permissions) {
        if (typeof permissions === "string") {
            this.permissions = [permissions];
        }
        if (Array.isArray(permissions)) {
            this.permissions = permissions;
        }
    }
    /**
     * * Define a categoria do comando
     * @param category
     */
    setCategory(category) {
        if (typeof category === "string") {
            this.category = [category];
        }
        if (Array.isArray(category)) {
            this.category = category;
        }
    }
    addName(name) {
        if (typeof name === "string")
            return this.names.push(name);
        this.names.push(...name);
    }
    /**
     * * Adiciona  uma permissão ao comando
     * @param permissions
     */
    addPermission(permissions) {
        if (typeof permissions === "string") {
            this.permissions.push(permissions);
        }
        if (Array.isArray(permissions)) {
            this.permissions.push(...permissions);
        }
    }
    /**
     * * Adiciona uma categoria ao comando
     * @param category
     */
    addCategory(category) {
        if (typeof category === "string") {
            this.category.push(category);
        }
        if (Array.isArray(category)) {
            this.category.push(...category);
        }
    }
    /**
     * * Retorna os nomes do comando
     * @returns
     */
    getNames() {
        return this.names;
    }
    /**
     * * Retorna os nome do comando
     * @returns
     */
    getName() {
        return this.names[0];
    }
    /**
     * * Retorna a descricão do comando
     * @returns
     */
    getDescription() {
        return this.description;
    }
    /**
     * * Retorna a permissão do comando
     * @returns
     */
    getPermission() {
        return this.permissions;
    }
    /**
     * * Retorna a categoria do comando
     * @returns
     */
    getCategory() {
        return this.category;
    }
    /**
     * * Retorna se está permetido
     * @returns
     */
    getAllowed() {
        return this.allowed;
    }
}
exports.Command = Command;
//# sourceMappingURL=Command.js.map