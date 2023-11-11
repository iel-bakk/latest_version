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
            return await this.prisma.channel.create({ data: {
                    name: channelData.name,
                    admins: tmp,
                    users: tmp,
                } });
        }
        catch (error) {
            console.log('error');
        }
    }
    async addUserToChannel(userId, channelId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        const channel = await this.prisma.channel.findUnique({ where: { id: channelId } });
        let tmp = channel.users;
        if (!tmp.includes(userId) && !channel.bannedUsers.includes(userId))
            tmp.push(userId);
        if (user && channel) {
            await this.prisma.user.update({
                where: { id: userId },
                data: { channels: tmp },
            });
            await this.prisma.channel.update({
                where: { id: channelId },
                data: { users: tmp },
            });
        }
    }
    async removeUserFromChannel(userId, channelId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        const channel = await this.prisma.channel.findUnique({ where: { id: channelId } });
        if (user && channel && channel.users.includes(userId)) {
            if (user.channels.includes(channelId) && channel.users.includes(userId)) {
                user.channels = user.channels.map((channel) => {
                    if (channel != channelId)
                        return channel;
                });
                channel.users.map((user) => {
                    if (user != userId)
                        return user;
                });
                await this.prisma.user.update({
                    where: { id: userId },
                    data: { channels: user.channels },
                });
                await this.prisma.channel.update({
                    where: { id: channelId },
                    data: { users: channel.users },
                });
            }
        }
    }
    async banUserFromChannel(userId, channelId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        const channel = await this.prisma.channel.findUnique({ where: { id: channelId } });
        if (user && channel && channel.users.includes(userId)) {
            await this.removeUserFromChannel(userId, channelId);
            channel.bannedUsers.push(userId);
            await this.prisma.channel.update({
                where: { id: channelId },
                data: { bannedUsers: channel.bannedUsers }
            });
        }
    }
};
exports.ChannelsService = ChannelsService;
exports.ChannelsService = ChannelsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChannelsService);
//# sourceMappingURL=chat.service.js.map