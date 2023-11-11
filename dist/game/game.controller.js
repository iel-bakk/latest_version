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
exports.GameController = void 0;
const common_1 = require("@nestjs/common");
const match_dto_1 = require("../DTOs/Match/match.dto");
const matches_repository_1 = require("../modules/matches/matches.repository");
const users_repository_1 = require("../modules/users/users.repository");
let GameController = class GameController {
    constructor(user, games) {
        this.user = user;
        this.games = games;
    }
    async greetplayer() {
        let matches = await this.games.findMatchesByUserId('98861');
        return await this.games.CheckForGamesAchievements(matches, '98861');
    }
    async CreateGame(data) {
        const playerA = await this.user.getUserById(data.playerAId);
        const playerB = await this.user.getUserById(data.playerBId);
        return await this.games.CreateMatch(playerA, playerB, data.playerAScore, data.playerBScore);
    }
};
exports.GameController = GameController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GameController.prototype, "greetplayer", null);
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [match_dto_1.MatchDto]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "CreateGame", null);
exports.GameController = GameController = __decorate([
    (0, common_1.Controller)('Game'),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository, matches_repository_1.MatchesRepository])
], GameController);
//# sourceMappingURL=game.controller.js.map