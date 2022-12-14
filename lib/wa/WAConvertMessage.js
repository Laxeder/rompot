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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppConvertMessage = void 0;
const baileys_1 = require("@adiwajshing/baileys");
const pino_1 = __importDefault(require("pino"));
const LocationMessage_1 = require("../messages/LocationMessage");
const ReactionMessage_1 = require("../messages/ReactionMessage");
const ContactMessage_1 = require("../messages/ContactMessage");
const ButtonMessage_1 = require("../messages/ButtonMessage");
const ImageMessage_1 = require("../messages/ImageMessage");
const MediaMessage_1 = require("../messages/MediaMessage");
const VideoMessage_1 = require("../messages/VideoMessage");
const AudioMessage_1 = require("../messages/AudioMessage");
const ListMessage_1 = require("../messages/ListMessage");
const Message_1 = require("../messages/Message");
const Chat_1 = require("../models/Chat");
const User_1 = require("../models/User");
const ID_1 = require("./ID");
class WhatsAppConvertMessage {
    constructor(wa, message, type) {
        this._message = {};
        this._convertedMessage = new Message_1.Message(new Chat_1.Chat(""), "");
        this._user = new User_1.User("");
        this._chat = new Chat_1.Chat("");
        this._wa = wa;
        this.set(message, type);
    }
    /**
     * * Define a mensagem a ser convertida
     * @param message
     * @param type
     */
    set(message = this._message, type) {
        this._message = message;
        this._type = type;
    }
    /**
     * * Retorna a mensagem convertida
     */
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.convertMessage(this._message, this._type);
            if (this._mention)
                this._convertedMessage.setMention(this._mention);
            this._convertedMessage.setChat(this._chat);
            this._convertedMessage.setUser(this._user);
            return this._convertedMessage;
        });
    }
    /**
     * * Converte a mensagem
     * @param message
     * @param type
     */
    convertMessage(message, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = (0, ID_1.replaceID)(message.key.remoteJid || "");
            const chat = this._wa.chats[id] ? this._wa.chats[id] : new Chat_1.Chat(id);
            if (id) {
                if (chat)
                    this._chat = chat;
                this._chat.id = id;
            }
            if (chat === null || chat === void 0 ? void 0 : chat.id.includes("@g"))
                this._chat.type = "group";
            if (chat === null || chat === void 0 ? void 0 : chat.id.includes("@s"))
                this._chat.type = "pv";
            if (message.pushName)
                this._chat.name = message.pushName;
            const userID = (0, ID_1.replaceID)(message.key.participant || message.participant || message.key.remoteJid || "");
            this._user = (chat === null || chat === void 0 ? void 0 : chat.members) && (chat === null || chat === void 0 ? void 0 : chat.members[userID]) ? chat === null || chat === void 0 ? void 0 : chat.members[userID] : new User_1.User(userID);
            this._user.name = message.pushName || "";
            yield this.convertContentMessage(message.message);
            if (message.key.fromMe) {
                this._convertedMessage.fromMe = message.key.fromMe;
                this._user.id = (0, ID_1.replaceID)(this._wa.id);
            }
            if (message.messageTimestamp)
                this._convertedMessage.timestamp = message.messageTimestamp;
            if (message.key.id)
                this._convertedMessage.id = message.key.id;
            if (type)
                this._convertedMessage.isOld = type !== "notify";
            this._convertedMessage.setOriginalMessage(message);
        });
    }
    /**
     * * Converte o conteudo da mensagem
     * @param messageContent
     * @returns
     */
    convertContentMessage(messageContent) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!!!messageContent)
                return;
            const contentType = (0, baileys_1.getContentType)(messageContent);
            if (!contentType)
                return;
            let content = contentType === "conversation" ? { text: messageContent[contentType] } : messageContent[contentType];
            if (content.message) {
                yield this.convertContentMessage(content.message);
                return;
            }
            if (contentType == "imageMessage" || contentType == "videoMessage" || contentType == "audioMessage") {
                this.convertMediaMessage(content, contentType);
            }
            if (contentType === "buttonsMessage" || contentType === "templateMessage") {
                this.convertButtonMessage(messageContent);
            }
            if (contentType === "listMessage") {
                this.convertListMessage(messageContent);
            }
            if (contentType === "locationMessage") {
                this.convertLocationMessage(content);
            }
            if (contentType === "contactMessage" || contentType == "contactsArrayMessage") {
                this.convertContactMessage(content);
            }
            if (contentType === "reactionMessage") {
                this.convertReactionMessage(content);
            }
            if (!!!this._convertedMessage.text) {
                this._convertedMessage.setText(content.text ||
                    content.caption ||
                    content.buttonText ||
                    content.contentText ||
                    ((_a = content.hydratedTemplate) === null || _a === void 0 ? void 0 : _a.hydratedContentText) ||
                    content.displayName ||
                    "");
            }
            if (content.contextInfo) {
                yield this.convertContextMessage(content.contextInfo);
            }
            if ((_b = content.singleSelectReply) === null || _b === void 0 ? void 0 : _b.selectedRowId) {
                this._convertedMessage.selected = content.singleSelectReply.selectedRowId;
            }
            if (content.selectedId) {
                this._convertedMessage.selected = content.selectedId;
            }
        });
    }
    /**
     * * Converte o contexto da mensagem
     * @param context
     * @returns
     */
    convertContextMessage(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (context.mentionedJid) {
                context.mentionedJid.forEach((jid) => {
                    this._convertedMessage.addMentions((0, ID_1.replaceID)(jid));
                });
            }
            if (context.quotedMessage) {
                const message = {
                    key: {
                        remoteJid: (0, ID_1.replaceID)(this._chat.id),
                        participant: (0, ID_1.replaceID)(context.participant),
                        id: context.stanzaId,
                    },
                    message: context.quotedMessage,
                };
                const wa = new WhatsAppConvertMessage(this._wa, message);
                this._mention = yield wa.get();
                this._convertedMessage.setOriginalMention(message);
            }
        });
    }
    /**
     * * Converte mensagem de localiza????o
     * @param content
     */
    convertLocationMessage(content) {
        this._convertedMessage = new LocationMessage_1.LocationMessage(this._chat, content.degreesLatitude, content.degreesLongitude);
    }
    /**
     * * Converte mensagem com contatos
     * @param content
     */
    convertContactMessage(content) {
        this._convertedMessage = new ContactMessage_1.ContactMessage(this._chat, content.displayName, []);
        const getContact = (vcard) => {
            const user = new User_1.User("");
            if (typeof vcard == "object") {
                vcard = vcard.vcard;
            }
            const name = vcard.slice(vcard.indexOf("FN:"));
            user.name = name.slice(3, name.indexOf("\n"));
            const id = vcard.slice(vcard.indexOf("waid=") + 5);
            user.id = (0, ID_1.replaceID)(id.slice(0, id.indexOf(":")) + "@s.whatsapp.net");
            return user;
        };
        const contacts = [];
        if (content.contacts) {
            content.contacts.forEach((vcard) => {
                contacts.push(getContact(vcard));
            });
        }
        if (content.vcard) {
            contacts.push(getContact(content.vcard));
        }
        if (this._convertedMessage instanceof ContactMessage_1.ContactMessage) {
            this._convertedMessage.contacts = contacts;
        }
    }
    /**
     * * Converte mensagem de midia
     * @param content
     * @param contentType
     */
    convertMediaMessage(content, contentType) {
        if (contentType == "imageMessage") {
            this._convertedMessage = new ImageMessage_1.ImageMessage(this._chat, this._convertedMessage.text, content.url);
        }
        if (contentType == "videoMessage") {
            this._convertedMessage = new VideoMessage_1.VideoMessage(this._chat, this._convertedMessage.text, content.url);
        }
        if (contentType == "audioMessage") {
            this._convertedMessage = new AudioMessage_1.AudioMessage(this._chat, this._convertedMessage.text, content.url);
        }
        if (content.gifPlayback && this._convertedMessage instanceof MediaMessage_1.MediaMessage) {
            this._convertedMessage.setIsGIF(true);
        }
        const logger = (0, pino_1.default)({ level: "silent" });
        if (this._convertedMessage instanceof MediaMessage_1.MediaMessage) {
            const download = () => (0, baileys_1.downloadMediaMessage)(this._message, "buffer", {}, {
                logger,
                reuploadRequest: (msg) => new Promise((resolve) => resolve(msg)),
            });
            this._convertedMessage.setSream(download);
        }
    }
    /**
     * * Converte uma mensagem de bot??o
     * @param content
     * @returns
     */
    convertButtonMessage(content) {
        var _a, _b;
        let buttonMessage = content.buttonsMessage || content.templateMessage;
        const buttonMSG = new ButtonMessage_1.ButtonMessage(this._chat, "");
        if (buttonMessage.hydratedTemplate)
            buttonMessage = buttonMessage.hydratedTemplate;
        buttonMSG.setText(buttonMessage.contentText || buttonMessage.hydratedContentText || "");
        buttonMSG.setFooter(buttonMessage.footerText || buttonMessage.hydratedFooterText || "");
        buttonMSG.setType(buttonMessage.headerType || buttonMessage.hydratedHeaderType || 1);
        (_a = buttonMessage.buttons) === null || _a === void 0 ? void 0 : _a.map((button) => {
            var _a;
            buttonMSG.addReply(((_a = button === null || button === void 0 ? void 0 : button.buttonText) === null || _a === void 0 ? void 0 : _a.displayText) || "", button.buttonId || buttonMSG.generateID());
        });
        (_b = buttonMessage.hydratedButtons) === null || _b === void 0 ? void 0 : _b.map((button) => {
            if (button.callButton)
                buttonMSG.addCall(button.callButton.displayText || "", button.callButton.phoneNumber || buttonMSG.buttons.length);
            if (button.urlButton)
                buttonMSG.addCall(button.urlButton.displayText || "", button.urlButton.url || "");
            if (button.quickReplyButton)
                buttonMSG.addCall(button.quickReplyButton.displayText || "", button.quickReplyButton.id);
        });
        this._convertedMessage = buttonMSG;
    }
    /**
     * * Converte uma mensagem de lista
     * @param content
     * @returns
     */
    convertListMessage(content) {
        var _a;
        let listMessage = content.listMessage;
        if (!!!listMessage)
            return;
        const listMSG = new ListMessage_1.ListMessage(this._chat, "", "", "", "");
        listMSG.setText(listMessage.description || "");
        listMSG.title = listMessage.title || "";
        listMSG.footer = listMessage.footerText || "";
        listMSG.buttonText = listMessage.buttonText || "";
        (_a = listMessage === null || listMessage === void 0 ? void 0 : listMessage.sections) === null || _a === void 0 ? void 0 : _a.map((list) => {
            var _a;
            const index = listMSG.list.length;
            listMSG.addCategory(list.title || "");
            (_a = list.rows) === null || _a === void 0 ? void 0 : _a.map((item) => {
                listMSG.addItem(index, item.title || "", item.description || "", item.rowId || "");
            });
        });
        this._convertedMessage = listMSG;
    }
    convertReactionMessage(content) {
        this._convertedMessage = new ReactionMessage_1.ReactionMessage(this._chat, content.text, content.key.id);
    }
}
exports.WhatsAppConvertMessage = WhatsAppConvertMessage;
//# sourceMappingURL=WAConvertMessage.js.map