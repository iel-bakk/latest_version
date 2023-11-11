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
exports.FriendsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const users_repository_1 = require("../users/users.repository");
let FriendsRepository = class FriendsRepository {
    constructor(prisma, user) {
        this.prisma = prisma;
        this.user = user;
    }
    async createFriend(data, _id) {
        let friends = await this.prisma.friend.findMany({
            where: {
                OR: [
                    { inviteRecieverId: _id },
                    { inviteSenderId: _id },
                ],
            },
        });
        let check = false;
        friends.forEach((friend) => {
            if (friend.inviteRecieverId == data.inviteRecieverId && friend.inviteSenderId == data.inviteSenderId)
                check = true;
        });
        let tmp;
        if (!check)
            tmp = this.prisma.friend.create({ data });
        else
            tmp = undefined;
        let user = (await this.prisma.user.findFirst({ where: { id: _id } })).achievements;
        if (friends.length > 0)
            if (!user.includes('add your first friend'))
                this.user.updateAcheivement('add your first friend', _id);
        if (friends.length > 9)
            if (!user.includes('get 10 friends'))
                this.user.updateAcheivement('get 10 friends', _id);
        return tmp;
    }
    async getFriends(_id) {
        const data = await this.prisma.friend.findMany({ where: { id: _id } });
        return data;
    }
    async updateFriend(id, data) {
        return await this.prisma.friend.update({
            where: { id },
            data: {
                latestMessage: data.latestMessage
            }
        });
    }
    async deleteFriend(id) {
        await this.prisma.friend.delete({ where: { id } });
        return `Deleted : ${id}`;
    }
};
exports.FriendsRepository = FriendsRepository;
exports.FriendsRepository = FriendsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, users_repository_1.UsersRepository])
], FriendsRepository);
//# sourceMappingURL=friends.repository.js.map