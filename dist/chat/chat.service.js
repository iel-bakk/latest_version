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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../modules/database/prisma.service");
let ChannelsService = class ChannelsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createChannel(channelData, id) {
        console.log(`the users id ${id}`);
        let tmp = [id];
        let check = await this.getChannelByName(channelData.name);
        let tmpUser = await this.prisma.user.findUnique({ where: { id: id } });
        if (check || !tmpUser)
            return;
        console.log(channelData);
        let channel = await this.prisma.channel.create({ data: {
                name: channelData.name,
                admins: tmp,
                users: tmp,
                owner: tmpUser.id,
                IsPrivate: channelData.IsPrivate,
                IsProtected: channelData.IsProtected,
                password: channelData.password
            } });
        tmpUser.channels.push(channel.id);
        await this.prisma.user.update({
            where: { id: id },
            data: { channels: tmpUser.channels },
        });
        return channel;
    }
    async addUserToChannel(userId, _channel) {
        try {
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            const channel = await this.prisma.channel.findUnique({ where: { id: _channel.id } });
            let tmp = [];
            let userChannels = [];
            if (user && channel && !tmp.includes(userId) && !channel.bannedUsers.includes(userId)) {
                if (channel.IsProtected && channel.password != _channel.password)
                    return;
                tmp = channel.users;
                userChannels = user.channels;
                userChannels.push(_channel.id);
                tmp.push(userId);
                await this.prisma.user.update({
                    where: { id: userId },
                    data: { channels: userChannels },
                });
                await this.prisma.channel.update({
                    where: { id: _channel.id },
                    data: { users: tmp },
                });
            }
        }
        catch (error) {
            console.log(`no such user or channel`);
        }
    }
    async removeUserFromChannel(userId, channelId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        const channel = await this.prisma.channel.findUnique({ where: { id: channelId } });
        let tmpUser = [];
        let tmpChannel = [];
        let adminChannel = [];
        if (user && channel && channel.users.includes(userId)) {
            for (let index = 0; index < user.channels.length; index++) {
                console.log(index);
                if (user.channels[index] != channelId)
                    tmpUser.push(user.channels[index]);
            }
            for (let index = 0; index < channel.users.length; index++) {
                console.log(index);
                if (channel.users[index] != userId)
                    tmpChannel.push(channel.users[index]);
            }
            if (channel.admins.includes(userId)) {
                for (let index = 0; index < channel.admins.length; index++) {
                    if (channel.admins[index] != userId)
                        adminChannel.push(channel.admins[index]);
                }
                if (adminChannel.length == 0)
                    adminChannel = [];
                await this.prisma.channel.update({
                    where: { id: channelId },
                    data: { admins: adminChannel },
                });
            }
            console.log(tmpUser);
            console.log(tmpChannel);
            if (tmpUser.length == 0)
                tmpUser = [];
            if (tmpChannel.length == 0)
                tmpChannel = [];
            await this.prisma.user.update({
                where: { id: userId },
                data: { channels: tmpUser },
            });
            await this.prisma.channel.update({
                where: { id: channelId },
                data: { users: tmpChannel },
            });
        }
    }
    async banUserFromChannel(username, channelName) {
        const user = await this.prisma.user.findFirst({ where: { username: username } });
        const channel = await this.prisma.channel.findUnique({ where: { name: channelName } });
        let Ban;
        console.log(channel);
        if (user && channel && !channel.bannedUsers.includes(user.id)) {
            Ban = channel.bannedUsers;
            await this.removeUserFromChannel(user.id, channel.id);
            Ban.push(user.id);
            console.log(Ban);
            await this.prisma.channel.update({
                where: { id: channel.id },
                data: { bannedUsers: Ban }
            });
        }
    }
    async unBanUserFromChannel(username, channelName) {
        let user = await this.prisma.user.findFirst({ where: { username: username } });
        let channel = await this.prisma.channel.findUnique({ where: { name: channelName } });
        let tmp = [];
        if (user && channel) {
            if (channel.bannedUsers.includes(user.id)) {
                for (let index = 0; index < channel.bannedUsers.length; index++) {
                    if (user.id != channel.bannedUsers[index])
                        tmp.push(channel.bannedUsers[index]);
                }
                console.log(tmp);
                await this.prisma.channel.update({ where: { id: channel.id },
                    data: { bannedUsers: tmp } });
            }
            await this.addUserToChannel(user.id, channel);
        }
    }
    async getChannelByName(channelName) {
        return await this.prisma.channel.findFirst({ where: { name: channelName } });
    }
    async assignAdminToChannel(userName, channelName) {
        const user = await this.prisma.user.findFirst({ where: { username: userName } });
        const channel = await this.prisma.channel.findUnique({ where: { name: channelName } });
        if (user && channel && channel.users.includes(user.id) && !channel.admins.includes(user.id)) {
            console.log('ghehehe');
            channel.admins.push(user.id);
            await this.prisma.channel.update({ where: { id: channel.id },
                data: {
                    admins: channel.admins,
                } });
        }
    }
    async removeAdminPrivilageToUser(username, channelName) {
        let channel = await this.getChannelByName(channelName);
        let user = await this.prisma.user.findFirst({ where: { username: username } });
        let tmp = [];
        if (user && channel) {
            if (channel.admins.includes(user.id) && user.id != channel.owner) {
                for (let index = 0; index < channel.admins.length; index++) {
                    if (user.id != channel.admins[index])
                        tmp.push(channel.admins[index]);
                }
                await this.prisma.channel.update({ where: { id: channel.id },
                    data: { admins: tmp } });
            }
        }
    }
    async deleteChannel(channelId) {
        await this.prisma.channel.delete({ where: { id: channelId } });
    }
};
exports.ChannelsService = ChannelsService;
exports.ChannelsService = ChannelsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChannelsService);
//# sourceMappingURL=chat.service.js.map