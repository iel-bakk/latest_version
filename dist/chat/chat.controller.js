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
const channel_params_dto_1 = require("../DTOs/channel/channel.params.dto");
const conversation_dto_1 = require("../DTOs/chat/conversation.dto");
const message_repository_1 = require("../modules/message/message.repository");
let ChatController = class ChatController {
    constructor(conversation, user, invite, friend, channel, message) {
        this.conversation = conversation;
        this.user = user;
        this.invite = invite;
        this.friend = friend;
        this.channel = channel;
        this.message = message;
    }
    async getUserMessages(req) {
        let _user = await this.user.getUserById(req.user.id);
        let frontData = [];
        let conversationsFront = [];
        if (_user) {
            let conversations = await this.conversation.getConversations(req.user.id);
            if (conversations) {
                console.log(conversations);
                conversations.forEach(async (conv) => {
                    let sender = await this.user.getUserById(conv.senderId);
                    let reciever = await this.user.getUserById(conv.recieverId);
                    if (sender && reciever) {
                        console.log(`sender =====> `, sender, `reciever =====> `, reciever);
                        let _mesasges = await this.message.getMessages(conv.id);
                        console.log('messages ******** ', _mesasges, "fafdfadfadff : ", conv);
                        let tmp = new conversation_dto_1.conversationToFront;
                        if (sender.id = req.user.id) {
                            tmp.username = sender.username;
                            tmp.avatar = sender.avatar;
                            if (_mesasges && _mesasges[0] && _mesasges[0].content)
                                tmp.lastMesasge = _mesasges[0].content;
                            else
                                tmp.lastMesasge = '';
                        }
                        else {
                            tmp.username = reciever.username;
                            tmp.avatar = reciever.avatar;
                            tmp.lastMesasge = '';
                            if (_mesasges && _mesasges[0] && _mesasges[0].content)
                                tmp.lastMesasge = _mesasges[0].content;
                            else
                                tmp.lastMesasge = '';
                        }
                        console.log(tmp);
                        conversationsFront.push(tmp);
                    }
                });
                console.log(conversationsFront);
                conversationsFront.forEach((conv) => {
                });
            }
            return conversationsFront;
        }
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
        console.log(channelData);
        if ((channelData.IsPrivate && channelData.IsProtected) || (channelData.IsPrivate && channelData.password.length))
            return `can't have private channel with password.`;
        if (channelData.IsProtected && channelData.password.length == 0)
            return `can't have empty passwords on protected chat rooms`;
        if (!channelData.IsProtected && channelData.password.length)
            return `can't set password to none protected chat rooms`;
        let test = await this.channel.createChannel(channelData, req.user.id);
        console.log(test);
        return 'channel created succefuly';
    }
    async BanUser(req, username) {
        let userToBan = await this.user.getUserByUsername(username);
        let requester = await this.user.getUserById(req.user.id);
        if (userToBan && requester && !requester.bandUsers.includes(userToBan.id)) {
            return await this.channel.BanUser(req.user, userToBan);
        }
        else
            return `user dosen't exist in database .`;
    }
    async unBanUser(req, username) {
        let userTounBan = await this.user.getUserByUsername(username);
        let requester = await this.user.getUserById(req.user.id);
        if (userTounBan && requester && requester.bandUsers.includes(userTounBan.id)) {
            return await this.channel.unBanUser(req.user, userTounBan);
        }
        else
            return `user dosen't exist in database .`;
    }
    async addUserToChannel(channelName, username, req) {
        let channel = await this.channel.getChannelByName(channelName.name);
        let tmpUser = await this.user.getUserByUsername(username);
        if (tmpUser && channel) {
            channel.password = channelName.password;
            if (channel.IsPrivate && req.user.id == channel.owner) {
                await this.channel.addUserToChannel(tmpUser.id, channel);
            }
            else if (!channel.IsPrivate) {
                await this.channel.addUserToChannel(tmpUser.id, channel);
            }
        }
    }
    async removeUserFromChannel(req, data) {
        console.log(`username recieved from body : ${data.username}`);
        let tmpUser = await this.user.getUserByUsername(data.username);
        let tmpchannel = await this.channel.getChannelByName(data.channelName);
        console.log(`user to delete : `, tmpUser);
        console.log(`channel : `, tmpchannel);
        if (tmpUser && tmpchannel && tmpchannel.admins.includes(req.user.id) && tmpchannel.users.includes(tmpUser.id)) {
            if (tmpUser.id == tmpchannel.owner && req.user.id == tmpchannel.owner)
                await this.channel.removeUserFromChannel(tmpUser.id, tmpchannel.id);
            else if (tmpUser.id != tmpchannel.owner)
                await this.channel.removeUserFromChannel(tmpUser.id, tmpchannel.id);
            let check = await this.channel.getChannelByName(data.channelName);
            if (check && !check.users.length)
                await this.channel.deleteChannel(check.id);
            console.log(check.users);
        }
    }
    async banUserFromChannel(req, data) {
        let channelTmp = await this.channel.getChannelByName(data.channelName);
        let userTmp = await this.user.getUserByUsername(data.username);
        if (channelTmp && userTmp && channelTmp.admins.includes(req.user.id)) {
            if (userTmp.id == channelTmp.owner && userTmp.id == req.user.id)
                await this.channel.banUserFromChannel(data.username, data.channelName);
            else if (userTmp.id != channelTmp.owner)
                await this.channel.banUserFromChannel(data.username, data.channelName);
        }
    }
    async unBanUserFromChannel(req, data) {
        let channelTmp = await this.channel.getChannelByName(data.channelName);
        let userTmp = await this.user.getUserByUsername(data.username);
        if (channelTmp && userTmp && channelTmp.admins.includes(req.user.id) && channelTmp.bannedUsers.includes(userTmp.id)) {
            await this.channel.unBanUserFromChannel(data.username, data.channelName);
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
    async addAdminToChannel(req, data) {
        let _user = await this.user.getUserByUsername(data.username);
        if (_user)
            await this.channel.assignAdminToChannel(_user, data.channelName);
    }
    async removeAdminFromChannel(req, data) {
        let channel = await this.channel.getChannelByName(data.channelName);
        let userTmp = await this.user.getUserByUsername(data.username);
        if (userTmp && channel && channel.admins.includes(req.user.id)) {
            if (channel.owner == userTmp.id && req.user.id == channel.owner)
                await this.channel.removeAdminPrivilageToUser(data.username, data.channelName);
            else if (channel.owner != userTmp.id)
                await this.channel.removeAdminPrivilageToUser(data.username, data.channelName);
        }
    }
    async addPasswordToChannel(channleData, req) {
        let channel = await this.channel.getChannelByName(channleData.name);
        if (channel && channel.owner == req.user.id) {
            await this.channel.setPasswordToChannel(channleData.password, channleData.name);
        }
    }
    async removePasswordToChannel(data, req) {
        let channel = await this.channel.getChannelByName(data.channelName);
        if (channel && channel.owner == req.user.id) {
            await this.channel.unsetPasswordToChannel(data.channelName);
        }
    }
    async getChannelMessages(data, req) {
        let check_channel = await this.channel.getChannelByName(data.channelName);
        if (check_channel && check_channel.users.includes(req.user.id))
            return await this.channel.getChannelMessages(data.channelName);
        return null;
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuth),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getUserMessages", null);
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
    (0, common_1.Post)('BanUser'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuth),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "BanUser", null);
__decorate([
    (0, common_1.Post)('unBanUser'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuth),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "unBanUser", null);
__decorate([
    (0, common_1.Post)('ChannelAddUser'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuth),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Body)('username')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [channel_dto_1.channelDto, String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "addUserToChannel", null);
__decorate([
    (0, common_1.Delete)('removeUserFromChannel'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuth),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, channel_params_dto_1.channelParams]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "removeUserFromChannel", null);
__decorate([
    (0, common_1.Post)('BanUserFromChannel'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuth),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, channel_params_dto_1.channelParams]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "banUserFromChannel", null);
__decorate([
    (0, common_1.Post)('unBanUserFromChannel'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuth),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, channel_params_dto_1.channelParams]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "unBanUserFromChannel", null);
__decorate([
    (0, common_1.Put)('accepteInvite'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuth),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, invite_dto_1.InviteDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "accepteInvite", null);
__decorate([
    (0, common_1.Post)('addAdminToChannel'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuth),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, channel_params_dto_1.channelParams]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "addAdminToChannel", null);
__decorate([
    (0, common_1.Post)('removeAdminToChannel'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuth),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, channel_params_dto_1.channelParams]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "removeAdminFromChannel", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuth),
    (0, common_1.Post)('addPasswordToChannel'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [channel_dto_1.channelDto, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "addPasswordToChannel", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuth),
    (0, common_1.Post)('removePasswordToChannel'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [channel_params_dto_1.channelParams, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "removePasswordToChannel", null);
__decorate([
    (0, common_1.Post)('getChannelMessages'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuth),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [channel_params_dto_1.channelParams, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getChannelMessages", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.Controller)('Chat'),
    __metadata("design:paramtypes", [conversation_repository_1.converationRepositroy,
        users_repository_1.UsersRepository,
        invites_repository_1.InvitesRepository,
        friends_repository_1.FriendsRepository,
        chat_service_1.ChannelsService,
        message_repository_1.messageRepository])
], ChatController);
//# sourceMappingURL=chat.controller.js.map