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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const friend_dto_1 = require("../DTOs/friends/friend.dto");
const invite_dto_1 = require("../DTOs/invitation/invite.dto");
const jwt_guard_1 = require("../auth/jwt.guard");
const conversation_repository_1 = require("../modules/conversation/conversation.repository");
const friends_repository_1 = require("../modules/friends/friends.repository");
const invites_repository_1 = require("../modules/invites/invites.repository");
const users_repository_1 = require("../modules/users/users.repository");
const chat_service_1 = require("./chat.service");
const channel_dto_1 = require("../DTOs/channel/channel.dto");
let ChatController = class ChatController {
    constructor(conversation, user, invite, friend, channel) {
        this.conversation = conversation;
        this.user = user;
        this.invite = invite;
        this.friend = friend;
        this.channel = channel;
    }
    async check() {
        let tmp = await this.conversation.numberOfConversations('98861');
        console.log(tmp);
    }
    async SendInvitation(invitation, req) {
        if (req.user.id != invitation.invitationSenderId || req.user.id == invitation.invitationRecieverId)
            return "Sir tel3eb";
        let tmp = await this.invite.createInvite(invitation);
        if (tmp == null)
            return `Already Friends`;
        return tmp;
    }
    async createChannel(channelData, req) {
        return await this.channel.createChannel(channelData, req.user.id);
    }
    async addUserToChannel(channelName, username, req) {
        let channel = await this.channel.getChannelByName(channelName);
        let tmpUser = await this.user.getUserByUsername(username);
        console.log(channel);
        console.log(tmpUser);
        await this.channel.addUserToChannel(tmpUser.id, channel.id);
    }
    async removeUserFromChannel(req, username, channelName) {
        console.log(`username recieved from body : ${username}`);
        let tmpUser = await this.user.getUserByUsername(username);
        let tmpchannel = await this.channel.getChannelByName(channelName);
        console.log(`user to delete : `, tmpUser);
        console.log(`channel : `, tmpchannel);
        try {
            if (tmpUser && tmpchannel && tmpchannel.admins.includes(req.user.id) && tmpchannel.users.includes(tmpUser.id)) {
                await this.channel.removeUserFromChannel(tmpUser.id, tmpchannel.id);
            }
        }
        catch (error) {
            console.log(`could not delete the user`);
        }
    }
    async accepteInvite(req, invite) {
        if (req.user.id != invite.invitationRecieverId)
            return 'Unauthorized !!';
        let tmp = await this.invite.getInvite(invite.id);
        if (!tmp)
            return 'no Invite to accepte';
        await this.invite.deleteInvite(invite.id);
        return this.friend.createFriend(new friend_dto_1.FriendDto(invite.invitationRecieverId, invite.invitationSenderId, ''), req.user.id);
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "check", null);
__decorate([
    (0, common_1.Post)('invite'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuth),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [invite_dto_1.InviteDto, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "SendInvitation", null);
__decorate([
    (0, common_1.Post)('createChannel'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuth),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [channel_dto_1.channelDto, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "createChannel", null);
__decorate([
    (0, common_1.Post)('ChannelAddUser'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuth),
    __param(0, (0, common_1.Body)('channelName')),
    __param(1, (0, common_1.Body)('username')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "addUserToChannel", null);
__decorate([
    (0, common_1.Delete)('removeUserFromChannel'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuth),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('username')),
    __param(2, (0, common_1.Body)('channelName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "removeUserFromChannel", null);
__decorate([
    (0, common_1.Put)('accepteInvite'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuth),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, invite_dto_1.InviteDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "accepteInvite", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.Controller)('Chat'),
    __metadata("design:paramtypes", [conversation_repository_1.converationRepositroy, users_repository_1.UsersRepository, invites_repository_1.InvitesRepository, friends_repository_1.FriendsRepository, chat_service_1.ChannelsService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map