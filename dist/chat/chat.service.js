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
        try {
            console.log(channelData);
            let check = await this.getChannelByName(channelData.name);
            let tmpUser = await this.prisma.user.findUnique({ where: { id: id } });
            if (check || !tmpUser)
                return;
            let channel = await this.prisma.channel.create({ data: {
                    name: channelData.name,
                    admins: tmp,
                    users: tmp,
                } });
            tmpUser.channels.push(channel.id);
            await this.prisma.user.update({
                where: { id: id },
                data: { channels: tmpUser.channels },
            });
            return channel;
        }
        catch (error) {
            console.log('error');
        }
    }
    async addUserToChannel(userId, channelId) {
        try {
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            const channel = await this.prisma.channel.findUnique({ where: { id: channelId } });
            let tmp = [];
            let userChannels = [];
            if (user && channel && !tmp.includes(userId) && !channel.bannedUsers.includes(userId)) {
                tmp = channel.users;
                userChannels = user.channels;
                userChannels.push(channelId);
                tmp.push(userId);
                await this.prisma.user.update({
                    where: { id: userId },
                    data: { channels: userChannels },
                });
                await this.prisma.channel.update({
                    where: { id: channelId },
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
        if (user && channel) {
            console.log("testing");
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
    async getChannelByName(channelName) {
        return await this.prisma.channel.findFirst({ where: { name: channelName } });
    }
};
exports.ChannelsService = ChannelsService;
exports.ChannelsService = ChannelsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChannelsService);
//# sourceMappingURL=chat.service.js.map