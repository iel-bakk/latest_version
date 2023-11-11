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
exports.UsersRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const process_1 = require("process");
let UsersRepository = class UsersRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createUser(params) {
        const { data } = params;
        return await this.prisma.user.create({ data });
    }
    async getUserById(playerId) {
        console.log(`playerId : ${playerId}`);
        const data = await this.prisma.user.findFirst({ where: {
                id: playerId,
            } });
        if (!data)
            return null;
        return data;
    }
    async getUserByUsername(username) {
        console.log(`username : ${username}`);
        const data = await this.prisma.user.findFirst({ where: {
                username: username,
            } });
        if (!data)
            return null;
        return data;
    }
    async updateAvatar(id, _avatar) {
        return await this.prisma.user.update({
            where: { id },
            data: {
                avatar: _avatar,
            }
        });
    }
    async updateUsername(id, _username) {
        return await this.prisma.user.update({ where: { id },
            data: {
                username: _username,
            } });
    }
    async updateAcheivement(_title, id) {
        let userAchievements = await (await this.prisma.user.findUnique({ where: { id } })).achievements;
        let found = false;
        userAchievements.forEach((achievement) => {
            if (achievement == process_1.title)
                found = true;
        });
        if (!found)
            userAchievements.push(_title);
        return await this.prisma.user.update({ where: { id },
            data: {
                achievements: userAchievements,
            } });
    }
    async deleteUser(id) {
        await this.prisma.user.delete({ where: { id } });
        return "deleted";
    }
};
exports.UsersRepository = UsersRepository;
exports.UsersRepository = UsersRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersRepository);
//# sourceMappingURL=users.repository.js.map