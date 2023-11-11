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
exports.MatchesRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const users_repository_1 = require("../users/users.repository");
let MatchesRepository = class MatchesRepository {
    constructor(prisma, user) {
        this.prisma = prisma;
        this.user = user;
    }
    async CreateMatch(playerA, playerB, _playerAScore, _playerBScore) {
        try {
            return await this.prisma.match.create({ data: {
                    playerAId: playerA.id,
                    playerBId: playerB.id,
                    playerAScore: _playerAScore,
                    playerBScore: _playerBScore,
                } });
        }
        catch (error) {
            console.log("error creating game");
        }
    }
    async GetMatches() {
        return await this.prisma.match.findMany();
    }
    async findMatchesByUserId(id) {
        console.log(id);
        return await this.prisma.match.findMany({
            where: {
                OR: [
                    { playerAId: id },
                    { playerBId: id },
                ],
            },
        });
    }
    async CheckForGamesAchievements(matches, _id) {
        let user = await this.prisma.user.findUnique({ where: { id: _id } });
        console.log(user);
        if (matches.length > 0) {
            if (!user.achievements.includes("play your first game"))
                this.user.updateAcheivement("play your first game", _id);
        }
        if (matches.length > 2) {
            if (!user.achievements.includes("play 3 games"))
                this.user.updateAcheivement("play 3 games", _id);
        }
        if (matches.length > 9) {
            if (!user.achievements.includes("play 10 games"))
                this.user.updateAcheivement("play 10 games", _id);
        }
        if (matches.length > 99) {
            if (!user.achievements.includes("play 100 games"))
                this.user.updateAcheivement("play 100 games", _id);
        }
        matches.forEach((match) => {
            if (!user.achievements.includes("win a game")) {
                if (match.playerAId == _id) {
                    if (match.playerAScore > match.playerBScore)
                        this.user.updateAcheivement("win a game", _id);
                }
                else {
                    if (match.playerAScore < match.playerBScore)
                        this.user.updateAcheivement("win a game", _id);
                }
            }
        });
        return;
    }
};
exports.MatchesRepository = MatchesRepository;
exports.MatchesRepository = MatchesRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, users_repository_1.UsersRepository])
], MatchesRepository);
//# sourceMappingURL=matches.repository.js.map