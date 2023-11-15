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
exports.converationRepositroy = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let converationRepositroy = class converationRepositroy {
    constructor(Prisma) {
        this.Prisma = Prisma;
    }
    async createConversation(_recieverId, _senderId) {
        return await this.Prisma.conversation.create({ data: {
                recieverId: _recieverId,
                senderId: _senderId,
            } });
    }
    async numberOfConversations(_id) {
        let count = await this.Prisma.conversation.findMany({ where: {
                OR: [
                    {
                        senderId: _id,
                    },
                    {
                        recieverId: _id,
                    }
                ]
            } });
        return count.length;
    }
    async getConversations(_id) {
        let count = await this.Prisma.conversation.findMany({ where: {
                OR: [
                    {
                        senderId: _id,
                    },
                    {
                        recieverId: _id,
                    }
                ]
            } });
        return count;
    }
    async findConversations(_recieverId, _senderId) {
        return await this.Prisma.conversation.findFirst({ where: {
                OR: [
                    { senderId: _senderId,
                        recieverId: _recieverId
                    },
                    {
                        recieverId: _senderId,
                        senderId: _recieverId
                    }
                ]
            } });
    }
    async deleteConversation(conversationData) {
        await this.Prisma.conversation.delete({ where: { id: conversationData.id, } });
        return "deleted";
    }
};
exports.converationRepositroy = converationRepositroy;
exports.converationRepositroy = converationRepositroy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], converationRepositroy);
//# sourceMappingURL=conversation.repository.js.map