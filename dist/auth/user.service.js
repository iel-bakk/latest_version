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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../modules/database/prisma.service");
let UserService = class UserService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async getallUsers() {
        return await this.prisma.user.findMany();
    }
    async getUser(id) {
        return await this.prisma.user.findUnique({ where: { id: id } });
    }
    async getgoogleUser(id) {
        return await this.prisma.user.findUnique({ where: { email: id } });
    }
    async createUser(data) {
        try {
            if (data.id)
                var user = await this.getUser(data.id);
            else
                var user = await this.getgoogleUser(data.email);
            if (!user)
                user = await this.prisma.user.create({ data });
            return user;
        }
        catch (error) {
            throw error;
        }
    }
    async updateUser(id, data) {
        return await this.prisma.user.update({
            where: { id: id },
            data: {
                email: data.email
            }
        });
    }
    async deleteUser(id) {
        return await this.prisma.user.delete({
            where: { id: id }
        });
    }
    async sign(id, username) {
        try {
            var user = await this.getUser(id);
            if (user.id != id)
                return;
            const payload = { sub: user.id, username: user.username };
            const token = await this.jwtService.signAsync(payload);
            return token;
        }
        catch (error) {
            throw new common_1.UnauthorizedException();
        }
    }
    async set2FaScret(secret, id) {
        return await this.prisma.user.update({
            where: { id: id },
            data: { TwoFASecret: secret,
                IsEnabled: true }
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, jwt_1.JwtService])
], UserService);
//# sourceMappingURL=user.service.js.map