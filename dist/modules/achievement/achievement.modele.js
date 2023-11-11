"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.achievementModule = void 0;
const common_1 = require("@nestjs/common");
let achievementModule = class achievementModule {
    getAchievement() {
        const achievements = [
            {
                title: 'win first game',
                unlocked: false,
                icon: 'firstGame.png',
            },
            {
                title: 'add your first friend',
                unlocked: false,
                icon: 'firstFriend.png',
            },
            {
                title: 'win with a clean score',
                unlocked: false,
                icon: 'cleanScore.png',
            },
            {
                title: 'win 3 games',
                unlocked: false,
                icon: 'threeGamesWin.png',
            },
            {
                title: 'reach level 10',
                unlocked: false,
                icon: 'levelTen.png',
            },
            {
                title: 'get 10 friends',
                unlocked: false,
                icon: 'tenFriends.png',
            },
            {
                title: 'send your first message',
                unlocked: false,
                icon: 'firstMessage.png',
            },
            {
                title: 'join your first channel',
                unlocked: false,
                icon: 'firstChannel.png',
            },
            {
                title: 'creat your first channel',
                unlocked: false,
                icon: 'firstChannel.png',
            },
            {
                title: 'customize your avatar',
                unlocked: false,
                icon: 'newAvatar.png',
            },
            {
                title: '3 games strick',
                unlocked: false,
                icon: 'threeGamesStrick.png',
            },
            {
                title: 'win 10 games',
                unlocked: false,
                icon: 'tenGamesWin.png',
            },
        ];
        return achievements;
    }
};
exports.achievementModule = achievementModule;
exports.achievementModule = achievementModule = __decorate([
    (0, common_1.Injectable)()
], achievementModule);
//# sourceMappingURL=achievement.modele.js.map