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
exports.InvitesRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let InvitesRepository = class InvitesRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createInvite(data) {
        let friends = await this.prisma.friend.findMany({ where: {
                OR: [
                    {
                        inviteRecieverId: data.invitationRecieverId,
                        inviteSenderId: data.invitationSenderId,
                    },
                    {
                        inviteSenderId: data.invitationRecieverId,
                        inviteRecieverId: data.invitationSenderId,
                    }
                ]
            } });
        let invites = await this.prisma.invitation.findMany({ where: {
                OR: [
                    {
                        invitationRecieverId: data.invitationRecieverId,
                        invitationSenderId: data.invitationSenderId,
                    },
                    {
                        invitationSenderId: data.invitationRecieverId,
                        invitationRecieverId: data.invitationSenderId,
                    }
                ]
            } });
        console.log(friends);
        if (invites.length || friends.length)
            return null;
        return await this.prisma.invitation.create({ data });
    }
    async getInvite(id) {
        return await this.prisma.invitation.findUnique({ where: { id: id } });
    }
    async deleteInvite(_id) {
        console.log(`the id is : ${_id}`);
        await this.prisma.invitation.delete({ where: { id: _id } });
        return "Deleted";
    }
};
exports.InvitesRepository = InvitesRepository;
exports.InvitesRepository = InvitesRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InvitesRepository);
//# sourceMappingURL=invites.repository.js.map