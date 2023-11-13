"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const jwt_1 = require("@nestjs/jwt");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const channel_messages_dto_1 = require("../DTOs/channel/channel.messages.dto");
const message_dto_1 = require("../DTOs/message/message.dto");
const conversation_repository_1 = require("../modules/conversation/conversation.repository");
const message_repository_1 = require("../modules/message/message.repository");
const users_repository_1 = require("../modules/users/users.repository");
const chat_service_1 = require("./chat.service");
let ChatGateway = class ChatGateway {
    constructor(jwtService, user, conversation, message, channel) {
        this.jwtService = jwtService;
        this.user = user;
        this.conversation = conversation;
        this.message = message;
        this.channel = channel;
        this.clientsMap = new Map();
    }
    async handleConnection(client, ...args) {
        try {
            let cookie = client.client.request.headers.cookie;
            if (cookie) {
                const jwt = cookie.substring(cookie.indexOf('=') + 1);
                console.log('here is the jwt : ', jwt);
                let user;
                user = this.jwtService.verify(jwt);
                console.log('here');
                console.log(user);
                if (user) {
                    const test = await this.user.getUserById(user.sub);
                    if (test) {
                        console.log(test.id);
                        this.clientsMap.set(test.id, client);
                        console.log(`this is a test : ${test.id} ****`);
                    }
                }
            }
            else {
                console.log("user dosen't exist in database");
                client.emit('ERROR', "RAH KAN3REF BAK, IHCHEM");
                client.disconnect();
            }
        }
        catch (error) {
            console.log("user dosen't exist in database");
            client.emit('ERROR', "RAH KAN3REF BAK, IHCHEM");
            client.disconnect();
            console.log("invalid data : check JWT or DATABASE QUERIES");
        }
    }
    handleDisconnect(client) {
        this.clientsMap.delete(client.id);
    }
    async handleChannelMessage(message) {
        try {
            console.log('got here ff : ', message.sender);
            let _user = await this.user.getUserById(message.sender);
            let channel = await this.channel.getChannelByName(message.channelName);
            if (_user && channel && channel.users.includes(_user.id)) {
                channel.users.forEach((user) => {
                    console.log('user :', user);
                    if (user != message.sender && channel.users.includes(user)) {
                        console.log('reciever : ', user);
                        let socket = this.clientsMap.get(user);
                        if (socket)
                            socket.emit('channelMessage', message);
                    }
                });
                await this.channel.createChannelMessage(message);
            }
            else {
                let socket = this.clientsMap.get(_user.id);
                if (socket) {
                    console.log('send error message');
                    socket.emit('ERROR', 'SERVER : your not in channel .');
                }
            }
        }
        catch (error) {
            console.log('error while sending channel message .');
        }
    }
    async hanldeMessage(message) {
        try {
            const sender = await this.user.getUserById(message.senderId);
            const reciever = await this.user.getUserById(message.recieverId);
            if (!sender || !reciever) {
                console.log("invalid data : Wrong sender or reciever info.");
                return;
            }
            if (reciever.bandUsers.includes(sender.id)) {
                console.log("a banned user can't send messages .");
                return;
            }
            let achievementCheck = await this.conversation.numberOfConversations(sender.id);
            if (achievementCheck > 0) {
                if (!sender.achievements.includes('send your first message')) {
                    await this.user.updateAcheivement('send your first message', sender.id);
                    console.log('added first message');
                }
            }
            let conversations = await this.conversation.findConversations(reciever.id, sender.id);
            if (!conversations) {
                const tmp = await this.conversation.createConversation(reciever.id, sender.id);
                message.conversationId = tmp.id;
                this.sendToSocket(message);
            }
            else {
                message.conversationId = conversations.id;
                this.sendToSocket(message);
            }
        }
        catch (error) {
            console.log('error while sending message .');
        }
    }
    async sendToSocket(message) {
        try {
            console.log(message);
            const socket = this.clientsMap.get(message.recieverId);
            await this.message.CreateMesasge(message);
            if (socket) {
                socket.emit('RecieveMessage', message);
            }
            else {
                console.error(`Socket with ID ${message.recieverId} not found.`);
            }
        }
        catch (error) {
            console.log('error in the sendToSocket function');
        }
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('channelMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [channel_messages_dto_1.channelMessageDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleChannelMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('SendMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [message_dto_1.messageDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "hanldeMessage", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [jwt_1.JwtService, users_repository_1.UsersRepository, conversation_repository_1.converationRepositroy, message_repository_1.messageRepository, chat_service_1.ChannelsService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map